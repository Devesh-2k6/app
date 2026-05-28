"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Image as ImageIcon, Mic, Calendar, ArrowLeft, Loader2, StopCircle, Trash2, Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/api/errors";
import { createProduct, uploadImage } from "@/services/products";
import { ApiProductCreate, ProductCategory } from "@/types/product";

export default function AddProduct() {
  const router = useRouter();
  
  const [productName, setProductName] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [expiryDate, setExpiryDate] = useState("");
  const [category, setCategory] = useState<ProductCategory>("OTHER");
  
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [expiryImage, setExpiryImage] = useState<string | null>(null);
  const [frontImageFile, setFrontImageFile] = useState<File | null>(null);
  const [expiryImageFile, setExpiryImageFile] = useState<File | null>(null);

  const [isSurpriseBag, setIsSurpriseBag] = useState(false);
  const [autoDiscountEnabled, setAutoDiscountEnabled] = useState(false);
  const [autoDiscountMinPrice, setAutoDiscountMinPrice] = useState("");

  // Voice Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const frontImageInputRef = useRef<HTMLInputElement>(null);
  const expiryImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>, 
    setPreview: (val: string) => void,
    setFile: (file: File) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Voice Recording Logic ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Convert Blob to Base64 for submission
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          setAudioBase64(reader.result as string);
        };

        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("Microphone access denied. Please allow microphone permissions to record a voice note.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      // Explicitly stop all tracks to turn off the browser recording indicator immediately
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      setIsRecording(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  const deleteRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setAudioBase64(null);
    setRecordingTime(0);
    setIsPlaying(false);
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // --- Form Submission ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!productName || !originalPrice || !discountPrice || !quantity || !expiryDate || !frontImageFile || !expiryImageFile) {
      setError("Please fill out all mandatory fields and upload both photos.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload images first
      const uploadedFrontUrl = await uploadImage(frontImageFile);
      const uploadedExpiryUrl = await uploadImage(expiryImageFile);

      // 2. Create product with the returned URLs
      const productData: ApiProductCreate = {
        name: productName,
        original_price: parseFloat(originalPrice),
        discount_price: parseFloat(discountPrice),
        quantity: parseInt(quantity, 10),
        expiry_date: new Date(expiryDate).toISOString(),
        category,
        front_image_url: uploadedFrontUrl,
        expiry_image_url: uploadedExpiryUrl,
        voice_note_url: audioBase64, // Still base64 for now, can be updated later
        is_surprise_bag: isSurpriseBag,
        auto_discount_enabled: autoDiscountEnabled,
        auto_discount_min_price: autoDiscountMinPrice ? parseFloat(autoDiscountMinPrice) : null,
      };

      await createProduct(productData);
      
      router.push("/shop/products");
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto pb-24">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/shop" className="p-2.5 -ml-2 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 text-gray-400 hover:text-white transition lg:hidden">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">Add New Deal</h1>
          <p className="mt-1 text-sm text-gray-400 font-medium">List a near-expiry product to save it from waste.</p>
        </div>
      </div>

      <div className="bg-[#1A1A1A] rounded-3xl border border-white/5 shadow-2xl p-5 sm:p-8 relative overflow-hidden backdrop-blur-3xl bg-gradient-to-br from-[#1A1A1A] to-[#151515]">
        <form className="space-y-8" onSubmit={handleSubmit}>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-bold">
              {error}
            </div>
          )}
          
          {/* Images Section */}
          <div>
            <h3 className="text-sm font-bold text-gray-300 mb-3">Product Images <span className="text-red-500">*</span></h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Front Image */}
              <div 
                onClick={() => frontImageInputRef.current?.click()}
                className="aspect-video sm:aspect-square bg-[#141414] rounded-2xl border-2 border-dashed border-white/10 hover:border-emerald-500/30 flex flex-col items-center justify-center text-gray-400 hover:bg-white/5 transition-all duration-300 cursor-pointer relative overflow-hidden group"
              >
                {frontImage ? (
                  <img src={frontImage} alt="Front Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <ImageIcon size={32} className="mb-2 text-gray-500 group-hover:text-emerald-400 transition" />
                    <span className="text-sm font-bold text-center px-2 group-hover:text-white transition">Upload Front Image</span>
                    <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</span>
                  </>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={frontImageInputRef} 
                  onChange={(e) => handleImageUpload(e, setFrontImage, setFrontImageFile)} 
                  className="hidden" 
                />
              </div>

              {/* Expiry Image */}
              <div 
                onClick={() => expiryImageInputRef.current?.click()}
                className="aspect-video sm:aspect-square bg-[#141414] rounded-2xl border-2 border-dashed border-white/10 hover:border-emerald-500/30 flex flex-col items-center justify-center text-gray-400 hover:bg-white/5 transition-all duration-300 cursor-pointer relative overflow-hidden group"
              >
                {expiryImage ? (
                  <img src={expiryImage} alt="Expiry Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <ImageIcon size={32} className="mb-2 text-gray-500 group-hover:text-emerald-400 transition" />
                    <span className="text-sm font-bold text-center px-2 group-hover:text-white transition">Upload Expiry Date</span>
                    <span className="text-xs text-gray-500 mt-1">Clear photo of the date</span>
                  </>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={expiryImageInputRef} 
                  onChange={(e) => handleImageUpload(e, setExpiryImage, setExpiryImageFile)} 
                  className="hidden" 
                />
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-white/5"></div>

          {/* Details Section */}
          <div className="space-y-5">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-1">Product Details</h3>
            
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Product Name <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Organic Bananas Bunch" 
                className="w-full bg-[#141414] border border-white/5 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Category <span className="text-red-500">*</span></label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full bg-[#141414] border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium"
              >
                <option value="BAKERY">Bakery</option>
                <option value="DAIRY">Dairy</option>
                <option value="PRODUCE">Produce</option>
                <option value="MEAT">Meat</option>
                <option value="PANTRY">Pantry</option>
                <option value="PREPARED_FOOD">Prepared Food</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Original Price (₹) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 font-bold">₹</span>
                  </div>
                  <input 
                    type="number" 
                    step="0.01"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="0.00" 
                    className="w-full bg-[#141414] border border-white/5 rounded-xl pl-9 pr-4 py-3 text-gray-400 placeholder-gray-500 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-red-400 mb-2">Starting Discount Price (₹) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-red-400 font-bold">₹</span>
                  </div>
                  <input 
                    type="number" 
                    step="0.01"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    placeholder="0.00" 
                    className="w-full bg-red-500/5 border border-red-500/20 text-red-400 rounded-xl pl-9 pr-4 py-3 outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all font-bold"
                  />
                </div>
              </div>
            </div>

            {/* NEW FEATURES SECTION */}
            <div className="p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isSurpriseBag}
                  onChange={(e) => setIsSurpriseBag(e.target.checked)}
                  className="w-5 h-5 mt-0.5 text-emerald-500 bg-[#141414] border-white/10 rounded focus:ring-emerald-500/50"
                />
                <div>
                  <div className="font-bold text-white text-sm">List as a Surprise Bag 🛍️</div>
                  <div className="text-xs text-gray-400 mt-0.5">Sell a bundle of items for a flat rate without listing every detail.</div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer mt-3">
                <input 
                  type="checkbox" 
                  checked={autoDiscountEnabled}
                  onChange={(e) => setAutoDiscountEnabled(e.target.checked)}
                  className="w-5 h-5 mt-0.5 text-emerald-500 bg-[#141414] border-white/10 rounded focus:ring-emerald-500/50"
                />
                <div>
                  <div className="font-bold text-white text-sm">Enable Auto-Discount (Dynamic Pricing) ⏱️</div>
                  <div className="text-xs text-gray-400 mt-0.5">Automatically lower the price as expiry approaches.</div>
                </div>
              </label>

              {autoDiscountEnabled && (
                <div className="pl-8 pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">Minimum Price allowed (₹)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-gray-500 font-bold">₹</span>
                    </div>
                    <input 
                      type="number" 
                      step="0.01"
                      value={autoDiscountMinPrice}
                      onChange={(e) => setAutoDiscountMinPrice(e.target.value)}
                      placeholder="e.g. 10.00" 
                      className="w-full bg-[#141414] border border-emerald-500/20 rounded-xl pl-9 pr-4 py-2 text-white placeholder-gray-500 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-sm font-medium"
                    />
                  </div>
                  <p className="text-[11px] text-emerald-400 mt-1.5 font-medium">Price will drop from ₹{discountPrice || '0'} down to ₹{autoDiscountMinPrice || '0'} over the last 24 hours.</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Quantity Available <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  className="w-full bg-[#141414] border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Exact Expiry Date & Time <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar size={16} className="text-gray-500" />
                  </div>
                  <input 
                    type="datetime-local" 
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full bg-[#141414] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all text-sm font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Voice Note Section */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Voice Description (Optional)</label>
              
              <AnimatePresence mode="wait">
                {!audioUrl ? (
                  <motion.div
                    key="recording-interface"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    {!isRecording ? (
                      <button 
                        type="button" 
                        onClick={startRecording}
                        className="w-full flex items-center justify-center gap-2 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl px-4 py-4 font-bold transition active:scale-[0.98]"
                      >
                        <Mic size={20} className="text-emerald-400" />
                        Tap to Record Details
                      </button>
                    ) : (
                      <div className="w-full flex items-center justify-between bg-red-500/5 border border-red-500/20 rounded-xl px-4 py-3 transition">
                        <div className="flex items-center gap-3">
                          <div className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                          </div>
                          <span className="text-red-400 font-mono font-bold w-12">{formatTime(recordingTime)}</span>
                          <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Recording...</span>
                        </div>
                        <button 
                          type="button" 
                          onClick={stopRecording}
                          className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-3.5 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-red-500/20"
                        >
                          <StopCircle size={14} />
                          Stop
                        </button>
                      </div>
                    )}
                    <p className="text-[11px] text-gray-500 mt-2 text-center">Customers are more likely to buy when they hear about the product&apos;s freshness or quantity!</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="playback-interface"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full flex items-center justify-between bg-[#141414] border border-white/5 rounded-xl px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <button 
                        type="button" 
                        onClick={togglePlayback}
                        className="bg-emerald-500 hover:bg-emerald-600 text-[#111111] p-2 rounded-full transition shadow-lg shadow-emerald-500/20"
                      >
                        {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                      </button>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white">Voice Note Description</span>
                        <span className="text-[11px] text-gray-400">{formatTime(recordingTime)} recorded</span>
                      </div>
                    </div>
                    
                    {/* Hidden Audio Element for playback */}
                    <audio 
                      ref={audioRef} 
                      src={audioUrl} 
                      onEnded={() => setIsPlaying(false)} 
                      className="hidden" 
                    />

                    <button 
                      type="button" 
                      onClick={deleteRecording}
                      className="text-gray-500 hover:text-red-400 transition p-2"
                      title="Delete recording"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <motion.button 
            type="submit"
            disabled={isSubmitting}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-[#111111] font-black rounded-xl py-4 text-base tracking-wider uppercase shadow-lg shadow-emerald-500/10 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Plus size={18} />
            )}
            {isSubmitting ? "Publishing..." : "Publish Deal"}
          </motion.button>
        </form>
      </div>
    </div>
  );
}
