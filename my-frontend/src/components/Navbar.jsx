import React, { useState, useRef } from 'react';
import { useDevCollabStore } from '../store';
import {
  Layers,
  Bell,
  User,
  Zap,
  Radio,
  CheckCircle2,
  ChevronDown,
  Plus,
  Palette
} from 'lucide-react';

export default function Navbar() {
  const {
    theme,
    setTheme,
    currentUser,
    setCurrentUser,
    workspaces,
    activeWorkspaceId,
    isConnected,
    notifications,
    showNotifDrawer,
    markNotificationsRead,
    simulateTeammateAction,
    addToast
  } = useDevCollabStore((state) => state);

  const [isWsDropdownOpen, setIsWsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const notifRef = useRef(null);

  const currentWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Available Personas for Evaluation
  const mockPersonas = [
    {
      id: 'usr-1',
      name: 'Alex Chen',
      email: 'alex@devcollab.io',
      role: 'Owner',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      bio: 'Full-stack architect & OSS contributor',
      skills: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
      github: 'https://github.com/alexchen-dev'
    },
    {
      id: 'usr-2',
      name: 'Riya Sharma',
      email: 'riya@devcollab.io',
      role: 'Admin',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      bio: 'DevOps & Distributed Systems enthusiast',
      skills: ['Kubernetes', 'Go', 'AWS', 'Python'],
      github: 'https://github.com/riyasharma'
    },
    {
      id: 'usr-3',
      name: 'Ankush Verma',
      email: 'ankush@devcollab.io',
      role: 'Member',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      bio: 'Frontend UI/UX lead building snappy apps',
      skills: ['TypeScript', 'Tailwind', 'Next.js', 'Figma'],
      github: 'https://github.com/ankush-v'
    },
    {
      id: 'usr-4',
      name: 'Dev Patel',
      email: 'dev@devcollab.io',
      role: 'Member',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      bio: 'AI researcher & algorithm competitive programmer',
      skills: ['Python', 'PyTorch', 'C++', 'FastAPI'],
      github: 'https://github.com/devpatel-ai'
    },
    {
      id: 'usr-5',
      name: 'Sara Kim',
      email: 'sara@devcollab.io',
      role: 'Viewer',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80',
      bio: 'QA automation & student product manager',
      skills: ['Jest', 'Cypress', 'Product Specs'],
      github: 'https://github.com/sarakim-qa'
    }
  ];

  return (
    <header style={{
      backgroundColor: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(16px)'
    }}>
      <div style={{
        maxWidth: '1600px',
        margin: '0 auto',
        padding: '10px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        {/* Brand & Workspace Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', cursor: 'pointer' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'var(--gradient-dual)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px var(--primary-glow)',
              color: '#fff',
              fontWeight: 800
            }}>
              <Zap size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
                  DevCollab <span className="text-dual-gradient">AI</span>
                </span>
                <span style={{
                  fontSize: '0.68rem',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: 'var(--primary-bg)',
                  border: '1px solid var(--primary-border)',
                  color: 'var(--primary-light)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Automation OS
                </span>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', margin: 0 }}>
                Real-Time Project Platform for Student Teams
              </p>
            </div>
          </div>

          <div style={{ width: '1px', height: '28px', backgroundColor: 'var(--border-subtle)' }} />

          {/* Workspace Switcher */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsWsDropdownOpen(!isWsDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '6px 12px',
                color: 'var(--text-primary)',
                fontSize: '0.84rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Layers size={15} color="var(--primary)" />
              <span>{currentWorkspace?.name || 'Hyperion Dev Labs'}</span>
              <span style={{
                fontSize: '0.68rem',
                padding: '1px 6px',
                borderRadius: '4px',
                background: currentWorkspace?.tier === 'Pro' ? 'var(--secondary-bg)' : 'rgba(255,255,255,0.1)',
                color: currentWorkspace?.tier === 'Pro' ? 'var(--secondary)' : 'var(--text-secondary)',
                border: `1px solid ${currentWorkspace?.tier === 'Pro' ? 'var(--secondary-border)' : 'var(--border-subtle)'}`
              }}>
                {currentWorkspace?.tier || 'Pro'}
              </span>
              <ChevronDown size={14} color="var(--text-secondary)" />
            </button>

            {isWsDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '110%',
                left: 0,
                width: '260px',
                background: '#0d1424',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                boxShadow: 'var(--shadow-lg)',
                padding: '8px',
                zIndex: 200
              }}>
                <div style={{ padding: '6px 8px', fontSize: '0.74rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Select Workspace
                </div>
                {workspaces.map((ws) => (
                  <div
                    key={ws.id}
                    onClick={() => {
                      useDevCollabStore.setState({ activeWorkspaceId: ws.id });
                      useDevCollabStore.getState().fetchProjects();
                      setIsWsDropdownOpen(false);
                      addToast(`Switched workspace to ${ws.name}`, 'info');
                    }}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      background: ws.id === activeWorkspaceId ? 'var(--primary-bg)' : 'transparent',
                      color: ws.id === activeWorkspaceId ? '#fff' : 'var(--text-secondary)'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{ws.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>{ws.members.length} members</div>
                    </div>
                    {ws.id === activeWorkspaceId && <CheckCircle2 size={16} color="var(--secondary)" />}
                  </div>
                ))}
                <div style={{ margin: '6px 0', borderTop: '1px solid var(--border-subtle)' }} />
                <button
                  onClick={() => {
                    setIsWsDropdownOpen(false);
                    useDevCollabStore.setState({ isNewWorkspaceOpen: true });
                  }}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    background: 'rgba(255,255,255,0.04)',
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
                  <Plus size={14} /> Create New Workspace
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Center / Right Status & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Real-time Socket Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 10px',
            borderRadius: '20px',
            background: isConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${isConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            fontSize: '0.75rem',
            color: isConnected ? 'var(--secondary)' : 'var(--danger)'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: isConnected ? 'var(--secondary)' : 'var(--danger)',
              boxShadow: isConnected ? '0 0 8px var(--secondary)' : 'none',
              animation: isConnected ? 'liveBeacon 2s infinite ease-in-out' : 'none'
            }} />
            <span style={{ fontWeight: 600 }}>{isConnected ? 'WebSocket Live' : 'Reconnecting'}</span>
          </div>

          {/* Peer Simulation Button */}
          <button
            onClick={simulateTeammateAction}
            title="Simulate real-time task movement by peer"
            className="btn-secondary"
            style={{ padding: '6px 10px', fontSize: '0.78rem', gap: '6px' }}
          >
            <Radio size={14} color="var(--primary)" />
            <span>Simulate Peer Sync</span>
          </button>

          {/* Theme Switcher Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
              title="Dual Palette Color Theme"
              className="btn-icon"
            >
              <Palette size={16} />
            </button>
            {isThemeDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '120%',
                right: 0,
                width: '210px',
                background: '#0d1424',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                boxShadow: 'var(--shadow-lg)',
                padding: '8px',
                zIndex: 200
              }}>
                <div style={{ padding: '4px 8px', fontSize: '0.72rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Dual Palette Themes
                </div>
                {[
                  { id: 'indigo-emerald', name: 'Indigo & Emerald (Default)', c1: '#6366f1', c2: '#10b981' },
                  { id: 'violet-cyan', name: 'Violet & Cyan (Neon)', c1: '#8b5cf6', c2: '#06b6d4' },
                  { id: 'sapphire-amber', name: 'Sapphire & Amber (Pro)', c1: '#3b82f6', c2: '#f59e0b' }
                ].map((th) => (
                  <div
                    key={th.id}
                    onClick={() => {
                      setTheme(th.id);
                      setIsThemeDropdownOpen(false);
                      addToast(`Dual theme changed to ${th.name}`, 'info');
                    }}
                    style={{
                      padding: '8px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      background: theme === th.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                      color: '#fff',
                      fontSize: '0.8rem'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '3px' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: th.c1 }} />
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: th.c2 }} />
                    </div>
                    <span>{th.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button
              onClick={() => {
                useDevCollabStore.setState((s) => ({ showNotifDrawer: !s.showNotifDrawer }));
              }}
              className="btn-icon"
              style={{ position: 'relative' }}
              title="Notifications & Mentions"
            >
              <Bell size={17} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: 'var(--danger)',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)'
                }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Drawer */}
            {showNotifDrawer && (
              <div className="notif-drawer">
                <div style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Bell size={16} color="var(--primary)" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>Notifications</span>
                    {unreadCount > 0 && (
                      <span style={{
                        fontSize: '0.68rem',
                        padding: '1px 6px',
                        borderRadius: '10px',
                        background: 'var(--primary-bg)',
                        color: 'var(--primary-light)',
                        fontWeight: 700
                      }}>
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <button
                    onClick={markNotificationsRead}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--primary-light)',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Mark all read
                  </button>
                </div>

                <div style={{ maxHeight: '340px', overflowY: 'auto', padding: '8px' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.82rem' }}>
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          marginBottom: '6px',
                          background: notif.read ? 'transparent' : 'rgba(99, 102, 241, 0.08)',
                          border: notif.read ? '1px solid transparent' : '1px solid rgba(99, 102, 241, 0.25)',
                          fontSize: '0.8rem'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 700, color: notif.read ? 'var(--text-secondary)' : '#fff' }}>
                            {notif.title}
                          </span>
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>
                            {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                          {notif.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-subtle)' }} />

          {/* Persona Switcher Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '4px 10px',
                cursor: 'pointer',
                color: '#fff'
              }}
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>{currentUser.name}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--secondary)' }}>{currentUser.role}</div>
              </div>
              <ChevronDown size={14} color="var(--text-secondary)" />
            </button>

            {isUserDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '115%',
                right: 0,
                width: '280px',
                background: '#0d1424',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                boxShadow: 'var(--shadow-lg)',
                padding: '10px',
                zIndex: 200
              }}>
                <div style={{ padding: '6px 8px', fontSize: '0.74rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Switch Role / Persona (Test RBAC)
                </div>
                {mockPersonas.map((persona) => (
                  <div
                    key={persona.id}
                    onClick={() => {
                      setCurrentUser(persona);
                      setIsUserDropdownOpen(false);
                    }}
                    style={{
                      padding: '8px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      background: currentUser.id === persona.id ? 'var(--primary-bg)' : 'transparent',
                      marginBottom: '4px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img src={persona.avatar} alt="" style={{ width: '26px', height: '26px', borderRadius: '50%' }} />
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>{persona.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{persona.role}</div>
                      </div>
                    </div>
                    {currentUser.id === persona.id && <CheckCircle2 size={16} color="var(--secondary)" />}
                  </div>
                ))}
                <div style={{ margin: '8px 0', borderTop: '1px solid var(--border-subtle)' }} />
                <button
                  onClick={() => {
                    setIsUserDropdownOpen(false);
                    useDevCollabStore.setState({ isProfileModalOpen: true });
                  }}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <User size={14} /> View / Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
