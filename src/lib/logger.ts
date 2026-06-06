/**
 * Centralized Logger for Astra AI
 * Handles console logging with proper formatting and levels
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
}

class Logger {
  private logs: LogEntry[] = [];
  private isDev: boolean = import.meta.env.DEV;
  private maxLogs: number = 100;

  private getTimestamp(): string {
    return new Date().toISOString().split('T')[1].split('.')[0];
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = this.getTimestamp();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    return `${prefix} ${message}`;
  }

  private createEntry(level: LogLevel, message: string, data?: unknown): LogEntry {
    return {
      timestamp: this.getTimestamp(),
      level,
      message,
      data,
    };
  }

  private addToHistory(entry: LogEntry): void {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  debug(message: string, data?: unknown): void {
    const entry = this.createEntry('debug', message, data);
    this.addToHistory(entry);
    if (this.isDev) {
      console.log(`%c${this.formatMessage('debug', message)}`, 'color: #06b6d4;', data || '');
    }
  }

  info(message: string, data?: unknown): void {
    const entry = this.createEntry('info', message, data);
    this.addToHistory(entry);
    console.log(`%c${this.formatMessage('info', message)}`, 'color: #3b82f6;', data || '');
  }

  warn(message: string, data?: unknown): void {
    const entry = this.createEntry('warn', message, data);
    this.addToHistory(entry);
    console.warn(`%c${this.formatMessage('warn', message)}`, 'color: #f59e0b;', data || '');
  }

  error(message: string, error?: unknown): void {
    const entry = this.createEntry('error', message, error);
    this.addToHistory(entry);
    console.error(`%c${this.formatMessage('error', message)}`, 'color: #ef4444;', error || '');
  }

  success(message: string, data?: unknown): void {
    const entry = this.createEntry('success', message, data);
    this.addToHistory(entry);
    console.log(`%c${this.formatMessage('success', message)}`, 'color: #10b981;', data || '');
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = new Logger();
