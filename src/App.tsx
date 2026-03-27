import React, { useState, useEffect, Suspense, useRef, useCallback } from 'react';
import './App.css';

// Mentor Management System Imports
import { onAuthStateChange, type AuthState, SUPER_ADMIN_EMAIL, signOut, supabase } from './lib/supabase-auth';
import { PilotProfilePage } from './pages/PilotProfilePage';
import FoundationalProgramPage from './pages/FoundationalProgramPage';
import { WingMentorHome, type MainView } from './pages/WingMentorHome';
import { RecognitionAchievementPage } from './pages/RecognitionAchievementPage';
import { LoginPage } from './pages/LoginPage';

// Declare the remote module for TypeScript
// @ts-ignore
const RemoteSegment = React.lazy(() => import('remote_segment/Segment'));

export const Icons = {
  Logo: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2L2 22l10-4 10 4L12 2z" />
    </svg>
  ),
  ArrowRight: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  Search: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Activity: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  Briefcase: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  ArrowLeft: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  ),
  BookOpen: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  Book: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  Map: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  ),
  Monitor: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  Cpu: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="14" x2="23" y2="14" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="14" x2="4" y2="14" />
    </svg>
  ),
  LogOut: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Lock: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  ),
  Unlock: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <line x1="17" y1="7" x2="23" y2="7" />
    </svg>
  ),
  User: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  CheckCircle: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  Circle: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
    </svg>
  ),
  AlertCircle: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  Check: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  FileText: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  ExternalLink: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  ),
  Play: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  ),
  ChevronLeft: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  ChevronRight: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  Layout: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  ),
  Home: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 11l9-9 9 9" />
      <path d="M5 12v9h14v-9" />
    </svg>
  ),
  Shield: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Database: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  LayoutGrid: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  Award: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  ),
  Navigation: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  ),
  Layers: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  TrendingUp: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  Users: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  UserPlus: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" y1="8" x2="19" y2="14" />
      <line x1="16" y1="11" x2="22" y2="11" />
    </svg>
  ),
  Loader: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
    </svg>
  ),
  Download: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  Globe: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  MessageCircle: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
  MessageSquare: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Phone: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 16.92V21a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2 3.18 2 2 0 0 1 4 1h4.09a2 2 0 0 1 2 1.72c.12.81.37 1.6.72 2.34a2 2 0 0 1-.45 2.11L9.1 8.91a16 16 0 0 0 6 6l1.74-1.26a2 2 0 0 1 2.11-.45c.74.35 1.53.6 2.34.72A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Mail: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  AlertTriangle: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  Settings: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.78 1.78 0 0 0 .37 2l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.78 1.78 0 0 0-2-.37 1.78 1.78 0 0 0-1 1.62V22a2 2 0 1 1-4 0v-.09A1.78 1.78 0 0 0 8 19.91a1.78 1.78 0 0 0-2 .37l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.78 1.78 0 0 0 .37-2 1.78 1.78 0 0 0-1.62-1H2a2 2 0 1 1 0-4h.09A1.78 1.78 0 0 0 4.09 8a1.78 1.78 0 0 0-.37-2l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.78 1.78 0 0 0 2 .37H9a1.78 1.78 0 0 0 1-1.62V2a2 2 0 1 1 4 0v.09a1.78 1.78 0 0 0 1 1.62 1.78 1.78 0 0 0 2-.37l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.78 1.78 0 0 0-.37 2V9a1.78 1.78 0 0 0 1.62 1H22a2 2 0 1 1 0 4h-.09a1.78 1.78 0 0 0-1.62 1z" />
    </svg>
  ),
  Zap: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Clock: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  ClipboardList: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <line x1="12" y1="12" x2="12" y2="12.01" />
      <line x1="16" y1="12" x2="16" y2="12.01" />
      <line x1="8" y1="12" x2="8" y2="12.01" />
      <line x1="12" y1="16" x2="12" y2="16.01" />
      <line x1="16" y1="16" x2="16" y2="16.01" />
      <line x1="8" y1="16" x2="8" y2="16.01" />
    </svg>
  ),
  Plus: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
};


type CardItem = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Icons;
  desktopOnly?: boolean;
  linkText: string;
  badge?: string;
  image?: string;
  onClickAction?: () => void;
};

