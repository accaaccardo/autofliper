'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth } from '@/components/providers/AuthProvider';
import {
  CAR_MAKES, FUEL_TYPES, TRANSMISSION_TYPES, BODY_TYPES, COMMON_FEATURES, YEAR_OPTIONS
} from '@/lib/constants';
import { ArrowLeftRight, Plus, X, Upload, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const schema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  make: z.string().min(1, 'Select a make'),
  model: z.string().min(1, 'Enter model'),
  year: z.number().min(1990).max(2025),
  mileage: z.number().min(0),
  fuelType: z.string().min(1, 'Select fuel type'),
  transmission: z.string().min(1, 'Select transmission'),
  bodyType: z.string().optional(),
  color: z.string().optional(),
  price: z.number().optional().nullable(),
  priceNegotiable: z.boolean().default(false),
  description: z.string().optional(),
  openToExchange: z.boolean().default(false),
  cashAdjustment: z.boolean().default(false),
  exchangeNotes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const STEPS = ['Basic Info', 'Details', 'Photos', 'Exchange'];

export default function PostPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [lookingForMakes, setLookingForMakes] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      year: 2020,
      mileage: 0,
      openToExchange: false,
      cashAdjustment: false,
      priceNegotiable: false,
    },
  });

  const openToExchange = watch('openToExchange');

  const toggleFeature = (f: string) => {
    setSelectedFeatures(prev =>
      prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]
    );
  };

  const toggleMake = (m: string) => {
    setLookingForMakes(prev =>
      prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]
    );
  };

  const addImageUrl = (url: string) => {
    if (url && imageUrls.length < 25) {
      setImageUrls(prev => [...prev, url]);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast.error('Please login first');
      router.push('/login');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...data,
        features: selectedFeatures,
        lookingForMakes,
        lookingForModels: [],
        images: imageUrls.map((url, i) => ({ url, order: i, isPrimary: i === 0 })),
      };

      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      toast.success('Listing created!');
      router.push(`/listing/${result.listing.id}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to create listing');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-brand-600" />
          </div>
          <h1 className="font-display text-2xl font-bold text-surface-900 mb-2">Post Your Car</h1>
          <p className="text-surface-500 mb-6">You need to be logged in to post a listing.</p>
          <Link href="/login" className="btn-primary">Sign In to Continue</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="bg-white border-b border-surface-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          <h1 className="font-display text-2xl font-bold text-surface-900 mb-4">Post Your Car</h1>

          {/* Step indicator */}
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <button
                  onClick={() => i < step && setStep(i)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all
                    ${i === step ? 'bg-brand-600 text-white' :
                      i < step ? 'bg-green-100 text-green-700 cursor-pointer' :
                      'bg-surface-100 text-surface-400'}`}
                >
                  <span className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center text-[10px]">
                    {i < step ? '✓' : i + 1}
                  </span>
                  {s}
                </button>
                {i < STEPS.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-surface-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

          {/* Step 0: Basic Info */}
          {step === 0 && (
            <div className="card p-6 space-y-5">
              <h2 className="font-display text-xl font-bold text-surface-900">Basic Information</h2>

              <div>
                <label className="label">Listing Title *</label>
                <input {...register('title')} className="input" placeholder="e.g. 2020 BMW 3 Series 320d – Low Mileage" />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Make *</label>
                  <select {...register('make')} className="input">
                    <option value="">Select Make</option>
                    {CAR_MAKES.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  {errors.make && <p className="text-red-500 text-xs mt-1">{errors.make.message}</p>}
                </div>
                <div>
                  <label className="label">Model *</label>
                  <input {...register('model')} className="input" placeholder="e.g. 3 Series" />
                  {errors.model && <p className="text-red-500 text-xs mt-1">{errors.model.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Year *</label>
                  <select {...register('year', { valueAsNumber: true })} className="input">
                    {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Mileage (km) *</label>
                  <input {...register('mileage', { valueAsNumber: true })} type="number" className="input" placeholder="85000" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Fuel Type *</label>
                  <select {...register('fuelType')} className="input">
                    <option value="">Select Fuel</option>
                    {FUEL_TYPES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Transmission *</label>
                  <select {...register('transmission')} className="input">
                    <option value="">Select</option>
                    {TRANSMISSION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Body Type</label>
                  <select {...register('bodyType')} className="input">
                    <option value="">Select</option>
                    {BODY_TYPES.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Color</label>
                  <input {...register('color')} className="input" placeholder="e.g. Mineral White" />
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Details */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="card p-6 space-y-5">
                <h2 className="font-display text-xl font-bold text-surface-900">Price & Description</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Price (€)</label>
                    <input
                      {...register('price', { valueAsNumber: true })}
                      type="number"
                      className="input"
                      placeholder="Leave empty if on request"
                    />
                  </div>
                  <div className="flex items-end pb-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" {...register('priceNegotiable')} className="w-4 h-4 rounded accent-brand-600" />
                      <span className="text-sm font-medium text-surface-700">Price negotiable</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="label">Description</label>
                  <textarea
                    {...register('description')}
                    className="input min-h-[140px] resize-y"
                    placeholder="Describe your car's condition, history, extras..."
                  />
                </div>
              </div>

              <div className="card p-6">
                <h2 className="font-display text-xl font-bold text-surface-900 mb-4">Features & Equipment</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {COMMON_FEATURES.map(f => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => toggleFeature(f)}
                      className={`text-left px-3 py-2 rounded-xl text-sm font-medium border transition-all
                        ${selectedFeatures.includes(f)
                          ? 'bg-brand-600 text-white border-brand-600'
                          : 'bg-white text-surface-700 border-surface-200 hover:border-brand-300'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Photos */}
          {step === 2 && (
            <div className="card p-6 space-y-5">
              <h2 className="font-display text-xl font-bold text-surface-900">Photos</h2>
              <p className="text-surface-500 text-sm">Add image URLs (up to 25). Use Imgur, Cloudinary, or any image hosting.</p>

              <div className="flex gap-2">
                <input
                  type="url"
                  id="imgUrl"
                  className="input flex-1"
                  placeholder="https://example.com/my-car.jpg"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      addImageUrl(input.value);
                      input.value = '';
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('imgUrl') as HTMLInputElement;
                    addImageUrl(input.value);
                    input.value = '';
                  }}
                  className="btn-primary px-4"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              {imageUrls.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {imageUrls.map((url, i) => (
                    <div key={i} className="relative group aspect-square rounded-xl overflow-hidden bg-surface-100">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      {i === 0 && (
                        <div className="absolute top-1 left-1 bg-brand-600 text-white text-xs px-1.5 py-0.5 rounded font-bold">
                          Main
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => setImageUrls(prev => prev.filter((_, j) => j !== i))}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {imageUrls.length === 0 && (
                <div className="border-2 border-dashed border-surface-200 rounded-2xl p-12 text-center">
                  <Upload className="w-10 h-10 text-surface-300 mx-auto mb-3" />
                  <p className="text-surface-400 text-sm">No images added yet</p>
                  <p className="text-surface-300 text-xs mt-1">Add at least one image URL above</p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Exchange */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="card p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="font-display text-xl font-bold text-surface-900">Exchange Settings</h2>
                    <p className="text-sm text-surface-500 mt-1">This is what makes Autofliper special</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <ArrowLeftRight className="w-6 h-6 text-blue-600" />
                  </div>
                </div>

                <label className="flex items-center gap-3 p-4 rounded-2xl border-2 border-surface-200 cursor-pointer hover:border-blue-300 transition-colors mb-4">
                  <input
                    type="checkbox"
                    {...register('openToExchange')}
                    className="w-5 h-5 rounded accent-blue-600"
                  />
                  <div>
                    <p className="font-semibold text-surface-900">Open to Exchange</p>
                    <p className="text-sm text-surface-500">I'm willing to swap my car for another</p>
                  </div>
                </label>

                {openToExchange && (
                  <div className="space-y-4 pt-4 border-t border-surface-100">
                    <div>
                      <label className="label">Looking for these makes (select all that apply)</label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                        {CAR_MAKES.map(m => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => toggleMake(m)}
                            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all
                              ${lookingForMakes.includes(m)
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-surface-700 border-surface-200 hover:border-blue-300'}`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                      {lookingForMakes.length > 0 && (
                        <p className="text-xs text-blue-600 mt-2 font-medium">
                          Selected: {lookingForMakes.join(', ')}
                        </p>
                      )}
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" {...register('cashAdjustment')} className="w-4 h-4 rounded accent-blue-600" />
                      <span className="text-sm font-medium text-surface-700">Cash adjustment accepted (price difference ok)</span>
                    </label>

                    <div>
                      <label className="label">Exchange notes (optional)</label>
                      <textarea
                        {...register('exchangeNotes')}
                        className="input"
                        rows={3}
                        placeholder="e.g. Prefer similar year, clean history, happy to add cash for the right deal..."
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full py-4 text-base"
              >
                {submitting ? 'Publishing...' : '🚗 Publish Listing'}
              </button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            {step > 0 ? (
              <button type="button" onClick={() => setStep(s => s - 1)} className="btn-secondary">
                Back
              </button>
            ) : <div />}

            {step < STEPS.length - 1 && (
              <button type="button" onClick={() => setStep(s => s + 1)} className="btn-primary">
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
