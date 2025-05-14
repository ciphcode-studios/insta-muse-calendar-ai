
import React from 'react';
import { Card, CardHeader } from "@/components/ui/card";

const LoadingCard = () => {
  return (
    <Card className="w-full max-w-md mx-auto p-6">
      <CardHeader className="flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-t-purple-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin"></div>
        <h2 className="text-xl font-bold mt-4">Generating your content calendar...</h2>
        <p className="text-center text-muted-foreground mt-2">
          Our AI is creating personalized post suggestions based on your preferences.
        </p>
      </CardHeader>
    </Card>
  );
};

export default LoadingCard;
