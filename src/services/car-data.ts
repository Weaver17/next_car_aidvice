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
   * An array of strings representing the available trims for the car model.
   */
  trims: string[];
  /**
   * The average price of the car model.
   */
  averagePrice: number;
  /**
   * An array of strings representing the pros of the car model.
   */
  pros: string[];
  /**
   * An array of strings representing the cons of the car model.
   */
  cons: string[];
   /**
   * A string representing if the model has hybrid or electric versions.
   */
  hybridOrElectric: string;
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
      trims: ['LE', 'XLE', 'Limited'],
      averagePrice: 28000,
      pros: ['Reliable', 'Good resale value', 'Spacious interior'],
      cons: ['Basic features', 'Not very sporty', 'Mediocre fuel economy'],
      hybridOrElectric: 'Hybrid',
    },
    {
      make: 'Tesla',
      model: 'Model 3',
      trims: ['Standard Range Plus', 'Long Range', 'Performance'],
      averagePrice: 45000,
      pros: ['Electric', 'Advanced technology', 'Quick acceleration', 'Sleek design'],
      cons: ['Expensive', 'Charging infrastructure', 'Limited service centers'],
      hybridOrElectric: 'Electric',
    },
        {
      make: 'Honda',
      model: 'Civic',
      trims: ['LX', 'Sport', 'EX'],
      averagePrice: 23000,
      pros: ['Fuel efficient', 'Fun to drive', 'Affordable', 'Reliable'],
      cons: ['Small back seat', 'Road noise', 'Basic interior'],
      hybridOrElectric: 'None',
    },
  ];
}



