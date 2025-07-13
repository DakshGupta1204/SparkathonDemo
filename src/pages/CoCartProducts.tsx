import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Minus, Users, DollarSign, Share2, ShoppingCart, ArrowLeft, Wifi, WifiOff, CheckCircle, ThumbsUp, Clock, AlertCircle } from 'lucide-react';
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
import { motion, AnimatePresence } from 'framer-motion';

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  budget: number;
  spent: number;
  isCreator: boolean;
  approvedCart: boolean;
  lastActivity?: string;
  isActive?: boolean;
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

interface CartActivity {
  id: string;
  memberName: string;
  action: 'added' | 'removed' | 'updated';
  productName: string;
  quantity?: number;
  timestamp: Date;
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
  const [cartActivities, setCartActivities] = useState<CartActivity[]>([]);
  const [cartApproved, setCartApproved] = useState(false);
  const [userApprovedCart, setUserApprovedCart] = useState(false);
  const [approvalInProgress, setApprovalInProgress] = useState(false);
  
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
      isCreator: isCreator,
      approvedCart: false,
      isActive: true
    },
    {
      id: '2',
      name: 'Deepanshi',
      avatar: '',
      budget: 80,
      spent: 0,
      isCreator: false,
      approvedCart: true, // Already approved before user
      lastActivity: 'Added Fresh Strawberries',
      isActive: true
    },
    {
      id: '3',
      name: 'Anshumaan',
      avatar: '',
      budget: 120,
      spent: 0,
      isCreator: false,
      approvedCart: false,
      lastActivity: 'Updated budget',
      isActive: Math.random() > 0.3
    },
    {
      id: '4',
      name: 'Anshuman',
      avatar: '',
      budget: 90,
      spent: 0,
      isCreator: false,
      approvedCart: false,
      lastActivity: 'Viewing products',
      isActive: Math.random() > 0.3
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

  // Simulate real-time backend connection and member activities
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random team member activity
      const activities = [
        { member: 'Deepanshi', action: 'added', item: 'Fresh Strawberries' },
        { member: 'Anshumaan', action: 'updated', item: 'budget to $150' },
        { member: 'Anshuman', action: 'removed', item: 'Pasta Sauce' },
        { member: 'Deepanshi', action: 'increased', item: 'Fresh Milk quantity' },
        { member: 'Anshumaan', action: 'added', item: 'Extra Virgin Olive Oil' },
        { member: 'Anshuman', action: 'viewed', item: 'Chicken Breast details' },
        { member: 'Deepanshi', action: 'updated', item: 'delivery preferences' }
      ];
      
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      const activityText = `${randomActivity.member} ${randomActivity.action} ${randomActivity.item}`;
      setLastActivity(activityText);
      
      // Update member's last activity and active status
      setTeamMembers(prev => prev.map(member => {
        if (member.name === randomActivity.member) {
          return { 
            ...member, 
            lastActivity: `${randomActivity.action} ${randomActivity.item}`,
            isActive: true
          };
        }
        return { ...member, isActive: Math.random() > 0.4 };
      }));
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Simulate adding/removing items from other team members with visual updates
  useEffect(() => {
    const simulateActivity = setInterval(() => {
      if (Math.random() > 0.5) {
        const availableProducts = products.filter(p => p.inStock);
        const randomProduct = availableProducts[Math.floor(Math.random() * availableProducts.length)];
        const randomMember = ['Deepanshi', 'Anshumaan', 'Anshuman'][Math.floor(Math.random() * 3)];
        
        // Determine action based on current cart state
        const currentQuantity = cartItems[randomProduct.id] || 0;
        const shouldAdd = currentQuantity === 0 || (currentQuantity < 3 && Math.random() > 0.4);
        const randomAction = shouldAdd ? 'added' : 'removed';
        
        if (randomAction === 'added' && randomProduct.inStock) {
          const quantityToAdd = Math.floor(Math.random() * 2) + 1; // Add 1-2 items
          
          setCartItems(prev => ({
            ...prev,
            [randomProduct.id]: Math.min((prev[randomProduct.id] || 0) + quantityToAdd, 5)
          }));
          
          // Update the team member's spent amount
          setTeamMembers(prev => prev.map(member => 
            member.name === randomMember 
              ? { 
                  ...member, 
                  spent: member.spent + (randomProduct.price * quantityToAdd),
                  lastActivity: `Added ${randomProduct.name}`,
                  isActive: true
                }
              : member
          ));
          
          // Add to activity log
          const newActivity: CartActivity = {
            id: Date.now().toString(),
            memberName: randomMember,
            action: 'added',
            productName: randomProduct.name,
            quantity: quantityToAdd,
            timestamp: new Date()
          };
          
          setCartActivities(prev => [newActivity, ...prev.slice(0, 9)]); // Keep last 10 activities
          
          toast({
            title: `🛒 ${randomMember} added to cart`,
            description: `${randomProduct.name} ${quantityToAdd > 1 ? `(x${quantityToAdd})` : ''} - $${(randomProduct.price * quantityToAdd).toFixed(2)}`,
            duration: 4000,
          });
          
        } else if (randomAction === 'removed' && currentQuantity > 0) {
          const quantityToRemove = Math.min(Math.floor(Math.random() * currentQuantity) + 1, currentQuantity);
          
          setCartItems(prev => ({
            ...prev,
            [randomProduct.id]: Math.max((prev[randomProduct.id] || 0) - quantityToRemove, 0)
          }));
          
          // Update the team member's spent amount
          setTeamMembers(prev => prev.map(member => 
            member.name === randomMember 
              ? { 
                  ...member, 
                  spent: Math.max(member.spent - (randomProduct.price * quantityToRemove), 0),
                  lastActivity: `Removed ${randomProduct.name}`,
                  isActive: true
                }
              : member
          ));
          
          // Add to activity log
          const newActivity: CartActivity = {
            id: Date.now().toString(),
            memberName: randomMember,
            action: 'removed',
            productName: randomProduct.name,
            quantity: quantityToRemove,
            timestamp: new Date()
          };
          
          setCartActivities(prev => [newActivity, ...prev.slice(0, 9)]);
          
          toast({
            title: `🗑️ ${randomMember} removed from cart`,
            description: `${randomProduct.name} ${quantityToRemove > 1 ? `(x${quantityToRemove})` : ''} - $${(randomProduct.price * quantityToRemove).toFixed(2)}`,
            duration: 4000,
          });
        }
      }
    }, 7000); // Slightly faster interval for more activity

    return () => clearInterval(simulateActivity);
  }, [products, toast, cartItems, teamMembers]);

  // One-time simulation - Add specific items for each member (no infinite loop)
  useEffect(() => {
    const memberActions = [
      { member: 'Deepanshi', products: ['1', '7'], delay: 3000 }, // 2 items: Bananas, Avocados
      { member: 'Anshumaan', products: ['4'], delay: 8000 }, // 1 item: Chicken Breast
      { member: 'Anshuman', products: ['11'], delay: 13000 } // 1 item: Strawberries
    ];

    const timeouts = memberActions.map(({ member, products: productIds, delay }) => {
      return setTimeout(() => {
        productIds.forEach((productId, index) => {
          setTimeout(() => {
            const product = products.find(p => p.id === productId);
            if (product && product.inStock) {
              const quantityToAdd = 2; // Add 2 of each selected product
              
              setCartItems(prev => ({
                ...prev,
                [productId]: (prev[productId] || 0) + quantityToAdd
              }));
              
              // Update the team member's spent amount
              setTeamMembers(prev => prev.map(m => 
                m.name === member 
                  ? { 
                      ...m, 
                      spent: m.spent + (product.price * quantityToAdd),
                      lastActivity: `Added ${product.name} (x${quantityToAdd})`,
                      isActive: true
                    }
                  : m
              ));
              
              // Add to activity log
              const newActivity: CartActivity = {
                id: (Date.now() + index).toString(),
                memberName: member,
                action: 'added',
                productName: product.name,
                quantity: quantityToAdd,
                timestamp: new Date()
              };
              
              setCartActivities(prev => [newActivity, ...prev.slice(0, 9)]);
              
              toast({
                title: `🛒 ${member} added items`,
                description: `${product.name} (x${quantityToAdd}) - $${(product.price * quantityToAdd).toFixed(2)}`,
                duration: 4000,
              });
            }
          }, index * 2000); // 2 second delay between each product
        });
      }, delay);
    });

    // Cleanup timeouts on unmount
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, []); // Empty dependency array - runs only once on mount

  // Handle cart approval process
  const handleApproveCart = () => {
    setUserApprovedCart(true);
    setApprovalInProgress(true);
    
    // Update user's approval status
    setTeamMembers(prev => prev.map(member => 
      member.name === 'You' 
        ? { ...member, approvedCart: true }
        : member
    ));
    
    toast({
      title: "Cart Approved!",
      description: "Waiting for other members to approve...",
      duration: 3000,
    });
    
    // Simulate other members approving one by one
    setTimeout(() => {
      setTeamMembers(prev => prev.map(member => 
        member.name === 'Anshumaan' 
          ? { ...member, approvedCart: true }
          : member
      ));
      
      toast({
        title: "Anshumaan approved!",
        description: "Waiting for Anshuman...",
        duration: 3000,
      });
    }, 2000);
    
    setTimeout(() => {
      setTeamMembers(prev => prev.map(member => 
        member.name === 'Anshuman' 
          ? { ...member, approvedCart: true }
          : member
      ));
      
      setCartApproved(true);
      setApprovalInProgress(false);
      
      toast({
        title: "All members approved! 🎉",
        description: "Cart is ready for checkout",
        duration: 4000,
      });
    }, 4000);
  };

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
    
    // Add to activity log for your own actions
    const newActivity: CartActivity = {
      id: Date.now().toString(),
      memberName: 'You',
      action: 'added',
      productName: product.name,
      quantity: 1,
      timestamp: new Date()
    };
    
    setCartActivities(prev => [newActivity, ...prev.slice(0, 9)]);
    
    toast({
      title: "Added to CoCart",
      description: `${product.name} added successfully - $${product.price.toFixed(2)}`,
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
      
      // Add to activity log for your own actions
      const newActivity: CartActivity = {
        id: Date.now().toString(),
        memberName: 'You',
        action: 'removed',
        productName: product.name,
        quantity: 1,
        timestamp: new Date()
      };
      
      setCartActivities(prev => [newActivity, ...prev.slice(0, 9)]);
    }
    
    toast({
      title: "Removed from CoCart",
      description: `${product.name} quantity decreased - $${product.price.toFixed(2)}`,
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
                    <div className="flex items-center space-x-1">
                      {teamMembers.filter(m => m.approvedCart).length === teamMembers.length && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
                        >
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            All Approved
                          </Badge>
                        </motion.div>
                      )}
                    </div>
                  </CardTitle>
                  <CardDescription>
                    Budget tracking for all members • Total budget: ${teamMembers.reduce((sum, m) => sum + m.budget, 0)}
                    {approvalInProgress && (
                      <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="block text-orange-600 mt-1"
                      >
                        <Clock className="w-3 h-3 inline mr-1" />
                        Approval in progress...
                      </motion.span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 max-h-48 overflow-y-auto">
                  <AnimatePresence>
                    {teamMembers.map((member, index) => (
                      <motion.div 
                        key={member.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Avatar>
                              <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                                {member.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            {member.isActive && (
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                              />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{member.name}</span>
                              {member.isCreator && <Badge variant="secondary" className="text-xs">Creator</Badge>}
                              {member.approvedCart && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: "spring", stiffness: 500 }}
                                >
                                  <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                                    <ThumbsUp className="w-2 h-2 mr-1" />
                                    Approved
                                  </Badge>
                                </motion.div>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">
                              ${member.spent.toFixed(2)} / ${member.budget.toFixed(2)}
                              {member.spent > member.budget && (
                                <span className="text-red-600 ml-2 text-xs">Over budget!</span>
                              )}
                            </div>
                            {member.lastActivity && (
                              <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-xs text-blue-600 mt-1"
                              >
                                {member.lastActivity}
                              </motion.div>
                            )}
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
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </CardContent>
              </Card>

              {/* Cart Summary */}
              <Card data-cart-summary>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ShoppingCart className="w-5 h-5 mr-2 text-blue-600" />
                      Cart Summary
                    </div>
                    <motion.div
                      key={Object.values(cartItems).reduce((sum, qty) => sum + qty, 0)}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      <Badge variant="outline" className="text-xs">
                        {Object.values(cartItems).reduce((sum, qty) => sum + qty, 0)} items
                      </Badge>
                    </motion.div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    <AnimatePresence>
                      {Object.entries(cartItems).filter(([_, quantity]) => quantity > 0).map(([productId, quantity]) => {
                        const product = products.find(p => p.id === productId);
                        if (!product) return null;
                        return (
                          <motion.div 
                            key={productId}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            whileHover={{ scale: 1.02 }}
                            className="flex justify-between text-sm items-center p-2 hover:bg-gray-50 rounded border-l-2 border-transparent hover:border-blue-200 transition-all"
                          >
                            <div className="flex items-center space-x-2">
                              <img src={product.image} alt={product.name} className="w-8 h-8 rounded object-cover" />
                              <span>{product.name} x{quantity}</span>
                            </div>
                            <span className="font-medium">${(product.price * quantity).toFixed(2)}</span>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                    
                    {Object.values(cartItems).every(q => q === 0) && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8"
                      >
                        <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">No items in cart yet</p>
                        <p className="text-xs text-gray-400">Start adding products to see them here</p>
                      </motion.div>
                    )}
                    
                    {Object.values(cartItems).some(q => q > 0) && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border-t pt-3 mt-3"
                      >
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Total:</span>
                          <motion.span 
                            key={getTotalCartValue()}
                            initial={{ scale: 1.1, color: "#3b82f6" }}
                            animate={{ scale: 1, color: "#3b82f6" }}
                            transition={{ type: "spring", stiffness: 500 }}
                            className="text-blue-600"
                          >
                            ${getTotalCartValue().toFixed(2)}
                          </motion.span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Cart Approval Section - Outside of scrollable area */}
              <AnimatePresence>
                {Object.values(cartItems).some(q => q > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        {!userApprovedCart ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-3 bg-orange-50 border border-orange-200 rounded-lg"
                          >
                            <div className="flex items-center mb-2">
                              <AlertCircle className="w-4 h-4 text-orange-600 mr-2" />
                              <span className="text-sm font-medium text-orange-800">
                                Cart approval required
                              </span>
                            </div>
                            <p className="text-xs text-orange-700 mb-3">
                              All team members must approve the cart before checkout
                            </p>
                            <Button 
                              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                              onClick={handleApproveCart}
                              disabled={approvalInProgress}
                            >
                              {approvalInProgress ? (
                                <>
                                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                                  Approving...
                                </>
                              ) : (
                                <>
                                  <ThumbsUp className="w-4 h-4 mr-2" />
                                  Approve Cart
                                </>
                              )}
                            </Button>
                          </motion.div>
                        ) : cartApproved ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 500 }}
                          >
                            <Button 
                              className="w-full bg-green-600 hover:bg-green-700"
                              onClick={() => navigate('/payment')}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Proceed to Checkout
                            </Button>
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center"
                          >
                            <p className="text-sm text-blue-700">
                              ✓ You approved • Waiting for others...
                            </p>
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Recent Activity Feed */}
              {cartActivities.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-24 overflow-y-auto">
                        <AnimatePresence>
                          {cartActivities.slice(0, 5).map((activity, index) => (
                            <motion.div
                              key={activity.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ delay: index * 0.1 }}
                              className="text-xs text-gray-600 p-2 bg-gray-50 rounded"
                            >
                              <span className="font-medium text-blue-600">{activity.memberName}</span>
                              {' '}{activity.action} {activity.productName}
                              <span className="text-gray-400 ml-2">
                                {activity.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
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
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid md:grid-cols-2 xl:grid-cols-3 gap-4"
            >
              <AnimatePresence>
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                    className={`${!product.inStock ? 'opacity-60' : ''}`}
                  >
                    <Card className="overflow-hidden h-full">
                      <CardContent className="p-0">
                        <div className="aspect-square bg-gray-100 relative overflow-hidden">
                          <motion.img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                          />
                          <div className="absolute top-2 right-2">
                            <Badge variant={product.inStock ? "secondary" : "destructive"} className="text-xs">
                              {product.inStock ? 'In Stock' : 'Out of Stock'}
                            </Badge>
                          </div>
                          {cartItems[product.id] > 0 && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-2 left-2 bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                            >
                              {cartItems[product.id]}
                            </motion.div>
                          )}
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
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="flex items-center space-x-2 w-full"
                                >
                                  <motion.div whileTap={{ scale: 0.95 }}>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => removeFromCart(product.id)}
                                      className="h-8 w-8 p-0"
                                    >
                                      <Minus className="w-4 h-4" />
                                    </Button>
                                  </motion.div>
                                  <motion.span 
                                    key={cartItems[product.id]}
                                    initial={{ scale: 1.2 }}
                                    animate={{ scale: 1 }}
                                    className="flex-1 text-center font-medium"
                                  >
                                    {cartItems[product.id]}
                                  </motion.span>
                                  <motion.div whileTap={{ scale: 0.95 }}>
                                    <Button
                                      size="sm"
                                      onClick={() => addToCart(product.id)}
                                      className="h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700"
                                    >
                                      <Plus className="w-4 h-4" />
                                    </Button>
                                  </motion.div>
                                </motion.div>
                              ) : (
                                <motion.div whileTap={{ scale: 0.95 }} className="w-full">
                                  <Button
                                    size="sm"
                                    onClick={() => addToCart(product.id)}
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                  >
                                    Add to Cart
                                  </Button>
                                </motion.div>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

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
