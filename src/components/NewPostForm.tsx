'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { NEIGHBORHOODS, PostType } from '@/types';

export function NewPostForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [postType, setPostType] = useState<PostType>('bloom');

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
    formData.set('postType', postType);

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

      // Navigate to forum and refresh to show the new post
      // Using replace + refresh pattern to avoid back-button issues
      router.replace('/forum');
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
            <h2 className="text-xl font-serif">
              {postType === 'bloom' ? 'Share Your Blooms' : 'Report Frost Warning'}
            </h2>
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

            {/* Post Type Selector */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setPostType('bloom');
                  setPreview(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className={`flex-1 py-2 px-4 rounded-organic text-sm font-medium transition-colors ${
                  postType === 'bloom'
                    ? 'bg-moss text-white'
                    : 'bg-parchment-200 text-charcoal-600 hover:bg-parchment-300'
                }`}
              >
                <FlowerIcon className="w-4 h-4 inline mr-2" />
                Bloom Post
              </button>
              <button
                type="button"
                onClick={() => {
                  setPostType('frost-warning');
                  setPreview(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className={`flex-1 py-2 px-4 rounded-organic text-sm font-medium transition-colors ${
                  postType === 'frost-warning'
                    ? 'bg-sky-600 text-white'
                    : 'bg-parchment-200 text-charcoal-600 hover:bg-parchment-300'
                }`}
              >
                <SnowflakeIcon className="w-4 h-4 inline mr-2" />
                Frost Warning
              </button>
            </div>

            {/* Frost Warning Info Banner */}
            {postType === 'frost-warning' && (
              <div className="bg-sky-50 border border-sky-200 text-sky-800 px-4 py-3 rounded-organic text-sm">
                <strong>Help protect our community&apos;s gardens!</strong> Report freezing temperatures
                so fellow gardeners can protect their bulbs.
              </div>
            )}

            {/* Temperature (Frost Warning only) */}
            {postType === 'frost-warning' && (
              <div>
                <label htmlFor="temperature" className="label">
                  Current Temperature <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="temperature"
                    name="temperature"
                    className="input pr-10"
                    placeholder="e.g., 28"
                    min={-50}
                    max={50}
                    required={postType === 'frost-warning'}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400">°F</span>
                </div>
              </div>
            )}

            {/* Photo Upload */}
            <div>
              <label className="label">
                Photo {postType === 'bloom' && <span className="text-red-500">*</span>}
                {postType === 'frost-warning' && <span className="text-charcoal-400 text-xs ml-1">(optional)</span>}
              </label>
              <div
                className={`border-2 border-dashed rounded-organic p-4 text-center cursor-pointer transition-colors ${
                  preview
                    ? postType === 'frost-warning' ? 'border-sky-500 bg-sky-50' : 'border-moss bg-moss-50'
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
                accept="image/jpeg,image/png,image/heic,image/heif,.jpg,.jpeg,.png,.heic,.heif"
                onChange={handleFileChange}
                className="hidden"
                required={postType === 'bloom'}
              />
              {/* Privacy Warning for Frost Warnings with Photos */}
              {postType === 'frost-warning' && preview && (
                <div className="mt-2 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-2 rounded-organic text-xs">
                  <strong>Privacy reminder:</strong> Photos may contain location metadata.
                  Consider your privacy before uploading personal photos.
                </div>
              )}
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

            {/* Title */}
            <div>
              <label htmlFor="title" className="label">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="input"
                placeholder="Give your post a title"
                maxLength={150}
                required
              />
            </div>

            {/* Body */}
            <div>
              <label htmlFor="body" className="label">
                {postType === 'bloom' ? 'Body' : 'Details'}
              </label>
              <textarea
                id="body"
                name="body"
                className="input resize-none font-mono text-sm"
                rows={postType === 'frost-warning' ? 3 : 6}
                placeholder={postType === 'bloom'
                  ? 'Share more details about your bloom... (Markdown supported)'
                  : 'Any additional details about conditions... (Markdown supported)'
                }
                maxLength={5000}
              />
              <p className="text-xs text-charcoal-400 mt-1">Supports Markdown formatting</p>
            </div>

            {/* Caption (Bloom only) */}
            {postType === 'bloom' && (
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
            )}

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

            {/* Species Guess (Bloom only) */}
            {postType === 'bloom' && (
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
            )}

            {/* Needs ID Help (Bloom only) */}
            {postType === 'bloom' && (
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
            )}

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
                className={`flex-1 ${postType === 'frost-warning' ? 'bg-sky-600 hover:bg-sky-700 text-white py-2 px-4 rounded-organic font-medium transition-colors disabled:opacity-50' : 'btn-primary'}`}
                disabled={isSubmitting || (postType === 'bloom' && !preview)}
              >
                {isSubmitting ? 'Posting...' : postType === 'bloom' ? 'Share' : 'Post Warning'}
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

function FlowerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.5c1.5-2 4-2.5 5.5-1s1 4-1 5.5M12 6.5c-1.5-2-4-2.5-5.5-1s-1 4 1 5.5M12 6.5V12m5.5 0c2-1.5 2.5-4 1-5.5M6.5 12c-2-1.5-2.5-4-1-5.5M12 12c1.5 2 4 2.5 5.5 1s1-4-1-5.5M12 12c-1.5 2-4 2.5-5.5 1s-1-4 1-5.5M12 12v6m0 0c0 1.5-1 3-3 3m3-3c0 1.5 1 3 3 3" />
    </svg>
  );
}

function SnowflakeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v20M12 2l3 3M12 2L9 5M12 22l3-3M12 22l-3-3M2 12h20M2 12l3 3M2 12l3-3M22 12l-3 3M22 12l-3-3M5.6 5.6l12.8 12.8M5.6 5.6l.7 3.7m-.7-3.7l3.7.7M18.4 18.4l-.7-3.7m.7 3.7l-3.7-.7M18.4 5.6L5.6 18.4M18.4 5.6l-3.7.7m3.7-.7l-.7 3.7M5.6 18.4l3.7-.7m-3.7.7l.7-3.7" />
    </svg>
  );
}
