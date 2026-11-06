import React, { useState } from 'react';
import { useDevCollabStore } from '../store';
import {
  Kanban as KanbanIcon,
  ListFilter,
  Calendar as CalendarIcon,
  Search,
  Plus,
  Sparkles,
  Paperclip,
  MessageSquare,
  Clock,
  User,
  Eye
} from 'lucide-react';
import TaskModal from './TaskModal';

export default function TaskBoard() {
  const {
    tasks,
    activeProjectId,
    taskViewMode,
    setTaskViewMode,
    moveTask,
    openTaskModal,
    workspaces,
    activeWorkspaceId,
    livePresence
  } = useDevCollabStore((state) => state);

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const currentWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);
  const members = currentWorkspace?.members || [];

  const columns = [
    { id: 'To Do', title: 'To Do', color: '#818cf8', bg: 'rgba(129, 140, 248, 0.1)' },
    { id: 'In Progress', title: 'In Progress', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
    { id: 'In Review', title: 'In Review', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)' },
    { id: 'Done', title: 'Done', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' }
  ];

  // Filter tasks
  const projectTasks = tasks.filter((t) => t.projectId === activeProjectId);
  const filteredTasks = projectTasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (task.labels && task.labels.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesAssignee = assigneeFilter === 'all' || task.assigneeId === assigneeFilter;
    return matchesSearch && matchesPriority && matchesAssignee;
  });

  // Drag and drop handlers
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    setDragOverColumn(colId);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    setDragOverColumn(null);
    setDraggedTaskId(null);

    if (taskId) {
      moveTask(taskId, targetStatus);
    }
  };

  return (
    <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '24px' }}>
      {/* View Switcher & Filter Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* Left: View Mode Toggle & Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* View Mode Buttons */}
          <div style={{
            display: 'flex',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '3px'
          }}>
            <button
              onClick={() => setTaskViewMode('kanban')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                background: taskViewMode === 'kanban' ? 'var(--gradient-dual)' : 'transparent',
                border: 'none',
                color: taskViewMode === 'kanban' ? '#fff' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              <KanbanIcon size={14} /> Kanban
            </button>
            <button
              onClick={() => setTaskViewMode('list')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                background: taskViewMode === 'list' ? 'var(--gradient-dual)' : 'transparent',
                border: 'none',
                color: taskViewMode === 'list' ? '#fff' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              <ListFilter size={14} /> List View
            </button>
            <button
              onClick={() => setTaskViewMode('calendar')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                background: taskViewMode === 'calendar' ? 'var(--gradient-dual)' : 'transparent',
                border: 'none',
                color: taskViewMode === 'calendar' ? '#fff' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              <CalendarIcon size={14} /> Calendar
            </button>
          </div>

          {/* Search Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '6px 12px',
            width: '260px'
          }}>
            <Search size={15} color="var(--text-tertiary)" />
            <input
              type="text"
              placeholder="Search tasks, labels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                outline: 'none',
                fontSize: '0.82rem',
                width: '100%'
              }}
            />
          </div>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.82rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Priorities</option>
            <option value="P0">P0 — Urgent</option>
            <option value="P1">P1 — High</option>
            <option value="P2">P2 — Normal</option>
          </select>

          {/* Assignee Filter */}
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.82rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Assignees</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => useDevCollabStore.setState({ activeTab: 'ai' })}
            className="btn-secondary"
            style={{ gap: '6px', fontSize: '0.82rem' }}
            title="Generate task breakdown from feature prompt"
          >
            <Sparkles size={15} color="var(--secondary)" />
            <span>AI Subtask Generator</span>
          </button>

          <button
            onClick={() => useDevCollabStore.setState({ isCreateTaskOpen: true })}
            className="btn-primary"
            style={{ fontSize: '0.82rem' }}
          >
            <Plus size={16} />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Main Content View Switcher */}
      {taskViewMode === 'kanban' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          alignItems: 'start'
        }}>
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);
            const isTargeted = dragOverColumn === col.id;

            return (
              <div
                key={col.id}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, col.id)}
                style={{
                  background: 'var(--bg-surface)',
                  borderRadius: '12px',
                  border: isTargeted ? '2px dashed var(--secondary)' : '1px solid var(--border-subtle)',
                  padding: '14px',
                  minHeight: '620px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  boxShadow: isTargeted ? '0 0 20px var(--secondary-glow)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Column Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: col.color
                    }} />
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>
                      {col.title}
                    </span>
                    <span style={{
                      fontSize: '0.72rem',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      background: col.bg,
                      color: col.color,
                      fontWeight: 700
                    }}>
                      {colTasks.length}
                    </span>
                  </div>
                </div>

                {/* Task Cards Container */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  flexGrow: 1
                }}>
                  {colTasks.map((task) => {
                    const assignee = members.find((m) => m.id === task.assigneeId);
                    const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Done';

                    // Check live presence viewing this task
                    const viewerPeer = Object.values(livePresence).find(
                      (p) => p.taskId === task.id
                    );

                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onClick={() => openTaskModal(task)}
                        className="glass-card"
                        style={{
                          padding: '14px',
                          cursor: 'grab',
                          position: 'relative'
                        }}
                      >
                        {/* Live Presence Indicator */}
                        {viewerPeer && (
                          <div style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'var(--gradient-dual)',
                            color: '#fff',
                            fontSize: '0.65rem',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            boxShadow: '0 0 10px var(--secondary-glow)',
                            fontWeight: 700,
                            animation: 'pulseGlow 2s infinite'
                          }}>
                            <Eye size={11} /> {viewerPeer.userName} viewing
                          </div>
                        )}

                        {/* Top Meta: Priority Pill & Labels */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: task.priority === 'P0' ? 'var(--p0-bg)' : task.priority === 'P1' ? 'var(--p1-bg)' : 'var(--p2-bg)',
                            color: task.priority === 'P0' ? 'var(--p0-red)' : task.priority === 'P1' ? 'var(--p1-amber)' : 'var(--p2-indigo)',
                            border: `1px solid ${task.priority === 'P0' ? 'var(--p0-border)' : task.priority === 'P1' ? 'var(--p1-border)' : 'var(--p2-border)'}`
                          }}>
                            {task.priority}
                          </span>

                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            {(task.labels || []).slice(0, 2).map((label, i) => (
                              <span
                                key={i}
                                style={{
                                  fontSize: '0.68rem',
                                  padding: '1px 6px',
                                  borderRadius: '4px',
                                  background: 'rgba(255, 255, 255, 0.05)',
                                  color: 'var(--text-secondary)',
                                  border: '1px solid var(--border-subtle)'
                                }}
                              >
                                {label}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Title */}
                        <div style={{
                          fontSize: '0.88rem',
                          fontWeight: 600,
                          color: '#fff',
                          marginBottom: '8px',
                          lineHeight: 1.35
                        }}>
                          {task.title}
                        </div>

                        {/* Description snippet */}
                        {task.description && (
                          <div style={{
                            fontSize: '0.76rem',
                            color: 'var(--text-secondary)',
                            marginBottom: '12px',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: 1.4
                          }}>
                            {task.description}
                          </div>
                        )}

                        {/* Bottom Row: Due date, Attachments, Comments, Assignee */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderTop: '1px solid rgba(255, 255, 255, 0.04)',
                          paddingTop: '8px',
                          marginTop: '4px'
                        }}>
                          {/* Due Date & Counters */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.7rem',
                              color: isOverdue ? 'var(--p0-red)' : 'var(--text-tertiary)',
                              fontWeight: isOverdue ? 700 : 500
                            }}>
                              <Clock size={12} />
                              <span>{task.dueDate}</span>
                            </div>

                            {task.attachments && task.attachments.length > 0 && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                                <Paperclip size={12} />
                                <span>{task.attachments.length}</span>
                              </div>
                            )}

                            {task.comments && task.comments.length > 0 && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                                <MessageSquare size={12} />
                                <span>{task.comments.length}</span>
                              </div>
                            )}
                          </div>

                          {/* Assignee Avatar */}
                          {assignee ? (
                            <img
                              src={assignee.avatar}
                              alt={assignee.name}
                              title={`Assigned to ${assignee.name}`}
                              style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                          ) : (
                            <div style={{
                              width: '22px',
                              height: '22px',
                              borderRadius: '50%',
                              background: 'rgba(255,255,255,0.06)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <User size={12} color="var(--text-tertiary)" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {colTasks.length === 0 && (
                    <div style={{
                      padding: '32px 16px',
                      textAlign: 'center',
                      color: 'var(--text-muted)',
                      fontSize: '0.78rem',
                      border: '1px dashed rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px'
                    }}>
                      Drop tasks here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {taskViewMode === 'list' && (
        <div style={{
          background: 'var(--bg-surface)',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 600 }}>Task Title</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 600 }}>Priority</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 600 }}>Assignee</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 600 }}>Due Date</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 600 }}>Labels</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => {
                const assignee = members.find((m) => m.id === task.assigneeId);
                return (
                  <tr
                    key={task.id}
                    onClick={() => openTaskModal(task)}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#fff' }}>
                      {task.title}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        background: 'rgba(255, 255, 255, 0.06)',
                        color: task.status === 'Done' ? 'var(--secondary)' : 'var(--text-primary)'
                      }}>
                        {task.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: task.priority === 'P0' ? 'var(--p0-bg)' : task.priority === 'P1' ? 'var(--p1-bg)' : 'var(--p2-bg)',
                        color: task.priority === 'P0' ? 'var(--p0-red)' : task.priority === 'P1' ? 'var(--p1-amber)' : 'var(--p2-indigo)'
                      }}>
                        {task.priority}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {assignee ? (
                          <>
                            <img src={assignee.avatar} alt="" style={{ width: '22px', height: '22px', borderRadius: '50%' }} />
                            <span>{assignee.name}</span>
                          </>
                        ) : (
                          <span style={{ color: 'var(--text-tertiary)' }}>Unassigned</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                      {task.dueDate}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {(task.labels || []).map((l, i) => (
                          <span key={i} style={{ fontSize: '0.7rem', padding: '1px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
                            {l}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Calendar View */}
      {taskViewMode === 'calendar' && (
        <div style={{
          background: 'var(--bg-surface)',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)',
          padding: '20px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
              October 2026 Sprint Schedule
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Showing {filteredTasks.length} Scheduled Deliverables
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '8px',
            textAlign: 'center'
          }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} style={{ padding: '8px', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-tertiary)' }}>
                {d}
              </div>
            ))}

            {Array.from({ length: 31 }, (_, i) => {
              const day = i + 1;
              const dateStr = `2026-10-${day < 10 ? '0' + day : day}`;
              const dayTasks = filteredTasks.filter((t) => t.dueDate === dateStr);

              return (
                <div
                  key={day}
                  style={{
                    background: dayTasks.length > 0 ? 'rgba(99, 102, 241, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    minHeight: '85px',
                    padding: '6px',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    {day}
                  </div>
                  {dayTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => openTaskModal(t)}
                      style={{
                        padding: '3px 6px',
                        borderRadius: '4px',
                        background: t.priority === 'P0' ? 'var(--p0-bg)' : 'var(--primary-bg)',
                        border: `1px solid ${t.priority === 'P0' ? 'var(--p0-border)' : 'var(--primary-border)'}`,
                        color: t.priority === 'P0' ? 'var(--p0-red)' : 'var(--primary-light)',
                        fontSize: '0.68rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        marginBottom: '4px',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis'
                      }}
                      title={t.title}
                    >
                      {t.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      <TaskModal />
    </div>
  );
}