const programs: CardItem[] = [
  {
    id: 'prog-1',
    title: 'Foundational Program',
    description: 'Sign up to begin your 50-hour verified mentorship track. Refine your CRM and procedural skills through high-fidelity simulator scenarios. Status: Registration Open.',
    icon: 'Book',
    linkText: 'Access Program',
    image: 'https://lh3.googleusercontent.com/d/1K2CccSObEUsvy6unD8iqWjSjn-Zcw08g',
    onClickAction: undefined // Will be attached dynamically inside App component
  },
  {
    id: 'prog-transition',
    title: 'Transition Program',
    description: 'Bridge the gap to the flight deck. Complete advanced multi-crew simulator scenarios to finalize your industry-ready portfolio. Status: Pending Foundational Verification.',
    icon: 'Book',
    linkText: 'Access Program',
    image: 'https://lh3.googleusercontent.com/d/1wPEIiMRj4fW34_NIQKRnzCf8KNhdD1TC'
  }
];

const loadingPhaseOrder = ['fetch', 'sync', 'deploy'] as const;
type LoadingPhase = typeof loadingPhaseOrder[number];

const loadingPhaseDetails: Record<LoadingPhase, { title: string; subtitle: string }> = {
  fetch: {
    title: 'Fetching Program Data',
    subtitle: 'Verifying enrollment status and simulator modules'
  },
  sync: {
    title: 'Pilot Recognition Sync',
    subtitle: 'Syncing recognition ledger and advocacy records'
  },
  deploy: {
    title: 'Connecting to Pilot Pathways Network',
    subtitle: 'Loading mentorship applications and dashboards'
  }
};

const accessibleViewMap: Record<string, ViewName> = {
  foundational: 'foundational',
  'pilot-profile': 'pilot-profile',
  mentorship: 'mentorship',
  'atlas-cv': 'applications',
  w1000: 'applications'
};

