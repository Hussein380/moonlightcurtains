import express from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

// Get all requests
router.get('/', async (req, res) => {
  try {
    const requests = await prisma.customRequest.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new custom request (from customer form)
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const request = await prisma.customRequest.create({
      data: {
        customerName: data.customerName,
        phoneNumber: data.phoneNumber,
        email: data.email || null,
        windowWidth: parseFloat(data.windowWidth),
        windowHeight: parseFloat(data.windowHeight),
        roomType: data.roomType,
        photos: data.photos || [],
        notes: data.notes || null,
        status: "New",
      }
    });
    res.status(201).json(request);
  } catch (error) {
    console.error('POST /requests error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update request status (Protected — admin only)
router.patch('/:id/status', requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const request = await prisma.customRequest.update({
      where: { id: req.params.id as string },
      data: { status }
    });
    res.json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
