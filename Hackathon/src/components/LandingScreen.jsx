import { useState, useRef } from 'react';
import { ROLES } from '../data/questions';

export default function LandingScreen({ onStart }) {
  const [role, setRole] = useState('software_engineer');
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    setResumeFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setResumeText(e.target.result);
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="glass-panel">
      {/* Hero */}
      <div className="text-center mb-8">
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎯</div>
        <h1>Interview Readiness</h1>
        <p style={{ fontSize: '1.1rem', marginBottom: 0 }}>
          10 smart questions · 2 minutes · AI-powered personalized action plan
        </p>
      </div>

      {/* Role Selector */}
      <div className="form-group">
        <label className="form-label">🎭 Target Role</label>
        <select
          className="form-select"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          {ROLES.map((r) => (
            <option key={r.value} value={r.value} style={{ background: '#1e293b' }}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {/* Resume Upload */}
      <div className="form-group">
        <label className="form-label">
          📄 Resume Upload{' '}
          <span style={{ color: '#64748b' }}>(optional — AI reads it for personalised feedback)</span>
        </label>
        <div
          className={`upload-area ${dragActive || resumeFile ? 'drag-active' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current.click()}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".txt,.md,.pdf"
            style={{ display: 'none' }}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          {resumeFile ? (
            <>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
              <div style={{ fontWeight: 600, color: '#10b981' }}>{resumeFile.name}</div>
              <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
                AI will personalise your feedback based on your resume
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>☁️</div>
              <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>
                Drop your resume here or click to browse
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                .txt or .md recommended · .pdf also accepted
              </div>
            </>
          )}
        </div>
      </div>

      {/* CTA */}
      <button
        className="btn btn-primary w-full"
        style={{ padding: '1.1rem', fontSize: '1.1rem', marginTop: '0.5rem' }}
        onClick={() => onStart({ role, resumeText })}
      >
        <span>Start Assessment</span>
        <span>→</span>
      </button>

      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1.5rem' }}>
        {[
          { icon: '⏱️', label: '2 min max' },
          { icon: '📊', label: '4 dimensions' },
          { icon: '🤖', label: 'AI feedback' },
          { icon: '🎯', label: 'Action plan' },
        ].map((s) => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem' }}>{s.icon}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
