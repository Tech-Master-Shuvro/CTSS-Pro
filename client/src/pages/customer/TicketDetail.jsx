import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { useToast } from '../../context/ToastContext';
import Badge from '../../components/common/Badge';
import TicketThread from '../../components/tickets/TicketThread';
import { PageLoading } from '../../components/common/Loading';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  RotateCcw,
  UserCheck,
  AlertCircle
} from 'lucide-react';

const TicketDetail = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const { addToast } = useToast();

  const fetchTicket = useCallback(async () => {
    try {
      const res = await api.get(`/tickets/${id}`);
      if (res.data.success) {
        setTicket(res.data.data);
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to load ticket', 'error');
    } finally {
      setLoading(false);
    }
  }, [id, addToast]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  const handleSendMessage = async (messageText) => {
    try {
      setIsSending(true);
      const res = await api.post(`/tickets/${id}/messages`, { message: messageText });
      if (res.data.success) {
        setTicket(res.data.data);
        addToast('Reply sent successfully', 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to send reply', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setIsUpdatingStatus(true);
      const res = await api.patch(`/tickets/${id}/status`, { status: newStatus });
      if (res.data.success) {
        setTicket(res.data.data);
        addToast(`Ticket status updated to ${newStatus}`, 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update ticket status', 'error');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (loading) {
    return <PageLoading message="Loading ticket details..." />;
  }

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-bold text-slate-800">Ticket Not Found</h3>
        <Link
          to="/customer/tickets"
          className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-brand-600 hover:text-brand-700"
        >
          <ArrowLeft className="w-4 h-4" /> Return to My Tickets
        </Link>
      </div>
    );
  }

  const isClosed = ticket.status === 'Closed';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/customer/tickets"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200/50">
                {ticket.ticketId}
              </span>
              <Badge type="status" value={ticket.status} size="sm" />
              <Badge type="priority" value={ticket.priority} size="sm" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              {ticket.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isClosed ? (
            <button
              onClick={() => handleStatusChange('Open')}
              disabled={isUpdatingStatus}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors shadow-sm disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5 text-brand-600" />
              <span>Re-open Ticket</span>
            </button>
          ) : (
            <button
              onClick={() => handleStatusChange('Closed')}
              disabled={isUpdatingStatus}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors shadow-sm disabled:opacity-50"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Mark as Closed</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TicketThread
            messages={ticket.messages}
            onSendMessage={handleSendMessage}
            isSubmitting={isSending}
            isClosed={isClosed}
          />
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Ticket Information
            </h4>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Category</span>
                <span className="font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md">
                  {ticket.category}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Assigned Support Agent</span>
                {ticket.assignedTo ? (
                  <div className="flex items-center gap-2 font-medium text-slate-800">
                    <UserCheck className="w-4 h-4 text-brand-600" />
                    <span>{ticket.assignedTo.name}</span>
                  </div>
                ) : (
                  <span className="text-slate-500 italic">Unassigned (In queue)</span>
                )}
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Created At</span>
                <div className="flex items-center gap-2 text-slate-700">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{new Date(ticket.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Last Updated</span>
                <div className="flex items-center gap-2 text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{new Date(ticket.updatedAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;

