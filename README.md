# Mission Control

AI Operations Command Center for BeonIQ — Real-time visibility into customer deployments, agent orchestration, and platform health.

## Vision

Mission Control is not just a task tracker. It's an **operational consciousness system** that:
- **Knows** what's happening without being told
- **Understands** what it means for customers
- **Predicts** what will happen based on patterns
- **Suggests** what should happen to prevent issues
- **Learns** what actually happened to improve

## Architecture

### Three Layers of Intelligence

#### Layer 1: Data Ingestion (Zero-Input Philosophy)
Automatic data sources:
- GitHub (PRs, commits, issues, deployments)
- Slack (mentions, decisions, blockers)
- AWS (CloudFormation, Lambda logs, data freshness)
- Databricks (pipeline runs, data quality)
- BeonIQ App (user activity, errors, feedback)

**Key principle**: No manual status updates. Everything is inferred from work artifacts.

#### Layer 2: Intelligence Engine (PM Agent)
- **Pattern Recognition**: "This looks like the KGPCO onboarding pattern"
- **Predictive Warnings**: "CS training at risk - 3 dependencies are yellow"
- **Smart Orchestration**: Auto-creates subtasks, suggests reassignments
- **Learning System**: Improves predictions based on outcomes

#### Layer 3: Strategic Interface
Views:
1. **Mission View** - Customer-centric launch tracking
2. **Risk Radar** - What could derail upcoming launches
3. **Agent Activity** - Which agents are working on what
4. **Dependency Web** - What's blocking what
5. **Customer Health** - Data freshness, usage, satisfaction

## Getting Started

```bash
pnpm install
pnpm dev
```

Visit http://localhost:3000 to access Mission Control.

## Agent Integration

Mission Control orchestrates BeonIQ's agent hierarchy:

```
PM Agent (Chia-based)
├── Data Engineering Lead
│   ├── Structured Data Collection Agent
│   ├── Data Cleaning Agent
│   └── Unstructured Data Collection Agent
├── BI Lead Agent
│   ├── Report & Dashboard Creation Agent
│   └── Predictive Analytics Agent
└── Data Science Lead Agent
    ├── What-if Analysis Agent
    └── Diagnostics Agent
```

## Roadmap

### Phase 1: Foundation (Week 1)
- [x] Repository setup
- [ ] Basic board UI
- [ ] GitHub webhook integration
- [ ] Auto card creation from PRs/issues

### Phase 2: Intelligence (Week 2)
- [ ] Slack integration
- [ ] Pattern detection
- [ ] Predictive warnings
- [ ] Daily brief generation

### Phase 3: Full Mission Control (Weeks 3-4)
- [ ] Customer journey visualization
- [ ] Agent orchestration
- [ ] Risk radar view
- [ ] Learning system