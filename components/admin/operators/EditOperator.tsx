import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Button } from '../../ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const EditOperator: React.FC = () => {
  const navigate = useNavigate();
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Button variant="outline" onClick={() => navigate('/admin/operators')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h1 className="text-3xl">Edit Operator</h1>
        <p>Edit operator form...</p>
      </div>
    </DashboardLayout>
  );
};
