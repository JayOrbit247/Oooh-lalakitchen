import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, ChevronDown } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

const faqs = [
  {
    q: 'What are your delivery hours?',
    a: 'We deliver from 8:00 AM to 11:00 PM, Monday through Sunday. Orders placed outside these hours will be processed the next business day.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Delivery typically takes 30-45 minutes depending on your location and order volume. You can track your order in real-time after placing it.',
  },
  {
    q: 'What areas do you deliver to?',
    a: 'We currently deliver to Agbelekale, Ekoro Road, Ayobo, White-House, and Megida. We are expanding to more areas soon.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept Paystack, Flutterwave, Bank Transfer, and Cash on Delivery. All online payments are secure and encrypted.',
  },
  {
    q: 'Can I cancel or modify my order?',
    a: 'Orders can be cancelled or modified within 5 minutes of placing them. Please call us immediately at 08117926084 for any changes.',
  },
  {
    q: 'Do you offer catering for events?',
    a: 'Yes! We offer catering services for events of all sizes. Contact us at onimixjay4@gmail.com or call 08117926084 to discuss your needs.',
  },
];

export default function ContactPage() {
  const { showToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Message sent! We will get back to you soon.');
    setForm({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-charcoal-50">
      <div className="gradient-charcoal py-16 text-white">
        <div className="container-padding px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl font-bold sm:text-5xl">Get In Touch</h1>
          <p className="mt-3 text-white/70">
            We're here to help. Reach out with any questions, feedback, or catering inquiries.
          </p>
        </div>
      </div>

      <div className="container-padding px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Contact Form */}
          <div className="card p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
                <MessageSquare size={24} className="text-primary-600" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-charcoal-900">Send Us a Message</h2>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-charcoal-700">Name *</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-field"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-charcoal-700">Phone</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="input-field"
                    placeholder="0812 345 6789"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-charcoal-700">Email *</label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-charcoal-700">Message *</label>
                <textarea
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="input-field min-h-[120px] resize-none"
                  placeholder="How can we help you?"
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                <Send size={18} />
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="font-serif text-xl font-bold text-charcoal-900">Contact Information</h2>
              <div className="mt-4 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="mt-0.5 shrink-0 text-primary-600" />
                  <div>
                    <p className="text-sm font-semibold text-charcoal-900">Address</p>
                    <p className="text-sm text-charcoal-600">
                      Oooh-Lala Kitchen & Food Delivery Service in Lagos<br />
                      Agbelekale, Abule-Egba<br />
                      Lagos State, Nigeria
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={20} className="mt-0.5 shrink-0 text-primary-600" />
                  <div>
                    <p className="text-sm font-semibold text-charcoal-900">Phone</p>
                    <a href="tel:08117926084" className="block text-sm text-charcoal-600 hover:text-primary-600">08117926084</a>
                    <a href="tel:08101581209" className="block text-sm text-charcoal-600 hover:text-primary-600">08101581209</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail size={20} className="mt-0.5 shrink-0 text-primary-600" />
                  <div>
                    <p className="text-sm font-semibold text-charcoal-900">Email</p>
                    <a href="mailto:onimixjay4@gmail.com" className="text-sm text-charcoal-600 hover:text-primary-600">
                      onimixjay4@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={20} className="mt-0.5 shrink-0 text-primary-600" />
                  <div>
                    <p className="text-sm font-semibold text-charcoal-900">Business Hours</p>
                    <p className="text-sm text-charcoal-600">Monday - Sunday</p>
                    <p className="text-sm text-charcoal-600">8:00 AM - 11:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="card overflow-hidden">
              <iframe
                title="Oooh-Lala Kitchen Map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=3.28%2C6.65%2C3.35%2C6.72&layer=mapnik&marker=6.6866%2C3.3167"
                className="h-64 w-full border-0"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <div className="mb-8 text-center">
            <h2 className="font-serif text-3xl font-bold text-charcoal-900">Frequently Asked Questions</h2>
            <p className="mt-2 text-charcoal-600">Find answers to common questions about our service.</p>
          </div>

          <div className="mx-auto max-w-3xl space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="font-medium text-charcoal-900">{faq.q}</span>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-charcoal-400 transition-transform ${
                      openFaq === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="animate-fade-in border-t border-charcoal-100 px-5 py-4 text-sm leading-relaxed text-charcoal-600">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
