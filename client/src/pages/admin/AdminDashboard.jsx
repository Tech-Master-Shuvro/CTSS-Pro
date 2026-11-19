import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import StatCard from '../../components/stats/StatCard';
import TicketTable from '../../components/tickets/TicketTable';
import { PageLoading } from '../../components/common/Loading';
import {
  Inbox,
  AlertTriangle,
  Clock,
  CheckCircle,
  Users,
  ShieldAlert,
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/metrics');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (loading || !data) {
    return <PageLoading message="Aggregating operational analytics..." />;
  }

  const { overview, categoryStats, priorityStats, recentTickets } = data;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Support Operations Console
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Real-time incident oversight, queue distribution, and SLA resolution tracking
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchMetrics}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Metrics</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Incidents"
          value={overview.totalTickets}
          subtitle="Cumulative tickets registered"
          icon={Inbox}
          color="indigo"
        />
        <StatCard
          title="Open Queue"
          value={overview.openTickets}
          subtitle="Requires staff assignment"
          icon={Clock}
          color="sky"
        />
        <StatCard
          title="Urgent Priority"
          value={overview.urgentTickets}
          subtitle="High SLA risk items"
          icon={AlertTriangle}
          color="rose"
        />
        <StatCard
          title="Resolved"
          value={overview.resolvedTickets}
          subtitle="Successfully closed tickets"
          icon={CheckCircle}
          color="emerald"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Tickets by Category
          </h3>
          <div className="space-y-3 pt-2">
            {categoryStats.map((item) => {
              const pct = overview.totalTickets > 0
                ? Math.round((item.count / overview.totalTickets) * 100)
                : 0;
              return (
                <div key={item._id} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{item._id || 'Unassigned'}</span>
                    <span>
                      {item.count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Tickets by Priority
          </h3>
          <div className="space-y-3 pt-2">
            {priorityStats.map((item) => {
              const pct = overview.totalTickets > 0
                ? Math.round((item.count / overview.totalTickets) * 100)
                : 0;
              let barColor = 'bg-slate-400';
              if (item._id === 'Urgent') barColor = 'bg-rose-500';
              if (item._id === 'High') barColor = 'bg-orange-500';
              if (item._id === 'Medium') barColor = 'bg-amber-500';
              if (item._id === 'Low') barColor = 'bg-slate-400';

              return (
                <div key={item._id} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{item._id}</span>
                    <span>
                      {item.count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full ${barColor} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Recent Incident Submissions</h3>
          <Link
            to="/admin/tickets"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
          >
            <span>Full Ticket Queue</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <TicketTable tickets={recentTickets} isAdmin={true} />
      </div>
    </div>
  );
};

export default AdminDashboard;