const LoadingScreen: React.FC<{
  phase: LoadingPhase;
  error?: string | null;
  onRetry?: () => void;
  onSkip?: () => void;
  canSkip?: boolean;
}> = ({ phase, error, onRetry, onSkip, canSkip = false }) => {
  const phaseIndex = loadingPhaseOrder.indexOf(phase);
  const progress = ((phaseIndex + 1) / loadingPhaseOrder.length) * 100;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="loading-title"
      aria-describedby="loading-description"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: 'clamp(1rem, 3vw, 3rem)',
        backdropFilter: 'blur(4px)'
      }}
    >
      <div
        style={{
          maxWidth: '960px',
          width: '100%',
          background: 'rgba(255,255,255,0.94)',
          borderRadius: 'clamp(20px, 4vw, 36px)',
          padding: 'clamp(2rem, 5vw, 4rem) clamp(2rem, 5vw, 4.5rem) clamp(1.5rem, 4vw, 3rem)',
          boxShadow: '0 60px 150px rgba(15,23,42,0.18)',
          border: '1px solid rgba(226, 232, 240, 0.7)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(1rem, 2vw, 2rem)',
          animation: 'fadeIn 0.3s ease-out'
        }}
      >
        <header style={{ textAlign: 'center' }}>
          <img
            src="/logo.png"
            alt="WingMentor Logo"
            style={{
              width: 'clamp(200px, 40vw, 360px)',
              margin: '0 auto clamp(1rem, 2vw, 1.5rem)',
              animation: 'pulse 2s ease-in-out infinite'
            }}
          />
          <div
            style={{
              letterSpacing: '0.5em',
              fontSize: 'clamp(0.75rem, 1.5vw, 1rem)',
              fontWeight: 700,
              color: '#2563eb',
              marginBottom: 'clamp(0.5rem, 1vw, 0.9rem)',
              textTransform: 'uppercase'
            }}
          >
            WingMentor Portal
          </div>
          <h1
            id="loading-title"
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: 'clamp(1.8rem, 5vw, 3.2rem)',
              color: '#0f172a',
              letterSpacing: '-0.03em',
              margin: 0
            }}
          >
            Bridging the Pilot Gap.
          </h1>
        </header>

        <main
          id="loading-description"
          style={{ textAlign: 'left' }}
        >
          <div
            style={{
              marginBottom: 'clamp(0.25rem, 0.5vw, 0.35rem)',
              color: '#0f172a',
              fontWeight: 700,
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              transition: 'opacity 0.3s ease'
            }}
          >
            {loadingPhaseDetails[phase].title}
          </div>
          <div
            style={{
              fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
              color: '#475569',
              marginBottom: 'clamp(0.75rem, 1.5vw, 1rem)',
              transition: 'opacity 0.3s ease'
            }}
          >
            {loadingPhaseDetails[phase].subtitle}
          </div>
          
          {/* Progress bar with ARIA */}
          <div
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Loading: ${loadingPhaseDetails[phase].title}`}
            style={{
              height: 'clamp(12px, 2vw, 16px)',
              background: '#e2e8f0',
              borderRadius: '999px',
              overflow: 'hidden',
              boxShadow: 'inset 0 1px 4px rgba(15,23,42,0.1)',
              marginBottom: 'clamp(1rem, 2vw, 1.25rem)'
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #2563eb, #0f172a)',
                transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 0 10px rgba(37, 99, 235, 0.5)'
              }}
            />
          </div>

          {/* Phase indicators with enhanced styling */}
          <nav
            aria-label="Loading phases"
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 'clamp(0.75rem, 1.5vw, 1.25rem)',
              flexWrap: 'wrap',
              fontSize: 'clamp(0.85rem, 1.5vw, 1rem)'
            }}
          >
            {loadingPhaseOrder.map((phaseKey, idx) => {
              const status = idx < phaseIndex ? 'complete' : idx === phaseIndex ? 'active' : 'pending';
              const statusColor = status === 'active' ? '#0f172a' : status === 'complete' ? '#2563eb' : '#94a3b8';
              const statusBg = status === 'active' ? 'rgba(37, 99, 235, 0.1)' : 'transparent';
              return (
                <div
                  key={phaseKey}
                  aria-current={status === 'active' ? 'step' : undefined}
                  style={{
                    color: statusColor,
                    fontWeight: status === 'active' ? 700 : 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    background: statusBg,
                    transition: 'all 0.3s ease',
                    transform: status === 'active' ? 'scale(1.05)' : 'scale(1)'
                  }}
                >
                  {status === 'complete' && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                  <span>{loadingPhaseDetails[phaseKey].title}</span>
                  {idx < loadingPhaseOrder.length - 1 && (
                    <span
                      aria-hidden="true"
                      style={{
                        width: 'clamp(20px, 3vw, 30px)',
                        height: '2px',
                        background: status === 'complete' ? '#2563eb' : 'rgba(148,163,184,0.4)',
                        display: 'inline-block',
                        transition: 'background 0.3s ease'
                      }}
                    />
                  )}
                </div>
              );
            })}
          </nav>

          {/* Error state */}
          {error && (
            <div
              role="alert"
              style={{
                marginTop: 'clamp(1rem, 2vw, 1.5rem)',
                padding: 'clamp(1rem, 2vw, 1.5rem)',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '12px',
                textAlign: 'center'
              }}
            >
              <p style={{ color: '#dc2626', marginBottom: '1rem', fontWeight: 600 }}>
                {error}
              </p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  style={{
                    background: '#dc2626',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    transition: 'background 0.2s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#b91c1c'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#dc2626'}
                >
                  Retry
                </button>
              )}
            </div>
          )}

          {/* Skip option */}
          {canSkip && onSkip && !error && (
            <div style={{ textAlign: 'center', marginTop: 'clamp(1rem, 2vw, 1.5rem)' }}>
              <button
                onClick={onSkip}
                style={{
                  background: 'transparent',
                  color: '#64748b',
                  border: '1px solid #e2e8f0',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#f1f5f9';
                  e.currentTarget.style.color = '#0f172a';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#64748b';
                }}
              >
                Skip to Dashboard
              </button>
            </div>
          )}
        </main>

        <footer style={{ textAlign: 'center', marginTop: 'auto' }}>
          <p
            style={{
              textTransform: 'uppercase',
              fontSize: 'clamp(0.75rem, 1.5vw, 1rem)',
              letterSpacing: '0.34em',
              color: '#94a3b8',
              margin: 'clamp(0.75rem, 1.5vw, 1.1rem) 0 0.35rem'
            }}
          >
            Accredited & Recognized
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 'clamp(1rem, 2vw, 1.5rem)',
              flexWrap: 'wrap',
              color: '#0f172a',
              fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)',
              fontWeight: 600
            }}
          >
            <span>Programs</span>
            <span style={{ color: '#cbd5f5' }}>|</span>
            <span>Pilot Recognition</span>
            <span style={{ color: '#cbd5f5' }}>|</span>
            <span>Pathways</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

const pathways: CardItem[] = [
  {
    id: 'path-1',
    title: 'Emirates ATPL Pathway',
    description: 'A structured roadmap designed to take you from a novice to a certified ATPL pilot.',
    icon: 'Map',
    linkText: 'View Pathway',
    image: 'https://connectedaviationtoday.com/wp-content/uploads/2020/12/shutterstock_1698112222.jpg'
  },
  {
    id: 'path-2',
    title: 'Commercial Pilot License',
    description: 'Accelerated track for aspiring commercial pilots looking to join major airlines.',
    icon: 'Map',
    linkText: 'View Pathway',
    image: 'https://images.unsplash.com/photo-1558509355-6b5d9bcbb4eb?q=80&w=600&auto=format&fit=crop'
  }
];

const applications: CardItem[] = [
  {
    id: 'app-1',
    title: 'Pilot Profile',
    description: 'Access your learning dashboard, track progress, and manage your pilot training journey.',
    icon: 'Monitor',
    linkText: 'Download Module',
    image: 'https://www.flightdeckfriend.com/wp-content/uploads/2019/02/Captain-Paperwork-Medium.jpg',
    badge: 'Dynamic'
  }
];

interface CardProps {
  item: CardItem;
}

const Card: React.FC<CardProps> = ({ item }) => {
  return (
    <div className="horizontal-card" data-desktop-only={item.desktopOnly ? "true" : "false"} style={{ cursor: 'pointer', padding: '1rem 2rem' }} onClick={item.onClickAction || (() => alert(`Opening ${item.title}`))}>
      <div className="horizontal-card-content-wrapper">
        <div style={{ maxWidth: '70%', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '1.5rem', color: '#000000', fontWeight: 'bold' }}>•</div>
          <div className="horizontal-card-content" style={{ padding: '2rem 0', textAlign: 'left', maxWidth: '100%' }}>
            <h3 className="horizontal-card-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.title}</h3>

            {item.desktopOnly && (
              <div className="desktop-only-warning" style={{ display: 'block', textAlign: 'left', marginBottom: '0.5rem', padding: '0.25rem 0.5rem' }}>
                App not available on mobile
              </div>
            )}

            <p className="horizontal-card-desc" style={{ maxWidth: '100%', marginBottom: 0, color: '#64748b', fontSize: '1rem', lineHeight: 1.6 }}>
              {item.description}
            </p>
          </div>
        </div>

        <div className="hub-card-arrow" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Icons.ArrowRight style={{ width: 24, height: 24 }} />
        </div>
      </div>
      {item.image && (
        <img src={item.image} alt={item.title} className="hub-card-bg-image" />
      )}
      {item.badge && (
        <span className={`badge ${item.badge === 'New' ? 'badge-new' : 'badge-pro'}`} style={{ top: '1.5rem', right: '1.5rem' }}>
          {item.badge}
        </span>
      )}
    </div>
  );
};

import { CloudBackground } from './components/CloudBackground';
import { ATPLPathwayPage } from './pages/ATPLPathwayPage';
import { EmergingAirTaxiPage } from './pages/EmergingAirTaxiPage';
import { PrivateSectorPage } from './pages/PrivateSectorPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { EnrollmentOnboardingPage } from './pages/EnrollmentOnboardingPage';
import { PostEnrollmentSlideshow } from './pages/PostEnrollmentSlideshow';
import { AIScreeningPage } from './pages/AIScreeningPage';
import { TermsAndConditionsPage } from './pages/TermsAndConditionsPage';
import { MentorshipSupervisionPage } from './pages/MentorshipSupervisionPage';
import PilotGapModulePage from './pages/PilotGapModulePage';
import PilotGapModule2 from './pages/PilotGapModule2';
import MentorshipProtocolsModulePage from './pages/MentorshipProtocolsModulePage';
import PeerAdvocacyModulePage from './pages/PeerAdvocacyModulePage';
import PilotJobDatabasePage from './pages/PilotJobDatabasePage';


function App() {
  const [isMobile, setIsMobile] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [loginBlurred, setLoginBlurred] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState<LoadingPhase>('fetch');
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [canSkipLoading, setCanSkipLoading] = useState(false);
  const [authState, setAuthState] = useState<AuthState & { preloadedData?: { portfolio?: any; achievements?: any; enrollment?: any; pathways?: any; programs?: any } }>({
    user: null,
    userProfile: null,
    loading: true,
    currentSystem: 'pms',
    preloadedData: {}
  });
  const [isInitializing, setIsInitializing] = useState(true);
  const loadingTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const hasShownInitialLoading = useRef(false);
  
  type ViewName =
    | 'login'
    | 'hub'
    | 'dashboard'
    | 'programs'
    | 'pathways'
    | 'applications'
    | 'foundational'
    | 'atpl'
    | 'airtaxi'
    | 'privatesector'
    | 'foundational-onboarding'
    | 'post-enrollment-slideshow'
    | 'ai-screening'
    | 'remote-segment'
    | 'terms-conditions'
    | 'mentorship'
    | 'reset-password'
    | 'module-01'
    | 'module-02'
    | 'module-03'
    | 'pilot-profile'
    | 'recognition'
    | 'verification'
    | 'job-database';

  const VIEW_WHITELIST: ViewName[] = [
    'login','hub','dashboard','programs','pathways','applications','foundational','atpl','airtaxi','privatesector',
    'foundational-onboarding','post-enrollment-slideshow','ai-screening','remote-segment','terms-conditions','mentorship',
    'reset-password','module-01','module-02','module-03','pilot-profile','recognition','verification','job-database'
  ];

  const [currentView, setCurrentView] = useState<ViewName>('login');
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [lastLoginEmail, setLastLoginEmail] = useState<string | null>(null);
  const [pendingHomeView, setPendingHomeView] = useState<MainView | null>(null);

  const handleViewChange = (view: ViewName) => {
    console.log('🔀 View change requested:', view);
    if (!VIEW_WHITELIST.includes(view)) {
      console.warn('⚠️ Attempted to navigate to unknown view:', view);
      return;
    }
    setCurrentView(view);
  };

  const clearLoadingSequence = () => {
    loadingTimers.current.forEach((timerId) => clearTimeout(timerId));
    loadingTimers.current = [];
  };

  const isSuperAdmin = (authState.userProfile?.role === 'super_admin') || (authState.user?.email === SUPER_ADMIN_EMAIL) || (lastLoginEmail === SUPER_ADMIN_EMAIL);

  const handleModuleComplete = (moduleId: string) => {
    setCompletedModules(prev => prev.includes(moduleId) ? prev : [...prev, moduleId]);
  };
  
  const handleSelectDownload = () => {
    setCurrentView('remote-segment');
  };

  const handleSwitchSystem = async (system: 'pms' | 'wms' | 'super_admin') => {
    if (authState.userProfile) {
      setAuthState(prev => ({ ...prev, currentSystem: system }));
      // In production, save this to Firestore
      if (authState.user) {
        // await switchSystem(authState.user.uid, system);
      }
    }
  };

  useEffect(() => {
    if (pendingHomeView && currentView === 'hub') {
      // Clear pending view after hub renders
      const timer = requestAnimationFrame(() => setPendingHomeView(null));
      return () => cancelAnimationFrame(timer);
    }
  }, [pendingHomeView, currentView]);

  useEffect(() => {
    console.log('🔐 Auth effect starting...');
    
    // Set up auth state listener
    const { data: { subscription } } = onAuthStateChange((nextState) => {
      console.log('🔐 Auth state changed:', { user: !!nextState.user, loading: nextState.loading });
      setAuthState(nextState);
      if (nextState.user?.email) {
        setLastLoginEmail(nextState.user.email);
      }

      const isResetPasswordPage = window.location.pathname.includes('/reset-password') || 
                                  window.location.hash.includes('type=recovery');

      if (isResetPasswordPage) {
        setCurrentView('reset-password');
        setIsInitializing(false);
        return;
      }

      // Auth check complete
      setIsInitializing(false);

      // If user is logged in and loading hasn't started, trigger it
      if (nextState.user && !hasShownInitialLoading.current && !showLoading) {
        console.log('🚀 Starting loading sequence for logged-in user');
        startLoadingSequence('pilot-profile');
      } else if (!nextState.user && !showLoading) {
        // No user, go to login
        console.log('👤 No user, going to login');
        setCurrentView('login');
      }
    });

    // Also check for existing session immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔍 Initial session check:', { hasSession: !!session });
      if (!session) {
        console.log('👤 No session found, forcing login view');
        setIsInitializing(false);
        setCurrentView('login');
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  // Failsafe: ensure initialization always completes
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isInitializing) {
        console.warn('⚠️ Auth check timeout - forcing initialization complete');
        setIsInitializing(false);
        if (!authState.user) {
          setCurrentView('login');
        }
      }
    }, 5000); // 5 second failsafe

    return () => clearTimeout(timeout);
  }, [isInitializing, authState.user]);

  const startLoadingSequence = useCallback(async (pendingView: MainView = 'pilot-profile', userId?: string) => {
    clearLoadingSequence();
    setPendingHomeView(pendingView);
    setLoadingPhase('fetch');
    setLoginBlurred(true);
    setShowLoading(true);
    setLoadingError(null);
    setCanSkipLoading(false);
    hasShownInitialLoading.current = true;

    // Enable skip after 2 seconds minimum
    loadingTimers.current.push(setTimeout(() => {
      setCanSkipLoading(true);
    }, 2000));

    // Use provided userId or fall back to authState
    const effectiveUserId = userId || authState.user?.id;
    if (!effectiveUserId) {
      // No user, just show loading animation then proceed
      loadingTimers.current.push(setTimeout(() => {
        setLoadingPhase('sync');
      }, 1500));

      loadingTimers.current.push(setTimeout(() => {
        setLoadingPhase('deploy');
      }, 3000));

      loadingTimers.current.push(setTimeout(() => {
        setShowLoading(false);
        clearLoadingSequence();
      }, 4200));
      return;
    }

    // Phase 1: Fetch enrollment and program data
    try {
      const { data: enrollmentData } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', effectiveUserId)
        .maybeSingle();
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('enrolled_programs, onboarding_data')
        .eq('id', effectiveUserId)
        .single();

      setAuthState(prev => ({
        ...prev,
        preloadedData: {
          ...prev.preloadedData,
          enrollment: enrollmentData,
          programs: profileData?.enrolled_programs || []
        }
      }));
    } catch (err) {
      console.error('Error fetching enrollment data:', err);
      setLoadingError('Failed to load enrollment data. Please try again.');
    }

    loadingTimers.current.push(setTimeout(() => {
      setLoadingPhase('sync');
    }, 1500));

    // Phase 2: Fetch recognition and achievements data
    loadingTimers.current.push(setTimeout(async () => {
      setLoadingPhase('sync');
      
      try {
        const { data: achievementsData } = await supabase
          .from('achievements')
          .select('*')
          .eq('user_id', effectiveUserId)
          .order('achievement_date', { ascending: false });
        
        setAuthState(prev => ({
          ...prev,
          preloadedData: {
            ...prev.preloadedData,
            achievements: achievementsData || []
          }
        }));
      } catch (err) {
        console.error('Error fetching achievements:', err);
        setLoadingError('Failed to load achievements data. Please try again.');
      }
    }, 1500));

    // Phase 3: Fetch pilot portfolio data
    loadingTimers.current.push(setTimeout(async () => {
      setLoadingPhase('deploy');
      
      try {
        const { data: portfolioData } = await supabase
          .from('pilot_portfolio_data')
          .select('*')
          .eq('user_id', effectiveUserId)
          .maybeSingle();
        
        // Also fetch pathways data
        const { data: pathwaysData } = await supabase
          .from('user_pathways')
          .select('*')
          .eq('user_id', effectiveUserId);

        setAuthState(prev => ({
          ...prev,
          preloadedData: {
            ...prev.preloadedData,
            portfolio: portfolioData,
            pathways: pathwaysData || []
          }
        }));
      } catch (err) {
        console.error('Error fetching portfolio/pathways:', err);
        setLoadingError('Failed to load portfolio data. Please try again.');
      }
    }, 3000));

    loadingTimers.current.push(setTimeout(() => {
      setShowLoading(false);
      clearLoadingSequence();
    }, 4200));
  }, []);

  const handleLogin = (email: string) => {
    setLastLoginEmail(email);
    startLoadingSequence('pilot-profile');
  };

  useEffect(() => {
    if (!showLoading) {
      const timeout = setTimeout(() => setLoginBlurred(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [showLoading]);

  useEffect(() => {
    return () => {
      clearLoadingSequence();
    };
  }, []);

  useEffect(() => {
    const grantedApps = authState.userProfile?.appAccess?.filter(app => app.granted).map(app => app.appId) || [];
    const accessibleViews = grantedApps
      .map(appId => accessibleViewMap[appId])
      .filter((view): view is ViewName => Boolean(view));
    console.log('📍 Active view:', currentView, '| Accessible apps:', grantedApps, '| Accessible views:', accessibleViews);
  }, [currentView, authState.userProfile]);

  useEffect(() => {
    if (authState.user && !hasShownInitialLoading.current && !showLoading) {
      startLoadingSequence('pilot-profile');
    }
  }, [authState.user, showLoading, startLoadingSequence]);

  useEffect(() => {
    if (!showLoading && authState.user && currentView === 'login') {
      setCurrentView('hub');
    }
  }, [showLoading, authState.user, currentView]);

  const handleLogout = async () => {
    try {
      // Clear URL hash to prevent routing issues
      window.location.hash = '';
      // Force sign out and reset auth state
      await signOut();
      // Clear any stored session
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('supabase.auth.refreshToken');
      setCurrentView('login');
      setLoginBlurred(false);
      // Force page reload to clear any lingering state
      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback: force redirect to login
      setCurrentView('login');
      window.location.hash = '';
    }
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle URL routing for password reset
  useEffect(() => {
    const handleRecoveryRouting = () => {
      const pathname = window.location.pathname;
      const hash = window.location.hash;

      // Only route to reset-password if we have actual recovery params
      if ((pathname.includes('/reset-password') || hash.includes('type=recovery')) && 
          (hash.includes('access_token') || hash.includes('refresh_token'))) {
        setCurrentView('reset-password');
      }
    };

    // Check on initial load
    handleRecoveryRouting();

    const handleHashChange = () => handleRecoveryRouting();
    const handlePopState = () => handleRecoveryRouting();

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Hydrate onClickActions
  programs[0].onClickAction = () => {
    console.log('🧭 Programs directory -> Foundational clicked');
    setCurrentView('foundational');
  };
  applications[0].onClickAction = () => setCurrentView('pilot-profile');

  if (pathways.length >= 3) {
    pathways[0].onClickAction = () => setCurrentView('atpl');
    pathways[1].onClickAction = () => setCurrentView('airtaxi');
    pathways[2].onClickAction = () => setCurrentView('privatesector');
  }

  return (
    <>
      <CloudBackground variant={currentView === 'login' || showLoading || isInitializing ? 'dark' : 'light'} />
      {isInitializing ? (
        <div style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            textAlign: 'center',
            color: '#fff',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            <img src="/logo.png" alt="WingMentor" style={{ width: '320px', marginBottom: '2rem' }} />
            <div style={{ fontSize: '1.5rem', fontWeight: 500, letterSpacing: '0.15em' }}>INITIALIZING...</div>
          </div>
        </div>
      ) : showLoading ? (
        <LoadingScreen
          phase={loadingPhase}
          error={loadingError}
          onRetry={() => {
            setLoadingError(null);
            // Restart loading sequence
            setShowLoading(true);
            setLoadingPhase('fetch');
            setCanSkipLoading(false);
            // Trigger data reload
            if (authState.user?.id) {
              startLoadingSequence(authState.user.id);
            }
          }}
          onSkip={() => {
            setShowLoading(false);
            clearLoadingSequence();
          }}
          canSkip={canSkipLoading}
        />
      ) : currentView === 'login' ? (
        <LoginPage onLogin={handleLogin} blurred={loginBlurred} />
      ) : currentView === 'reset-password' ? (
        <ResetPasswordPage />
      ) : currentView === 'hub' ? (
        <WingMentorHome 
          onLogout={handleLogout} 
          userProfile={authState.userProfile}
          onStartFoundationalEnrollment={() => setCurrentView('foundational-onboarding')}
          onViewChange={(view) => handleViewChange(view as ViewName)}
          initialView={pendingHomeView || 'wingmentor-network'}
        />
      ) : currentView === 'foundational' ? (
        <FoundationalProgramPage
          onBack={() => setCurrentView('hub')}
          onLogout={handleLogout}
          onStartEnrollment={() => setCurrentView('foundational-onboarding')}
          onStartSlideshow={() => setCurrentView('post-enrollment-slideshow')}
          onSelectDownload={() => handleSelectDownload()}
          onLaunchMentorship={() => setCurrentView('mentorship')}
          onLaunchModule01={() => setCurrentView('module-01')}
          onLaunchModule02={() => setCurrentView('module-02')}
          onLaunchModule03={() => setCurrentView('module-03')}
          completedModules={completedModules}
          userProfile={authState.userProfile}
        />
      ) : currentView === 'foundational-onboarding' ? (
        <EnrollmentOnboardingPage
          onComplete={() => setCurrentView('post-enrollment-slideshow')}
          onBackToPrograms={() => setCurrentView('foundational')}
          onLogout={handleLogout}
          onShowTerms={() => setCurrentView('terms-conditions')}
        />
      ) : currentView === 'terms-conditions' ? (
        <TermsAndConditionsPage onBack={() => setCurrentView('foundational-onboarding')} />
      ) : currentView === 'post-enrollment-slideshow' ? (
        <PostEnrollmentSlideshow
          onComplete={() => setCurrentView('foundational')}
        />
      ) : currentView === 'ai-screening' ? (
        <AIScreeningPage
          onBack={() => setCurrentView('foundational')}
          onLogout={handleLogout}
        />
      ) : currentView === 'pathways' || currentView === 'programs' ? (
        <WingMentorHome
          onLogout={handleLogout}
          userProfile={authState.userProfile}
          onStartFoundationalEnrollment={() => setCurrentView('foundational-onboarding')}
          onViewChange={(view) => handleViewChange(view as ViewName)}
          initialView={currentView === 'pathways' ? 'pathways' : 'programs'}
          preloadedData={authState.preloadedData}
        />
      ) : currentView === 'privatesector' ? (
        <PrivateSectorPage onBack={() => setCurrentView('pathways')} onLogout={handleLogout} />
      ) : currentView === 'mentorship' ? (
        <PilotGapModule2 onBack={() => setCurrentView('foundational')} />
      ) : currentView === 'module-01' ? (
        <PilotGapModulePage
          onBack={() => setCurrentView('foundational')}
          onComplete={() => handleModuleComplete('stage-1')}
          onNavigateToMentorModules={() => setCurrentView('mentorship')}
        />
      ) : currentView === 'module-02' ? (
        <MentorshipProtocolsModulePage onBack={() => setCurrentView('foundational')} onLogout={handleLogout} />
      ) : currentView === 'module-03' ? (
        <PeerAdvocacyModulePage onBack={() => setCurrentView('foundational')} onLogout={handleLogout} />
      ) : currentView === 'pilot-profile' ? (
        <PilotPortfolioPage
          onBack={() => setCurrentView('hub')}
          userProfile={authState.userProfile}
          preloadedPortfolio={authState.preloadedData?.portfolio}
        />
      ) : currentView === 'recognition' ? (
        <RecognitionAchievementPage
          onBack={() => setCurrentView('hub')}
          onViewExams={() => setCurrentView('module-02')}
          onViewAtlas={() => setCurrentView('applications')}
          userProfile={authState.userProfile}
          preloadedAchievements={authState.preloadedData?.achievements}
          preloadedPortfolio={authState.preloadedData?.portfolio}
        />
      ) : currentView === 'remote-segment' ? (
        <div className="dashboard-container animate-fade-in">
          <main className="dashboard-card" style={{ position: 'relative' }}>
            <button className="platform-logout-btn" onClick={handleLogout}>
              <Icons.LogOut style={{ width: 16, height: 16 }} />
              Logout
            </button>
            <div className="dashboard-header" style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: '0', left: '0' }}>
                <button
                  className="back-btn"
                  onClick={() => setCurrentView('hub')}
                  style={{
                    padding: '0.5rem 0',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#475569',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = '#0f172a';
                    e.currentTarget.style.transform = 'translateX(-4px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = '#475569';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <Icons.ArrowLeft style={{ width: 16, height: 16 }} /> Back to Hub
                </button>
              </div>
              <div className="dashboard-logo" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '240px' }} />
              </div>
              <div className="dashboard-subtitle">DYNAMIC ASSET LOADING</div>
              <h1 className="dashboard-title">Remote Applications</h1>
            </div>

            <div style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Suspense fallback={
                <div style={{ textAlign: 'center' }}>
                  <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
                  <p style={{ color: '#64748b' }}>Fetching remote segment from internal server...</p>
                </div>
              }>
                <RemoteSegment />
              </Suspense>
            </div>
          </main>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default App;
