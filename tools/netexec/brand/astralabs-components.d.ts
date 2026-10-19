import type * as React from 'react';

/** The AstraLabs mark. Always renders in `--mark` white. */
export interface MarkProps {
  /** Height in px. Default 32. Minimum 16. */
  size?: number;
  /** Accessible name. Omit when a wordmark sits next to it. */
  title?: string;
  /** Play the boot trace: the outline draws on, then the fill flickers on. */
  trace?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/** The Bracketed Path wordmark, [ASTRA/LABS]. */
export interface WordmarkProps {
  /** Letter font size in px. Default 24. */
  size?: number;
  /** Boot on mount: [ / ] with a spinning slash, ASTRA types in left of it, LABS on its right, then the brackets snap. */
  boot?: boolean;
  /** Change to replay the boot sequence. */
  bootKey?: number | string;
  /** Delay before the wordmark strobes on, ms. Default 1650 (after the mark's trace and fill). */
  bootDelay?: number;
  /** Slash spins while true (brackets stay solid); brackets snap when it turns false. */
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/** Mark + wordmark. */
export interface LockupProps {
  /** Height unit in px. The mark is 1.05x this (1.6x stacked), the wordmark 0.56x. Default 40. */
  size?: number;
  variant?: 'horizontal' | 'stacked';
  /** Full boot: mark traces, then the wordmark types. */
  boot?: boolean;
  bootKey?: number | string;
  loading?: boolean;
  /** Brackets push outward on hover. Default true. */
  interactive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = acid fill with the 60° cut (one per view), ghost = acid outline, quiet = rule outline, danger = status-down outline. Default primary. */
  variant?: 'primary' | 'ghost' | 'quiet' | 'danger';
  children?: React.ReactNode;
}

/** A square plate container marked by four corner ticks. */
export interface PanelProps {
  /** Uppercase mono label. */
  label?: string;
  /** Large mono value. */
  value?: React.ReactNode;
  unit?: string;
  /** Acid corner ticks for the selected panel. */
  active?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface ReadoutProps {
  label: string;
  value: React.ReactNode;
  unit?: string;
  className?: string;
}

export interface StatusPillProps {
  /** Default ok. Each state has its own shape as well as colour. */
  state?: 'ok' | 'warn' | 'down' | 'sync';
  /** Overrides the default word (Online, Degraded, Offline, Syncing). */
  children?: React.ReactNode;
  className?: string;
}

export interface DialProps {
  /** 0 to 1. */
  value: number;
  /** Centre text. Default the percentage. */
  label?: string;
  /** Uppercase label under the gauge, such as "CPU". */
  sublabel?: string;
  /** Rendered size in px. Default 112. */
  size?: number;
  className?: string;
}

export interface HazardBandProps {
  /** Height in px. Default 16. */
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

export interface SerialTagProps {
  /** A real ID: hostname, version, hash. Also seeds the barcode. */
  serial: string;
  /** Right-hand meta, such as "REV C". */
  rev?: string;
  /** Number of bars. Default 44. */
  bars?: number;
  className?: string;
  style?: React.CSSProperties;
}

export interface AssetTagProps {
  /** Asset ID in the header bar. Default AL-0451. */
  id?: string;
  /** Header text. Default "Property of". */
  header?: string;
  /** Lockup size. Default 34. */
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export interface FocusFrameProps {
  /** Brackets shown and snapped in. Default true. */
  active?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface TerminalProps {
  /** Full hostname. Default node-02.astralabs.dev. */
  host?: string;
  user?: string;
  /** Shown dimmed above the lockup. */
  lastLogin?: string;
  /** Status lines under the lockup. Strings or nodes. */
  lines?: React.ReactNode[];
  className?: string;
  style?: React.CSSProperties;
}

export declare const Mark: React.FC<MarkProps>;
export declare const Wordmark: React.FC<WordmarkProps>;
export declare const Lockup: React.FC<LockupProps>;
export declare const Button: React.FC<ButtonProps>;
export declare const Panel: React.FC<PanelProps>;
export declare const Readout: React.FC<ReadoutProps>;
export declare const StatusPill: React.FC<StatusPillProps>;
export declare const Dial: React.FC<DialProps>;
export declare const HazardBand: React.FC<HazardBandProps>;
export declare const SerialTag: React.FC<SerialTagProps>;
export declare const AssetTag: React.FC<AssetTagProps>;
export declare const FocusFrame: React.FC<FocusFrameProps>;
export declare const Terminal: React.FC<TerminalProps>;
