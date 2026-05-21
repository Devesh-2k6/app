"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Image as ImageIcon, Mic, Calendar, ArrowLeft, Loader2, StopCircle, Trash2, Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createProduct } from "@/services/products";
import { ApiProductCreate } from "@/types/product";

export default function AddProduct() {
  const router = useRouter();
  
  const [productName, setProductName] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [expiryDate, setExpiryDate] = useState("");
  
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [expiryImage, setExpiryImage] = useState<string | null>(null);
  
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
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

    if (!productName || !originalPrice || !discountPrice || !quantity || !expiryDate || !frontImage || !expiryImage) {
      setError("Please fill out all mandatory fields and upload both photos.");
      return;
    }

    setIsSubmitting(true);

    try {
      const productData: ApiProductCreate = {
        name: productName,
        original_price: parseFloat(originalPrice),
        discount_price: parseFloat(discountPrice),
        quantity: parseInt(quantity, 10),
        expiry_date: new Date(expiryDate).toISOString(),
        front_image_url: frontImage,
        expiry_image_url: expiryImage,
        voice_note_url: audioBase64, // Now fully supported!
      };

      // Backend assigns shop_id from your shop (auth will scope this later).
      await createProduct(productData);
      
      router.push("/shop/products");
    } catch (err: any) {
      setError(err.message || "Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto pb-24">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/shop" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition lg:hidden">
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Deal</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">List a near-expiry product to save it from waste.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 sm:p-8">
        <form className="space-y-8" onSubmit={handleSubmit}>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}
          
          {/* Images Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Product Images <span className="text-red-500">*</span></h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Front Image */}
              <div 
                onClick={() => frontImageInputRef.current?.click()}
                className="aspect-video sm:aspect-square bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer relative overflow-hidden group"
              >
                {frontImage ? (
                  <img src={frontImage} alt="Front Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <ImageIcon size={32} className="mb-2 text-gray-400 group-hover:text-emerald-500 transition" />
                    <span className="text-sm font-medium text-center px-2">Upload Front Image</span>
                    <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</span>
                  </>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={frontImageInputRef} 
                  onChange={(e) => handleImageUpload(e, setFrontImage)} 
                  className="hidden" 
                />
              </div>

              {/* Expiry Image */}
              <div 
                onClick={() => expiryImageInputRef.current?.click()}
                className="aspect-video sm:aspect-square bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer relative overflow-hidden group"
              >
                {expiryImage ? (
                  <img src={expiryImage} alt="Expiry Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <ImageIcon size={32} className="mb-2 text-gray-400 group-hover:text-emerald-500 transition" />
                    <span className="text-sm font-medium text-center px-2">Upload Expiry Date</span>
                    <span className="text-xs text-gray-400 mt-1">Clear photo of the date</span>
                    <div className="absolute inset-0 bg-red-500/5 pointer-events-none"></div>
                  </>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={expiryImageInputRef} 
                  onChange={(e) => handleImageUpload(e, setExpiryImage)} 
                  className="hidden" 
                />
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-gray-100 dark:bg-gray-700"></div>

          {/* Details Section */}
          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Product Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Product Name <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Organic Bananas Bunch" 
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Original Price (₹) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-400 font-bold">₹</span>
                  </div>
                  <input 
                    type="number" 
                    step="0.01"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="0.00" 
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl pl-9 pr-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition line-through text-gray-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-red-600 dark:text-red-400 mb-1.5">Discount Price (₹) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-red-500 font-bold">₹</span>
                  </div>
                  <input 
                    type="number" 
                    step="0.01"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    placeholder="0.00" 
                    className="w-full bg-red-50 border border-red-200 dark:bg-red-500/10 dark:border-red-500/30 rounded-xl pl-9 pr-4 py-3 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition font-bold text-red-600 dark:text-red-400"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Quantity Available <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Exact Expiry Date & Time <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar size={16} className="text-gray-400" />
                  </div>
                  <input 
                    type="datetime-local" 
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Voice Note Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Voice Description (Optional)</label>
              
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
                        className="w-full flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 rounded-xl px-4 py-4 font-medium transition hover:bg-emerald-100 dark:hover:bg-emerald-500/20 active:scale-[0.98]"
                      >
                        <Mic size={20} />
                        Tap to Record Details
                      </button>
                    ) : (
                      <div className="w-full flex items-center justify-between bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-xl px-4 py-3 transition">
                        <div className="flex items-center gap-3">
                          <div className="relative flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                          </div>
                          <span className="text-red-600 dark:text-red-400 font-bold w-12">{formatTime(recordingTime)}</span>
                          <span className="text-sm font-medium text-red-600 dark:text-red-400">Recording...</span>
                        </div>
                        <button 
                          type="button" 
                          onClick={stopRecording}
                          className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg font-medium text-sm transition shadow-sm"
                        >
                          <StopCircle size={16} />
                          Stop
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2 text-center">Customers are more likely to buy when they hear about the product&apos;s condition!</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="playback-interface"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <button 
                        type="button" 
                        onClick={togglePlayback}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-full transition shadow-sm"
                      >
                        {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                      </button>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">Voice Note</span>
                        <span className="text-xs text-gray-500">{formatTime(recordingTime)} recorded</span>
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
                      className="text-gray-400 hover:text-red-500 transition p-2"
                      title="Delete recording"
                    >
                      <Trash2 size={20} />
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
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-4 font-bold text-lg shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Plus size={20} />
            )}
            {isSubmitting ? "Publishing..." : "Publish Deal"}
          </motion.button>
        </form>
      </div>
    </div>
  );
}
