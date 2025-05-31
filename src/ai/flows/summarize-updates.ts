// Summarize updates for the user's followed politicians and parties.
'use server';

/**
 * @fileOverview Summarizes updates for followed politicians and parties.
 *
 * - summarizeUpdates - A function that summarizes updates.
 * - SummarizeUpdatesInput - The input type for the summarizeUpdates function.
 * - SummarizeUpdatesOutput - The return type for the summarizeUpdates function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeUpdatesInputSchema = z.object({
  updates: z.array(
    z.object({
      title: z.string().describe('Title of the update.'),
      content: z.string().describe('Content of the update.'),
      source: z.string().describe('Source of the update.'),
      url: z.string().url().describe('URL of the update.'),
    })
  ).describe('Array of updates to summarize.'),
  userPreferences: z.string().describe('The user preferences for the updates.'),
});
export type SummarizeUpdatesInput = z.infer<typeof SummarizeUpdatesInputSchema>;

const SummarizeUpdatesOutputSchema = z.object({
  summary: z.string().describe('Concise summary of the updates.'),
  progress: z.string().describe('Progress of the summarization.'),
});
export type SummarizeUpdatesOutput = z.infer<typeof SummarizeUpdatesOutputSchema>;

export async function summarizeUpdates(input: SummarizeUpdatesInput): Promise<SummarizeUpdatesOutput> {
  return summarizeUpdatesFlow(input);
}

const summarizeUpdatesPrompt = ai.definePrompt({
  name: 'summarizeUpdatesPrompt',
  input: {schema: SummarizeUpdatesInputSchema},
  output: {schema: SummarizeUpdatesOutputSchema},
  prompt: `You are an AI assistant summarizing news and updates for a user following specific politicians and parties. The user has the following preferences: {{{userPreferences}}}. Below is a list of updates. Please provide a concise summary of these updates, focusing on the most important information for the user.

{{#each updates}}
Source: {{source}}
Title: {{title}}
Content: {{content}}
URL: {{url}}
\n
{{/each}}
`,
});

const summarizeUpdatesFlow = ai.defineFlow(
  {
    name: 'summarizeUpdatesFlow',
    inputSchema: SummarizeUpdatesInputSchema,
    outputSchema: SummarizeUpdatesOutputSchema,
  },
  async input => {
    const {output} = await summarizeUpdatesPrompt(input);
    return {
      ...output!,
      progress: 'Generated a summary of the updates for the user.',
    };
  }
);
