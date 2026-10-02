import React, { useState, useEffect } from 'react';
import { TravelMemory } from '../types/travel';
import { useAuth } from '../context/AuthContext';
import {
  uploadMemoryToFirebase,
  loadMemoriesFromFirestore,
  deleteMemoryFromFirebase,
} from '../services/firebaseService';
import {
  Camera,
  Heart,
  Plus,
  Trash2,
  Calendar,
  MapPin,
  Image as ImageIcon,
  X,
  Cloud,
  Lock,
  Loader2,
  AlertCircle,
} from 'lucide-react';

interface MemoriesSectionProps {
  onOpenAuthModal?: () => void;
}

const STORAGE_KEY = 'newphoria_memories';

const INITIAL_MEMORIES: TravelMemory[] = [
  {
    id: 'sample-1',
    travelerName: 'Vipul Reddy',
    destination: 'Goa',
    date: '2026-03-14',
    caption: 'Sunset cruise across the Mandovi river with traditional Goan folk beats playing into the twilight.',
    photoUrl: 'https://images.pexels.com/photos/237272/pexels-photo-237272.jpeg?auto=compress&cs=tinysrgb&w=800',
    createdAt: 'Mar 14, 2026',
  },
  {
    id: 'sample-2',
    travelerName: 'Ananya Sharma',
    destination: 'Ooty',
    date: '2026-02-20',
    caption: 'Riding the vintage UNESCO Nilgiri toy train as mist drifted through the eucalyptus canopy.',
    photoUrl: 'https://images.pexels.com/photos/8747755/pexels-photo-8747755.jpeg?auto=compress&cs=tinysrgb&w=800',
    createdAt: 'Feb 20, 2026',
  },
  {
    id: 'sample-3',
    travelerName: 'Karthik Raja',
    destination: 'Gokarna',
    date: '2026-01-10',
    caption: 'Peaceful morning cliff walk between Om Beach and Half Moon beach. Truly untamed Arabian coastline.',
    photoUrl: 'https://images.pexels.com/photos/103123/pexels-photo-103123.jpeg?auto=compress&cs=tinysrgb&w=800',
    createdAt: 'Jan 10, 2026',
  },
];

