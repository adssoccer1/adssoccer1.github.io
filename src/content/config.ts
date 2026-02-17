import { defineCollection, z } from "astro:content";

const systemDesign = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().optional(),
    description: z.string().optional(),
  }),
});

const leetcode = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    difficulty: z.enum(["Easy", "Medium", "Hard"]),
    leetcodeUrl: z.string().url(),
    tags: z.array(z.string()).optional(),
    timeComplexity: z.string(),
    spaceComplexity: z.string(),
  }),
});

export const collections = {
  "system-design": systemDesign,
  leetcode,
};
