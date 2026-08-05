import React, { useEffect } from 'react';
import { MessageCircle, Compass, Instagram, Youtube, Mail, Sparkles, HelpCircle } from 'lucide-react';
import Navbar from '../../components/home/Navbar.jsx';
import Footer from '../../components/home/Footer.jsx';
import Button from '../../components/ui/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const Contact = () => {
  const { isAuthenticated } = useAuth();

  const whatsappUrl = 'https://chat.whatsapp.com/EG1Xfx2JylM0SISodwhLh2?s=cl&p=a&ilr=0';
  const telegramUrl = 'https://t.me/nextgencma18';
  const instagramUrl = 'https://www.instagram.com/cma_nextgen_?utm_source=qr&igsh=MWg0cDBnZGhzZ3l2MQ==';
  const youtubeUrl = 'https://youtube.com/@nextgencma?si=W8caW7Va1D328W3z';
  const emailUrl = 'mailto:nextgencma18@gmail.com';

  useEffect(() => {
    document.title = 'Contact NextGen CMA — Official Channels';
  }, []);

  const CommunityGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
      {/* WhatsApp Card */}
      <div className="p-6 rounded-2xl bg-green-500/5 hover:bg-green-500/10 border border-green-500/20 hover:border-green-500/40 flex flex-col justify-between gap-5 transition-all duration-300">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 shrink-0">
            <MessageCircle size={24} />
          </div>
          <div>
            <h4 className="text-base font-bold text-white font-display">WhatsApp Community</h4>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Get instant study alerts, daily preparation updates, and peer discussion groups.
            </p>
          </div>
        </div>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="pt-2">
          <Button variant="gold" size="sm" className="w-full !bg-[#25D366] !text-black hover:!bg-[#20ba59] border-none font-bold">
            Join WhatsApp Community
          </Button>
        </a>
      </div>

      {/* Telegram Card */}
      <div className="p-6 rounded-2xl bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/40 flex flex-col justify-between gap-5 transition-all duration-300">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <Compass size={24} />
          </div>
          <div>
            <h4 className="text-base font-bold text-white font-display">Telegram Channel</h4>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Receive free study guides, comprehensive notes, and instant announcements.
            </p>
          </div>
        </div>
        <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="pt-2">
          <Button variant="outline" size="sm" className="w-full font-bold border-blue-500/30 text-blue-300 hover:bg-blue-500/10">
            Join Telegram Channel
          </Button>
        </a>
      </div>

      {/* Instagram Card */}
      <div className="p-6 rounded-2xl bg-pink-500/5 hover:bg-pink-500/10 border border-pink-500/20 hover:border-pink-500/40 flex flex-col justify-between gap-5 transition-all duration-300">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
            <Instagram size={24} />
          </div>
          <div>
            <h4 className="text-base font-bold text-white font-display">Follow on Instagram</h4>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Daily motivation, exam strategy reels, and insights from toppers.
            </p>
          </div>
        </div>
        <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="pt-2">
          <Button variant="outline" size="sm" className="w-full font-bold border-pink-500/30 text-pink-300 hover:bg-pink-500/10">
            Follow on Instagram
          </Button>
        </a>
      </div>

      {/* YouTube Card */}
      <div className="p-6 rounded-2xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 flex flex-col justify-between gap-5 transition-all duration-300">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
            <Youtube size={24} />
          </div>
          <div>
            <h4 className="text-base font-bold text-white font-display">Watch on YouTube</h4>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              In-depth concept lectures, previous paper analysis, and preparation strategies.
            </p>
          </div>
        </div>
        <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="pt-2">
          <Button variant="outline" size="sm" className="w-full font-bold border-red-500/30 text-red-300 hover:bg-red-500/10">
            Watch on YouTube
          </Button>
        </a>
      </div>

      {/* Email Support Card */}
      <div className="p-6 rounded-2xl bg-brand-gold/5 hover:bg-brand-gold/10 border border-brand-gold/20 hover:border-brand-gold/40 flex flex-col justify-between gap-5 transition-all duration-300 sm:col-span-2 lg:col-span-1">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold shrink-0">
            <Mail size={24} />
          </div>
          <div>
            <h4 className="text-base font-bold text-white font-display">Email Helpdesk</h4>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Send detailed queries or support requests directly to nextgencma18@gmail.com
            </p>
          </div>
        </div>
        <a href={emailUrl} className="pt-2">
          <Button variant="gold" size="sm" className="w-full font-bold">
            Email Support
          </Button>
        </a>
      </div>
    </div>
  );

  if (isAuthenticated) {
    return (
      <div className="space-y-8 animate-fade-in text-left max-w-7xl mx-auto py-2">
        <div className="space-y-2 border-b border-brand-border/40 pb-5">
          <h1 className="text-2xl md:text-3xl font-bold font-display text-white flex items-center gap-2.5">
            <HelpCircle className="text-brand-gold" /> Contact & Official Channels
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl">
            Connect directly with counselors, join active student communities, or reach out via email.
          </p>
        </div>

        <CommunityGrid />
      </div>
    );
  }

  return (
    <div className="bg-brand-dark text-white min-h-screen flex flex-col justify-between relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-purple/[0.03] blur-[150px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-gold/[0.02] blur-[150px]" />
      </div>

      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 w-full space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-xs text-brand-purple font-semibold">
            <Sparkles size={12} className="text-brand-gold" /> Connect With NextGen CMA
          </div>
          <h1 className="text-4xl sm:text-5xl font-black font-display text-white tracking-tight leading-none">
            Get In Touch with <span className="bg-gradient-to-r from-brand-gold via-white to-brand-purple bg-clip-text text-transparent">Our Counselors</span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Join our official student communities for peer discussions, daily updates, study resources, and direct support.
          </p>
        </div>

        <CommunityGrid />
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
