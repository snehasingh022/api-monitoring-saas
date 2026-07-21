import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Alert } from '../components/Alert';
import { AuthLayout } from '../components/AuthLayout';
import { Button } from '../components/Button';
import { FormInput } from '../components/FormInput';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage, mapFieldErrors } from '../utils/errors';

export function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setFieldErrors({});
    setLoading(true);

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      navigate('/login', {
        replace: true,
        state: { registered: true, email: email.trim() },
      });
    } catch (err) {
      setFieldErrors(mapFieldErrors(err));
      setError(getErrorMessage(err, 'Registration failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Register to start monitoring your websites and APIs."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-teal-800 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        {error ? <Alert message={error} /> : null}

        <FormInput
          label="Name"
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          error={fieldErrors.name}
          required
        />

        <FormInput
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          error={fieldErrors.email}
          required
        />

        <FormInput
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          error={fieldErrors.password}
          required
          minLength={8}
        />
        <p className="-mt-2 text-xs text-slate-500">
          At least 8 characters, including a letter and a number.
        </p>

        <Button type="submit" loading={loading}>
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}
