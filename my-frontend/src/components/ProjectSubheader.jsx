import React, { useState } from 'react';
import { useDevCollabStore } from '../store';
import {
  Kanban,
  Bot,
  CodeXml,
  FileCode2,
  BookOpen,
  Activity,
  Users2,
  CreditCard,
  Plus,
  ChevronDown,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function ProjectSubheader() {
  const {
    activeTab,
    setActiveTab,
    projects,
    activeProjectId,
    tasks,
    workspaces,
    activeWorkspaceId,
    addToast
  } = useDevCollabStore((state) => state);

  const [isProjDropdownOpen, setIsProjDropdownOpen] = useState(false);

  const currentWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);
  const currentProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const projectTasks = tasks.filter((t) => t.projectId === activeProjectId);
  const totalTasks = projectTasks.length;
  const doneTasks = projectTasks.filter((t) => t.status === 'Done').length;
  const p0Tasks = projectTasks.filter((t) => t.priority === 'P0' && t.status !== 'Done').length;
  const completionPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const tabs = [
    { id: 'tasks', label: 'Tasks & Board', icon: Kanban, badge: totalTasks },
    { id: 'ai', label: 'AI Assistant & Automation', icon: Bot, isAi: true },
    { id: 'reviewer', label: 'AI Code Reviewer', icon: CodeXml, isAi: true },
    { id: 'snippets', label: 'Code Snippets', icon: FileCode2 },
    { id: 'wiki', label: 'Documentation Wiki', icon: BookOpen },
    { id: 'activity', label: 'Activity Feed', icon: Activity },
    { id: 'team', label: 'Team & Roles', icon: Users2 },
    { id: 'billing', label: 'Plan & Billing', icon: CreditCard }
  ];

  return (
    <div style={{
      backgroundColor: 'rgba(11, 16, 29, 0.95)',
      borderBottom: '1px solid var(--border-subtle)',
      paddingTop: '14px'
    }}>
      <div style={{
        maxWidth: '1600px',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        {/* Top line: Project selector & quick summary metrics */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '16px'
        }}>
          {/* Project Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsProjDropdownOpen(!isProjDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '7px 14px',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  background: 'var(--gradient-dual)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  color: '#fff'
                }}>
                  {currentProject?.key || 'CAMP'}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700 }}>
                    {currentProject?.name || 'CampusConnect Web Platform'}
                  </div>
                </div>
                <ChevronDown size={15} color="var(--text-secondary)" />
              </button>

              {isProjDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '115%',
                  left: 0,
                  width: '320px',
                  background: '#0d1424',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '10px',
                  zIndex: 250
                }}>
                  <div style={{ padding: '6px 8px', fontSize: '0.74rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Projects in {currentWorkspace?.name}
                  </div>
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      onClick={() => {
                        useDevCollabStore.setState({ activeProjectId: proj.id });
                        useDevCollabStore.getState().fetchTasks();
                        useDevCollabStore.getState().fetchSnippets();
                        useDevCollabStore.getState().fetchWiki();
                        setIsProjDropdownOpen(false);
                        addToast(`Switched project to ${proj.name}`, 'info');
                      }}
                      style={{
                        padding: '10px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        background: proj.id === activeProjectId ? 'var(--primary-bg)' : 'transparent',
                        marginBottom: '4px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                          padding: '3px 7px',
                          borderRadius: '4px',
                          background: 'rgba(255,255,255,0.08)',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: 'var(--primary-light)'
                        }}>
                          {proj.key}
                        </span>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{proj.name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>{proj.status} • {proj.visibility}</div>
                        </div>
                      </div>
                      {proj.id === activeProjectId && <CheckCircle2 size={16} color="var(--secondary)" />}
                    </div>
                  ))}
                  <div style={{ margin: '8px 0', borderTop: '1px solid var(--border-subtle)' }} />
                  <button
                    onClick={() => {
                      setIsProjDropdownOpen(false);
                      useDevCollabStore.setState({ isNewProjectOpen: true });
                    }}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '6px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px dashed var(--border-subtle)',
                      color: 'var(--primary-light)',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Plus size={14} /> Create New Project
                  </button>
                </div>
              )}
            </div>

            {/* Project description snippet */}
            <p style={{
              margin: 0,
              fontSize: '0.82rem',
              color: 'var(--text-secondary)',
              maxWidth: '520px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {currentProject?.description}
            </p>
          </div>

          {/* Quick Metrics & Team Avatars */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Completion Meter */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                Sprint Progress:
              </div>
              <div style={{
                width: '70px',
                height: '7px',
                borderRadius: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${completionPct}%`,
                  height: '100%',
                  background: 'var(--gradient-dual)',
                  transition: 'width 0.4s ease'
                }} />
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--secondary)' }}>
                {completionPct}%
              </span>
            </div>

            {/* P0 Alert Flag */}
            {p0Tasks > 0 && (
              <div
                onClick={() => setActiveTab('ai')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 10px',
                  borderRadius: '8px',
                  background: 'var(--p0-bg)',
                  border: '1px solid var(--p0-border)',
                  color: 'var(--p0-red)',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
                title="Click to view blockers in AI Assistant"
              >
                <AlertCircle size={14} />
                <span>{p0Tasks} Critical (P0)</span>
              </div>
            )}

            {/* Team Member Avatars Stack */}
            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '8px' }}>
              {(currentWorkspace?.members || []).slice(0, 4).map((member, i) => (
                <img
                  key={member.id}
                  src={member.avatar}
                  alt={member.name}
                  title={`${member.name} (${member.role})`}
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    border: '2px solid var(--bg-surface)',
                    marginLeft: i > 0 ? '-8px' : '0',
                    objectFit: 'cover'
                  }}
                />
              ))}
              {(currentWorkspace?.members || []).length > 4 && (
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'var(--bg-surface-elevated)',
                  border: '2px solid var(--bg-surface)',
                  marginLeft: '-8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.68rem',
                  color: 'var(--text-secondary)',
                  fontWeight: 700
                }}>
                  +{currentWorkspace.members.length - 4}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Line: Main Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '4px',
          overflowX: 'auto',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          paddingTop: '4px'
        }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '2px solid var(--secondary)' : '2px solid transparent',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={16} color={isActive ? 'var(--secondary)' : 'currentColor'} />
                <span>{tab.label}</span>
                {tab.isAi && (
                  <span style={{
                    fontSize: '0.65rem',
                    padding: '1px 6px',
                    borderRadius: '8px',
                    background: 'var(--gradient-dual-soft)',
                    color: 'var(--secondary-light)',
                    border: '1px solid var(--border-focus)',
                    fontWeight: 700
                  }}>
                    AI
                  </span>
                )}
                {tab.badge !== undefined && (
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '1px 6px',
                    borderRadius: '10px',
                    backgroundColor: isActive ? 'var(--primary-bg)' : 'rgba(255,255,255,0.06)',
                    color: isActive ? 'var(--primary-light)' : 'var(--text-tertiary)',
                    fontWeight: 600
                  }}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
