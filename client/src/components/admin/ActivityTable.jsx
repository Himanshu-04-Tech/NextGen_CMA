import React from 'react';
import { Calendar, User, Eye } from 'lucide-react';

const ActivityTable = ({ logs = [] }) => {
  return (
    <div className="bg-brand-dark/40 border border-brand-border rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-white/5 border-b border-brand-border text-zinc-400 font-bold uppercase tracking-wider">
              <th className="py-4 px-5">Timestamp</th>
              <th className="py-4 px-5">Administrator</th>
              <th className="py-4 px-5">Action</th>
              <th className="py-4 px-5">Resource</th>
              <th className="py-4 px-5">IP Address</th>
              <th className="py-4 px-5">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/40 text-zinc-300">
            {logs.map((log) => {
              const logDate = new Date(log.createdAt).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-zinc-400 flex items-center gap-1.5 mt-1 border-none">
                    <Calendar size={12} className="text-brand-purple" />
                    <span>{logDate}</span>
                  </td>
                  <td className="py-3.5 px-5 border-none">
                    <div className="flex flex-col">
                      <span className="font-bold text-white leading-snug">{log.user?.name || 'System / Seed'}</span>
                      <span className="text-[9px] text-brand-gold uppercase tracking-wider font-semibold">
                        {log.user?.role || 'AUTO'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 border-none">
                    <span className="px-2.5 py-0.5 rounded font-black bg-brand-purple/10 border border-brand-purple/20 text-brand-purple uppercase text-[9px] tracking-wide">
                      {log.action.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 border-none">
                    <span className="text-zinc-400 font-bold font-display uppercase tracking-wider text-[10px]">
                      {log.targetTable} ({log.targetId ? log.targetId.substring(0, 8) : 'N/A'})
                    </span>
                  </td>
                  <td className="py-3.5 px-5 font-medium border-none">{log.ipAddress || '127.0.0.1'}</td>
                  <td className="py-3.5 px-5 leading-normal max-w-xs truncate border-none" title={log.description}>
                    {log.description}
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

export default ActivityTable;
