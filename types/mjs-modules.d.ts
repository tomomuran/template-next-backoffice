declare module "*.mjs" {
  export const buildBootstrapEnv: (baseContent: string, slot: number) => string;
  export const buildTemplateAdoptionContent: (
    currentContent: string,
    version: string,
    generatedDate: string,
    owner: string
  ) => string;
  export const upsertEnvValues: (content: string, updates: Record<string, string>) => string;
}
