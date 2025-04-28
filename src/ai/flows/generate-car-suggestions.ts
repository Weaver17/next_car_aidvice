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
  budget: z.number().optional().describe('The user\'s budget for the car. (e.g., 25000)'),
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
    hybridOrElectric: z.string().describe('If the model has hybrid or electric versions. Should be "Hybrid", "Electric", or "None".'),
    type: z.string().describe('The type of car, such as SUV, Truck, Sedan, etc.'),
    size: z.string().optional().describe('The size of the car, such as compact, mid-size, or full-size.'),
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
      budget: z.number().optional().describe('The user\'s budget for the car. (e.g., 25000)'),
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
        hybridOrElectric: z.string().describe('If the model has hybrid or electric versions. Should be "Hybrid", "Electric", or "None".'),
        type: z.string().describe('The type of car, such as SUV, Truck, Sedan, etc.'),
        size: z.string().optional().describe('The size of the car, such as compact, mid-size, or full-size.'),
      })).describe('An array of car makes and models that match the user-provided criteria.'),
    }),
  },
  prompt: `You are an AI assistant that helps users find the right car for them.

  Based on the user's keywords and budget, suggest car makes and models that match their criteria.
  Also, include the available trims and average price of each vehicle, as well as common pros and cons.
  Indicate if the model has hybrid or electric versions (Hybrid, Electric, or None).

  User Keywords: {{{keywords}}}
  {{#if budget}}
  Budget: {{{budget}}}
  {{/if}}
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

  // Filter cars based on budget
  const carsWithinBudget = input.budget ? carDetails.filter(car => car.averagePrice <= input.budget!) : carDetails;

  // Format the car details into the expected output schema
  const cars = carsWithinBudget.map(car => ({
    make: car.make,
    model: car.model,
    trims: car.trims,
    averagePrice: car.averagePrice,
    pros: car.pros,
    cons: car.cons,
    hybridOrElectric: car.hybridOrElectric,
    type: car.type,
    size: car.size,
  }));

  return {
    cars: cars,
  };
});
