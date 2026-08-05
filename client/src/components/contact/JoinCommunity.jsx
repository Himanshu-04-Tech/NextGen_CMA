import React from 'react';
import { MessageCircle, Compass, Mail, PhoneCall, Instagram, Youtube } from 'lucide-react';

const JoinCommunity = ({
  whatsappUrl = 'https://chat.whatsapp.com/EG1Xfx2JylM0SISodwhLh2?s=cl&p=a&ilr=0',
  telegramUrl = 'https://t.me/nextgencma18',
  instagramUrl = 'https://www.instagram.com/cma_nextgen_?utm_source=qr&igsh=MWg0cDBnZGhzZ3l2MQ==',
  youtubeUrl = 'https://youtube.com/@nextgencma?si=W8caW7Va1D328W3z',
  email = 'nextgencma18@gmail.com',
}) => {
  return (
    <div className="p-6 rounded-2xl bg-zinc-800/10 border border-brand-border/40 text-left space-y-4">
      <div className="space-y-1">
        <h3 className="text-sm font-bold font-display text-white">
          Join NextGen Communities
        </h3>
        <p className="text-zinc-500 text-xs">
          Get direct access to peer groups, resources, and live announcements.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
        {/* Join WhatsApp */}
        <a
          href="https://chat.whatsapp.com/EG1Xfx2JylM0SISodwhLh2?s=cl&p=a&ilr=0"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-black bg-[#25D366] hover:bg-[#20ba59] transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-green-500/10"
        >
          <MessageCircle size={16} /> Join WhatsApp
        </a>

        {/* Join Telegram */}
        <a
          href="https://t.me/nextgencma18"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#0088cc] hover:bg-[#0077b5] transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-500/10"
        >
          <Compass size={16} /> Join Telegram
        </a>

        {/* Follow Instagram */}
        <a
          href="https://www.instagram.com/cma_nextgen_?utm_source=qr&igsh=MWg0cDBnZGhzZ3l2MQ=="
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-pink-300 bg-pink-500/10 border border-pink-500/30 hover:bg-pink-500/20 transition-all hover:scale-[1.02] active:scale-95"
        >
          <Instagram size={16} /> Instagram
        </a>

        {/* Watch YouTube */}
        <a
          href="https://youtube.com/@nextgencma?si=W8caW7Va1D328W3z"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-red-300 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-all hover:scale-[1.02] active:scale-95"
        >
          <Youtube size={16} /> YouTube
        </a>

        {/* Email Us */}
        <a
          href="mailto:nextgencma18@gmail.com"
          className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-black bg-brand-gold hover:bg-brand-gold-dark transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-gold-glow/10 sm:col-span-2"
        >
          <Mail size={16} /> Email Us
        </a>
      </div>
    </div>
  );
};

export default JoinCommunity;
