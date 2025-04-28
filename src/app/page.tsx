'use client';

import {useState, useEffect} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {GenerateCarSuggestionsOutput, generateCarSuggestions} from '@/ai/flows/generate-car-suggestions';
import {useToast} from "@/hooks/use-toast"
import {ThumbsUp, ThumbsDown} from "lucide-react";
import {DollarSign} from "lucide-react";
import {BatteryCharging, Fuel, Leaf} from "lucide-react";
import {ModeToggle} from "@/components/ui/mode-toggle"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Label} from "@/components/ui/label";
import {Slider} from "@/components/ui/slider";

function EmptySearch() {
  return (
    <div className="text-center text-muted-foreground">
      <p className="text-lg">Answer the questions to see car recommendations.</p>
    </div>
  );
}

const carTypes = ['Any', 'SUV', 'Truck', 'Sedan', 'Sports Car', 'Minivan'];
const carSizes = ['Any', 'Compact', 'Mid-Size', 'Full-Size', 'Subcompact'];
const hybridElectricOptions = ['Any', 'Hybrid', 'Electric', 'Gas'];

export default function Home() {
  const [carType, setCarType] = useState<string | undefined>(undefined);
  const [carSize, setCarSize] = useState<string | undefined>(undefined);
  const [hybridElectric, setHybridElectric] = useState<string | undefined>(undefined);
  const [keywords, setKeywords] = useState('');
  const [budget, setBudget] = useState<number[]>([100000]);
  const [carSuggestions, setCarSuggestions] = useState<GenerateCarSuggestionsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {toast} = useToast()

  useEffect(() => {
    // Update keywords when selections change
    const generateKeywords = () => {
      const selections = [carType === 'Any' ? undefined : carType, carSize === 'Any' ? undefined : carSize, hybridElectric === 'Any' ? undefined : hybridElectric].filter(Boolean).join(' ');
      setKeywords(selections);
    };

    generateKeywords();
  }, [carType, carSize, hybridElectric]);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const suggestions = await generateCarSuggestions({keywords, budget: budget[0]});
      setCarSuggestions(suggestions);
    } catch (error: any) {
      console.error('Error fetching car suggestions:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-10 bg-background">
        <ModeToggle className="absolute top-4 right-4"/>
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 text-foreground">
        Next Car Assister
      </h1>

      <div className="flex flex-col items-start gap-4 mb-6 w-full max-w-xl px-4">
        <Label htmlFor="car-type">What type of car are you looking for?</Label>
        <Select onValueChange={setCarType} defaultValue={carType}>
          <SelectTrigger id="car-type" className="w-full focus-visible:border-primary">
            <SelectValue placeholder="Select a car type" />
          </SelectTrigger>
          <SelectContent>
            {carTypes.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Label htmlFor="car-size">What size of car are you looking for?</Label>
        <Select onValueChange={setCarSize} defaultValue={carSize}>
          <SelectTrigger id="car-size" className="w-full focus-visible:border-primary">
            <SelectValue placeholder="Select a car size" />
          </SelectTrigger>
          <SelectContent>
            {carSizes.map((size) => (
              <SelectItem key={size} value={size}>{size}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Label htmlFor="hybrid-electric">Hybrid, Electric, or Gas?</Label>
        <Select onValueChange={setHybridElectric} defaultValue={hybridElectric}>
          <SelectTrigger id="hybrid-electric" className="w-full focus-visible:border-primary">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {hybridElectricOptions.map((option) => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Label htmlFor="keywords">Additional Keywords</Label>
        <Input
          type="text"
          id="keywords"
          placeholder="Enter keywords (e.g., fuel efficient, sporty)"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          className="focus-visible:border-primary"
        />

        <Label htmlFor="budget">Budget (Up to ${budget[0].toLocaleString()})</Label>
        <Slider
          id="budget"
          defaultValue={budget}
          max={100000}
          step={1000}
          aria-label="Set budget"
          onValueChange={setBudget}
        />

        <Button onClick={handleSearch} disabled={isLoading} className="w-full">
          {isLoading ? 'Searching...' : 'Show Recommendations'}
        </Button>
      </div>

      {!carSuggestions && !isLoading && <EmptySearch />}

      {carSuggestions && carSuggestions.cars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl px-4 border border-accent rounded-md p-4">
          {carSuggestions.cars.map((car, index) => (
              <Card key={index} className="bg-card text-card-foreground shadow-md rounded-lg border border-primary">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold tracking-tight">{car.make} {car.model}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                   {car.size ? `${car.size} ` : ''}{car.type}
                  </CardDescription>
                  <CardDescription className="text-muted-foreground">
                    AI Suggested Car
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    {car.hybridOrElectric.includes('Hybrid') && (
                      <Leaf className="text-green-500"/>
                    )}
                    {car.hybridOrElectric.includes('Electric') && (
                      <BatteryCharging className="text-blue-500"/>
                    )}
                    {car.hybridOrElectric.includes('None') && (
                      <Fuel className="text-gray-500"/>
                    )}
                  </div>
                   <p className="mb-4 flex items-center">
                    <DollarSign className="mr-2 text-green-500"/> <span className="font-semibold">Average Price:</span> ${car.averagePrice.toLocaleString()}
                  </p>
                  <h3 className="text-lg font-semibold mb-2">Trims:</h3>
                  <ul className="list-disc list-inside mb-4">
                    {car.trims.map((trim, i) => (
                      <li key={i}>{trim}</li>
                    ))}
                  </ul>
                  <h3 className="text-lg font-semibold mb-2 flex items-center"><ThumbsUp className="mr-2 text-green-500"/>Pros:</h3>
                  <ul className="list-disc list-inside mb-4">
                    {car.pros.slice(0, 3).map((pro, i) => (
                      <li key={i}>{pro}</li>
                    ))}
                  </ul>
                  <h3 className="text-lg font-semibold mb-2 flex items-center"><ThumbsDown className="mr-2 text-red-500"/>Cons:</h3>
                  <ul className="list-disc list-inside">
                    {car.cons.slice(0, 3).map((con, i) => (
                      <li key={i}>{con}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
          ))}
        </div>
      ) : carSuggestions && carSuggestions.cars.length === 0 ? (
        <p className="text-lg text-muted-foreground">No cars found matching your criteria.</p>
      ) : null}
    </div>
  );
}

