import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Check, X, AlertCircle } from 'lucide-react';

export default function CameraCapture({ surfaceName, onCaptureConfirm, onClose }) {
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
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Unable to access camera device. Please grant camera permissions in your browser.');
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

    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setCapturedImage(dataUrl);

    fetch(dataUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], `${surfaceName.toLowerCase()}_surface_${Date.now()}.jpg`, {
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
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(4px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        width: '100%',
        maxWidth: '680px',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Camera size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Live Package Capture: <span style={{ color: 'var(--primary)' }}>{surfaceName} Surface</span>
            </h3>
          </div>
          <button
            onClick={() => { stopCamera(); onClose(); }}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Viewfinder */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '380px',
          backgroundColor: '#000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          {error ? (
            <div style={{ textAlign: 'center', color: '#ffffff', padding: '24px' }}>
              <AlertCircle size={36} color="var(--status-fail-text)" style={{ marginBottom: '8px' }} />
              <p style={{ fontSize: '0.9rem' }}>{error}</p>
            </div>
          ) : capturedImage ? (
            <img src={capturedImage} alt="Captured Surface" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}

          {/* Alignment Reticle */}
          {!capturedImage && !error && (
            <div style={{
              position: 'absolute',
              inset: '24px',
              border: '2px dashed rgba(255, 255, 255, 0.6)',
              borderRadius: '8px',
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px'
            }}>
              <span style={{ fontSize: '0.75rem', color: '#ffffff', backgroundColor: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '4px' }}>
                Keep package surface flat, well-lit, and within borders
              </span>
              <span style={{ fontSize: '0.75rem', color: '#ffffff', backgroundColor: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '4px' }}>
                Target Surface: {surfaceName}
              </span>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Action Controls */}
        <div style={{
          padding: '16px 20px',
          backgroundColor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '12px',
          borderTop: '1px solid var(--border-subtle)'
        }}>
          {capturedImage ? (
            <>
              <button onClick={handleRetake} className="btn-secondary">
                <RefreshCw size={15} /> Retake
              </button>
              <button onClick={handleConfirm} className="btn-primary">
                <Check size={15} /> Accept Surface Photo
              </button>
            </>
          ) : (
            <button
              onClick={handleCapture}
              className="btn-primary"
              disabled={loading || !!error}
              style={{ padding: '10px 24px' }}
            >
              <Camera size={16} /> Capture Image
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

