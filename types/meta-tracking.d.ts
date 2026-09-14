export {};

declare global {
  interface Window {
    __cowinMetaCreateEventId?: (prefix?: string) => string;
    __cowinMetaBrowserIds?: () => { fbp: string; fbc: string };
    __cowinMetaTrack?: (
      eventName: string,
      customData?: Record<string, unknown>,
      options?: { eventId?: string; sendServer?: boolean }
    ) => string;
  }
}
