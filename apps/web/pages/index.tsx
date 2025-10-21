
import { useState } from 'react';

const sports = [
  { key: 'football', label: 'Football (Soccer)' },
  { key: 'cricket', label: 'Cricket' },
  { key: 'padel', label: 'Padel' },
];

export default function Landing() {
  const [sport, setSport] = useState('football');

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.nav}>
          <div style={styles.logo}>P2P</div>
          <div style={{display:'flex', gap:12}}>
            <a href="#features" style={styles.link}>Features</a>
            <a href="#venues" style={styles.link}>Venues</a>
            <a href="#download" style={styles.ctaGhost}>Download</a>
          </div>
        </div>
        <div style={styles.heroWrap}>
          <h1 style={styles.h1}>Book fields. Join games. <span style={{color:'#22c55e'}}>Play now.</span></h1>
          <p style={styles.subtitle}>
            Lahore’s all‑in‑one app for <b>football</b>, <b>cricket</b>, and <b>padel</b>. Reserve a field for your crew or
            jump into a pickup game tonight — payments and confirmations built‑in.
          </p>
          <div style={styles.heroCtas}>
            <a href="#download" style={styles.ctaPrimary}>Get the App</a>
            <a href="/dashboard" style={styles.ctaSecondary}>Venue Dashboard</a>
          </div>
          <div style={styles.badgeRow}>
            <span style={styles.badge}>Lahore Launch</span>
            <span style={styles.badge}>Instant OTP Sign‑in</span>
            <span style={styles.badge}>Secure Payments</span>
          </div>
        </div>
      </section>

      <section id="features" style={styles.selector}>
        <h2 style={styles.h2}>Choose your sport</h2>
        <div style={styles.sportRow}>
          {sports.map(s => (
            <button key={s.key} onClick={()=>setSport(s.key)} style={sport===s.key ? styles.sportBtnActive : styles.sportBtn}>
              {s.label}
            </button>
          ))}
        </div>

        <div style={styles.cardGrid}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Discover pickup games</h3>
            <p style={styles.cardBody}>See who’s playing {labelFor(sport)} tonight. Join in seconds — pay to reserve your spot.</p>
          </div>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Book the whole field</h3>
            <p style={styles.cardBody}>Lock your preferred time at verified venues across Lahore.</p>
          </div>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Leagues & seasons</h3>
            <p style={styles.cardBody}>Register teams, auto‑generate fixtures, live standings and more.</p>
          </div>
        </div>
      </section>

      <section style={styles.banner}>
        <div style={{maxWidth:980, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, flexWrap:'wrap'}}>
          <div>
            <h2 style={{fontSize:28, margin:'0 0 6px'}}>Launching in Lahore</h2>
            <p style={{margin:0, opacity:0.9}}>Early partners get featured placement, marketing support, and priority payouts.</p>
          </div>
          <a href="/dashboard" style={styles.ctaPrimary}>Partner with us</a>
        </div>
      </section>

      <section id="venues" style={styles.selector}>
        <h2 style={styles.h2}>Featured venues</h2>
        <p style={{textAlign:'center', marginTop:-8, opacity:0.8}}>Verified fields with transparent pricing and schedules.</p>
        <div style={styles.venueStrip}>
          {['DHA Sports Complex','Model Town Ground','Cantt Arena','Gulberg Padel','Futsal Range'].map(v=>(
            <div key={v} style={styles.venuePill}>{v}</div>
          ))}
        </div>
      </section>

      <section id="download" style={{...styles.selector, paddingBottom:80}}>
        <h2 style={styles.h2}>Download the App</h2>
        <p style={{textAlign:'center', marginTop:-8, opacity:0.8}}>Join games, book fields, and manage leagues from your phone.</p>
        <div style={{display:'flex', justifyContent:'center', gap:12, marginTop:16}}>
          <a href="#" style={styles.storeBtn}>App Store</a>
          <a href="#" style={styles.storeBtn}>Google Play</a>
          <a href="/games" style={styles.ctaGhost}>Open Web</a>
        </div>
      </section>

      <footer style={styles.footer}>
        <div style={{opacity:0.8}}>© {new Date().getFullYear()} P2P — Pay 2 Play</div>
        <div style={{display:'flex', gap:12}}>
          <a href="/privacy" style={styles.link}>Privacy</a>
          <a href="/terms" style={styles.link}>Terms</a>
          <a href="/contact" style={styles.link}>Contact</a>
        </div>
      </footer>
    </main>
  );
}

