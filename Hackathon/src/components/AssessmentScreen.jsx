import { useState, useEffect, useCallback } from 'react';
import { getQuestions, DIMENSIONS } from '../data/questions';

const TOTAL_TIME = 120; // 2 minutes in seconds

const dimColors = {
  technical: '#3b82f6',
  resume: '#8b5cf6',
  communication: '#10b981',
  portfolio: '#f59e0b',
};

export default function AssessmentScreen({ role, resumeText, onComplete }) {
  const questions = getQuestions(role);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [animating, setAnimating] = useState(false);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (value) => {
    setAnswers((prev) => ({ ...prev, [questions[current].id]: value }));
  };

  const goNext = () => {
    if (answers[questions[current].id] === undefined) return;
    if (current < questions.length - 1) {
      setAnimating(true);
      setTimeout(() => {
        setCurrent((c) => c + 1);
        setAnimating(false);
      }, 200);
    } else {
      handleSubmit();
    }
  };

  const goPrev = () => {
    if (current > 0) {
      setAnimating(true);
      setTimeout(() => {
        setCurrent((c) => c - 1);
        setAnimating(false);
      }, 200);
    }
  };

  const handleSubmit = useCallback(() => {
    onComplete({ answers, questions, timeSpent: TOTAL_TIME - timeLeft });
  }, [answers, questions, timeLeft, onComplete]);

  const q = questions[current];
  const progress = ((current) / questions.length) * 100;
  const isAnswered = answers[q.id] !== undefined;
  const timerDanger = timeLeft <= 30;

  return (
    <div className="glass-panel" style={{ minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
      {/* Header Bar */}
      <div className="header-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.25rem' }}>{DIMENSIONS[q.dimension].icon}</span>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: dimColors[q.dimension] }}>
            {DIMENSIONS[q.dimension].label}
          </span>
        </div>
        <div className={`timer ${timerDanger ? 'danger' : ''}`}>
          ⏱️ {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>

      {/* Step Dots */}
      <div className="step-dots">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`dot ${i < current ? 'completed' : i === current ? 'active' : ''}`}
          />
        ))}
      </div>

      {/* Question Body */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className={animating ? '' : 'animate-slide'} style={{ transition: 'opacity 0.2s', opacity: animating ? 0 : 1 }}>
          {/* Question counter + AI badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>
              Question {current + 1} of {questions.length}
            </span>
            {resumeText && (
              <span className="ai-badge">✨ AI-assisted</span>
            )}
          </div>

          {/* Question Text */}
          <h3 style={{ fontSize: '1.2rem', lineHeight: 1.5, marginBottom: '2rem', color: 'var(--text-main)' }}>
            {q.question}
          </h3>

          {/* Answer Input */}
          {q.type === 'scale' && (
            <ScaleInput
              value={answers[q.id]}
              onChange={handleAnswer}
              labels={q.scaleLabels}
              color={dimColors[q.dimension]}
            />
          )}

          {q.type === 'choice' && (
            <ChoiceInput
              options={q.options}
              value={answers[q.id]}
              onChange={handleAnswer}
              color={dimColors[q.dimension]}
            />
          )}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
        <button
          className="btn btn-outline"
          onClick={goPrev}
          disabled={current === 0}
          style={{ opacity: current === 0 ? 0.4 : 1 }}
        >
          ← Back
        </button>

        <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
          {Object.keys(answers).length}/{questions.length} answered
        </span>

        <button
          className="btn btn-primary"
          onClick={goNext}
          disabled={!isAnswered}
          style={{ opacity: isAnswered ? 1 : 0.4, minWidth: '130px' }}
        >
          {current === questions.length - 1 ? '🎯 Get Score' : 'Next →'}
        </button>
      </div>
    </div>
  );
}

// ----- Sub-components -----

function ScaleInput({ value, onChange, labels, color }) {
  const options = [0, 1, 2, 3, 4];
  return (
    <div>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '1rem' }}>
        {options.map((v) => (
          <button
            key={v}
            onClick={() => onChange(v)}
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              border: `2px solid ${value === v ? color : 'rgba(255,255,255,0.1)'}`,
              background: value === v ? `${color}25` : 'rgba(255,255,255,0.03)',
              color: value === v ? color : '#94a3b8',
              fontWeight: 700,
              fontSize: '1.1rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              transform: value === v ? 'scale(1.15)' : 'scale(1)',
            }}
          >
            {v}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', padding: '0 0.25rem' }}>
        <span>{labels[0]}</span>
        <span>{labels[1]}</span>
      </div>
    </div>
  );
}

function ChoiceInput({ options, value, onChange, color }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          style={{
            padding: '1rem 1.25rem',
            borderRadius: '12px',
            border: `2px solid ${value === opt ? color : 'rgba(255,255,255,0.08)'}`,
            background: value === opt ? `${color}15` : 'rgba(255,255,255,0.02)',
            color: value === opt ? '#f8fafc' : '#94a3b8',
            fontWeight: value === opt ? 600 : 400,
            fontSize: '1rem',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s',
            transform: value === opt ? 'translateX(4px)' : 'translateX(0)',
          }}
        >
          {value === opt ? '✓ ' : ''}{opt}
        </button>
      ))}
    </div>
  );
}
