import { defineTool } from "@cursor/bdk/tools";
import { z } from "zod/v3";
import { buildPatch, linkedinConfig, partialUpdate, patchHash } from "../lib/linkedin";
import { canonicalProfile, validateDraft } from "../lib/profile";

const Draft = z.object({
  confirm: z
    .boolean()
    .describe("True only when the user explicitly asked to publish the company page now."),
  website: z.string().optional(),
  description: z.string().optional(),
  specialties: z.array(z.string()).max(20).optional(),
});

export default defineTool({
  description:
    "Publish the Ferro Fragoso company page on LinkedIn: website, description, and specialties. Requires confirm:true and LINKEDIN_ACCESS_TOKEN of a page admin (rw_organization_admin). Tagline, logo, and cover are not writable here.",
  effect: "write",
  dryRunResult: () => ({ published: false, reason: "dry_run" }),
  inputSchema: Draft,
  async execute(input, ctx) {
    const profile = canonicalProfile();
    const config = linkedinConfig();
    const draft = {
      website: input.website ?? profile.website,
      description: input.description ?? profile.description,
      specialties: input.specialties ?? profile.specialties,
    };
    const manualOnly = profile.manualOnly;

    if (ctx.session.purpose === "eval") {
      return {
        published: false,
        reason: "eval",
        organizationId: config.organizationId,
        manualOnly,
      };
    }
    if (!input.confirm) {
      return {
        published: false,
        reason: "confirm_required",
        organizationId: config.organizationId,
        manualOnly,
      };
    }

    const problems = validateDraft(draft);
    if (problems.length > 0) {
      return { published: false, reason: "invalid_profile", problems, manualOnly };
    }
    if (!config.token) {
      return {
        published: false,
        reason: "missing_token",
        organizationId: config.organizationId,
        manualOnly,
      };
    }

    const patch = buildPatch(profile, draft);
    const hash = patchHash(patch);
    const key = `linkedin:org:${config.organizationId}:profile-hash`;
    const previous = await ctx.host.kv.get(key);
    if (previous === hash) {
      return {
        published: false,
        reason: "unchanged",
        organizationId: config.organizationId,
        manualOnly,
      };
    }

    const result = await partialUpdate(config, patch);
    if (!result.ok) {
      return {
        published: false,
        reason: "linkedin_error",
        organizationId: config.organizationId,
        httpStatus: result.httpStatus,
        message: result.message,
        manualOnly,
      };
    }

    await ctx.host.kv.put(key, hash);
    return {
      published: true,
      reason: "published",
      organizationId: config.organizationId,
      httpStatus: result.httpStatus,
      fields: ["website", "description", "specialties"],
      manualOnly,
    };
  },
});
