import { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, Plus, Minus, Trash2, Heart, Share2, Users, Star, Filter, Search, Tag, Zap, Gift, Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { motion, AnimatePresence } from 'framer-motion';

interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  brand: string;
  category: string;
  inStock: boolean;
  rating: number;
  addedBy?: string;
  addedAt: Date;
  isWishlisted?: boolean;
}

interface PromoCode {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  description: string;
}

interface SharedCart {
  id: string;
  name: string;
  code: string;
  memberCount: number;
  totalItems: number;
  totalValue: number;
  lastActivity: string;
  members: string[];
}

const Cart = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [sortBy, setSortBy] = useState('recent');
  const [filterBy, setFilterBy] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCoCartDialogOpen, setIsCoCartDialogOpen] = useState(false);
  const [selectedCoCart, setSelectedCoCart] = useState<string | null>(null);

  // Mock promo codes
  const promoCodes: PromoCode[] = [
    { code: 'WALMART10', discount: 10, type: 'percentage', description: '10% off your order' },
    { code: 'SAVE5', discount: 5, type: 'fixed', description: '$5 off your order' },
    { code: 'NEWUSER', discount: 15, type: 'percentage', description: '15% off for new users' }
  ];

  // Mock shared carts
  const sharedCarts: SharedCart[] = [
    {
      id: '1',
      name: 'Family Groceries',
      code: 'FAM123',
      memberCount: 4,
      totalItems: 12,
      totalValue: 89.45,
      lastActivity: '2 hours ago',
      members: ['You', 'Deepanshi', 'Anshumaan', 'Anshuman']
    },
    {
      id: '2',
      name: 'Office Snacks',
      code: 'OFF456',
      memberCount: 6,
      totalItems: 8,
      totalValue: 34.20,
      lastActivity: '1 day ago',
      members: ['You', 'Deepanshi', 'Anshumaan', 'Anshuman', 'Sarah', 'Mike']
    },
    {
      id: '3',
      name: 'Weekend Party',
      code: 'PTY789',
      memberCount: 3,
      totalItems: 15,
      totalValue: 156.78,
      lastActivity: '3 hours ago',
      members: ['You', 'Deepanshi', 'Anshumaan']
    }
  ];

  // Mock cart data
  useEffect(() => {
    // Check if there are items in localStorage first
    const savedCartItems = localStorage.getItem('cartItems');
    
    if (savedCartItems) {
      try {
        const parsedItems = JSON.parse(savedCartItems);
        if (parsedItems.length > 0) {
          // Convert saved items to proper format with Date objects
          const formattedItems = parsedItems.map((item: any) => ({
            ...item,
            addedAt: new Date(item.addedAt)
          }));
          setCartItems(formattedItems);
          setSelectedItems(formattedItems.map((item: any) => item.id));
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error parsing cart items from localStorage:', error);
      }
    }

    // Fallback to mock data if no items in localStorage
    const mockCartItems: CartItem[] = [
      {
        id: '1',
        name: 'Organic Bananas',
        price: 2.99,
        originalPrice: 3.49,
        quantity: 3,
        image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop',
        brand: 'Fresh Market',
        category: 'Fruits',
        inStock: true,
        rating: 4.5,
        addedBy: 'You',
        addedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isWishlisted: false
      },
      {
        id: '2',
        name: 'Greek Yogurt',
        price: 5.99,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop',
        brand: 'Chobani',
        category: 'Dairy',
        inStock: true,
        rating: 4.8,
        addedBy: 'Deepanshi',
        addedAt: new Date(Date.now() - 30 * 60 * 1000),
        isWishlisted: true
      },
      {
        id: '3',
        name: 'Salmon Fillet',
        price: 12.99,
        originalPrice: 15.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=400&fit=crop',
        brand: 'Fresh Catch',
        category: 'Seafood',
        inStock: false,
        rating: 4.7,
        addedBy: 'Anshumaan',
        addedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        isWishlisted: false
      },
      {
        id: '4',
        name: 'Whole Wheat Bread',
        price: 3.49,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop',
        brand: 'Wonder Bread',
        category: 'Bakery',
        inStock: true,
        rating: 4.2,
        addedBy: 'You',
        addedAt: new Date(Date.now() - 10 * 60 * 1000),
        isWishlisted: false
      }
    ];

    setTimeout(() => {
      setCartItems(mockCartItems);
      setSelectedItems(mockCartItems.map(item => item.id));
      setIsLoading(false);
    }, 1000);
  }, []);

  // Calculations
  const subtotal = cartItems
    .filter(item => selectedItems.includes(item.id))
    .reduce((total, item) => total + (item.price * item.quantity), 0);

  const savings = cartItems
    .filter(item => selectedItems.includes(item.id) && item.originalPrice)
    .reduce((total, item) => total + ((item.originalPrice! - item.price) * item.quantity), 0);

  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 4.99;
  
  let discount = 0;
  if (appliedPromo) {
    discount = appliedPromo.type === 'percentage' 
      ? subtotal * (appliedPromo.discount / 100)
      : appliedPromo.discount;
  }

  const total = subtotal + tax + shipping - discount;

  // Handlers
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    
    setCartItems(prev => {
      const updatedItems = prev.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      // Save to localStorage
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      // Dispatch custom event to update header
      window.dispatchEvent(new Event('cartUpdated'));
      return updatedItems;
    });
    
    toast({
      title: "Quantity updated",
      description: `Updated to ${newQuantity} items`,
      duration: 2000,
    });
  };

  const removeItem = (id: string) => {
    const item = cartItems.find(item => item.id === id);
    setCartItems(prev => {
      const updatedItems = prev.filter(item => item.id !== id);
      // Save to localStorage
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      // Dispatch custom event to update header
      window.dispatchEvent(new Event('cartUpdated'));
      return updatedItems;
    });
    setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    
    toast({
      title: "Item removed",
      description: `${item?.name} removed from cart`,
      duration: 3000,
    });
  };

  const toggleWishlist = (id: string) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isWishlisted: !item.isWishlisted } : item
      )
    );
  };

  const applyPromoCode = () => {
    const promo = promoCodes.find(p => p.code.toLowerCase() === promoCode.toLowerCase());
    if (promo) {
      setAppliedPromo(promo);
      toast({
        title: "Promo code applied!",
        description: promo.description,
        duration: 3000,
      });
    } else {
      toast({
        title: "Invalid promo code",
        description: "Please check your code and try again",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const selectAllItems = () => {
    setSelectedItems(cartItems.map(item => item.id));
  };

  const deselectAllItems = () => {
    setSelectedItems([]);
  };

  const handleCoCartSelection = (cartId: string) => {
    const selectedCart = sharedCarts.find(cart => cart.id === cartId);
    if (selectedCart) {
      // Store the selected cart info in localStorage
      localStorage.setItem('coCartCode', selectedCart.code);
      localStorage.setItem('coCartName', selectedCart.name);
      localStorage.setItem('isCoCartCreator', 'false');
      
      // Get current cart items that are selected
      const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.id));
      
      // Convert cart items to the format expected by CoCartProducts
      const coCartItems = selectedCartItems.reduce((acc, item) => {
        acc[item.id] = item.quantity;
        return acc;
      }, {} as {[key: string]: number});
      
      // Store the cart items in localStorage so they appear in CoCartProducts
      localStorage.setItem('coCartItems', JSON.stringify(coCartItems));
      
      // Also store the product details for reference
      const productDetails = selectedCartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        originalPrice: item.originalPrice,
        image: item.image,
        brand: item.brand,
        category: item.category,
        inStock: item.inStock,
        rating: item.rating
      }));
      localStorage.setItem('coCartProductDetails', JSON.stringify(productDetails));
      
      toast({
        title: "Items added to CoCart!",
        description: `${selectedCartItems.length} items added to ${selectedCart.name}`,
        duration: 3000,
      });
      
      setIsCoCartDialogOpen(false);
      
      // Navigate to CoCart products page
      navigate('/cocart/products');
    }
  };

  // Filter and sort items
  const filteredItems = cartItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterBy === 'all' || 
                         (filterBy === 'instock' && item.inStock) ||
                         (filterBy === 'outofstock' && !item.inStock) ||
                         (filterBy === 'wishlist' && item.isWishlisted);
    return matchesSearch && matchesFilter;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price':
        return a.price - b.price;
      case 'recent':
        return b.addedAt.getTime() - a.addedAt.getTime();
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="rounded-full h-12 w-12 border-b-2 border-blue-600"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <ShoppingCart className="w-8 h-8 mr-3 text-blue-600" />
                Shopping Cart
              </h1>
              <p className="text-gray-600 mt-1">
                {cartItems.length} items • ${subtotal.toFixed(2)} subtotal
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Dialog open={isCoCartDialogOpen} onOpenChange={setIsCoCartDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  CoCart Mode
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-600" />
                    Select a Shared Cart
                  </DialogTitle>
                  <DialogDescription>
                    Choose a CoCart to add your selected items ({selectedItems.length} items) to collaborate with others.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {sharedCarts.map((cart) => (
                    <motion.div
                      key={cart.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedCoCart === cart.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedCoCart(cart.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-semibold text-lg">{cart.name}</h3>
                                <Badge variant="secondary" className="text-xs">
                                  {cart.code}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <Users className="w-4 h-4 mr-1" />
                                  {cart.memberCount} members
                                </div>
                                <div className="flex items-center">
                                  <ShoppingCart className="w-4 h-4 mr-1" />
                                  {cart.totalItems} items
                                </div>
                                <div className="flex items-center">
                                  <Tag className="w-4 h-4 mr-1" />
                                  ${cart.totalValue.toFixed(2)}
                                </div>
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {cart.lastActivity}
                                </div>
                              </div>
                              
                              <div className="mt-3">
                                <p className="text-xs text-gray-500 mb-1">Members:</p>
                                <div className="flex flex-wrap gap-1">
                                  {cart.members.map((member, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {member}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            {selectedCoCart === cart.id && (
                              <div className="ml-4">
                                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full" />
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/cocart')}
                  >
                    Create New CoCart
                  </Button>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      onClick={() => setIsCoCartDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => selectedCoCart && handleCoCartSelection(selectedCoCart)}
                      disabled={!selectedCoCart || selectedItems.length === 0}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Add to CoCart ({selectedItems.length} items)
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Share Cart
            </Button>
          </div>
        </motion.div>

        {cartItems.length === 0 ? (
          // Empty Cart State
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some items to get started!</p>
            <Button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700">
              Start Shopping
            </Button>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Main Cart Section */}
            <div className="lg:col-span-8">
              {/* Filters and Controls */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            placeholder="Search cart items..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recent">Most Recent</SelectItem>
                          <SelectItem value="name">Name A-Z</SelectItem>
                          <SelectItem value="price">Price Low-High</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={filterBy} onValueChange={setFilterBy}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Filter by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Items</SelectItem>
                          <SelectItem value="instock">In Stock</SelectItem>
                          <SelectItem value="outofstock">Out of Stock</SelectItem>
                          <SelectItem value="wishlist">Wishlisted</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm" onClick={selectAllItems}>
                          Select All
                        </Button>
                        <Button variant="outline" size="sm" onClick={deselectAllItems}>
                          Deselect All
                        </Button>
                        <span className="text-sm text-gray-600">
                          {selectedItems.length} of {cartItems.length} selected
                        </span>
                      </div>
                      {savings > 0 && (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          <Tag className="w-3 h-3 mr-1" />
                          You're saving ${savings.toFixed(2)}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Cart Items */}
              <div className="space-y-4">
                <AnimatePresence>
                  {sortedItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <Card className={`overflow-hidden ${!item.inStock ? 'opacity-70' : ''}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-4">
                            {/* Checkbox */}
                            <div className="pt-2">
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(item.id)}
                                onChange={() => toggleSelectItem(item.id)}
                                className="h-4 w-4 text-blue-600 rounded border-gray-300"
                              />
                            </div>

                            {/* Product Image */}
                            <div className="relative">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-24 h-24 object-cover rounded-lg"
                              />
                              {item.originalPrice && (
                                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                  SALE
                                </div>
                              )}
                            </div>

                            {/* Product Details */}
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
                                  <p className="text-sm text-gray-600 mb-1">{item.brand}</p>
                                  <div className="flex items-center space-x-4 mb-2">
                                    <div className="flex items-center">
                                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                      <span className="text-sm text-gray-600 ml-1">{item.rating}</span>
                                    </div>
                                    <Badge variant="secondary" className="text-xs">
                                      {item.category}
                                    </Badge>
                                    {item.addedBy && (
                                      <span className="text-xs text-gray-500">Added by {item.addedBy}</span>
                                    )}
                                  </div>
                                  
                                  {!item.inStock && (
                                    <Badge variant="destructive" className="text-xs">
                                      Out of Stock
                                    </Badge>
                                  )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleWishlist(item.id)}
                                    className={item.isWishlisted ? 'text-red-500' : 'text-gray-400'}
                                  >
                                    <Heart className={`w-4 h-4 ${item.isWishlisted ? 'fill-current' : ''}`} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeItem(item.id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>

                              {/* Price and Quantity */}
                              <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center space-x-2">
                                  {item.originalPrice && (
                                    <span className="text-sm text-gray-500 line-through">
                                      ${item.originalPrice.toFixed(2)}
                                    </span>
                                  )}
                                  <span className="text-lg font-bold text-blue-600">
                                    ${item.price.toFixed(2)}
                                  </span>
                                </div>

                                <div className="flex items-center space-x-3">
                                  <div className="flex items-center border border-gray-300 rounded-lg">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                      className="h-8 w-8 p-0 rounded-r-none"
                                    >
                                      <Minus className="w-4 h-4" />
                                    </Button>
                                    <span className="px-4 py-2 text-sm font-medium min-w-[50px] text-center">
                                      {item.quantity}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                      className="h-8 w-8 p-0 rounded-l-none"
                                    >
                                      <Plus className="w-4 h-4" />
                                    </Button>
                                  </div>
                                  <span className="text-lg font-semibold min-w-[80px] text-right">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <ShoppingCart className="w-5 h-5 mr-2 text-blue-600" />
                        Order Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Promo Code */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Promo Code</label>
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Enter code"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            className="flex-1"
                          />
                          <Button onClick={applyPromoCode} size="sm">
                            Apply
                          </Button>
                        </div>
                        {appliedPromo && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-green-600">✓ {appliedPromo.code}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setAppliedPromo(null)}
                              className="text-red-500"
                            >
                              Remove
                            </Button>
                          </div>
                        )}
                      </div>

                      <Separator />

                      {/* Price Breakdown */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal ({selectedItems.length} items)</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>
                        
                        {savings > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Savings</span>
                            <span>-${savings.toFixed(2)}</span>
                          </div>
                        )}
                        
                        {appliedPromo && (
                          <div className="flex justify-between text-green-600">
                            <span>Promo ({appliedPromo.code})</span>
                            <span>-${discount.toFixed(2)}</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between">
                          <span>Tax</span>
                          <span>${tax.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span>Shipping</span>
                          {shipping === 0 ? (
                            <span className="text-green-600">FREE</span>
                          ) : (
                            <span>${shipping.toFixed(2)}</span>
                          )}
                        </div>
                      </div>

                      <Separator />

                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>

                      {/* Benefits */}
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center text-blue-600 mb-2">
                          <Zap className="w-4 h-4 mr-2" />
                          <span className="font-medium">Walmart+ Benefits</span>
                        </div>
                        <ul className="text-sm text-blue-700 space-y-1">
                          {shipping === 0 && <li>• Free shipping on this order</li>}
                          <li>• Member prices on fuel</li>
                          <li>• Free delivery from store</li>
                          <li>• Scan & Go mobile checkout</li>
                        </ul>
                      </div>

                      {/* Checkout Button */}
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
                        onClick={() => navigate('/payment')}
                        disabled={selectedItems.length === 0}
                      >
                        Checkout (${total.toFixed(2)})
                      </Button>

                      {/* Delivery Info */}
                      <div className="text-center text-sm text-gray-600">
                        <div className="flex items-center justify-center mb-1">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>Delivery by tomorrow</span>
                        </div>
                        <p>Order within 2 hours for guaranteed delivery</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
