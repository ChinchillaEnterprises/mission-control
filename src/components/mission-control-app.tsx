"use client"

import * as React from "react"
import {
  ArrowClockwiseIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CirclesFourIcon,
  ClockIcon,
  GitBranchIcon,
  KanbanIcon,
  LinkIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  SignOutIcon,
  XIcon,
  RocketIcon,
  WarningCircleIcon,
  UsersFourIcon,
  GraphIcon,
  HeartbeatIcon,
  BrainIcon,
  LightningIcon,
  ChartLineIcon,
  FlagIcon,
  CircleNotchIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockAfternoonIcon,
  TrendUpIcon,
  TrendDownIcon,
} from "@phosphor-icons/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

type ViewMode = "mission" | "risk" | "agents" | "dependencies" | "health"
type IconComponent = React.ElementType

type Customer = {
  id: string
  name: string
  code: string
  launchDate: string
  status: "planning" | "building" | "testing" | "training" | "live" | "at-risk"
  progress: number
  dataFreshness: number
  blockers: number
  owner: string
  priority: "critical" | "high" | "medium" | "low"
}

type Risk = {
  id: string
  customer: string
  type: "data" | "integration" | "training" | "technical" | "dependency"
  severity: "critical" | "high" | "medium" | "low"
  description: string
  predictedImpact: string
  suggestedAction: string
  daysUntilImpact: number
}

type Agent = {
  id: string
  name: string
  type: "orchestrator" | "data-processor" | "ai-analyzer" | "reporter" | "monitor"
  functionName: string
  status: "idle" | "running" | "error" | "throttled"
  currentTask?: string
  customer?: string
  lastActivity: string
  successRate: number
  invocations: number
  errorCount: number
}

type Dependency = {
  id: string
  from: string
  to: string
  type: "blocks" | "requires" | "informs"
  status: "healthy" | "warning" | "critical"
  description: string
}

const viewOptions: {
  id: ViewMode
  label: string
  icon: IconComponent
  description: string
}[] = [
  {
    id: "mission",
    label: "Mission View",
    icon: RocketIcon,
    description: "Customer launches & milestones"
  },
  {
    id: "risk",
    label: "Risk Radar",
    icon: WarningCircleIcon,
    description: "Predictive warnings & blockers"
  },
  {
    id: "agents",
    label: "Agent Activity",
    icon: UsersFourIcon,
    description: "AI agent orchestration"
  },
  {
    id: "dependencies",
    label: "Dependency Web",
    icon: GraphIcon,
    description: "Task dependencies & blockers"
  },
  {
    id: "health",
    label: "Customer Health",
    icon: HeartbeatIcon,
    description: "Data freshness & satisfaction"
  },
]

// Real-time data fetching from BeonIQ API
const fetchCustomers = async (): Promise<Customer[]> => {
  try {
    const response = await fetch('/api/customers')
    if (!response.ok) throw new Error('Failed to fetch')
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch customers:', error)
    return []
  }
}

const fetchAgents = async (): Promise<Agent[]> => {
  try {
    const response = await fetch('/api/agents')
    if (!response.ok) throw new Error('Failed to fetch')
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch agents:', error)
    return []
  }
}

const fetchRisks = async (): Promise<Risk[]> => {
  try {
    const response = await fetch('/api/risks')
    if (!response.ok) throw new Error('Failed to fetch')
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch risks:', error)
    return []
  }
}

