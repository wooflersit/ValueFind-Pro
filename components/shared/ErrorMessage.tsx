import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';

interface ErrorMessageProps {
  title?: string;
  message: string;
  retry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  title = 'Error', 
  message, 
  retry 
}) => {
  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
      </div>
      <h3 className="text-lg text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      {retry && (
        <Button onClick={retry} variant="outline">
          Try Again
        </Button>
      )}
    </div>
  );
};
