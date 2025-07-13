import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Minus, Users, DollarSign, Share2, ShoppingCart, ArrowLeft, Wifi, WifiOff, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  budget: number;
  spent: number;
  isCreator: boolean;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  brand: string;
  rating: number;
  inStock: boolean;
}

const CoCartProducts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartItems, setCartItems] = useState<{[key: string]: number}>({});
  const [newMemberBudget, setNewMemberBudget] = useState('');
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [lastActivity, setLastActivity] = useState<string>('');
  
  const coCartCode = localStorage.getItem('coCartCode') || '';
  const coCartName = localStorage.getItem('coCartName') || 'Shared Cart';
  const isCreator = localStorage.getItem('isCoCartCreator') === 'true';

  // Mock team members data with real-time updates simulation
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'You',
      avatar: '',
      budget: 100,
      spent: 0,
      isCreator: isCreator
    },
    {
      id: '2',
      name: 'Deepanshi',
      avatar: '',
      budget: 80,
      spent: 0,
      isCreator: false
    },
    {
      id: '3',
      name: 'Anshumaan',
      avatar: '',
      budget: 120,
      spent: 0,
      isCreator: false
    },
    {
      id: '4',
      name: 'Anshuman',
      avatar: '',
      budget: 90,
      spent: 0,
      isCreator: false
    }
  ]);

  // Enhanced products data with real images
  const products: Product[] = [
    {
      id: '1',
      name: 'Organic Bananas',
      price: 2.99,
      image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop',
      category: 'fruits',
      brand: 'Fresh Market',
      rating: 4.5,
      inStock: true
    },
    {
      id: '2',
      name: 'Whole Wheat Bread',
      price: 3.49,
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop',
      category: 'bakery',
      brand: 'Wonder Bread',
      rating: 4.2,
      inStock: true
    },
    {
      id: '3',
      name: 'Fresh Milk 2%',
      price: 4.29,
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop',
      category: 'dairy',
      brand: 'Great Value',
      rating: 4.7,
      inStock: true
    },
    {
      id: '4',
      name: 'Chicken Breast',
      price: 8.99,
      image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop',
      category: 'meat',
      brand: 'Fresh Choice',
      rating: 4.4,
      inStock: true
    },
    {
      id: '5',
      name: 'Pasta Sauce',
      price: 2.79,
      image: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=400&h=400&fit=crop',
      category: 'pantry',
      brand: 'Ragu',
      rating: 4.1,
      inStock: false
    },
    {
      id: '6',
      name: 'Greek Yogurt',
      price: 5.99,
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop',
      category: 'dairy',
      brand: 'Chobani',
      rating: 4.8,
      inStock: true
    },
    {
      id: '7',
      name: 'Fresh Avocados',
      price: 1.99,
      image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=400&fit=crop',
      category: 'fruits',
      brand: 'Organic Select',
      rating: 4.6,
      inStock: true
    },
    {
      id: '8',
      name: 'Brown Rice',
      price: 3.99,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
      category: 'pantry',
      brand: 'Uncle Ben\'s',
      rating: 4.3,
      inStock: true
    },
    {
      id: '9',
      name: 'Salmon Fillet',
      price: 12.99,
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=400&fit=crop',
      category: 'meat',
      brand: 'Fresh Catch',
      rating: 4.7,
      inStock: true
    },
    {
      id: '10',
      name: 'Croissants',
      price: 4.99,
      image: '/croiss.png',
      category: 'bakery',
      brand: 'Artisan Bakery',
      rating: 4.5,
      inStock: true
    },
    {
      id: '11',
      name: 'Fresh Strawberries',
      price: 3.99,
      image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop',
      category: 'fruits',
      brand: 'Berry Fresh',
      rating: 4.4,
      inStock: true
    },
    {
      id: '12',
      name: 'Cheddar Cheese',
      price: 6.49,
      image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=400&fit=crop',
      category: 'dairy',
      brand: 'Kraft',
      rating: 4.2,
      inStock: true
    },
    {
      id: '13',
      name: 'Ground Beef',
      price: 7.99,
      image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400&h=400&fit=crop',
      category: 'meat',
      brand: 'Premium Beef',
      rating: 4.3,
      inStock: true
    },
    {
      id: '14',
      name: 'Extra Virgin Olive Oil',
      price: 8.99,
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop',
      category: 'pantry',
      brand: 'Extra Virgin',
      rating: 4.6,
      inStock: true
    },
    {
      id: '15',
      name: 'Sourdough Bread',
      price: 4.49,
      image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&h=400&fit=crop',
      category: 'bakery',
      brand: 'Artisan Loaves',
      rating: 4.8,
      inStock: true
    },
    {
      id: '16',
      name: 'Bell Peppers Mix',
      price: 2.49,
      image: '/bell.png',
      category: 'fruits',
      brand: 'Garden Fresh',
      rating: 4.1,
      inStock: true
    },
    {
      id: '17',
      name: 'Organic Butter',
      price: 3.99,
      image: '/butter.png',
      category: 'dairy',
      brand: 'Land O\'Lakes',
      rating: 4.4,
      inStock: true
    },
    {
      id: '18',
      name: 'Quinoa Grains',
      price: 5.99,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
      category: 'pantry',
      brand: 'Organic Grains',
      rating: 4.5,
      inStock: true
    },
    {
      id: '19',
      name: 'Fresh Tomatoes',
      price: 3.29,
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=400&fit=crop',
      category: 'fruits',
      brand: 'Garden Fresh',
      rating: 4.3,
      inStock: true
    },
    {
      id: '20',
      name: 'Pasta Penne',
      price: 2.49,
      image: 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=400&h=400&fit=crop',
      category: 'pantry',
      brand: 'Barilla',
      rating: 4.2,
      inStock: true
    },
    {
      id: '21',
      name: 'Orange Juice',
      price: 3.79,
      image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop',
      category: 'dairy',
      brand: 'Tropicana',
      rating: 4.4,
      inStock: true
    },
    {
      id: '22',
      name: 'Chocolate Cookies',
      price: 4.29,
      image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop',
      category: 'bakery',
      brand: 'Pepperidge Farm',
      rating: 4.6,
      inStock: true
    },
    {
      id: '23',
      name: 'Green Broccoli',
      price: 2.99,
      image: '/brocoli.png',
      category: 'fruits',
      brand: 'Fresh Market',
      rating: 4.1,
      inStock: true
    },
    {
      id: '24',
      name: 'Ice Cream Vanilla',
      price: 5.49,
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop',
      category: 'dairy',
      brand: 'Häagen-Dazs',
      rating: 4.7,
      inStock: true
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'fruits', label: 'Fruits & Vegetables' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'meat', label: 'Meat & Seafood' },
    { value: 'bakery', label: 'Bakery' },
    { value: 'pantry', label: 'Pantry' }
  ];

  // Simulate real-time backend connection
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random team member activity
      const activities = [
        'Deepanshi added Fresh Strawberries to cart',
        'Anshumaan updated budget to $150',
        'Anshuman removed Pasta Sauce from cart',
        'Deepanshi increased Fresh Milk quantity',
        'Anshumaan added Extra Virgin Olive Oil to cart'
      ];
      
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      setLastActivity(randomActivity);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Simulate adding items from other team members
  useEffect(() => {
    const simulateActivity = setInterval(() => {
      if (Math.random() > 0.7) {
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        const randomAction = Math.random() > 0.5 ? 'add' : 'remove';
        
        if (randomAction === 'add' && randomProduct.inStock) {
          setCartItems(prev => ({
            ...prev,
            [randomProduct.id]: Math.min((prev[randomProduct.id] || 0) + 1, 5)
          }));
          
          toast({
            title: "Item Added by Team Member",
            description: `Someone added ${randomProduct.name} to the cart`,
            duration: 3000,
          });
        }
      }
    }, 15000);

    return () => clearInterval(simulateActivity);
  }, [products, toast]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setCartItems(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));

    // Update current user's spent amount
    setTeamMembers(prev => prev.map(member => 
      member.name === 'You' 
        ? { ...member, spent: member.spent + product.price }
        : member
    ));
    
    toast({
      title: "Added to CoCart",
      description: `${product.name} added successfully`,
      duration: 2000,
    });
  };

  const removeFromCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product || !cartItems[productId]) return;

    setCartItems(prev => ({
      ...prev,
      [productId]: Math.max((prev[productId] || 0) - 1, 0)
    }));

    // Update current user's spent amount
    if (cartItems[productId] > 0) {
      setTeamMembers(prev => prev.map(member => 
        member.name === 'You' 
          ? { ...member, spent: Math.max(member.spent - product.price, 0) }
          : member
      ));
    }
    
    toast({
      title: "Removed from CoCart",
      description: `${product.name} quantity decreased`,
      duration: 2000,
    });
  };

  const getTotalCartValue = () => {
    return Object.entries(cartItems).reduce((total, [productId, quantity]) => {
      const product = products.find(p => p.id === productId);
      return total + (product ? product.price * quantity : 0);
    }, 0);
  };

  const getBudgetProgress = (member: TeamMember) => {
    return (member.spent / member.budget) * 100;
  };

  if (!coCartCode) {
    navigate('/cocart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/cocart')}
              className="text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to CoCart
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{coCartName}</h1>
              <div className="flex items-center space-x-4">
                <p className="text-gray-600">Code: {coCartCode}</p>
                {lastActivity && (
                  <p className="text-xs text-blue-600 flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {lastActivity}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Share2 className="w-4 h-4 mr-2" />
                Share Code
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Your CoCart</DialogTitle>
                <DialogDescription>
                  Share this code with family and friends to let them join your collaborative cart.
                </DialogDescription>
              </DialogHeader>
              <div className="text-center py-4">
                <div className="text-4xl font-bold text-blue-600 tracking-wider mb-2">{coCartCode}</div>
                <p className="text-gray-500">6-digit sharing code</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Section - Team Members */}
          <div className="lg:col-span-4">
            <div className="sticky top-6 space-y-6">
              <Card className="">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="w-5 h-5 mr-2 text-blue-600" />
                      Team Members ({teamMembers.length})
                    </div>
                  </CardTitle>
                  <CardDescription>
                    Budget tracking for all members • Total budget: ${teamMembers.reduce((sum, m) => sum + m.budget, 0)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 max-h-80 overflow-y-auto">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                            {member.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{member.name}</span>
                            {member.isCreator && <Badge variant="secondary" className="text-xs">Creator</Badge>}
                          </div>
                          <div className="text-sm text-gray-600">
                            ${member.spent.toFixed(2)} / ${member.budget.toFixed(2)}
                            {member.spent > member.budget && (
                              <span className="text-red-600 ml-2 text-xs">Over budget!</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right min-w-[80px]">
                        <div className={`text-sm font-medium ${member.spent > member.budget ? 'text-red-600' : 'text-green-600'}`}>
                          ${Math.abs(member.budget - member.spent).toFixed(2)} {member.spent > member.budget ? 'over' : 'left'}
                        </div>
                        <Progress 
                          value={Math.min(getBudgetProgress(member), 100)} 
                          className="w-16 h-2 mt-1"
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Cart Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ShoppingCart className="w-5 h-5 mr-2 text-blue-600" />
                      Cart Summary
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {Object.values(cartItems).reduce((sum, qty) => sum + qty, 0)} items
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {Object.entries(cartItems).filter(([_, quantity]) => quantity > 0).map(([productId, quantity]) => {
                      const product = products.find(p => p.id === productId);
                      if (!product) return null;
                      return (
                        <div key={productId} className="flex justify-between text-sm items-center p-2 hover:bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            <img src={product.image} alt={product.name} className="w-8 h-8 rounded object-cover" />
                            <span>{product.name} x{quantity}</span>
                          </div>
                          <span className="font-medium">${(product.price * quantity).toFixed(2)}</span>
                        </div>
                      );
                    })}
                    {Object.values(cartItems).every(q => q === 0) && (
                      <div className="text-center py-8">
                        <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">No items in cart yet</p>
                        <p className="text-xs text-gray-400">Start adding products to see them here</p>
                      </div>
                    )}
                    {Object.values(cartItems).some(q => q > 0) && (
                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Total:</span>
                          <span className="text-blue-600">${getTotalCartValue().toFixed(2)}</span>
                        </div>
                        <Button className="w-full mt-3 bg-blue-600 hover:bg-blue-700">
                          Proceed to Checkout
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Section - Products */}
          <div className="lg:col-span-8">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Products Grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <Card key={product.id} className={`overflow-hidden ${!product.inStock ? 'opacity-60' : ''}`}>
                  <CardContent className="p-0">
                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant={product.inStock ? "secondary" : "destructive"} className="text-xs">
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                      <p className="text-xs text-gray-600 mb-2">{product.brand}</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-blue-600">${product.price}</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-400">★</span>
                          <span className="text-xs text-gray-500">{product.rating}</span>
                        </div>
                      </div>
                      
                      {product.inStock && (
                        <div className="flex items-center justify-between">
                          {cartItems[product.id] > 0 ? (
                            <div className="flex items-center space-x-2 w-full">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => removeFromCart(product.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="flex-1 text-center font-medium">{cartItems[product.id]}</span>
                              <Button
                                size="sm"
                                onClick={() => addToCart(product.id)}
                                className="h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => addToCart(product.id)}
                              className="w-full bg-blue-600 hover:bg-blue-700"
                            >
                              Add to Cart
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No products found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoCartProducts;
