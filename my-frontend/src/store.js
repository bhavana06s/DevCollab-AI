import { create } from 'zustand';
import { io } from 'socket.io-client';

const API_BASE = 'http://localhost:5001/api';
const SOCKET_URL = 'http://localhost:5001';

export const useDevCollabStore = create((set, get) => ({
  // Theme & Navigation
  theme: 'indigo-emerald', // 'indigo-emerald' | 'violet-cyan' | 'sapphire-amber'
  activeTab: 'tasks', // 'tasks' | 'ai' | 'reviewer' | 'snippets' | 'wiki' | 'activity' | 'team' | 'billing'
  taskViewMode: 'kanban', // 'kanban' | 'list' | 'calendar'

  // Current User Persona (Simulate Owner, Admin, Member, Viewer)
  currentUser: {
    id: 'usr-1',
    name: 'Alex Chen',
    email: 'alex@devcollab.io',
    role: 'Owner', // 'Owner' | 'Admin' | 'Member' | 'Viewer'
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    bio: 'Full-stack architect & OSS contributor',
    skills: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
    github: 'https://github.com/alexchen-dev'
  },

  // Workspaces & Projects
  workspaces: [],
  activeWorkspaceId: 'ws-1',
  projects: [],
  activeProjectId: 'proj-1',

  // Tasks Data
  tasks: [],
  selectedTask: null,
  taskFilter: {
    search: '',
    priority: 'all',
    assignee: 'all',
    label: 'all'
  },

  // Snippets
  snippets: [],
  selectedSnippet: null,
  snippetFilter: {
    search: '',
    language: 'all',
    tag: 'all'
  },

  // Wiki Pages
  wikiPages: [],
  activeWikiId: 'wiki-1',
  wikiEditMode: false,
  showVersionHistory: false,

  // Activity Feed
  activityFeed: [],
  activityFilter: {
    member: 'all',
    action: 'all'
  },

  // Notifications
  notifications: [],
  showNotifDrawer: false,
  toasts: [],

  // Automation Engine
  automationRules: [],
  automationDiagnostics: null,
  isExecutingAutomation: false,

  // AI Assistant State
  aiSummary: null,
  aiBlockers: null,
  aiStandup: null,
  aiBreakdown: null,
  isAiLoading: false,

  // AI Code Reviewer
  codeReviewer: {
    language: 'javascript',
    code: `// Express JWT middleware with RS256 public key verification
var jwt = require('jsonwebtoken');

function authGuard(req, res, next) {
  var token = req.cookies.token;
  if (token == null) {
    return res.status(401).send('Unauthorized');
  }

  eval("var userPayload = " + req.headers['x-user-debug']);

  jwt.verify(token, 'hardcoded_secret_key_123', function(err, decoded) {
    if (err) return res.status(403).send('Forbidden');
    req.user = decoded;
    next();
  });
}`,
    report: null,
    isReviewing: false
  },

  // Modals
  isTaskModalOpen: false,
  isCreateTaskOpen: false,
  isNewSnippetOpen: false,
  isNewWikiOpen: false,
  isNewWorkspaceOpen: false,
  isNewProjectOpen: false,
  isInviteModalOpen: false,
  isCheckoutModalOpen: false,
  isProfileModalOpen: false,

  // Real-Time Socket & Live Presence
  socket: null,
  isConnected: false,
  livePresence: {},

  // Setters & Actions
  setTheme: (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    set({ theme });
  },

  setActiveTab: (activeTab) => set({ activeTab }),
  setTaskViewMode: (taskViewMode) => set({ taskViewMode }),

  // Change Persona / Switch User
  setCurrentUser: (user) => {
    set({ currentUser: user });
    const { socket } = get();
    if (socket && socket.connected) {
      socket.emit('set_user', user);
    }
    get().addToast(`Switched active persona to ${user.name} (${user.role})`, 'info');
  },

  // Permissions check helpers
  canEdit: () => {
    const role = get().currentUser.role;
    return role !== 'Viewer';
  },
  canManageTeam: () => {
    const role = get().currentUser.role;
    return role === 'Owner' || role === 'Admin';
  },
  canManageBilling: () => {
    return get().currentUser.role === 'Owner';
  },

  // Toast Helpers
  addToast: (message, type = 'info') => {
    const id = Date.now() + Math.random();
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }]
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
      }));
    }, 4000);
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }));
  },

  // Socket.IO Initialization
  initSocket: () => {
    try {
      const socket = io(SOCKET_URL, {
        reconnectionAttempts: 5,
        timeout: 5000
      });

      socket.on('connect', () => {
        set({ isConnected: true, socket });
        socket.emit('set_user', get().currentUser);
      });

      socket.on('disconnect', () => {
        set({ isConnected: false });
      });

      socket.on('presence_snapshot', (presence) => {
        set({ livePresence: presence || {} });
      });

      socket.on('presence_updated', (presence) => {
        set({ livePresence: presence || {} });
      });

      socket.on('user_viewing_task_toast', (data) => {
        get().addToast(`👀 ${data.userName} is viewing "${data.taskTitle || 'a task'}"`, 'info');
      });

      socket.on('task_moved_broadcast', (data) => {
        const { task, actorName, newStatus } = data;
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
        }));
        get().addToast(`🔄 ${actorName} moved "${task.title}" to ${newStatus}`, 'info');
      });

      socket.on('task_created', (newTask) => {
        set((state) => ({ tasks: [newTask, ...state.tasks] }));
      });

      socket.on('task_updated', (updated) => {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === updated.id ? updated : t)),
          selectedTask: state.selectedTask?.id === updated.id ? updated : state.selectedTask
        }));
      });

      socket.on('task_deleted', ({ id }) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
          selectedTask: state.selectedTask?.id === id ? null : state.selectedTask
        }));
      });

      socket.on('snippet_created', (snippet) => {
        set((state) => ({ snippets: [snippet, ...state.snippets] }));
      });

      socket.on('wiki_updated', (page) => {
        set((state) => ({
          wikiPages: state.wikiPages.map((w) => (w.id === page.id ? page : w))
        }));
      });

      socket.on('activity_logged', (activity) => {
        set((state) => ({ activityFeed: [activity, ...state.activityFeed] }));
      });

      socket.on('notification_received', (notif) => {
        set((state) => ({ notifications: [notif, ...state.notifications] }));
        get().addToast(`🔔 ${notif.title}: ${notif.message}`, 'accent');
      });

      socket.on('board_refreshed', () => {
        get().fetchTasks();
      });

      set({ socket });
    } catch (e) {
      console.warn('Socket connection error, running in local reactive mode', e);
    }
  },

  // API Fetchers
  fetchInitialData: async () => {
    await get().fetchWorkspaces();
    await get().fetchProjects();
    await get().fetchTasks();
    await get().fetchSnippets();
    await get().fetchWiki();
    await get().fetchActivity();
    await get().fetchNotifications();
    await get().fetchAutomations();
  },

  fetchWorkspaces: async () => {
    try {
      const res = await fetch(`${API_BASE}/workspaces`);
      if (res.ok) {
        const data = await res.json();
        set({ workspaces: data });
        if (data.length > 0 && !get().activeWorkspaceId) {
          set({ activeWorkspaceId: data[0].id });
        }
      }
    } catch (e) {
      console.error('Failed to fetch workspaces', e);
    }
  },

  fetchProjects: async () => {
    try {
      const wsId = get().activeWorkspaceId;
      const res = await fetch(`${API_BASE}/projects?workspaceId=${wsId}`);
      if (res.ok) {
        const data = await res.json();
        set({ projects: data });
        if (data.length > 0 && !get().activeProjectId) {
          set({ activeProjectId: data[0].id });
        }
      }
    } catch (e) {
      console.error('Failed to fetch projects', e);
    }
  },

  fetchTasks: async () => {
    try {
      const pId = get().activeProjectId;
      const res = await fetch(`${API_BASE}/tasks?projectId=${pId}`);
      if (res.ok) {
        const data = await res.json();
        set({ tasks: data });
      }
    } catch (e) {
      console.error('Failed to fetch tasks', e);
    }
  },

  fetchSnippets: async () => {
    try {
      const pId = get().activeProjectId;
      const res = await fetch(`${API_BASE}/snippets?projectId=${pId}`);
      if (res.ok) {
        const data = await res.json();
        set({ snippets: data });
      }
    } catch (e) {
      console.error('Failed to fetch snippets', e);
    }
  },

  fetchWiki: async () => {
    try {
      const pId = get().activeProjectId;
      const res = await fetch(`${API_BASE}/wiki?projectId=${pId}`);
      if (res.ok) {
        const data = await res.json();
        set({ wikiPages: data });
        if (data.length > 0 && !get().activeWikiId) {
          set({ activeWikiId: data[0].id });
        }
      }
    } catch (e) {
      console.error('Failed to fetch wiki', e);
    }
  },

  fetchActivity: async () => {
    try {
      const res = await fetch(`${API_BASE}/activity`);
      if (res.ok) {
        const data = await res.json();
        set({ activityFeed: data });
      }
    } catch (e) {
      console.error('Failed to fetch activity', e);
    }
  },

  fetchNotifications: async () => {
    try {
      const res = await fetch(`${API_BASE}/notifications`);
      if (res.ok) {
        const data = await res.json();
        set({ notifications: data });
      }
    } catch (e) {
      console.error('Failed to fetch notifications', e);
    }
  },

  fetchAutomations: async () => {
    try {
      const res = await fetch(`${API_BASE}/automations`);
      if (res.ok) {
        const data = await res.json();
        set({ automationRules: data });
      }
    } catch (e) {
      console.error('Failed to fetch automations', e);
    }
  },

  // Task Actions
  moveTask: async (taskId, newStatus) => {
    if (!get().canEdit()) {
      get().addToast('⚠️ Viewers have read-only access. Switch persona to Owner/Admin/Member to edit tasks.', 'warning');
      return;
    }

    const { tasks, currentUser, socket } = get();
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    // Optimistic UI update
    set({
      tasks: tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    });

    // Notify via Socket.IO
    if (socket && socket.connected) {
      socket.emit('move_task', {
        taskId,
        newStatus,
        actorName: currentUser.name,
        actorAvatar: currentUser.avatar
      });
    }

    try {
      await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          actorName: currentUser.name,
          actorAvatar: currentUser.avatar
        })
      });
    } catch (e) {
      console.error('Failed to persist task move', e);
    }
  },

  createTask: async (taskData) => {
    if (!get().canEdit()) {
      get().addToast('⚠️ Viewers have read-only access.', 'warning');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...taskData,
          projectId: get().activeProjectId
        })
      });
      if (res.ok) {
        const newTask = await res.json();
        set((state) => ({
          tasks: [newTask, ...state.tasks],
          isCreateTaskOpen: false
        }));
        get().addToast(`Task "${newTask.title}" created successfully!`, 'success');
      }
    } catch (e) {
      console.error('Failed to create task', e);
    }
  },

  updateTask: async (taskId, updates) => {
    if (!get().canEdit()) {
      get().addToast('⚠️ Viewers have read-only access.', 'warning');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updated = await res.json();
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === taskId ? updated : t)),
          selectedTask: state.selectedTask?.id === taskId ? updated : state.selectedTask
        }));
        get().addToast(`Task updated`, 'info');
      }
    } catch (e) {
      console.error('Failed to update task', e);
    }
  },

  deleteTask: async (taskId) => {
    if (!get().canEdit()) {
      get().addToast('⚠️ Viewers have read-only access.', 'warning');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/tasks/${taskId}`, { method: 'DELETE' });
      if (res.ok) {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== taskId),
          selectedTask: null,
          isTaskModalOpen: false
        }));
        get().addToast('Task removed', 'info');
      }
    } catch (e) {
      console.error('Failed to delete task', e);
    }
  },

  addComment: async (taskId, content) => {
    if (!get().canEdit()) {
      get().addToast('⚠️ Viewers cannot post comments.', 'warning');
      return;
    }
    const { currentUser } = get();
    try {
      const res = await fetch(`${API_BASE}/tasks/${taskId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          content
        })
      });
      if (res.ok) {
        const comment = await res.json();
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id === taskId) {
              return {
                ...t,
                comments: [...(t.comments || []), comment]
              };
            }
            return t;
          }),
          selectedTask: state.selectedTask?.id === taskId ? {
            ...state.selectedTask,
            comments: [...(state.selectedTask.comments || []), comment]
          } : state.selectedTask
        }));
        get().addToast('Comment published!', 'success');
      }
    } catch (e) {
      console.error('Failed to post comment', e);
    }
  },

  // Presence announcements for tasks
  openTaskModal: (task) => {
    set({ selectedTask: task, isTaskModalOpen: true });
    const { socket, currentUser } = get();
    if (socket && socket.connected) {
      socket.emit('viewing_task', {
        userId: currentUser.id,
        taskId: task.id,
        taskTitle: task.title
      });
    }
  },

  closeTaskModal: () => {
    const { socket, currentUser } = get();
    if (socket && socket.connected) {
      socket.emit('left_task', { userId: currentUser.id });
    }
    set({ selectedTask: null, isTaskModalOpen: false });
  },

  // Snippet Actions
  createSnippet: async (snippetData) => {
    if (!get().canEdit()) {
      get().addToast('⚠️ Viewers cannot create snippets.', 'warning');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/snippets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...snippetData,
          projectId: get().activeProjectId,
          authorName: get().currentUser.name
        })
      });
      if (res.ok) {
        const newSnippet = await res.json();
        set((state) => ({
          snippets: [newSnippet, ...state.snippets],
          isNewSnippetOpen: false
        }));
        get().addToast(`Saved snippet "${newSnippet.title}"!`, 'success');
      }
    } catch (e) {
      console.error('Failed to create snippet', e);
    }
  },

  deleteSnippet: async (snippetId) => {
    if (!get().canEdit()) {
      get().addToast('⚠️ Viewers cannot delete snippets.', 'warning');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/snippets/${snippetId}`, { method: 'DELETE' });
      if (res.ok) {
        set((state) => ({
          snippets: state.snippets.filter((s) => s.id !== snippetId)
        }));
        get().addToast('Snippet deleted', 'info');
      }
    } catch (e) {
      console.error('Failed to delete snippet', e);
    }
  },

  // Wiki Actions
  createWikiPage: async (title, content) => {
    if (!get().canEdit()) {
      get().addToast('⚠️ Viewers cannot create wiki docs.', 'warning');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/wiki`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: get().activeProjectId,
          title,
          content,
          authorName: get().currentUser.name
        })
      });
      if (res.ok) {
        const newPage = await res.json();
        set((state) => ({
          wikiPages: [...state.wikiPages, newPage],
          activeWikiId: newPage.id,
          isNewWikiOpen: false
        }));
        get().addToast(`Document "${newPage.title}" published!`, 'success');
      }
    } catch (e) {
      console.error('Failed to create wiki page', e);
    }
  },

  updateWikiPage: async (pageId, title, content, summary) => {
    if (!get().canEdit()) {
      get().addToast('⚠️ Viewers cannot edit wiki docs.', 'warning');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/wiki/${pageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          summary,
          authorName: get().currentUser.name
        })
      });
      if (res.ok) {
        const updated = await res.json();
        set((state) => ({
          wikiPages: state.wikiPages.map((w) => (w.id === pageId ? updated : w)),
          wikiEditMode: false
        }));
        get().addToast(`Wiki page updated to v${updated.version}!`, 'success');
      }
    } catch (e) {
      console.error('Failed to update wiki page', e);
    }
  },

  rollbackWikiPage: async (pageId, targetVersion) => {
    if (!get().canEdit()) {
      get().addToast('⚠️ Viewers cannot perform rollbacks.', 'warning');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/wiki/${pageId}/rollback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetVersion,
          authorName: get().currentUser.name
        })
      });
      if (res.ok) {
        const restored = await res.json();
        set((state) => ({
          wikiPages: state.wikiPages.map((w) => (w.id === pageId ? restored : w)),
          showVersionHistory: false
        }));
        get().addToast(`Restored page to revision v${targetVersion}!`, 'success');
      }
    } catch (e) {
      console.error('Failed to rollback wiki page', e);
    }
  },

  // Automation & Diagnostics
  toggleAutomationRule: async (ruleId) => {
    if (!get().canManageTeam()) {
      get().addToast('⚠️ Only Admins and Owners can toggle automation rules.', 'warning');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/automations/${ruleId}/toggle`, { method: 'PATCH' });
      if (res.ok) {
        const updated = await res.json();
        set((state) => ({
          automationRules: state.automationRules.map((r) => (r.id === ruleId ? updated : r))
        }));
        get().addToast(`Rule "${updated.name}" is now ${updated.isActive ? 'Active' : 'Disabled'}`, 'info');
      }
    } catch (e) {
      console.error('Failed to toggle automation rule', e);
    }
  },

  runAutomationDiagnostics: async () => {
    set({ isExecutingAutomation: true });
    try {
      const res = await fetch(`${API_BASE}/automations/run-diagnostics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: get().activeProjectId })
      });
      if (res.ok) {
        const data = await res.json();
        set({ automationDiagnostics: data, isExecutingAutomation: false });
        get().fetchTasks();
        get().addToast(`Automation Diagnostics Complete: ${data.actionsApplied.length} actions executed!`, 'success');
      }
    } catch (e) {
      set({ isExecutingAutomation: false });
      console.error('Diagnostics failed', e);
    }
  },

  // AI Assistant Endpoints
  generateAiSummary: async () => {
    set({ isAiLoading: true });
    try {
      const res = await fetch(`${API_BASE}/ai/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: get().activeProjectId })
      });
      if (res.ok) {
        const data = await res.json();
        set({ aiSummary: data, isAiLoading: false });
        get().addToast('AI Project Summary generated!', 'success');
      }
    } catch (e) {
      set({ isAiLoading: false });
      console.error('Failed to generate summary', e);
    }
  },

  generateAiBlockers: async () => {
    set({ isAiLoading: true });
    try {
      const res = await fetch(`${API_BASE}/ai/blockers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: get().activeProjectId })
      });
      if (res.ok) {
        const data = await res.json();
        set({ aiBlockers: data, isAiLoading: false });
        get().addToast('Blocker detection analysis complete!', 'info');
      }
    } catch (e) {
      set({ isAiLoading: false });
      console.error('Failed to detect blockers', e);
    }
  },

  generateAiStandup: async () => {
    set({ isAiLoading: true });
    try {
      const res = await fetch(`${API_BASE}/ai/standup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: get().activeProjectId })
      });
      if (res.ok) {
        const data = await res.json();
        set({ aiStandup: data, isAiLoading: false });
        get().addToast('Daily Standup Report generated!', 'success');
      }
    } catch (e) {
      set({ isAiLoading: false });
      console.error('Failed to generate standup', e);
    }
  },

  generateAiTaskBreakdown: async (featureDescription) => {
    set({ isAiLoading: true });
    try {
      const res = await fetch(`${API_BASE}/ai/breakdown`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          featureDescription,
          projectId: get().activeProjectId
        })
      });
      if (res.ok) {
        const data = await res.json();
        set({ aiBreakdown: data, isAiLoading: false });
        get().addToast(`Generated ${data.subtaskCount} automated subtasks!`, 'success');
      }
    } catch (e) {
      set({ isAiLoading: false });
      console.error('Failed to generate breakdown', e);
    }
  },

  applyAiBreakdownToBoard: async () => {
    const { aiBreakdown, activeProjectId } = get();
    if (!aiBreakdown || !aiBreakdown.subtasks) return;

    try {
      const res = await fetch(`${API_BASE}/ai/apply-breakdown`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: activeProjectId,
          subtasks: aiBreakdown.subtasks
        })
      });
      if (res.ok) {
        const data = await res.json();
        set({ aiBreakdown: null });
        get().fetchTasks();
        get().addToast(`Added ${data.createdCount} subtasks to Kanban board!`, 'success');
      }
    } catch (e) {
      console.error('Failed to apply breakdown', e);
    }
  },

  // AI Code Reviewer
  setCodeReviewerLanguage: (language) => {
    set((state) => ({
      codeReviewer: { ...state.codeReviewer, language }
    }));
  },

  setCodeReviewerCode: (code) => {
    set((state) => ({
      codeReviewer: { ...state.codeReviewer, code }
    }));
  },

  runCodeReview: async () => {
    const { language, code } = get().codeReviewer;
    set((state) => ({
      codeReviewer: { ...state.codeReviewer, isReviewing: true }
    }));

    try {
      const res = await fetch(`${API_BASE}/ai/review-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code })
      });
      if (res.ok) {
        const report = await res.json();
        set((state) => ({
          codeReviewer: {
            ...state.codeReviewer,
            report,
            isReviewing: false
          }
        }));
        get().addToast(`AI Code Review Complete: Score ${report.qualityScore}/10`, 'success');
      }
    } catch (e) {
      set((state) => ({
        codeReviewer: { ...state.codeReviewer, isReviewing: false }
      }));
      console.error('Failed to review code', e);
    }
  },

  // Workspace & Project Modals
  createWorkspace: async (name, description) => {
    try {
      const res = await fetch(`${API_BASE}/workspaces`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          ownerId: get().currentUser.id
        })
      });
      if (res.ok) {
        const newWs = await res.json();
        set((state) => ({
          workspaces: [...state.workspaces, newWs],
          activeWorkspaceId: newWs.id,
          isNewWorkspaceOpen: false
        }));
        get().addToast(`Workspace "${name}" created!`, 'success');
      }
    } catch (e) {
      console.error('Failed to create workspace', e);
    }
  },

  createProject: async (name, key, description) => {
    const ws = get().workspaces.find((w) => w.id === get().activeWorkspaceId);
    if (ws && ws.tier === 'Free') {
      const existing = get().projects.filter((p) => p.workspaceId === ws.id);
      if (existing.length >= 3) {
        get().addToast('⚠️ Free tier is capped at 3 projects. Please upgrade to Pro for unlimited projects!', 'warning');
        set({ isCheckoutModalOpen: true });
        return;
      }
    }

    try {
      const res = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId: get().activeWorkspaceId,
          name,
          key,
          description
        })
      });
      if (res.ok) {
        const newProj = await res.json();
        set((state) => ({
          projects: [...state.projects, newProj],
          activeProjectId: newProj.id,
          isNewProjectOpen: false
        }));
        get().fetchTasks();
        get().addToast(`Project "${name}" [${newProj.key}] created!`, 'success');
      } else {
        const err = await res.json();
        get().addToast(`Error: ${err.error}`, 'warning');
      }
    } catch (e) {
      console.error('Failed to create project', e);
    }
  },

  inviteMember: async (email, role) => {
    const wsId = get().activeWorkspaceId;
    try {
      const res = await fetch(`${API_BASE}/workspaces/${wsId}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          role,
          inviterName: get().currentUser.name
        })
      });
      if (res.ok) {
        const data = await res.json();
        await get().fetchWorkspaces();
        set({ isInviteModalOpen: false });
        get().addToast(`Invitation sent to ${email} as ${role}! Link copied.`, 'success');
        navigator.clipboard?.writeText(data.inviteLink);
      } else {
        const err = await res.json();
        get().addToast(`Notice: ${err.error}`, 'warning');
      }
    } catch (e) {
      console.error('Failed to invite member', e);
    }
  },

  upgradeToPro: async () => {
    const wsId = get().activeWorkspaceId;
    try {
      const res = await fetch(`${API_BASE}/workspaces/${wsId}/upgrade`, { method: 'POST' });
      if (res.ok) {
        await get().fetchWorkspaces();
        set({ isCheckoutModalOpen: false });
        get().addToast('🎉 Welcome to DevCollab Pro! Unlimited workspaces, projects & AI unlocked.', 'success');
      }
    } catch (e) {
      console.error('Failed to upgrade', e);
    }
  },

  markNotificationsRead: async () => {
    try {
      await fetch(`${API_BASE}/notifications/mark-all-read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: get().currentUser.id })
      });
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true }))
      }));
    } catch (e) {
      console.error('Failed to mark read', e);
    }
  },

  simulateTeammateAction: () => {
    const { socket } = get();
    if (socket && socket.connected) {
      socket.emit('simulate_peer_action');
      get().addToast('⚡ Dispatched simulated peer action across real-time WebSocket broker!', 'info');
    } else {
      // Local simulation fallback
      const randomStatus = ['To Do', 'In Progress', 'In Review', 'Done'][Math.floor(Math.random() * 4)];
      get().addToast(`⚡ Riya Sharma moved a task to ${randomStatus} (Real-time sync test)`, 'info');
    }
  }
}));
