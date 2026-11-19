const express = require('express');
const router = express.Router();
const {
  getMetrics,
  assignTicket,
  updatePriority,
  addInternalNote,
  getUsers,
  getAgents
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/metrics', getMetrics);
router.get('/users', getUsers);
router.get('/agents', getAgents);
router.patch('/tickets/:id/assign', assignTicket);
router.patch('/tickets/:id/priority', updatePriority);
router.post('/tickets/:id/notes', addInternalNote);

module.exports = router;

