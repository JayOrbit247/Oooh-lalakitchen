import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import BrandLogo from '@/components/BrandLogo';

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await resetPassword(email);
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <BrandLogo />
          <h1 className="mt-4 font-serif text-3xl font-bold text-charcoal-900">Reset Password</h1>
          <p className="mt-2 text-sm text-charcoal-600">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        <div className="card mt-8 p-8">
          {sent ? (
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-100">
                <CheckCircle size={32} className="text-success-600" />
              </div>
              <h2 className="mt-4 font-serif text-xl font-semibold text-charcoal-900">Check Your Email</h2>
              <p className="mt-2 text-sm text-charcoal-600">
                We've sent a password reset link to {email}
              </p>
              <Link to="/login" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary-600">
                <ArrowLeft size={16} />
                Back to login
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 rounded-xl bg-error-50 px-4 py-3 text-sm text-error-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-charcoal-700">Email</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field pl-11"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>

              <Link
                to="/login"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-charcoal-600 hover:text-primary-600"
              >
                <ArrowLeft size={16} />
                Back to login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
