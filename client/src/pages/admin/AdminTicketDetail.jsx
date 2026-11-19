import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { useToast } from '../../context/ToastContext';
import Badge from '../../components/common/Badge';
import TicketThread from '../../components/tickets/TicketThread';
import InternalNotes from '../../components/tickets/InternalNotes';
import { PageLoading } from '../../components/common/Loading';
import Spinner from '../../components/common/Loading';
import {
  ArrowLeft,
  Calendar,
  Clock,
  UserCheck,
  User,
  Shield,
  Layers,
  Flame,
  CheckCircle2
} from 'lucide-react';

const AdminTicketDetail = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatingPriority, setIsUpdatingPriority] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);

  const { addToast } = useToast();

  const fetchTicketData = useCallback(async () => {
    try {
      const [ticketRes, agentsRes] = await Promise.all([
        api.get(`/tickets/${id}`),
        api.get('/admin/agents')
      ]);

      if (ticketRes.data.success) {
        setTicket(ticketRes.data.data);
      }
      if (agentsRes.data.success) {
        setAgents(agentsRes.data.data);
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to fetch ticket data', 'error');
    } finally {
      setLoading(false);
    }
  }, [id, addToast]);

  useEffect(() => {
    fetchTicketData();
  }, [fetchTicketData]);

  const handleSendMessage = async (messageText) => {
    try {
      setIsSending(true);
      const res = await api.post(`/tickets/${id}/messages`, { message: messageText });
      if (res.data.success) {
        setTicket(res.data.data);
        addToast('Response posted to requester', 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to send response', 'error');
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
        addToast(`Ticket status changed to ${newStatus}`, 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update status', 'error');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handlePriorityChange = async (newPriority) => {
    try {
      setIsUpdatingPriority(true);
      const res = await api.patch(`/admin/tickets/${id}/priority`, { priority: newPriority });
      if (res.data.success) {
        setTicket(res.data.data);
        addToast(`Ticket priority changed to ${newPriority}`, 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update priority', 'error');
    } finally {
      setIsUpdatingPriority(false);
    }
  };

  const handleAssignAgent = async (agentId) => {
    try {
      setIsAssigning(true);
      const res = await api.patch(`/admin/tickets/${id}/assign`, {
        assignedTo: agentId || null
      });
      if (res.data.success) {
        setTicket(res.data.data);
        addToast(
          agentId ? 'Ticket assigned to agent' : 'Ticket returned to unassigned queue',
          'success'
        );
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to reassign agent', 'error');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleAddInternalNote = async (note) => {
    try {
      setIsAddingNote(true);
      const res = await api.post(`/admin/tickets/${id}/notes`, { note });
      if (res.data.success) {
        setTicket(res.data.data);
        addToast('Internal note saved', 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save note', 'error');
    } finally {
      setIsAddingNote(false);
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
          to="/admin/tickets"
          className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-brand-600 hover:text-brand-700"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Queue
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/tickets"
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TicketThread
            messages={ticket.messages}
            onSendMessage={handleSendMessage}
            isSubmitting={isSending}
            isClosed={ticket.status === 'Closed'}
          />

          <InternalNotes
            notes={ticket.internalNotes || []}
            onAddNote={handleAddInternalNote}
            isSubmitting={isAddingNote}
          />
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Triage & Actions
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Update Status
                </label>
                <div className="relative">
                  <select
                    value={ticket.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={isUpdatingStatus}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Change Urgency
                </label>
                <div className="relative">
                  <select
                    value={ticket.priority}
                    onChange={(e) => handlePriorityChange(e.target.value)}
                    disabled={isUpdatingPriority}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Assigned Staff
                </label>
                <div className="relative">
                  <select
                    value={ticket.assignedTo?._id || ''}
                    onChange={(e) => handleAssignAgent(e.target.value)}
                    disabled={isAssigning}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  >
                    <option value="">Unassigned (In Queue)</option>
                    {agents.map((agent) => (
                      <option key={agent._id} value={agent._id}>
                        {agent.name} ({agent.department || 'Support'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Requester Profile
            </h4>

            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-700">
                {ticket.customer?.name?.charAt(0) || 'C'}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{ticket.customer?.name}</p>
                <p className="text-[11px] text-slate-400">{ticket.customer?.email}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Category</span>
                <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                  {ticket.category}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Date Submitted</span>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{new Date(ticket.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Latest Update</span>
                <div className="flex items-center gap-1.5 text-slate-700">
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

export default AdminTicketDetail;

