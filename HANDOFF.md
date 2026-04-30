# Mission Control - Handoff Documentation

## For Abel & Soroush

### What This Is
Mission Control is Marta's operational dashboard for BeonIQ. Think of it as the "AWS Systems Manager" for our AI agent network - a single pane of glass showing what's happening across all customers, agents (Lambdas), and data pipelines.

### Current State
- ✅ **UI Complete**: All five views built with BeonIQ branding
- ✅ **Data Structure**: Proper TypeScript interfaces matching our domain
- ✅ **API Routes**: Ready for real data injection
- ⏳ **Real Data**: Currently using realistic mock data
- ❌ **Auth**: No authentication yet
- ❌ **Live Connection**: Not connected to DynamoDB/CloudWatch yet

### Quick Start
```bash
cd mission-control
npm install
npm run dev
# Opens at http://localhost:3001
```

### Where to Add Real Data

#### 1. Customer Data (DynamoDB)
File: `src/lib/beoniq-api.ts`
```typescript
// Line 196: Replace REAL_CUSTOMERS array with:
export async function getCustomers(): Promise<Customer[]> {
  // Add DynamoDB query here
  // Table: Company-[hash]-NONE
  // Map to Customer interface
}
```

#### 2. Lambda Status (CloudWatch)
File: `src/lib/beoniq-api.ts`
```typescript
// Line 293: Replace REAL_AGENTS array with:
export async function getAgents(): Promise<Agent[]> {
  // Query Lambda function status
  // Check CloudWatch metrics
  // Map to Agent interface
}
```

#### 3. Risk Detection (CloudWatch Alarms + Custom Logic)
File: `src/lib/beoniq-api.ts`
```typescript
// Line 345: Replace REAL_RISKS array with:
export async function getRisks(): Promise<Risk[]> {
  // Check CloudWatch alarms
  // Query error logs
  // Run predictive logic
}
```

### Authentication Setup

#### Option 1: Shared Cognito (Recommended)
```typescript
// src/app/layout.tsx
import { Amplify } from 'aws-amplify'
import config from '@/amplify_outputs.json'

Amplify.configure(config)

// Wrap app in authenticator
```

#### Option 2: Internal Only
- Deploy to private subnet
- VPN/IP restrictions via CloudFront
- No public access

### Environment Variables Needed
```env
# .env.local
AWS_REGION=us-east-1
DYNAMODB_ENDPOINT=https://dynamodb.us-east-1.amazonaws.com
CLOUDWATCH_ENDPOINT=https://monitoring.us-east-1.amazonaws.com

# If using Amplify
NEXT_PUBLIC_USER_POOL_ID=us-east-1_xxxxx
NEXT_PUBLIC_USER_POOL_CLIENT_ID=xxxxx
```

### Deployment Options

#### Option 1: Amplify Hosting (Easiest)
```bash
npm run build
# Push to GitHub
# Amplify auto-deploys from main branch
```

#### Option 2: Standalone EC2/ECS
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci --only=production
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### Option 3: Subdomain of BeonIQ
- Deploy to `mission.beoniq.com` or `control.beoniq.com`
- Share auth cookies with main app
- Use same CloudFront distribution

### API Endpoints to Implement

All in `src/app/api/`:

1. **GET /api/customers** - Return Company records
2. **GET /api/agents** - Return Lambda function status
3. **GET /api/risks** - Return detected issues
4. **GET /api/health** - Return data freshness metrics
5. **POST /api/invoke** - Trigger Lambda execution
6. **POST /api/acknowledge** - Mark risk as acknowledged

### WebSocket Integration (Optional but Cool)

For real-time updates:
```typescript
// src/lib/websocket.ts
import { io } from 'socket.io-client'

const socket = io('wss://api.beoniq.com/mission-control')

socket.on('lambda-update', (data) => {
  // Update agent status
})

socket.on('new-risk', (risk) => {
  // Add to risk radar
})
```

### Things to Keep As-Is

1. **The Five Views** - Marta's mental model
2. **Color Scheme** - Matches BeonIQ brand
3. **30-second refresh** - Good default
4. **Agent naming** - Business-friendly terms
5. **Risk severity levels** - Critical/High/Medium/Low

### Known Limitations (OK for MVP)

1. **Dependency Web** - Just placeholder, needs D3.js work
2. **No historical data** - Only shows current state
3. **No mobile optimization** - Desktop only for now
4. **Read-only** - No actions yet (can add Lambda invoke buttons later)

### Testing Checklist

- [ ] Auth flow works (if implemented)
- [ ] All 5 views load without errors
- [ ] Data refreshes every 30 seconds
- [ ] Search filters work correctly
- [ ] No CORS errors in production
- [ ] Handles API failures gracefully

### Questions to Clarify with Marta

1. **Who gets access?** Just tech team or broader?
2. **Alerting?** Should critical risks ping Slack?
3. **Historical view?** Need graphs/trends or just current state?
4. **Actions?** Which Lambdas should have "Run Now" buttons?

### Contact for Questions

- **UI/Frontend**: This is complete, shouldn't need changes
- **Data Integration**: Add real AWS SDK calls in `beoniq-api.ts`
- **Deployment**: Standard Next.js deployment
- **Design Changes**: Check with Marta first - she likes the yellow theme

### Final Note

This is meant to be Marta's "war room" dashboard. Keep it simple, fast, and focused on "what's broken and how do we fix it." Don't overcomplicate - it's better to show 5 critical things clearly than 50 things poorly.

The UI is production-ready. Just needs real data pipes connected.

---

*Handoff prepared: April 30, 2026*
*UI by: Claude + User*
*Ready for: Abel/Soroush backend integration*