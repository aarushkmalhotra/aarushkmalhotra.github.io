'use server';
/**
 * @fileOverview An AI flow to summarize a developer's experience with a specific skill based on their projects.
 *
 * - summarizeSkillExperience - A function that takes a skill and a list of projects and returns an AI-generated summary.
 * - SummarizeSkillInput - The input type for the function.
 * - SummarizeSkillOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import type { Project } from '@/lib/projects';
import { z } from 'genkit';

const ProjectSchema = z.object({
    name: z.string(),
    tagline: z.string(),
    description: z.string(),
    techStack: z.string(),
    outcomes: z.string(),
});

const SummarizeSkillInputSchema = z.object({
  skill: z.string().describe('The technical skill to be summarized.'),
  projects: z.array(ProjectSchema).describe('A list of projects to analyze for the skill.'),
});
export type SummarizeSkillInput = z.infer<typeof SummarizeSkillInputSchema>;

// The output is a simple string for this flow.
export type SummarizeSkillOutput = string;

const summarizeSkillPrompt = ai.definePrompt({
    name: 'summarizeSkillPrompt',
    input: { schema: SummarizeSkillInputSchema },
    prompt: `You are an expert career coach summarizing a software developer's skills for a recruiter.
You will be given a specific skill and a list of projects. Your task is to write a concise, professional, and compelling summary (2-3 paragraphs) explaining how the developer has applied this skill.

Analyze the provided projects to answer the following:
- In which projects was {{{skill}}} used?
- What was the role of {{{skill}}} in those projects?
- What do these projects demonstrate about the developer's proficiency with {{{skill}}}?

Synthesize this information into a human-readable summary. Speak in the third person (e.g., "Aarush has demonstrated...").
Do not just list the projects. Instead, weave them into a narrative that highlights the developer's experience.
Focus only on the provided skill: {{{skill}}}.

Here are the projects to analyze:
{{#each projects}}
---
Project Name: {{{this.name}}}
Tagline: {{{this.tagline}}}
Description: {{{this.description}}}
Tech Stack: {{{this.techStack}}}
Outcomes: {{{this.outcomes}}}
---
{{/each}}

Based on this, generate the summary.`,
});

const summarizeSkillFlow = ai.defineFlow(
  {
    name: 'summarizeSkillFlow',
    inputSchema: SummarizeSkillInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const { stream, response } = ai.generateStream({
        prompt: summarizeSkillPrompt,
        input: input,
        model: 'googleai/gemini-2.5-flash',
    });

    let accumulatedText = '';
    for await (const chunk of stream) {
        accumulatedText += chunk.text;
    }
    
    return accumulatedText;
  }
);

// We will export a function that can be called from our server components or actions.
export async function summarizeSkillExperience(
  input: SummarizeSkillInput
): Promise<SummarizeSkillOutput> {
  return await summarizeSkillFlow(input);
}
