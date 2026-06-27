'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import useEmblaCarousel from 'embla-carousel-react';
import { Github, Facebook, Mail, Smartphone, ArrowRight, ArrowLeft } from 'lucide-react';

interface PromotionCard {
    _id: string;
    title: string;
    image: string;
    order: number;
}

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showEmailForm, setShowEmailForm] = useState(false);
    const staticCards: PromotionCard[] = [
        { _id: 'static-1', title: 'Showcase 1', image: '/1.png', order: -3 },
        { _id: 'static-2', title: 'Showcase 2', image: '/2.png', order: -2 },
        { _id: 'static-3', title: 'Showcase 3', image: '/3.png', order: -1 },
    ];

    const [cards, setCards] = useState<PromotionCard[]>(staticCards);
    
    const router = useRouter();
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const res = await fetch('/api/admin/promotions');
                if (res.ok) {
                    const data = await res.json();
                    setCards([...staticCards, ...data]);
                }
            } catch (e) {
                console.error('Failed to load promotions');
            }
        };
        fetchCards();
    }, []);

    // Autoplay for carousel
    useEffect(() => {
        if (!emblaApi) return;
        const interval = setInterval(() => {
            emblaApi.scrollNext();
        }, 3000);
        return () => clearInterval(interval);
    }, [emblaApi]);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success('Account created successfully!');
                router.push('/dashboard');
                router.refresh();
            } else {
                toast.error(data.error || 'Signup failed');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleMockLogin = (provider: string) => {
        toast.info(`Signup with ${provider} is coming soon!`);
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen lg:overflow-hidden bg-[#0a0a0a] text-white font-sans">
            {/* Left Side: Auth */}
            <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col justify-center items-center p-8 lg:p-16 relative">
                <div className="w-full max-w-sm flex flex-col items-center">
                    
                    <h1 className="text-3xl lg:text-4xl font-semibold text-center mb-10 tracking-tight leading-tight text-white">
                        Sign up
                    </h1>

                    {/* Social Buttons */}
                    <div className="w-full space-y-4">


                        {!showEmailForm ? (
                            <>
                                <Button 
                                    variant="outline" 
                                    onClick={() => setShowEmailForm(true)}
                                    className="w-full rounded-full h-12 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-white hover:text-white flex items-center justify-center gap-3"
                                >
                                    <Mail className="w-4 h-4 text-zinc-400" />
                                    Continue with Email
                                </Button>
                                <Button 
                                    variant="outline" 
                                    onClick={() => handleMockLogin('Phone')}
                                    className="w-full rounded-full h-12 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-white hover:text-white flex items-center justify-center gap-3"
                                >
                                    <Smartphone className="w-4 h-4 text-zinc-400" />
                                    Continue with Phone
                                </Button>
                            </>
                        ) : (
                            <form onSubmit={handleSignup} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="space-y-3">
                                    <Input
                                        type="email"
                                        placeholder="Email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-12 rounded-xl border-zinc-800 bg-zinc-900/50 text-white px-4"
                                        required
                                    />
                                    <Input
                                        type="password"
                                        placeholder="Create a Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-12 rounded-xl border-zinc-800 bg-zinc-900/50 text-white px-4"
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full h-12 rounded-xl bg-white text-black hover:bg-zinc-200" disabled={loading}>
                                    {loading ? 'Creating account...' : 'Sign Up'}
                                </Button>
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    onClick={() => setShowEmailForm(false)}
                                    className="w-full text-xs text-zinc-500 hover:text-white hover:bg-transparent"
                                >
                                    Back to options
                                </Button>
                            </form>
                        )}
                    </div>

                    <div className="mt-8 text-center space-y-1">
                        <p className="text-xs text-zinc-500">
                            By continuing, you agree to our
                        </p>
                        <p className="text-xs text-zinc-500">
                            <Link href="/terms" className="text-zinc-400 hover:text-white underline underline-offset-2">Terms of Service</Link> and <Link href="/privacy" className="text-zinc-400 hover:text-white underline underline-offset-2">Privacy Policy</Link>.
                        </p>
                    </div>
                    
                    <p className="mt-8 text-sm text-zinc-500">
                        Already have an account? <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">Log in</Link>
                    </p>
                </div>
            </div>

            {/* Right Side: Promotion Carousel */}
            <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-950 overflow-hidden flex-col items-center justify-center p-12">
                {/* Abstract background blur shapes */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]" />

                <div className="relative z-10 text-center mb-12">
                    <div className="flex items-center justify-center gap-4 mb-4 text-emerald-400">
                        <svg className="w-8 h-12 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                        <h2 className="text-5xl font-bold text-white tracking-tight">10M+ users</h2>
                        <svg className="w-8 h-12 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    </div>
                    <p className="text-lg text-blue-100 font-medium max-w-sm mx-auto">
                        worldwide building & launching real applications in minutes.
                    </p>
                </div>

                {/* Carousel Container */}
                <div className="w-full max-w-2xl relative z-10">
                    <div className="overflow-hidden rounded-2xl shadow-2xl bg-black/40 border border-white/10 backdrop-blur-sm" ref={emblaRef}>
                        <div className="flex touch-pan-y">
                            {cards.length > 0 ? (
                                cards.map((card) => (
                                    <div className="flex-[0_0_100%] min-w-0 relative aspect-[16/10]" key={card._id}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img 
                                            src={card.image} 
                                            alt={card.title} 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="flex-[0_0_100%] min-w-0 aspect-[16/10] bg-zinc-900/50 flex flex-col items-center justify-center text-zinc-500">
                                    <p>No promotions active</p>
                                    <p className="text-sm mt-2">Upload cards in the Admin panel</p>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Carousel Controls */}
                    {cards.length > 1 && (
                        <div className="flex items-center justify-center gap-4 mt-6">
                            <button onClick={scrollPrev} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors">
                                <ArrowLeft className="w-4 h-4" />
                            </button>
                            <div className="flex gap-1.5">
                                {cards.map((_, i) => (
                                    <div key={i} className="w-8 h-1.5 rounded-full bg-white/20 overflow-hidden">
                                        <div className="h-full w-0 bg-white" />
                                    </div>
                                ))}
                            </div>
                            <button onClick={scrollNext} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors">
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
