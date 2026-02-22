'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Zap, Shield, Crown, LogOut, Loader2, ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [upgrading, setUpgrading] = useState<string | null>(null);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                } else {
                    router.push('/login');
                }
            } catch (error) {
                toast.error('Failed to fetch user profile');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
        router.refresh();
    };

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleUpgrade = async (plan: string) => {
        setCheckoutLoading(true);
        setUpgrading(plan);

        try {
            const res = await loadRazorpay();
            if (!res) {
                toast.error('Razorpay SDK failed to load.');
                setCheckoutLoading(false);
                return;
            }

            const orderRes = await fetch('/api/payments/razorpay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan }),
            });

            const orderData = await orderRes.json();
            if (!orderRes.ok) throw new Error(orderData.error);

            const options = {
                key: orderData.key,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'Vybex AI',
                description: `Upgrade to ${plan.replace('_', ' ')} Plan`,
                order_id: orderData.id,
                handler: async function (response: any) {
                    toast.success('Payment captured! Updating your plan...');
                    let attempts = 0;
                    const interval = setInterval(async () => {
                        attempts++;
                        const refreshRes = await fetch('/api/auth/me');
                        const data = await refreshRes.json();
                        if (data.user.plan === plan) {
                            setUser(data.user);
                            clearInterval(interval);
                            toast.success('Plan activated!');
                        }
                        if (attempts > 10) clearInterval(interval);
                    }, 3000);
                },
                prefill: { email: user.email },
                theme: { color: '#00ff41' },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error: any) {
            toast.error(error.message || 'Checkout failed');
        } finally {
            setCheckoutLoading(false);
            setUpgrading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-black text-white">
                <Loader2 className="h-8 w-8 animate-spin text-green-400" />
            </div>
        );
    }

    if (!user) return null;

    const usagePercent = (user.generationsUsed / user.monthlyGenerationLimit) * 100;

    return (
        <div className="min-h-screen bg-[#020202] text-white selection:bg-green-500/30">
            {/* Dynamic Background Glow */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-green-500/[0.03] blur-[150px] rounded-full pointer-events-none" />

            <div className="relative z-10 mx-auto max-w-7xl px-6 py-12">
                {/* Compact Header */}
                <div className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white mb-1">
                            DASHBOARD
                        </h1>
                        <p className="text-zinc-500 text-[10px] md:text-sm font-bold uppercase tracking-[0.2em]">User: <span className="text-zinc-300">{user.email.split('@')[0]}</span></p>
                    </motion.div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" className="text-zinc-500 hover:text-white hover:bg-white/5 font-bold text-[10px] md:text-xs uppercase tracking-widest px-0 md:px-4" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" /> Logout
                        </Button>
                    </div>
                </div>

                {/* Top Section: Active Plan Horizontal Bar */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-10 md:mb-12">
                    <Card className="border-white/5 bg-zinc-900/40 backdrop-blur-3xl shadow-2xl overflow-hidden">
                        <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row items-stretch md:items-center">
                                {/* Active Title */}
                                <div className="p-6 md:p-10 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-center md:min-w-[300px]">
                                    <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">Active Power Level</p>
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-3xl md:text-4xl font-black tracking-tighter capitalize text-white leading-none">
                                            {user.plan === 'none' ? 'No Plan' : (user.plan === 'free' ? 'Starter' : user.plan.replace('_', ' '))}
                                        </h2>
                                        <span className={`flex items-center gap-1.5 font-black text-[9px] md:text-[10px] px-2.5 py-1 rounded-full border ${user.plan === 'none' ? 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20' : 'text-green-400 bg-green-400/10 border-green-400/20'}`}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${user.plan === 'none' ? 'bg-zinc-500' : 'bg-green-400 animate-pulse'}`} /> {user.plan === 'none' ? 'INACTIVE' : 'ACTIVE'}
                                        </span>
                                    </div>
                                </div>

                                {/* Usage Stats (Progress) */}
                                <div className="flex-1 p-6 md:p-10 flex flex-col justify-center">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-4 gap-4 sm:gap-0">
                                        <div className="flex flex-col">
                                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">Monthly Budget</p>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-2xl md:text-3xl font-black text-white tabular-nums">{user.generationsUsed}</span>
                                                <span className="text-zinc-600 text-xs md:text-sm font-bold uppercase tracking-widest">/ {user.monthlyGenerationLimit} CREDITS</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-green-400 mb-1">
                                                {Math.max(0, user.monthlyGenerationLimit - user.generationsUsed)} REMAINING
                                            </p>
                                            {(user.plan === 'free' || user.plan === 'none') && (
                                                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                                                    Daily Cap: <span className="text-zinc-300">{user.dailyGenerationsUsed}/{user.dailyGenerationLimit}</span>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="relative h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-white/5 mb-2">
                                        <motion.div className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-600 to-green-400" initial={{ width: 0 }} animate={{ width: `${usagePercent}%` }} transition={{ duration: 1.5, ease: 'expoOut' }} />
                                    </div>
                                    {(user.plan === 'free' || user.plan === 'none') && (
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-1 bg-zinc-950 rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-zinc-500"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: user.dailyGenerationLimit > 0 ? `${(user.dailyGenerationsUsed / user.dailyGenerationLimit) * 100}%` : '0%' }}
                                                />
                                            </div>
                                            <span className="text-[8px] font-black uppercase text-zinc-600 tracking-tighter">Daily Usage</span>
                                        </div>
                                    )}
                                </div>

                                {/* Quick Action Button */}
                                <div className="p-6 md:p-10 border-t md:border-t-0 md:border-l border-white/5 flex flex-col items-center justify-center gap-3">
                                    <Button
                                        disabled={user.plan === 'none'}
                                        onClick={() => router.push('/')}
                                        className={`w-full md:w-auto h-12 md:h-14 px-8 bg-white text-black hover:bg-zinc-100 font-black text-xs md:text-sm uppercase tracking-[0.2em] group transition-all ${user.plan === 'none' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        GO TO EDITOR <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                    {user.plan === 'none' && (
                                        <p className="text-[9px] font-bold text-red-500/80 uppercase tracking-widest text-center">
                                            Plan required to access editor
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>


                {/* Middle Row: Quick Specs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {[
                        { label: 'Reset Period', value: user.plan === 'free' ? 'Daily' : 'Monthly', icon: Zap },
                        { label: 'Support Tier', value: user.plan === 'pro_plus' ? 'Elite' : 'Basic', icon: Shield },
                        { label: 'API Access', value: user.plan === 'free' ? 'Standard' : 'Priority', icon: ArrowRight },
                        { label: 'User ID', value: user._id.slice(-6).toUpperCase(), icon: Check }
                    ].map((stat, i) => (
                        <Card key={i} className="bg-white/[0.03] border-white/[0.08] p-5 flex items-center gap-4 hover:bg-white/[0.05] transition-all group/stat">
                            <div className="h-10 w-10 rounded-xl bg-white/[0.05] flex items-center justify-center text-zinc-400 group-hover/stat:text-green-400 border border-white/5 transition-colors">
                                <stat.icon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.25em] mb-1.5">{stat.label}</p>
                                <p className="text-lg font-black text-white tracking-tight">{stat.value}</p>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Section Header for Upgrade */}
                <div className="flex items-center gap-4 mb-6 md:mb-8">
                    <h2 className="text-sm md:text-lg font-black text-white uppercase tracking-[0.3em]">AVAILABLE UPGRADES</h2>
                    <div className="h-px flex-1 bg-white/5" />
                </div>

                {/* SIDE-BY-SIDE PRICING GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">

                    {/* Starter Plan Card */}
                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
                        <Card className={`border-green-500/20 bg-zinc-900 shadow-2xl relative overflow-hidden h-full flex flex-col transition-all ${user.plan === 'free' ? 'opacity-50 grayscale select-none pointer-events-none' : ''}`}>
                            <CardHeader className="p-6 md:p-8 pb-4">
                                <div className="flex flex-col gap-1 mb-4 md:mb-6">
                                    <span className="text-zinc-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em]">Entry Level</span>
                                    <div className="flex items-baseline gap-1">
                                        <CardTitle className="text-white text-4xl md:text-5xl font-black tracking-tighter">Starter</CardTitle>
                                        <span className="text-zinc-600 ml-2 font-black text-xs md:text-sm">₹1/mo</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 md:p-8 pt-0 flex-1 flex flex-col justify-between">
                                <div className="space-y-6">
                                    <div className="h-px bg-white/5" />
                                    <ul className="space-y-3 md:space-y-4">
                                        {[
                                            '7 generations per month',
                                            'Max 3 generations per day',
                                            'Standard theme access',
                                            'Basic AI logic',
                                            'Community support'
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-xs md:text-sm font-bold text-zinc-300">
                                                <Check className="h-3.5 w-3.5 md:h-4 md:w-4 text-green-500 flex-shrink-0" /> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <Button
                                    disabled={checkoutLoading || user.plan !== 'none'}
                                    onClick={() => handleUpgrade('free')}
                                    className="w-full h-12 md:h-14 bg-white/10 hover:bg-white/20 text-white font-black text-xs md:text-sm uppercase tracking-[0.2em] mt-8 md:mt-10 transition-all"
                                >
                                    {checkoutLoading && upgrading === 'free' ? <Loader2 className="animate-spin h-5 w-5" /> : user.plan === 'free' ? 'ACTIVE' : 'ACTIVATE STARTER'}
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Pro Plan Card */}
                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                        <Card className={`border-green-500/30 bg-zinc-900 shadow-2xl relative overflow-hidden h-full flex flex-col transition-all ${user.plan === 'pro' ? 'opacity-50 grayscale select-none pointer-events-none' : ''}`}>
                            <div className="absolute top-0 right-0 px-4 py-1.5 bg-green-500 text-black text-[9px] md:text-[10px] font-black uppercase tracking-tighter rounded-bl-xl shadow-lg z-20">MOST POPULAR</div>
                            <CardHeader className="p-6 md:p-8 pb-4">
                                <div className="flex flex-col gap-1 mb-4 md:mb-6">
                                    <span className="text-zinc-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em]">Intermediate Level</span>
                                    <div className="flex items-baseline gap-1">
                                        <CardTitle className="text-white text-4xl md:text-5xl font-black tracking-tighter">Pro</CardTitle>
                                        <span className="text-zinc-600 ml-2 font-black text-xs md:text-sm">₹699/mo</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 md:p-8 pt-0 flex-1 flex flex-col justify-between">
                                <div className="space-y-6">
                                    <div className="h-px bg-white/5" />
                                    <ul className="space-y-3 md:space-y-4">
                                        {[
                                            '100 generations per month',
                                            'Full-length optimized output',
                                            'No watermark on exports',
                                            'Advanced theme variations',
                                            'High-speed generation',
                                            'Priority queue access'
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-xs md:text-sm font-bold text-zinc-300">
                                                <Check className="h-3.5 w-3.5 md:h-4 md:w-4 text-green-500 flex-shrink-0" /> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <Button
                                    disabled={checkoutLoading || (user.plan !== 'free' && user.plan !== 'none')}
                                    onClick={() => handleUpgrade('pro')}
                                    className="w-full h-12 md:h-14 bg-green-500 hover:bg-green-400 text-black font-black text-xs md:text-sm uppercase tracking-[0.2em] mt-8 md:mt-10 transition-all shadow-[0_10px_30px_rgba(34,197,94,0.1)]"
                                >
                                    {checkoutLoading && upgrading === 'pro' ? <Loader2 className="animate-spin h-5 w-5" /> : user.plan === 'pro' ? 'ACTIVE' : 'ACTIVATE PRO'}
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Pro Plus Plan Card */}
                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
                        <Card className={`border-white/10 bg-zinc-900 shadow-2xl relative overflow-hidden h-full flex flex-col transition-all ${user.plan === 'pro_plus' ? 'opacity-50 grayscale select-none pointer-events-none' : ''}`}>
                            <CardHeader className="p-6 md:p-8 pb-4">
                                <div className="flex flex-col gap-1 mb-4 md:mb-6">
                                    <span className="text-zinc-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em]">Ultimate Level</span>
                                    <div className="flex items-baseline gap-1">
                                        <CardTitle className="text-white text-4xl md:text-5xl font-black tracking-tighter">Elite</CardTitle>
                                        <span className="text-zinc-600 ml-2 font-black text-xs md:text-sm">₹1,499/mo</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 md:p-8 pt-0 flex-1 flex flex-col justify-between">
                                <div className="space-y-6">
                                    <div className="h-px bg-white/5" />
                                    <ul className="space-y-3 md:space-y-4">
                                        {[
                                            '300 generations per month',
                                            'Priority API access & High limit',
                                            'Custom theme & Asset control',
                                            'Full Code editor access',
                                            'Elite 24/7 Priority support',
                                            'Early access to beta features'
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-xs md:text-sm font-bold text-zinc-300">
                                                <Check className="h-3.5 w-3.5 md:h-4 md:w-4 text-emerald-400 flex-shrink-0" /> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <Button
                                    disabled={checkoutLoading || user.plan === 'pro_plus'}
                                    onClick={() => handleUpgrade('pro_plus')}
                                    className="w-full h-12 md:h-14 bg-white text-black hover:bg-zinc-100 font-black text-xs md:text-sm uppercase tracking-[0.2em] mt-8 md:mt-10 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.05)]"
                                >
                                    {checkoutLoading && upgrading === 'pro_plus' ? <Loader2 className="animate-spin h-5 w-5" /> : user.plan === 'pro_plus' ? 'ACTIVE' : 'GO ELITE'}
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>


                    {/* When user is MAXed out */}
                    {user.plan === 'pro_plus' && (
                        <motion.div className="col-span-1 md:col-span-2 mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="bg-green-500/5 border border-green-500/10 rounded-2xl p-6 text-center text-zinc-500 text-xs font-bold uppercase tracking-widest">
                                You are currently on our highest tier. Maximum features enabled.
                            </div>
                        </motion.div>
                    )}

                </div>
            </div>
        </div>
    );
}
