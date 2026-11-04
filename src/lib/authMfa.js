import { getAppParams } from "@/lib/app-params";

const appId = () => getAppParams().appId;

function authPath(suffix) {
  if (!appId()) throw new Error("No app ID configured");
  return `/api/apps/${appId()}/auth/${suffix}`;
}

async function post(suffix, body, token) {
  const response = await fetch(authPath(suffix), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error?.message || result.detail || "Unable to sign in");
  return result;
}

export async function loginWithMfa(email, password) {
  return post("login", { email, password });
}

export async function continueMfa(result, returnTo) {
  const encode = (bytes) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const verifier = encode(crypto.getRandomValues(new Uint8Array(32)));
  const challenge = encode(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier))));
  const { code } = await post("mfa/handoff", { code_challenge: challenge }, result.mfa_session_token);
  sessionStorage.setItem(`app-mfa-pkce:${appId()}`, verifier);
  const url = new URL("/auth/mfa", window.location.origin);
  url.search = new URLSearchParams({ app_id: appId(), mfa_code: code, from_url: returnTo });
  window.location.assign(url.href);
}

export async function loginWithSocial(provider, returnTo) {
  const url = new URL("/auth/mfa", window.location.origin);
  url.search = new URLSearchParams({ app_id: appId(), oauth_start: provider, from_url: returnTo });
  window.location.assign(url.href);
}

export function loginWithGoogle(returnTo) {
  return loginWithSocial("google", returnTo);
}
