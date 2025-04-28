'use server';
/**
 * @fileOverview Summarizes the pros and cons of a car model using AI.
 *
 * - summarizeCarProsCons - A function that summarizes car pros and cons.
 * - SummarizeCarProsConsInput - The input type for the summarizeCarProsCons function.
 * - SummarizeCarProsConsOutput - The return type for the summarizeCarProsCons function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {getCarDetails, CarDetails} from '@/services/car-data';

const SummarizeCarProsConsInputSchema = z.object({
  make: z.string().describe('The make of the car.'),
  model: z.string().describe('The model of the car.'),
});
export type SummarizeCarProsConsInput = z.infer<typeof SummarizeCarProsConsInputSchema>;

const SummarizeCarProsConsOutputSchema = z.object({
  summary: z.string().describe('A summary of the pros and cons of the car model.'),
});
export type SummarizeCarProsConsOutput = z.infer<typeof SummarizeCarProsConsOutputSchema>;

export async function summarizeCarProsCons(input: SummarizeCarProsConsInput): Promise<SummarizeCarProsConsOutput> {
  return summarizeCarProsConsFlow(input);
}

const summarizeCarProsConsPrompt = ai.definePrompt({
  name: 'summarizeCarProsConsPrompt',
  input: {
    schema: z.object({
      make: z.string().describe('The make of the car.'),
      model: z.string().describe('The model of the car.'),
      pros: z.array(z.string()).describe('The pros of the car model.'),
      cons: z.array(z.string()).describe('The cons of the car model.'),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string().describe('A summary of the pros and cons of the car model.'),
    }),
  },
  prompt: `Summarize the pros and cons of the {{make}} {{model}}:\n\nPros: {{#each pros}}{{{this}}}\n{{/each}}\n\nCons: {{#each cons}}{{{this}}}\n{{/each}}`,
});

const summarizeCarProsConsFlow = ai.defineFlow<
  typeof SummarizeCarProsConsInputSchema,
  typeof SummarizeCarProsConsOutputSchema
>(
  {
    name: 'summarizeCarProsConsFlow',
    inputSchema: SummarizeCarProsConsInputSchema,
    outputSchema: SummarizeCarProsConsOutputSchema,
  },
  async input => {
    const carDetails: CarDetails[] = await getCarDetails([input.make, input.model]);
    if (!carDetails || carDetails.length === 0) {
      return {summary: `No information found for ${input.make} ${input.model}`};
    }
    const {pros, cons} = carDetails[0];
    const {output} = await summarizeCarProsConsPrompt({
      ...input,
      pros,
      cons,
    });
    return output!;
  }
);
