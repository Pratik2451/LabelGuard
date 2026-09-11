import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Check, X, AlertCircle } from 'lucide-react';

export default function CameraModal({ slotName, onCaptureConfirm, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [capturedFile, setCapturedFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setError('');
    setLoading(true);
    setCapturedImage(null);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // preference for back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Unable to access camera. Please check browser permissions.');
    } finally {
      setLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setCapturedImage(dataUrl);

    // Convert dataURL to File object
    fetch(dataUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], `${slotName.toLowerCase()}_camera_scan_${Date.now()}.jpg`, {
          type: 'image/jpeg'
        });
        setCapturedFile(file);
      });
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setCapturedFile(null);
  };

  const handleConfirm = () => {
    if (capturedFile) {
      onCaptureConfirm(capturedFile);
      stopCamera();
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(12px)',
      zIndex: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="panel-outlined pulse-glow" style={{ width: '100%', maxWidth: '640px', padding: '24px', background: '#0a0d14' }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Camera size={20} color="var(--accent-purple-light)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#fff' }}>
              Camera Scan: <span style={{ color: 'var(--accent-purple-light)' }}>{slotName}</span>
            </h3>
          </div>
          <button
            onClick={() => { stopCamera(); onClose(); }}
            style={{ background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Camera Viewfinder */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '360px',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          background: '#000',
          border: '1px solid var(--border-purple)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {error ? (
            <div style={{ textAlign: 'center', color: 'var(--accent-rose)', padding: '20px' }}>
              <AlertCircle size={36} style={{ marginBottom: '8px' }} />
              <p>{error}</p>
            </div>
          ) : capturedImage ? (
            <img src={capturedImage} alt="Captured Label" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}

          {/* Futuristic Overlay reticle when scanning */}
          {!capturedImage && !error && (
            <div style={{
              position: 'absolute',
              inset: '24px',
              border: '2px dashed rgba(168, 85, 247, 0.4)',
              borderRadius: '12px',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-purple-light)', background: 'rgba(0,0,0,0.6)', padding: '4px 12px', borderRadius: '12px' }}>
                Position label inside frame
              </div>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '20px' }}>
          {capturedImage ? (
            <>
              <button onClick={handleRetake} className="btn-secondary">
                <RefreshCw size={16} /> Retake Snapshot
              </button>
              <button onClick={handleConfirm} className="btn-primary">
                <Check size={16} /> Confirm & Use Image
              </button>
            </>
          ) : (
            <button
              onClick={handleCapture}
              className="btn-primary"
              disabled={loading || !!error}
              style={{ padding: '14px 32px' }}
            >
              <Camera size={20} /> Capture Label Photo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
