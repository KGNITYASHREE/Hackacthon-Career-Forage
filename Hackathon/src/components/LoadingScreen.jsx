export default function LoadingScreen() {
  return (
    <div className="glass-panel text-center" style={{ padding: '4rem 2rem' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1.5rem', animation: 'spin 1.5s linear infinite' }}>
        🧠
      </div>
      <h2 style={{ marginBottom: '0.5rem' }}>Analyzing your profile…</h2>
      <p style={{ marginBottom: '2rem' }}>
        Our AI is scoring your responses across all 4 dimensions and crafting a personalized action plan.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: 'var(--primary)',
              animation: `bounce 0.9s ${i * 0.2}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-10px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
