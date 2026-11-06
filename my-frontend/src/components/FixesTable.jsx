import React, { useState } from 'react';
//import { useAgentStore } from '../store/agentStore';
import useDashboardStore from '../store';

const BUG_COLORS = {
  LINTING: '#ffd700',
  SYNTAX: '#ff8c00',
  LOGIC: '#9d4edd',
  TYPE_ERROR: '#ff3355',
  IMPORT: '#00d4ff',
  INDENTATION: '#00ff88',
};

const FixesTable = () => {
  const { results } = useAgentStore();
  const [filter, setFilter] = useState('ALL');
  if (!results) return null;

  const { fixes } = results;
  const bugTypes = ['ALL', ...new Set(fixes.map(f => f.bugType))];

  const filtered = filter === 'ALL' ? fixes : fixes.filter(f => f.bugType === filter);
  const fixedCount = fixes.filter(f => f.status === 'fixed').length;
  const failedCount = fixes.filter(f => f.status === 'failed').length;

  return (
    <div style={styles.card} className="animate-slide-up">
      <div style={styles.cardHeader}>
        <div style={styles.headerLeft}>
          <span style={styles.cardLabel}>[ FIXES APPLIED ]</span>
          <div style={styles.counters}>
            <span style={styles.counterGreen}>✓ {fixedCount} FIXED</span>
            <span style={styles.counterRed}>✗ {failedCount} FAILED</span>
          </div>
        </div>
        <div style={styles.filters}>
          {bugTypes.map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              style={{
                ...styles.filterBtn,
                ...(filter === type ? styles.filterBtnActive : {}),
                ...(type !== 'ALL' ? { borderColor: BUG_COLORS[type] + '66', color: filter === type ? '#fff' : BUG_COLORS[type] } : {}),
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              {['FILE', 'BUG TYPE', 'LINE', 'COMMIT MESSAGE', 'STATUS'].map(col => (
                <th key={col} style={styles.th}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((fix, idx) => {
              const isPassed = fix.status === 'fixed';
              return (
                <tr
                  key={idx}
                  style={{
                    ...styles.tr,
                    background: idx % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent',
                    borderLeft: `2px solid ${isPassed ? '#00ff8844' : '#ff335544'}`,
                  }}
                >
                  <td style={styles.td}>
                    <div style={styles.fileCell}>
                      <span style={styles.fileIcon}>◈</span>
                      <span style={styles.filePath}>{fix.file}</span>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.bugBadge,
                      background: BUG_COLORS[fix.bugType] + '18',
                      border: `1px solid ${BUG_COLORS[fix.bugType]}55`,
                      color: BUG_COLORS[fix.bugType],
                    }}>
                      {fix.bugType}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.lineNum}>:{fix.line}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.commitMsg}>{fix.commitMessage}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      background: isPassed ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 51, 85, 0.1)',
                      border: `1px solid ${isPassed ? '#00ff8866' : '#ff335566'}`,
                      color: isPassed ? '#00ff88' : '#ff3355',
                    }}>
                      {isPassed ? '✓ FIXED' : '✗ FAILED'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    marginBottom: '24px',
    overflow: 'hidden',
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
  headerLeft: { display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' },
  cardLabel: {
    fontFamily: 'Share Tech Mono, monospace',
    fontSize: '12px',
    color: 'var(--accent-cyan)',
    letterSpacing: '2px',
  },
  counters: { display: 'flex', gap: '12px' },
  counterGreen: {
    fontFamily: 'Share Tech Mono, monospace',
    fontSize: '11px',
    color: 'var(--accent-green)',
  },
  counterRed: {
    fontFamily: 'Share Tech Mono, monospace',
    fontSize: '11px',
    color: 'var(--accent-red)',
  },
  filters: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  filterBtn: {
    padding: '4px 10px',
    background: 'transparent',
    border: '1px solid var(--border)',
    color: 'var(--text-dim)',
    fontFamily: 'Share Tech Mono, monospace',
    fontSize: '10px',
    cursor: 'pointer',
    letterSpacing: '1px',
    transition: 'all 0.2s',
  },
  filterBtnActive: {
    background: 'rgba(0, 212, 255, 0.1)',
    borderColor: 'var(--accent-cyan)',
    color: 'var(--accent-cyan)',
  },
  tableWrapper: { overflowX: 'auto' },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  thead: { background: 'rgba(0, 0, 0, 0.3)' },
  th: {
    fontFamily: 'Share Tech Mono, monospace',
    fontSize: '10px',
    color: 'var(--text-dim)',
    letterSpacing: '2px',
    padding: '12px 16px',
    textAlign: 'left',
    borderBottom: '1px solid var(--border)',
    whiteSpace: 'nowrap',
  },
  tr: {
    borderBottom: '1px solid rgba(30, 45, 71, 0.5)',
    transition: 'background 0.1s',
  },
  td: {
    padding: '12px 16px',
    verticalAlign: 'middle',
  },
  fileCell: { display: 'flex', alignItems: 'center', gap: '8px' },
  fileIcon: { color: 'var(--text-dim)', fontSize: '12px' },
  filePath: {
    fontFamily: 'Share Tech Mono, monospace',
    fontSize: '12px',
    color: 'var(--accent-cyan)',
    whiteSpace: 'nowrap',
  },
  bugBadge: {
    fontFamily: 'Share Tech Mono, monospace',
    fontSize: '10px',
    padding: '3px 8px',
    letterSpacing: '1px',
    whiteSpace: 'nowrap',
    display: 'inline-block',
  },
  lineNum: {
    fontFamily: 'Share Tech Mono, monospace',
    fontSize: '12px',
    color: 'var(--accent-orange)',
  },
  commitMsg: {
    fontFamily: 'Share Tech Mono, monospace',
    fontSize: '11px',
    color: 'var(--text-secondary)',
    maxWidth: '280px',
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  statusBadge: {
    fontFamily: 'Share Tech Mono, monospace',
    fontSize: '10px',
    padding: '3px 10px',
    letterSpacing: '1px',
    whiteSpace: 'nowrap',
    display: 'inline-block',
  },
};

export default FixesTable;
