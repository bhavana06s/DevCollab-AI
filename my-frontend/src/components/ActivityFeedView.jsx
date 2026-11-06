import React, { useState } from 'react';
import { useDevCollabStore } from '../store';
import {
  Activity,
  CheckCircle2,
  MessageSquare,
  FileText,
  UserPlus,
  Zap,
  ArrowRight,
  Clock
} from 'lucide-react';

export default function ActivityFeedView() {
  const {
    activityFeed,
    workspaces,
    activeWorkspaceId
  } = useDevCollabStore((state) => state);

  const [selectedMember, setSelectedMember] = useState('all');
  const [selectedAction, setSelectedAction] = useState('all');

  const currentWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);
  const members = currentWorkspace?.members || [];

  const filteredFeed = activityFeed.filter((item) => {
    const matchesMember = selectedMember === 'all' || item.userName.toLowerCase().includes(selectedMember.toLowerCase());
    const matchesAction = selectedAction === 'all' || item.action === selectedAction;
    return matchesMember && matchesAction;
  });

  const getActionBadge = (action) => {
    switch (action) {
      case 'task_moved':
        return { label: 'Task Moved', bg: 'var(--primary-bg)', color: 'var(--primary-light)', icon: ArrowRight };
      case 'task_created':
        return { label: 'Task Created', bg: 'var(--secondary-bg)', color: 'var(--secondary)', icon: CheckCircle2 };
      case 'comment_added':
        return { label: 'Comment', bg: 'rgba(245, 158, 11, 0.12)', color: 'var(--warning)', icon: MessageSquare };
      case 'doc_updated':
      case 'doc_created':
        return { label: 'Wiki Document', bg: 'rgba(6, 182, 212, 0.12)', color: 'var(--info)', icon: FileText };
      case 'automation_triggered':
        return { label: 'Automation OS', bg: 'var(--gradient-dual-soft)', color: 'var(--secondary)', icon: Zap };
      case 'member_joined':
        return { label: 'Team', bg: 'rgba(168, 85, 247, 0.12)', color: '#c084fc', icon: UserPlus };
      default:
        return { label: 'Event', bg: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)', icon: Activity };
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      {/* Header and Filter Bar */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} color="var(--primary)" /> Workspace Activity Stream
          </h2>
          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Immutable audit log capturing real-time collaborative tasks, commits, automated triggers, and discussions.
          </p>
        </div>

        {/* Filter Dropdowns */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <select
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
            style={{
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '0.8rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Members</option>
            {members.map((m) => (
              <option key={m.id} value={m.name}>{m.name}</option>
            ))}
          </select>

          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            style={{
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '0.8rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Action Types</option>
            <option value="task_moved">Task Movement</option>
            <option value="comment_added">Comments & @mentions</option>
            <option value="automation_triggered">Automation Engine</option>
            <option value="doc_updated">Documentation Revisions</option>
            <option value="member_joined">Member Onboarding</option>
          </select>
        </div>
      </div>

      {/* Timeline Stream */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {filteredFeed.map((item) => {
          const badge = getActionBadge(item.action);
          const Icon = badge.icon;

          return (
            <div
              key={item.id}
              className="glass-card"
              style={{
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {item.userAvatar ? (
                  <img
                    src={item.userAvatar}
                    alt={item.userName}
                    style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'var(--gradient-dual)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.82rem'
                  }}>
                    {item.userName ? item.userName.charAt(0) : 'D'}
                  </div>
                )}

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>
                      {item.userName}
                    </span>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '10px',
                      background: badge.bg,
                      color: badge.color,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Icon size={11} /> {badge.label}
                    </span>
                  </div>

                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {item.details}
                  </p>
                </div>
              </div>

              <div style={{
                fontSize: '0.72rem',
                color: 'var(--text-tertiary)',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Clock size={12} />
                <span>
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}

        {filteredFeed.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            background: 'var(--bg-surface)',
            borderRadius: '12px',
            color: 'var(--text-tertiary)',
            fontSize: '0.85rem'
          }}>
            No activity matches the selected filter criteria.
          </div>
        )}
      </div>
    </div>
  );
}
