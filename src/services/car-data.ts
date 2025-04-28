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
   /**
    * The type of car, such as SUV, Truck, Sedan, etc.
    */
   type: string;
   /**
    * The size of the car, such as compact, mid-size, or full-size.
    */
   size?: string;
}

/**
 * Categorizes cars based on their average price.
 * @param averagePrice The average price of the car.
 * @returns A string representing the price category of the car.
 */
function getPriceCategory(averagePrice: number): string {
  if (averagePrice < 25000) {
    return 'cheap';
  } else if (averagePrice >= 25000 && averagePrice < 45000) {
    return 'average';
  } else if (averagePrice >= 45000 && averagePrice < 100000) {
    return 'expensive';
  } else {
    return 'extremely expensive';
  }
}

/**
 * Asynchronously retrieves car details based on user-provided keywords.
 *
 * @param keywords An array of keywords provided by the user (e.g., SUV, EV, hatchback).
 * @returns A promise that resolves to an array of CarDetails objects matching the keywords.
 */
export async function getCarDetails(keywords: string[]): Promise<CarDetails[]> {
  const allCars: CarDetails[] = [
    {
      make: 'Toyota',
      model: 'RAV4',
      trims: ['LE', 'XLE', 'Limited'],
      averagePrice: 28000,
      pros: ['Reliable', 'Good resale value', 'Spacious interior', 'Great fuel economy'],
      cons: ['Basic features', 'Not very sporty', 'Mediocre fuel economy', 'Less cargo space than competitors'],
      hybridOrElectric: 'Hybrid',
      type: 'Crossover',
      size: 'compact',
    },
    {
      make: 'Ford',
      model: 'F-150',
      trims: ['XL', 'XLT', 'Lariat'],
      averagePrice: 35000,
      pros: ['Powerful', 'High towing capacity', 'Versatile', 'Wide range of configurations', 'Available with advanced tech'],
      cons: ['Poor fuel economy', 'Can be expensive', 'Large size', 'Base models lack features'],
      hybridOrElectric: 'Hybrid Electric None',
      type: 'Truck',
      size: 'full-size',
    },
    {
      make: 'Tesla',
      model: 'Model 3',
      trims: ['Standard Range Plus', 'Long Range', 'Performance'],
      averagePrice: 45000,
      pros: ['Electric', 'Advanced technology', 'Quick acceleration', 'Sleek design', 'Low running costs'],
      cons: ['Expensive', 'Charging infrastructure', 'Limited service centers', 'Range anxiety'],
      hybridOrElectric: 'Electric',
      type: 'Sedan',
      size: 'compact',
    },
    {
      make: 'Honda',
      model: 'Civic',
      trims: ['LX', 'Sport', 'EX'],
      averagePrice: 23000,
      pros: ['Fuel efficient', 'Fun to drive', 'Affordable', 'Reliable', 'Good safety ratings'],
      cons: ['Small back seat', 'Road noise', 'Basic interior', 'Less cargo space'],
      hybridOrElectric: 'None',
      type: 'Sedan',
      size: 'compact',
    },
    {
      make: 'Chevrolet',
      model: 'Suburban',
      trims: ['LS', 'LT', 'Premier'],
      averagePrice: 60000,
      pros: ['Very spacious', 'Powerful engine', 'Comfortable ride', 'Excellent for large families', 'High towing capacity'],
      cons: ['Expensive', 'Poor fuel economy', 'Hard to park', 'Bulky size'],
      hybridOrElectric: 'None',
      type: 'SUV',
      size: 'full-size',
    },
    {
      make: 'GMC',
      model: 'Sierra',
      trims: ['Base', 'SLE', 'SLT'],
      averagePrice: 40000,
      pros: ['Strong engine options', 'Comfortable interior', 'Good towing', 'Refined interior', 'Available with advanced features'],
      cons: ['Can be pricey', 'Lower fuel economy', 'Styling is subjective', 'Ride can be stiff'],
      hybridOrElectric: 'None',
      type: 'Truck',
      size: 'full-size',
    },
    {
      make: 'Chrysler',
      model: 'Pacifica',
      trims: ['Touring', 'Touring L', 'Limited'],
      averagePrice: 38000,
      pros: ['Spacious interior', 'Comfortable seating', 'Available hybrid option', 'Lots of storage', 'Smooth ride'],
      cons: ['Can be expensive', 'Styling is not for everyone', 'Some reliability concerns', 'Not very sporty'],
      hybridOrElectric: 'Hybrid',
      type: 'Minivan',
      size: 'full-size',
    },
    {
      make: 'Mazda',
      model: 'MX-5 Miata',
      trims: ['Sport', 'Club', 'Grand Touring'],
      averagePrice: 30000,
      pros: ['Fun to drive', 'Agile handling', 'Convertible', 'Affordable sports car', 'Stylish'],
      cons: ['Small interior', 'Limited cargo space', 'Not practical for families', 'Can be noisy'],
      hybridOrElectric: 'None',
      type: 'Sports Car',
      size: 'compact',
    },
  ];

  // Convert keywords to lowercase for case-insensitive matching
  const lowerCaseKeywords = keywords.map(keyword => keyword.toLowerCase());

  // Filter car details based on keywords
  const filteredCars = allCars.filter(car => {
    // Check if any keyword matches the car's type, make, model, price category, or size
    return lowerCaseKeywords.some(keyword => {
      const carValues = [car.type, car.make, car.model, getPriceCategory(car.averagePrice), car.size || ''].map(value => value.toLowerCase());
      return carValues.some(carValue => carValue.includes(keyword));
    });
  });

  return filteredCars;
}
