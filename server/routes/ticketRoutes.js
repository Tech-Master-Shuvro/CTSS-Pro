const express = require('express');
const router = express.Router();
const {
  getTickets,
  createTicket,
  getTicketById,
  addMessage,
  updateTicketStatus
} = require('../controllers/ticketController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/').get(getTickets).post(createTicket);
router.route('/:id').get(getTicketById);
router.route('/:id/messages').post(addMessage);
router.route('/:id/status').patch(updateTicketStatus);

module.exports = router;

