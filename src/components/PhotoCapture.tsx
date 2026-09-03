import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, Upload, X, RefreshCw, User as UserIcon } from "lucide-react";

interface PhotoCaptureProps {
  photo: string;
  onChange: (base64: string) => void;
  size?: number;
}

export default function PhotoCapture({ photo, onChange, size = 96 }: PhotoCaptureProps) {
  const [cameraOpen, setCameraOpen] = useState(false);
  const [error, setError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraOpen(false);
    setError("");
  }, []);


  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const openCamera = async () => {
    setError("");
    setCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 480, height: 480 },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch {
      setError("Unable to access camera. Please allow camera permission or upload a photo instead.");
    }
  };

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const minDim = Math.min(video.videoWidth, video.videoHeight);
    const sx = (video.videoWidth - minDim) / 2;
    const sy = (video.videoHeight - minDim) / 2;
    canvas.width = 256;
    canvas.height = 256;
    ctx.drawImage(video, sx, sy, minDim, minDim, 0, 0, 256, 256);
    const base64 = canvas.toDataURL("image/jpeg", 0.8);
    onChange(base64);
    stopCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;
        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, 256, 256);
        onChange(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  if (cameraOpen) {
    return (
      <div className="space-y-3">
        <div className="relative overflow-hidden rounded-2xl border-2 border-sky-200 bg-slate-900" style={{ aspectRatio: "1" }}>
          <video ref={videoRef} className="h-full w-full object-cover" playsInline muted />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-3/4 w-3/4 rounded-full border-2 border-white/40" />
          </div>
        </div>
        {error && <p className="text-sm text-rose-500">{error}</p>}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={capture}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-sky-500 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600"
          >
            <Camera className="h-4 w-4" /> Capture
          </button>
          <button
            type="button"
            onClick={stopCamera}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            <X className="h-4 w-4" /> Cancel
          </button>
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <div
          className="relative shrink-0 overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100"
          style={{ width: size, height: size }}
        >
          {photo ? (
            <img src={photo} alt="Staff preview" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-300">
              <UserIcon className="h-10 w-10" />
            </div>
          )}
          {photo && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white shadow-md transition hover:bg-rose-600"
              title="Remove photo"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <button
            type="button"
            onClick={openCamera}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-sky-200 bg-sky-50 py-2.5 text-sm font-semibold text-sky-600 transition hover:bg-sky-100"
          >
            <Camera className="h-4 w-4" /> Take Photo
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            {photo ? <RefreshCw className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
            {photo ? "Change Photo" : "Upload from Gallery"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="user"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>
      {error && <p className="text-sm text-rose-500">{error}</p>}
    </div>
  );
}
