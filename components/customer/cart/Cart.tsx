import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Button } from '../../ui/button';
import { Link } from 'react-router-dom';

export const Cart: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl">Shopping Cart</h1>
        <p>Cart items...</p>
        <Link to="/customer/checkout">
          <Button>Proceed to Checkout</Button>
        </Link>
      </div>
    </DashboardLayout>
  );
};
