
import React from 'react';
import UserRegistration, { UserData } from "@/components/UserRegistration";
import WelcomeFeatures from "@/components/WelcomeFeatures";

interface RegistrationStepProps {
  onRegistrationComplete: (data: UserData) => void;
}

const RegistrationStep: React.FC<RegistrationStepProps> = ({ onRegistrationComplete }) => {
  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Create Your Instagram Content Calendar</h1>
        <p className="text-muted-foreground mt-2">
          Get AI-powered content suggestions tailored to your brand
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <UserRegistration onRegistrationComplete={onRegistrationComplete} />
        </div>
        <div className="flex-1">
          <WelcomeFeatures />
        </div>
      </div>
    </>
  );
};

export default RegistrationStep;
