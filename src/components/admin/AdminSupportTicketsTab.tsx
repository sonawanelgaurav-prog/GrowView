import React, { useState } from 'react';
import {
  LifeBuoy,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  User,
  Search,
  Filter,
  X,
  Mail,
} from 'lucide-react';
import { SupportTicket } from '../../types';
import { MOCK_SUPPORT_TICKETS } from '../../data/adminMockData';

export const AdminSupportTicketsTab: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>(MOCK_SUPPORT_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(tickets[0] || null);
  const [replyMessage, setReplyMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'admin' as const,
      senderName: 'Super Admin (GrowView Support)',
      message: replyMessage,
      timestamp: new Date().toISOString(),
    };

    const updated = {
      ...selectedTicket,
      status: 'in_progress' as const,
      updatedAt: new Date().toISOString(),
      messages: [...selectedTicket.messages, newMsg],
    };

    setTickets((prev) => prev.map((t) => (t.id === selectedTicket.id ? updated : t)));
    setSelectedTicket(updated);
    setReplyMessage('');
  };

  const handleResolveTicket = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'resolved' as const } : t))
    );
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket((prev) => (prev ? { ...prev, status: 'resolved' } : null));
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    const matchesSearch =
      t.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-indigo-400" />
            <span>ग्राहक सपोर्ट व तक्रार निवारण (Customer Support Helpdesk)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            पेमेंट, 4K डाऊनलोड व नवीन डिझाईन मागण्यांची उत्तरे थेट डॅशबोर्डवरून द्या.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20">
            Open Tickets: {tickets.filter((t) => t.status === 'open' || t.status === 'in_progress').length}
          </span>
        </div>
      </div>

      {/* 2-Pane Tickets Inbox & Conversation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
        {/* Left 5 Cols: Ticket List */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="नाव किंवा विषय शोधा..."
                className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700 text-xs rounded-xl text-white placeholder-slate-500"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-xs text-slate-300 px-2.5 py-1.5 rounded-xl font-semibold"
              >
                <option value="all">सर्व</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {filteredTickets.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTicket(t)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    selectedTicket?.id === t.id
                      ? 'bg-indigo-600/15 border-indigo-500 text-white'
                      : 'bg-slate-950 border-slate-800/80 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-100">{t.userName}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        t.priority === 'urgent'
                          ? 'bg-rose-500/20 text-rose-400'
                          : t.priority === 'high'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {t.priority.toUpperCase()}
                    </span>
                  </div>

                  <h5 className="text-xs font-semibold text-slate-200 mt-1 line-clamp-1">{t.subject}</h5>

                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-mono">#{t.id}</span>
                    <span
                      className={`font-semibold capitalize ${
                        t.status === 'resolved' ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {t.status.replace('_', ' ')}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Conversation Thread & Reply Composer */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          {selectedTicket ? (
            <div className="flex flex-col h-full justify-between space-y-4">
              {/* Thread Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-white">{selectedTicket.subject}</h4>
                    <span className="text-[10px] font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-400">
                      #{selectedTicket.id}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 mt-0.5 block">
                    ग्राहक: <strong className="text-slate-200">{selectedTicket.userName}</strong> ({selectedTicket.userEmail})
                  </span>
                </div>

                {selectedTicket.status !== 'resolved' && (
                  <button
                    type="button"
                    onClick={() => handleResolveTicket(selectedTicket.id)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>मार्क Resolved</span>
                  </button>
                )}
              </div>

              {/* Chat Messages */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {selectedTicket.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`p-3 rounded-2xl text-xs max-w-[85%] ${
                      m.sender === 'admin'
                        ? 'bg-indigo-600 text-white ml-auto rounded-tr-none'
                        : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-none'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] opacity-75 mb-1">
                      <span className="font-bold">{m.senderName}</span>
                      <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="leading-relaxed">{m.message}</p>
                  </div>
                ))}
              </div>

              {/* Reply Composer Form */}
              <form onSubmit={handleSendReply} className="pt-3 border-t border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  required
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="उत्तर टाईप करा (उदा. आम्ही तुमचे VIP ॲक्टिव्ह केले आहे)..."
                  className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>पाठवा</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs">
              <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
              <span>डाव्या बाजूने कोणतीही तक्रार निवडा</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
