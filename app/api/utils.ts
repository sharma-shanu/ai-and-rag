export const strip_think = (s: string) =>
  s.replace(/<think>.*?<\/think>/gs, "").trim();

export const DEEP_SEEK_SMALL = "deepseek-r1:1.5b";
export const DEEP_SEEK_7B = "deepseek-r1:7b";
export const MISTRAL = "mistral";
