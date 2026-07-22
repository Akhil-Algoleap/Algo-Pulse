import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  LogOut,
  Menu,
  Laptop,
  Calendar,
  Clock,
  TrendingUp,
  Bell,
  FileText,
  CheckSquare,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Radio,
  Grid,
  ClipboardList,
  Banknote,
  Info,
  Layers,
  GitBranch,
  Settings
} from 'lucide-react';
import { cn, Button } from './UI';
import { useAuth } from '../contexts/AuthContext';

export const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [expandedMenu, setExpandedMenu] = React.useState<string | null>(null);
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const getNavItems = () => {
    const role = profile?.role || 'Employee';

    if (role === 'Admin') {
      return [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/employees', icon: Users, label: 'Employees' },
        { to: '/assets', icon: Laptop, label: 'Assets' },
        { to: '/leave', icon: Calendar, label: 'Leaves' },
        { to: '/attendance', icon: Clock, label: 'Attendance' },
        { to: '/performance', icon: TrendingUp, label: 'Performance' },
        { to: '/documents', icon: FileText, label: 'Documents' },
        { to: '/settings', icon: Bell, label: 'Settings' },
      ];
    }
    
    if (role === 'Manager') {
      return [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/employees', icon: Users, label: 'My Team' },
        { to: '/attendance', icon: Clock, label: 'Attendance' },
        { to: '/leave', icon: Calendar, label: 'Leave Requests' },
        { to: '/projects', icon: Briefcase, label: 'Projects' },
        { to: '/performance', icon: TrendingUp, label: 'Performance Reviews' },
        { to: '/approvals', icon: CheckSquare, label: 'Approvals' },
        { to: '/documents', icon: FileText, label: 'Documents' },
        { to: '/reports', icon: FileText, label: 'Reports' },
        { to: '/settings', icon: Bell, label: 'Settings' },
      ];
    }

    // Employee
    return [
      { to: '/', icon: LayoutDashboard, label: 'Home' },
      { to: '/engage', icon: Radio, label: 'Engage' },
      { 
        icon: Grid, 
        label: 'My Worklife',
        subItems: [
          { to: '/my-worklife/kudos', label: 'Kudos' },
          { to: '/my-worklife/feedback', label: 'Feedback' }
        ]
      },
      { 
        icon: ClipboardList, 
        label: 'To do',
        subItems: [
          { to: '/todo', label: 'Tasks' }
        ]
      },
      { 
        icon: Banknote, 
        label: 'Salary',
        subItems: [
          { to: '/salary', label: 'Payslips' }
        ]
      },
      { 
        icon: Calendar, 
        label: 'Leave',
        subItems: [
          { to: '/leave', label: 'Leave Apply' }
        ]
      },
      { 
        icon: CheckSquare, 
        label: 'Attendance',
        subItems: [
          { to: '/attendance', label: 'Attendance Info' }
        ]
      },
      { to: '/documents', icon: FileText, label: 'Document Center' },
      { to: '/helpdesk', icon: Info, label: 'Helpdesk' },
      { to: '/request-hub', icon: Layers, label: 'Request Hub' },
      { to: '/workflow-delegates', icon: GitBranch, label: 'Workflow Delegates' },
    ];
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 lg:relative lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-10">
                <img 
                  src="https://media.licdn.com/dms/image/D560BAQH7VvFpZ9eEUA/company-logo_200_200/0/1705404558552?e=2147483647&v=beta&t=Z_K7B4pS6uL2N_Vj-Cj8T-hE_0U8xR9WzZ9m_z-vXFk" 
                  alt="Algoleap Logo" 
                  className="h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
          </div>

          <div className="px-6 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.employee_name || 'User'}`} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-[15px] text-slate-800">Hi <b>{profile?.employee_name?.split(' ')[0] || 'User'}</b></p>
                <button className="text-xs text-blue-500 hover:underline">View My Info</button>
              </div>
            </div>
            <button className="text-slate-400 hover:text-slate-600"><Settings className="w-5 h-5"/></button>
          </div>

          <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-4">
            {navItems.map((item, index) => {
              if (item.subItems) {
                const isExpanded = expandedMenu === item.label;
                return (
                  <div key={index} className="flex flex-col">
                    <button
                      onClick={() => setExpandedMenu(isExpanded ? null : item.label)}
                      className={cn(
                        "flex items-center justify-between px-4 py-3 rounded-xl text-[14px] transition-colors",
                        isExpanded ? "text-blue-600" : "text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={cn("w-5 h-5", isExpanded ? "text-blue-600" : "text-slate-400")} strokeWidth={1.5} />
                        {item.label}
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>
                    
                    {isExpanded && (
                      <div className="mt-1 ml-6 pl-4 border-l border-slate-200 flex flex-col gap-1">
                        {item.subItems.map((sub, subIdx) => (
                          <NavLink
                            key={subIdx}
                            to={sub.to}
                            onClick={() => setIsSidebarOpen(false)}
                            className={({ isActive }) => cn(
                              "px-3 py-2 text-sm rounded-lg transition-colors",
                              isActive ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                            )}
                          >
                            {sub.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.to}
                  to={item.to || '#'}
                  onClick={() => setIsSidebarOpen(false)}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] transition-colors",
                    isActive 
                      ? "text-blue-600 font-medium bg-blue-50/50" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                  )}
                >
                  <item.icon className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-100">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 shrink-0 sticky top-0 z-30">
          <button 
            className="lg:hidden p-2 -ml-2 text-slate-600"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1 flex justify-end items-center gap-3">
            <Button variant="ghost" size="sm" className="relative p-2 rounded-full text-slate-400 hover:text-primary-600">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </Button>
            
            <div className="flex items-center gap-3 pl-3 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900">{profile?.employee_name || 'User'}</p>
                <p className="text-[10px] uppercase tracking-wider font-bold text-primary-600">{profile?.role || 'Employee'}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 p-0.5 shadow-sm">
                <div className="w-full h-full rounded-[10px] bg-white flex items-center justify-center text-primary-700 font-bold overflow-hidden">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.employee_name || 'User'}`}
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="ml-2 text-slate-400 hover:text-red-600 hover:bg-red-50 p-2"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
