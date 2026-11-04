const isBrowser = typeof window !== "undefined";

export function getAppParams() {
  return {
    appId: null,
    token: null,
    appBaseUrl: isBrowser ? window.location.origin : "",
  };
}
