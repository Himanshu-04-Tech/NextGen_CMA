import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-brand-border/40 rounded-xl bg-black/40 overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left focus:outline-none hover:bg-white/5 transition-colors"
      >
        <span className="text-xs sm:text-sm font-semibold text-white tracking-wide pr-4">
          {question}
        </span>
        <span className="text-zinc-500 shrink-0">
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>
      
      <div
        className={`transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-48 border-t border-brand-border/20' : 'max-h-0'
        }`}
      >
        <p className="p-4 text-xs sm:text-sm text-zinc-400 leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
};

const FAQPreview = ({ faqs }) => {
  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="space-y-4 text-left">
      <h3 className="text-sm font-bold font-display text-white mb-2 flex items-center gap-2">
        <HelpCircle size={16} className="text-brand-purple" /> Frequently Asked Questions
      </h3>
      <div className="space-y-2.5">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
};

export default FAQPreview;
