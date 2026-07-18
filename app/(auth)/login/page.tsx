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

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [cards, setCards] = useState<PromotionCard[]>([]);
    const [isLoadingCards, setIsLoadingCards] = useState(true);
    
    const router = useRouter();
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const res = await fetch('/api/admin/promotions');
                if (res.ok) {
                    const data = await res.json();
                    setCards(data);
                }
            } catch (e) {
                console.error('Failed to load promotions');
            } finally {
                setIsLoadingCards(false);
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

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success('Logged in successfully!');
                router.push('/dashboard');
                router.refresh();
            } else {
                toast.error(data.error || 'Login failed');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleMockLogin = (provider: string) => {
        toast.info(`Login with ${provider} is coming soon!`);
    };

    return (
        <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen lg:overflow-hidden bg-[#0a0a0a] text-white font-sans">
            {/* Left Side: Auth */}
            <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col justify-center items-center p-8 lg:p-16 relative">
                <div className="w-full max-w-sm flex flex-col items-center">
                    
                    <h1 className="text-3xl lg:text-4xl font-semibold text-center mb-10 tracking-tight leading-tight text-white">
                        Log in
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
                            <form onSubmit={handleLogin} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="space-y-3">
                                    <Input
                                        type="email"
                                        placeholder="Email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-12 rounded-xl border-zinc-800 bg-zinc-900/50 text-white px-4"
                                        required
                                    />
                                    <div className="space-y-1">
                                        <Input
                                            type="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="h-12 rounded-xl border-zinc-800 bg-zinc-900/50 text-white px-4"
                                            required
                                        />
                                        <div className="flex justify-end pt-1">
                                            <Link 
                                                href="/forgot-password" 
                                                className="text-xs text-zinc-500 hover:text-white transition-colors"
                                            >
                                                Forgot password?
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full h-12 rounded-xl bg-white text-black hover:bg-zinc-200" disabled={loading}>
                                    {loading ? 'Logging in...' : 'Login'}
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
                        Don&apos;t have an account? <Link href="/signup" className="text-emerald-400 hover:text-emerald-300 font-medium">Sign up</Link>
                    </p>
                </div>
            </div>

            {/* Right Side: Promotion Carousel */}
            <div className="hidden lg:block lg:w-[55%] xl:w-[60%] p-4 lg:p-6 relative bg-[#0a0a0a]">
                {/* Carousel Container */}
                <div className="w-full h-full relative rounded-[2rem] overflow-hidden" ref={emblaRef}>
                    <div className="flex touch-pan-y h-full">
                        {isLoadingCards ? (
                            <div className="flex-[0_0_100%] min-w-0 h-full bg-zinc-900/50 animate-pulse rounded-[2rem]"></div>
                        ) : cards.length > 0 ? (
                            cards.map((card) => (
                                <div className="flex-[0_0_100%] min-w-0 h-full relative" key={card._id}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img 
                                        src={card.image} 
                                        alt={card.title} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="flex-[0_0_100%] min-w-0 h-full bg-zinc-900 flex flex-col items-center justify-center text-zinc-500 rounded-[2rem]">
                                <p>No promotions active</p>
                                <p className="text-sm mt-2">Upload cards in the Admin panel</p>
                            </div>
                        )}
                    </div>
                    
                    {/* Carousel Controls Overlay */}
                    {cards.length > 1 && (
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-center gap-4 z-10">
                            <button onClick={scrollPrev} className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors border border-white/10">
                                <ArrowLeft className="w-4 h-4" />
                            </button>
                            <div className="flex gap-2">
                                {cards.map((_, i) => (
                                    <div key={i} className="w-8 h-1.5 rounded-full bg-white/30 overflow-hidden shadow-sm">
                                        <div className="h-full w-0 bg-white" />
                                    </div>
                                ))}
                            </div>
                            <button onClick={scrollNext} className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors border border-white/10">
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
