import { defineTool } from "@cursor/bdk/tools";
import { z } from "zod/v3";
import { fetchOrganization, linkedinConfig } from "../lib/linkedin";
import { canonicalProfile } from "../lib/profile";

export default defineTool({
  description:
    "Read the Ferro Fragoso LinkedIn company page. Returns the canonical profile to publish and, when LINKEDIN_ACCESS_TOKEN is set, the live page. Call this before describing or changing the page.",
  effect: "read",
  inputSchema: z.object({}),
  async execute(_input, ctx) {
    const profile = canonicalProfile();
    const config = linkedinConfig();
    const canonical = {
      organizationId: config.organizationId,
      name: profile.name,
      tagline: profile.tagline,
      taglineLength: profile.tagline.length,
      website: profile.website,
      description: profile.description,
      descriptionLength: profile.description.length,
      specialties: profile.specialties,
      manualOnly: profile.manualOnly,
    };

    if (ctx.session.purpose === "eval") {
      return { canonical, linkedin: { status: "eval" as const } };
    }
    if (!config.token) {
      return { canonical, linkedin: { status: "missing_token" as const } };
    }

    const live = await fetchOrganization(config);
    if (!live.ok) {
      return {
        canonical,
        linkedin: {
          status: "error" as const,
          httpStatus: live.httpStatus,
          message: live.message,
          localizedName: null,
          localizedWebsite: null,
          localizedDescription: null,
          localizedSpecialties: null,
        },
      };
    }

    const specialties = live.page.localizedSpecialties;
    return {
      canonical,
      linkedin: {
        status: "ok" as const,
        httpStatus: live.httpStatus,
        message: null,
        localizedName: typeof live.page.localizedName === "string" ? live.page.localizedName : null,
        localizedWebsite: typeof live.page.localizedWebsite === "string" ? live.page.localizedWebsite : null,
        localizedDescription:
          typeof live.page.localizedDescription === "string" ? live.page.localizedDescription : null,
        localizedSpecialties: Array.isArray(specialties)
          ? specialties.filter((tag): tag is string => typeof tag === "string")
          : null,
      },
    };
  },
});
