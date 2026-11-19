import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  Inbox,
  Users,
  ShieldAlert,
  HelpCircle,
  X
} from 'lucide-react';

const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const { isAdmin } = useAuth();

  const customerLinks = [
    { to: '/customer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/customer/tickets', label: 'My Tickets', icon: Ticket },
    { to: '/customer/tickets/new', label: 'Raise Ticket', icon: PlusCircle }
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Overview Metrics', icon: LayoutDashboard },
    { to: '/admin/tickets', label: 'Ticket Queue', icon: Inbox },
    { to: '/admin/users', label: 'User Directory', icon: Users }
  ];

  const links = isAdmin ? adminLinks : customerLinks;

  const navContent = (
    <div className="flex flex-col h-full justify-between py-6 px-4">
      <div className="space-y-6">
        <div className="px-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {isAdmin ? 'Administrative Operations' : 'Customer Workspace'}
          </p>
        </div>

        <nav className="space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="space-y-3 pt-6 border-t border-slate-200">
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-slate-100 to-indigo-50/50 border border-slate-200/60">
          <div className="flex items-center gap-2 mb-1.5 text-slate-800 font-semibold text-xs">
            <HelpCircle className="w-4 h-4 text-brand-600" />
            <span>Need Assistance?</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            {isAdmin
              ? 'Review pending high priority tickets and maintain SLA resolution standards.'
              : 'Our support engineers typically respond within 2 business hours.'}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-64 flex-shrink-0 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)]">
        {navContent}
      </aside>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col z-10">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <span className="font-bold text-slate-900 text-sm">Navigation Menu</span>
              <button
                onClick={onCloseMobile}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{navContent}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;

