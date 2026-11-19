const Ticket = require('../models/Ticket');
const User = require('../models/User');

const getMetrics = async (req, res, next) => {
  try {
    const totalTickets = await Ticket.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: 'Open' });
    const inProgressTickets = await Ticket.countDocuments({ status: 'In Progress' });
    const resolvedTickets = await Ticket.countDocuments({ status: 'Resolved' });
    const closedTickets = await Ticket.countDocuments({ status: 'Closed' });
    const urgentTickets = await Ticket.countDocuments({ priority: 'Urgent', status: { $ne: 'Closed' } });
    const unassignedTickets = await Ticket.countDocuments({ assignedTo: null, status: { $ne: 'Closed' } });
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    const categoryStats = await Ticket.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const priorityStats = await Ticket.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    const recentTickets = await Ticket.find()
      .populate('customer', 'name email avatar')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalTickets,
          openTickets,
          inProgressTickets,
          resolvedTickets,
          closedTickets,
          urgentTickets,
          unassignedTickets,
          totalCustomers
        },
        categoryStats,
        priorityStats,
        recentTickets
      }
    });
  } catch (error) {
    next(error);
  }
};

const assignTicket = async (req, res, next) => {
  try {
    const { assignedTo } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    if (assignedTo) {
      const agent = await User.findById(assignedTo);
      if (!agent || agent.role !== 'admin') {
        return res.status(400).json({
          success: false,
          message: 'Target user is not an administrator or agent'
        });
      }
      ticket.assignedTo = assignedTo;
      if (ticket.status === 'Open') {
        ticket.status = 'In Progress';
      }
    } else {
      ticket.assignedTo = null;
    }

    await ticket.save();

    const updatedTicket = await Ticket.findById(ticket._id)
      .populate('customer', 'name email avatar')
      .populate('assignedTo', 'name email department avatar')
      .populate('messages.sender', 'name email avatar role')
      .populate('internalNotes.author', 'name email avatar department');

    res.status(200).json({
      success: true,
      data: updatedTicket
    });
  } catch (error) {
    next(error);
  }
};

const updatePriority = async (req, res, next) => {
  try {
    const { priority } = req.body;
    const validPriorities = ['Low', 'Medium', 'High', 'Urgent'];

    if (!priority || !validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid priority value provided'
      });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    ticket.priority = priority;
    await ticket.save();

    const updatedTicket = await Ticket.findById(ticket._id)
      .populate('customer', 'name email avatar')
      .populate('assignedTo', 'name email department avatar')
      .populate('messages.sender', 'name email avatar role')
      .populate('internalNotes.author', 'name email avatar department');

    res.status(200).json({
      success: true,
      data: updatedTicket
    });
  } catch (error) {
    next(error);
  }
};

const addInternalNote = async (req, res, next) => {
  try {
    const { note } = req.body;

    if (!note || !note.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Internal note cannot be empty'
      });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    ticket.internalNotes.push({
      author: req.user._id,
      authorName: req.user.name,
      note: note.trim()
    });

    await ticket.save();

    const updatedTicket = await Ticket.findById(ticket._id)
      .populate('customer', 'name email avatar')
      .populate('assignedTo', 'name email department avatar')
      .populate('messages.sender', 'name email avatar role')
      .populate('internalNotes.author', 'name email avatar department');

    res.status(200).json({
      success: true,
      data: updatedTicket
    });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const ticketCount = await Ticket.countDocuments(
          u.role === 'customer' ? { customer: u._id } : { assignedTo: u._id }
        );
        return {
          ...u.toObject(),
          ticketCount
        };
      })
    );

    res.status(200).json({
      success: true,
      data: usersWithStats
    });
  } catch (error) {
    next(error);
  }
};

const getAgents = async (req, res, next) => {
  try {
    const agents = await User.find({ role: 'admin' }).select('name email department avatar');
    res.status(200).json({
      success: true,
      data: agents
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMetrics,
  assignTicket,
  updatePriority,
  addInternalNote,
  getUsers,
  getAgents
};

