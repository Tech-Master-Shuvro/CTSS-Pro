import React, { useState } from 'react';
import { Lock, Plus, FileText } from 'lucide-react';
import Spinner from '../common/Loading';

const InternalNotes = ({ notes = [], onAddNote, isSubmitting = false }) => {
  const [noteContent, setNoteContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!noteContent.trim() || isSubmitting) return;
    onAddNote(noteContent.trim());
    setNoteContent('');
  };

  return (
    <div className="bg-amber-50/50 rounded-2xl border border-amber-200/80 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-amber-200/60">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
          <Lock className="w-4 h-4 text-amber-600" />
          <span>Staff Internal Notes</span>
        </div>
        <span className="text-[11px] font-semibold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md uppercase tracking-wider">
          Confidential
        </span>
      </div>

      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {notes.length === 0 ? (
          <p className="text-xs text-amber-800/60 italic py-2">
            No internal staff notes added yet. Use this section to log team notes hidden from the requester.
          </p>
        ) : (
          notes.map((note, idx) => (
            <div
              key={note._id || idx}
              className="p-3.5 bg-white rounded-xl border border-amber-200/60 text-xs space-y-1.5 shadow-sm"
            >
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span className="font-bold text-slate-700">{note.authorName}</span>
                <span>{new Date(note.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">{note.note}</p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-2 pt-2 border-t border-amber-200/60">
        <textarea
          rows={2}
          placeholder="Add a private note visible only to admins..."
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          disabled={isSubmitting}
          className="w-full p-2.5 rounded-xl border border-amber-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 resize-none placeholder:text-amber-800/40"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!noteContent.trim() || isSubmitting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? (
              <Spinner size="sm" className="text-white" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
            <span>Add Note</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default InternalNotes;

