// Database Configuration
export interface DBConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

// Connection Status
export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting';

// Table and Schema Types
export interface TableInfo {
  name: string;
  schema: string;
  rowCount?: number;
}

export interface ColumnInfo {
  name: string;
  type: string;
  nullable: boolean;
  defaultValue?: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
}

export interface Index {
  name: string;
  columns: string[];
  isUnique: boolean;
}

export interface Constraint {
  name: string;
  type: 'PRIMARY KEY' | 'FOREIGN KEY' | 'UNIQUE' | 'CHECK';
  columns: string[];
  definition?: string;
}

// Data Table Types
export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

export interface TableRow {
  [key: string]: any;
}

// Query Types
export interface QueryResult {
  columns: Column[];
  rows: TableRow[];
  rowCount: number;
  executionTime?: number;
}

export interface QueryError {
  message: string;
  code?: string;
  position?: number;
}

// UI Component Props Types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export interface InputProps {
  type?: 'text' | 'number' | 'password' | 'search';
  label?: string;
  placeholder?: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info';
  children: React.ReactNode;
  className?: string;
}

export interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

// Pagination
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
