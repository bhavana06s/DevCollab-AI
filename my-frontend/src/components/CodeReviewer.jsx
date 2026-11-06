import React, { useState } from 'react';
import { useDevCollabStore } from '../store';
import {
  CodeXml,
  Sparkles,
  CheckCircle2,
  Copy,
  Play,
  Check,
  FileCode2
} from 'lucide-react';

export default function CodeReviewer() {
  const {
    codeReviewer,
    setCodeReviewerLanguage,
    setCodeReviewerCode,
    runCodeReview,
    createSnippet,
    addToast
  } = useDevCollabStore((state) => state);

  const [copiedCode, setCopiedCode] = useState(false);

  const languages = [
    { id: 'javascript', name: 'JavaScript / Node' },
    { id: 'python', name: 'Python 3' },
    { id: 'java', name: 'Java' },
    { id: 'cpp', name: 'C++ 20' },
    { id: 'go', name: 'Go (Golang)' }
  ];

  // Presets with realistic issues for instant demo
  const sampleCodes = {
    javascript: `// Vulnerable Express Auth Handler with eval & loose equality
var jwt = require('jsonwebtoken');

function authGuard(req, res, next) {
  var token = req.cookies.token;
  if (token == null) {
    return res.status(401).send('Unauthorized');
  }

  // Dangerous eval debugging
  eval("var userPayload = " + req.headers['x-user-debug']);

  jwt.verify(token, 'hardcoded_secret_key_123', function(err, decoded) {
    if (err) return res.status(403).send('Forbidden');
    req.user = decoded;
    next();
  });
}`,
    python: `# Insecure Python File Processing & Bare Except
import *

def process_user_file(file_path):
    try:
        f = open(file_path, 'r')
        data = f.read()
        # Missing f.close() or context manager
        return data
    except:
        print("An error occurred")
        return None`,
    cpp: `// Thread-Unsafe Singleton with Raw Pointer Leak
#include <iostream>

class DatabaseConnection {
public:
    static DatabaseConnection* getInstance() {
        if (instance == nullptr) {
            instance = new DatabaseConnection(); // Memory leak & race condition!
        }
        return instance;
    }
private:
    DatabaseConnection() {}
    static DatabaseConnection* instance;
};`,
    java: `// Potential NPE and Unsafe Output in Java
public class UserValidator {
    public boolean checkRole(String userRole) {
        // Potential NullPointerException if userRole is null
        if (userRole.equals("ADMIN")) {
            System.out.println("Privileged admin access granted!");
            return true;
        }
        return false;
    }
}`,
    go: `// Goroutine Leak & Ignored Error in Go
package main

import (
    "fmt"
    "net/http"
)

func FetchData(urls []string) {
    for _, u := range urls {
        // Orphaned goroutine without context or waitgroup
        go func(target string) {
            res, err := http.Get(target)
            _ = err // Ignored error check
            fmt.Println(res.Status)
        }(u)
    }
}`
  };

  const handleSelectSample = (lang) => {
    setCodeReviewerLanguage(lang);
    setCodeReviewerCode(sampleCodes[lang] || '');
    addToast(`Loaded ${lang.toUpperCase()} code sample`, 'info');
  };

  const handleApplyFix = () => {
    if (codeReviewer.report?.suggestedFix) {
      setCodeReviewerCode(codeReviewer.report.suggestedFix);
      addToast('Applied AI proposed patch to editor!', 'success');
    }
  };

  const handleSaveAsSnippet = () => {
    createSnippet({
      title: `Reviewed ${codeReviewer.language.toUpperCase()} Snippet`,
      language: codeReviewer.language,
      code: codeReviewer.code,
      tags: ['Reviewed', 'AI-Optimized', codeReviewer.language],
      description: 'Code validated through DevCollab AI Code Reviewer engine.'
    });
  };

  const report = codeReviewer.report;

  return (
    <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '24px' }}>
      {/* Top Banner */}
      <div style={{
        background: 'var(--gradient-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '14px',
        padding: '24px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'var(--gradient-dual)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <CodeXml size={18} />
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              AI Multi-Language Code Reviewer
            </h2>
            <span className="badge-dual" style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px' }}>
              AST & Security Scanner
            </span>
          </div>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
            Paste any snippet in JavaScript, Python, Java, C++, or Go for instant static analysis, OWASP security checks, Big-O metrics, and automated patch generation.
          </p>
        </div>

        {/* Load Sample Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)' }}>Load Sample:</span>
          {languages.map((l) => (
            <button
              key={l.id}
              onClick={() => handleSelectSample(l.id)}
              className="btn-secondary"
              style={{ padding: '5px 10px', fontSize: '0.76rem' }}
            >
              {l.name}
            </button>
          ))}
        </div>
      </div>

      {/* Editor & Report Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Left Pane: Code Editor */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Editor Header Bar */}
          <div style={{
            padding: '12px 18px',
            background: 'var(--bg-surface-elevated)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <select
                value={codeReviewer.language}
                onChange={(e) => setCodeReviewerLanguage(e.target.value)}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  borderRadius: '6px',
                  padding: '5px 10px',
                  fontSize: '0.8rem',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {languages.map((l) => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>
                {codeReviewer.code.split('\n').length} lines
              </span>
            </div>

            <button
              onClick={runCodeReview}
              disabled={codeReviewer.isReviewing || !codeReviewer.code.trim()}
              className="btn-primary"
              style={{ padding: '7px 16px', fontSize: '0.82rem' }}
            >
              <Play size={14} />
              <span>{codeReviewer.isReviewing ? 'Auditing Code...' : 'Run AI Code Review'}</span>
            </button>
          </div>

          {/* Textarea Code Input */}
          <div style={{ position: 'relative' }}>
            <textarea
              rows={18}
              value={codeReviewer.code}
              onChange={(e) => setCodeReviewerCode(e.target.value)}
              placeholder="Paste code snippet here..."
              style={{
                width: '100%',
                background: '#070b14',
                border: 'none',
                color: '#e2e8f0',
                padding: '16px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.84rem',
                lineHeight: 1.6,
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Bottom Bar: Quick actions */}
          <div style={{
            padding: '10px 18px',
            background: 'var(--bg-surface-elevated)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <button
              onClick={handleSaveAsSnippet}
              className="btn-secondary"
              style={{ padding: '5px 12px', fontSize: '0.78rem', gap: '6px' }}
            >
              <FileCode2 size={14} /> Save as Project Snippet
            </button>

            <button
              onClick={() => {
                navigator.clipboard?.writeText(codeReviewer.code);
                setCopiedCode(true);
                setTimeout(() => setCopiedCode(false), 2000);
              }}
              className="btn-secondary"
              style={{ padding: '5px 12px', fontSize: '0.78rem', gap: '6px' }}
            >
              {copiedCode ? <Check size={14} color="var(--secondary)" /> : <Copy size={14} />}
              <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>
        </div>

        {/* Right Pane: AI Audit Report */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {!report ? (
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px dashed var(--border-subtle)',
              borderRadius: '12px',
              padding: '60px 24px',
              textAlign: 'center'
            }}>
              <CodeXml size={42} color="var(--primary)" style={{ opacity: 0.5, marginBottom: '14px' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                No Code Review Run Yet
              </h3>
              <p style={{ margin: '0 auto 18px auto', maxWidth: '380px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Click <strong>"Run AI Code Review"</strong> or select one of the language samples above to analyze bugs, security vectors, and performance bottlenecks.
              </p>
              <button onClick={runCodeReview} className="btn-primary">
                <Play size={14} /> Analyze Current Code
              </button>
            </div>
          ) : (
            <>
              {/* Score Card & Metrics */}
              <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>
                      Code Quality Score
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                      <span style={{
                        fontSize: '2.5rem',
                        fontWeight: 900,
                        color: report.qualityScore >= 8 ? 'var(--secondary)' : report.qualityScore >= 6 ? 'var(--warning)' : 'var(--p0-red)'
                      }}>
                        {report.qualityScore}
                      </span>
                      <span style={{ fontSize: '1.1rem', color: 'var(--text-tertiary)' }}>/ 10.0</span>
                    </div>
                  </div>

                  <span style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    background: report.qualityScore >= 8 ? 'var(--secondary-bg)' : report.qualityScore >= 6 ? 'var(--p1-bg)' : 'var(--p0-bg)',
                    color: report.qualityScore >= 8 ? 'var(--secondary)' : report.qualityScore >= 6 ? 'var(--p1-amber)' : 'var(--p0-red)',
                    border: `1px solid ${report.qualityScore >= 8 ? 'var(--secondary-border)' : 'var(--border-subtle)'}`
                  }}>
                    {report.qualityScore >= 8 ? 'High Quality • Production Ready' : report.qualityScore >= 6 ? 'Passable • Minor Improvements Needed' : 'Critical Issues Detected'}
                  </span>
                </div>

                {/* 4 Vector Metrics */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '10px'
                }}>
                  <div style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Bugs & Correctness</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>{report.breakdown.bugsAndCorrectness}</div>
                  </div>
                  <div style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Security & OWASP</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>{report.breakdown.securityRating}</div>
                  </div>
                  <div style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Performance</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>{report.breakdown.performance}</div>
                  </div>
                  <div style={{ padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Maintainability</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>{report.breakdown.maintainability}</div>
                  </div>
                </div>
              </div>

              {/* Actionable Findings List */}
              <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <h3 style={{ fontSize: '0.94rem', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
                  Actionable Findings & Warnings ({report.issues.length})
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {report.issues.map((issue, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '12px',
                        borderRadius: '8px',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>
                          {issue.type}
                        </span>
                        <span style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: '4px',
                          background: issue.severity === 'Critical' ? 'var(--p0-bg)' : issue.severity === 'High' ? 'var(--p1-bg)' : 'rgba(255,255,255,0.06)',
                          color: issue.severity === 'Critical' ? 'var(--p0-red)' : issue.severity === 'High' ? 'var(--p1-amber)' : 'var(--text-secondary)'
                        }}>
                          {issue.severity}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                        {issue.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Proposed AI Fix / Patch */}
              {report.suggestedFix && (
                <div style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--secondary-border)',
                  borderRadius: '12px',
                  padding: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sparkles size={16} /> Proposed AI Remediation Patch
                    </h3>
                    <button
                      onClick={handleApplyFix}
                      className="btn-primary"
                      style={{ padding: '6px 12px', fontSize: '0.76rem' }}
                    >
                      <CheckCircle2 size={14} /> Apply Fix to Editor
                    </button>
                  </div>

                  <pre style={{
                    background: '#070b14',
                    padding: '14px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    fontSize: '0.76rem',
                    color: 'var(--secondary-light)',
                    overflowX: 'auto',
                    lineHeight: 1.5,
                    margin: 0
                  }}>
                    {report.suggestedFix}
                  </pre>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
