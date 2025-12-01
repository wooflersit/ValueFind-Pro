import React, { useState, useEffect } from 'react';
import { PublicHeader } from '../shared/PublicHeader';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search, ShoppingCart } from 'lucide-react';
import { apiCall } from '../../utils/api';
import { Product } from '../../utils/supabase/types';
import { LoadingSpinner } from '../shared/LoadingSpinner';

export const PublicProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const response = await apiCall<{ products: Product[] }>('/products/list', {
      method: 'POST',
      body: JSON.stringify({ limit: 50 }),
    }, false);

    if (response.success && response.data) {
      setProducts(response.data.products || []);
    }
    setLoading(false);
  };

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />
      
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl text-white text-center mb-6">Browse Products</h1>
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 py-6"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition">
              <CardContent className="p-4">
                <div className="aspect-square bg-gray-200 rounded mb-4"></div>
                <h3 className="font-medium mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-500 line-through">₹{product.pricing?.mrp}</span>
                    <p className="text-lg">₹{product.pricing?.sellingPrice}</p>
                  </div>
                  <Button size="sm"><ShoppingCart className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
