import React, { useState } from 'react';
import { useDevCollabStore } from '../store';
import {
  FileCode2,
  Search,
  Plus,
  Copy,
  Check,
  Sparkles,
  Trash2
} from 'lucide-react';

export default function SnippetManager() {
  const {
    snippets,
    activeProjectId,
    createSnippet,
    deleteSnippet,
    setCodeReviewerLanguage,
    setCodeReviewerCode,
    setActiveTab,
    canEdit,
    addToast
  } = useDevCollabStore((state) => state);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [copiedSnippetId, setCopiedSnippetId] = useState(null);

  // New Snippet Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newLang, setNewLang] = useState('javascript');
  const [newCode, setNewCode] = useState('');
  const [newTags, setNewTags] = useState('Utility, Helper');
  const [newDesc, setNewDesc] = useState('');

  const projectSnippets = snippets.filter((s) => s.projectId === activeProjectId || !s.projectId);

  const filteredSnippets = projectSnippets.filter((snippet) => {
    const matchesSearch = snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (snippet.description && snippet.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (snippet.tags && snippet.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesLang = selectedLanguage === 'all' || snippet.language.toLowerCase() === selectedLanguage.toLowerCase();
    return matchesSearch && matchesLang;
  });

  const handleCopyCode = (id, code) => {
    navigator.clipboard?.writeText(code);
    setCopiedSnippetId(id);
    addToast('Snippet copied to clipboard!', 'success');
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  const handleSendToReviewer = (snippet) => {
    setCodeReviewerLanguage(snippet.language.toLowerCase());
    setCodeReviewerCode(snippet.code);
    setActiveTab('reviewer');
    addToast(`Loaded "${snippet.title}" into AI Code Reviewer!`, 'info');
  };

  const handleCreateSnippetSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCode.trim()) {
      addToast('Please enter both title and code.', 'warning');
      return;
    }

    createSnippet({
      title: newTitle,
      language: newLang,
      code: newCode,
      tags: newTags.split(',').map((t) => t.trim()),
      description: newDesc
    });

    setIsModalOpen(false);
    setNewTitle('');
    setNewCode('');
    setNewDesc('');
  };

  return (
    <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '24px' }}>
      {/* Search & Actions Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* Left: Search & Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '7px 14px',
            width: '280px'
          }}>
            <Search size={15} color="var(--text-tertiary)" />
            <input
              type="text"
              placeholder="Search snippets by title or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                outline: 'none',
                fontSize: '0.84rem',
                width: '100%'
              }}
            />
          </div>

          {/* Language filter pills */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['all', 'javascript', 'python', 'go', 'cpp'].map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  background: selectedLanguage === lang ? 'var(--primary-bg)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${selectedLanguage === lang ? 'var(--primary-border)' : 'var(--border-subtle)'}`,
                  color: selectedLanguage === lang ? 'var(--primary-light)' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Right: New Snippet button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary"
          style={{ fontSize: '0.82rem' }}
        >
          <Plus size={16} /> Save New Snippet
        </button>
      </div>

      {/* Snippet Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
        gap: '20px'
      }}>
        {filteredSnippets.map((snippet) => (
          <div
            key={snippet.id}
            className="glass-card"
            style={{
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              {/* Card Header: Language badge, Title & Actions */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: 'var(--primary-bg)',
                      border: '1px solid var(--primary-border)',
                      color: 'var(--primary-light)',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      textTransform: 'uppercase'
                    }}>
                      {snippet.language}
                    </span>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                      {snippet.title}
                    </h3>
                  </div>
                  {snippet.description && (
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      {snippet.description}
                    </p>
                  )}
                </div>

                {/* Delete button if editor */}
                {canEdit() && (
                  <button
                    onClick={() => deleteSnippet(snippet.id)}
                    className="btn-icon"
                    title="Delete snippet"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              {/* Tag Chips */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                {(snippet.tags || []).map((tag, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '0.68rem',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      background: 'rgba(255,255,255,0.04)',
                      color: 'var(--text-tertiary)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Syntax Display Block */}
              <div style={{
                position: 'relative',
                background: '#070b14',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                overflow: 'hidden',
                marginBottom: '12px'
              }}>
                <pre style={{
                  margin: 0,
                  padding: '14px',
                  maxHeight: '220px',
                  overflowY: 'auto',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  lineHeight: 1.5,
                  color: '#e2e8f0'
                }}>
                  {snippet.code}
                </pre>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              paddingTop: '10px'
            }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                Author: <strong>{snippet.authorName || 'Alex Chen'}</strong>
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => handleSendToReviewer(snippet)}
                  className="btn-secondary"
                  style={{ padding: '5px 10px', fontSize: '0.76rem', gap: '6px' }}
                  title="Run AI Code Review on this snippet"
                >
                  <Sparkles size={13} color="var(--primary)" />
                  <span>AI Review</span>
                </button>

                <button
                  onClick={() => handleCopyCode(snippet.id, snippet.code)}
                  className="btn-primary"
                  style={{ padding: '5px 12px', fontSize: '0.76rem', gap: '6px' }}
                >
                  {copiedSnippetId === snippet.id ? (
                    <>
                      <Check size={13} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSnippets.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: 'var(--bg-surface)',
          borderRadius: '12px',
          border: '1px dashed var(--border-subtle)'
        }}>
          <FileCode2 size={40} color="var(--text-tertiary)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
            No Code Snippets Found
          </h3>
          <p style={{ margin: '0 0 16px 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Save reusable functions, middleware, algorithms, or API helpers for your team.
          </p>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary">
            <Plus size={14} /> Add First Snippet
          </button>
        </div>
      )}

      {/* Save New Snippet Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '650px', padding: '24px' }}
          >
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>
              Save New Reusable Code Snippet
            </h3>

            <form onSubmit={handleCreateSnippetSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Snippet Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. JWT Verifier Middleware"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
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
                  <label style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Language
                  </label>
                  <select
                    value={newLang}
                    onChange={(e) => setNewLang(e.target.value)}
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
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="go">Go (Golang)</option>
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                    <option value="sql">SQL</option>
                    <option value="bash">Bash / Shell</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Auth, Security, Express"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
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
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Description (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Short explanation of how to use this snippet"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
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
                <label style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Code Body
                </label>
                <textarea
                  rows={8}
                  placeholder="// Paste clean reusable code here..."
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    background: '#070b14',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '12px',
                    color: '#fff',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.82rem',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Snippet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
