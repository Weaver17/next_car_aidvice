'use client';

import {useParams} from 'next/navigation';

export default function CarDetailPage() {
  const params = useParams();
  const {carId} = params;

  // You would fetch car details based on carId here.
  // For now, just displaying the carId.

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-10 bg-background">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 text-foreground">
        Car Details
      </h1>
      <p className="text-lg text-muted-foreground">
        You are viewing details for car ID: {carId}
      </p>
      {/* Add more details here, fetch from API based on carId */}
    </div>
  );
}
