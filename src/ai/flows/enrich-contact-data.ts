'use server';

/**
 * @fileOverview This file defines a Genkit flow for enriching contact information using AI.
 *
 * It includes:
 * - `enrichContactData`: A function to enrich contact data.
 * - `EnrichContactDataInput`: The input type for the enrichContactData function.
 * - `EnrichContactDataOutput`: The output type for the enrichContactData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnrichContactDataInputSchema = z.object({
  name: z.string().describe('The name of the contact.'),
  email: z.string().email().optional().describe('The email address of the contact.'),
  company: z.string().optional().describe('The company the contact works for.'),
  jobTitle: z.string().optional().describe('The job title of the contact.'),
  linkedinProfile: z.string().optional().describe('The LinkedIn profile URL of the contact.'),
  instagramProfile: z.string().optional().describe('The Instagram profile URL of the contact.'),
  facebookProfile: z.string().optional().describe('The Facebook profile URL of the contact.'),
  city: z.string().optional().describe('The city of the contact.'),
  country: z.string().optional().describe('The country of the contact.'),
});
export type EnrichContactDataInput = z.infer<typeof EnrichContactDataInputSchema>;

const EnrichContactDataOutputSchema = z.object({
  email: z.string().email().optional().describe('The enriched email address of the contact.'),
  jobTitle: z.string().optional().describe('The enriched job title of the contact.'),
  linkedinProfile: z.string().url().optional().describe('The enriched LinkedIn profile URL of the contact.'),
  instagramProfile: z.string().url().optional().describe('The enriched Instagram profile URL of the contact.'),
  facebookProfile: z.string().url().optional().describe('The enriched Facebook profile URL of the contact.'),
  city: z.string().optional().describe('The city of the contact.'),
  country: z.string().optional().describe('The country of the contact.'),
  enriched: z.boolean().describe('Indicates whether the contact data was successfully enriched.'),
});
export type EnrichContactDataOutput = z.infer<typeof EnrichContactDataOutputSchema>;

export async function enrichContactData(input: EnrichContactDataInput): Promise<EnrichContactDataOutput> {
  return enrichContactDataFlow(input);
}

const enrichContactDataPrompt = ai.definePrompt({
  name: 'enrichContactDataPrompt',
  input: {schema: EnrichContactDataInputSchema},
  output: {schema: EnrichContactDataOutputSchema},
  prompt: `You are an AI assistant that enriches contact data. Given the following contact details, fill in any missing information and correct any inaccuracies.\n\n  Name: {{{name}}}\n  Email: {{{email}}}\n  Company: {{{company}}}\n  Job Title: {{{jobTitle}}}\n  LinkedIn Profile: {{{linkedinProfile}}}\n  Instagram Profile: {{{instagramProfile}}}\n  Facebook Profile: {{{facebookProfile}}}\n  City: {{{city}}}\n  Country: {{{country}}}\n\n  Return the enriched contact information. If enrichment was successful, set enriched to true. Otherwise, set to false. If a field cannot be enriched, leave it blank.\n  Make sure the email address is valid, the job title is accurate, social media profile URLs are valid, the city is correct, and the country is correct.\n`,
});

const enrichContactDataFlow = ai.defineFlow(
  {
    name: 'enrichContactDataFlow',
    inputSchema: EnrichContactDataInputSchema,
    outputSchema: EnrichContactDataOutputSchema,
  },
  async input => {
    try {
        const {output} = await enrichContactDataPrompt(input);
        if (!output) {
            return { enriched: false };
        }
        
        // Basic check to see if we got *any* new data
        const wasEnriched = !!(output.jobTitle || output.linkedinProfile || output.instagramProfile || output.facebookProfile || output.city || output.country || (output.email && output.email !== input.email));

        return {
        ...output,
        enriched: wasEnriched,
        };
    } catch (error) {
        console.error("Enrichment flow failed:", error);
        return { enriched: false };
    }
  }
);
