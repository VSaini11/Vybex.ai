'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Trash2, UploadCloud, Loader2 } from 'lucide-react';

interface PromotionCard {
    _id: string;
    title: string;
    image: string;
    order: number;
    isActive: boolean;
}

export default function AdminPromotionsPage() {
    const [cards, setCards] = useState<PromotionCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [title, setTitle] = useState('');
    const [order, setOrder] = useState(0);

    const fetchCards = async () => {
        try {
            const res = await fetch('/api/admin/promotions');
            const data = await res.json();
            if (res.ok) {
                setCards(data);
            } else {
                toast.error('Failed to load cards');
            }
        } catch (error) {
            toast.error('Error fetching cards');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCards();
    }, []);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result as string;
            if (!title) {
                toast.error('Please provide a title before uploading');
                return;
            }

            setUploading(true);
            try {
                const res = await fetch('/api/admin/promotions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, image: base64String, order }),
                });

                if (res.ok) {
                    toast.success('Card uploaded successfully');
                    setTitle('');
                    setOrder(0);
                    fetchCards();
                } else {
                    const data = await res.json();
                    toast.error(data.error || 'Failed to upload card');
                }
            } catch (error) {
                toast.error('Error uploading card');
            } finally {
                setUploading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this card?')) return;
        
        try {
            const res = await fetch(`/api/admin/promotions/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Card deleted');
                fetchCards();
            } else {
                toast.error('Failed to delete card');
            }
        } catch (error) {
            toast.error('Error deleting card');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">Manage Promotions</h1>
                    <p className="text-zinc-400 mt-2">Upload and manage cards for the login/signup slideshow.</p>
                    <p className="text-sm text-zinc-500 mt-1">Recommended dimension: 1200x800px or 1920x1080px (16:9/4:3 format).</p>
                </div>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle>Add New Card</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">Title / Alt Text</label>
                                <Input 
                                    placeholder="e.g. Vybex App Builder" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="bg-zinc-950 border-zinc-800"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">Order (Optional)</label>
                                <Input 
                                    type="number"
                                    value={order}
                                    onChange={(e) => setOrder(Number(e.target.value))}
                                    className="bg-zinc-950 border-zinc-800"
                                />
                            </div>
                        </div>
                        <div className="pt-2">
                            <Button asChild disabled={uploading} className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer w-full flex items-center gap-2">
                                <label>
                                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                                    {uploading ? 'Uploading...' : 'Upload Image & Create Card'}
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/jpeg, image/png, image/webp" 
                                        onChange={handleFileUpload}
                                        disabled={uploading}
                                    />
                                </label>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Current Cards</h2>
                    {loading ? (
                        <div className="flex items-center justify-center p-8">
                            <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
                        </div>
                    ) : cards.length === 0 ? (
                        <div className="text-center p-8 border border-dashed border-zinc-800 rounded-lg text-zinc-500">
                            No promotion cards found. Upload one above.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {cards.map(card => (
                                <Card key={card._id} className="bg-zinc-900 border-zinc-800 overflow-hidden group">
                                    <div className="aspect-video relative bg-zinc-950">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img 
                                            src={card.image} 
                                            alt={card.title}
                                            className="object-cover w-full h-full"
                                        />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Button 
                                                variant="destructive" 
                                                size="icon"
                                                onClick={() => handleDelete(card._id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <h3 className="font-medium text-white truncate">{card.title}</h3>
                                        <p className="text-xs text-zinc-500">Order: {card.order}</p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
