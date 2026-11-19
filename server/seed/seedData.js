require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const Counter = require('../models/Counter');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ctss_db';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding');

    await User.deleteMany({});
    await Ticket.deleteMany({});
    await Counter.deleteMany({});

    await Counter.create({ _id: 'ticketId', seq: 1000 });

    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@ctss.com',
      password: 'AdminPassword123',
      role: 'admin',
      department: 'Technical Operations',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    });

    const agent = await User.create({
      name: 'Sarah Jenkins',
      email: 'sarah.agent@ctss.com',
      password: 'AgentPassword123',
      role: 'admin',
      department: 'Billing & Accounts',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
    });

    const customer1 = await User.create({
      name: 'Alex Johnson',
      email: 'customer@ctss.com',
      password: 'CustomerPassword123',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    });

    const customer2 = await User.create({
      name: 'Elena Rostova',
      email: 'elena@techcorp.io',
      password: 'CustomerPassword123',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150'
    });

    const ticket1 = new Ticket({
      title: 'Database connection timeout during peak hours',
      description: 'Our analytics dashboard is reporting repeated MongoTimeoutError when querying large datasets between 14:00 and 16:00 UTC. Please advise on index optimization and pool size settings.',
      category: 'Technical',
      priority: 'High',
      status: 'In Progress',
      customer: customer1._id,
      assignedTo: admin._id,
      messages: [
        {
          sender: customer1._id,
          senderRole: 'customer',
          senderName: customer1.name,
          message: 'Our analytics dashboard is reporting repeated MongoTimeoutError when querying large datasets between 14:00 and 16:00 UTC. Please advise on index optimization and pool size settings.',
          createdAt: new Date(Date.now() - 3600000 * 24)
        },
        {
          sender: admin._id,
          senderRole: 'admin',
          senderName: admin.name,
          message: 'Hello Alex, we have examined your cluster logs. It appears a compound index is missing on the timestamp and tenantId fields. We have staged an index patch for review.',
          createdAt: new Date(Date.now() - 3600000 * 18)
        },
        {
          sender: customer1._id,
          senderRole: 'customer',
          senderName: customer1.name,
          message: 'Thanks for the quick investigation. We will apply the recommended index on our staging replica first and update you.',
          createdAt: new Date(Date.now() - 3600000 * 4)
        }
      ],
      internalNotes: [
        {
          author: admin._id,
          authorName: admin.name,
          note: 'Customer cluster size is M30. Advised query optimization before considering vertical scaling.',
          createdAt: new Date(Date.now() - 3600000 * 17)
        }
      ]
    });
    await ticket1.save();

    const ticket2 = new Ticket({
      title: 'Invoice discrepancy for October 2026 enterprise subscription',
      description: 'We were billed for 45 active seats instead of the contracted 30 seats on invoice INV-9821. Kindly issue a credit memo and correct the recurring billing tier.',
      category: 'Billing',
      priority: 'Urgent',
      status: 'Open',
      customer: customer1._id,
      assignedTo: null,
      messages: [
        {
          sender: customer1._id,
          senderRole: 'customer',
          senderName: customer1.name,
          message: 'We were billed for 45 active seats instead of the contracted 30 seats on invoice INV-9821. Kindly issue a credit memo and correct the recurring billing tier.',
          createdAt: new Date(Date.now() - 3600000 * 6)
        }
      ]
    });
    await ticket2.save();

    const ticket3 = new Ticket({
      title: 'Feature Request: Export audit logs to CSV and JSON',
      description: 'For compliance reporting, our security team needs a scheduled automated export of all ticket change events in structured CSV and JSON formats.',
      category: 'Feature Request',
      priority: 'Low',
      status: 'Resolved',
      customer: customer2._id,
      assignedTo: agent._id,
      resolvedAt: new Date(Date.now() - 3600000 * 2),
      messages: [
        {
          sender: customer2._id,
          senderRole: 'customer',
          senderName: customer2.name,
          message: 'For compliance reporting, our security team needs a scheduled automated export of all ticket change events in structured CSV and JSON formats.',
          createdAt: new Date(Date.now() - 3600000 * 48)
        },
        {
          sender: agent._id,
          senderRole: 'admin',
          senderName: agent.name,
          message: 'Hi Elena, this capability has been added in our latest platform release under Settings > Compliance > Audit Exports. You can schedule daily and weekly automated exports directly.',
          createdAt: new Date(Date.now() - 3600000 * 2)
        }
      ],
      internalNotes: [
        {
          author: agent._id,
          authorName: agent.name,
          note: 'User notified. Verified their enterprise tier includes audit exporter privileges.',
          createdAt: new Date(Date.now() - 3600000 * 2)
        }
      ]
    });
    await ticket3.save();

    const ticket4 = new Ticket({
      title: 'Cannot reset two-factor authentication on secondary device',
      description: 'Lost access to the primary authenticator application. Need recovery backup codes or manual 2FA reset for elena@techcorp.io.',
      category: 'Account',
      priority: 'Medium',
      status: 'Closed',
      customer: customer2._id,
      assignedTo: admin._id,
      resolvedAt: new Date(Date.now() - 3600000 * 72),
      closedAt: new Date(Date.now() - 3600000 * 24),
      messages: [
        {
          sender: customer2._id,
          senderRole: 'customer',
          senderName: customer2.name,
          message: 'Lost access to the primary authenticator application. Need recovery backup codes or manual 2FA reset for elena@techcorp.io.',
          createdAt: new Date(Date.now() - 3600000 * 96)
        },
        {
          sender: admin._id,
          senderRole: 'admin',
          senderName: admin.name,
          message: 'Identity verification completed via enterprise SSO admin. 2FA reset link has been dispatched to your backup corporate email.',
          createdAt: new Date(Date.now() - 3600000 * 72)
        }
      ]
    });
    await ticket4.save();

    console.log('Seeding completed successfully!');
    console.log('Accounts created:');
    console.log(' - Admin: admin@ctss.com / AdminPassword123');
    console.log(' - Agent: sarah.agent@ctss.com / AgentPassword123');
    console.log(' - Customer: customer@ctss.com / CustomerPassword123');
    console.log(' - Customer: elena@techcorp.io / CustomerPassword123');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();

