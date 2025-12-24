import React from 'react';

export enum ToolId {
  HUMANIZER = 'humanizer',
  DETECTOR = 'detector',
  PLAGIARISM = 'plagiarism',
  PARAPHRASER = 'paraphraser',
  SUMMARIZER = 'summarizer',
  GRAMMAR = 'grammar',
  FACT = 'fact',
  CITATION = 'citation',
  IMAGE = 'image'
}

export interface Tool {
  id: ToolId;
  name: string;
  description: string;
  icon: React.ReactNode;
}

export interface ToolResult {
  text: string;
  data?: any; // For structured data like detection scores
  groundingUrls?: string[];
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export enum Sender {
  USER = 'USER',
  SYSTEM = 'SYSTEM'
}

export interface ToolCard {
  type: string;
  data: any;
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: number;
  isThinking?: boolean;
  toolCard?: ToolCard;
  groundingUrls?: string[];
}

export interface GeminResponse {
  text: string;
  groundingUrls: string[];
}

export enum PersonaMode {
  DEFAULT = 'DEFAULT',
  DEEP = 'DEEP',
  FAST = 'FAST',
  DIAGNOSTIC = 'DIAGNOSTIC'
}

export type PerspectiveType = 'REALITY' | 'BENEFIT' | 'LONG_TERM' | 'VALUE' | 'RELATIONSHIP' | 'RISK' | 'EMOTIONAL' | 'REVERSE';

export interface EmotionState {
  type: string;
  intensity: number;
  trend: number[];
  triggerKeyword?: string;
  systemComment?: string;
}

export interface ActionItem {
  id: string;
  title: string;
  timeframe: string;
  risk: string;
  difficulty: string;
  reward: string;
}

export interface FuturePath {
  path: string;
  label: string;
  description: string;
}

export interface Theme {
  name: string;
  count: number;
  emotionScore?: number;
}

export interface Relationship {
  name: string;
  drainIndex: number;
  emotionTrend?: number[];
  lastEvent: string;
}

export interface LogEntry {
  date: string;
  keywords: string[];
  mainIssue: string;
  aiSummary: string;
}

export interface BiasWarning {
  type: string;
  description: string;
}

export interface SystemState {
  emotion: EmotionState;
  actions: ActionItem[];
  futurePaths: FuturePath[];
  themes: Theme[];
  relationships: Relationship[];
  log: LogEntry | null;
  bias: BiasWarning | null;
}

// --- NEW TYPES FOR FILE UPLOAD & JOBS ---

export interface FileUpload {
  file: File;
  id: string;
  progress: number;
  status: 'UPLOADING' | 'PARSING' | 'DONE' | 'ERROR';
  parsedContent?: string;
}

export enum JobStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  QUEUED = 'QUEUED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export enum ProcessingStage {
  UPLOAD = 'UPLOAD',
  QUEUE = 'QUEUE',
  ANALYZE = 'ANALYZE',
  FINALIZE = 'FINALIZE'
}
