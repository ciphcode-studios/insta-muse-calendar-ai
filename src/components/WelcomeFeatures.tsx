
import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Image, ArrowRight } from "lucide-react";

const WelcomeFeatures = () => {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold">Why use Insta Content Planner?</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="bg-purple-100 rounded-full p-1">
            <Calendar className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <h3 className="font-medium">Save Time Planning</h3>
            <p className="text-sm text-muted-foreground">
              Generate a month's worth of content ideas in seconds
            </p>
          </div>
        </div>
        <Separator />
        <div className="flex items-start space-x-3">
          <div className="bg-purple-100 rounded-full p-1">
            <Image className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <h3 className="font-medium">AI Image Prompts</h3>
            <p className="text-sm text-muted-foreground">
              Get creative image ideas that align with your brand
            </p>
          </div>
        </div>
        <Separator />
        <div className="flex items-start space-x-3">
          <div className="bg-purple-100 rounded-full p-1">
            <ArrowRight className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <h3 className="font-medium">Consistent Growth</h3>
            <p className="text-sm text-muted-foreground">
              Post regularly with engaging content to grow your audience
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeFeatures;
