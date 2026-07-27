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
  Plane,
  ShoppingCart,
  Banknote,
  Info,
  Layers,
  GitBranch,
  Settings,
  Target,
  UserCircle,
  Building,
  Shield,
  ShieldCheck,
  History,
  BarChart,
  Calculator,
  RefreshCw,
  Percent,
  Gift,
  Receipt,
  CreditCard,
  Plane,
  PieChart,
  Box,
  Key,
  Headphones,
  Database,
  Wrench,
  Search,
  User,
  CheckCircle2,
  Link,
  Download,
  Wallet,
  FileCheck
} from 'lucide-react';
import { cn, Button, Badge } from './UI';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { AppNotification } from '../types';

export const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [expandedMenu, setExpandedMenu] = React.useState<string | null>(null);
  const [isNotifOpen, setIsNotifOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<AppNotification[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (profile) {
      fetchNotifications();
      // Poll every 30s for demo purposes
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [profile]);

  const fetchNotifications = async () => {
    try {
      const { data } = await apiService.getNotifications(profile?.role, profile?.id);
      setNotifications(data || []);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  React.useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }
      // Simple mock fuzzy search across employees (in a real app, this would hit a global search endpoint)
      try {
        const { data: emps } = await apiService.getEmployees();
        const results = emps
          .filter((e: any) => e.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) || e.role.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((e: any) => ({ type: 'Employee', title: e.employee_name, subtitle: e.role, id: e.id, link: `/users/timeline/${e.id}` }));
        setSearchResults(results);
      } catch (e) {
        console.error(e);
      }
    };
    
    const timeoutId = setTimeout(handleSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await apiService.markNotificationAsRead(id);
      fetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

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
        { to: '/recruitment', icon: Search, label: 'Recruitment' },
        { to: '/onboarding', icon: Briefcase, label: 'Onboarding' },
        { to: '/attendance', icon: Clock, label: 'Attendance' },
        { to: '/leave', icon: Calendar, label: 'Leave Management' },
        { to: '/performance', icon: TrendingUp, label: 'Performance' },
        { to: '/payroll', icon: Banknote, label: 'Payroll' },
        { to: '/documents', icon: FileText, label: 'Documents' },
        { to: '/assets', icon: Laptop, label: 'Assets' },
        { to: '/training', icon: Layers, label: 'Training' },
        { to: '/offboarding', icon: LogOut, label: 'Offboarding' },
        { to: '/reports', icon: BarChart, label: 'Reports' },
        { to: '/notifications', icon: Bell, label: 'Notifications' },
        { to: '/settings', icon: Settings, label: 'Settings' },
      ];
    }
    
    if (role === 'Super Admin') {
      return [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { 
          icon: Building, 
          label: 'Organization',
          subItems: [
            { to: '/organization/company', label: 'Company' },
            { to: '/organization/business-units', label: 'Business Units' },
            { to: '/organization/branches', label: 'Branches' },
            { to: '/organization/departments', label: 'Departments' },
            { to: '/organization/designations', label: 'Designations' },
            { to: '/organization/holiday-calendar', label: 'Holiday Calendar' },
          ]
        },
        { to: '/users', icon: Users, label: 'Users' },
        { to: '/roles', icon: Shield, label: 'Roles & Permissions' },
        { to: '/projects', icon: Briefcase, label: 'Projects' },
        { to: '/workflows', icon: GitBranch, label: 'Workflow Engine' },
        { to: '/notifications', icon: Bell, label: 'Notifications' },
        { to: '/security', icon: ShieldCheck, label: 'Security' },
        { to: '/reports', icon: BarChart, label: 'Reports' },
        { to: '/audit-logs', icon: History, label: 'Audit Logs' },
        { to: '/master-data', icon: Database, label: 'Master Data' },
        { to: '/integrations', icon: Link, label: 'Integration Center' },
        { to: '/settings', icon: Settings, label: 'System Settings' },
      ];
    }

    if (role === 'Payroll Manager') {
      return [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/payroll-processing', icon: RefreshCw, label: 'Payroll Processing' },
        { to: '/salary-structure', icon: Calculator, label: 'Salary Structure' },
        { to: '/employee-salary', icon: Wallet, label: 'Employee Salary' },
        { to: '/attendance-leave', icon: Calendar, label: 'Attendance & Leave' },
        { to: '/overtime', icon: Clock, label: 'Overtime' },
        { to: '/bonuses', icon: Gift, label: 'Bonuses & Incentives' },
        { to: '/loans', icon: CreditCard, label: 'Loans & Advances' },
        { to: '/reimbursements', icon: Receipt, label: 'Reimbursements' },
        { to: '/tax', icon: Percent, label: 'Tax Management' },
        { to: '/compliance', icon: FileCheck, label: 'Statutory Compliance' },
        { to: '/payslips', icon: FileText, label: 'Payslips' },
        { to: '/reports', icon: BarChart, label: 'Reports' },
        { to: '/notifications', icon: Bell, label: 'Notifications' },
        { to: '/settings', icon: Settings, label: 'Settings' }
      ];
    }

    if (role === 'Finance') {
      return [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/payroll-approval', icon: CheckSquare, label: 'Payroll Approvals' },
        { to: '/expense-management', icon: Receipt, label: 'Expense Management' },
        { to: '/travel-claims', icon: Plane, label: 'Travel Claims' },
        { to: '/purchase-requests', icon: FileText, label: 'Purchase Requests' },
        { to: '/vendor-payments', icon: CreditCard, label: 'Vendor Payments' },
        { to: '/budget-management', icon: PieChart, label: 'Budget Management' },
        { to: '/reimbursements', icon: Banknote, label: 'Reimbursements' },
        { to: '/invoices', icon: FileText, label: 'Invoices' },
        { to: '/finance-reports', icon: BarChart, label: 'Financial Reports' },
        { to: '/audit', icon: History, label: 'Audit' },
        { to: '/notifications', icon: Bell, label: 'Notifications' },
        { to: '/settings', icon: Settings, label: 'Settings' },
      ];
    }

    if (role === 'IT Admin') {
      return [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/assets', icon: Laptop, label: 'Assets' },
        { to: '/employee-accounts', icon: UserCircle, label: 'Employee Accounts' },
        { to: '/software', icon: Box, label: 'Software' },
        { to: '/access-requests', icon: Key, label: 'Access Requests' },
        { to: '/asset-receipts', icon: ShoppingCart, label: 'Asset Receipts' },
        { to: '/service-desk', icon: Headphones, label: 'Service Desk' },
        { to: '/repairs', icon: Wrench, label: 'Repairs' },
        { to: '/reports', icon: BarChart, label: 'Reports' },
      ];
    }

    if (role === 'Manager') {
      return [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/employees', icon: Users, label: 'My Team' },
        { to: '/attendance', icon: Clock, label: 'Attendance' },
        { to: '/leave', icon: Calendar, label: 'Leaves & Regularization' },
        { to: '/projects', icon: Briefcase, label: 'Projects' },
        { to: '/performance', icon: TrendingUp, label: 'Performance Reviews' },
        { to: '/approvals', icon: CheckSquare, label: 'Approvals' },
        { to: '/documents', icon: FileText, label: 'Documents' },
        { to: '/reports', icon: FileText, label: 'Reports' },
        { to: '/settings', icon: Bell, label: 'Settings' },
      ];
    }

    if (role === 'Reporting Manager') {
      return [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/employees', icon: Users, label: 'My Team' },
        { to: '/leave', icon: Calendar, label: 'Leaves & Regularization' },
        { to: '/attendance', icon: Clock, label: 'Attendance' },
        { to: '/employee-profiles', icon: UserCircle, label: 'Employee Profiles' },
        { to: '/performance', icon: TrendingUp, label: 'Performance' },
        { to: '/goals', icon: Target, label: 'Goals & KPIs' },
        { to: '/documents', icon: FileText, label: 'Documents' },
        { to: '/reports', icon: FileText, label: 'Reports' },
        { to: '/notifications', icon: Bell, label: 'Notifications' },
        { to: '/settings', icon: Settings, label: 'Settings' },
      ];
    }

    if (role === 'Project Manager') {
      return [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/projects', icon: Briefcase, label: 'Projects' },
        { to: '/employees', icon: Users, label: 'My Team' },
        { to: '/team-travel', label: 'Team Travel', icon: Plane },
        { to: '/team-purchases', label: 'Team Purchases', icon: ShoppingCart },
        { to: '/team-reimbursements', label: 'Team Reimbursements', icon: Banknote },
        { to: '/sprint-board', icon: Grid, label: 'Sprint Board' },
        { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
        { to: '/resource-allocation', icon: PieChart, label: 'Resource Allocation' },
        { to: '/timesheets', icon: Clock, label: 'Timesheets' },
        { to: '/project-calendar', icon: Calendar, label: 'Project Calendar' },
        { to: '/documents', icon: FileText, label: 'Documents' },
        { to: '/project-risks', icon: Shield, label: 'Project Risks' },
        { to: '/reports', icon: BarChart, label: 'Reports' },
        { to: '/notifications', icon: Bell, label: 'Notifications' },
        { to: '/settings', icon: Settings, label: 'Settings' },
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
          { to: '/salary', label: 'Payslips' },
          { to: '/my-expenses', label: 'Expense Claims' },
          { to: '/my-travel', label: 'Travel Claims' }
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
      { 
        icon: Layers, 
        label: 'Request Hub',
        subItems: [
          { to: '/request-hub', label: 'Hub Overview' },
          { to: '/my-purchases', label: 'Purchase Requests' },
          { to: '/my-reimbursements', label: 'Reimbursements' }
        ]
      },
      { to: '/workflow-delegates', icon: GitBranch, label: 'Workflow Delegates' },
    ];
  };

  type NavItemType = { to?: string; icon: any; label: string; subItems?: { to: string; label: string }[] };
  const navItems: NavItemType[] = getNavItems();

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

          <div className="flex-1 max-w-xl px-4 relative hidden md:block">
            <div className="relative group">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search employees, assets, or tasks..." 
                className="w-full bg-slate-100/50 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-primary-200 focus:ring-4 focus:ring-primary-500/10 rounded-xl pl-10 pr-4 py-2 text-sm transition-all outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
              />
            </div>
            
            {isSearchOpen && searchQuery.length >= 2 && (
              <div className="absolute top-12 left-4 right-4 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
                <div className="max-h-80 overflow-y-auto p-2">
                  {searchResults.length === 0 ? (
                    <div className="p-4 text-center text-slate-500 text-sm">No results found</div>
                  ) : (
                    searchResults.map((result, i) => (
                      <div 
                        key={i} 
                        className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                        onClick={() => navigate(result.link)}
                      >
                        <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                          {result.type === 'Employee' ? <User className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{result.title}</p>
                          <p className="text-xs text-slate-500">{result.type} • {result.subtitle}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end items-center gap-3 ml-auto">
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative p-2 rounded-full text-slate-400 hover:text-primary-600"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
            >
              <Bell className="w-5 h-5" />
              {notifications.filter(n => !n.is_read).length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              )}
            </Button>
            
            {isNotifOpen && (
              <div className="absolute top-12 right-12 w-80 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-900">Notifications</h3>
                  <Badge variant="default">{notifications.filter(n => !n.is_read).length} New</Badge>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                      <p>No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div 
                        key={notif.id} 
                        className={cn(
                          "p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer",
                          !notif.is_read ? "bg-blue-50/50" : ""
                        )}
                        onClick={() => handleMarkAsRead(notif.id)}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <p className={cn("text-sm", !notif.is_read ? "font-bold text-slate-900" : "font-medium text-slate-700")}>
                            {notif.title}
                          </p>
                          {!notif.is_read && <span className="w-2 h-2 rounded-full bg-blue-500 mt-1" />}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2">{notif.message}</p>
                        <p className="text-[10px] text-slate-400 mt-2">
                          {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            
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
