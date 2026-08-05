import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, ShieldAlert, ShieldCheck } from 'lucide-react';

const StudentTable = ({ students = [], onToggleStatus }) => {
  return (
    <div className="bg-brand-dark/40 border border-brand-border rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-white/5 border-b border-brand-border text-zinc-400 font-bold uppercase tracking-wider">
              <th className="py-4 px-5">Name</th>
              <th className="py-4 px-5">Email</th>
              <th className="py-4 px-5">Phone</th>
              <th className="py-4 px-5">CMA Level</th>
              <th className="py-4 px-5">Target Exam</th>
              <th className="py-4 px-5">Status</th>
              <th className="py-4 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/40 text-zinc-300">
            {students.map((student) => {
              const isActive = student.status === 'ACTIVE';
              return (
                <tr key={student.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-5 font-bold text-white">{student.name}</td>
                  <td className="py-3.5 px-5">{student.email}</td>
                  <td className="py-3.5 px-5 font-medium">{student.phone}</td>
                  <td className="py-3.5 px-5">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-brand-purple/10 border border-brand-purple/20 text-brand-purple uppercase">
                      {student.cmaLevel || 'Not Set'}
                    </span>
                  </td>
                  <td className="py-3.5 px-5">{student.targetAttempt || 'Not Set'}</td>
                  <td className="py-3.5 px-5">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider ${
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right flex justify-end gap-2">
                    <Link
                      to={`/admin/students/${student.id}`}
                      className="p-1.5 rounded-lg border border-brand-border bg-zinc-900 hover:text-white text-zinc-400 hover:bg-white/5 transition-all"
                      title="View Student Profile"
                    >
                      <Eye size={14} />
                    </Link>
                    <button
                      onClick={() => onToggleStatus(student.id, isActive ? 'DEACTIVATE' : 'ACTIVATE')}
                      className={`p-1.5 rounded-lg border transition-all ${
                        isActive
                          ? 'border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10'
                          : 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10'
                      }`}
                      title={isActive ? 'Deactivate Student' : 'Activate Student'}
                    >
                      {isActive ? <ShieldAlert size={14} /> : <ShieldCheck size={14} />}
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

export default StudentTable;
