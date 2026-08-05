import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import ReplyBox from '../../components/mentorship/ReplyBox.jsx';
import LoadingSkeleton from '../../components/mentorship/LoadingSkeleton.jsx';
import { ArrowLeft, CheckCircle, ExternalLink, AlertTriangle, FileText, User } from 'lucide-react';
import toast from 'react-hot-toast';

const DoubtDetails = () => {
  const { id } = useParams(); // doubtId
  const { user } = useAuth();
  const currentUserId = user?.id;

  const [doubt, setDoubt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchDoubtDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/doubts/${id}`);
      setDoubt(res.data.data);
    } catch (err) {
      console.error(err);
      setError('Could not fetch doubt thread details. It may have been deleted.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoubtDetails();
  }, [id]);

  const handleResolveDoubt = async () => {
    if (!window.confirm('Mark this study doubt as resolved?')) return;
    try {
      await api.patch(`/doubts/${id}`, { status: 'RESOLVED' });
      toast.success('Doubt successfully marked as RESOLVED');
      fetchDoubtDetails();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status.');
    }
  };

  const handlePostReply = async (replyData) => {
    setReplySubmitting(true);
    try {
      await api.post(`/doubts/${id}/reply`, replyData);
      toast.success('Reply posted successfully');
      
      // Silent refresh of thread to keep performance smooth
      const res = await api.get(`/doubts/${id}`);
      setDoubt(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to post reply.');
    } finally {
      setReplySubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton type="detail" count={1} />;
  }

  if (error || !doubt) {
    return (
      <div className="space-y-4">
        <Link to="/mentorship/doubts" className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft size={14} />
          <span>Back to Doubt Board</span>
        </Link>
        <div className="p-8 text-center text-red-400 bg-red-500/10 border border-red-500/20 rounded-2xl">
          {error || 'Doubt thread not found'}
        </div>
      </div>
    );
  }

  const getPriorityColor = () => {
    switch (doubt.priority) {
      case 'HIGH': return 'text-red-400 border-red-500/20 bg-red-500/10';
      case 'MEDIUM': return 'text-amber-400 border-amber-500/20 bg-amber-500/10';
      case 'LOW': return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';
      default: return 'text-zinc-400 border-zinc-500/20 bg-zinc-500/10';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button and Resolve trigger */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/mentorship/doubts"
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Doubt Board</span>
        </Link>

        {doubt.status !== 'RESOLVED' && (
          <button
            onClick={handleResolveDoubt}
            className="flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all active:scale-95"
          >
            <CheckCircle size={14} />
            <span>Mark Resolved</span>
          </button>
        )}
      </div>

      {/* Main Question Panel */}
      <div className="bg-brand-dark/40 border border-brand-border rounded-2xl p-6 md:p-8 space-y-6">
        {/* Header tags */}
        <div className="flex flex-wrap gap-3 items-center justify-between pb-4 border-b border-brand-border/40">
          <div className="space-y-1">
            <span className="text-xs font-black text-brand-purple uppercase tracking-wider">
              {doubt.subject}
            </span>
            <h2 className="text-xl md:text-2xl font-black text-white font-display tracking-tight mt-1 leading-snug">
              {doubt.questionTitle}
            </h2>
          </div>

          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${getPriorityColor()} uppercase tracking-wider`}>
              {doubt.priority} Priority
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-black border border-zinc-700 bg-zinc-800 text-zinc-300 uppercase tracking-wider">
              Status: {doubt.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Question Text */}
        <div className="space-y-4">
          <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
            {doubt.questionText}
          </p>

          {/* Attachment url if present */}
          {doubt.attachmentUrl && (
            <div className="p-3.5 rounded-xl bg-white/5 border border-brand-border/45 w-fit">
              <a
                href={doubt.attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-semibold text-brand-gold hover:underline"
              >
                <FileText size={14} />
                <span>View Attachment Reference File</span>
                <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>

        {/* Actor Info cards */}
        <div className="grid grid-cols-2 gap-4 bg-black/20 p-4 rounded-xl border border-brand-border/20 text-xs text-zinc-400">
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">Raised By</p>
            <span className="font-semibold text-white">{doubt.student?.name}</span>
          </div>
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">Assigned Mentor</p>
            <span className="font-semibold text-white">{doubt.mentor?.fullName}</span>
          </div>
        </div>
      </div>

      {/* Discussion conversation history list */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
          <span>Discussion History</span>
          <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md text-[10px]">
            {doubt.replies?.length || 0} replies
          </span>
        </h3>

        <div className="space-y-4">
          {doubt.replies?.map((reply) => {
            const isCurrentUser = reply.senderId === currentUserId;
            const replyDate = new Date(reply.createdAt).toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={reply.id}
                className={`flex gap-3 max-w-[85%] ${isCurrentUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* User avatar icon */}
                <div className="w-8 h-8 rounded-full bg-zinc-800 border border-brand-border overflow-hidden flex items-center justify-center text-[10px] font-bold text-brand-gold shrink-0">
                  {reply.sender?.profileImage ? (
                    <img src={reply.sender.profileImage} alt={reply.sender.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={14} />
                  )}
                </div>

                <div className="space-y-1">
                  {/* Name and time details */}
                  <div className={`flex items-center gap-2 text-[10px] text-zinc-500 ${isCurrentUser ? 'justify-end' : ''}`}>
                    <span className="font-bold text-zinc-300">{reply.sender?.name} ({reply.sender?.role})</span>
                    <span>•</span>
                    <span>{replyDate}</span>
                  </div>

                  {/* Message body */}
                  <div className={`p-4 rounded-2xl border text-sm leading-relaxed ${
                    isCurrentUser
                      ? 'bg-brand-purple/20 text-white border-brand-purple/35 rounded-tr-none shadow-purple-glow/5'
                      : 'bg-white/5 text-zinc-200 border-brand-border rounded-tl-none'
                  }`}>
                    <p className="whitespace-pre-line">{reply.message}</p>
                    
                    {reply.attachmentUrl && (
                      <div className="mt-3 pt-2 border-t border-brand-border/40">
                        <a
                          href={reply.attachmentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-brand-gold hover:underline"
                        >
                          <FileText size={12} />
                          <span>View attachment link</span>
                          <ExternalLink size={10} />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reply input card */}
      {doubt.status === 'RESOLVED' ? (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-center text-xs font-semibold">
          This discussion thread is resolved and closed. Re-open by updating status if you need further help.
        </div>
      ) : (
        <ReplyBox onSubmit={handlePostReply} isSubmitting={replySubmitting} />
      )}
    </div>
  );
};

export default DoubtDetails;
