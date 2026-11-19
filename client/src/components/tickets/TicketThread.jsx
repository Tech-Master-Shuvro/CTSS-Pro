import React, { useState } from 'react';
import { Send, User, Shield, CornerDownLeft } from 'lucide-react';
import Spinner from '../common/Loading';

const TicketThread = ({ messages = [], onSendMessage, isSubmitting = false, isClosed = false }) => {
  const [replyText, setReplyText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!replyText.trim() || isSubmitting) return;
    onSendMessage(replyText.trim());
    setReplyText('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
      <div className="px-6 py-4 border-b border-slate-200/80 bg-slate-50/60 flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-800">Conversation History</h4>
        <span className="text-xs text-slate-400 font-medium">
          {messages.length} {messages.length === 1 ? 'Message' : 'Messages'}
        </span>
      </div>

      <div className="p-6 space-y-6 max-h-[550px] overflow-y-auto">
        {messages.map((msg, index) => {
          const isAgent = msg.senderRole === 'admin';
          return (
            <div
              key={msg._id || index}
              className={`flex gap-3 sm:gap-4 ${isAgent ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ring-2 ${
                  isAgent
                    ? 'bg-brand-600 text-white ring-brand-200'
                    : 'bg-slate-200 text-slate-700 ring-slate-100'
                }`}
              >
                {isAgent ? (
                  <Shield className="w-4 h-4" />
                ) : (
                  msg.senderName?.charAt(0).toUpperCase() || <User className="w-4 h-4" />
                )}
              </div>

              <div
                className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${
                  isAgent ? 'items-end' : 'items-start'
                }`}
              >
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className="text-xs font-bold text-slate-800">{msg.senderName}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase tracking-wider ${
                      isAgent
                        ? 'bg-brand-100 text-brand-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {isAgent ? 'Support Team' : 'Requester'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    isAgent
                      ? 'bg-brand-600 text-white rounded-tr-none shadow-sm shadow-brand-500/20'
                      : 'bg-slate-100 text-slate-800 rounded-tl-none'
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/50">
        {isClosed ? (
          <div className="p-3 text-center rounded-xl bg-slate-100 text-slate-500 text-xs font-medium">
            This ticket is marked as closed. You can re-open it to continue the discussion.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <textarea
                rows={3}
                placeholder="Type your reply to update this ticket..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                disabled={isSubmitting}
                className="w-full p-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none transition-all placeholder:text-slate-400 disabled:bg-slate-50"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400 hidden sm:inline-flex items-center gap-1">
                <CornerDownLeft className="w-3 h-3" /> Press Submit to publish your message
              </span>
              <button
                type="submit"
                disabled={!replyText.trim() || isSubmitting}
                className="ml-auto inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" className="text-white" />
                    <span>Posting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Reply</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TicketThread;