export const MemoriesSection: React.FC<MemoriesSectionProps> = ({ onOpenAuthModal }) => {
  const { user } = useAuth();
  const [memories, setMemories] = useState<TravelMemory[]>([]);
  const [loadingMemories, setLoadingMemories] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [travelerName, setTravelerName] = useState('');
  const [destination, setDestination] = useState('Goa');
  const [date, setDate] = useState('');
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLightboxImg, setPreviewLightboxImg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch memories from Firestore with fallback to sample memories
  useEffect(() => {
    let mounted = true;

    async function fetchMemories() {
      setLoadingMemories(true);
      try {
        if (user) {
          const cloudMemories = await loadMemoriesFromFirestore(user.uid);
          if (!mounted) return;

          if (cloudMemories.length > 0) {
            setMemories(cloudMemories);
          } else {
            // Check localStorage or show initial samples
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
              setMemories(JSON.parse(stored));
            } else {
              setMemories(INITIAL_MEMORIES);
            }
          }
        } else {
          // Check localStorage or use initial samples when unauthenticated
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            setMemories(JSON.parse(stored));
          } else {
            setMemories(INITIAL_MEMORIES);
          }
        }
      } catch (err) {
        console.warn('Could not load from Firestore, using local fallback:', err);
        if (!mounted) return;
        const stored = localStorage.getItem(STORAGE_KEY);
        setMemories(stored ? JSON.parse(stored) : INITIAL_MEMORIES);
      } finally {
        if (mounted) setLoadingMemories(false);
      }
    }

    fetchMemories();
    return () => {
      mounted = false;
    };
  }, [user]);

  // Sync display name if user logs in
  useEffect(() => {
    if (user?.displayName && !travelerName) {
      setTravelerName(user.displayName);
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setFormError('Please select a valid image file (JPEG, PNG, WebP).');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setFormError('Image size exceeds 10MB limit.');
        return;
      }

      setFormError(null);
      setSelectedFile(file);

      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleSaveMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedFile) {
      setFormError('Please upload a photo for your memory.');
      return;
    }

    // If user is not authenticated, prompt them to sign in for Cloud Storage
    if (!user) {
      if (onOpenAuthModal) {
        onOpenAuthModal();
      }
      setFormError('Please sign in or create an account to upload images to Firebase Storage.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload image to Firebase Storage and save record to Firestore
      const newMemory = await uploadMemoryToFirebase(user.uid, {
        travelerName: travelerName.trim() || user.displayName || 'Explorer',
        destination,
        date: date || new Date().toISOString().split('T')[0],
        caption: caption.trim(),
        imageFile: selectedFile,
      });

      // Update state
      setMemories((prev) => [newMemory, ...prev]);

      // Reset form
      setCaption('');
      setSelectedFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setShowAddForm(false);
    } catch (err: any) {
      console.error('Failed to upload memory:', err);
      setFormError(err.message || 'Failed to upload image to Firebase. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMemory = async (memory: TravelMemory) => {
    if (!window.confirm('Are you sure you want to delete this memory?')) {
      return;
    }

    // Check if user is owner
    if (memory.userId && user && memory.userId !== user.uid) {
      alert('You can only delete memories that you uploaded.');
      return;
    }

    try {
      if (!memory.id.startsWith('sample-')) {
        await deleteMemoryFromFirebase(user ? user.uid : memory.userId || '', memory.id, memory.storagePath);
      }
      // Update local state
      setMemories((prev) => prev.filter((m) => m.id !== memory.id));
    } catch (err) {
      console.error('Delete error:', err);
      // Still remove from UI
      setMemories((prev) => prev.filter((m) => m.id !== memory.id));
    }
  };

  return (
    <section id="memories" className="py-20 bg-stone-100/60 border-b border-stone-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-xs uppercase tracking-widest text-[#f04141] font-bold flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 fill-[#f04141]" />
              Digital Scrapbook
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
              <Cloud className="w-3 h-3 text-emerald-600" />
              Firebase Storage & Firestore
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            EXPLORE • CREATE • INSPIRE
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-600">
            Don't let beautiful memories fade. Upload your travel photos to the cloud and keep a living diary of the sights, scents, and sunsets you experienced.
          </p>

          <div className="mt-6">
            <button
              onClick={() => {
                if (!user && onOpenAuthModal) {
                  onOpenAuthModal();
                  return;
                }
                setShowAddForm(!showAddForm);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#f04141] hover:bg-[#d93030] text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
            >
              {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{showAddForm ? 'CANCEL POST' : 'ADD A NEW MEMORY'}</span>
            </button>
          </div>
        </div>

        {/* Auth prompt if not signed in */}
        {!user && (
          <div className="max-w-3xl mx-auto mb-8 p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Sign in required to post:</strong> Sign in with your account to upload and store your travel photos in Firebase Storage!
              </span>
            </div>
            {onOpenAuthModal && (
              <button
                onClick={onOpenAuthModal}
                className="shrink-0 px-3 py-1 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-lg uppercase tracking-wider text-[11px] cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>
        )}

        {/* Add Memory Modal / Form Card */}
        {showAddForm && (
          <div className="max-w-2xl mx-auto mb-16 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
              <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#f04141]" />
                <span>Upload Travel Moment to Firebase Storage</span>
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveMemory} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={travelerName}
                    onChange={(e) => setTravelerName(e.target.value)}
                    placeholder="e.g. Vipul"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Destination
                  </label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  >
                    <option value="Goa">Goa</option>
                    <option value="Gokarna">Gokarna</option>
                    <option value="Ooty">Ooty</option>
                    <option value="Pondicherry">Pondicherry</option>
                    <option value="Other">Other Region</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Date of Visit
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Upload Photo (Direct to Firebase Storage)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-stone-300 border-dashed rounded-xl hover:border-red-400 transition-colors bg-stone-50/50">
                  <div className="space-y-2 text-center">
                    {previewUrl ? (
                      <div className="relative inline-block">
                        <img
                          src={previewUrl}
                          alt="Upload preview"
                          className="h-44 w-auto rounded-lg object-cover shadow-sm mx-auto"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (previewUrl) URL.revokeObjectURL(previewUrl);
                            setPreviewUrl(null);
                            setSelectedFile(null);
                          }}
                          className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full shadow hover:bg-red-700 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="mx-auto h-10 w-10 text-stone-400" />
                        <div className="text-xs text-stone-600">
                          <label className="relative cursor-pointer font-bold text-red-600 hover:text-red-500 focus-within:outline-none">
                            <span>Select an image file</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="sr-only"
                              required
                            />
                          </label>
                          <p className="text-stone-400 text-[11px] mt-1">PNG, JPG, WebP up to 10MB</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Caption / Memory Notes
                </label>
                <textarea
                  rows={3}
                  required
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Share what made this moment unforgettable..."
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2.5 rounded-lg border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-lg bg-[#f04141] hover:bg-[#d93030] text-white text-xs font-bold uppercase tracking-wider shadow cursor-pointer transition-colors disabled:opacity-60 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading to Firebase...</span>
                    </>
                  ) : (
                    <span>Upload to Cloud</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Memories Gallery Grid */}
        {loadingMemories ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-stone-200">
            <Loader2 className="w-8 h-8 text-[#f04141] animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-stone-600">Loading travel memories from Firestore...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {memories.map((mem) => (
              <div
                key={mem.id}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div
                    onClick={() => setPreviewLightboxImg(mem.photoUrl)}
                    className="relative h-60 w-full overflow-hidden bg-stone-900 cursor-pointer"
                  >
                    <img
                      src={mem.photoUrl}
                      alt={mem.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 text-white text-xs font-medium">
                      Click to view full photo
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-sm text-white border border-white/20 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-red-400" />
                        {mem.destination}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                      <span className="font-semibold text-stone-800">{mem.travelerName}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {mem.date}
                      </span>
                    </div>

                    <p className="text-sm text-stone-700 leading-relaxed font-light">
                      "{mem.caption}"
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-stone-100 flex items-center justify-between mt-3 text-xs text-stone-400">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Cloud className="w-3 h-3 text-stone-400" />
                    {mem.storagePath ? 'Firebase Cloud' : 'Local Archive'}
                  </span>
                  {(!mem.userId || user?.uid === mem.userId) && (
                    <button
                      onClick={() => handleDeleteMemory(mem)}
                      className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                      title="Delete memory"
                      aria-label="Delete memory"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full Screen Lightbox Modal */}
      {previewLightboxImg && (
        <div
          onClick={() => setPreviewLightboxImg(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <button
            onClick={() => setPreviewLightboxImg(null)}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-2"
          >
            <X className="w-7 h-7" />
          </button>
          <img
            src={previewLightboxImg}
            alt="Full preview"
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </section>
  );
};
