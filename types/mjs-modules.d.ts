declare module "*.mjs" {
  export const buildBootstrapEnv: (baseContent: string, slot: number) => string;
  export const buildTemplateAdoptionContent: (
    currentContent: string,
    version: string,
    generatedDate: string,
    owner: string
  ) => string;
  export const resolveProjectSlot: (explicitSlot?: string, envLocalContent?: string) => number;
  export const resolveSupabaseCommand: (commandName: string, workdirFlag: string) => string;
  export const upsertEnvValues: (content: string, updates: Record<string, string>) => string;
}
