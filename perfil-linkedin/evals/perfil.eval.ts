import { defineEval } from "@cursor/bdk/evals";

export default defineEval({
  tags: ["smoke"],
  description: "Shows the ready company profile and does not publish it.",
  async test(t) {
    await t.send("¿Qué texto tiene listo el perfil de Ferro Fragoso? No lo publiques.");
    t.succeeded();
    t.calledTool("read_company_page");
    t.notCalledTool("publish_company_page");
  },
});
