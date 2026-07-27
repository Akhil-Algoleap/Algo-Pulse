import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Users,
  Flag,
  CalendarCheck,
  Video,
  Clock,
  Briefcase
} from 'lucide-react';
import { Button, Card, Badge, cn } from '../components/UI';

interface Event {
  id: string;
  title: string;
  date: number; // For simplicity in mock, just the day of current month (1-31)
  type: 'Sprint Start' | 'Sprint End' | 'Release' | 'Leave' | 'Holiday' | 'Milestone' | 'Meeting';
}

const CURRENT_MONTH = 'July 2026';
const DAYS_IN_MONTH = 31;
const START_DAY_INDEX = 3; // Let's say July 1st starts on a Wednesday (0=Sun, 1=Mon, 2=Tue, 3=Wed)

const EVENTS: Event[] = [
  { id: '1', title: 'Sprint 42 Start', date: 6, type: 'Sprint Start' },
  { id: '2', title: 'Sprint 42 End', date: 17, type: 'Sprint End' },
  { id: '3', title: 'v1.4 Release', date: 20, type: 'Release' },
  { id: '4', title: 'Akhil Leave', date: 15, type: 'Leave' },
  { id: '5', title: 'Priya Leave', date: 15, type: 'Leave' },
  { id: '6', title: 'Independence Day', date: 4, type: 'Holiday' },
  { id: '7', title: 'Beta Milestone', date: 10, type: 'Milestone' },
  { id: '8', title: 'Client Review - Acme Corp', date: 22, type: 'Meeting' },
  { id: '9', title: 'Sprint 43 Start', date: 20, type: 'Sprint Start' },
  { id: '10', title: 'Client Sync', date: 8, type: 'Meeting' },
];

export const ProjectCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const getEventStyle = (type: Event['type']) => {
    switch (type) {
      case 'Sprint Start': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Sprint End': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Release': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Leave': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Holiday': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Milestone': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Meeting': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getEventIcon = (type: Event['type']) => {
    switch (type) {
      case 'Sprint Start': return <Briefcase className="w-3 h-3 mr-1" />;
      case 'Sprint End': return <Check className="w-3 h-3 mr-1" />;
      case 'Release': return <Rocket className="w-3 h-3 mr-1" />;
      case 'Leave': return <Users className="w-3 h-3 mr-1" />;
      case 'Holiday': return <CalendarCheck className="w-3 h-3 mr-1" />;
      case 'Milestone': return <Flag className="w-3 h-3 mr-1" />;
      case 'Meeting': return <Video className="w-3 h-3 mr-1" />;
      default: return <Clock className="w-3 h-3 mr-1" />;
    }
  };

  const Rocket = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
    </svg>
  );

  const Check = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"/></svg>
  );

  // Generate calendar days
  const calendarDays = [];
  for (let i = 0; i < START_DAY_INDEX; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="min-h-[100px] border-b border-r border-slate-100 bg-slate-50/50 p-2" />);
  }
  for (let i = 1; i <= DAYS_IN_MONTH; i++) {
    const dayEvents = EVENTS.filter(e => e.date === i);
    const isToday = i === new Date().getDate() && CURRENT_MONTH.includes(new Date().getFullYear().toString()); // Roughly mocking 'today'
    
    calendarDays.push(
      <div 
        key={`day-${i}`} 
        className={cn(
          "min-h-[100px] border-b border-r border-slate-100 p-2 transition-colors cursor-pointer hover:bg-slate-50",
          isToday ? "bg-primary-50/30" : "bg-white",
          selectedDate === i ? "ring-2 ring-inset ring-primary-500" : ""
        )}
        onClick={() => setSelectedDate(i)}
      >
        <div className="flex justify-between items-start mb-1">
          <span className={cn(
            "text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full",
            isToday ? "bg-primary-600 text-white" : "text-slate-700"
          )}>
            {i}
          </span>
          {dayEvents.length > 0 && <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">{dayEvents.length}</span>}
        </div>
        <div className="space-y-1 mt-2">
          {dayEvents.map(event => (
            <div 
              key={event.id} 
              className={cn(
                "text-[10px] font-bold px-1.5 py-1 rounded border truncate flex items-center",
                getEventStyle(event.type)
              )}
              title={event.title}
            >
              {getEventIcon(event.type)}
              <span className="truncate">{event.title}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const selectedDayEvents = selectedDate ? EVENTS.filter(e => e.date === selectedDate) : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Project Calendar</h1>
          <p className="text-slate-500">Track milestones, sprints, and team availability</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            Today
          </Button>
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
            <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-4 font-bold text-slate-700 w-32 text-center">{CURRENT_MONTH}</span>
            <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="border-none shadow-sm overflow-hidden p-0 bg-white">
            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-3 text-center text-xs font-black text-slate-500 uppercase tracking-widest border-r border-slate-200 last:border-r-0">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 border-l border-t border-slate-100">
              {calendarDays}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm p-5">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-primary-600" />
              {selectedDate ? `${CURRENT_MONTH.split(' ')[0]} ${selectedDate}` : 'Upcoming Events'}
            </h3>
            
            <div className="space-y-4">
              {(selectedDate ? selectedDayEvents : EVENTS.slice(0, 5)).length === 0 ? (
                <p className="text-sm text-slate-500 italic">No events scheduled.</p>
              ) : (
                (selectedDate ? selectedDayEvents : EVENTS.sort((a,b)=>a.date-b.date).slice(0, 6)).map(event => (
                  <div key={event.id} className="flex items-start gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border mt-0.5",
                      getEventStyle(event.type)
                    )}>
                      {getEventIcon(event.type)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 leading-tight">{event.title}</p>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <span className="font-semibold text-slate-700">{event.date} {CURRENT_MONTH.split(' ')[0]}</span> • {event.type}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {!selectedDate && (
              <Button variant="ghost" className="w-full mt-4 text-primary-600 text-xs hover:bg-primary-50">
                View All Events
              </Button>
            )}
          </Card>

          <Card className="border-none shadow-sm p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
            <h3 className="text-sm font-bold text-white/80 uppercase tracking-widest mb-4">Legend</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { type: 'Sprint Start', label: 'Sprint Start' },
                { type: 'Sprint End', label: 'Sprint End' },
                { type: 'Release', label: 'Release' },
                { type: 'Leave', label: 'Leave' },
                { type: 'Holiday', label: 'Holiday' },
                { type: 'Milestone', label: 'Milestone' },
                { type: 'Meeting', label: 'Meeting' }
              ].map(item => (
                <div key={item.type} className="flex items-center gap-2">
                  <div className={cn("w-3 h-3 rounded-full border", getEventStyle(item.type as any))} />
                  <span className="text-xs text-slate-300 font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
