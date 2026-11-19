import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import { ArrowRight, Clock, MessageSquare, UserCheck, Inbox } from 'lucide-react';

const TicketTable = ({ tickets, isAdmin = false }) => {
  if (!tickets || tickets.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4">
          <Inbox className="w-7 h-7" />
        </div>
        <h4 className="text-base font-bold text-slate-800 mb-1">No Tickets Found</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          No records match the requested parameters. Try resetting your search filters or create a new support request.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="py-3.5 px-4 sm:px-6">Ticket ID</th>
              <th className="py-3.5 px-4">Subject & Category</th>
              <th className="py-3.5 px-4">Priority</th>
              <th className="py-3.5 px-4">Status</th>
              {isAdmin && <th className="py-3.5 px-4">Customer</th>}
              <th className="py-3.5 px-4">Assigned To</th>
              <th className="py-3.5 px-4">Updated</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {tickets.map((ticket) => {
              const detailPath = isAdmin
                ? `/admin/tickets/${ticket._id}`
                : `/customer/tickets/${ticket._id}`;

              return (
                <tr
                  key={ticket._id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="py-4 px-4 sm:px-6 font-mono text-xs font-bold text-brand-700 whitespace-nowrap">
                    {ticket.ticketId}
                  </td>
                  <td className="py-4 px-4 max-w-xs sm:max-w-md">
                    <Link
                      to={detailPath}
                      className="font-semibold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1"
                    >
                      {ticket.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {ticket.category}
                      </span>
                      {ticket.messages && ticket.messages.length > 0 && (
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {ticket.messages.length}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <Badge type="priority" value={ticket.priority} size="sm" />
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <Badge type="status" value={ticket.status} size="sm" />
                  </td>
                  {isAdmin && (
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-700">
                          {ticket.customer?.name?.charAt(0) || 'C'}
                        </div>
                        <span className="text-xs font-medium text-slate-700 truncate max-w-[120px]">
                          {ticket.customer?.name || 'Unknown'}
                        </span>
                      </div>
                    </td>
                  )}
                  <td className="py-4 px-4 whitespace-nowrap">
                    {ticket.assignedTo ? (
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                        <UserCheck className="w-3.5 h-3.5 text-brand-600" />
                        <span className="truncate max-w-[120px]">{ticket.assignedTo.name}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(ticket.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                    <Link
                      to={detailPath}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-600 hover:text-brand-700 hover:bg-brand-50 transition-colors"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketTable;

