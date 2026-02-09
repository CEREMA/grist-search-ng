export {};

declare global {
  interface Window {
    // biome-ignore lint/suspicious/noExplicitAny: grist API
    grist: any;
  }
}
