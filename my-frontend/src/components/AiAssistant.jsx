import React, { useState } from 'react';
import { useDevCollabStore } from '../store';
import {
  Bot,
  Sparkles,
  AlertTriangle,
  FileText,
  ListPlus,
  CheckCircle2,
  Copy,
  Clock,
  ShieldAlert,
  Zap,
  Sliders,
  Plus
} from 'lucide-react';

export default function AiAssistant() {
  const {
    generateAiSummary,
    generateAiBlockers,
    generateAiStandup,
    generateAiTaskBreakdown,
    applyAiBreakdownToBoard,
    aiSummary,
    aiBlockers,
    aiStandup,
    aiBreakdown,
    isAiLoading,
    automationRules,
    toggleAutomationRule,
    runAutomationDiagnostics,
    automationDiagnostics,
    isExecutingAutomation,
    addToast
  } = useDevCollabStore((state) => state);

  const [featurePrompt, setFeaturePrompt] = useState('Build a secure JWT Authentication and Session Management System with 2FA and Rate Limiting');
  const [copiedReport, setCopiedReport] = useState(false);

  const handleCopyStandup = () => {
    if (aiStandup?.formattedMarkdown) {
      navigator.clipboard?.writeText(aiStandup.formattedMarkdown);
      setCopiedReport(true);
      addToast('Standup report copied to clipboard in Slack/Markdown format!', 'success');
      setTimeout(() => setCopiedReport(false), 2500);
    }
  };

  return (
    <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '24px' }}>
      {/* Header Banner */}
      <div style={{
        background: 'var(--gradient-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '14px',
        padding: '24px',
        marginBottom: '28px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-30px',
          right: '-30px',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--gradient-dual)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <Bot size={18} />
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                AI Project Assistant & Intelligent Automation Engine
              </h2>
              <span className="badge-dual" style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px' }}>
                Active Agent
              </span>
            </div>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.86rem', maxWidth: '750px' }}>
              Empowering student developer teams with instant project synthesis, automated blocker remediation, Slack-ready standups, and subtask generation.
            </p>
          </div>

          {/* Quick Diagnostics Trigger */}
          <button
            onClick={runAutomationDiagnostics}
            disabled={isExecutingAutomation}
            className="btn-primary"
            style={{ padding: '10px 18px', gap: '8px', fontSize: '0.88rem' }}
          >
            <Zap size={16} />
            <span>{isExecutingAutomation ? 'Executing Engine...' : 'Run Automation Diagnostics'}</span>
          </button>
        </div>
      </div>

      {/* Diagnostics Alert Banner if run */}
      {automationDiagnostics && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid var(--secondary-border)',
          borderRadius: '10px',
          padding: '16px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          <CheckCircle2 size={20} color="var(--secondary)" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
              Automation Diagnostics Executed Successfully
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Evaluated {automationDiagnostics.taskCount} active project tasks. Applied {automationDiagnostics.actionsApplied.length} automated SLA adjustments.
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.8rem', color: 'var(--secondary-light)' }}>
              {automationDiagnostics.actionsApplied.map((action, i) => (
                <li key={i} style={{ marginBottom: '2px' }}>{action}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Main Grid: 2 Columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Left Column: AI Assistant Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Quick Action Command Buttons */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} color="var(--primary)" /> AI Assistant Commands
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
              <button
                onClick={generateAiSummary}
                disabled={isAiLoading}
                className="btn-secondary"
                style={{
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '6px',
                  borderRadius: '10px',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary-light)', fontWeight: 700, fontSize: '0.82rem' }}>
                  <FileText size={15} /> Summarise Project
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                  Executive progress report & velocity
                </span>
              </button>

              <button
                onClick={generateAiBlockers}
                disabled={isAiLoading}
                className="btn-secondary"
                style={{
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '6px',
                  borderRadius: '10px',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--p0-red)', fontWeight: 700, fontSize: '0.82rem' }}>
                  <ShieldAlert size={15} /> What's Blocking Us?
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                  Detect stalled & overdue tasks
                </span>
              </button>

              <button
                onClick={generateAiStandup}
                disabled={isAiLoading}
                className="btn-secondary"
                style={{
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '6px',
                  borderRadius: '10px',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--secondary)', fontWeight: 700, fontSize: '0.82rem' }}>
                  <Clock size={15} /> Standup Report
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                  Daily format for Slack / Discord
                </span>
              </button>
            </div>
          </div>

          {/* Feature Breakdown Generator */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#fff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ListPlus size={16} color="var(--secondary)" /> AI Task Breakdown Generator
            </h3>
            <p style={{ margin: '0 0 14px 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Type any high-level feature description (e.g. "Build a login system") to automatically generate structured sprint subtasks.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
              <textarea
                rows={3}
                value={featurePrompt}
                onChange={(e) => setFeaturePrompt(e.target.value)}
                placeholder="Describe a feature to decompose..."
                style={{
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '12px',
                  color: '#fff',
                  fontSize: '0.84rem',
                  outline: 'none',
                  resize: 'none',
                  lineHeight: 1.45
                }}
              />

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>Try presets:</span>
                {[
                  'Build OAuth2 & 2FA login system',
                  'Real-time WebSocket chat service',
                  'Automated CI/CD Docker deployment pipeline'
                ].map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFeaturePrompt(sample)}
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '4px',
                      padding: '2px 8px',
                      fontSize: '0.72rem',
                      color: 'var(--primary-light)',
                      cursor: 'pointer'
                    }}
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => generateAiTaskBreakdown(featurePrompt)}
              disabled={isAiLoading || !featurePrompt.trim()}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Sparkles size={15} />
              <span>Decompose into Sprint Subtasks</span>
            </button>

            {/* Generated Subtasks Preview */}
            {aiBreakdown && (
              <div style={{
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
                    Generated {aiBreakdown.subtaskCount} Subtasks (~{aiBreakdown.estimatedTotalHours})
                  </div>
                  <button
                    onClick={applyAiBreakdownToBoard}
                    className="btn-primary"
                    style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                  >
                    <Plus size={14} /> Add All to Kanban Board
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {aiBreakdown.subtasks.map((task, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '10px',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: task.priority === 'P0' ? 'var(--p0-bg)' : 'var(--p1-bg)',
                          color: task.priority === 'P0' ? 'var(--p0-red)' : 'var(--p1-amber)'
                        }}>
                          {task.priority}
                        </span>
                        <span style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 600 }}>{task.title}</span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                        {task.estHours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI Project Summary Result */}
          {aiSummary && (
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                  Project Executive Summary: {aiSummary.projectName}
                </h3>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--secondary)' }}>
                  {aiSummary.completionRate}% Velocity
                </span>
              </div>

              <div style={{
                fontSize: '0.84rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                marginBottom: '14px',
                background: 'rgba(255,255,255,0.02)',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.04)'
              }}>
                {aiSummary.executiveSummary}
              </div>

              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '6px' }}>
                  Key Achievements Completed:
                </div>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {aiSummary.keyAchievements.map((ach, idx) => (
                    <li key={idx} style={{ marginBottom: '3px' }}>{ach}</li>
                  ))}
                </ul>
              </div>

              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-light)', marginBottom: '6px' }}>
                  Recommended Sprint Directive:
                </div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                  {aiSummary.recommendedSprintFocus}
                </p>
              </div>
            </div>
          )}

          {/* Blocker Analysis Result */}
          {aiBlockers && (
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--p0-border)',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--p0-red)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={18} /> Active Pipeline Blockers ({aiBlockers.blockerCount})
                </h3>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '10px',
                  background: 'var(--p0-bg)',
                  color: 'var(--p0-red)'
                }}>
                  {aiBlockers.overallRisk}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {aiBlockers.blockers.map((b, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      background: 'rgba(239, 68, 68, 0.05)',
                      border: '1px solid rgba(239, 68, 68, 0.2)'
                    }}
                  >
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
                      {b.taskTitle}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      {b.reason}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--secondary)', fontWeight: 600 }}>
                      ⚡ Action: {b.actionRequired}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Daily Standup Report Result */}
          {aiStandup && (
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                  Daily Engineering Standup — {aiStandup.date}
                </h3>
                <button
                  onClick={handleCopyStandup}
                  className="btn-secondary"
                  style={{ padding: '5px 10px', fontSize: '0.76rem', gap: '6px' }}
                >
                  <Copy size={13} /> {copiedReport ? 'Copied!' : 'Copy to Slack'}
                </button>
              </div>

              <div style={{
                background: 'var(--bg-app)',
                borderRadius: '8px',
                padding: '14px',
                border: '1px solid var(--border-subtle)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.5
              }}>
                {aiStandup.formattedMarkdown}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Intelligent Automation Tool (Rules & Diagnostics) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Automation Rules Configuration */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sliders size={16} color="var(--primary)" /> Intelligent Automation Rules
                </h3>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>
                  Event-driven rules executing in the background
                </span>
              </div>

              <span style={{
                fontSize: '0.72rem',
                padding: '2px 8px',
                borderRadius: '10px',
                background: 'var(--secondary-bg)',
                color: 'var(--secondary)',
                fontWeight: 700
              }}>
                {automationRules.filter((r) => r.isActive).length} / {automationRules.length} Active
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {automationRules.map((rule) => (
                <div
                  key={rule.id}
                  style={{
                    padding: '14px',
                    borderRadius: '8px',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#fff' }}>
                      {rule.name}
                    </div>

                    {/* Toggle Switch */}
                    <button
                      onClick={() => toggleAutomationRule(rule.id)}
                      style={{
                        width: '38px',
                        height: '20px',
                        borderRadius: '10px',
                        background: rule.isActive ? 'var(--secondary)' : 'rgba(255,255,255,0.15)',
                        border: 'none',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'background 0.2s ease'
                      }}
                    >
                      <span style={{
                        position: 'absolute',
                        top: '2px',
                        left: rule.isActive ? '20px' : '2px',
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor: '#fff',
                        transition: 'left 0.2s ease'
                      }} />
                    </button>
                  </div>

                  <p style={{ margin: '0 0 10px 0', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {rule.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                    <span>Trigger: <strong style={{ color: 'var(--primary-light)' }}>{rule.trigger}</strong></span>
                    <span>Executed: <strong>{rule.fireCount || 0} times</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How The Automation OS Works */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <h3 style={{ fontSize: '0.94rem', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
              How DevCollab Automation Engine Works
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--primary-bg)', color: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.72rem' }}>1</span>
                <div>
                  <strong style={{ color: '#fff' }}>Event Stream Ingestion:</strong> Evaluates mutations (task moves, snippet creation, wiki updates, deadline countdowns) in real time over Socket.IO.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--primary-bg)', color: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.72rem' }}>2</span>
                <div>
                  <strong style={{ color: '#fff' }}>Intelligent Decision Matrix:</strong> When a task deadline &lt; 48h, auto-escalates priority to P0 and triggers blocker notifications to leads.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--primary-bg)', color: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.72rem' }}>3</span>
                <div>
                  <strong style={{ color: '#fff' }}>Zero-Overhead Orchestration:</strong> Automatically maintains daily standups, generates subtask breakdowns, and keeps the whole team aligned.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