function labelFor(key:string){
  const m: any = { football: 'football', cricket:'cricket', padel:'padel' };
  return m[key] || 'football';
}

const styles: {[k:string]: any} = {
  page:{ fontFamily:'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial', color:'#0f172a', background:'#ffffff' },
  hero:{ padding:'32px 24px 48px', background:'radial-gradient(1200px 600px at 10% -10%,#e6ffe6,transparent), radial-gradient(800px 400px at 110% 10%,#e0f2fe,transparent), linear-gradient(180deg, #fff, #f8fafc 60%)' },
  nav:{ maxWidth:1200, margin:'0 auto 40px', display:'flex', alignItems:'center', justifyContent:'space-between' },
  logo:{ fontSize:22, fontWeight:800, letterSpacing:0.5 },
  link:{ textDecoration:'none', color:'#0f172a', opacity:0.9 },
  ctaGhost:{ padding:'10px 14px', border:'1px solid #e2e8f0', borderRadius:999, textDecoration:'none', color:'#0f172a', background:'#fff' },
  heroWrap:{ maxWidth:900, margin:'0 auto', textAlign:'center' },
  h1:{ fontSize:48, lineHeight:1.05, margin:'0 0 10px' },
  subtitle:{ fontSize:18, opacity:0.9, margin:'0 auto 16px', maxWidth:760 },
  heroCtas:{ display:'flex', gap:12, justifyContent:'center', margin:'16px 0' },
  ctaPrimary:{ display:'inline-block', background:'#22c55e', color:'#fff', padding:'12px 18px', borderRadius:12, textDecoration:'none', fontWeight:700 },
  ctaSecondary:{ display:'inline-block', background:'#111827', color:'#fff', padding:'12px 18px', borderRadius:12, textDecoration:'none', fontWeight:700 },
  badgeRow:{ display:'flex', gap:8, justifyContent:'center', marginTop:8, flexWrap:'wrap' },
  badge:{ padding:'6px 10px', background:'#f1f5f9', borderRadius:999, fontSize:12 },
  selector:{ padding:'56px 24px' },
  h2:{ fontSize:32, textAlign:'center', margin:0 },
  sportRow:{ display:'flex', justifyContent:'center', gap:8, marginTop:16, flexWrap:'wrap' },
  sportBtn:{ padding:'10px 14px', border:'1px solid #e2e8f0', borderRadius:999, background:'#fff', cursor:'pointer' },
  sportBtnActive:{ padding:'10px 14px', border:'1px solid #16a34a', borderRadius:999, background:'#dcfce7', cursor:'pointer' },
  cardGrid:{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px,1fr))', gap:16, marginTop:20, maxWidth:980, marginInline:'auto' },
  card:{ border:'1px solid #e2e8f0', borderRadius:14, padding:16, background:'#fff' },
  cardTitle:{ margin:'0 0 6px', fontSize:18 },
  cardBody:{ margin:0, opacity:0.9 },
  banner:{ background:'#0ea5e9', color:'#fff', padding:'24px 16px' },
  venueStrip:{ display:'flex', justifyContent:'center', gap:10, marginTop:16, flexWrap:'wrap' },
  venuePill:{ padding:'10px 14px', background:'#f1f5f9', borderRadius:999, border:'1px solid #e2e8f0' },
  storeBtn:{ display:'inline-block', padding:'10px 14px', background:'#111827', color:'#fff', textDecoration:'none', borderRadius:12 },
  footer:{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 24px', borderTop:'1px solid #e2e8f0' }
};
