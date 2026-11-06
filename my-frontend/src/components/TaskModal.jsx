import React, { useState } from 'react';
import { useDevCollabStore } from '../store';
import {
  X,
  Paperclip,
  MessageSquare,
  Send,
  Trash2,
  Upload,
  AtSign
} from 'lucide-react';

export default function TaskModal() {
  const {
    isTaskModalOpen,
    closeTaskModal,
    selectedTask,
    updateTask,
    deleteTask,
    addComment,
    workspaces,
    activeWorkspaceId,
    canEdit,
    addToast
  } = useDevCollabStore((state) => state);

  const [commentText, setCommentText] = useState('');
  const [showMentionMenu, setShowMentionMenu] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');

  const currentWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);
  const members = currentWorkspace?.members || [];

  if (!isTaskModalOpen || !selectedTask) return null;

  const handleStatusChange = (newStatus) => {
    updateTask(selectedTask.id, { status: newStatus });
  };

  const handlePriorityChange = (newPriority) => {
    updateTask(selectedTask.id, { priority: newPriority });
  };

  const handleAssigneeChange = (newAssigneeId) => {
    updateTask(selectedTask.id, { assigneeId: newAssigneeId });
  };

  const handleDueDateChange = (newDate) => {
    updateTask(selectedTask.id, { dueDate: newDate });
  };

  // Comment input with @mention detection
  const handleCommentInputChange = (e) => {
    const text = e.target.value;
    setCommentText(text);

    const lastAtIdx = text.lastIndexOf('@');
    if (lastAtIdx !== -1 && lastAtIdx >= text.length - 15) {
      const query = text.slice(lastAtIdx + 1);
      setMentionQuery(query);
      setShowMentionMenu(true);
    } else {
      setShowMentionMenu(false);
    }
  };

  const insertMention = (memberName) => {
    const lastAtIdx = commentText.lastIndexOf('@');
    const newText = commentText.slice(0, lastAtIdx) + `@${memberName} ` + commentText.slice(lastAtIdx + mentionQuery.length + 1);
    setCommentText(newText);
    setShowMentionMenu(false);
  };

  const submitComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(selectedTask.id, commentText);
    setCommentText('');
    setShowMentionMenu(false);
  };

  // Attachment upload simulator
  const handleUploadAttachment = () => {
    const sampleNames = ['architecture_diagram_v3.png', 'api_load_test_results.csv', 'deployment_spec.yml'];
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const newAttachment = {
      id: 'att-' + Date.now(),
      name: randomName,
      size: `${Math.floor(100 + Math.random() * 900)} KB`,
      type: randomName.endsWith('.png') ? 'image' : 'document'
    };

    const currentAttachments = selectedTask.attachments || [];
    updateTask(selectedTask.id, {
      attachments: [...currentAttachments, newAttachment]
    });
    addToast(`Attached ${randomName} to task`, 'success');
  };

  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  return (
    <div className="modal-overlay" onClick={closeTaskModal}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '780px', maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-surface-elevated)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '4px',
              background: selectedTask.priority === 'P0' ? 'var(--p0-bg)' : selectedTask.priority === 'P1' ? 'var(--p1-bg)' : 'var(--p2-bg)',
              color: selectedTask.priority === 'P0' ? 'var(--p0-red)' : selectedTask.priority === 'P1' ? 'var(--p1-amber)' : 'var(--p2-indigo)',
              border: `1px solid ${selectedTask.priority === 'P0' ? 'var(--p0-border)' : 'var(--border-subtle)'}`
            }}>
              {selectedTask.priority}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
              {selectedTask.id}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {canEdit() && (
              <button
                onClick={() => deleteTask(selectedTask.id)}
                className="btn-icon"
                title="Delete Task"
                style={{ color: 'var(--danger)' }}
              >
                <Trash2 size={16} />
              </button>
            )}
            <button onClick={closeTaskModal} className="btn-icon">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flexGrow: 1 }}>
          {/* Title */}
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>
            {selectedTask.title}
          </h2>

          {/* Quick Properties Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px',
            marginBottom: '24px',
            padding: '14px',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)'
          }}>
            {/* Status Selector */}
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 700 }}>
                Status
              </div>
              <select
                value={selectedTask.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={!canEdit()}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  borderRadius: '6px',
                  padding: '5px 8px',
                  fontSize: '0.8rem',
                  width: '100%'
                }}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="In Review">In Review</option>
                <option value="Done">Done</option>
              </select>
            </div>

            {/* Priority Selector */}
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 700 }}>
                Priority
              </div>
              <select
                value={selectedTask.priority}
                onChange={(e) => handlePriorityChange(e.target.value)}
                disabled={!canEdit()}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  borderRadius: '6px',
                  padding: '5px 8px',
                  fontSize: '0.8rem',
                  width: '100%'
                }}
              >
                <option value="P0">P0 — Urgent</option>
                <option value="P1">P1 — High</option>
                <option value="P2">P2 — Normal</option>
              </select>
            </div>

            {/* Assignee Selector */}
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 700 }}>
                Assignee
              </div>
              <select
                value={selectedTask.assigneeId || ''}
                onChange={(e) => handleAssigneeChange(e.target.value)}
                disabled={!canEdit()}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  borderRadius: '6px',
                  padding: '5px 8px',
                  fontSize: '0.8rem',
                  width: '100%'
                }}
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 700 }}>
                Due Date
              </div>
              <input
                type="date"
                value={selectedTask.dueDate || ''}
                onChange={(e) => handleDueDateChange(e.target.value)}
                disabled={!canEdit()}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontSize: '0.8rem',
                  width: '100%'
                }}
              />
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Description & Requirements
            </h4>
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '14px',
              fontSize: '0.85rem',
              lineHeight: 1.6,
              color: 'var(--text-primary)'
            }}>
              {selectedTask.description || 'No description provided.'}
            </div>
          </div>

          {/* Attachments Section */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Paperclip size={15} /> Attachments ({(selectedTask.attachments || []).length})
              </h4>
              {canEdit() && (
                <button
                  onClick={handleUploadAttachment}
                  className="btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.76rem', gap: '4px' }}
                >
                  <Upload size={12} /> Upload Sample
                </button>
              )}
            </div>

            {(selectedTask.attachments || []).length === 0 ? (
              <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                No attachments uploaded yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedTask.attachments.map((att) => (
                  <div
                    key={att.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.78rem'
                    }}
                  >
                    <Paperclip size={13} color="var(--primary-light)" />
                    <span style={{ color: '#fff', fontWeight: 600 }}>{att.name}</span>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.7rem' }}>({att.size})</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Comments Thread & @mentions */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquare size={15} /> Comments & Mentions
            </h4>

            {/* Existing Comments */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              {(selectedTask.comments || []).length === 0 ? (
                <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                  No comments yet. Type below to discuss or mention a teammate!
                </div>
              ) : (
                selectedTask.comments.map((comm) => (
                  <div
                    key={comm.id}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.04)'
                    }}
                  >
                    <img
                      src={comm.userAvatar}
                      alt={comm.userName}
                      style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div style={{ flexGrow: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>
                          {comm.userName}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                          {new Date(comm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                        {comm.content}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Comment Input with @mention flyout */}
            <form onSubmit={submitComment} style={{ position: 'relative' }}>
              {showMentionMenu && filteredMembers.length > 0 && (
                <div style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: 0,
                  width: '260px',
                  background: '#0d1424',
                  border: '1px solid var(--border-focus)',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '6px',
                  marginBottom: '8px',
                  zIndex: 100
                }}>
                  <div style={{ padding: '4px 6px', fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Mention Teammate
                  </div>
                  {filteredMembers.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => insertMention(m.name)}
                      style={{
                        padding: '6px 8px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        color: '#fff'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-bg)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <img src={m.avatar} alt="" style={{ width: '20px', height: '20px', borderRadius: '50%' }} />
                      <span>{m.name}</span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>({m.role})</span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '6px 12px'
              }}>
                <AtSign size={16} color="var(--primary)" />
                <input
                  type="text"
                  placeholder="Add a comment or type @ to mention team members..."
                  value={commentText}
                  onChange={handleCommentInputChange}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '0.84rem',
                    flexGrow: 1
                  }}
                />
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                >
                  <Send size={13} /> Post
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
