import React, { useRef, useState, useEffect } from 'react';
import { X, RefreshCw, Check, Loader2 } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (imageDataUrl: string) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Prefer the environment (rear) camera for food photos
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
            facingMode: 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
        }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsLoading(false);
    } catch (err) {
      setError('Unable to access camera. Please ensure permissions are granted.');
      setIsLoading(false);
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        // Draw the video frame to the canvas (flip if using front camera usually, but standard here)
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        // Convert to data URL (JPEG for better compression on photos)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedImage(dataUrl);
      }
    }
  };

  const retake = () => {
    setCapturedImage(null);
  };

  const confirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center sm:p-4 animate-fade-in-up">
        {/* Header/Close */}
        <div className="absolute top-4 right-4 z-20">
            <button 
                onClick={onClose} 
                className="p-3 bg-black/50 text-white rounded-full hover:bg-white/20 backdrop-blur-md transition-colors border border-white/10"
                aria-label="Close Camera"
            >
                <X className="w-6 h-6" />
            </button>
        </div>

        <div className="relative w-full max-w-lg aspect-[3/4] sm:rounded-[2rem] overflow-hidden bg-slate-900 shadow-2xl ring-1 ring-white/10">
            {error ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white">
                    <p className="mb-6 text-lg font-medium opacity-80">{error}</p>
                    <button 
                        onClick={startCamera} 
                        className="px-8 py-3 bg-orange-600 rounded-full font-bold hover:bg-orange-500 transition-colors"
                    >
                        Retry Camera
                    </button>
                </div>
            ) : (
                <>
                   {!capturedImage ? (
                        <video 
                            ref={videoRef} 
                            autoPlay 
                            playsInline 
                            className="w-full h-full object-cover"
                        />
                   ) : (
                        <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                   )}
                   
                   {/* Hidden Canvas for Capture */}
                   <canvas ref={canvasRef} className="hidden" />

                   {/* Controls Overlay */}
                   <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center gap-12 pt-24">
                        {!capturedImage ? (
                            <button 
                                onClick={takePhoto}
                                className="w-20 h-20 rounded-full border-[5px] border-white flex items-center justify-center bg-white/20 hover:bg-white/40 active:scale-90 transition-all shadow-lg"
                                aria-label="Capture Photo"
                            >
                                <div className="w-16 h-16 bg-white rounded-full shadow-inner"></div>
                            </button>
                        ) : (
                            <>
                                <button 
                                    onClick={retake}
                                    className="flex flex-col items-center gap-2 text-white opacity-80 hover:opacity-100 transition-opacity group"
                                >
                                    <div className="p-4 bg-slate-800 rounded-full border border-slate-700 group-hover:bg-slate-700">
                                        <RefreshCw className="w-6 h-6" />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-wide">Retake</span>
                                </button>
                                
                                <button 
                                    onClick={confirm}
                                    className="flex flex-col items-center gap-2 text-white hover:text-green-400 transition-colors group"
                                >
                                    <div className="p-4 bg-green-500 text-white rounded-full shadow-lg shadow-green-500/30 group-hover:bg-green-600 transition-all transform group-hover:scale-105 border border-green-400">
                                        <Check className="w-8 h-8" />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-wide">Use Photo</span>
                                </button>
                            </>
                        )}
                   </div>
                </>
            )}
            
            {isLoading && !error && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-10">
                    <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
                </div>
            )}
        </div>
    </div>
  );
};

export default CameraCapture;