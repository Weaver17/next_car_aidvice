'use client';

import {useState, useEffect} from 'react';
import {useParams} from 'next/navigation';
import {summarizeCarProsCons, SummarizeCarProsConsOutput} from '@/ai/flows/summarize-car-pros-cons';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {useToast} from "@/hooks/use-toast";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Info, ThumbsUp, ThumbsDown, DollarSign, BatteryCharging, Fuel, Leaf} from "lucide-react";

export default function CarDetailPage() {
  const params = useParams();
  const {carId} = params;
  const [carSummary, setCarSummary] = useState<SummarizeCarProsConsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const {toast} = useToast();
  const [carDetails, setCarDetails] = useState<{
    make: string;
    model: string;
    trims: string[];
    averagePrice: number;
    pros: string[];
    cons: string[];
    hybridOrElectric: string;
    type: string;
    size?: string;
  } | null>(null);

  useEffect(() => {
    const fetchCarSummary = async () => {
      setIsLoading(true);
      try {
        // Extract make and model from carId (assuming format is make-model)
        const [make, model] = carId.split('-');
        if (!make || !model) {
          throw new Error('Invalid carId format. Expected make-model.');
        }

        const summary = await summarizeCarProsCons({make, model});
        setCarSummary(summary);
         setCarDetails({
           make: make,
           model: model,
           trims: ['LE', 'XLE', 'Limited'], // Dummy data, replace with actual fetch
           averagePrice: 28000, // Dummy data, replace with actual fetch
           pros: ['Reliable', 'Good resale value', 'Spacious interior', 'Great fuel economy'], // Dummy data, replace with actual fetch
           cons: ['Basic features', 'Not very sporty', 'Mediocre fuel economy', 'Less cargo space than competitors'], // Dummy data, replace with actual fetch
           hybridOrElectric: 'Hybrid', // Dummy data, replace with actual fetch
           type: 'Crossover', // Dummy data, replace with actual fetch
           size: 'compact', // Dummy data, replace with actual fetch
         });
      } catch (error: any) {
        console.error('Error fetching car summary:', error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarSummary();
  }, [carId, toast]);

  const cleanedCarId = carId?.replace(/%20/g, ' ') || '';
  const [make, model] = cleanedCarId.split('-');
    const imageUrl = `https://picsum.photos/400/300?random=${carId}`;

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-10 bg-background">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 text-foreground">
        Car Details
      </h1>

      {isLoading ? (
        <p className="text-lg text-muted-foreground">Loading car details...</p>
      ) : carDetails && carSummary ? (
        <Card className="w-full max-w-4xl bg-card text-card-foreground shadow-md rounded-lg border border-primary">
          <CardHeader>
             <CardTitle className="text-2xl font-semibold tracking-tight">{carDetails.make} {carDetails.model}</CardTitle>
            <CardDescription className="text-muted-foreground">
              {carDetails.size ? `${carDetails.size} ` : ''}{carDetails.type}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
             <img src={imageUrl} alt={`${make} ${model}`} className="mb-4 rounded-md shadow-md"/>
               <Alert>
              <Info className="h-4 w-4"/>
              <AlertTitle>Summary</AlertTitle>
              <AlertDescription>
                {carSummary.summary}
              </AlertDescription>
            </Alert>
          <div className="flex items-center space-x-2 mb-4">
                    {carDetails.hybridOrElectric.includes('Hybrid') && (
                      <Leaf className="text-green-500"/>
                    )}
                    {carDetails.hybridOrElectric.includes('Electric') && (
                      <BatteryCharging className="text-blue-500"/>
                    )}
                    {carDetails.hybridOrElectric.includes('None') && (
                      <Fuel className="text-gray-500"/>
                    )}
                  </div>
                   <p className="mb-4 flex items-center">
                    <DollarSign className="mr-2 text-green-500"/> <span className="font-semibold">Average Price:</span> ${carDetails.averagePrice.toLocaleString()}
                  </p>
                    <h3 className="text-lg font-semibold mb-2">Trims:</h3>
                    <ul className="list-disc list-inside mb-4">
                      {carDetails.trims.map((trim, i) => (
                        <li key={i}>{trim}</li>
                      ))}
                    </ul>
                    <h3 className="text-lg font-semibold mb-2 flex items-center"><ThumbsUp className="mr-2 text-green-500"/>Pros:</h3>
                    <ul className="list-disc list-inside mb-4">
                      {carDetails.pros.map((pro, i) => (
                        <li key={i}>{pro}</li>
                      ))}
                    </ul>
                    <h3 className="text-lg font-semibold mb-2 flex items-center"><ThumbsDown className="mr-2 text-red-500"/>Cons:</h3>
                    <ul className="list-disc list-inside">
                      {carDetails.cons.map((con, i) => (
                        <li key={i}>{con}</li>
                      ))}
                    </ul>

          </CardContent>
        </Card>
      ) : (
        <p className="text-lg text-muted-foreground">
          Failed to load car details.
        </p>
      )}
    </div>
  );
}


