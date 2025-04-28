'use server';

/**
 * @fileOverview Car suggestion AI agent.
 *
 * - generateCarSuggestions - A function that handles the car suggestion process.
 * - GenerateCarSuggestionsInput - The input type for the generateCarSuggestions function.
 * - GenerateCarSuggestionsOutput - The return type for the generateCarSuggestions function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {getCarDetails, CarDetails} from '@/services/car-data';

const GenerateCarSuggestionsInputSchema = z.object({
  keywords: z
    .string()
    .describe('Keywords describing the type of car the user is looking for (e.g., SUV, electric, fuel efficient).'),
});
export type GenerateCarSuggestionsInput = z.infer<typeof GenerateCarSuggestionsInputSchema>;

const GenerateCarSuggestionsOutputSchema = z.object({
  cars: z.array(z.object({
    make: z.string().describe('The make of the car.'),
    model: z.string().describe('The model of the car.'),
    trims: z.array(z.string()).describe('Available trims for the car model.'),
    averagePrice: z.number().describe('The average price of the car model.'),
    pros: z.array(z.string()).describe('An array of strings representing the pros of the car model.'),
    cons: z.array(z.string()).describe('An array of strings representing the cons of the car model.'),
  })).describe('An array of car makes and models that match the user-provided criteria.'),
});
export type GenerateCarSuggestionsOutput = z.infer<typeof GenerateCarSuggestionsOutputSchema>;

export async function generateCarSuggestions(input: GenerateCarSuggestionsInput): Promise<GenerateCarSuggestionsOutput> {
  return generateCarSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCarSuggestionsPrompt',
  input: {
    schema: z.object({
      keywords: z
        .string()
        .describe('Keywords describing the type of car the user is looking for (e.g., SUV, electric, fuel efficient).'),
    }),
  },
  output: {
    schema: z.object({
      cars: z.array(z.object({
        make: z.string().describe('The make of the car.'),
        model: z.string().describe('The model of the car.'),
        trims: z.array(z.string()).describe('Available trims for the car model.'),
        averagePrice: z.number().describe('The average price of the car model.'),
        pros: z.array(z.string()).describe('An array of strings representing the pros of the car model.'),
        cons: z.array(z.string()).describe('An array of strings representing the cons of the car model.'),
      })).describe('An array of car makes and models that match the user-provided criteria.'),
    }),
  },
  prompt: `You are an AI assistant that helps users find the right car for them.

  Based on the user's keywords, suggest car makes and models that match their criteria.
  Also, include the available trims and average price of each vehicle, as well as common pros and cons.

  User Keywords: {{{keywords}}}
  `,
});

const generateCarSuggestionsFlow = ai.defineFlow<
  typeof GenerateCarSuggestionsInputSchema,
  typeof GenerateCarSuggestionsOutputSchema
>({
  name: 'generateCarSuggestionsFlow',
  inputSchema: GenerateCarSuggestionsInputSchema,
  outputSchema: GenerateCarSuggestionsOutputSchema,
}, async input => {
  // Call the car data service to get car details based on keywords
  const carDetails: CarDetails[] = await getCarDetails(input.keywords.split(' '));

  // Format the car details into the expected output schema
  const cars = carDetails.map(car => ({
    make: car.make,
    model: car.model,
    trims: car.trims,
    averagePrice: car.averagePrice,
    pros: car.pros,
    cons: car.cons,
  }));

  return {
    cars: cars,
  };
});

