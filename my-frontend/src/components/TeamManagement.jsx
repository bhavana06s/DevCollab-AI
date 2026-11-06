import React, { useState } from 'react';
import { useDevCollabStore } from '../store';
import {
  UserPlus,
  Copy,
  Check,
  ExternalLink,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export default function TeamManagement() {
  const {
    workspaces,
    activeWorkspaceId,
    canManageTeam,
    inviteMember,
    addToast
  } = useDevCollabStore((state) => state);

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Member');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const currentWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];
  const members = currentWorkspace?.members || [];

  const handleSendInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    // Check Free tier limit
    if (currentWorkspace.tier === 'Free' && members.length >= 5) {
      addToast('⚠️ Free tier workspace is limited to 5 members. Please upgrade to Pro!', 'warning');
      useDevCollabStore.setState({ isCheckoutModalOpen: true });
      return;
    }

    inviteMember(inviteEmail, inviteRole);
    setGeneratedLink(`https://devcollab.io/join/${currentWorkspace.inviteCode}?email=${encodeURIComponent(inviteEmail)}&role=${inviteRole}`);
    setInviteEmail('');
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(generatedLink);
    setCopiedLink(true);
    addToast('Invitation link copied to clipboard!', 'success');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const permissionsMatrix = [
    { capability: 'View tasks, documents & code snippets', owner: true, admin: true, member: true, viewer: true },
    { capability: 'Create & update tasks, move Kanban columns', owner: true, admin: true, member: true, viewer: false },
    { capability: 'Add comments and @mention teammates', owner: true, admin: true, member: true, viewer: false },
    { capability: 'Save code snippets and edit documentation wiki', owner: true, admin: true, member: true, viewer: false },
    { capability: 'Configure Automation Rules & Run AI Tools', owner: true, admin: true, member: true, viewer: false },
    { capability: 'Invite new members and assign roles', owner: true, admin: true, member: false, viewer: false },
    { capability: 'Manage billing, subscriptions & workspace settings', owner: true, admin: false, member: false, viewer: false }
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
      {/* Header and Invite Action */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              Team & Permissions: {currentWorkspace?.name}
            </h2>
            <span style={{
              fontSize: '0.72rem',
              padding: '2px 8px',
              borderRadius: '10px',
              background: currentWorkspace?.tier === 'Pro' ? 'var(--secondary-bg)' : 'rgba(255,255,255,0.08)',
              color: currentWorkspace?.tier === 'Pro' ? 'var(--secondary)' : 'var(--text-secondary)',
              border: `1px solid ${currentWorkspace?.tier === 'Pro' ? 'var(--secondary-border)' : 'var(--border-subtle)'}`,
              fontWeight: 700
            }}>
              {currentWorkspace?.tier || 'Pro'} Workspace
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            Manage collaborators, assign granular role permissions (Owner, Admin, Member, Viewer), and invite via secure links.
          </p>
        </div>

        {canManageTeam() && (
          <button
            onClick={() => setIsInviteOpen(true)}
            className="btn-primary"
            style={{ fontSize: '0.84rem' }}
          >
            <UserPlus size={16} /> Invite Member via Link
          </button>
        )}
      </div>

      {/* Members Table */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        overflow: 'hidden',
        marginBottom: '32px'
      }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0 }}>
            Workspace Members ({members.length})
          </h3>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)' }}>
            Role-Based Access Control Active
          </span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-subtle)' }}>
              <th style={{ padding: '12px 18px', color: 'var(--text-secondary)', fontWeight: 600 }}>Member</th>
              <th style={{ padding: '12px 18px', color: 'var(--text-secondary)', fontWeight: 600 }}>Role</th>
              <th style={{ padding: '12px 18px', color: 'var(--text-secondary)', fontWeight: 600 }}>Skills & Tech Stack</th>
              <th style={{ padding: '12px 18px', color: 'var(--text-secondary)', fontWeight: 600 }}>GitHub</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr
                key={member.id}
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                  transition: 'background 0.15s ease'
                }}
              >
                <td style={{ padding: '14px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={member.avatar}
                      alt={member.name}
                      style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem' }}>
                        {member.name}
                      </div>
                      <div style={{ color: 'var(--text-tertiary)', fontSize: '0.74rem' }}>
                        {member.email}
                      </div>
                    </div>
                  </div>
                </td>

                <td style={{ padding: '14px 18px' }}>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    background: member.role === 'Owner' ? 'var(--gradient-dual-soft)' : member.role === 'Admin' ? 'var(--primary-bg)' : member.role === 'Member' ? 'var(--secondary-bg)' : 'rgba(255,255,255,0.06)',
                    color: member.role === 'Owner' ? '#fff' : member.role === 'Admin' ? 'var(--primary-light)' : member.role === 'Member' ? 'var(--secondary)' : 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    {member.role === 'Owner' && '👑 '}
                    {member.role}
                  </span>
                </td>

                <td style={{ padding: '14px 18px' }}>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {(member.skills || []).map((skill, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '0.7rem',
                          padding: '1px 7px',
                          borderRadius: '4px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--border-subtle)'
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </td>

                <td style={{ padding: '14px 18px' }}>
                  {member.github ? (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: 'var(--primary-light)',
                        textDecoration: 'none',
                        fontSize: '0.78rem',
                        fontWeight: 600
                      }}
                    >
                      <span>{member.github.replace('https://github.com/', '')}</span>
                      <ExternalLink size={12} />
                    </a>
                  ) : (
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.78rem' }}>None</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role Permission Matrix */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '24px'
      }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
          Role Permissions Matrix Reference
        </h3>
        <p style={{ margin: '0 0 18px 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
          Detailed rights enforced by the DevCollab access control guardian.
        </p>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-subtle)' }}>
              <th style={{ padding: '10px 14px', color: 'var(--text-secondary)', fontWeight: 600 }}>Capability</th>
              <th style={{ padding: '10px 14px', color: 'var(--text-secondary)', fontWeight: 600, textAlign: 'center' }}>Owner</th>
              <th style={{ padding: '10px 14px', color: 'var(--text-secondary)', fontWeight: 600, textAlign: 'center' }}>Admin</th>
              <th style={{ padding: '10px 14px', color: 'var(--text-secondary)', fontWeight: 600, textAlign: 'center' }}>Member</th>
              <th style={{ padding: '10px 14px', color: 'var(--text-secondary)', fontWeight: 600, textAlign: 'center' }}>Viewer</th>
            </tr>
          </thead>
          <tbody>
            {permissionsMatrix.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <td style={{ padding: '10px 14px', color: '#fff', fontWeight: 500 }}>{item.capability}</td>
                <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                  {item.owner ? <CheckCircle2 size={16} color="var(--secondary)" style={{ margin: '0 auto' }} /> : <XCircle size={16} color="var(--text-tertiary)" style={{ margin: '0 auto' }} />}
                </td>
                <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                  {item.admin ? <CheckCircle2 size={16} color="var(--secondary)" style={{ margin: '0 auto' }} /> : <XCircle size={16} color="var(--text-tertiary)" style={{ margin: '0 auto' }} />}
                </td>
                <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                  {item.member ? <CheckCircle2 size={16} color="var(--secondary)" style={{ margin: '0 auto' }} /> : <XCircle size={16} color="var(--text-tertiary)" style={{ margin: '0 auto' }} />}
                </td>
                <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                  {item.viewer ? <CheckCircle2 size={16} color="var(--secondary)" style={{ margin: '0 auto' }} /> : <XCircle size={16} color="var(--danger)" style={{ margin: '0 auto' }} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite Modal */}
      {isInviteOpen && (
        <div className="modal-overlay" onClick={() => setIsInviteOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '500px', padding: '24px' }}
          >
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
              Invite Team Member to {currentWorkspace.name}
            </h3>
            <p style={{ margin: '0 0 18px 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Enter email address and select role to generate a dedicated onboarding invitation link.
            </p>

            <form onSubmit={handleSendInvite} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="collaborator@university.edu"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '0.84rem'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  Assigned Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '0.84rem'
                  }}
                >
                  <option value="Admin">Admin — Full project & member administration</option>
                  <option value="Member">Member — Can create & edit tasks, docs, snippets</option>
                  <option value="Viewer">Viewer — Read-only observation</option>
                </select>
              </div>

              {generatedLink && (
                <div style={{
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid var(--secondary-border)',
                  borderRadius: '8px',
                  padding: '12px'
                }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--secondary)', fontWeight: 700, marginBottom: '6px' }}>
                    Shareable Invite Link Generated:
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="text"
                      readOnly
                      value={generatedLink}
                      style={{
                        width: '100%',
                        background: '#070b14',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '4px',
                        padding: '6px 8px',
                        fontSize: '0.74rem',
                        color: 'var(--text-secondary)'
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="btn-primary"
                      style={{ padding: '6px 12px', fontSize: '0.76rem' }}
                    >
                      {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="btn-secondary"
                >
                  Close
                </button>
                <button type="submit" className="btn-primary">
                  Generate Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
