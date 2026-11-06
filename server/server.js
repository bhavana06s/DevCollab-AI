const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));
app.use(express.json({ limit: '10mb' }));

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Initial Seed Data
const initialWorkspaces = [
  {
    id: 'ws-1',
    name: 'Hyperion Dev Labs',
    description: 'Premier student innovation incubator for distributed systems & web platforms',
    ownerId: 'usr-1',
    tier: 'Pro', // 'Free' or 'Pro'
    createdAt: '2026-09-01T10:00:00Z',
    inviteCode: 'HYPER-9024',
    members: [
      { id: 'usr-1', name: 'Alex Chen', email: 'alex@devcollab.io', role: 'Owner', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80', bio: 'Full-stack architect & OSS contributor', skills: ['React', 'Node.js', 'PostgreSQL', 'Docker'], github: 'https://github.com/alexchen-dev' },
      { id: 'usr-2', name: 'Riya Sharma', email: 'riya@devcollab.io', role: 'Admin', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80', bio: 'DevOps & Distributed Systems enthusiast', skills: ['Kubernetes', 'Go', 'AWS', 'Python'], github: 'https://github.com/riyasharma' },
      { id: 'usr-3', name: 'Ankush Verma', email: 'ankush@devcollab.io', role: 'Member', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80', bio: 'Frontend UI/UX lead building snappy apps', skills: ['TypeScript', 'Tailwind', 'Next.js', 'Figma'], github: 'https://github.com/ankush-v' },
      { id: 'usr-4', name: 'Dev Patel', email: 'dev@devcollab.io', role: 'Member', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80', bio: 'AI researcher & algorithm competitive programmer', skills: ['Python', 'PyTorch', 'C++', 'FastAPI'], github: 'https://github.com/devpatel-ai' },
      { id: 'usr-5', name: 'Sara Kim', email: 'sara@devcollab.io', role: 'Viewer', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80', bio: 'QA automation & student product manager', skills: ['Jest', 'Cypress', 'Product Specs'], github: 'https://github.com/sarakim-qa' }
    ]
  },
  {
    id: 'ws-2',
    name: 'OpenSource Hackers Club',
    description: 'Collaborative projects for university hackathon teams',
    ownerId: 'usr-1',
    tier: 'Free',
    createdAt: '2026-10-01T14:30:00Z',
    inviteCode: 'HACK-4412',
    members: [
      { id: 'usr-1', name: 'Alex Chen', email: 'alex@devcollab.io', role: 'Owner', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80', bio: 'Full-stack architect & OSS contributor', skills: ['React', 'Node.js'], github: 'https://github.com/alexchen-dev' },
      { id: 'usr-3', name: 'Ankush Verma', email: 'ankush@devcollab.io', role: 'Admin', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80', bio: 'Frontend UI/UX lead', skills: ['TypeScript'], github: 'https://github.com/ankush-v' }
    ]
  }
];

const initialProjects = [
  {
    id: 'proj-1',
    workspaceId: 'ws-1',
    name: 'CampusConnect Web Platform',
    key: 'CAMP',
    description: 'Next-gen academic collaboration hub with microservices, real-time messaging, and interactive course resources',
    status: 'Active',
    visibility: 'Private',
    createdAt: '2026-09-05T12:00:00Z',
    memberIds: ['usr-1', 'usr-2', 'usr-3', 'usr-4', 'usr-5']
  },
  {
    id: 'proj-2',
    workspaceId: 'ws-1',
    name: 'Autonomous Rover Firmware',
    key: 'ROV',
    description: 'Embedded real-time telemetry, obstacle detection algorithms, and motor controllers written in modern C++ and ROS2',
    status: 'Active',
    visibility: 'Private',
    createdAt: '2026-09-12T15:20:00Z',
    memberIds: ['usr-1', 'usr-2', 'usr-4']
  },
  {
    id: 'proj-3',
    workspaceId: 'ws-1',
    name: 'Cloud Cost & Resource Sentinel',
    key: 'SENT',
    description: 'Automated Kubernetes pod rightsizing daemon and multi-cloud spot instance manager written in Go',
    status: 'Active',
    visibility: 'Public',
    createdAt: '2026-09-20T09:10:00Z',
    memberIds: ['usr-1', 'usr-2']
  }
];

const initialTasks = [
  {
    id: 'task-101',
    projectId: 'proj-1',
    title: 'Implement OAuth2 & Refresh Token Rotation',
    description: 'Set up JWT issuance with RS256 signing, short-lived access tokens (15m), and secure httpOnly cookies for refresh token rotation with redis blacklisting.',
    status: 'In Progress', // To Do, In Progress, In Review, Done
    priority: 'P0', // P0, P1, P2
    assigneeId: 'usr-1',
    dueDate: '2026-10-18',
    labels: ['Auth', 'Security', 'Backend'],
    attachments: [
      { id: 'att-1', name: 'oauth2_sequence_diagram.png', size: '240 KB', type: 'image' },
      { id: 'att-2', name: 'jwt_spec_v2.pdf', size: '1.2 MB', type: 'document' }
    ],
    comments: [
      { id: 'comm-1', userId: 'usr-2', userName: 'Riya Sharma', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80', content: 'Hey @Alex Chen, ensure we rate-limit the token endpoint to prevent brute force!', createdAt: '2026-10-15T11:20:00Z' },
      { id: 'comm-2', userId: 'usr-1', userName: 'Alex Chen', userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80', content: 'Added Redis token bucket limiter with 5 req/min per IP. Testing now.', createdAt: '2026-10-15T14:45:00Z' }
    ],
    updatedAt: '2026-10-15T14:45:00Z'
  },
  {
    id: 'task-102',
    projectId: 'proj-1',
    title: 'Responsive Dual-Pane Kanban Interface',
    description: 'Build smooth HTML5 drag-and-drop Kanban columns with live indicators, column task counts, and keyboard accessibility.',
    status: 'In Review',
    priority: 'P1',
    assigneeId: 'usr-3',
    dueDate: '2026-10-19',
    labels: ['UI/UX', 'Frontend', 'React'],
    attachments: [
      { id: 'att-3', name: 'kanban_wireframe.fig', size: '3.4 MB', type: 'design' }
    ],
    comments: [
      { id: 'comm-3', userId: 'usr-1', userName: 'Alex Chen', userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80', content: 'Looks great! Can we add subtle drop target glow animations?', createdAt: '2026-10-16T09:00:00Z' }
    ],
    updatedAt: '2026-10-16T09:30:00Z'
  },
  {
    id: 'task-103',
    projectId: 'proj-1',
    title: 'WebSocket Real-Time Broadcast Service',
    description: 'Cluster-ready WebSocket broker syncing board movements, member presence beacons, and in-app alert dispatches.',
    status: 'Done',
    priority: 'P0',
    assigneeId: 'usr-2',
    dueDate: '2026-10-14',
    labels: ['WebSockets', 'RealTime', 'Node.js'],
    attachments: [],
    comments: [
      { id: 'comm-4', userId: 'usr-4', userName: 'Dev Patel', userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80', content: 'Benchmarked with 500 concurrent connections, latency < 8ms!', createdAt: '2026-10-14T17:10:00Z' }
    ],
    updatedAt: '2026-10-14T17:30:00Z'
  },
  {
    id: 'task-104',
    projectId: 'proj-1',
    title: 'Automated CI/CD Pipeline with Docker & SonarQube',
    description: 'GitHub Actions workflow with lint, test matrix across Node 20 & 22, Docker multi-stage build cache, and automated security scanning.',
    status: 'To Do',
    priority: 'P1',
    assigneeId: 'usr-2',
    dueDate: '2026-10-22',
    labels: ['DevOps', 'CI/CD', 'Docker'],
    attachments: [],
    comments: [],
    updatedAt: '2026-10-14T10:00:00Z'
  },
  {
    id: 'task-105',
    projectId: 'proj-1',
    title: 'Notion-Style Wiki Editor with Version Rollback',
    description: 'Rich markdown documentation editor supporting tables, code syntax blocks, callouts, and point-in-time snapshot restorations.',
    status: 'In Progress',
    priority: 'P1',
    assigneeId: 'usr-3',
    dueDate: '2026-10-17',
    labels: ['Wiki', 'Editor', 'Frontend'],
    attachments: [],
    comments: [],
    updatedAt: '2026-10-16T11:00:00Z'
  },
  {
    id: 'task-106',
    projectId: 'proj-1',
    title: 'AI Code Reviewer Engine with AST Linting',
    description: 'Integrate multi-language parser assessing cyclomatic complexity, memory leaks, OWASP top 10 risks, and generating proposed patches.',
    status: 'In Progress',
    priority: 'P0',
    assigneeId: 'usr-4',
    dueDate: '2026-10-17',
    labels: ['AI', 'Automation', 'Python'],
    attachments: [],
    comments: [],
    updatedAt: '2026-10-16T13:20:00Z'
  },
  {
    id: 'task-107',
    projectId: 'proj-1',
    title: 'Stripe Sandbox Checkout & Tier Quotas',
    description: 'Implement Free vs Pro workspace gatekeeper, member limits, and sandbox checkout simulation with webhook listeners.',
    status: 'To Do',
    priority: 'P2',
    assigneeId: 'usr-1',
    dueDate: '2026-10-25',
    labels: ['Payments', 'Billing'],
    attachments: [],
    comments: [],
    updatedAt: '2026-10-12T16:00:00Z'
  }
];

const initialSnippets = [
  {
    id: 'snip-1',
    projectId: 'proj-1',
    title: 'JWT Verifier & Cookie Middleware',
    language: 'javascript',
    code: `// Express JWT middleware with RS256 public key verification
const jwt = require('jsonwebtoken');

const authGuard = (req, res, next) => {
  const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Missing session token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_PUBLIC_KEY, {
      algorithms: ['RS256']
    });
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Forbidden: Invalid or expired token' });
  }
};

module.exports = authGuard;`,
    tags: ['Auth', 'JWT', 'Security', 'Middleware'],
    description: 'Express middleware that inspects cookies or bearer headers, validates RS256 signature, and attaches claims to req.user.',
    authorName: 'Alex Chen',
    createdAt: '2026-10-10T14:00:00Z'
  },
  {
    id: 'snip-2',
    projectId: 'proj-1',
    title: 'Redis Distributed Token Bucket Rate Limiter',
    language: 'python',
    code: `import time
import redis

r = redis.Redis(host='localhost', port=6379, db=0)

def is_rate_limited(client_ip: str, capacity: int = 10, refill_rate: float = 2.0) -> bool:
    """Token bucket rate limiter stored in Redis hash."""
    key = f"rate_limit:{client_ip}"
    now = time.time()
    
    pipe = r.pipeline()
    pipe.hget(key, "tokens")
    pipe.hget(key, "last_updated")
    tokens_raw, last_updated_raw = pipe.execute()
    
    tokens = float(tokens_raw) if tokens_raw else float(capacity)
    last_updated = float(last_updated_raw) if last_updated_raw else now
    
    # Refill tokens based on elapsed delta
    elapsed = max(0.0, now - last_updated)
    tokens = min(float(capacity), tokens + elapsed * refill_rate)
    
    if tokens >= 1.0:
        tokens -= 1.0
        r.hset(key, mapping={"tokens": tokens, "last_updated": now})
        r.expire(key, 3600)
        return False # Allowed
    else:
        return True # Blocked`,
    tags: ['Redis', 'RateLimiting', 'Security', 'Python'],
    description: 'Atomic token bucket algorithm against Redis to prevent API abuse and DoS bursts.',
    authorName: 'Dev Patel',
    createdAt: '2026-10-12T18:30:00Z'
  },
  {
    id: 'snip-3',
    projectId: 'proj-1',
    title: 'Async Worker Queue with Goroutines & Channels',
    language: 'go',
    code: `package main

import (
	"context"
	"fmt"
	"sync"
	"time"
)

type Job struct {
	ID      string
	Payload string
}

func Worker(id int, jobs <-chan Job, results chan<- string, wg *sync.WaitGroup) {
	defer wg.Done()
	for job := range jobs {
		// Process job
		time.Sleep(50 * time.Millisecond)
		results <- fmt.Sprintf("Worker %d completed job %s", id, job.ID)
	}
}

func DispatchJobs(ctx context.Context, jobList []Job, workerCount int) []string {
	jobs := make(chan Job, len(jobList))
	results := make(chan string, len(jobList))
	var wg sync.WaitGroup

	for w := 1; w <= workerCount; w++ {
		wg.Add(1)
		go Worker(w, jobs, results, &wg)
	}

	for _, j := range jobList {
		jobs <- j
	}
	close(jobs)

	wg.Wait()
	close(results)

	var output []string
	for res := range results {
		output = append(output, res)
	}
	return output
}`,
    tags: ['Go', 'Concurrency', 'Channels', 'Microservices'],
    description: 'High-throughput thread-safe job dispatcher with channel buffering and graceful worker synchronization.',
    authorName: 'Riya Sharma',
    createdAt: '2026-10-13T11:00:00Z'
  },
  {
    id: 'snip-4',
    projectId: 'proj-1',
    title: 'Modern C++20 Thread-Safe Singleton Logger',
    language: 'cpp',
    code: `#include <iostream>
#include <fstream>
#include <mutex>
#include <string>
#include <chrono>
#include <format>

class Logger {
public:
    enum class Level { INFO, WARNING, ERROR, CRITICAL };

    static Logger& getInstance() {
        static Logger instance; // Meyer's Singleton (Thread-safe in C++11+)
        return instance;
    }

    void log(Level level, const std::string& message) {
        std::lock_guard<std::mutex> lock(logMutex);
        const auto now = std::chrono::system_clock::now();
        std::string tag = (level == Level::ERROR) ? "[ERROR]" : "[INFO]";
        std::cout << tag << " " << message << std::endl;
    }

private:
    Logger() = default;
    ~Logger() = default;
    Logger(const Logger&) = delete;
    Logger& operator=(const Logger&) = delete;
    std::mutex logMutex;
};`,
    tags: ['C++', 'Multithreading', 'Singleton', 'Embedded'],
    description: 'Meyer singleton pattern ensuring thread-safe logging with zero dynamic allocations in critical path.',
    authorName: 'Alex Chen',
    createdAt: '2026-10-14T09:15:00Z'
  }
];

const initialWikiPages = [
  {
    id: 'wiki-1',
    projectId: 'proj-1',
    title: 'Architecture & System Design Overview',
    slug: 'architecture-overview',
    content: `# CampusConnect Architecture Blueprint

Welcome to the central architectural specification for **CampusConnect**. This platform delivers high-concurrency developer collaboration features designed for student teams.

## 1. System Topology
- **Frontend SPA**: React 18 with reactive local store, WebSocket real-time client, dual-palette styling.
- **API Gateway & Core Service**: Node.js Express server with clustered Socket.IO pub/sub.
- **Caching & Rate Limiting**: In-memory Redis token bucket counters.
- **Automation Engine**: Rule evaluation daemon monitoring task transitions, SLA thresholds, and code commits.

## 2. Real-Time Event Protocol
The real-time layer synchronizes:
- **Presence Beacons**: Broadcasts active user positions across tasks and wiki sections.
- **State Deltas**: Emits granular mutations when a task transitions between columns.
- **Automation Audits**: Dispatches logs when background triggers fire.

## 3. Related Documentation
- [[Database Schema Specification]]
- [[API & Webhook Contracts]]
- [[Production Deployment SOP]]`,
    authorName: 'Alex Chen',
    updatedAt: '2026-10-15T16:00:00Z',
    version: 3,
    versions: [
      {
        version: 1,
        title: 'Architecture Overview (Draft)',
        content: '# CampusConnect Architecture Blueprint\nInitial draft of frontend and backend layers.',
        authorName: 'Alex Chen',
        createdAt: '2026-10-01T10:00:00Z',
        summary: 'Initial skeleton structure'
      },
      {
        version: 2,
        title: 'Architecture & System Design Overview',
        content: '# CampusConnect Architecture Blueprint\nAdded WebSocket real-time event protocol and topology details.',
        authorName: 'Riya Sharma',
        createdAt: '2026-10-08T14:30:00Z',
        summary: 'Added WebSocket specs and topology diagrams'
      },
      {
        version: 3,
        title: 'Architecture & System Design Overview',
        content: `# CampusConnect Architecture Blueprint\n\nWelcome to the central architectural specification for **CampusConnect**. This platform delivers high-concurrency developer collaboration features designed for student teams.\n\n## 1. System Topology\n- **Frontend SPA**: React 18 with reactive local store, WebSocket real-time client, dual-palette styling.\n- **API Gateway & Core Service**: Node.js Express server with clustered Socket.IO pub/sub.\n- **Caching & Rate Limiting**: In-memory Redis token bucket counters.\n- **Automation Engine**: Rule evaluation daemon monitoring task transitions, SLA thresholds, and code commits.\n\n## 2. Real-Time Event Protocol\nThe real-time layer synchronizes:\n- **Presence Beacons**: Broadcasts active user positions across tasks and wiki sections.\n- **State Deltas**: Emits granular mutations when a task transitions between columns.\n- **Automation Audits**: Dispatches logs when background triggers fire.\n\n## 3. Related Documentation\n- [[Database Schema Specification]]\n- [[API & Webhook Contracts]]\n- [[Production Deployment SOP]]`,
        authorName: 'Alex Chen',
        createdAt: '2026-10-15T16:00:00Z',
        summary: 'Integrated Automation Engine and cross-linking to related specs'
      }
    ]
  },
  {
    id: 'wiki-2',
    projectId: 'proj-1',
    title: 'Database Schema Specification',
    slug: 'database-schema',
    content: `# Database Schema Specification

This document details the PostgreSQL relational model powering workspaces, projects, roles, and automated audit trails.

## Tables & Cardinality
| Entity | Primary Key | Foreign Key | Indexes |
|---|---|---|---|
| \`workspaces\` | id (UUID) | owner_id (users.id) | name, created_at |
| \`projects\` | id (UUID) | workspace_id (workspaces.id) | key, status |
| \`tasks\` | id (UUID) | project_id, assignee_id | status, priority, due_date |
| \`snippets\` | id (UUID) | project_id, author_id | language, tags |
| \`wiki_pages\` | id (UUID) | project_id | slug, version |
| \`automations\` | id (UUID) | workspace_id | trigger_type, is_active |

## Security Model
- Row-Level Security (RLS) ensures that members can only query data within their workspace.
- Viewers have read permissions restricted to \`SELECT\`.`,
    authorName: 'Riya Sharma',
    updatedAt: '2026-10-14T11:20:00Z',
    version: 1,
    versions: [
      {
        version: 1,
        title: 'Database Schema Specification',
        content: `# Database Schema Specification\n\nThis document details the PostgreSQL relational model powering workspaces, projects, roles, and automated audit trails.`,
        authorName: 'Riya Sharma',
        createdAt: '2026-10-14T11:20:00Z',
        summary: 'Initial schema baseline'
      }
    ]
  },
  {
    id: 'wiki-3',
    projectId: 'proj-1',
    title: 'Production Deployment & CI/CD SOP',
    slug: 'deployment-sop',
    content: `# Production Deployment & CI/CD Standard Operating Procedure

Standard checklist for zero-downtime rolling deployments.

## Pre-Flight Checklist
- [x] All PRs approved by at least 1 Admin or Owner
- [x] Automated test suite passing with >85% code coverage
- [x] AI Code Reviewer security score >= 8.5/10
- [ ] Database migration rollback script verified in staging

## Rollout Protocol
1. Trigger automated GitHub Actions workflow \`deploy-prod.yml\`.
2. Canary container spin-up (10% traffic routing).
3. Health check evaluation on \`/api/health\` for 120 seconds.
4. Promote canary to 100% traffic and gracefully decommission old replicas.`,
    authorName: 'Riya Sharma',
    updatedAt: '2026-10-16T08:15:00Z',
    version: 1,
    versions: [
      {
        version: 1,
        title: 'Production Deployment & CI/CD SOP',
        content: '# Production Deployment SOP\nCanary and rollback guidelines.',
        authorName: 'Riya Sharma',
        createdAt: '2026-10-16T08:15:00Z',
        summary: 'Created SOP checklist'
      }
    ]
  }
];

const initialActivityFeed = [
  {
    id: 'act-1',
    workspaceId: 'ws-1',
    projectId: 'proj-1',
    userName: 'Riya Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    action: 'task_moved',
    details: 'moved task "WebSocket Real-Time Broadcast Service" to Done',
    timestamp: '2026-10-16T15:30:00Z'
  },
  {
    id: 'act-2',
    workspaceId: 'ws-1',
    projectId: 'proj-1',
    userName: 'Alex Chen',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    action: 'comment_added',
    details: 'commented on task "Implement OAuth2 & Refresh Token Rotation"',
    timestamp: '2026-10-16T14:45:00Z'
  },
  {
    id: 'act-3',
    workspaceId: 'ws-1',
    projectId: 'proj-1',
    userName: 'DevCollab AI Bot',
    userAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ai-bot',
    action: 'automation_triggered',
    details: 'executed Rule "Auto-Flag Impending Deadlines (< 48h)" on 2 tasks',
    timestamp: '2026-10-16T12:00:00Z'
  },
  {
    id: 'act-4',
    workspaceId: 'ws-1',
    projectId: 'proj-1',
    userName: 'Alex Chen',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    action: 'doc_updated',
    details: 'published version v3.0 of "Architecture & System Design Overview"',
    timestamp: '2026-10-15T16:00:00Z'
  },
  {
    id: 'act-5',
    workspaceId: 'ws-1',
    projectId: 'proj-1',
    userName: 'Sara Kim',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80',
    action: 'member_joined',
    details: 'joined project CampusConnect Web Platform as Viewer',
    timestamp: '2026-10-15T10:10:00Z'
  }
];

const initialAutomationRules = [
  {
    id: 'rule-1',
    workspaceId: 'ws-1',
    name: 'Smart Deadline Escalator',
    description: 'When task due date is within 48 hours and status != Done, elevate priority to P0 and trigger blocker alert.',
    trigger: 'deadline_approaching',
    action: 'escalate_priority_p0',
    isActive: true,
    lastFired: '2026-10-16T12:00:00Z',
    fireCount: 14
  },
  {
    id: 'rule-2',
    workspaceId: 'ws-1',
    name: 'Automated Code Review on Snippet Save',
    description: 'Automatically analyze code snippets upon creation and post quality recommendations in the activity feed.',
    trigger: 'snippet_created',
    action: 'run_ai_code_review',
    isActive: true,
    lastFired: '2026-10-14T09:15:00Z',
    fireCount: 8
  },
  {
    id: 'rule-3',
    workspaceId: 'ws-1',
    name: 'Instant Release Note Generator',
    description: 'When all P0 tasks in a milestone reach "Done", auto-generate a release changelog into the project Wiki.',
    trigger: 'all_p0_tasks_done',
    action: 'generate_wiki_changelog',
    isActive: true,
    lastFired: '2026-10-14T17:30:00Z',
    fireCount: 3
  },
  {
    id: 'rule-4',
    workspaceId: 'ws-1',
    name: 'Stalled Task Blocker Detector',
    description: 'When a task has been in "In Progress" for over 48 hours without comments, alert the assignee and team lead.',
    trigger: 'task_in_progress_stalled',
    action: 'send_blocker_notification',
    isActive: true,
    lastFired: '2026-10-16T09:00:00Z',
    fireCount: 9
  }
];

const initialNotifications = [
  {
    id: 'notif-1',
    userId: 'usr-1',
    title: '@mention from Riya Sharma',
    message: 'Hey @Alex Chen, ensure we rate-limit the token endpoint to prevent brute force!',
    type: 'mention',
    timestamp: '2026-10-15T11:20:00Z',
    read: false,
    link: '#tasks'
  },
  {
    id: 'notif-2',
    userId: 'usr-1',
    title: 'Task Status Updated',
    message: 'Riya moved "WebSocket Real-Time Broadcast Service" to Done',
    type: 'task',
    timestamp: '2026-10-16T15:30:00Z',
    read: false,
    link: '#tasks'
  },
  {
    id: 'notif-3',
    userId: 'usr-1',
    title: 'AI Blocker Sentinel Alert',
    message: 'Task "Notion-Style Wiki Editor" is due in 24 hours and still In Progress.',
    type: 'ai_alert',
    timestamp: '2026-10-16T12:00:00Z',
    read: true,
    link: '#ai'
  }
];

// Live Presence State: { [userId]: { taskId, page, userName, avatar, lastSeen } }
const livePresence = {
  'usr-1': { userName: 'Alex Chen', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80', taskId: 'task-101', page: 'kanban', lastSeen: Date.now() },
  'usr-2': { userName: 'Riya Sharma', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80', taskId: 'task-102', page: 'kanban', lastSeen: Date.now() },
  'usr-3': { userName: 'Ankush Verma', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80', taskId: 'task-102', page: 'kanban', lastSeen: Date.now() }
};

// In-Memory Database
const db = {
  workspaces: [...initialWorkspaces],
  projects: [...initialProjects],
  tasks: [...initialTasks],
  snippets: [...initialSnippets],
  wikiPages: [...initialWikiPages],
  activityFeed: [...initialActivityFeed],
  automationRules: [...initialAutomationRules],
  notifications: [...initialNotifications]
};

// Helper: Broadcast Activity
function recordActivity(activity) {
  const newActivity = {
    id: 'act-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    timestamp: new Date().toISOString(),
    ...activity
  };
  db.activityFeed.unshift(newActivity);
  if (db.activityFeed.length > 50) db.activityFeed.pop();
  io.emit('activity_logged', newActivity);
  return newActivity;
}

// Helper: Create Notification
function createNotification(notif) {
  const newNotif = {
    id: 'notif-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    timestamp: new Date().toISOString(),
    read: false,
    ...notif
  };
  db.notifications.unshift(newNotif);
  io.emit('notification_received', newNotif);
  return newNotif;
}

// ========================
// REST API ROUTES
// ========================

// 1. Workspaces
app.get('/api/workspaces', (req, res) => {
  res.json(db.workspaces);
});

app.post('/api/workspaces', (req, res) => {
  const { name, description, ownerId } = req.body;
  if (!name) return res.status(400).json({ error: 'Workspace name is required' });
  const owner = db.workspaces[0].members.find(m => m.id === ownerId) || db.workspaces[0].members[0];
  const newWorkspace = {
    id: 'ws-' + Date.now(),
    name,
    description: description || 'Collaborative workspace',
    ownerId: owner.id,
    tier: 'Free',
    createdAt: new Date().toISOString(),
    inviteCode: 'DEV-' + Math.floor(1000 + Math.random() * 9000),
    members: [{ ...owner, role: 'Owner' }]
  };
  db.workspaces.push(newWorkspace);
  recordActivity({
    workspaceId: newWorkspace.id,
    userName: owner.name,
    userAvatar: owner.avatar,
    action: 'workspace_created',
    details: `created new workspace "${name}"`
  });
  io.emit('workspace_updated', newWorkspace);
  res.status(201).json(newWorkspace);
});

app.post('/api/workspaces/:id/invite', (req, res) => {
  const ws = db.workspaces.find(w => w.id === req.params.id);
  if (!ws) return res.status(404).json({ error: 'Workspace not found' });
  const { email, role, inviterName } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  // Check quota for free tier
  if (ws.tier === 'Free' && ws.members.length >= 5) {
    return res.status(403).json({ error: 'Free tier workspace is limited to 5 members. Please upgrade to Pro for unlimited members!' });
  }

  const name = email.split('@')[0].replace('.', ' ');
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
  const newMember = {
    id: 'usr-' + Date.now(),
    name: capitalizedName,
    email,
    role: role || 'Member',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    bio: 'Invited team collaborator',
    skills: ['Git', 'Agile'],
    github: `https://github.com/${email.split('@')[0]}`
  };
  ws.members.push(newMember);

  recordActivity({
    workspaceId: ws.id,
    userName: inviterName || 'Workspace Admin',
    userAvatar: ws.members[0].avatar,
    action: 'member_joined',
    details: `invited ${newMember.name} (${newMember.role}) via email link`
  });

  io.emit('workspace_updated', ws);
  res.json({ message: 'Invitation processed', member: newMember, inviteLink: `https://devcollab.io/join/${ws.inviteCode}?email=${encodeURIComponent(email)}` });
});

app.patch('/api/workspaces/:id/role', (req, res) => {
  const ws = db.workspaces.find(w => w.id === req.params.id);
  if (!ws) return res.status(404).json({ error: 'Workspace not found' });
  const { memberId, newRole } = req.body;
  const member = ws.members.find(m => m.id === memberId);
  if (!member) return res.status(404).json({ error: 'Member not found' });
  member.role = newRole;
  io.emit('workspace_updated', ws);
  res.json(member);
});

// Upgrade tier simulation
app.post('/api/workspaces/:id/upgrade', (req, res) => {
  const ws = db.workspaces.find(w => w.id === req.params.id);
  if (!ws) return res.status(404).json({ error: 'Workspace not found' });
  ws.tier = 'Pro';
  recordActivity({
    workspaceId: ws.id,
    userName: 'Billing System',
    userAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=billing',
    action: 'tier_upgraded',
    details: `upgraded workspace "${ws.name}" to DevCollab Pro (Unlimited Access)`
  });
  createNotification({
    userId: ws.ownerId,
    title: '🎉 Workspace Upgraded to Pro!',
    message: `Congratulations! ${ws.name} now has unlimited projects, members, and AI automation credits.`,
    type: 'payment',
    link: '#settings'
  });
  io.emit('workspace_updated', ws);
  res.json({ success: true, workspace: ws });
});

// 2. Projects
app.get('/api/projects', (req, res) => {
  const { workspaceId } = req.query;
  const filtered = workspaceId ? db.projects.filter(p => p.workspaceId === workspaceId) : db.projects;
  res.json(filtered);
});

app.post('/api/projects', (req, res) => {
  const { workspaceId, name, key, description } = req.body;
  const ws = db.workspaces.find(w => w.id === workspaceId);
  if (!ws) return res.status(404).json({ error: 'Workspace not found' });

  // Free tier project check
  const existingCount = db.projects.filter(p => p.workspaceId === workspaceId).length;
  if (ws.tier === 'Free' && existingCount >= 3) {
    return res.status(403).json({ error: 'Free tier is limited to 3 projects. Upgrade to Pro for unlimited projects!' });
  }

  const newProject = {
    id: 'proj-' + Date.now(),
    workspaceId,
    name,
    key: key ? key.toUpperCase() : name.substring(0, 4).toUpperCase(),
    description: description || '',
    status: 'Active',
    visibility: 'Private',
    createdAt: new Date().toISOString(),
    memberIds: ws.members.map(m => m.id)
  };
  db.projects.push(newProject);
  recordActivity({
    workspaceId,
    projectId: newProject.id,
    userName: ws.members[0].name,
    userAvatar: ws.members[0].avatar,
    action: 'project_created',
    details: `created project "${name}" [${newProject.key}]`
  });
  io.emit('project_created', newProject);
  res.status(201).json(newProject);
});

// 3. Tasks
app.get('/api/tasks', (req, res) => {
  const { projectId } = req.query;
  const filtered = projectId ? db.tasks.filter(t => t.projectId === projectId) : db.tasks;
  res.json(filtered);
});

app.post('/api/tasks', (req, res) => {
  const { projectId, title, description, priority, assigneeId, dueDate, labels, attachments } = req.body;
  if (!title) return res.status(400).json({ error: 'Task title is required' });

  const newTask = {
    id: 'task-' + Date.now(),
    projectId: projectId || db.projects[0].id,
    title,
    description: description || '',
    status: 'To Do',
    priority: priority || 'P1',
    assigneeId: assigneeId || 'usr-1',
    dueDate: dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    labels: labels || ['General'],
    attachments: attachments || [],
    comments: [],
    updatedAt: new Date().toISOString()
  };
  db.tasks.push(newTask);

  const assignee = db.workspaces[0].members.find(m => m.id === newTask.assigneeId);
  recordActivity({
    projectId: newTask.projectId,
    workspaceId: db.projects.find(p => p.id === newTask.projectId)?.workspaceId,
    userName: assignee ? assignee.name : 'Team Member',
    userAvatar: assignee ? assignee.avatar : '',
    action: 'task_created',
    details: `created task "${title}" in To Do (${newTask.priority})`
  });

  // Notify assignee if assigned
  if (assignee && assignee.id !== 'usr-1') {
    createNotification({
      userId: assignee.id,
      title: 'New Task Assigned',
      message: `You were assigned to "${newTask.title}" [${newTask.priority}]`,
      type: 'task',
      link: '#tasks'
    });
  }

  io.emit('task_created', newTask);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const index = db.tasks.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Task not found' });
  const oldTask = db.tasks[index];
  const updatedTask = {
    ...oldTask,
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  db.tasks[index] = updatedTask;

  // Status movement check
  if (oldTask.status !== updatedTask.status) {
    const actor = req.body.actorName || 'Team Member';
    const actorAvatar = req.body.actorAvatar || '';
    recordActivity({
      projectId: updatedTask.projectId,
      workspaceId: db.projects.find(p => p.id === updatedTask.projectId)?.workspaceId,
      userName: actor,
      userAvatar: actorAvatar,
      action: 'task_moved',
      details: `moved "${updatedTask.title}" from ${oldTask.status} to ${updatedTask.status}`
    });

    // Notify task assignee if someone else moved it
    if (updatedTask.assigneeId) {
      createNotification({
        userId: updatedTask.assigneeId,
        title: 'Task Movement',
        message: `${actor} moved your task "${updatedTask.title}" to ${updatedTask.status}`,
        type: 'task',
        link: '#tasks'
      });
    }

    // Check Automation Rules Trigger
    evaluateAutomations('task_status_changed', { oldTask, updatedTask });
  }

  io.emit('task_updated', updatedTask);
  res.json(updatedTask);
});

app.delete('/api/tasks/:id', (req, res) => {
  const index = db.tasks.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Task not found' });
  const deleted = db.tasks.splice(index, 1)[0];
  io.emit('task_deleted', { id: req.params.id, projectId: deleted.projectId });
  res.json({ success: true, id: req.params.id });
});

// Task Comments & @mentions
app.post('/api/tasks/:id/comments', (req, res) => {
  const task = db.tasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  const { userId, userName, userAvatar, content } = req.body;
  if (!content) return res.status(400).json({ error: 'Comment content is required' });

  const newComment = {
    id: 'comm-' + Date.now(),
    userId: userId || 'usr-1',
    userName: userName || 'Team Member',
    userAvatar: userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    content,
    createdAt: new Date().toISOString()
  };
  if (!task.comments) task.comments = [];
  task.comments.push(newComment);
  task.updatedAt = new Date().toISOString();

  // Detect @mentions in comment (e.g. @Alex Chen or @Riya)
  const allMembers = db.workspaces[0].members;
  allMembers.forEach(member => {
    if (content.toLowerCase().includes('@' + member.name.toLowerCase()) || content.toLowerCase().includes('@' + member.name.split(' ')[0].toLowerCase())) {
      createNotification({
        userId: member.id,
        title: `@mention from ${userName}`,
        message: `${userName} mentioned you on task "${task.title}": "${content.slice(0, 70)}..."`,
        type: 'mention',
        link: '#tasks'
      });
    }
  });

  recordActivity({
    projectId: task.projectId,
    workspaceId: db.projects.find(p => p.id === task.projectId)?.workspaceId,
    userName,
    userAvatar,
    action: 'comment_added',
    details: `commented on "${task.title}"`
  });

  io.emit('task_updated', task);
  res.status(201).json(newComment);
});

// 4. Code Snippets
app.get('/api/snippets', (req, res) => {
  const { projectId, search, tag, language } = req.query;
  let result = projectId ? db.snippets.filter(s => s.projectId === projectId) : db.snippets;

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(s => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.tags.some(t => t.toLowerCase().includes(q)));
  }
  if (tag) {
    result = result.filter(s => s.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
  }
  if (language && language !== 'all') {
    result = result.filter(s => s.language.toLowerCase() === language.toLowerCase());
  }

  res.json(result);
});

app.post('/api/snippets', (req, res) => {
  const { projectId, title, language, code, tags, description, authorName } = req.body;
  if (!title || !code) return res.status(400).json({ error: 'Title and code are required' });

  const newSnippet = {
    id: 'snip-' + Date.now(),
    projectId: projectId || db.projects[0].id,
    title,
    language: language || 'javascript',
    code,
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : ['Utility']),
    description: description || '',
    authorName: authorName || 'Team Member',
    createdAt: new Date().toISOString()
  };
  db.snippets.unshift(newSnippet);

  recordActivity({
    projectId: newSnippet.projectId,
    workspaceId: db.projects.find(p => p.id === newSnippet.projectId)?.workspaceId,
    userName: newSnippet.authorName,
    action: 'snippet_created',
    details: `saved reusable snippet "${newSnippet.title}" [${newSnippet.language}]`
  });

  // Evaluate automation rules for new snippets
  evaluateAutomations('snippet_created', { snippet: newSnippet });

  io.emit('snippet_created', newSnippet);
  res.status(201).json(newSnippet);
});

app.delete('/api/snippets/:id', (req, res) => {
  const index = db.snippets.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Snippet not found' });
  db.snippets.splice(index, 1);
  io.emit('snippet_deleted', req.params.id);
  res.json({ success: true, id: req.params.id });
});

// 5. Documentation Wiki with Version History
app.get('/api/wiki', (req, res) => {
  const { projectId } = req.query;
  const filtered = projectId ? db.wikiPages.filter(w => w.projectId === projectId) : db.wikiPages;
  res.json(filtered);
});

app.get('/api/wiki/:id', (req, res) => {
  const page = db.wikiPages.find(w => w.id === req.params.id);
  if (!page) return res.status(404).json({ error: 'Wiki page not found' });
  res.json(page);
});

app.post('/api/wiki', (req, res) => {
  const { projectId, title, content, authorName, summary } = req.body;
  if (!title) return res.status(400).json({ error: 'Page title is required' });

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const newPage = {
    id: 'wiki-' + Date.now(),
    projectId: projectId || db.projects[0].id,
    title,
    slug,
    content: content || `# ${title}\n\nStart writing documentation here...`,
    authorName: authorName || 'Team Member',
    updatedAt: new Date().toISOString(),
    version: 1,
    versions: [
      {
        version: 1,
        title,
        content: content || `# ${title}\n\nStart writing documentation here...`,
        authorName: authorName || 'Team Member',
        createdAt: new Date().toISOString(),
        summary: summary || 'Initial draft creation'
      }
    ]
  };
  db.wikiPages.push(newPage);

  recordActivity({
    projectId: newPage.projectId,
    workspaceId: db.projects.find(p => p.id === newPage.projectId)?.workspaceId,
    userName: newPage.authorName,
    action: 'doc_created',
    details: `created wiki page "${newPage.title}"`
  });

  io.emit('wiki_updated', newPage);
  res.status(201).json(newPage);
});

app.put('/api/wiki/:id', (req, res) => {
  const page = db.wikiPages.find(w => w.id === req.params.id);
  if (!page) return res.status(404).json({ error: 'Wiki page not found' });
  const { title, content, authorName, summary } = req.body;

  const nextVersionNum = (page.version || 1) + 1;
  const newVersionEntry = {
    version: nextVersionNum,
    title: title || page.title,
    content: content !== undefined ? content : page.content,
    authorName: authorName || 'Team Member',
    createdAt: new Date().toISOString(),
    summary: summary || `Updated to revision v${nextVersionNum}`
  };

  page.title = title || page.title;
  page.content = content !== undefined ? content : page.content;
  page.authorName = authorName || page.authorName;
  page.updatedAt = new Date().toISOString();
  page.version = nextVersionNum;
  if (!page.versions) page.versions = [];
  page.versions.push(newVersionEntry);

  recordActivity({
    projectId: page.projectId,
    workspaceId: db.projects.find(p => p.id === page.projectId)?.workspaceId,
    userName: page.authorName,
    action: 'doc_updated',
    details: `updated wiki page "${page.title}" to version v${page.version}`
  });

  io.emit('wiki_updated', page);
  res.json(page);
});

// Rollback Wiki page to previous version
app.post('/api/wiki/:id/rollback', (req, res) => {
  const page = db.wikiPages.find(w => w.id === req.params.id);
  if (!page) return res.status(404).json({ error: 'Wiki page not found' });
  const { targetVersion, authorName } = req.body;

  const targetSnapshot = page.versions.find(v => v.version === parseInt(targetVersion, 10));
  if (!targetSnapshot) return res.status(404).json({ error: 'Specified version snapshot not found' });

  const nextVersionNum = page.version + 1;
  const rollbackEntry = {
    version: nextVersionNum,
    title: targetSnapshot.title,
    content: targetSnapshot.content,
    authorName: authorName || 'Team Member',
    createdAt: new Date().toISOString(),
    summary: `Restored point-in-time from revision v${targetVersion}`
  };

  page.title = targetSnapshot.title;
  page.content = targetSnapshot.content;
  page.updatedAt = new Date().toISOString();
  page.version = nextVersionNum;
  page.versions.push(rollbackEntry);

  recordActivity({
    projectId: page.projectId,
    workspaceId: db.projects.find(p => p.id === page.projectId)?.workspaceId,
    userName: authorName || 'Team Member',
    action: 'doc_rollback',
    details: `rolled back wiki page "${page.title}" to v${targetVersion}`
  });

  io.emit('wiki_updated', page);
  res.json(page);
});

// 6. Activity Feed
app.get('/api/activity', (req, res) => {
  const { workspaceId, projectId, memberName } = req.query;
  let items = [...db.activityFeed];
  if (workspaceId) items = items.filter(a => a.workspaceId === workspaceId || !a.workspaceId);
  if (projectId) items = items.filter(a => a.projectId === projectId);
  if (memberName) items = items.filter(a => a.userName.toLowerCase().includes(memberName.toLowerCase()));
  res.json(items);
});

// 7. Notifications
app.get('/api/notifications', (req, res) => {
  const { userId } = req.query;
  const filtered = userId ? db.notifications.filter(n => n.userId === userId) : db.notifications;
  res.json(filtered);
});

app.post('/api/notifications/mark-all-read', (req, res) => {
  const { userId } = req.body;
  db.notifications.forEach(n => {
    if (!userId || n.userId === userId) n.read = true;
  });
  res.json({ success: true });
});

// 8. Automation Rules
app.get('/api/automations', (req, res) => {
  res.json(db.automationRules);
});

app.patch('/api/automations/:id/toggle', (req, res) => {
  const rule = db.automationRules.find(r => r.id === req.params.id);
  if (!rule) return res.status(404).json({ error: 'Automation rule not found' });
  rule.isActive = !rule.isActive;
  io.emit('automation_rule_updated', rule);
  res.json(rule);
});

app.post('/api/automations/run-diagnostics', (req, res) => {
  const { projectId } = req.body;
  const activeTasks = db.tasks.filter(t => !projectId || t.projectId === projectId);
  const results = [];

  // Check 1: Impending Deadlines (< 48h)
  const now = Date.now();
  const overdueOrSoon = activeTasks.filter(t => {
    if (t.status === 'Done') return false;
    const dueTime = new Date(t.dueDate).getTime();
    return (dueTime - now) <= (48 * 3600 * 1000);
  });

  if (overdueOrSoon.length > 0) {
    overdueOrSoon.forEach(task => {
      task.priority = 'P0';
      task.updatedAt = new Date().toISOString();
      results.push(`Escalated task "${task.title}" to P0 due to upcoming SLA deadline (${task.dueDate})`);
    });
  }

  // Record Audit
  recordActivity({
    projectId: projectId || db.projects[0].id,
    workspaceId: db.projects[0].workspaceId,
    userName: 'DevCollab Automation Bot',
    userAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ai-bot',
    action: 'automation_triggered',
    details: `ran automation diagnostics: analyzed ${activeTasks.length} tasks, applied ${results.length} automated actions`
  });

  io.emit('board_refreshed');
  res.json({ success: true, actionsApplied: results, taskCount: activeTasks.length });
});

// Automation trigger evaluation engine
function evaluateAutomations(eventType, payload) {
  const activeRules = db.automationRules.filter(r => r.isActive);

  if (eventType === 'task_status_changed') {
    const { updatedTask } = payload;
    if (updatedTask.status === 'Done') {
      const p0Remaining = db.tasks.filter(t => t.projectId === updatedTask.projectId && t.priority === 'P0' && t.status !== 'Done');
      if (p0Remaining.length === 0) {
        const rule = activeRules.find(r => r.trigger === 'all_p0_tasks_done');
        if (rule) {
          rule.fireCount = (rule.fireCount || 0) + 1;
          rule.lastFired = new Date().toISOString();
          recordActivity({
            projectId: updatedTask.projectId,
            workspaceId: db.projects.find(p => p.id === updatedTask.projectId)?.workspaceId,
            userName: 'DevCollab Automation Bot',
            userAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ai-bot',
            action: 'automation_triggered',
            details: `Rule "${rule.name}" triggered: All P0 tasks completed! Standup ready.`
          });
        }
      }
    }
  }
}

// ========================
// 9. AI PROJECT ASSISTANT & AUTOMATION ENDPOINTS
// ========================

// A. "Summarise this project"
app.post('/api/ai/summarize', (req, res) => {
  const { projectId } = req.body;
  const proj = db.projects.find(p => p.id === projectId) || db.projects[0];
  const tasks = db.tasks.filter(t => t.projectId === proj.id);

  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'Done').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const inReview = tasks.filter(t => t.status === 'In Review').length;
  const todo = tasks.filter(t => t.status === 'To Do').length;
  const p0Count = tasks.filter(t => t.priority === 'P0' && t.status !== 'Done').length;
  const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

  const summary = {
    projectId: proj.id,
    projectName: proj.name,
    projectKey: proj.key,
    completionRate,
    metrics: { total, done, inProgress, inReview, todo, p0Count },
    executiveSummary: `${proj.name} is currently running at **${completionRate}% completion** with ${done} of ${total} core deliverables closed out. The engineering cadence is strong in the real-time layer, though ${p0Count} high-urgency (P0) item(s) require focused resolution before next release.`,
    keyAchievements: [
      `Closed out core infrastructure tasks including real-time broadcast services.`,
      `Integrated OAuth2 & dual-pane Kanban system with WebSocket synchronization.`,
      `Established structured Wiki specifications and automated test suites.`
    ],
    upcomingPriorities: [
      `Complete OAuth2 token rotation and Redis rate-limiting (Assignee: Alex Chen).`,
      `Finalize Notion-style Wiki rollback and AST-based AI Code Reviewer (Assignee: Ankush Verma & Dev Patel).`,
      `Execute SonarQube & Docker multi-stage CI/CD pipeline automation.`
    ],
    recommendedSprintFocus: p0Count > 0 
      ? `Priority directive: Clear the ${p0Count} pending P0 blockers within 48 hours to unlock deployment staging.`
      : `Cadence is balanced. Recommend moving to integration testing and QA verification.`
  };

  res.json(summary);
});

// B. "What's blocking us?"
app.post('/api/ai/blockers', (req, res) => {
  const { projectId } = req.body;
  const proj = db.projects.find(p => p.id === projectId) || db.projects[0];
  const tasks = db.tasks.filter(t => t.projectId === proj.id);

  const blockers = [];
  const now = Date.now();

  tasks.forEach(task => {
    // Blocker 1: P0 tasks in "In Progress"
    if (task.priority === 'P0' && task.status === 'In Progress') {
      blockers.push({
        taskId: task.id,
        taskTitle: task.title,
        severity: 'Critical',
        reason: 'P0 Critical Task currently In Progress — represents an immediate launch impediment.',
        actionRequired: 'Pair program with assignee to merge PR within today’s sprint window.',
        assigneeId: task.assigneeId
      });
    }

    // Blocker 2: Tasks in "In Review" that might be stalled
    if (task.status === 'In Review') {
      blockers.push({
        taskId: task.id,
        taskTitle: task.title,
        severity: 'Moderate',
        reason: 'Task waiting on code review & QA approval.',
        actionRequired: 'Request expedited peer review from Riya Sharma or Alex Chen.',
        assigneeId: task.assigneeId
      });
    }

    // Blocker 3: Upcoming SLA / deadline risk
    const dueTime = new Date(task.dueDate).getTime();
    if (task.status !== 'Done' && (dueTime - now) < (48 * 3600 * 1000)) {
      blockers.push({
        taskId: task.id,
        taskTitle: task.title,
        severity: 'High',
        reason: `Approaching deadline on ${task.dueDate} (less than 48 hours remaining).`,
        actionRequired: 'Verify test status and remove scope creep to meet scheduled milestone.',
        assigneeId: task.assigneeId
      });
    }
  });

  const analysis = {
    projectName: proj.name,
    blockerCount: blockers.length,
    overallRisk: blockers.some(b => b.severity === 'Critical') ? 'High Risk' : (blockers.length > 0 ? 'Medium Risk' : 'Low Risk'),
    blockers,
    aiRecommendation: blockers.length > 0 
      ? `Identified ${blockers.length} bottlenecks across the pipeline. We recommend assigning a peer reviewer to unlock In-Review tasks and pairing on the OAuth2 implementation.`
      : 'All pipeline checks green! No active bottlenecks or SLA slippages detected.'
  };

  res.json(analysis);
});

// C. "Generate a standup report"
app.post('/api/ai/standup', (req, res) => {
  const { projectId } = req.body;
  const proj = db.projects.find(p => p.id === projectId) || db.projects[0];
  const tasks = db.tasks.filter(t => t.projectId === proj.id);

  const doneTasks = tasks.filter(t => t.status === 'Done');
  const workingTasks = tasks.filter(t => t.status === 'In Progress' || t.status === 'In Review');
  const blockedTasks = tasks.filter(t => t.priority === 'P0' && t.status !== 'Done');

  const report = {
    date: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    projectName: proj.name,
    teamSize: proj.memberIds.length,
    sections: {
      yesterday: doneTasks.map(t => ({ id: t.id, title: t.title, assignee: db.workspaces[0].members.find(m => m.id === t.assigneeId)?.name || 'Team' })),
      today: workingTasks.map(t => ({ id: t.id, title: t.title, status: t.status, priority: t.priority, assignee: db.workspaces[0].members.find(m => m.id === t.assigneeId)?.name || 'Team' })),
      blockers: blockedTasks.map(t => ({ id: t.id, title: t.title, dueDate: t.dueDate, reason: `Critical priority (${t.priority}) pending resolution` }))
    },
    formattedMarkdown: `### 📋 Daily Engineering Standup — ${proj.name}
**Date**: ${new Date().toLocaleDateString()}
**Sprint Cadence**: On Track (${Math.round((doneTasks.length / (tasks.length || 1)) * 100)}% Complete)

#### ✅ Completed in Last 24 Hours:
${doneTasks.map(t => `- [x] **${t.title}** (${db.workspaces[0].members.find(m => m.id === t.assigneeId)?.name || 'Team'})`).join('\n') || '- None recorded'}

#### 🚀 In Progress / Today's Objectives:
${workingTasks.map(t => `- [ ] **${t.title}** [${t.status}] — Assigned to ${db.workspaces[0].members.find(m => m.id === t.assigneeId)?.name || 'Team'}`).join('\n') || '- None in flight'}

#### ⚠️ Impediments & Blockers:
${blockedTasks.map(t => `- 🔴 **${t.title}** (Target: ${t.dueDate})`).join('\n') || '- None! Pipeline is unimpeded'}`
  };

  res.json(report);
});

// D. "AI Task Breakdown Generator"
app.post('/api/ai/breakdown', (req, res) => {
  const { featureDescription, projectId } = req.body;
  if (!featureDescription) {
    return res.status(400).json({ error: 'Please enter a feature description to break down.' });
  }

  const proj = db.projects.find(p => p.id === projectId) || db.projects[0];
  const members = db.workspaces[0].members;

  // Intelligent task breakdown templates tailored to feature description
  const descLower = featureDescription.toLowerCase();
  let generatedTasks = [];

  if (descLower.includes('auth') || descLower.includes('login') || descLower.includes('signup')) {
    generatedTasks = [
      { title: 'Design Database Schema for Users, Passwords & Salts', priority: 'P0', estHours: '4h', labels: ['Database', 'Auth', 'PostgreSQL'], assigneeId: members[0]?.id },
      { title: 'Implement Password Hashing using Argon2id with Salt Pepper', priority: 'P0', estHours: '3h', labels: ['Security', 'Crypto'], assigneeId: members[1]?.id },
      { title: 'Create REST Endpoints: /api/auth/register & /api/auth/login', priority: 'P0', estHours: '5h', labels: ['Backend', 'API'], assigneeId: members[0]?.id },
      { title: 'Build Responsive React Auth Form with Client-Side Validation', priority: 'P1', estHours: '6h', labels: ['Frontend', 'UI/UX'], assigneeId: members[2]?.id },
      { title: 'Add Two-Factor Authentication (TOTP / Google Authenticator)', priority: 'P1', estHours: '8h', labels: ['Security', '2FA'], assigneeId: members[3]?.id },
      { title: 'Configure Rate Limiter & Account Lockout after 5 Failed Attempts', priority: 'P2', estHours: '3h', labels: ['Security', 'Redis'], assigneeId: members[1]?.id }
    ];
  } else if (descLower.includes('chat') || descLower.includes('message') || descLower.includes('notification')) {
    generatedTasks = [
      { title: 'Design Pub/Sub Message Channels & Presence Protocol', priority: 'P0', estHours: '5h', labels: ['WebSockets', 'Architecture'], assigneeId: members[1]?.id },
      { title: 'Implement Message Persistence in MongoDB / PostgreSQL', priority: 'P1', estHours: '4h', labels: ['Database', 'Storage'], assigneeId: members[0]?.id },
      { title: 'Build Virtualized Message Stream with Auto-Scroll to Bottom', priority: 'P1', estHours: '6h', labels: ['Frontend', 'React'], assigneeId: members[2]?.id },
      { title: 'Add Typing Indicators and Live Read Receipts', priority: 'P2', estHours: '3h', labels: ['RealTime', 'UI/UX'], assigneeId: members[2]?.id },
      { title: 'Configure Push Notifications with Web Push API', priority: 'P1', estHours: '5h', labels: ['Notifications', 'ServiceWorker'], assigneeId: members[3]?.id },
      { title: 'End-to-End Latency Benchmark under 1,000 WebSocket Sessions', priority: 'P2', estHours: '4h', labels: ['Testing', 'DevOps'], assigneeId: members[4]?.id }
    ];
  } else {
    // Universal developer breakdown
    const cleanFeature = featureDescription.slice(0, 35);
    generatedTasks = [
      { title: `Architect Technical Specification & API Contract for ${cleanFeature}`, priority: 'P0', estHours: '4h', labels: ['Architecture', 'Design'], assigneeId: members[0]?.id },
      { title: `Develop Core Backend Services & Data Models for ${cleanFeature}`, priority: 'P0', estHours: '8h', labels: ['Backend', 'Database'], assigneeId: members[1]?.id },
      { title: `Build Interactive UI Components & State Hooks for ${cleanFeature}`, priority: 'P1', estHours: '6h', labels: ['Frontend', 'React'], assigneeId: members[2]?.id },
      { title: `Add Automated Unit & Integration Tests (>85% Coverage)`, priority: 'P1', estHours: '5h', labels: ['Testing', 'QA'], assigneeId: members[4]?.id },
      { title: `Perform Security Audit & Performance Profiling`, priority: 'P2', estHours: '3h', labels: ['Security', 'Optimization'], assigneeId: members[3]?.id },
      { title: `Write Developer Documentation & Usage Guide in Wiki`, priority: 'P2', estHours: '2h', labels: ['Documentation', 'Wiki'], assigneeId: members[0]?.id }
    ];
  }

  res.json({
    feature: featureDescription,
    subtaskCount: generatedTasks.length,
    estimatedTotalHours: '25-30h',
    subtasks: generatedTasks
  });
});

// Batch create tasks from breakdown
app.post('/api/ai/apply-breakdown', (req, res) => {
  const { projectId, subtasks } = req.body;
  if (!Array.isArray(subtasks) || subtasks.length === 0) {
    return res.status(400).json({ error: 'No subtasks provided' });
  }

  const proj = db.projects.find(p => p.id === projectId) || db.projects[0];
  const createdTasks = [];

  subtasks.forEach((item, idx) => {
    const newTask = {
      id: 'task-ai-' + Date.now() + '-' + idx,
      projectId: proj.id,
      title: item.title,
      description: `Automated breakdown item for sprint execution. Estimated effort: ${item.estHours || '4h'}.`,
      status: 'To Do',
      priority: item.priority || 'P1',
      assigneeId: item.assigneeId || 'usr-1',
      dueDate: new Date(Date.now() + (idx + 3) * 86400000).toISOString().split('T')[0],
      labels: item.labels || ['AI-Generated'],
      attachments: [],
      comments: [],
      updatedAt: new Date().toISOString()
    };
    db.tasks.push(newTask);
    createdTasks.push(newTask);
  });

  recordActivity({
    projectId: proj.id,
    workspaceId: proj.workspaceId,
    userName: 'DevCollab AI Assistant',
    userAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ai-bot',
    action: 'task_created',
    details: `auto-generated ${createdTasks.length} subtasks from feature breakdown into To Do`
  });

  io.emit('board_refreshed');
  res.status(201).json({ success: true, createdCount: createdTasks.length, tasks: createdTasks });
});

// E. "AI Code Reviewer"
app.post('/api/ai/review-code', (req, res) => {
  const { language, code, title } = req.body;
  if (!code || code.trim() === '') {
    return res.status(400).json({ error: 'Please provide code to review' });
  }

  const lang = (language || 'javascript').toLowerCase();
  let score = 8.5;
  const issues = [];
  let suggestedFix = code;

  // Intelligent heuristic checks based on language and code patterns
  if (lang === 'javascript' || lang === 'typescript') {
    if (code.includes('var ')) {
      score -= 1.0;
      issues.push({
        type: 'Readability',
        severity: 'Moderate',
        line: 1,
        message: 'Use of legacy `var` keyword detected. Prefer `const` for immutable bindings or `let` for block-scoped mutability.'
      });
      suggestedFix = suggestedFix.replace(/var\s+/g, 'const ');
    }
    if (code.includes('eval(')) {
      score -= 3.0;
      issues.push({
        type: 'Security',
        severity: 'Critical',
        line: 1,
        message: 'Direct invocation of `eval()` introduces severe Remote Code Execution (RCE) and prototype pollution vulnerabilities.'
      });
    }
    if (code.includes('==') && !code.includes('===')) {
      score -= 0.8;
      issues.push({
        type: 'Bug Risk',
        severity: 'Moderate',
        line: 1,
        message: 'Loose equality (`==`) permits unexpected type coercion. Use strict equality (`===`) instead.'
      });
      suggestedFix = suggestedFix.replace(/==(?!=)/g, '===');
    }
    if (code.includes('try') && !code.includes('catch')) {
      score -= 1.2;
      issues.push({
        type: 'Reliability',
        severity: 'High',
        line: 1,
        message: 'Unhandled Promise rejection or unclosed try-block without error propagation.'
      });
    }
  } else if (lang === 'python') {
    if (code.includes('except:')) {
      score -= 1.5;
      issues.push({
        type: 'Readability',
        severity: 'High',
        line: 1,
        message: 'Bare `except:` clause intercepts system-exits and keyboard interrupts. Catch specific `Exception` subclasses.'
      });
      suggestedFix = suggestedFix.replace(/except:/g, 'except Exception as e:');
    }
    if (code.includes('import *')) {
      score -= 1.0;
      issues.push({
        type: 'Readability',
        severity: 'Moderate',
        line: 1,
        message: 'Wildcard import (`from module import *`) pollutes the local namespace and breaks static analysis.'
      });
    }
    if (code.includes('open(') && !code.includes('with open(')) {
      score -= 1.2;
      issues.push({
        type: 'Performance',
        severity: 'Moderate',
        line: 1,
        message: 'Unmanaged file handle may cause file descriptor leaks. Use context manager `with open(...) as f:`.'
      });
    }
  } else if (lang === 'cpp') {
    if (code.includes('new ') && !code.includes('delete ')) {
      score -= 2.0;
      issues.push({
        type: 'Security',
        severity: 'Critical',
        line: 1,
        message: 'Raw `new` without matched `delete` indicates memory leak. Adopt RAII smart pointers (`std::unique_ptr` or `std::make_shared`).'
      });
    }
    if (code.includes('strcpy(') || code.includes('sprintf(')) {
      score -= 2.5;
      issues.push({
        type: 'Security',
        severity: 'Critical',
        line: 1,
        message: 'Unbounded buffer copy function prone to buffer overflow exploits. Replace with `strncpy_s` or `std::string`.'
      });
    }
  } else if (lang === 'java') {
    if (code.includes('.equals(') && !code.includes('!= null')) {
      score -= 0.8;
      issues.push({
        type: 'Bug Risk',
        severity: 'Moderate',
        line: 1,
        message: 'Potential `NullPointerException` on `.equals()`. Use `Objects.equals(a, b)` or constant-first comparison.'
      });
    }
    if (code.includes('System.out.println')) {
      score -= 0.5;
      issues.push({
        type: 'Performance',
        severity: 'Low',
        line: 1,
        message: 'Standard console logging in production causes thread synchronization locks. Utilize SLF4J / Logback.'
      });
    }
  } else if (lang === 'go') {
    if (code.includes('go func()') && !code.includes('sync.WaitGroup') && !code.includes('context.')) {
      score -= 1.5;
      issues.push({
        type: 'Reliability',
        severity: 'High',
        line: 1,
        message: 'Orphaned goroutine spawned without cancellation context or WaitGroup tracking, leading to goroutine leaks.'
      });
    }
    if (code.includes('_ = err')) {
      score -= 1.8;
      issues.push({
        type: 'Bug Risk',
        severity: 'High',
        line: 1,
        message: 'Ignored error return value (`_ = err`). Always handle or wrap errors using `fmt.Errorf("%w", err)`.'
      });
    }
  }

  // Ensure baseline issues exist if code was generic
  if (issues.length === 0) {
    score = 9.2;
    issues.push({
      type: 'Optimization',
      severity: 'Low',
      line: 1,
      message: 'Code follows solid idiomatic conventions! Consider adding automated JSDoc / docstrings to public interfaces.'
    });
  }

  // Clamp score
  score = Math.max(2.0, Math.min(9.8, parseFloat(score.toFixed(1))));

  const response = {
    title: title || 'Code Review Report',
    language: lang,
    qualityScore: score,
    breakdown: {
      bugsAndCorrectness: score > 7 ? 'Low Risk (Passed)' : 'Needs Attention',
      securityRating: score > 8 ? 'Secure (A)' : (score > 6 ? 'Warning (B)' : 'Critical Vulnerability (F)'),
      performance: 'O(N) Complexity — Within optimal thresholds',
      maintainability: score > 7.5 ? 'High (Clean Code)' : 'Refactoring Advised'
    },
    issues,
    suggestedFix,
    summaryMarkdown: `**DevCollab AI Code Audit**: Quality Score **${score}/10** across ${issues.length} flagged issue(s). Evaluated memory safety, thread safety, syntax conventions, and OWASP security vectors.`
  };

  res.json(response);
});

// ========================
// SOCKET.IO REAL-TIME COLLABORATION
// ========================

io.on('connection', (socket) => {
  // Send current presence snapshot upon join
  socket.emit('presence_snapshot', livePresence);

  // Client announces user identity
  socket.on('set_user', (user) => {
    socket.data.user = user;
    if (user && user.id) {
      livePresence[user.id] = {
        userId: user.id,
        userName: user.name,
        avatar: user.avatar,
        role: user.role,
        page: 'kanban',
        taskId: null,
        lastSeen: Date.now()
      };
      io.emit('presence_updated', livePresence);
    }
  });

  // Client views a specific task
  socket.on('viewing_task', (data) => {
    const { userId, taskId, taskTitle } = data;
    if (userId && livePresence[userId]) {
      livePresence[userId].taskId = taskId;
      livePresence[userId].taskTitle = taskTitle;
      livePresence[userId].lastSeen = Date.now();
      io.emit('presence_updated', livePresence);
      // Broadcast live toast to others: "Ankush is viewing this task"
      socket.broadcast.emit('user_viewing_task_toast', {
        userName: livePresence[userId].userName,
        taskId,
        taskTitle
      });
    }
  });

  // Client leaves task view
  socket.on('left_task', (data) => {
    const { userId } = data;
    if (userId && livePresence[userId]) {
      livePresence[userId].taskId = null;
      livePresence[userId].taskTitle = null;
      io.emit('presence_updated', livePresence);
    }
  });

  // Real-time task movement sync
  socket.on('move_task', (data) => {
    const { taskId, newStatus, actorName, actorAvatar } = data;
    const task = db.tasks.find(t => t.id === taskId);
    if (task) {
      const oldStatus = task.status;
      task.status = newStatus;
      task.updatedAt = new Date().toISOString();

      recordActivity({
        projectId: task.projectId,
        workspaceId: db.projects.find(p => p.id === task.projectId)?.workspaceId,
        userName: actorName || 'Team Member',
        userAvatar: actorAvatar || '',
        action: 'task_moved',
        details: `moved "${task.title}" to ${newStatus}`
      });

      // Broadcast to all clients
      io.emit('task_moved_broadcast', {
        task,
        oldStatus,
        newStatus,
        actorName: actorName || 'A teammate'
      });
    }
  });

  // Simulate real-time peer action for demonstration
  socket.on('simulate_peer_action', () => {
    const peerActions = [
      () => {
        const randomTask = db.tasks[Math.floor(Math.random() * db.tasks.length)];
        const statuses = ['To Do', 'In Progress', 'In Review', 'Done'];
        const otherStatuses = statuses.filter(s => s !== randomTask.status);
        const newStatus = otherStatuses[Math.floor(Math.random() * otherStatuses.length)];
        randomTask.status = newStatus;
        randomTask.updatedAt = new Date().toISOString();
        recordActivity({
          projectId: randomTask.projectId,
          userName: 'Riya Sharma',
          userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
          action: 'task_moved',
          details: `moved "${randomTask.title}" to ${newStatus}`
        });
        io.emit('task_moved_broadcast', {
          task: randomTask,
          newStatus,
          actorName: 'Riya Sharma'
        });
      },
      () => {
        createNotification({
          userId: 'usr-1',
          title: 'Live Task Update',
          message: 'Dev Patel submitted unit test benchmarks for review.',
          type: 'task',
          link: '#tasks'
        });
      }
    ];
    const chosen = peerActions[Math.floor(Math.random() * peerActions.length)];
    chosen();
  });

  socket.on('disconnect', () => {
    if (socket.data.user && socket.data.user.id) {
      delete livePresence[socket.data.user.id];
      io.emit('presence_updated', livePresence);
    }
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 DevCollab Server running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket Real-Time engine initialized`);
});
