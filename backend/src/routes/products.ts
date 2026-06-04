import express from 'express';
import { prisma } from '../lib/prisma';
import { redisGet, redisSet, clearProductCaches } from '../lib/redis';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

// Get all products (with optional filtering)
router.get('/', async (req, res) => {
  try {
    const { search, color, roomType } = req.query;
    
    const whereClause: any = {};
    if (search) {
      whereClause.name = { contains: String(search), mode: 'insensitive' };
    }
    if (color && color !== 'All') {
      whereClause.colors = { has: String(color) };
    }
    if (roomType && roomType !== 'All') {
      whereClause.roomType = String(roomType);
    }

    // Generate a unique cache key based on filters
    const cacheKey = `store:products:search=${search || ''}:color=${color || ''}:roomType=${roomType || ''}`;
    const cached = await redisGet(cacheKey);
    
    if (cached) {
      const parsed = JSON.parse(cached);
      res.json(Array.isArray(parsed) ? parsed : []);
      return;
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: { category: true }
    });

    await redisSet(cacheKey, 300, JSON.stringify(products));
    res.json(products);
  } catch (error) {
    console.error('GET /products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create product (Protected)
router.post('/', requireAuth, async (req, res) => {
  try {
    const data = req.body;
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    let defaultCategory = await prisma.category.findFirst();
    if (!defaultCategory) {
      defaultCategory = await prisma.category.create({
        data: { name: "General", slug: "general" }
      });
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        shortDescription: data.description || "Beautiful curtain fabric.",
        description: data.description || "Detailed description...",
        categoryId: defaultCategory.id,
        fabricType: "Mixed",
        roomType: data.roomType || "Living Room",
        headerStyles: [data.headerStyle],
        lightControl: data.lightControl,
        pricePerMeter: parseFloat(data.pricePerMeter),
        retailPrice: data.retailPrice ? parseFloat(data.retailPrice) : null,
        highDemand: data.highDemand === true,
        images: data.images.map((url: string) => ({ url, alt: data.name })),
        colors: data.colors && data.colors.length > 0 ? data.colors : [],
        qualities: [],
        specifications: { material: "Mixed" },
        available: true,
      }
    });

    // Clear all product caches
    // Clear all product caches
    await clearProductCaches();
    res.status(201).json(product);
  } catch (error) {
    console.error('POST /products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update product — must come BEFORE /:slug (Protected)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const data = req.body;

    const product = await prisma.product.update({
      where: { id: req.params.id as string },
      data: {
        name: data.name,
        shortDescription: data.description || "Beautiful curtain fabric.",
        description: data.description || "Detailed description...",
        roomType: data.roomType,
        headerStyles: [data.headerStyle],
        lightControl: data.lightControl,
        pricePerMeter: parseFloat(data.pricePerMeter),
        retailPrice: data.retailPrice ? parseFloat(data.retailPrice) : null,
        highDemand: data.highDemand === true,
        colors: data.colors && data.colors.length > 0 ? data.colors : [],
        images: data.images.map((url: string) => ({ url, alt: data.name })),
      }
    });

    // Clear all product caches
    await clearProductCaches();
    
    res.json(product);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Product not found' });
    }
    console.error('PUT /products/:id error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete product — must come BEFORE /:slug (Protected)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id as string } });
    
    // Clear all product caches
    await clearProductCaches();
    
    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') {
      // Record already doesn't exist, which is fine for a delete operation
      return res.status(204).send();
    }
    console.error('DELETE /products/:id error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get product by slug — LAST because /:slug is a wildcard catch-all
router.get('/:slug', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug as string },
      include: { category: true }
    });

    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error('GET /products/:slug error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
