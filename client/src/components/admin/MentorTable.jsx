import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, RefreshCw, Trash2, Key } from 'lucide-react';
import RatingStars from '../mentorship/RatingStars.jsx';

const MentorTable = ({ mentors = [], onResetPassword, onDelete }) => {
  return (
    <div className="bg-brand-dark/40 border border-brand-border rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-white/5 border-b border-brand-border text-zinc-400 font-bold uppercase tracking-wider">
              <th className="py-4 px-5">Mentor</th>
              <th className="py-4 px-5">Email</th>
              <th className="py-4 px-5">Phone</th>
              <th className="py-4 px-5">Specialization</th>
              <th className="py-4 px-5">Rating</th>
              <th className="py-4 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/40 text-zinc-300">
            {mentors.map((m) => {
              return (
                <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-brand-border overflow-hidden flex items-center justify-center text-brand-gold shrink-0">
                      {m.profileImage ? (
                        <img src={m.profileImage} alt={m.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-bold">{m.fullName.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-white leading-tight">{m.fullName}</h4>
                      <span className="text-[10px] text-zinc-500 font-medium">{m.qualification}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5">{m.user?.email || 'N/A'}</td>
                  <td className="py-3.5 px-5 font-medium">{m.user?.phone || 'N/A'}</td>
                  <td className="py-3.5 px-5">
                    <span className="px-2 py-0.5 rounded bg-brand-purple/10 border border-brand-purple/20 text-brand-purple uppercase text-[9px] font-black tracking-wide">
                      {m.specialization}
                    </span>
                  </td>
                  <td className="py-3.5 px-5">
                    <RatingStars rating={m.rating} />
                  </td>
                  <td className="py-3.5 px-5 text-right flex justify-end gap-2">
                    <Link
                      to={`/admin/mentors/edit/${m.id}`}
                      className="p-1.5 rounded-lg border border-brand-border bg-zinc-900 hover:text-white text-zinc-400 hover:bg-white/5 transition-all"
                      title="Edit Mentor Profile"
                    >
                      <Edit size={13} />
                    </Link>
                    <button
                      onClick={() => onResetPassword(m.id)}
                      className="p-1.5 rounded-lg border border-brand-border bg-zinc-900 text-brand-gold hover:bg-white/5 transition-all"
                      title="Generate Temporary Password"
                    >
                      <Key size={13} />
                    </button>
                    <button
                      onClick={() => onDelete(m.id)}
                      className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 transition-all"
                      title="Delete Mentor Account"
                    >
                      <Trash2 size={13} />
                    </button>
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

export default MentorTable;
