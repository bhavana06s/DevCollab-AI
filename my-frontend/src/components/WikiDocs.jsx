import React, { useState } from 'react';
import { useDevCollabStore } from '../store';
import {
  BookOpen,
  FileText,
  Plus,
  History,
  RotateCcw,
  Edit3,
  Eye,
  Save,
  CheckSquare,
  Code,
  Table as TableIcon,
  Heading,
  Link as LinkIcon,
  Search
} from 'lucide-react';

export default function WikiDocs() {
  const {
    wikiPages,
    activeWikiId,
    activeProjectId,
    createWikiPage,
    updateWikiPage,
    rollbackWikiPage,
    canEdit,
    addToast
  } = useDevCollabStore((state) => state);

  const [mode, setMode] = useState('view'); // 'view' | 'edit' | 'history'
  const [docSearch, setDocSearch] = useState('');
  const [isNewDocModalOpen, setIsNewDocModalOpen] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');

  // Editing state
  const currentPage = wikiPages.find((w) => w.id === activeWikiId) || wikiPages[0];
  const [editTitle, setEditTitle] = useState(currentPage?.title || '');
  const [editContent, setEditContent] = useState(currentPage?.content || '');
  const [editSummary, setEditSummary] = useState('');

  // Sync edit state when page changes
  React.useEffect(() => {
    if (currentPage) {
      setEditTitle(currentPage.title);
      setEditContent(currentPage.content);
      setEditSummary('');
    }
  }, [currentPage]);

  const projectPages = wikiPages.filter((w) => w.projectId === activeProjectId || !w.projectId);
  const filteredPages = projectPages.filter((p) =>
    p.title.toLowerCase().includes(docSearch.toLowerCase())
  );

  const handleSaveDoc = () => {
    if (!currentPage) return;
    updateWikiPage(currentPage.id, editTitle, editContent, editSummary || 'Content revision');
    setMode('view');
  };

  const handleRollback = (ver) => {
    if (!currentPage) return;
    rollbackWikiPage(currentPage.id, ver);
    setMode('view');
  };

  const handleCreateNewDoc = (e) => {
    e.preventDefault();
    if (!newDocTitle.trim()) return;
    createWikiPage(newDocTitle, `# ${newDocTitle}\n\nStart documenting technical specifications and blueprints here...`);
    setIsNewDocModalOpen(false);
    setNewDocTitle('');
  };

  // Helper to insert markdown tokens into edit content
  const insertToken = (token) => {
    setEditContent((prev) => prev + '\n' + token);
  };

  // Render markdown parser with cross-link support `[[Page Title]]`
  const renderFormattedContent = (raw) => {
    if (!raw) return null;

    // Check for `[[Link Title]]` and replace with interactive click handler
    const lines = raw.split('\n');

    return (
      <div style={{ lineHeight: 1.7, fontSize: '0.92rem', color: '#e2e8f0' }}>
        {lines.map((line, idx) => {
          // Headers
          if (line.startsWith('# ')) {
            return <h1 key={idx} style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: '20px 0 10px 0', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>{line.replace('# ', '')}</h1>;
          }
          if (line.startsWith('## ')) {
            return <h2 key={idx} style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-light)', margin: '18px 0 8px 0' }}>{line.replace('## ', '')}</h2>;
          }
          if (line.startsWith('### ')) {
            return <h3 key={idx} style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: '14px 0 6px 0' }}>{line.replace('### ', '')}</h3>;
          }

          // Checklist
          if (line.startsWith('- [x] ') || line.startsWith('- [ ] ')) {
            const isChecked = line.startsWith('- [x] ');
            const text = line.replace(/- \[[ x]\] /, '');
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0' }}>
                <span style={{ color: isChecked ? 'var(--secondary)' : 'var(--text-tertiary)' }}>
                  {isChecked ? '☑' : '☐'}
                </span>
                <span style={{ textDecoration: isChecked ? 'line-through' : 'none', color: isChecked ? 'var(--text-tertiary)' : '#fff' }}>
                  {text}
                </span>
              </div>
            );
          }

          // Bullet points
          if (line.startsWith('- ')) {
            const bulletText = line.replace('- ', '');
            return (
              <div key={idx} style={{ display: 'flex', gap: '8px', margin: '4px 0', paddingLeft: '8px' }}>
                <span style={{ color: 'var(--primary)' }}>•</span>
                <span>{renderCrossLinks(bulletText)}</span>
              </div>
            );
          }

          // Table row indicator
          if (line.startsWith('|')) {
            return (
              <div key={idx} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', background: 'rgba(255,255,255,0.02)', padding: '2px 8px' }}>
                {line}
              </div>
            );
          }

          // Empty line
          if (line.trim() === '') {
            return <div key={idx} style={{ height: '8px' }} />;
          }

          return <p key={idx} style={{ margin: '6px 0' }}>{renderCrossLinks(line)}</p>;
        })}
      </div>
    );
  };

  // Cross link parser
  const renderCrossLinks = (text) => {
    const parts = text.split(/(\[\[.*?\]\])/g);
    return parts.map((part, i) => {
      if (part.startsWith('[[') && part.endsWith(']]')) {
        const pageTitle = part.slice(2, -2);
        const target = wikiPages.find((w) => w.title.toLowerCase() === pageTitle.toLowerCase());
        return (
          <span
            key={i}
            onClick={() => {
              if (target) {
                useDevCollabStore.setState({ activeWikiId: target.id });
                addToast(`Navigated to ${target.title}`, 'info');
              } else {
                addToast(`Linked page "${pageTitle}" not found`, 'warning');
              }
            }}
            style={{
              color: 'var(--secondary)',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontWeight: 600,
              padding: '0 2px'
            }}
          >
            📄 {pageTitle}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '24px' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Left Sidebar: Document Tree */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '0.94rem', fontWeight: 700, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={16} color="var(--primary)" /> Project Wiki
            </h3>
            {canEdit() && (
              <button
                onClick={() => setIsNewDocModalOpen(true)}
                className="btn-icon"
                title="Create New Page"
              >
                <Plus size={15} />
              </button>
            )}
          </div>

          {/* Search Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '6px',
            padding: '5px 10px',
            marginBottom: '14px'
          }}>
            <Search size={14} color="var(--text-tertiary)" />
            <input
              type="text"
              placeholder="Search wiki pages..."
              value={docSearch}
              onChange={(e) => setDocSearch(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                outline: 'none',
                fontSize: '0.78rem',
                width: '100%'
              }}
            />
          </div>

          {/* Pages List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {filteredPages.map((page) => {
              const isSelected = page.id === currentPage?.id;
              return (
                <div
                  key={page.id}
                  onClick={() => {
                    useDevCollabStore.setState({ activeWikiId: page.id });
                    setMode('view');
                  }}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: isSelected ? 'var(--primary-bg)' : 'transparent',
                    border: `1px solid ${isSelected ? 'var(--primary-border)' : 'transparent'}`,
                    color: isSelected ? '#fff' : 'var(--text-secondary)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    <FileText size={15} color={isSelected ? 'var(--secondary)' : 'var(--text-tertiary)'} />
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {page.title}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', fontWeight: 700 }}>
                    v{page.version || 1}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Document Viewer / Editor / History */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          overflow: 'hidden',
          minHeight: '700px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Header Bar */}
          <div style={{
            padding: '14px 24px',
            background: 'var(--bg-surface-elevated)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                  {mode === 'edit' ? 'Editing Document' : currentPage?.title || 'Wiki Document'}
                </h2>
                <span style={{
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  background: 'var(--secondary-bg)',
                  border: '1px solid var(--secondary-border)',
                  color: 'var(--secondary)',
                  fontWeight: 700
                }}>
                  v{currentPage?.version || 1}.0
                </span>
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                Last edited by {currentPage?.authorName || 'Alex Chen'} • {currentPage?.versions?.length || 1} revisions recorded
              </div>
            </div>

            {/* Mode Switcher Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                display: 'flex',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '2px'
              }}>
                <button
                  onClick={() => setMode('view')}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '4px',
                    background: mode === 'view' ? 'var(--gradient-dual)' : 'transparent',
                    border: 'none',
                    color: mode === 'view' ? '#fff' : 'var(--text-secondary)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Eye size={13} /> View
                </button>

                {canEdit() && (
                  <button
                    onClick={() => setMode('edit')}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '4px',
                      background: mode === 'edit' ? 'var(--gradient-dual)' : 'transparent',
                      border: 'none',
                      color: mode === 'edit' ? '#fff' : 'var(--text-secondary)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Edit3 size={13} /> Edit
                  </button>
                )}

                <button
                  onClick={() => setMode('history')}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '4px',
                    background: mode === 'history' ? 'var(--gradient-dual)' : 'transparent',
                    border: 'none',
                    color: mode === 'history' ? '#fff' : 'var(--text-secondary)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <History size={13} /> Version History
                </button>
              </div>

              {mode === 'edit' && (
                <button
                  onClick={handleSaveDoc}
                  className="btn-primary"
                  style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                >
                  <Save size={14} /> Save Revision
                </button>
              )}
            </div>
          </div>

          {/* Mode 1: View Mode */}
          {mode === 'view' && (
            <div style={{ padding: '32px', flexGrow: 1 }}>
              {currentPage ? (
                renderFormattedContent(currentPage.content)
              ) : (
                <div style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: '60px 0' }}>
                  Select a document from the left navigation tree.
                </div>
              )}
            </div>
          )}

          {/* Mode 2: Rich Edit Mode */}
          {mode === 'edit' && (
            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: '20px' }}>
              {/* Title input */}
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Document Title"
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid var(--border-subtle)',
                  color: '#fff',
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  padding: '8px 0',
                  outline: 'none',
                  marginBottom: '14px'
                }}
              />

              {/* Formatting Toolbar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                marginBottom: '14px',
                flexWrap: 'wrap'
              }}>
                <button
                  type="button"
                  onClick={() => insertToken('## Section Heading')}
                  className="btn-secondary"
                  style={{ padding: '4px 8px', fontSize: '0.74rem' }}
                >
                  <Heading size={13} /> H2
                </button>
                <button
                  type="button"
                  onClick={() => insertToken('- Bullet point item')}
                  className="btn-secondary"
                  style={{ padding: '4px 8px', fontSize: '0.74rem' }}
                >
                  • Bullet
                </button>
                <button
                  type="button"
                  onClick={() => insertToken('- [ ] Checklist task')}
                  className="btn-secondary"
                  style={{ padding: '4px 8px', fontSize: '0.74rem' }}
                >
                  <CheckSquare size={13} /> Checkbox
                </button>
                <button
                  type="button"
                  onClick={() => insertToken('```javascript\n// code snippet\n```')}
                  className="btn-secondary"
                  style={{ padding: '4px 8px', fontSize: '0.74rem' }}
                >
                  <Code size={13} /> Code Block
                </button>
                <button
                  type="button"
                  onClick={() => insertToken('| Column 1 | Column 2 |\n|---|---|\n| Value A | Value B |')}
                  className="btn-secondary"
                  style={{ padding: '4px 8px', fontSize: '0.74rem' }}
                >
                  <TableIcon size={13} /> Table
                </button>
                <button
                  type="button"
                  onClick={() => insertToken('[[Architecture & System Design Overview]]')}
                  className="btn-secondary"
                  style={{ padding: '4px 8px', fontSize: '0.74rem' }}
                >
                  <LinkIcon size={13} /> Link Page [[...]]
                </button>
              </div>

              {/* Markdown Content Editor */}
              <textarea
                rows={18}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                style={{
                  width: '100%',
                  background: '#070b14',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '16px',
                  color: '#fff',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.84rem',
                  lineHeight: 1.6,
                  outline: 'none',
                  resize: 'vertical',
                  flexGrow: 1
                }}
              />

              {/* Revision summary */}
              <div style={{ marginTop: '12px' }}>
                <input
                  type="text"
                  placeholder="Summary of changes (e.g. Added WebSocket protocol details)"
                  value={editSummary}
                  onChange={(e) => setEditSummary(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '0.8rem'
                  }}
                />
              </div>
            </div>
          )}

          {/* Mode 3: Version History & Point-in-Time Rollback */}
          {mode === 'history' && (
            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
                  Revision Timeline & Rollback Protocol
                </h3>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Every publication creates an immutable snapshot. Select any prior version to inspect its diff and restore it with 1 click.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {(currentPage?.versions || []).slice().reverse().map((ver) => (
                  <div
                    key={ver.version}
                    style={{
                      background: ver.version === currentPage.version ? 'var(--primary-bg)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${ver.version === currentPage.version ? 'var(--primary-border)' : 'var(--border-subtle)'}`,
                      borderRadius: '10px',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: 'rgba(255,255,255,0.06)',
                          color: '#fff',
                          fontWeight: 800,
                          fontSize: '0.74rem'
                        }}>
                          Revision v{ver.version}.0
                        </span>
                        <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#fff' }}>
                          {ver.title}
                        </span>
                        {ver.version === currentPage.version && (
                          <span style={{ fontSize: '0.68rem', color: 'var(--secondary)', fontWeight: 700 }}>
                            (Current Head)
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                        {ver.summary || 'Content revision'}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                        Authored by {ver.authorName} • {new Date(ver.createdAt).toLocaleString()}
                      </div>
                    </div>

                    {ver.version !== currentPage.version && canEdit() && (
                      <button
                        onClick={() => handleRollback(ver.version)}
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.78rem', gap: '6px' }}
                      >
                        <RotateCcw size={13} color="var(--primary)" />
                        <span>Rollback to v{ver.version}</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Document Modal */}
      {isNewDocModalOpen && (
        <div className="modal-overlay" onClick={() => setIsNewDocModalOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '480px', padding: '24px' }}
          >
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>
              Create New Wiki Documentation Page
            </h3>
            <form onSubmit={handleCreateNewDoc}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  Document Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Microservices API Gateway Protocol"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsNewDocModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
