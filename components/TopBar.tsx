
import React, { useState, useRef, useEffect } from 'react';
import { AppNotification } from '../types';

interface TopBarProps {
  userName: string;
  userEmail: string;
  profilePic: string | null;
  notifications: AppNotification[];
  onProfileClick: () => void;
  onMarkAsRead: (id: string | 'all') => void;
}

export const TopBar = ({ userName, userEmail, profilePic, notifications, onProfileClick, onMarkAsRead }: TopBarProps) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="h-20 flex items-center justify-between px-8 bg-white border-b border-slate-100 sticky top-0 z-[100] backdrop-blur-md bg-white/80">
      <div className="flex-1 max-w-lg">
        <div className="relative group">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 group-focus-within:text-[#004D40]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </span>
          <input
            type="text"
            className="w-full bg-slate-50 border-none rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#004D40] focus:bg-white transition-all outline-none"
            placeholder="Search symptoms, doctors, or records..."
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <button className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-all relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </button>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2.5 rounded-xl transition-all relative ${showNotifications ? 'bg-slate-100 text-[#004D40]' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2.5 w-4 h-4 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] text-white font-bold animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="p-5 border-b border-slate-50 flex items-center justify-between">
                  <h3 className="font-black text-slate-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => onMarkAsRead('all')}
                      className="text-[10px] font-bold text-[#004D40] hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div className="divide-y divide-slate-50">
                      {[...notifications].reverse().map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => onMarkAsRead(notif.id)}
                          className={`p-5 transition-colors cursor-pointer hover:bg-slate-50 ${!notif.isRead ? 'bg-emerald-50/30' : ''}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${!notif.isRead ? 'bg-[#004D40] text-white' : 'bg-slate-100 text-slate-400'}`}>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs ${!notif.isRead ? 'font-black text-slate-900' : 'font-medium text-slate-500'}`}>{notif.title}</p>
                              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{notif.message}</p>
                              <p className="text-[9px] text-slate-300 font-bold mt-2 uppercase tracking-tighter">{notif.date}</p>
                            </div>
                            {!notif.isRead && <div className="w-2 h-2 bg-red-500 rounded-full shrink-0"></div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 px-8 text-center">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-200">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                      </div>
                      <p className="text-slate-400 text-xs italic">No notifications yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="h-10 w-px bg-slate-100"></div>

        <div onClick={onProfileClick} className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-900 leading-tight">{userName}</p>
            <p className="text-[11px] text-slate-400">{userEmail}</p>
          </div>
          <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-transparent group-hover:ring-[#004D40] transition-all bg-slate-100 flex items-center justify-center">
            {profilePic ? (
              <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-6 h-6 text-slate-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
