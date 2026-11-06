import React from 'react';
//import { useAgentStore } from '../store/agentStore';
import useDashboardStore from '../store';

const InputSection = () => {
  const { repoUrl, teamName, leaderName, status, setRepoUrl, setTeamName, setLeaderName, runAgent } = useAgentStore();
  const isRunning = status === 'running';

  const branchPreview = teamName && leaderName
    ? `${teamName.toUpperCase().replace(/ /g, '_')}_${leaderName.toUpperCase().replace(/ /g, '_')}_AI_Fix`
    : 'TEAM_NAME_LEADER_NAME_AI_Fix';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (repoUrl && teamName && leaderName && !isRunning) runAgent();
  };

  return (
    <div style={styles.card} className="animate-slide-up">
      <div style={styles.cardHeader}>
        <span style={styles.cardLabel}>[ INPUT PARAMETERS ]</span>
        <span style={styles.cardSub}>Configure agent execution</span>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGrid}>
          <InputField
            label="REPOSITORY URL"
            value={repoUrl}
            onChange={setRepoUrl}
            placeholder="https://github.com/org/repository"
            icon="⬡"
            disabled={isRunning}
            fullWidth
          />
          <InputField
            label="TEAM NAME"
            value={teamName}
            onChange={setTeamName}
            placeholder="RIFT ORGANISERS"
            icon="◈"
            disabled={isRunning}
          />
          <InputField
            label="TEAM LEADER"
            value={leaderName}
            onChange={setLeaderName}
            placeholder="Saiyam Kumar"
            icon="◉"
            disabled={isRunning}
          />
        </div>

        {(teamName || leaderName) && (
          <div style={styles.branchPreview}>
            <span style={styles.branchLabel}>BRANCH →</span>
            <span style={styles.branchValue}>{branchPreview}</span>
          </div>
        )}

        <div style={styles.buttonRow}>
          <button
            type="submit"
            style={{
              ...styles.runBtn,
              ...(isRunning ? styles.runBtnDisabled : {}),
              ...(!repoUrl || !teamName || !leaderName ? styles.runBtnDisabled : {}),
            }}
            disabled={isRunning || !repoUrl || !teamName || !leaderName}
          >
            {isRunning ? (
              <>
                <Spinner />
                AGENT RUNNING...
              </>
            ) : (
              <>
                <span style={styles.btnIcon}>▶</span>
                RUN AGENT
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

const InputField = ({ label, value, onChange, placeholder, icon, disabled, fullWidth }) => (
  <div style={{ ...styles.fieldWrapper, gridColumn: fullWidth ? '1 / -1' : 'auto' }}>
    <label style={styles.label}>
      <span style={styles.labelIcon}>{icon}</span>
      {label}
    </label>
    <div style={styles.inputWrapper}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          ...styles.input,
          ...(disabled ? styles.inputDisabled : {}),
        }}
      />
      <div style={styles.inputGlow} />
    </div>
  </div>
);

const Spinner = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" style={{ animation: 'spin 1s linear infinite', marginRight: '8px' }}>
    <circle cx="8" cy="8" r="6" stroke="#00d4ff" strokeWidth="2" strokeDasharray="20 10" fill="none" />
  </svg>
);

const styles = {
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    marginBottom: '24px',
    position: 'relative',
    overflow: 'hidden',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '12px',
    padding: '16px 24px',
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
    letterSpacing: '1px',
  },
  form: { padding: '24px' },
  inputGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '16px',
  },
  fieldWrapper: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: {
    fontFamily: 'Share Tech Mono, monospace',
    fontSize: '11px',
    color: 'var(--text-secondary)',
    letterSpacing: '2px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  labelIcon: { color: 'var(--accent-cyan)', fontSize: '14px' },
  inputWrapper: { position: 'relative' },
  input: {
    width: '100%',
    background: '#070c16',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
    fontFamily: 'Share Tech Mono, monospace',
    fontSize: '13px',
    padding: '10px 14px',
    outline: 'none',
    transition: 'all 0.2s',
    letterSpacing: '0.5px',
  },
  inputDisabled: { opacity: 0.5, cursor: 'not-allowed' },
  inputGlow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, var(--accent-cyan), transparent)',
    opacity: 0.5,
  },
  branchPreview: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 14px',
    background: 'rgba(0, 255, 136, 0.05)',
    border: '1px solid rgba(0, 255, 136, 0.2)',
    marginBottom: '20px',
  },
  branchLabel: {
    fontFamily: 'Share Tech Mono, monospace',
    fontSize: '11px',
    color: 'var(--accent-green)',
    letterSpacing: '1px',
  },
  branchValue: {
    fontFamily: 'Share Tech Mono, monospace',
    fontSize: '12px',
    color: 'var(--text-primary)',
    letterSpacing: '1px',
  },
  buttonRow: { display: 'flex', gap: '12px' },
  runBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 32px',
    background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(0, 212, 255, 0.05))',
    border: '1px solid var(--accent-cyan)',
    color: 'var(--accent-cyan)',
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '13px',
    fontWeight: '700',
    letterSpacing: '3px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 0 20px rgba(0, 212, 255, 0.1)',
  },
  runBtnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  btnIcon: { fontSize: '16px' },
};

export default InputSection;
