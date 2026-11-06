import React, { useState } from 'react';
import { useDevCollabStore } from '../store';
import {
  CreditCard,
  Zap,
  CheckCircle2,
  Sparkles,
  FolderGit2,
  Users2,
  Bot
} from 'lucide-react';

export default function BillingView() {
  const {
    workspaces,
    activeWorkspaceId,
    projects,
    upgradeToPro,
    canManageBilling,
    addToast
  } = useDevCollabStore((state) => state);

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('123');
  const [isProcessing, setIsProcessing] = useState(false);

  const currentWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];
  const isPro = currentWorkspace?.tier === 'Pro';

  const workspaceProjects = projects.filter((p) => p.workspaceId === currentWorkspace?.id);
  const memberCount = currentWorkspace?.members?.length || 1;

  const handleSandboxCheckout = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      upgradeToPro();
      setIsProcessing(false);
      setIsCheckoutModalOpen(false);
      addToast('🎉 Sandbox Payment Approved! Workspace successfully upgraded to Pro.', 'success');
    }, 1200);
  };

  const handleStudentPackRedeem = () => {
    setIsProcessing(true);
    setTimeout(() => {
      upgradeToPro();
      setIsProcessing(false);
      setIsCheckoutModalOpen(false);
      addToast('🎓 GitHub Student Developer Pack Verified! Free DevCollab Pro Unlocked.', 'success');
    }, 1000);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      {/* Header Banner */}
      <div style={{
        background: 'var(--gradient-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '14px',
        padding: '24px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              Subscription Tier & Resource Quotas
            </h2>
            <span style={{
              fontSize: '0.74rem',
              fontWeight: 800,
              padding: '2px 10px',
              borderRadius: '12px',
              background: isPro ? 'var(--secondary-bg)' : 'rgba(255,255,255,0.08)',
              color: isPro ? 'var(--secondary)' : 'var(--text-secondary)',
              border: `1px solid ${isPro ? 'var(--secondary-border)' : 'var(--border-subtle)'}`
            }}>
              Current Plan: {currentWorkspace?.tier || 'Pro'}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
            Transparent pricing designed for student developers and hackathon teams. Free forever for small projects, unlimited with Pro or GitHub Student Pack.
          </p>
        </div>

        {!isPro && canManageBilling() && (
          <button
            onClick={() => setIsCheckoutModalOpen(true)}
            className="btn-primary"
            style={{ padding: '10px 18px', fontSize: '0.86rem' }}
          >
            <Zap size={16} /> Upgrade to Pro ($9/mo or Free Student)
          </button>
        )}
      </div>

      {/* Quota Progress Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        {/* Projects Quota */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FolderGit2 size={15} color="var(--primary)" /> Projects Quota
            </span>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>
              {workspaceProjects.length} / {isPro ? 'Unlimited' : '3'}
            </span>
          </div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              width: isPro ? '25%' : `${Math.min(100, (workspaceProjects.length / 3) * 100)}%`,
              height: '100%',
              background: 'var(--gradient-dual)'
            }} />
          </div>
        </div>

        {/* Members Quota */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users2 size={15} color="var(--secondary)" /> Team Members
            </span>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>
              {memberCount} / {isPro ? 'Unlimited' : '5'}
            </span>
          </div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{
              width: isPro ? '35%' : `${Math.min(100, (memberCount / 5) * 100)}%`,
              height: '100%',
              background: 'var(--gradient-dual)'
            }} />
          </div>
        </div>

        {/* AI & Automation Engine */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Bot size={15} color="var(--primary-light)" /> AI Credits & Rules
            </span>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>
              {isPro ? 'Unlimited Pro Access' : '25 / 100 Runs'}
            </span>
          </div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: isPro ? '100%' : '25%', height: '100%', background: 'var(--gradient-dual)' }} />
          </div>
        </div>
      </div>

      {/* Plan Comparison Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Free Plan */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '14px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
              Free Tier
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', marginBottom: '14px' }}>
              $0 <span style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>/ forever</span>
            </div>
            <p style={{ margin: '0 0 20px 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Ideal for individual student assignments or small hackathon pairs.
            </p>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--secondary)" /> 1 Workspace
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--secondary)" /> Up to 3 Projects
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--secondary)" /> Up to 5 Team Members
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--secondary)" /> Real-Time Kanban & WebSocket Sync
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--secondary)" /> Basic Code Snippets & Wiki Pages
              </li>
            </ul>
          </div>

          <button
            disabled
            className="btn-secondary"
            style={{ width: '100%', justifyContent: 'center', opacity: 0.7 }}
          >
            Current Baseline
          </button>
        </div>

        {/* Pro Plan */}
        <div style={{
          background: 'var(--gradient-card)',
          border: '2px solid var(--border-focus)',
          borderRadius: '14px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <div style={{
            position: 'absolute',
            top: '-12px',
            right: '24px',
            background: 'var(--gradient-dual)',
            color: '#fff',
            fontSize: '0.72rem',
            fontWeight: 800,
            padding: '2px 10px',
            borderRadius: '10px'
          }}>
            RECOMMENDED FOR TEAMS
          </div>

          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
              DevCollab Pro
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--secondary-light)', marginBottom: '14px' }}>
              $9 <span style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>/ month (or $0 with GitHub Student Pack)</span>
            </div>
            <p style={{ margin: '0 0 20px 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Built for engineering clubs, senior capstone projects, and high-velocity developer squads.
            </p>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem', color: '#fff' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--secondary)" /> <strong>Unlimited</strong> Workspaces & Projects
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--secondary)" /> <strong>Unlimited</strong> Team Members & Role Assigns
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--secondary)" /> <strong>Unlimited</strong> AI Project Assistant & Standups
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--secondary)" /> <strong>AI Code Reviewer</strong> with AST & OWASP Patches
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--secondary)" /> <strong>Intelligent Automation Rules Engine</strong>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--secondary)" /> Point-in-Time Documentation Version Rollback
              </li>
            </ul>
          </div>

          {isPro ? (
            <div style={{
              textAlign: 'center',
              padding: '10px',
              borderRadius: '8px',
              background: 'var(--secondary-bg)',
              color: 'var(--secondary)',
              fontWeight: 700,
              fontSize: '0.86rem'
            }}>
              ✓ Active on this Workspace
            </div>
          ) : (
            <button
              onClick={() => setIsCheckoutModalOpen(true)}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Zap size={15} /> Upgrade to Pro (Sandbox Test)
            </button>
          )}
        </div>
      </div>

      {/* Sandbox Checkout Modal */}
      {isCheckoutModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCheckoutModalOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '520px', padding: '24px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <CreditCard size={22} color="var(--primary)" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                Sandbox Pro Checkout
              </h3>
            </div>
            <p style={{ margin: '0 0 20px 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Simulated sandbox payment testing. No real charges will occur.
            </p>

            {/* Option A: Student Pack 1-Click */}
            <div style={{
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid var(--primary-border)',
              borderRadius: '10px',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Sparkles size={16} color="var(--primary-light)" />
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>
                  Student Developer Pack Verification
                </span>
              </div>
              <p style={{ margin: '0 0 12px 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Are you a university student? Instantly unlock Pro access with mock GitHub authentication.
              </p>
              <button
                type="button"
                onClick={handleStudentPackRedeem}
                disabled={isProcessing}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.82rem' }}
              >
                {isProcessing ? 'Verifying GitHub Token...' : '🎓 Claim Free Pro with Student Pack'}
              </button>
            </div>

            <div style={{ textAlign: 'center', margin: '14px 0', fontSize: '0.76rem', color: 'var(--text-tertiary)' }}>
              — OR SIMULATE CREDIT CARD PAYMENT —
            </div>

            <form onSubmit={handleSandboxCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Card Number (Pre-filled Sandbox)
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
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
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
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
                    CVC
                  </label>
                  <input
                    type="text"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
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
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsCheckoutModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="btn-primary"
                >
                  {isProcessing ? 'Processing...' : 'Authorize $9 Sandbox Checkout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
