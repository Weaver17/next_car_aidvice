'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {GenerateCarSuggestionsOutput, generateCarSuggestions} from '@/ai/flows/generate-car-suggestions';
import {useToast} from "@/hooks/use-toast"
import {ThumbsUp, ThumbsDown} from "lucide-react";
import Link from 'next/link';
import {DollarSign, Zap} from "lucide-react";

function EmptySearch() {
  return (
    <div className="text-center text-muted-foreground">
      <p className="text-lg">Enter keywords to search for car suggestions.</p>
    </div>
  );
}

export default function Home() {
  const [keywords, setKeywords] = useState('');
  const [carSuggestions, setCarSuggestions] = useState<GenerateCarSuggestionsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
    const {toast} = useToast()

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const suggestions = await generateCarSuggestions({keywords});
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
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 text-foreground">
        Next Car Assister
      </h1>
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6 w-full max-w-xl px-4">
        <Input
          type="text"
          placeholder="Enter keywords (e.g., SUV, EV, hatchback)"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {!carSuggestions && !isLoading && <EmptySearch />}

      {carSuggestions && carSuggestions.cars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl px-4 border border-primary rounded-md p-4">
          {carSuggestions.cars.map((car, index) => (
             <Link href={`/cars/${car.make}-${car.model}`} key={index} className="no-underline">
              <Card key={index} className="bg-card text-card-foreground shadow-md rounded-lg border border-primary">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold tracking-tight">{car.make} {car.model}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    AI Suggested Car
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                   <p className="mb-4 flex items-center">
                    <Zap className="mr-2"/> <span className="font-semibold">Hybrid/Electric:</span> {car.hybridOrElectric}
                  </p>
                  <h3 className="text-lg font-semibold mb-2">Trims:</h3>
                  <ul className="list-disc list-inside mb-4">
                    {car.trims.map((trim, i) => (
                      <li key={i}>{trim}</li>
                    ))}
                  </ul>
                  <p className="mb-4 flex items-center">
                    <DollarSign className="mr-2"/> <span className="font-semibold">Average Price:</span> ${car.averagePrice.toLocaleString()}
                  </p>
                  <h3 className="text-lg font-semibold mb-2 flex items-center"><ThumbsUp className="mr-2"/>Pros:</h3>
                  <ul className="list-disc list-inside mb-4">
                    {car.pros.map((pro, i) => (
                      <li key={i}>{pro}</li>
                    ))}
                  </ul>
                  <h3 className="text-lg font-semibold mb-2 flex items-center"><ThumbsDown className="mr-2"/>Cons:</h3>
                  <ul className="list-disc list-inside">
                    {car.cons.map((con, i) => (
                      <li key={i}>{con}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : carSuggestions && carSuggestions.cars.length === 0 ? (
        <p className="text-lg text-muted-foreground">No cars found matching your criteria.</p>
      ) : null}
    </div>
  );
}


