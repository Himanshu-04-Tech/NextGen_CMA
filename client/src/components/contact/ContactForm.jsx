import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Send, User, Mail, Phone, BookOpen, MessageSquare } from 'lucide-react';
import Input from '../ui/Input.jsx';
import Button from '../ui/Button.jsx';
import api from '../../services/api.js';

const ContactForm = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ mode: 'onBlur' });

  const onSubmit = async (data) => {
    // Honeypot spam protection check
    if (data.honeypot) {
      // Simulate success for bots without executing real request
      await new Promise((resolve) => setTimeout(resolve, 800));
      reset();
      navigate('/contact/success');
      return;
    }

    try {
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
      };

      const res = await api.post('/contact', payload);
      toast.success(res.data?.message || 'Message received! We will connect soon.');
      reset();
      navigate('/contact/success');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to dispatch message. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
      {/* Honeypot Spam Protection Field - Hidden from normal users */}
      <input
        type="text"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        placeholder="Do not fill this"
        {...register('honeypot')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          id="name"
          label="Full Name"
          placeholder="Enter your full name"
          leftIcon={<User size={16} />}
          error={errors.name?.message}
          {...register('name', {
            required: 'Full name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
          })}
        />

        <Input
          id="email"
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          leftIcon={<Mail size={16} />}
          error={errors.email?.message}
          {...register('email', {
            required: 'Email address is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email address',
            },
          })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          id="phone"
          label="Phone Number"
          placeholder="+91 98765 43210"
          leftIcon={<Phone size={16} />}
          error={errors.phone?.message}
          {...register('phone', {
            required: 'Phone number is required',
            pattern: {
              value: /^\+?[0-9\s\-()]{10,20}$/,
              message: 'Enter a valid phone number (minimum 10 digits)',
            },
          })}
        />

        <Input
          id="subject"
          label="Inquiry Subject"
          placeholder="Mentorship or Syllabus Advice"
          leftIcon={<BookOpen size={16} />}
          error={errors.subject?.message}
          {...register('subject', {
            required: 'Subject is required',
            minLength: { value: 3, message: 'Subject must be at least 3 characters' },
          })}
        />
      </div>

      <div>
        <label htmlFor="message" className="form-label block text-xs font-semibold text-zinc-400 mb-1.5">
          Detailed Message
        </label>
        <div className="relative">
          <span className="absolute left-3 top-3 text-zinc-500 pointer-events-none">
            <MessageSquare size={16} />
          </span>
          <textarea
            id="message"
            rows={5}
            placeholder="Please write down what you need assistance with..."
            className={`w-full bg-black/40 border rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-zinc-600 outline-none font-sans text-sm resize-none transition-all duration-300 gold-border-focus ${
              errors.message ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/30' : 'border-brand-border'
            }`}
            {...register('message', {
              required: 'Message content is required',
              minLength: { value: 10, message: 'Message must be at least 10 characters' },
            })}
          />
        </div>
        {errors.message && (
          <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
            <span>⚠</span> {errors.message.message}
          </p>
        )}
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          variant="gold"
          isLoading={isSubmitting}
          className="w-full sm:w-auto"
          leftIcon={<Send size={14} />}
        >
          Send Inquiry
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;
