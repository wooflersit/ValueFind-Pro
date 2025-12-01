import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Button } from '../../ui/button';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

export const SellerProducts: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl">My Products</h1>
          <Link to="/seller/products/create">
            <Button><Plus className="mr-2 h-4 w-4" /> Add Product</Button>
          </Link>
        </div>
        <p>Product list...</p>
      </div>
    </DashboardLayout>
  );
};
