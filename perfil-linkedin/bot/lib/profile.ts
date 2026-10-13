import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod/v3";

const DESCRIPTION_MAX = 2000;
const TAGLINE_MAX = 120;
const SPECIALTY_MAX = 20;
const SPECIALTY_LENGTH_MAX = 100;

const Locale = z.object({
  language: z.string().regex(/^[a-z]{2}$/),
  country: z.string().regex(/^[A-Z]{2}$/),
});

const ProfileFile = z.object({
  organizationId: z.string().regex(/^\d+$/),
  name: z.string().min(1),
  tagline: z.string().min(1).max(TAGLINE_MAX),
  website: z.string().url(),
  locale: Locale,
  description: z.string().min(1).max(DESCRIPTION_MAX),
  specialties: z.array(z.string().min(1).max(SPECIALTY_LENGTH_MAX)).min(1).max(SPECIALTY_MAX),
  manualOnly: z.array(z.string()),
});

export type CompanyProfile = z.infer<typeof ProfileFile>;

export type ProfileDraft = {
  website: string;
  description: string;
  specialties: string[];
};

const profilePath = join(dirname(fileURLToPath(import.meta.url)), "../perfil.json");

export function canonicalProfile(): CompanyProfile {
  const raw: unknown = JSON.parse(readFileSync(profilePath, "utf8"));
  return ProfileFile.parse(raw);
}

export function localeKey(locale: CompanyProfile["locale"]): string {
  return `${locale.language}_${locale.country}`;
}

export function validateDraft(draft: ProfileDraft): string[] {
  const problems: string[] = [];
  if (!draft.website.startsWith("https://")) {
    problems.push("website must start with https://");
  }
  try {
    const url = new URL(draft.website);
    if (url.protocol !== "https:") problems.push("website must be https");
  } catch {
    problems.push("website is not a URL");
  }
  if (draft.description.length === 0 || draft.description.length > DESCRIPTION_MAX) {
    problems.push(`description must be 1–${DESCRIPTION_MAX} characters`);
  }
  if (draft.specialties.length === 0 || draft.specialties.length > SPECIALTY_MAX) {
    problems.push(`specialties must contain 1–${SPECIALTY_MAX} tags`);
  }
  for (const tag of draft.specialties) {
    if (tag.trim().length === 0 || tag.length > SPECIALTY_LENGTH_MAX) {
      problems.push(`specialty exceeds ${SPECIALTY_LENGTH_MAX} characters or is blank`);
    }
  }
  return problems;
}
