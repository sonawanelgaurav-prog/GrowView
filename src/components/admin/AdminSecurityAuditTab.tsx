import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Lock,
  Eye,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Globe,
  Download,
} from 'lucide-react';
import { AdminAuditLog } from '../../types';
import { MOCK_ADMIN_AUDIT_LOGS } from '../../data/adminMockData';

export const AdminSecurityAuditTab: React.FC = () => {
  const [logs, setLogs] = useState<AdminAuditLog[]>(MOCK_ADMIN_AUDIT_LOGS);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = logs.filter((l) => {
    return (
      l.adminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.actionMarathi && l.actionMarathi.includes(searchQuery)) ||
      l.details.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Top 4 Security Guard Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-xs font-semibold text-slate-400 block">Failed Logins (24h)</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">0</div>
          <span className="text-[11px] text-slate-500 block mt-1">All Systems Safe</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-xs font-semibold text-slate-400 block">Blocked Proxy IPs</span>
          <div className="text-2xl font-black text-amber-400 mt-1">14</div>
          <span className="text-[11px] text-slate-500 block mt-1">Rate Limiter Active</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-xs font-semibold text-slate-400 block">Two-Factor Auth (2FA)</span>
          <div className="text-2xl font-black text-slate-400 mt-1">Off</div>
          <span className="text-[11px] text-amber-400 font-bold block mt-1">Direct Secure Auth</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <span className="text-xs font-semibold text-slate-400 block">Admin Session State</span>
          <div className="text-2xl font-black text-white mt-1">Encrypted</div>
          <span className="text-[11px] text-slate-500 block mt-1">JWT + Cookie Guard</span>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <span>ॲडमिन ऑडिट लॉग (Immutable Admin Audit Log)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              ॲडमिन पॅनलमध्ये केलेल्या प्रत्येक कृतीची सुरक्षित टाइमस्टॅम्पसह नोंद.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ऑडिट लॉग शोधा..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 text-xs rounded-xl text-white placeholder-slate-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800 text-[11px] uppercase">
              <tr>
                <th className="py-3 px-4">Admin & Role</th>
                <th className="py-3 px-4">Action Performed</th>
                <th className="py-3 px-4">Target Details</th>
                <th className="py-3 px-4">IP Address & Timestamp</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-200">{log.adminName}</div>
                    <span className="text-[10px] text-amber-400 uppercase font-mono">
                      {log.adminRole.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-100">{log.actionMarathi || log.action}</div>
                    <span className="text-[11px] text-slate-400">{log.action}</span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-300 max-w-[240px]">
                    <span className="truncate block text-xs">{log.details}</span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                    <div>{new Date(log.timestamp).toLocaleString()}</div>
                    <span className="text-[10px] text-slate-500">{log.ipAddress || '127.0.0.1'}</span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        log.status === 'success'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-amber-500/15 text-amber-400'
                      }`}
                    >
                      {log.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
