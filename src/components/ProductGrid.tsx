
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, ShoppingCart } from 'lucide-react';

const products = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max',
    price: 1199.99,
    originalPrice: 1299.99,
    rating: 4.8,
    reviews: 2847,
    image: '/placeholder.svg',
    badge: 'Best Seller',
    freeShipping: true
  },
  {
    id: 2,
    name: 'Samsung 65" 4K Smart TV',
    price: 598.00,
    originalPrice: 799.99,
    rating: 4.6,
    reviews: 1923,
    image: '/placeholder.svg',
    badge: 'Save $200',
    freeShipping: true
  },
  {
    id: 3,
    name: 'Apple MacBook Air M2',
    price: 999.99,
    originalPrice: 1199.99,
    rating: 4.9,
    reviews: 3421,
    image: '/placeholder.svg',
    badge: 'Popular',
    freeShipping: true
  },
  {
    id: 4,
    name: 'Nintendo Switch OLED',
    price: 349.99,
    rating: 4.7,
    reviews: 5647,
    image: '/placeholder.svg',
    freeShipping: false
  },
  {
    id: 5,
    name: 'AirPods Pro (2nd Gen)',
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.8,
    reviews: 8392,
    image: '/placeholder.svg',
    badge: 'Limited Time',
    freeShipping: true
  },
  {
    id: 6,
    name: 'Dyson V15 Vacuum',
    price: 549.99,
    originalPrice: 649.99,
    rating: 4.5,
    reviews: 2156,
    image: '/placeholder.svg',
    freeShipping: true
  }
];

const ProductGrid = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Trending now</h2>
          <Button variant="outline">View all</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-4">
                <div className="relative mb-4">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg bg-gray-100"
                  />
                  {product.badge && (
                    <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                      {product.badge}
                    </Badge>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white hover:bg-gray-100"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-sm line-clamp-2 h-10">{product.name}</h3>
                  
                  <div className="flex items-center space-x-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">({product.reviews})</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                    )}
                  </div>

                  {product.freeShipping && (
                    <p className="text-xs text-green-600 font-medium">Free shipping</p>
                  )}

                  <Button className="w-full mt-3 bg-blue-600 hover:bg-blue-700">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
