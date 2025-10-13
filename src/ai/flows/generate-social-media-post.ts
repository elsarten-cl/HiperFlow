'use server';

/**
 * @fileOverview A social media post generator AI agent.
 *
 * - generateSocialMediaPost - A function that generates social media posts.
 * - GenerateSocialMediaPostInput - The input type for the generateSocialMediaPost function.
 * - GenerateSocialMediaPostOutput - The return type for the generateSocialMediaPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSocialMediaPostInputSchema = z.object({
  topicDescription: z
    .string()
    .describe('A short description of the topic for the social media post.'),
});
export type GenerateSocialMediaPostInput = z.infer<
  typeof GenerateSocialMediaPostInputSchema
>;

const GenerateSocialMediaPostOutputSchema = z.object({
  postContent: z.string().describe('The generated content of the social media post.'),
});
export type GenerateSocialMediaPostOutput = z.infer<
  typeof GenerateSocialMediaPostOutputSchema
>;

export async function generateSocialMediaPost(
  input: GenerateSocialMediaPostInput
): Promise<GenerateSocialMediaPostOutput> {
  return generateSocialMediaPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSocialMediaPostPrompt',
  input: {schema: GenerateSocialMediaPostInputSchema},
  output: {schema: GenerateSocialMediaPostOutputSchema},
  prompt: `You are a social media expert. Generate a social media post based on the following topic description: {{{topicDescription}}}.`,
});

const generateSocialMediaPostFlow = ai.defineFlow(
  {
    name: 'generateSocialMediaPostFlow',
    inputSchema: GenerateSocialMediaPostInputSchema,
    outputSchema: GenerateSocialMediaPostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
