import { useState, useCallback } from 'react';
import LandingScreen from './components/LandingScreen';
import AssessmentScreen from './components/AssessmentScreen';
import ResultsScreen from './components/ResultsScreen';
import LoadingScreen from './components/LoadingScreen';
import { scoreCandidate } from './services/aiService';

const SCREENS = { landing: 'landing', assessment: 'assessment', loading: 'loading', results: 'results' };

export default function App() {
  const [screen, setScreen] = useState(SCREENS.landing);
  const [config, setConfig] = useState({ role: 'software_engineer', resumeText: '' });
  const [result, setResult] = useState(null);
  const [timeSpent, setTimeSpent] = useState(0);

  const handleStart = useCallback((cfg) => {
    setConfig(cfg);
    setScreen(SCREENS.assessment);
  }, []);

  const handleAssessmentComplete = useCallback(
    async ({ answers, questions, timeSpent: ts }) => {
      setTimeSpent(ts);
      setScreen(SCREENS.loading);
      try {
        const scored = await scoreCandidate({
          answers,
          questions,
          role: config.role,
          resumeText: config.resumeText,
        });
        setResult(scored);
        setScreen(SCREENS.results);
      } catch (err) {
        console.error('Scoring error', err);
        setScreen(SCREENS.landing);
      }
    },
    [config]
  );

  const handleRetake = useCallback(() => {
    setResult(null);
    setScreen(SCREENS.landing);
  }, []);

  return (
    <>
      {/* Ambient background orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        {[
          { top: '-20%', left: '-10%', color: '#3b82f640', size: 600 },
          { top: '60%', right: '-15%', color: '#8b5cf640', size: 500 },
          { bottom: '-10%', left: '40%', color: '#10b98130', size: 400 },
        ].map((orb, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: orb.size,
              height: orb.size,
              borderRadius: '50%',
              background: orb.color,
              filter: 'blur(80px)',
              top: orb.top,
              left: orb.left,
              right: orb.right,
              bottom: orb.bottom,
              animation: `float${i} ${6 + i * 2}s ease-in-out infinite alternate`,
            }}
          />
        ))}
        <style>{`
          @keyframes float0 { from { transform: translateY(0px); } to { transform: translateY(30px); } }
          @keyframes float1 { from { transform: translateY(0px); } to { transform: translateY(-25px); } }
          @keyframes float2 { from { transform: translateY(0px); } to { transform: translateY(20px); } }
        `}</style>
      </div>

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 780 }}>
        {/* Brand bar */}
        <div style={{
          textAlign: 'center', marginBottom: '1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
        }}>
          <span style={{ fontSize: '1.5rem' }}>⚡</span>
          <span style={{
            fontWeight: 800, fontSize: '1.1rem',
            background: 'linear-gradient(to right, #60a5fa, #c084fc)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px',
          }}>
            InterviewIQ
          </span>
          <span style={{ fontSize: '0.75rem', color: '#334155', marginLeft: '0.25rem' }}>Beta</span>
        </div>

        {screen === SCREENS.landing && <LandingScreen onStart={handleStart} />}
        {screen === SCREENS.assessment && (
          <AssessmentScreen
            role={config.role}
            resumeText={config.resumeText}
            onComplete={handleAssessmentComplete}
          />
        )}
        {screen === SCREENS.loading && <LoadingScreen />}
        {screen === SCREENS.results && result && (
          <ResultsScreen
            result={result}
            role={config.role}
            timeSpent={timeSpent}
            onRetake={handleRetake}
          />
        )}
      </div>
    </>
  );
}
