/**
 * NextGen CMA — Landing Contact / Community Channels Section
 */

import { MessageCircle, Mail, Instagram, Compass, Youtube } from 'lucide-react';
import Button from '../ui/Button.jsx';

const ContactPreview = ({ data }) => {
  const whatsappUrl = 'https://chat.whatsapp.com/EG1Xfx2JylM0SISodwhLh2?s=cl&p=a&ilr=0';
  const telegramUrl = 'https://t.me/nextgencma18';
  const instagramUrl = 'https://www.instagram.com/cma_nextgen_?utm_source=qr&igsh=MWg0cDBnZGhzZ3l2MQ==';
  const youtubeUrl = 'https://youtube.com/@nextgencma?si=W8caW7Va1D328W3z';
  const emailUrl = 'mailto:nextgencma18@gmail.com';

  const sectionTitle = data?.title || 'Connect With Us';
  const sectionSub = data?.subtitle || 'Join our official student communities for peer discussions, daily updates, and study resources.';

  return (
    <section id="community" className="py-12 md:py-16 relative bg-black/40 border-t border-brand-border/40 scroll-mt-16">
      <div id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">
            {sectionTitle}
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            {sectionSub}
          </p>
        </div>

        {/* Community Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {/* WhatsApp */}
          <div className="p-5 rounded-2xl bg-green-500/5 hover:bg-green-500/10 border border-green-500/20 hover:border-green-500/40 flex flex-col justify-between gap-4 transition-all duration-300">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 shrink-0">
                <MessageCircle size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-display">WhatsApp Community</h4>
                <p className="text-xs text-zinc-400 mt-0.5">Get instant study alerts & peer discussion groups.</p>
              </div>
            </div>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="pt-2">
              <Button variant="gold" size="sm" className="w-full !bg-[#25D366] !text-black hover:!bg-[#20ba59] border-none font-bold">
                Join WhatsApp Community
              </Button>
            </a>
          </div>

          {/* Telegram */}
          <div className="p-5 rounded-2xl bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/40 flex flex-col justify-between gap-4 transition-all duration-300">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <Compass size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-display">Telegram Channel</h4>
                <p className="text-xs text-zinc-400 mt-0.5">Receive study guides, notes & instant announcements.</p>
              </div>
            </div>
            <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="pt-2">
              <Button variant="outline" size="sm" className="w-full font-bold border-blue-500/30 text-blue-300 hover:bg-blue-500/10">
                Join Telegram Channel
              </Button>
            </a>
          </div>

          {/* Instagram */}
          <div className="p-5 rounded-2xl bg-pink-500/5 hover:bg-pink-500/10 border border-pink-500/20 hover:border-pink-500/40 flex flex-col justify-between gap-4 transition-all duration-300">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
                <Instagram size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-display">Follow on Instagram</h4>
                <p className="text-xs text-zinc-400 mt-0.5">Daily motivation, strategy reels & topper insights.</p>
              </div>
            </div>
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="pt-2">
              <Button variant="outline" size="sm" className="w-full font-bold border-pink-500/30 text-pink-300 hover:bg-pink-500/10">
                Follow on Instagram
              </Button>
            </a>
          </div>

          {/* YouTube */}
          <div className="p-5 rounded-2xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 flex flex-col justify-between gap-4 transition-all duration-300">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                <Youtube size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-display">Watch on YouTube</h4>
                <p className="text-xs text-zinc-400 mt-0.5">Concept lectures, exam analysis & strategy videos.</p>
              </div>
            </div>
            <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="pt-2">
              <Button variant="outline" size="sm" className="w-full font-bold border-red-500/30 text-red-300 hover:bg-red-500/10">
                Watch on YouTube
              </Button>
            </a>
          </div>

          {/* Email Support */}
          <div className="p-5 rounded-2xl bg-brand-gold/5 hover:bg-brand-gold/10 border border-brand-gold/20 hover:border-brand-gold/40 flex flex-col justify-between gap-4 transition-all duration-300 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold shrink-0">
                <Mail size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-display">Email Helpdesk</h4>
                <p className="text-xs text-zinc-400 mt-0.5">Send detailed queries to nextgencma18@gmail.com</p>
              </div>
            </div>
            <a href={emailUrl} className="pt-2">
              <Button variant="gold" size="sm" className="w-full font-bold">
                Email Support
              </Button>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ContactPreview;
