'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { NEIGHBORHOODS } from '@/types';

export function NewPostForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleClose = () => {
    router.push('/forum');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Image must be less than 10MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    // Check honeypot
    if (formData.get('website')) {
      setError('Submission failed');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create post');
      }

      const post = await response.json();
      router.push(`/forum/${post.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-volcanic/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-parchment rounded-organic shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-parchment border-b border-parchment-300 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-serif">Share Your Blooms</h2>
            <button
              onClick={handleClose}
              className="text-charcoal-400 hover:text-charcoal p-1"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-organic text-sm">
                {error}
              </div>
            )}

            {/* Photo Upload */}
            <div>
              <label className="label">
                Photo <span className="text-red-500">*</span>
              </label>
              <div
                className={`border-2 border-dashed rounded-organic p-4 text-center cursor-pointer transition-colors ${
                  preview
                    ? 'border-moss bg-moss-50'
                    : 'border-charcoal-200 hover:border-moss hover:bg-moss-50'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                {preview ? (
                  <div className="relative aspect-square max-w-xs mx-auto">
                    <Image
                      src={preview}
                      alt="Preview"
                      fill
                      className="object-cover rounded-organic"
                    />
                  </div>
                ) : (
                  <div className="py-8">
                    <UploadIcon className="w-12 h-12 text-charcoal-300 mx-auto mb-3" />
                    <p className="text-charcoal-500">Click to upload a photo</p>
                    <p className="text-xs text-charcoal-400 mt-1">
                      JPEG, PNG, or HEIC up to 10MB
                    </p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                name="image"
                accept="image/jpeg,image/png,image/heic"
                onChange={handleFileChange}
                className="hidden"
                required
              />
            </div>

            {/* Display Name */}
            <div>
              <label htmlFor="displayName" className="label">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                className="input"
                placeholder="How you'd like to be known"
                maxLength={50}
                required
              />
            </div>

            {/* Caption */}
            <div>
              <label htmlFor="caption" className="label">
                Caption
              </label>
              <textarea
                id="caption"
                name="caption"
                className="input resize-none"
                rows={3}
                placeholder="Tell us about this bloom..."
                maxLength={500}
              />
              <p className="text-xs text-charcoal-400 mt-1">Max 500 characters</p>
            </div>

            {/* Neighborhood */}
            <div>
              <label htmlFor="neighborhood" className="label">
                Neighborhood
              </label>
              <select id="neighborhood" name="neighborhood" className="input">
                <option value="">Select your neighborhood</option>
                {NEIGHBORHOODS.map((n) => (
                  <option key={n.value} value={n.value}>
                    {n.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Species Guess */}
            <div>
              <label htmlFor="speciesGuess" className="label">
                I think this is...
              </label>
              <input
                type="text"
                id="speciesGuess"
                name="speciesGuess"
                className="input"
                placeholder="Your best guess at the species"
                maxLength={100}
              />
            </div>

            {/* Needs ID Help */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="needsIdHelp"
                name="needsIdHelp"
                className="w-5 h-5 rounded border-charcoal-300 text-moss focus:ring-moss"
              />
              <label htmlFor="needsIdHelp" className="text-charcoal-600">
                I&apos;d like help identifying this
              </label>
            </div>

            {/* Honeypot */}
            <div className="hidden" aria-hidden="true">
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="btn-outline flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={isSubmitting || !preview}
              >
                {isSubmitting ? 'Posting...' : 'Share'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}
