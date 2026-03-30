'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (res.ok) {
                setSubmitted(true);
                toast.success('Reset link sent to your email!');
            } else {
                toast.error(data.error || 'Something went wrong');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-black px-4">
            <Card className="w-full max-w-md border-zinc-800 bg-zinc-950/50 backdrop-blur-xl">
                <CardHeader>
                    <div className="mb-4">
                        <Link 
                            href="/login" 
                            className="inline-flex items-center text-xs text-zinc-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="mr-1 h-3 w-3" />
                            Back to login
                        </Link>
                    </div>
                    <CardTitle className="text-2xl font-bold text-white">Forgot Password</CardTitle>
                    <CardDescription className="text-zinc-400">
                        {submitted 
                            ? "Check your email for a link to reset your password. If you don't see it, check your spam folder."
                            : "Enter your email address and we'll send you a link to reset your password."
                        }
                    </CardDescription>
                </CardHeader>
                {!submitted && (
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">Email</label>
                                <Input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="border-zinc-800 bg-zinc-900/50 text-white"
                                    required
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full bg-white text-black hover:bg-zinc-200" disabled={loading}>
                                {loading ? 'Sending link...' : 'Send Reset Link'}
                            </Button>
                        </CardFooter>
                    </form>
                )}
                {submitted && (
                    <CardFooter>
                        <Button 
                            variant="outline" 
                            className="w-full border-zinc-800 text-white hover:bg-zinc-900"
                            onClick={() => setSubmitted(false)}
                        >
                            Try another email
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}
