import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/stats/StatCard';
import TicketTable from '../../components/tickets/TicketTable';
import { PageLoading } from '../../components/common/Loading';
import { Ticket, CheckCircle, Clock, PlusCircle, ArrowUpRight, AlertCircle } from 'lucide-react';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const res = await api.get('/tickets');
        if (res.data.success) {
          setTickets(res.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) {
    return <PageLoading message="Gathering ticket metrics..." />;
  }

  const total = tickets.length;
  const openCount = tickets.filter((t) => t.status === 'Open').length;
  const inProgressCount = tickets.filter((t) => t.status === 'In Progress').length;
  const resolvedCount = tickets.filter((t) => t.status === 'Resolved' || t.status === 'Closed').length;

  const recentTickets = tickets.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {user?.name}
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Monitor and track your open support inquiries and technical requests
          </p>
        </div>
        <Link
          to="/customer/tickets/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/25 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Raise New Ticket</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tickets"
          value={total}
          subtitle="All time requests submitted"
          icon={Ticket}
          color="indigo"
        />
        <StatCard
          title="Open Tickets"
          value={openCount}
          subtitle="Awaiting initial agent review"
          icon={AlertCircle}
          color="sky"
        />
        <StatCard
          title="In Progress"
          value={inProgressCount}
          subtitle="Actively being investigated"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Resolved / Closed"
          value={resolvedCount}
          subtitle="Successfully concluded cases"
          icon={CheckCircle}
          color="emerald"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Recent Tickets</h3>
          <Link
            to="/customer/tickets"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
          >
            <span>View All ({total})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <TicketTable tickets={recentTickets} isAdmin={false} />
      </div>
    </div>
  );
};

export default CustomerDashboard;

