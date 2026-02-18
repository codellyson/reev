interface ReevConfig {
  projectId: string;
  apiUrl?: string;
  rageClick?: boolean;
  deadLink?: boolean;
  brokenImage?: boolean;
  formFrustration?: boolean;
  popover?: boolean;
  popoverTheme?: 'dark' | 'light';
  maxPopupsPerSession?: number;
  popoverCooldown?: number;
  debug?: boolean;
}

declare global {
  interface Window {
    Reev: typeof import("./index");
  }
}

export {};
