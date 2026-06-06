import express from 'express';
import { prisma } from '../lib/prisma';
import { redisGet, redisSet, redisDel } from '../lib/redis';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(orders);
  } catch (error) {
    console.error('GET /orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new order
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    let calculatedSubtotal = 0;
    const items = data.items || [];
    items.forEach((item: any) => {
      calculatedSubtotal += (Number(item.pricePerMeter) * Number(item.meters));
    });

    const orderNumber = `MSF-${Math.floor(10000 + Math.random() * 90000)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: data.customerName,
        phoneNumber: data.phoneNumber,
        email: data.email || null,
        county: data.county,
        town: data.town,
        address: data.address,
        notes: data.notes || null,
        items,
        subtotal: calculatedSubtotal,
        status: "New"
      }
    });

    await redisDel('admin:stats');
    res.status(201).json(order);
  } catch (error) {
    console.error('POST /orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update order status (Protected — admin only)
router.patch('/:id/status', requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status }
    });
    await redisDel('admin:stats');
    res.json(order);
  } catch (error) {
    console.error('PATCH /orders/:id/status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete order (Protected — admin only)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await prisma.order.delete({ where: { id: req.params.id } });
    await redisDel('admin:stats');
    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') return res.status(204).send();
    console.error('DELETE /orders/:id error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get dashboard stats — must come BEFORE /:id routes
router.get('/stats', async (req, res) => {
  try {
    const cached = await redisGet('admin:stats');
    if (cached) {
      res.json(JSON.parse(cached));
      return;
    }

    const totalOrders = await prisma.order.count();
    const orders = await prisma.order.findMany({ select: { subtotal: true } });
    const totalRevenue = orders.reduce((acc, o) => acc + o.subtotal, 0);
    const pendingRequests = await prisma.customRequest.count({ where: { status: 'New' } });
    const recentActivity = await prisma.order.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: { customerName: true, subtotal: true, createdAt: true }
    });

    const statsData = { totalOrders, totalRevenue, pendingRequests, recentActivity };
    await redisSet('admin:stats', 60, JSON.stringify(statsData));
    res.json(statsData);
  } catch (error) {
    console.error('GET /orders/stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
