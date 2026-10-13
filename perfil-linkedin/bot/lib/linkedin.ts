import { createHash } from "node:crypto";
import { canonicalProfile, localeKey, type CompanyProfile, type ProfileDraft } from "./profile";

const API = "https://api.linkedin.com/rest";

export type LinkedInConfig = {
  token: string;
  organizationId: string;
  version: string;
};

export function linkedinConfig(): LinkedInConfig {
  const profile = canonicalProfile();
  return {
    token: process.env.LINKEDIN_ACCESS_TOKEN?.trim() ?? "",
    organizationId: process.env.LINKEDIN_ORGANIZATION_ID?.trim() || profile.organizationId,
    version: process.env.LINKEDIN_VERSION?.trim() || "202609",
  };
}

export function buildPatch(profile: CompanyProfile, draft: ProfileDraft): Record<string, unknown> {
  const key = localeKey(profile.locale);
  const preferredLocale = {
    language: profile.locale.language,
    country: profile.locale.country,
  };
  return {
    patch: {
      $set: {
        website: {
          localized: { [key]: draft.website },
          preferredLocale,
        },
        description: {
          localized: { [key]: draft.description },
          preferredLocale,
        },
        specialties: [
          {
            locale: preferredLocale,
            tags: draft.specialties,
          },
        ],
      },
    },
  };
}

export function patchHash(patch: Record<string, unknown>): string {
  return createHash("sha256").update(JSON.stringify(patch)).digest("hex");
}

function headers(config: LinkedInConfig, method: "GET" | "PARTIAL_UPDATE"): Record<string, string> {
  const base: Record<string, string> = {
    Authorization: `Bearer ${config.token}`,
    "X-Restli-Protocol-Version": "2.0.0",
    "Linkedin-Version": config.version,
  };
  if (method === "PARTIAL_UPDATE") {
    base["Content-Type"] = "application/json";
    base["X-Restli-Method"] = "PARTIAL_UPDATE";
  }
  return base;
}

async function readBody(response: Response): Promise<string> {
  const text = await response.text();
  return text.slice(0, 500);
}

export async function fetchOrganization(config: LinkedInConfig): Promise<
  | { ok: true; httpStatus: number; page: Record<string, unknown> }
  | { ok: false; httpStatus: number; message: string }
> {
  let response: Response;
  try {
    response = await fetch(`${API}/organizations/${config.organizationId}`, {
      method: "GET",
      headers: headers(config, "GET"),
      signal: AbortSignal.timeout(15_000),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "network error";
    return { ok: false, httpStatus: 0, message };
  }
  const body = await readBody(response);
  if (!response.ok) {
    return { ok: false, httpStatus: response.status, message: body || response.statusText };
  }
  let page: Record<string, unknown> = {};
  if (body) {
    try {
      const parsed: unknown = JSON.parse(body);
      if (parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)) {
        page = parsed as Record<string, unknown>;
      }
    } catch {
      return { ok: false, httpStatus: response.status, message: "LinkedIn returned a non-JSON body" };
    }
  }
  return { ok: true, httpStatus: response.status, page };
}

export async function partialUpdate(
  config: LinkedInConfig,
  patch: Record<string, unknown>,
): Promise<{ ok: true; httpStatus: number } | { ok: false; httpStatus: number; message: string }> {
  let response: Response;
  try {
    response = await fetch(`${API}/organizations/${config.organizationId}`, {
      method: "POST",
      headers: headers(config, "PARTIAL_UPDATE"),
      body: JSON.stringify(patch),
      signal: AbortSignal.timeout(15_000),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "network error";
    return { ok: false, httpStatus: 0, message };
  }
  if (response.status >= 200 && response.status < 300) {
    return { ok: true, httpStatus: response.status };
  }
  const message = (await readBody(response)) || response.statusText;
  return { ok: false, httpStatus: response.status, message };
}
