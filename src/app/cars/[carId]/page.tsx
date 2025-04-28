'use client';

import {useState, useEffect} from 'react';
import {useParams} from 'next/navigation';
import {summarizeCarProsCons, SummarizeCarProsConsOutput} from '@/ai/flows/summarize-car-pros-cons';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {useToast} from "@/hooks/use-toast";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Info} from "lucide-react";

export default function CarDetailPage() {
  const params = useParams();
  const {carId} = params;
  const [carSummary, setCarSummary] = useState<SummarizeCarProsConsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const {toast} = useToast();

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

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-10 bg-background">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 text-foreground">
        Car Details
      </h1>

      {isLoading ? (
        <p className="text-lg text-muted-foreground">Loading car details...</p>
      ) : carSummary ? (
        <Card className="w-full max-w-4xl bg-card text-card-foreground shadow-md rounded-lg border border-primary">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold tracking-tight">{carId.replace('-', ' ')}</CardTitle>
            <CardDescription className="text-muted-foreground">
              AI Generated Summary
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Alert>
              <Info className="h-4 w-4"/>
              <AlertTitle>Summary</AlertTitle>
              <AlertDescription>
                {carSummary.summary}
              </AlertDescription>
            </Alert>
            <h3 className="text-lg font-semibold mt-4 mb-2">
              Features and Options:
            </h3>
            <ul className="list-disc list-inside">
              <li>Adaptive Cruise Control</li>
              <li>Blind Spot Monitoring</li>
              <li>Lane Keep Assist</li>
              <li>Automatic Emergency Braking</li>
              <li>Apple CarPlay and Android Auto</li>
              <li>Premium Audio System</li>
              {/* Add more features and options here */}
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
