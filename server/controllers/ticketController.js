const Ticket = require('../models/Ticket');

const getTickets = async (req, res, next) => {
  try {
    const { status, priority, category, search } = req.query;
    const filter = {};

    if (req.user.role === 'customer') {
      filter.customer = req.user._id;
    }

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (priority && priority !== 'All') {
      filter.priority = priority;
    }

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { ticketId: { $regex: search, $options: 'i' } }
      ];
    }

    const tickets = await Ticket.find(filter)
      .populate('customer', 'name email avatar')
      .populate('assignedTo', 'name email department avatar')
      .sort({ updatedAt: -1 });

    const sanitizedTickets = tickets.map((t) => {
      const ticketObj = t.toObject();
      if (req.user.role === 'customer') {
        delete ticketObj.internalNotes;
      }
      return ticketObj;
    });

    res.status(200).json({
      success: true,
      count: sanitizedTickets.length,
      data: sanitizedTickets
    });
  } catch (error) {
    next(error);
  }
};

const createTicket = async (req, res, next) => {
  try {
    const { title, description, category, priority } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    const ticket = new Ticket({
      title,
      description,
      category: category || 'General Inquiry',
      priority: priority || 'Medium',
      customer: req.user._id,
      messages: [
        {
          sender: req.user._id,
          senderRole: req.user.role,
          senderName: req.user.name,
          message: description
        }
      ]
    });

    await ticket.save();

    const populatedTicket = await Ticket.findById(ticket._id)
      .populate('customer', 'name email avatar')
      .populate('assignedTo', 'name email department avatar');

    res.status(201).json({
      success: true,
      data: populatedTicket
    });
  } catch (error) {
    next(error);
  }
};

const getTicketById = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('customer', 'name email avatar')
      .populate('assignedTo', 'name email department avatar')
      .populate('messages.sender', 'name email avatar role')
      .populate('internalNotes.author', 'name email avatar department');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    if (
      req.user.role === 'customer' &&
      ticket.customer._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this ticket'
      });
    }

    const responseData = ticket.toObject();
    if (req.user.role === 'customer') {
      delete responseData.internalNotes;
    }

    res.status(200).json({
      success: true,
      data: responseData
    });
  } catch (error) {
    next(error);
  }
};

const addMessage = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    if (
      req.user.role === 'customer' &&
      ticket.customer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reply to this ticket'
      });
    }

    ticket.messages.push({
      sender: req.user._id,
      senderRole: req.user.role,
      senderName: req.user.name,
      message: message.trim()
    });

    if (req.user.role === 'customer' && ticket.status === 'Resolved') {
      ticket.status = 'In Progress';
    }

    await ticket.save();

    const updatedTicket = await Ticket.findById(ticket._id)
      .populate('customer', 'name email avatar')
      .populate('assignedTo', 'name email department avatar')
      .populate('messages.sender', 'name email avatar role')
      .populate('internalNotes.author', 'name email avatar department');

    const responseData = updatedTicket.toObject();
    if (req.user.role === 'customer') {
      delete responseData.internalNotes;
    }

    res.status(200).json({
      success: true,
      data: responseData
    });
  } catch (error) {
    next(error);
  }
};

const updateTicketStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Open', 'In Progress', 'Resolved', 'Closed'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value provided'
      });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    if (req.user.role === 'customer') {
      if (ticket.customer.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to modify this ticket'
        });
      }
      if (status !== 'Closed' && status !== 'Open') {
        return res.status(403).json({
          success: false,
          message: 'Customers can only close or re-open tickets'
        });
      }
    }

    ticket.status = status;
    if (status === 'Resolved') {
      ticket.resolvedAt = new Date();
    } else if (status === 'Closed') {
      ticket.closedAt = new Date();
    }

    await ticket.save();

    const updatedTicket = await Ticket.findById(ticket._id)
      .populate('customer', 'name email avatar')
      .populate('assignedTo', 'name email department avatar')
      .populate('messages.sender', 'name email avatar role');

    const responseData = updatedTicket.toObject();
    if (req.user.role === 'customer') {
      delete responseData.internalNotes;
    }

    res.status(200).json({
      success: true,
      data: responseData
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTickets,
  createTicket,
  getTicketById,
  addMessage,
  updateTicketStatus
};

