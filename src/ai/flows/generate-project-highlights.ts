'use server';

/**
 * @fileOverview A flow that generates project highlights using AI.
 *
 * - generateProjectHighlights - A function that generates compelling descriptions or key highlights for each project.
 * - GenerateProjectHighlightsInput - The input type for the generateProjectHighlights function, which is the project data.
 * - GenerateProjectHighlightsOutput - The return type for the generateProjectHighlights function, which is a string of highlights.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProjectHighlightsInputSchema = z.object({
  projectName: z.string().describe('The name of the project.'),
  techStack: z.string().describe('The tech stack used in the project.'),
  features: z.string().describe('The features of the project.'),
  outcomes: z.string().describe('The outcomes and results of the project.'),
});
export type GenerateProjectHighlightsInput = z.infer<typeof GenerateProjectHighlightsInputSchema>;

const GenerateProjectHighlightsOutputSchema = z.object({
  highlights: z.string().describe('Compelling project highlights focusing on quantifiable achievements and value.'),
});
export type GenerateProjectHighlightsOutput = z.infer<typeof GenerateProjectHighlightsOutputSchema>;

export async function generateProjectHighlights(input: GenerateProjectHighlightsInput): Promise<GenerateProjectHighlightsOutput> {
  return generateProjectHighlightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProjectHighlightsPrompt',
  input: {schema: GenerateProjectHighlightsInputSchema},
  output: {schema: GenerateProjectHighlightsOutputSchema},
  prompt: `You are an expert at creating compelling project highlights.

  Analyze the following project data and generate concise, impactful highlights focusing on quantifiable achievements and value.

  Project Name: {{{projectName}}}
  Tech Stack: {{{techStack}}}
  Features: {{{features}}}
  Outcomes: {{{outcomes}}}

  Focus on results, numbers, and key benefits.  What makes this project stand out?
  What problems did it solve and what value did it create?
  Return these highlights in a single paragraph.
  `,
});

const generateProjectHighlightsFlow = ai.defineFlow(
  {
    name: 'generateProjectHighlightsFlow',
    inputSchema: GenerateProjectHighlightsInputSchema,
    outputSchema: GenerateProjectHighlightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
