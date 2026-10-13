import { defineAgent } from "@cursor/bdk";

export default defineAgent({
  name: "Perfil LinkedIn",
  description: "Publica el perfil de empresa de Ferro Fragoso en LinkedIn.",
  model: {
    id: "grok-4.5",
    params: [
      { id: "effort", value: "high" },
      { id: "fast", value: "true" },
    ],
  },
  tools: ["read", "grep", "glob", "ls"],
  hosting: {
    egressDomains: ["api.linkedin.com"],
    secretNames: ["LINKEDIN_ACCESS_TOKEN"],
  },
});