export function MissionControlApp() {
  const [viewMode, setViewMode] = React.useState<ViewMode>("mission")
  const [query, setQuery] = React.useState("")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false)
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  // Real data states
  const [customers, setCustomers] = React.useState<Customer[]>([])
  const [agents, setAgents] = React.useState<Agent[]>([])
  const [risks, setRisks] = React.useState<Risk[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  // Fetch real data on mount
  React.useEffect(() => {
    loadData()
    // Refresh every 30 seconds
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  async function loadData() {
    setIsLoading(true)
    try {
      const [customersData, agentsData, risksData] = await Promise.all([
        fetchCustomers(),
        fetchAgents(),
        fetchRisks()
      ])
      setCustomers(customersData)
      setAgents(agentsData)
      setRisks(risksData)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleRefresh() {
    setIsRefreshing(true)
    await loadData()
    setIsRefreshing(false)
  }

  const selectedView = viewOptions.find(v => v.id === viewMode)!
  const ViewIcon = selectedView.icon

  return (
    <div className="flex h-screen min-h-0 bg-black text-white">
      <aside
        className={cn(
          "hidden shrink-0 border-r border-yellow-500/20 bg-gradient-to-b from-black to-yellow-950/10 transition-[width] duration-200 lg:flex lg:flex-col",
          isSidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        <div
          className={cn(
            "flex h-14 items-center px-3 border-b border-yellow-500/20",
            isSidebarCollapsed ? "justify-center" : "gap-2"
          )}
        >
          {isSidebarCollapsed ? (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setIsSidebarCollapsed(false)}
              className="text-yellow-500 hover:text-yellow-400"
            >
              <CaretRightIcon />
            </Button>
          ) : (
            <>
              <div className="flex size-8 items-center justify-center rounded-lg bg-yellow-500 text-black">
                <BrainIcon className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-yellow-500">Mission Control</div>
                <div className="text-xs text-yellow-500/60">BeonIQ Operations</div>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setIsSidebarCollapsed(true)}
                className="text-yellow-500/60 hover:text-yellow-400"
              >
                <CaretLeftIcon />
              </Button>
            </>
          )}
        </div>

        <nav
          className={cn(
            "flex flex-1 flex-col gap-1 text-sm py-3",
            isSidebarCollapsed ? "items-center px-2" : "px-3"
          )}
        >
          {viewOptions.map((view) => {
            const Icon = view.icon
            const isActive = viewMode === view.id
            return (
              <button
                key={view.id}
                onClick={() => setViewMode(view.id)}
                className={cn(
                  "relative flex items-center gap-3 rounded-lg transition-all",
                  isSidebarCollapsed ? "size-12 justify-center p-0" : "w-full px-3 py-2 text-left",
                  isActive
                    ? "bg-yellow-500/20 text-yellow-400 shadow-lg shadow-yellow-500/10"
                    : "text-gray-400 hover:bg-yellow-500/10 hover:text-yellow-500"
                )}
                title={isSidebarCollapsed ? view.label : undefined}
              >
                <Icon className={cn("shrink-0", isSidebarCollapsed ? "size-5" : "size-4")} />
                {!isSidebarCollapsed && (
                  <>
                    <div className="flex-1">
                      <div className="font-medium">{view.label}</div>
                      <div className="text-xs opacity-60">{view.description}</div>
                    </div>
                  </>
                )}
              </button>
            )
          })}
        </nav>

        <Separator className="bg-yellow-500/20" />

        <div className={cn("p-3", isSidebarCollapsed && "px-2")}>
          {isSidebarCollapsed ? (
            <div className="flex flex-col items-center gap-2">
              <div className="size-9 rounded-lg bg-yellow-500/20 flex items-center justify-center text-yellow-400 font-bold">
                M
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-xs text-gray-500">System Status</div>
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-gray-400">All systems operational</span>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Last sync: 2 min ago
              </div>
            </div>
          )}
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-yellow-500/20 bg-gradient-to-r from-black via-yellow-950/10 to-black px-4">
          <div className="flex items-center gap-2 text-yellow-500">
            <ViewIcon className="size-5" />
            <span className="font-bold">{selectedView.label}</span>
          </div>

          <div className="relative flex min-w-48 flex-1 items-center">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-2.5 size-4 text-gray-500" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search customers, agents, or tasks..."
              className="h-8 border-yellow-500/20 bg-black/50 pl-8 text-white placeholder:text-gray-500 focus:border-yellow-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-yellow-500/30 text-yellow-500">
              <CircleNotchIcon className="size-3 animate-spin" />
              <span className="ml-1">Live Data</span>
            </Badge>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10"
            >
              <ArrowClockwiseIcon className={cn("size-4", isRefreshing && "animate-spin")} />
              <span className="ml-2">Refresh</span>
            </Button>
          </div>
        </header>

        <ScrollArea className="flex-1">
          {viewMode === "mission" && <MissionView customers={customers} query={query} />}
          {viewMode === "risk" && <RiskRadarView risks={risks} query={query} />}
          {viewMode === "agents" && <AgentActivityView agents={agents} query={query} />}
          {viewMode === "dependencies" && <DependencyWebView query={query} />}
          {viewMode === "health" && <CustomerHealthView customers={customers} query={query} />}
        </ScrollArea>
      </main>
    </div>
  )
}

function MissionView({ customers, query }: { customers: Customer[], query: string }) {
  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.code.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-yellow-500 mb-2">Active Missions</h2>
        <p className="text-gray-400">Customer launches and deployment progress</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="border-yellow-500/20 bg-black/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-white">{customer.name}</CardTitle>
                  <CardDescription className="text-gray-400">
                    Code: {customer.code} · Owner: {customer.owner}
                  </CardDescription>
                </div>
                <Badge
                  variant={customer.priority === "critical" ? "destructive" : "outline"}
                  className={cn(
                    customer.priority === "critical" && "bg-red-500/20 text-red-400 border-red-500/50",
                    customer.priority === "high" && "bg-orange-500/20 text-orange-400 border-orange-500/50",
                    customer.priority === "medium" && "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
                    customer.priority === "low" && "bg-green-500/20 text-green-400 border-green-500/50"
                  )}
                >
                  {customer.priority}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Launch Progress</span>
                  <span className="text-yellow-400 font-medium">{customer.progress}%</span>
                </div>
                <Progress value={customer.progress} className="h-2 bg-gray-800">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 transition-all"
                    style={{ width: `${customer.progress}%` }}
                  />
                </Progress>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <FlagIcon className="size-4 text-gray-400" />
                  <span className="text-gray-400">Launch</span>
                </div>
                <span className="text-white font-medium">
                  {new Date(customer.launchDate).toLocaleDateString()}
                </span>
              </div>

              <div className="flex gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <HeartbeatIcon className="size-4 text-green-400" />
                  <span className="text-gray-400">Fresh:</span>
                  <span className="text-green-400">{customer.dataFreshness}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <WarningCircleIcon className="size-4 text-orange-400" />
                  <span className="text-gray-400">Blockers:</span>
                  <span className="text-orange-400">{customer.blockers}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-yellow-500/10">
                <Badge
                  variant="outline"
                  className={cn(
                    "border-gray-600 text-gray-400",
                    customer.status === "live" && "border-green-500/50 text-green-400",
                    customer.status === "training" && "border-blue-500/50 text-blue-400",
                    customer.status === "testing" && "border-purple-500/50 text-purple-400",
                    customer.status === "building" && "border-yellow-500/50 text-yellow-400",
                    customer.status === "at-risk" && "border-red-500/50 text-red-400"
                  )}
                >
                  {customer.status}
                </Badge>
                <Button size="sm" variant="ghost" className="text-yellow-500 hover:text-yellow-400">
                  View Details →
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function RiskRadarView({ risks, query }: { risks: Risk[], query: string }) {
  const filteredRisks = risks.filter(r =>
    r.customer.toLowerCase().includes(query.toLowerCase()) ||
    r.description.toLowerCase().includes(query.toLowerCase())
  )

  const criticalCount = filteredRisks.filter(r => r.severity === "critical").length
  const highCount = filteredRisks.filter(r => r.severity === "high").length

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-yellow-500 mb-2">Risk Radar</h2>
        <div className="flex items-center gap-4">
          <p className="text-gray-400">Predictive warnings and recommended actions</p>
          <div className="flex gap-3">
            <Badge variant="destructive" className="bg-red-500/20 text-red-400">
              {criticalCount} Critical
            </Badge>
            <Badge className="bg-orange-500/20 text-orange-400">
              {highCount} High
            </Badge>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredRisks.map((risk) => (
          <Card
            key={risk.id}
            className={cn(
              "border-l-4 bg-black/50 backdrop-blur",
              risk.severity === "critical" && "border-l-red-500 border-red-500/20",
              risk.severity === "high" && "border-l-orange-500 border-orange-500/20",
              risk.severity === "medium" && "border-l-yellow-500 border-yellow-500/20",
              risk.severity === "low" && "border-l-green-500 border-green-500/20"
            )}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        risk.severity === "critical" && "border-red-500/50 text-red-400",
                        risk.severity === "high" && "border-orange-500/50 text-orange-400",
                        risk.severity === "medium" && "border-yellow-500/50 text-yellow-400",
                        risk.severity === "low" && "border-green-500/50 text-green-400"
                      )}
                    >
                      {risk.severity}
                    </Badge>
                    <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                      {risk.customer}
                    </Badge>
                    <Badge variant="outline" className="border-gray-600 text-gray-400">
                      {risk.type}
                    </Badge>
                  </div>
                  <CardTitle className="text-white text-lg">{risk.description}</CardTitle>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-yellow-400">
                    {risk.daysUntilImpact === 0 ? "NOW" : `${risk.daysUntilImpact}d`}
                  </div>
                  <div className="text-xs text-gray-400">until impact</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">PREDICTED IMPACT</div>
                  <p className="text-sm text-orange-300">{risk.predictedImpact}</p>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">RECOMMENDED ACTION</div>
                  <p className="text-sm text-green-300">{risk.suggestedAction}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button size="sm" className="bg-yellow-500 text-black hover:bg-yellow-400">
                  <LightningIcon className="size-4 mr-1" />
                  Take Action
                </Button>
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-400">
                  Dismiss
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function AgentActivityView({ agents, query }: { agents: Agent[], query: string }) {
  const filteredAgents = agents.filter(a =>
    a.name.toLowerCase().includes(query.toLowerCase()) ||
    (a.currentTask?.toLowerCase().includes(query.toLowerCase()) ?? false)
  )

  const runningCount = filteredAgents.filter(a => a.status === "running").length
  const errorCount = filteredAgents.filter(a => a.status === "error" || a.status === "throttled").length

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-yellow-500 mb-2">Agent Activity</h2>
        <div className="flex items-center gap-4">
          <p className="text-gray-400">AI agent orchestration and task monitoring</p>
          <div className="flex gap-3">
            <Badge className="bg-green-500/20 text-green-400">
              {runningCount} Running
            </Badge>
            {errorCount > 0 && (
              <Badge variant="destructive" className="bg-red-500/20 text-red-400">
                {errorCount} Issues
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {filteredAgents.map((agent) => (
          <Card key={agent.id} className="border-yellow-500/20 bg-black/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-white flex items-center gap-2">
                    {agent.type === "orchestrator" && <BrainIcon className="size-5 text-purple-400" />}
                    {agent.type === "data-processor" && <ChartLineIcon className="size-5 text-blue-400" />}
                    {agent.type === "ai-analyzer" && <LightningIcon className="size-5 text-yellow-400" />}
                    {agent.type === "monitor" && <HeartbeatIcon className="size-5 text-green-400" />}
                    {agent.type === "reporter" && <GraphIcon className="size-5 text-cyan-400" />}
                    {agent.name}
                  </CardTitle>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    agent.status === "running" && "border-green-500/50 text-green-400",
                    agent.status === "idle" && "border-gray-600 text-gray-400",
                    agent.status === "error" && "border-red-500/50 text-red-400",
                    agent.status === "throttled" && "border-orange-500/50 text-orange-400"
                  )}
                >
                  {agent.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {agent.currentTask && (
                <div>
                  <div className="text-xs text-gray-500 mb-1">CURRENT TASK</div>
                  <p className="text-sm text-white">{agent.currentTask}</p>
                  {agent.customer && (
                    <Badge variant="secondary" className="mt-1 bg-gray-800 text-gray-300">
                      {agent.customer}
                    </Badge>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs text-gray-500">Success Rate</div>
                  <div className="flex items-center gap-1 mt-1">
                    {agent.successRate >= 90 ? (
                      <CheckCircleIcon className="size-4 text-green-400" />
                    ) : (
                      <WarningCircleIcon className="size-4 text-yellow-400" />
                    )}
                    <span className="text-white font-medium">{agent.successRate}%</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Tasks</div>
                  <div className="text-white font-medium mt-1">{agent.invocations}</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-yellow-500/10">
                <span className="text-xs text-gray-400">
                  <ClockAfternoonIcon className="size-3 inline mr-1" />
                  {agent.lastActivity}
                </span>
                {agent.status === "error" && (
                  <Button size="sm" className="h-6 text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30">
                    View Logs
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function DependencyWebView({ query }: { query: string }) {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-yellow-500 mb-2">Dependency Web</h2>
        <p className="text-gray-400">Task dependencies and blocker visualization</p>
      </div>

      <Card className="border-yellow-500/20 bg-black/50 backdrop-blur">
        <CardContent className="p-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center space-y-4">
              <GraphIcon className="size-16 text-yellow-500/30 mx-auto" />
              <div>
                <p className="text-gray-400">Interactive dependency graph coming soon</p>
                <p className="text-sm text-gray-500 mt-2">
                  Will show task relationships, blockers, and critical paths
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function CustomerHealthView({ customers, query }: { customers: Customer[], query: string }) {
  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.code.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-yellow-500 mb-2">Customer Health</h2>
        <p className="text-gray-400">Data freshness, usage metrics, and satisfaction scores</p>
      </div>

      <div className="grid gap-4">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="border-yellow-500/20 bg-black/50 backdrop-blur">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">{customer.name}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {customer.code} · Last updated 2 min ago
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {customer.dataFreshness >= 95 ? (
                    <TrendUpIcon className="size-6 text-green-400" />
                  ) : customer.dataFreshness >= 85 ? (
                    <TrendUpIcon className="size-6 text-yellow-400" />
                  ) : (
                    <TrendDownIcon className="size-6 text-red-400" />
                  )}
                  <span className="text-2xl font-bold text-white">{customer.dataFreshness}%</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">DATA FRESHNESS</div>
                  <Progress value={customer.dataFreshness} className="h-2 bg-gray-800 mb-2">
                    <div
                      className={cn(
                        "h-full transition-all",
                        customer.dataFreshness >= 95 ? "bg-green-500" :
                        customer.dataFreshness >= 85 ? "bg-yellow-500" : "bg-red-500"
                      )}
                      style={{ width: `${customer.dataFreshness}%` }}
                    />
                  </Progress>
                  <span className="text-sm font-medium text-white">{customer.dataFreshness}%</span>
                </div>

                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">API CALLS</div>
                  <div className="text-2xl font-bold text-blue-400">1,247</div>
                  <div className="text-xs text-gray-400">Today</div>
                </div>

                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">ACTIVE USERS</div>
                  <div className="text-2xl font-bold text-green-400">18</div>
                  <div className="text-xs text-gray-400">Online now</div>
                </div>

                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">SATISFACTION</div>
                  <div className="text-2xl font-bold text-yellow-400">92%</div>
                  <div className="text-xs text-gray-400">This week</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}