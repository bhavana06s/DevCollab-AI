import React, { useState } from 'react';
import { useDevCollabStore } from '../store';
import {
  X,
  Save
} from 'lucide-react';

export function CreateTaskModal() {
  const {
    isCreateTaskOpen,
    createTask,
    workspaces,
    activeWorkspaceId
  } = useDevCollabStore((state) => state);

  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('P1');
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
  const [labels, setLabels] = useState('Frontend, Feature');
  const [description, setDescription] = useState('');

  const currentWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);
  const members = currentWorkspace?.members || [];

  if (!isCreateTaskOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    createTask({
      title,
      priority,
      assigneeId: assigneeId || members[0]?.id || 'usr-1',
      dueDate,
      labels: labels.split(',').map((l) => l.trim()),
      description
    });

    useDevCollabStore.setState({ isCreateTaskOpen: false });
    setTitle('');
    setDescription('');
  };

  return (
    <div className="modal-overlay" onClick={() => useDevCollabStore.setState({ isCreateTaskOpen: false })}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            Create New Project Task
          </h3>
          <button onClick={() => useDevCollabStore.setState({ isCreateTaskOpen: false })} className="btn-icon">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Task Title
            </label>
            <input
              type="text"
              placeholder="e.g. Implement OAuth2 refresh token rotation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
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
                <option value="P0">P0 — Urgent</option>
                <option value="P1">P1 — High</option>
                <option value="P2">P2 — Normal</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                Assignee
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
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
                {members.map((m) => (
                  <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                style={{
                  width: '100%',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '7px 12px',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '0.84rem'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                Labels (Comma separated)
              </label>
              <input
                type="text"
                placeholder="Auth, Security, Backend"
                value={labels}
                onChange={(e) => setLabels(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '7px 12px',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '0.84rem'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Description & Acceptance Criteria
            </label>
            <textarea
              rows={4}
              placeholder="Detail the technical requirements and testing steps..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '10px 12px',
                color: '#fff',
                outline: 'none',
                fontSize: '0.84rem',
                resize: 'none',
                lineHeight: 1.5
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={() => useDevCollabStore.setState({ isCreateTaskOpen: false })}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function NewWorkspaceModal() {
  const { isNewWorkspaceOpen, createWorkspace } = useDevCollabStore((state) => state);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  if (!isNewWorkspaceOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    createWorkspace(name, description);
    setName('');
    setDescription('');
  };

  return (
    <div className="modal-overlay" onClick={() => useDevCollabStore.setState({ isNewWorkspaceOpen: false })}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', padding: '24px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: '14px' }}>
          Create New Team Workspace
        </h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Workspace Name
            </label>
            <input
              type="text"
              placeholder="e.g. Distributed Systems Club"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            <label style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Description
            </label>
            <input
              type="text"
              placeholder="Short bio of this organization"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={() => useDevCollabStore.setState({ isNewWorkspaceOpen: false })}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Workspace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function NewProjectModal() {
  const { isNewProjectOpen, createProject } = useDevCollabStore((state) => state);
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');

  if (!isNewProjectOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    createProject(name, key, description);
    setName('');
    setKey('');
    setDescription('');
  };

  return (
    <div className="modal-overlay" onClick={() => useDevCollabStore.setState({ isNewProjectOpen: false })}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', padding: '24px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: '14px' }}>
          Create New Project Inside Workspace
        </h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Project Name
            </label>
            <input
              type="text"
              placeholder="e.g. Autonomous Drone Telemetry"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!key && e.target.value.length >= 3) {
                  setKey(e.target.value.substring(0, 4).toUpperCase());
                }
              }}
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
            <label style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Project Key (Prefix for tasks)
            </label>
            <input
              type="text"
              placeholder="e.g. DRON"
              value={key}
              onChange={(e) => setKey(e.target.value.toUpperCase())}
              maxLength={6}
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
            <label style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Objectives and scope of this project..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '8px 12px',
                color: '#fff',
                outline: 'none',
                fontSize: '0.84rem',
                resize: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={() => useDevCollabStore.setState({ isNewProjectOpen: false })}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function UserProfileModal() {
  const { isProfileModalOpen, currentUser, setCurrentUser, addToast } = useDevCollabStore((state) => state);
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [skills, setSkills] = useState((currentUser?.skills || []).join(', '));
  const [github, setGithub] = useState(currentUser?.github || '');

  if (!isProfileModalOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setCurrentUser({
      ...currentUser,
      bio,
      skills: skills.split(',').map((s) => s.trim()),
      github
    });
    useDevCollabStore.setState({ isProfileModalOpen: false });
    addToast('Profile saved successfully!', 'success');
  };

  return (
    <div className="modal-overlay" onClick={() => useDevCollabStore.setState({ isProfileModalOpen: false })}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', margin: 0 }}>
            Developer Profile & Bio
          </h3>
          <button onClick={() => useDevCollabStore.setState({ isProfileModalOpen: false })} className="btn-icon">
            <X size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>{currentUser.name}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>{currentUser.email}</div>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '1px 8px',
              borderRadius: '8px',
              background: 'var(--primary-bg)',
              color: 'var(--primary-light)',
              marginTop: '4px',
              display: 'inline-block'
            }}>
              Role: {currentUser.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Developer Bio
            </label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
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
            <label style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              Skills & Tech Stack (Comma separated)
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
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
            <label style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
              GitHub Profile Link
            </label>
            <input
              type="text"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={() => useDevCollabStore.setState({ isProfileModalOpen: false })}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Save size={14} /> Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ToastContainer() {
  const { toasts, removeToast } = useDevCollabStore((state) => state);

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxWidth: '380px'
    }}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            background: '#0f1628',
            border: `1px solid ${toast.type === 'success' ? 'var(--secondary)' : toast.type === 'warning' ? 'var(--warning)' : 'var(--border-focus)'}`,
            borderRadius: '10px',
            padding: '12px 16px',
            color: '#fff',
            fontSize: '0.82rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.6), var(--shadow-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            animation: 'fadeInScale 0.2s ease'
          }}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-tertiary)',
              cursor: 'pointer',
              padding: '2px'
            }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
