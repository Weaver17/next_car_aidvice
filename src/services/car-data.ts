/**
 * Represents car details with make, model, and common pros and cons.
 */
export interface CarDetails {
  /**
   * The make of the car (e.g., Toyota, Honda).
   */
  make: string;
  /**
   * The model of the car (e.g., Camry, Civic).
   */
  model: string;
  /**
   * An array of strings representing the pros of the car model.
   */
  pros: string[];
  /**
   * An array of strings representing the cons of the car model.
   */
  cons: string[];
}

/**
 * Asynchronously retrieves car details based on user-provided keywords.
 *
 * @param keywords An array of keywords provided by the user (e.g., SUV, EV, hatchback).
 * @returns A promise that resolves to an array of CarDetails objects matching the keywords.
 */
export async function getCarDetails(keywords: string[]): Promise<CarDetails[]> {
  // TODO: Implement this by calling an API.

  return [
    {
      make: 'Toyota',
      model: 'RAV4',
      pros: ['Reliable', 'Good resale value'],
      cons: ['Basic features', 'Not very sporty'],
    },
    {
      make: 'Tesla',
      model: 'Model 3',
      pros: ['Electric', 'Advanced technology'],
      cons: ['Expensive', 'Charging infrastructure'],
    },
  ];
}
