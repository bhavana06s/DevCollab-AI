import React from 'react';
//import { useAgentStore } from '../store/agentStore';
import useDashboardStore from '../store';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';

const ScoreBreakdown = () => {
  const { results } = useAgentStore();
  if (!results) return null;

  const { score } = results;
  const { base, speedBonus, efficiencyPenalty, total, commits } = score;
  const maxScore = 120;
  const percentage = Math.min((total / maxScore) * 100, 100);

  const chartData = [{ name: 'Score', value: percentage, fill: '#00d4ff' }];

  return (
    <div style={styles.card} className="animate-slide-up">
      <div style={styles.cardHeader}>
        <span style={styles.cardLabel}>[ SCORE BREAKDOWN ]</span>
        <span style={styles.cardSub}>Performance evaluation</span>
      </div>

      <div style={styles.body}>
        <div style={styles.layout}>
          {/* Radial Chart */}
          <div style={styles.chartSection}>
            <div style={styles.chartWrapper}>
              <ResponsiveContainer width="100%" height={200}>
                <RadialBarChart
                  cx="50%" cy="50%"
                  innerRadius="60%" outerRadius="90%"
                  data={chartData} startAngle={90} endAngle={-270}
                >
                  <RadialBar dataKey="value" background={{ fill: '#1e2d47' }} cornerRadius={4} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div style={styles.chartCenter}>
                <div style={styles.scoreTotal}>{total}</div>
                <div style={styles.scoreSub}>TOTAL SCORE</div>
              </div>
            </div>
            <div style={styles.chartLabel}>
              {percentage >= 90 ? '🏆 EXCELLENT' : percentage >= 70 ? '✓ GOOD' : '⚠ AVERAGE'}
            </div>
          </div>

          {/* Breakdown Items */}
          <div style={styles.breakdown}>
            <ScoreRow
              label="BASE SCORE"
              value={`+${base}`}
              desc="Starting score"
              color="#00d4ff"
              bar={base / maxScore}
            />
            <ScoreRow
              label="SPEED BONUS"
              value={`+${speedBonus}`}
              desc="Completed in < 5 minutes"
              color="#00ff88"
              bar={speedBonus / maxScore}
            />
            <ScoreRow
              label="EFFICIENCY PENALTY"
              value={`${efficiencyPenalty}`}
              desc={`${commits} commits (${commits - 20} over limit)`}
              color="#ff3355"
              bar={Math.abs(efficiencyPenalty) / maxScore}
              negative
            />
            <div style={styles.divider} />
            <div style={styles.totalRow}>
              <div>
                <div style={styles.totalLabel}>FINAL SCORE</div>
                <div style={styles.totalDesc}>Base + Bonuses − Penalties</div>
              </div>
              <div style={styles.totalValue}>{total}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ScoreRow = ({ label, value, desc, color, bar, negative }) => (
  <div style={styles.scoreRow}>
    <div style={styles.scoreRowTop}>
      <div>
        <div style={styles.scoreLabel}>{label}</div>
        <div style={styles.scoreDesc}>{desc}</div>
      </div>
      <div style={{ ...styles.scoreValue, color }}>{value}</div>
    </div>
    <div style={styles.scoreBarBg}>
      <div style={{
        ...styles.scoreBarFill,
        width: `${Math.min(bar * 100, 100)}%`,
        background: negative
          ? 'linear-gradient(90deg, #ff3355, #ff6680)'
          : `linear-gradient(90deg, ${color}88, ${color})`,
        boxShadow: `0 0 8px ${color}44`,
      }} />
    </div>
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
    alignItems: 'baseline',
    gap: '12px',
    padding: '14px 24px',
    borderBottom: '1px solid var(--border)',
    background: 'rgba(0, 212, 255, 0.03)',
  },
  cardLabel: {
    fontFamily: 'Share Tech Mono, monospace',
    fontSize: '12px',
    color: 'var(--accent-cyan)',
    letterSpacing: '2px',
  },
  cardSub: {
    fontFamily: 'Rajdhani, sans-serif',
    fontSize: '13px',
    color: 'var(--text-dim)',
  },
  body: { padding: '24px' },
  layout: {
    display: 'grid',
    gridTemplateColumns: '200px 1fr',
    gap: '32px',
    alignItems: 'start',
  },
  chartSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  chartWrapper: {
    position: 'relative',
    width: '100%',
  },
  chartCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
  },
  scoreTotal: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '36px',
    fontWeight: '900',
    color: 'var(--accent-cyan)',
    textShadow: '0 0 30px rgba(0, 212, 255, 0.6)',
    lineHeight: 1,
  },
  scoreSub: {
    fontFamily: 'Share Tech Mono, monospace',
    fontSize: '9px',
    color: 'var(--text-dim)',
    letterSpacing: '2px',
    marginTop: '4px',
  },
  chartLabel: {
    fontFamily: 'Share Tech Mono, monospace',
    fontSize: '11px',
    color: 'var(--accent-green)',
    letterSpacing: '1px',
  },
  breakdown: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  scoreRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  scoreRowTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  scoreLabel: {
    fontFamily: 'Share Tech Mono, monospace',
    fontSize: '11px',
    color: 'var(--text-secondary)',
    letterSpacing: '1.5px',
  },
  scoreDesc: {
    fontFamily: 'Rajdhani, sans-serif',
    fontSize: '12px',
    color: 'var(--text-dim)',
    marginTop: '2px',
  },
  scoreValue: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '18px',
    fontWeight: '700',
  },
  scoreBarBg: {
    height: '4px',
    background: 'var(--border)',
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    transition: 'width 0.6s ease',
  },
  divider: {
    height: '1px',
    background: 'var(--border)',
    margin: '4px 0',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    background: 'rgba(0, 212, 255, 0.05)',
    border: '1px solid rgba(0, 212, 255, 0.2)',
  },
  totalLabel: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '14px',
    color: 'var(--text-primary)',
    letterSpacing: '2px',
  },
  totalDesc: {
    fontFamily: 'Rajdhani, sans-serif',
    fontSize: '12px',
    color: 'var(--text-dim)',
    marginTop: '2px',
  },
  totalValue: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '40px',
    fontWeight: '900',
    color: 'var(--accent-cyan)',
    textShadow: '0 0 30px rgba(0, 212, 255, 0.5)',
  },
};

export default ScoreBreakdown;
