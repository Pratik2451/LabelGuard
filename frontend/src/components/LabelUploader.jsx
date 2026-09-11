import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, X, Sparkles, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function LabelUploader({ token, onScanComplete }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');

  const handleFileSelect = (files) => {
    setError('');
    const newFiles = Array.from(files);
    const combined = [...selectedFiles, ...newFiles].slice(0, 3); // max 3 images

    if (combined.length < 2) {
      setError('Please upload at least 2 product label images (e.g. Front & Back packaging)');
    }

    setSelectedFiles(combined);

    // Create thumbnail previews
    const newPreviews = combined.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const handleRemove = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    setPreviews(updatedPreviews);
    if (updatedFiles.length < 2) {
      setError('Please upload at least 2 product label images');
    } else {
      setError('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleUploadAndScan = async () => {
    if (selectedFiles.length < 2 || selectedFiles.length > 3) {
      setError('Please select between 2 and 3 label images to perform an inspection.');
      return;
    }

    setError('');
    setLoading(true);
    setStatusMessage('Uploading images & running PaddleOCR engine...');

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('images', file);
    });

    try {
      const res = await axios.post('/api/v1/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      setStatusMessage('Structured data extracted successfully!');
      if (res.data && res.data.data) {
        onScanComplete(res.data.data);
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to scan product label images.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '840px', margin: '40px auto 0', padding: '0 16px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '12px', background: 'linear-gradient(135deg, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Inspect Product Label Compliance
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Upload 2 to 3 product label images (Front, Back, Side). PaddleOCR will extract declarations and verify Indian Legal Metrology compliance rules.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '32px' }}>
        {/* Drag & Drop Area */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          style={{
            border: '2px dashed rgba(99, 102, 241, 0.4)',
            borderRadius: 'var(--radius-lg)',
            padding: '40px 20px',
            textAlign: 'center',
            background: 'rgba(15, 23, 42, 0.4)',
            cursor: 'pointer',
            transition: 'all 0.25s ease'
          }}
          onClick={() => document.getElementById('fileInput').click()}
        >
          <input
            id="fileInput"
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/webp"
            style={{ display: 'none' }}
            onChange={(e) => handleFileSelect(e.target.files)}
          />
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(99, 102, 241, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            color: 'var(--primary-indigo)'
          }}>
            <UploadCloud size={32} />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '6px' }}>
            Click or drag product label images here
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>
            Supports JPG, PNG, WEBP (Minimum 2, Maximum 3 images per inspection)
          </p>
        </div>

        {/* Selected Images Grid */}
        {selectedFiles.length > 0 && (
          <div style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                Selected Images ({selectedFiles.length}/3)
              </span>
              {selectedFiles.length < 2 && (
                <span className="badge badge-warning">Add {2 - selectedFiles.length} more image</span>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {previews.map((src, index) => (
                <div key={index} style={{
                  position: 'relative',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  border: '1px solid var(--border-subtle)',
                  height: '140px',
                  background: '#000'
                }}>
                  <img
                    src={src}
                    alt={`Preview ${index + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRemove(index); }}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'rgba(0, 0, 0, 0.75)',
                      border: 'none',
                      color: '#fff',
                      borderRadius: '50%',
                      width: '26px',
                      height: '26px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <X size={14} />
                  </button>
                  <div style={{
                    position: 'absolute',
                    bottom: '6px',
                    left: '8px',
                    fontSize: '0.7rem',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: 'rgba(0,0,0,0.6)',
                    color: '#fff'
                  }}>
                    Image #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div style={{
            marginTop: '20px',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: '10px',
            padding: '12px 16px',
            color: 'var(--accent-rose)',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Scan Trigger Button */}
        <div style={{ marginTop: '28px', textAlign: 'center' }}>
          <button
            onClick={handleUploadAndScan}
            className="glass-button"
            style={{ width: '100%', padding: '16px', justifyContent: 'center', fontSize: '1.05rem' }}
            disabled={loading || selectedFiles.length < 2}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>{statusMessage}</span>
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Run Legal Metrology Inspection
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
