import React from 'react';
//import { useAgentStore } from '../store/agentStore';
import useDashboardStore from '../store';

const RunSummaryCard = () => {
  const { results } = useAgentStore();
  if (!results) return null;

  const { repoUrl, teamName, leaderName, branchName, totalFailures, totalFixes, cicdStatus, totalTime } = results;
  const isPassed = cicdStatus === 'PASSED';

  const minutes = Math.floor(totalTime / 60);
  const seconds = totalTime % 60;
  const timeStr = `${minutes}m ${seconds}s`;

  return (
    <div style={styles.card} className="animate-slide-up">
      <div style={styles.cardHeader}>
        <span style={styles.cardLabel}>[ RUN SUMMARY ]</span>
        <div style={{
          ...styles.cicdBadge,
          background: isPassed ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 51, 85, 0.1)',
          border: `1px solid ${isPassed ? '#00ff88' : '#ff3355'}`,
          color: isPassed ? '#00ff88' : '#ff3355',
          boxShadow: isPassed ? '0 0 20px rgba(0, 255, 136, 0.2)' : '0 0 20px rgba(255, 51, 85, 0.2)',
        }}>
          <span style={styles.badgeDot(isPassed)} />
          CI/CD {cicdStatus}
        </div>
      </div>

      <div style={styles.body}>
        <div style={styles.metaGrid}>
          <MetaItem label="REPOSITORY" value={repoUrl} mono accent />
          <MetaItem label="BRANCH CREATED" value={branchName} mono />
          <MetaItem label="TEAM" value={teamName} />
          <MetaItem label="LEADER" value={leaderName} />
        </div>

        <div style={styles.statsRow}>
          <StatBox label="FAILURES DETECTED" value={totalFailures} color="#ff3355" />
          <StatBox label="FIXES APPLIED" value={totalFixes} color="#00ff88" />
          <StatBox label="SUCCESS RATE" value={`${Math.round((totalFixes/totalFailures)*100)}%`} color="#00d4ff" />
          <StatBox label="TOTAL TIME" value={timeStr} color="#ffd700" />
        </div>
      </div>
    </div>
  );
};

const MetaItem = ({ label, value, mono, accent }) => (
  <div style={styles.metaItem}>
    <div style={styles.metaLabel}>{label}</div>
    <div style={{
      ...styles.metaValue,
      fontFamily: mono ? 'Share Tech Mono, monospace' : 'Rajdhani, sans-serif',
      color: accent ? 'var(--accent-cyan)' : 'var(--text-primary)',
      fontSize: mono ? '12px' : '14px',
      wordBreak: 'break-all',
    }}>
      {value}
    </div>
  </div>
);

const StatBox = ({ label, value, color }) => (
  <div style={{ ...styles.statBox, borderColor: color + '44' }}>
    <div style={{ ...styles.statValue, color, textShadow: `0 0 20px ${color}66` }}>
      {value}
    </div>
    <div style={styles.statLabel}>{label}</div>
    <div style={{ ...styles.statGlow, background: `linear-gradient(180deg, ${color}22 0%, transparent 100%)` }} />
  </div>
);

const styles = {
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    marginBottom: '24px',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 24px',
    borderBottom: '1px solid var(--border)',
    background: 'rgba(0, 212, 255, 0.03)',
    flexWrap: 'wrap',
    gap: '12px',
  },
  cardLabel: {
    fontFamily: 'Share Tech Mono, monospace',
    fontSize: '12px',
    color: 'var(--accent-cyan)',
    letterSpacing: '2px',
  },
  cicdBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 16px',
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '13px',
    fontWeight: '700',
    letterSpacing: '2px',
  },
  badgeDot: (isPassed) => ({
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: isPassed ? '#00ff88' : '#ff3355',
    boxShadow: `0 0 8px ${isPassed ? '#00ff88' : '#ff3355'}`,
    animation: 'pulse-glow 2s infinite',
  }),
  body: { padding: '24px' },
  metaGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '24px',
  },
  metaItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--border)',
  },
  metaLabel: {
    fontFamily: 'Share Tech Mono, monospace',
    fontSize: '10px',
    color: 'var(--text-dim)',
    letterSpacing: '2px',
  },
  metaValue: {
    fontWeight: '600',
    fontSize: '14px',
    color: 'var(--text-primary)',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
  },
  statBox: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px 16px',
    border: '1px solid',
    background: 'rgba(0,0,0,0.3)',
    overflow: 'hidden',
    gap: '8px',
  },
  statValue: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '28px',
    fontWeight: '900',
  },
  statLabel: {
    fontFamily: 'Share Tech Mono, monospace',
    fontSize: '10px',
    color: 'var(--text-dim)',
    letterSpacing: '1.5px',
    textAlign: 'center',
  },
  statGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40px',
  },
};

export default RunSummaryCard;
