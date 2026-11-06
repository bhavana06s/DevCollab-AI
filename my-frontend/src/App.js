import React, { useEffect } from 'react';
import { useDevCollabStore } from './store';
import Navbar from './components/Navbar';
import ProjectSubheader from './components/ProjectSubheader';
import TaskBoard from './components/TaskBoard';
import AiAssistant from './components/AiAssistant';
import CodeReviewer from './components/CodeReviewer';
import SnippetManager from './components/SnippetManager';
import WikiDocs from './components/WikiDocs';
import ActivityFeedView from './components/ActivityFeedView';
import TeamManagement from './components/TeamManagement';
import BillingView from './components/BillingView';
import {
  CreateTaskModal,
  NewWorkspaceModal,
  NewProjectModal,
  UserProfileModal,
  ToastContainer
} from './components/Modals';

export default function App() {
  const {
    activeTab,
    fetchInitialData,
    initSocket
  } = useDevCollabStore((state) => state);

  useEffect(() => {
    fetchInitialData();
    initSocket();
  }, [fetchInitialData, initSocket]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-app)' }}>
      {/* Top Navbar */}
      <Navbar />

      {/* Project & Tabs Subheader */}
      <ProjectSubheader />

      {/* Main View Router */}
      <main style={{ flexGrow: 1, paddingBottom: '60px' }}>
        {activeTab === 'tasks' && <TaskBoard />}
        {activeTab === 'ai' && <AiAssistant />}
        {activeTab === 'reviewer' && <CodeReviewer />}
        {activeTab === 'snippets' && <SnippetManager />}
        {activeTab === 'wiki' && <WikiDocs />}
        {activeTab === 'activity' && <ActivityFeedView />}
        {activeTab === 'team' && <TeamManagement />}
        {activeTab === 'billing' && <BillingView />}
      </main>

      {/* Global Modals & Notifications */}
      <CreateTaskModal />
      <NewWorkspaceModal />
      <NewProjectModal />
      <UserProfileModal />
      <ToastContainer />
    </div>
  );
}