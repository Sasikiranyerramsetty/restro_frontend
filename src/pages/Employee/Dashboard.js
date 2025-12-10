import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  Activity,
  ClipboardCheck,
  Clock,
  TrendingUp,
  Users,
  Coffee,
  Headphones,
  CheckCircle2,
  Leaf,
  ShieldCheck,
  Bell,
  MapPin,
  CalendarDays,
  MessageSquare,
  Phone,
  UtensilsCrossed,
  ChevronRight
} from 'lucide-react';
import EmployeeLayout from '../../components/Employee/EmployeeLayout';
import { SectionHeading, toneTokens } from '../../components/Employee/EmployeeUI';
import ThemeToggle from '../../components/UI/ThemeToggle';
import { formatCurrency } from '../../utils';

const getMockDashboard = () => ({
  hero: {
    greeting: 'Good afternoon',
    name: 'Ava',
    shiftWindow: 'Shift 2 · 03:00 PM – 11:00 PM',
    zone: 'Dining Hall · Zone B',
    mission: 'Keep tables flowing and sync closely with the kitchen expo line.',
    highlights: [
      { label: 'Next break', value: '18 min', icon: Coffee },
      { label: 'VIP arrival', value: '6:30 PM', icon: Sparkles }
    ]
  },
  kpis: [
    { label: 'Guests seated', value: 58, delta: '+8 vs yesterday', tone: 'sky', icon: Users },
    { label: 'Orders in flight', value: 14, delta: '3 urgent', tone: 'rose', icon: UtensilsCrossed },
    { label: 'Avg course time', value: '11m', delta: '-1.8m today', tone: 'amber', icon: Clock },
    { label: 'Task completion', value: '82%', delta: '+6% shift', tone: 'emerald', icon: ClipboardCheck }
  ],
  boards: [
    {
      title: 'Dining floor',
      description: 'Tables needing touchpoints',
      tone: 'sky',
      items: [
        { id: 'T-12', title: 'Perez family', detail: 'Course 2 plating', chips: ['No dairy', 'Birthday'], eta: '3m', amount: 1845 },
        { id: 'T-05', title: 'Singh party', detail: 'Awaiting dessert flight', chips: ['VIP'], eta: '7m', amount: 1320 }
      ]
    },
    {
      title: 'Orders in flight',
      description: 'Kitchen + delivery coordination',
      tone: 'rose',
      items: [
        { id: 'DL-18', title: 'CloudKitchen', detail: 'Pickup rider in lobby', chips: ['Zomato'], eta: '5m', amount: 965 },
        { id: 'RT-44', title: 'Chef tasting', detail: 'Course swap requested', chips: ['Allergy'], eta: 'Now', amount: 2210 }
      ]
    },
    {
      title: 'Support queue',
      description: 'Tasks from floor leads',
      tone: 'emerald',
      items: [
        { id: 'SQ-09', title: 'Reset patio tables', detail: 'Need new linens', chips: ['Team Ops'], eta: '20m', amount: null },
        { id: 'SQ-11', title: 'Bar backup', detail: 'Cover guest walk-through', chips: ['Host stand'], eta: 'ASAP', amount: null }
      ]
    }
  ],
  focusTasks: [
    { title: 'Update allergen board', owner: 'Service', due: 'Due in 12m', progress: 65, tag: 'urgent' },
    { title: 'Check in with table 6', owner: 'You', due: 'Follow-up in 8m', progress: 35, tag: 'guest' },
    { title: 'Inventory spot check', owner: 'Ops', due: 'Before 5:30 PM', progress: 10, tag: 'ops' }
  ],
  timeline: [
    { time: '15:05', label: 'VIP arrival', detail: 'Perez family seated at T-12', tone: 'highlight' },
    { time: '15:18', label: 'Kitchen ping', detail: 'Course 2 taking +2m', tone: 'info' },
    { time: '15:32', label: 'Allergy alert', detail: 'DL-18 no sesame oil', tone: 'alert' },
    { time: '15:45', label: 'Staffing', detail: 'Ravi covering patio break', tone: 'info' }
  ],
  occupancy: { tables: 32, active: 24, waitlist: 5, guests: 94 },
  quickLinks: [
    { label: 'Ping kitchen', hint: '2 unread mentions', icon: MessageSquare },
    { label: 'Call host stand', hint: 'Ext. 202', icon: Phone },
    { label: 'Escalate issue', hint: 'Ops lead on-call', icon: Headphones }
  ],
  wellness: {
    hydration: 0.74,
    breaksTaken: 2,
    breaksRemaining: 1,
    message: 'Take a 5-min reset after table 6 dessert is served.'
  },
  support: {
    lead: 'Ravi',
    role: 'Ops lead',
    phone: '(555) 201-8844',
    channel: '#floor-support'
  }
});

const EmployeeDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDashboard(getMockDashboard());
      setLoading(false);
    }, 420);

    return () => clearTimeout(timer);
  }, []);

  if (loading || !dashboard) {
    return (
      <EmployeeLayout>
        <div className="space-y-6 animate-pulse">
          <div className="h-48 rounded-3xl bg-slate-200" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-32 rounded-2xl bg-white shadow-sm border border-slate-100" />
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-64 rounded-2xl bg-white shadow-sm border border-slate-100" />
            <div className="h-64 rounded-2xl bg-white shadow-sm border border-slate-100" />
          </div>
        </div>
      </EmployeeLayout>
    );
  }

  const occupancyPercent = Math.round((dashboard.occupancy.active / dashboard.occupancy.tables) * 100);

  return (
    <EmployeeLayout>
      <div className="space-y-8 pb-16 text-slate-900">
        <section className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-slate-50 to-white opacity-80" />
          <div className="relative grid gap-8 p-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Shift command</p>
                  <h1 className="text-3xl font-semibold text-slate-900">
                    {dashboard.hero.greeting}, {dashboard.hero.name}
                  </h1>
                </div>
                <ThemeToggle />
              </div>
              <p className="text-base text-slate-600">{dashboard.hero.mission}</p>
              <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-indigo-500" />
                  {dashboard.hero.shiftWindow}
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  {dashboard.hero.zone}
                </span>
              </div>
            </div>
            <div className="grid gap-3 rounded-2xl bg-slate-50 p-4">
              {dashboard.hero.highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
                      <p className="text-lg font-semibold text-slate-900">{item.value}</p>
                    </div>
                    <span className="rounded-xl bg-slate-50 p-3 text-slate-600">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="lg:col-span-3 flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white">
                <Bell className="h-4 w-4" />
                Log shift note
              </button>
              <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600">
                <TrendingUp className="h-4 w-4" />
                Review shift insights
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {dashboard.kpis.map((kpi) => {
            const Icon = kpi.icon;
            const tone = toneTokens[kpi.tone] || {};
            return (
              <div
                key={kpi.label}
                className={`rounded-2xl border bg-white p-4 shadow-sm ${tone.border || 'border-slate-100'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500">{kpi.label}</span>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${tone.chip || 'bg-slate-100 text-slate-600'}`}>
                    {kpi.delta}
                  </span>
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <p className="text-3xl font-semibold text-slate-900">{kpi.value}</p>
                  <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${tone.bg || 'bg-slate-50'} ${tone.text || 'text-slate-600'}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                </div>
              </div>
            );
          })}
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          {dashboard.boards.map((board) => {
            const tone = toneTokens[board.tone] || {};
            return (
              <div key={board.title} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">{board.title}</p>
                    <p className="text-sm text-slate-500">{board.description}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone.chip || 'bg-slate-100 text-slate-600'}`}>
                    {board.items.length} active
                  </span>
                </div>
                <div className="mt-4 space-y-4">
                  {board.items.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-slate-100 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                          <p className="text-xs text-slate-500">{item.detail}</p>
                        </div>
                        <span className="text-xs font-medium text-slate-500">{item.eta}</span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                          {item.id}
                        </span>
                        {item.chips.map((chip) => (
                          <span key={chip} className="rounded-full bg-slate-50 px-2 py-1 text-xs text-slate-500">
                            {chip}
                          </span>
                        ))}
                      </div>
                      {item.amount && (
                        <p className="mt-3 text-sm font-semibold text-slate-900">{formatCurrency(item.amount)}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <SectionHeading title="Focus tasks" description="Keep priority items moving" actionLabel="Open task board" />
              <div className="mt-5 space-y-4">
                {dashboard.focusTasks.map((task) => (
                  <div key={task.title} className="rounded-2xl border border-slate-100 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{task.title}</p>
                        <p className="text-xs text-slate-500">{task.owner}</p>
                      </div>
                      <span className="text-xs font-medium text-slate-500">{task.due}</span>
                    </div>
                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${
                          task.progress >= 70 ? 'bg-emerald-500' : task.progress >= 40 ? 'bg-amber-400' : 'bg-slate-400'
                        }`}
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                      <span>{task.progress}% complete</span>
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1 capitalize">
                        {task.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <SectionHeading title="Timeline" description="Context from the last 45 minutes" />
              <div className="mt-4 space-y-4">
                {dashboard.timeline.map((event) => (
                  <div key={event.time} className="flex items-start gap-4">
                    <span className="text-xs font-semibold text-slate-400">{event.time}</span>
                    <div className="flex-1 rounded-2xl border border-slate-100 p-4">
                      <p className="text-sm font-semibold text-slate-900">{event.label}</p>
                      <p className="text-sm text-slate-600">{event.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <SectionHeading title="Occupancy" description="Live floor snapshot" />
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-4xl font-semibold text-slate-900">{occupancyPercent}%</p>
                  <span className="text-sm text-slate-500">
                    {dashboard.occupancy.active}/{dashboard.occupancy.tables} tables
                  </span>
                </div>
                <div className="h-3 rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                    style={{ width: `${occupancyPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>{dashboard.occupancy.guests} guests dining</span>
                  <span>{dashboard.occupancy.waitlist} parties waiting</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <SectionHeading title="Quick links" description="Fast actions & contacts" />
              <div className="mt-4 space-y-3">
                {dashboard.quickLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <button
                      key={link.label}
                      className="w-full rounded-2xl border border-slate-100 px-4 py-3 text-left transition hover:border-slate-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="rounded-2xl bg-slate-50 p-3 text-slate-600">
                            <Icon className="h-5 w-5" />
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{link.label}</p>
                            <p className="text-xs text-slate-500">{link.hint}</p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <SectionHeading title="Wellness" description="Stay sharp during service" />
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">Hydration</p>
                    <p className="text-2xl font-semibold text-slate-900">{Math.round(dashboard.wellness.hydration * 100)}%</p>
                  </div>
                  <Leaf className="h-6 w-6 text-emerald-500" />
                </div>
                <div className="text-sm text-slate-600">
                  Breaks: {dashboard.wellness.breaksTaken} taken · {dashboard.wellness.breaksRemaining} remaining
                </div>
                <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">{dashboard.wellness.message}</p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <SectionHeading title="Support" description="Escalate or request backup" />
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-indigo-500" />
                  {dashboard.support.role}: {dashboard.support.lead}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-500" />
                  {dashboard.support.phone}
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-slate-500" />
                  {dashboard.support.channel}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </EmployeeLayout>
  );
};

export default EmployeeDashboard;
