import React, { useEffect, useRef } from 'react';
import useDashboardStore from '../store';

export default function LogTerminal() {
  const { logs } = useDashboardStore();
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="terminal">
      <div className="terminal-bar">
        <span className="term-dot r"></span>
        <span className="term-dot y"></span>
        <span className="term-dot g"></span>
        <span className="terminal-title">AGENT LOG — LIVE OUTPUT</span>
      </div>
      <div className="terminal-body" ref={bodyRef}>
        {logs.map((log, i) => (
          <div key={i} className="log-line">
            <span className="ts">{log.timestamp.toLocaleTimeString()}</span>
            <span className="msg">$ {log.message}</span>
          </div>
        ))}
        <div className="log-line">
          <span className="ts"></span>
          <span><span className="log-cursor"></span></span>
        </div>
      </div>
    </div>
  );
}
