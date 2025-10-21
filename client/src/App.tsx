export default function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px',
      textAlign: 'center'
    }}>
      <div>
        <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>P2P</h1>
        <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
          Pay 2 Play — Coming Soon
        </p>
        <button
          onClick={() => alert('App is working!')}
          style={{
            padding: '15px 40px',
            fontSize: '1.2rem',
            background: 'white',
            color: '#667eea',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Click Me to Test
        </button>
      </div>
    </div>
  );
}
