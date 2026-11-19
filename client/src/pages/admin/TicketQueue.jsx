import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axiosInstance';
import TicketFilter from '../../components/tickets/TicketFilter';
import TicketTable from '../../components/tickets/TicketTable';
import { PageLoading } from '../../components/common/Loading';
import { RefreshCw, Layers } from 'lucide-react';

const TicketQueue = () => {
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
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Global Ticket Queue
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
              {tickets.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Filter, triage, and manage tickets submitted across all client accounts
          </p>
        </div>
        <div>
          <button
            onClick={fetchTickets}
            title="Refresh Queue"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <TicketFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {loading ? (
        <PageLoading message="Loading queue records..." />
      ) : (
        <TicketTable tickets={tickets} isAdmin={true} />
      )}
    </div>
  );
};

export default TicketQueue;

