import { useEffect, useState } from 'react';
import { DIMENSIONS, ROLES } from '../data/questions';

const dimColors = {
  technical: '#3b82f6',
  resume: '#8b5cf6',
  communication: '#10b981',
  portfolio: '#f59e0b',
};

const priorityOrder = { High: 0, Medium: 1, Low: 2 };

export default function ResultsScreen({ result, role, timeSpent, onRetake }) {
  const { dimScores, overallScore, level, higherThan, summary, strengths, actionPlan } = result;
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedDims, setAnimatedDims] = useState({ technical: 0, resume: 0, communication: 0, portfolio: 0 });
  const [copied, setCopied] = useState(false);

  const roleLabel = ROLES.find((r) => r.value === role)?.label || role;

  // Animate score counter
  useEffect(() => {
    let frame;
    let start = 0;
    const step = () => {
      start += 2;
      if (start >= overallScore) { setAnimatedScore(overallScore); return; }
      setAnimatedScore(start);
      frame = requestAnimationFrame(step);
    };
    const delay = setTimeout(() => { frame = requestAnimationFrame(step); }, 300);
    return () => { cancelAnimationFrame(frame); clearTimeout(delay); };
  }, [overallScore]);

  // Animate dimension bars
  useEffect(() => {
    const delay = setTimeout(() => {
      setAnimatedDims(dimScores);
    }, 500);
    return () => clearTimeout(delay);
  }, [dimScores]);

  const handleCopy = () => {
    const text = `🎯 My Interview Readiness Score: ${overallScore}/100 (${level.label})
📊 Role: ${roleLabel}
💻 Technical: ${dimScores.technical}/100
📄 Resume: ${dimScores.resume}/100
🗣️ Communication: ${dimScores.communication}/100
🗂️ Portfolio: ${dimScores.portfolio}/100
${higherThan !== undefined ? `🏆 Scored higher than ${higherThan}% of candidates!` : ''}

Assess your interview readiness in 2 minutes!`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sortedPlan = [...(actionPlan || [])].sort(
    (a, b) => (priorityOrder[a.priority] ?? 2) - (priorityOrder[b.priority] ?? 2)
  );

  return (
    <div className="glass-panel">
      {/* Header */}
      <div className="text-center mb-8">
        <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
          {roleLabel} · Completed in {Math.floor(timeSpent / 60)}m {timeSpent % 60}s
        </div>
        <h2 style={{ marginBottom: '0.25rem' }}>Your Interview Readiness</h2>
      </div>

      {/* Score Circle */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div
          style={{
            width: 160,
            height: 160,
            borderRadius: '50%',
            background: `conic-gradient(${level.color} ${animatedScore * 3.6}deg, rgba(255,255,255,0.07) 0deg)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            position: 'relative',
            transition: 'background 0.1s',
            boxShadow: `0 0 40px ${level.color}33`,
          }}
        >
          <div style={{
            position: 'absolute',
            inset: 12,
            background: '#0f172a',
            borderRadius: '50%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ fontSize: '2.75rem', fontWeight: 800, color: level.color, lineHeight: 1 }}>
              {animatedScore}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>/ 100</span>
          </div>
        </div>

        <div style={{
          display: 'inline-block',
          padding: '0.5rem 1.25rem',
          borderRadius: '99px',
          background: `${level.color}20`,
          border: `1px solid ${level.color}50`,
          fontWeight: 700,
          fontSize: '1rem',
          color: level.color,
          marginBottom: '0.75rem',
        }}>
          {level.label}
        </div>

        {higherThan !== undefined && (
          <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
            🏆 You scored higher than <strong style={{ color: '#f8fafc' }}>{higherThan}%</strong> of candidates
          </div>
        )}
      </div>

      {/* Summary */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '1.25rem',
        marginBottom: '2rem',
      }}>
        <p style={{ margin: 0, color: '#cbd5e1', lineHeight: 1.7 }}>{summary}</p>
      </div>

      {/* Dimension Breakdown */}
      <div style={{ marginBottom: '2rem' }}>
        <h3>📊 Dimension Breakdown</h3>
        {Object.entries(DIMENSIONS).map(([dim, info]) => (
          <div key={dim} className="dimension-bar-wrapper">
            <div className="dimension-header">
              <span>{info.icon} {info.label}</span>
              <span style={{ fontWeight: 700, color: dimColors[dim] }}>{dimScores[dim]}/100</span>
            </div>
            <div className="dimension-track">
              <div
                className="dimension-fill"
                style={{
                  width: `${animatedDims[dim] || 0}%`,
                  background: `linear-gradient(90deg, ${dimColors[dim]}aa, ${dimColors[dim]})`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Strengths */}
      {strengths?.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3>✅ Strengths</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {strengths.map((s, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                background: 'rgba(16, 185, 129, 0.06)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '10px',
                fontSize: '0.925rem',
                color: '#d1fae5',
              }}>
                <span>🌟</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Plan */}
      <div style={{ marginBottom: '2rem' }}>
        <h3>🚀 Your Action Plan</h3>
        {sortedPlan.map((item, i) => (
          <div
            key={i}
            className="action-card"
            style={{ borderLeftColor: dimColors[item.dimension] || '#3b82f6' }}
          >
            <div className="action-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>{DIMENSIONS[item.dimension]?.icon}</span>
                <strong style={{ fontSize: '0.95rem' }}>{item.title}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>⏰ {item.timeEstimate}</span>
                <span className={`priority-badge priority-${item.priority}`}>{item.priority}</span>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6 }}>
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* Actions Row */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={onRetake}>
          🔁 Retake Assessment
        </button>
        <button
          className="btn btn-outline"
          style={{ flex: 1 }}
          onClick={handleCopy}
        >
          {copied ? '✅ Copied!' : '📋 Share My Score'}
        </button>
      </div>
    </div>
  );
}
