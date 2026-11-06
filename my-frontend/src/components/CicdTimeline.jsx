import React from 'react';
import useDashboardStore from '../store';

function formatTs(iso) {
  return new Date(iso).toLocaleTimeString();
}

export default function CicdTimeline() {
  const { results } = useDashboardStore();
  if (!results) return null;

  const { cicdRuns, retryLimit } = results;

  return (
    <div className="card">
      <div className="card-title">
        <span className="icon">⟳</span>
        CI/CD Pipeline Timeline
      </div>

      <div className="timeline">
        {cicdRuns.map((run, i) => (
          <div key={i} className="timeline-item">
            <div className="timeline-dot-col">
              <div className={'timeline-dot ' + run.status}></div>
              {i < cicdRuns.length - 1 && <div className="timeline-line"></div>}
            </div>
            <div className="timeline-content">
              <div className="timeline-header">
                <span className="timeline-iter">Run #{run.iteration}</span>
                <span className={'timeline-badge ' + run.status}>
                  {run.status === 'passed' ? '✓ PASSED' : '✗ FAILED'}
                </span>
              </div>
              <div className="timeline-meta">
                <span>{formatTs(run.timestamp)}</span>
                <span>Duration: {run.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="iteration-count">
        <span>Iterations used / retry limit</span>
        <span className="iter-fraction">{cicdRuns.length}/{retryLimit}</span>
      </div>
    </div>
  );
}
