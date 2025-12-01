import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Button } from '../../ui/button';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

export const OperatorSellers: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl">Sellers</h1>
          <Link to="/operator/sellers/onboard">
            <Button><Plus className="mr-2 h-4 w-4" /> Onboard Seller</Button>
          </Link>
        </div>
        <p>Sellers in your territory...</p>
      </div>
    </DashboardLayout>
  );
};
