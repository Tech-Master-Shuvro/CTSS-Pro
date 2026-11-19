import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import TicketFilter from '../../components/tickets/TicketFilter';
import TicketTable from '../../components/tickets/TicketTable';
import { PageLoading } from '../../components/common/Loading';
import { PlusCircle, RefreshCw } from 'lucide-react';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: 'All',
    priority: 'All',
    category: 'All'
  });

  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.status !== 'All') params.status = filters.status;
      if (filters.priority !== 'All') params.priority = filters.priority;
      if (filters.category !== 'All') params.category = filters.category;

      const res = await api.get('/tickets', { params });
      if (res.data.success) {
        setTickets(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTickets();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchTickets]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: 'All',
      priority: 'All',
      category: 'All'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            My Support Tickets
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            View, filter, and track updates on all your submitted issues
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchTickets}
            title="Refresh List"
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            to="/customer/tickets/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Ticket</span>
          </Link>
        </div>
      </div>

      <TicketFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {loading ? (
        <PageLoading message="Loading ticket records..." />
      ) : (
        <TicketTable tickets={tickets} isAdmin={false} />
      )}
    </div>
  );
};

export default MyTickets;

