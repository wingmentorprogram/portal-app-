import React from 'react';
import { Icons } from '../icons';

export type GraphicsPreset = 'low' | 'mid' | 'high' | 'macbook-air-2017';

export interface DetectionResult {
  recommendedPreset: GraphicsPreset;
  reason: string;
  deviceLabel: string;
}

interface GraphicsPresetSelectorProps {
  detection: DetectionResult;
  selectedPreset: GraphicsPreset;
  onSelect: (preset: GraphicsPreset) => void;
  onConfirm: () => void;
}

const presetDetails: Record<GraphicsPreset, { title: string; subtitle: string; badge: string }> = {
  low: {
    title: 'Low-End PC',
    subtitle: 'Reduced graphics, lighter animation load, best for older hardware.',
    badge: 'Maximum stability'
  },
  mid: {
    title: 'Mid-Range PC',
    subtitle: 'Balanced visuals and performance for everyday laptops and desktops.',
    badge: 'Recommended balance'
  },
  high: {
    title: 'High-End PC',
    subtitle: 'Full visual quality for stronger GPUs and newer desktop systems.',
    badge: 'Best visuals'
  },
  'macbook-air-2017': {
    title: 'MacBook Air 2017',
    subtitle: 'Mac-friendly lightweight profile tuned for Intel integrated graphics.',
    badge: 'Mac optimized'
  }
};

const presetOrder: GraphicsPreset[] = ['low', 'mid', 'high', 'macbook-air-2017'];

export const GraphicsPresetSelector: React.FC<GraphicsPresetSelectorProps> = ({
  detection,
  selectedPreset,
  onSelect,
  onConfirm
}) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
        zIndex: 10
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1100px',
          borderRadius: '28px',
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.92)',
          boxShadow: '0 40px 120px rgba(15,23,42,0.28)',
          border: '1px solid rgba(255,255,255,0.7)',
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 0.9fr) minmax(0, 1.1fr)'
        }}
      >
        <div
          style={{
            background: 'linear-gradient(145deg, #020817 0%, #0f172a 55%, #0b3b67 100%)',
            color: '#fff',
            padding: '3rem 2.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '1.25rem'
          }}
        >
          <img src="/logo.png" alt="WingMentor Logo" style={{ width: '220px', maxWidth: '100%' }} />
          <div style={{ letterSpacing: '0.28em', fontSize: '0.78rem', color: '#cbd5e1' }}>SYSTEM DETECTION</div>
          <h1 style={{ margin: 0, fontSize: '2rem', lineHeight: 1.1, fontWeight: 600 }}>Choose your graphics profile</h1>
          <p style={{ margin: 0, color: '#cbd5e1', lineHeight: 1.7, fontSize: '0.96rem' }}>
            Before the portal loads, select a graphics mode so WingMentor can fit your device and reduce heavy background rendering on lower-end systems.
          </p>
          <div
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '18px',
              padding: '1rem 1.1rem'
            }}
          >
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#93c5fd', marginBottom: '0.5rem' }}>
              Auto-detected recommendation
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>{presetDetails[detection.recommendedPreset].title}</div>
            <div style={{ color: '#cbd5e1', fontSize: '0.92rem', marginBottom: '0.5rem' }}>{detection.deviceLabel}</div>
            <div style={{ color: '#e2e8f0', fontSize: '0.9rem', lineHeight: 1.6 }}>{detection.reason}</div>
          </div>
        </div>

        <div style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.8rem', letterSpacing: '0.16em', color: '#94a3b8', fontWeight: 700, marginBottom: '0.75rem' }}>
              PERFORMANCE PRESET
            </div>
            <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 500, color: '#0f172a', lineHeight: 1.1 }}>
              Optimize graphics before login
            </h2>
          </div>

          <div style={{ display: 'grid', gap: '0.9rem', marginBottom: '1.75rem' }}>
            {presetOrder.map((preset) => {
              const isSelected = preset === selectedPreset;
              const isRecommended = preset === detection.recommendedPreset;
              const details = presetDetails[preset];

              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onSelect(preset)}
                  style={{
                    textAlign: 'left',
                    width: '100%',
                    borderRadius: '18px',
                    border: isSelected ? '1px solid #2563eb' : '1px solid #dbe4f0',
                    background: isSelected ? 'rgba(37,99,235,0.08)' : '#fff',
                    padding: '1rem 1.1rem',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 12px 30px rgba(37,99,235,0.12)' : '0 8px 20px rgba(15,23,42,0.04)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.35rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '999px',
                          border: isSelected ? '5px solid #2563eb' : '2px solid #94a3b8',
                          boxSizing: 'border-box',
                          display: 'inline-block'
                        }}
                      />
                      <span style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{details.title}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      {isRecommended && (
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1d4ed8', background: 'rgba(37,99,235,0.12)', padding: '0.3rem 0.6rem', borderRadius: '999px' }}>
                          Recommended
                        </span>
                      )}
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#475569', background: '#f8fafc', padding: '0.3rem 0.6rem', borderRadius: '999px' }}>
                        {details.badge}
                      </span>
                    </div>
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.6, paddingLeft: '2rem' }}>{details.subtitle}</div>
                </button>
              );
            })}
          </div>

          <div
            style={{
              borderRadius: '18px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '1rem 1.1rem',
              marginBottom: '1.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <Icons.Info style={{ width: 18, height: 18, color: '#2563eb', marginTop: '0.15rem', flexShrink: 0 }} />
              <div style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.65 }}>
                Your choice is saved on this device and used automatically next time. You can still override the recommendation manually before continuing.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onConfirm}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                padding: '1rem 1.8rem',
                borderRadius: '14px',
                border: 'none',
                background: 'linear-gradient(120deg, #0f172a 0%, #1d4ed8 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.96rem',
                cursor: 'pointer',
                boxShadow: '0 20px 45px rgba(15,23,42,0.2)'
              }}
            >
              Confirm & Optimize
              <Icons.ArrowRight style={{ width: 18, height: 18 }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
