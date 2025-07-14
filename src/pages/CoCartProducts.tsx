import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Minus, Users, DollarSign, Share2, ShoppingCart, ArrowLeft, Wifi, WifiOff, CheckCircle, ThumbsUp, Clock, AlertCircle, MessageCircle, Send, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
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
  isOnline?: boolean;
  lastSeen?: string;
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

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  message: string;
  timestamp: string;
  type: 'message' | 'cart-update' | 'budget-update' | 'ai-suggestion';
  suggestions?: ProductSuggestion[];
}

interface ProductSuggestion {
  id: string;
  name: string;
  price: number;
  image: string;
  brand: string;
  category: string;
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
  const [itemAddedBy, setItemAddedBy] = useState<{[key: string]: string}>({});
  const [newMemberBudget, setNewMemberBudget] = useState('');
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);
  const [tempBudget, setTempBudget] = useState('100');
  const [isConnected, setIsConnected] = useState(true);
  const [lastActivity, setLastActivity] = useState<string>('');
  const [cartActivities, setCartActivities] = useState<CartActivity[]>([]);
  const [cartApproved, setCartApproved] = useState(false);
  const [userApprovedCart, setUserApprovedCart] = useState(false);
  const [approvalInProgress, setApprovalInProgress] = useState(false);
  const [isCartPopoutOpen, setIsCartPopoutOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isVoiceAgentOpen, setIsVoiceAgentOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceAgentStep, setVoiceAgentStep] = useState<'listening' | 'processing' | 'ready'>('listening');
  const [detectedItems, setDetectedItems] = useState<string[]>([]);
  const [matchedProducts, setMatchedProducts] = useState<Product[]>([]);
  
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
      isActive: true,
      isOnline: true,
      lastSeen: 'now'
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
      isActive: true,
      isOnline: true,
      lastSeen: '2 min ago'
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
      isActive: Math.random() > 0.3,
      isOnline: Math.random() > 0.4,
      lastSeen: '5 min ago'
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
      isActive: Math.random() > 0.3,
      isOnline: Math.random() > 0.5,
      lastSeen: '15 min ago'
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
      name: 'Sony WH-CH720N Headphones',
      price: 20.00,
      image: '/sonyheadphones.jpg',
      category: 'electronics',
      brand: 'Sony',
      rating: 4.4,
      inStock: true
    },
    {
      id: '8',
      name: '6000mAh Portable Power Bank',
      price: 10.00,
      image: '/powerbank.jpg',
      category: 'electronics',
      brand: 'Walmart',
      rating: 4.2,
      inStock: true
    },
    {
      id: '25',
      name: 'Fresh Avocados',
      price: 1.99,
      image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=400&fit=crop',
      category: 'fruits',
      brand: 'Organic Select',
      rating: 4.6,
      inStock: true
    },
    {
      id: '26',
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
    { value: 'pantry', label: 'Pantry' },
    { value: 'electronics', label: 'Electronics' }
  ];

  // Load cart items from localStorage when component mounts
  useEffect(() => {
    const savedCartItems = localStorage.getItem('coCartItems');
    
    if (savedCartItems) {
      try {
        const parsedItems = JSON.parse(savedCartItems);
        setCartItems(parsedItems);
        
        // Set initial addedBy information - simulate collaborative cart
        const initialAddedBy: {[key: string]: string} = {};
        const teamMemberNames = ['You', 'Deepanshi', 'Anshumaan', 'Anshuman'];
        Object.keys(parsedItems).forEach((productId, index) => {
          // Assign items to different team members for realistic CoCart simulation
          initialAddedBy[productId] = teamMemberNames[index % teamMemberNames.length];
        });
        setItemAddedBy(initialAddedBy);
        
        // Calculate user's spent amount based on loaded items
        const userSpent = Object.entries(parsedItems).reduce((total, [productId, quantity]) => {
          const product = products.find(p => p.id === productId);
          return total + (product ? product.price * (quantity as number) : 0);
        }, 0);
        
        // Update user's spent amount in team members
        setTeamMembers(prev => prev.map(member => 
          member.name === 'You' 
            ? { ...member, spent: userSpent }
            : member
        ));
        
        // Don't clear localStorage immediately - keep it for checkout
        // localStorage.removeItem('coCartItems');
        // localStorage.removeItem('coCartProductDetails');
        
        toast({
          title: "Items loaded!",
          description: `${Object.keys(parsedItems).length} items loaded from your cart - $${userSpent.toFixed(2)} spent`,
          duration: 3000,
        });
      } catch (error) {
        console.error('Error loading cart items:', error);
      }
    }
  }, [toast]);

  // Initialize chat messages with predefined conversations
  useEffect(() => {
    const initialMessages: ChatMessage[] = [
      {
        id: '0',
        userId: 'walmart-ai',
        userName: 'WalmartAI',
        userAvatar: '🤖',
        message: '🤖 Hello! I\'m WalmartAI, your shopping assistant. Mention me with @walmartAi followed by what you\'re looking for, and I\'ll help you find products! Try: "@walmartAi milk" or "@walmartAi chicken"',
        timestamp: '5 minutes ago',
        type: 'ai-suggestion'
      },
      {
        id: '1',
        userId: '2',
        userName: 'Deepanshi',
        userAvatar: '',
        message: 'Hey everyone! I added fresh strawberries to our cart. They look really good today!',
        timestamp: '2 minutes ago',
        type: 'cart-update'
      },
      {
        id: '2',
        userId: '3',
        userName: 'Anshumaan',
        userAvatar: '',
        message: 'Great choice! Should we also get some bananas? They\'re on sale.',
        timestamp: '1 minute ago',
        type: 'message'
      },
      {
        id: '3',
        userId: '4',
        userName: 'Anshuman',
        userAvatar: '',
        message: 'I think we need more protein. What about some chicken breast?',
        timestamp: '30 seconds ago',
        type: 'message'
      },
      {
        id: '4',
        userId: '2',
        userName: 'Deepanshi',
        userAvatar: '',
        message: 'Good idea! I\'ll add it to the cart.',
        timestamp: 'Just now',
        type: 'message'
      }
    ];
    setChatMessages(initialMessages);
  }, []);

  // Simulate real-time backend connection and member activities
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random team member activity
      const activities = [
        { member: 'Deepanshi', action: 'added', item: 'Fresh Strawberries', chatMessage: 'Just added strawberries! They look perfect today 🍓' },
        { member: 'Anshumaan', action: 'updated', item: 'budget to $150', chatMessage: 'Increased my budget to $150, we can get more items now!' },
        { member: 'Anshuman', action: 'removed', item: 'Pasta Sauce', chatMessage: 'Removed the pasta sauce, found a better deal elsewhere' },
        { member: 'Deepanshi', action: 'increased', item: 'Fresh Milk quantity', chatMessage: 'Added more milk, we\'ll need it for the week' },
        { member: 'Anshumaan', action: 'added', item: 'Extra Virgin Olive Oil', chatMessage: 'Got some premium olive oil, it\'s on sale!' },
        { member: 'Anshuman', action: 'viewed', item: 'Chicken Breast details', chatMessage: 'Checking the chicken breast, looks fresh and good price' },
        { member: 'Deepanshi', action: 'updated', item: 'delivery preferences', chatMessage: 'Updated delivery for tomorrow morning' }
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

      // Add chat message about the activity (30% chance)
      if (Math.random() > 0.7) {
        const memberData = teamMembers.find(m => m.name === randomActivity.member);
        if (memberData) {
          const chatMessage: ChatMessage = {
            id: Date.now().toString(),
            userId: memberData.id,
            userName: randomActivity.member,
            userAvatar: memberData.avatar,
            message: randomActivity.chatMessage,
            timestamp: 'Just now',
            type: randomActivity.action === 'added' || randomActivity.action === 'removed' ? 'cart-update' : 'message'
          };
          setChatMessages(prev => [...prev, chatMessage]);
        }
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [teamMembers]);

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

          // Add contextual chat message (40% chance)
          if (Math.random() > 0.6) {
            const addMessages = [
              `Added ${randomProduct.name} to the cart! Good choice?`,
              `Just picked up ${quantityToAdd > 1 ? quantityToAdd + ' ' : ''}${randomProduct.name} - looks fresh!`,
              `Got ${randomProduct.name}, this should be good for everyone`,
              `Added ${randomProduct.name} to our list, hope that works!`,
              `${randomProduct.name} is in the cart now 👍`,
              `Just added ${randomProduct.name}, the price looks reasonable`
            ];
            
            const memberData = teamMembers.find(m => m.name === randomMember);
            if (memberData) {
              const chatMessage: ChatMessage = {
                id: (Date.now() + Math.random()).toString(),
                userId: memberData.id,
                userName: randomMember,
                userAvatar: memberData.avatar,
                message: addMessages[Math.floor(Math.random() * addMessages.length)],
                timestamp: 'Just now',
                type: 'cart-update'
              };
              
              setTimeout(() => {
                setChatMessages(prev => [...prev, chatMessage]);
              }, Math.random() * 2000 + 1000); // Random delay 1-3 seconds
            }
          }
          
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

          // Add contextual chat message for removal (35% chance)
          if (Math.random() > 0.65) {
            const removeMessages = [
              `Removed ${randomProduct.name} from cart, changed my mind`,
              `Taking out ${randomProduct.name}, found it cheaper elsewhere`,
              `Removed ${randomProduct.name}, we have enough already`,
              `${randomProduct.name} is out - let's skip it for now`,
              `Took out ${randomProduct.name}, saving some budget`,
              `Changed my mind on ${randomProduct.name}, removing it`
            ];
            
            const memberData = teamMembers.find(m => m.name === randomMember);
            if (memberData) {
              const chatMessage: ChatMessage = {
                id: (Date.now() + Math.random()).toString(),
                userId: memberData.id,
                userName: randomMember,
                userAvatar: memberData.avatar,
                message: removeMessages[Math.floor(Math.random() * removeMessages.length)],
                timestamp: 'Just now',
                type: 'cart-update'
              };
              
              setTimeout(() => {
                setChatMessages(prev => [...prev, chatMessage]);
              }, Math.random() * 2000 + 500); // Random delay 0.5-2.5 seconds
            }
          }
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

  const handleCheckout = () => {
    // Save the current cart state to localStorage before navigating to payment
    localStorage.setItem('coCartItems', JSON.stringify(cartItems));
    
    // Also update the product details with current cart items and addedBy information
    const currentCartProducts = Object.entries(cartItems)
      .filter(([_, quantity]) => quantity > 0)
      .map(([productId, _]) => {
        const product = products.find(p => p.id === productId);
        return product ? {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          brand: product.brand,
          category: product.category,
          inStock: product.inStock,
          rating: product.rating,
          addedBy: itemAddedBy[productId] || 'You' // Use tracked addedBy info
        } : null;
      })
      .filter(Boolean);
    
    localStorage.setItem('coCartProductDetails', JSON.stringify(currentCartProducts));
    
    // Navigate to payment
    navigate('/payment');
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

    // Track that this item was added by current user
    setItemAddedBy(prev => ({
      ...prev,
      [productId]: 'You'
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

    const newQuantity = Math.max((cartItems[productId] || 0) - 1, 0);
    
    setCartItems(prev => ({
      ...prev,
      [productId]: newQuantity
    }));

    // If quantity reaches 0, remove from addedBy tracking
    if (newQuantity === 0) {
      setItemAddedBy(prev => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });
    }

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

  // Budget color logic
  const getBudgetStatusColor = (member: TeamMember) => {
    const remaining = member.budget - member.spent;
    const percentageRemaining = (remaining / member.budget) * 100;
    
    if (member.spent > member.budget) return 'red';
    if (percentageRemaining <= 10) return 'yellow';
    return 'green';
  };

  const getBudgetColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          progress: 'bg-green-500'
        };
      case 'yellow':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200', 
          text: 'text-yellow-800',
          progress: 'bg-yellow-500'
        };
      case 'red':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          progress: 'bg-red-500'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-800',
          progress: 'bg-blue-500'
        };
    }
  };

  // Budget change handlers
  const handleBudgetChange = (newBudget: number) => {
    setTeamMembers(prev => prev.map(member => 
      member.name === 'You' 
        ? { ...member, budget: newBudget }
        : member
    ));
    
    toast({
      title: "Budget Updated",
      description: `Your budget is now $${newBudget.toFixed(2)}`,
      duration: 2000,
    });
  };

  const handleBudgetInputChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      handleBudgetChange(numValue);
    }
  };

  // Chat functions
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: '1',
      userName: 'You',
      userAvatar: '',
      message: newMessage.trim(),
      timestamp: 'Just now',
      type: 'message'
    };

    setChatMessages(prev => [...prev, message]);
    
    // Check if message mentions @walmartAi
    if (newMessage.toLowerCase().includes('@walmartai')) {
      handleWalmartAiResponse(newMessage);
    }
    
    setNewMessage('');

    // Auto-scroll to bottom
    setTimeout(() => {
      const chatContainer = document.getElementById('chat-messages');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  };

  // AI Agent Response Function
  const handleWalmartAiResponse = (userMessage: string) => {
    // Extract search query after @walmartAi
    const aiMentionIndex = userMessage.toLowerCase().indexOf('@walmartai');
    const searchQuery = userMessage.substring(aiMentionIndex + 10).trim();
    
    // Search aliases for better matching
    const searchAliases: { [key: string]: string[] } = {
      'dairy': ['milk', 'cheese', 'yogurt', 'butter'],
      'meat': ['chicken', 'beef', 'protein', 'salmon'],
      'fruits': ['banana', 'apple', 'orange', 'strawberry', 'avocado'],
      'vegetables': ['broccoli', 'tomato', 'pepper', 'veggie'],
      'bread': ['bakery', 'croissant', 'loaf'],
      'pantry': ['rice', 'pasta', 'oil', 'sauce']
    };
    
    // Find matching products based on search query
    const matchingProducts = products.filter(product => {
      if (!searchQuery) return false;
      const query = searchQuery.toLowerCase();
      
      // Direct matches
      const directMatch = (
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
      
      // Alias matches
      const aliasMatch = Object.entries(searchAliases).some(([category, aliases]) => {
        return aliases.some(alias => query.includes(alias)) && 
               (product.category === category || product.name.toLowerCase().includes(category));
      });
      
      // Word-based matches
      const wordMatch = query.split(' ').some(word => 
        word.length > 2 && (
          product.name.toLowerCase().includes(word) ||
          product.brand.toLowerCase().includes(word) ||
          product.category.toLowerCase().includes(word)
        )
      );
      
      return directMatch || aliasMatch || wordMatch;
    }).slice(0, 5); // Limit to 5 suggestions

    // Generate AI response
    setTimeout(() => {
      let aiMessage = '';
      let suggestions: ProductSuggestion[] = [];

      if (matchingProducts.length > 0) {
        aiMessage = `🤖 I found ${matchingProducts.length} product${matchingProducts.length > 1 ? 's' : ''} matching "${searchQuery}". Here are my recommendations:`;
        suggestions = matchingProducts.map(product => ({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          brand: product.brand,
          category: product.category
        }));
      } else {
        const randomSuggestions = [
          'Try searching for "dairy" for milk and cheese products',
          'Search for "protein" to find meat and seafood',
          'Look for "fruits" to see fresh produce',
          'Try "bakery" for bread and pastries',
          'Search "pantry" for cooking essentials'
        ];
        const randomSuggestion = randomSuggestions[Math.floor(Math.random() * randomSuggestions.length)];
        aiMessage = `🤖 Sorry, I couldn't find any products matching "${searchQuery}". ${randomSuggestion}. You can also try more specific terms!`;
      }

      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        userId: 'walmart-ai',
        userName: 'WalmartAI',
        userAvatar: '🤖',
        message: aiMessage,
        timestamp: 'Just now',
        type: 'ai-suggestion',
        suggestions: suggestions
      };

      setChatMessages(prev => [...prev, aiResponse]);

      // Auto-scroll to bottom
      setTimeout(() => {
        const chatContainer = document.getElementById('chat-messages');
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 100);
    }, 1000); // 1 second delay to simulate AI processing
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Voice Agent Functions
  const speak = (text: string) => {
    return new Promise<void>((resolve) => {
      if ('speechSynthesis' in window) {
        setIsSpeaking(true);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        
        utterance.onend = () => {
          setIsSpeaking(false);
          resolve();
        };
        
        utterance.onerror = () => {
          setIsSpeaking(false);
          resolve();
        };
        
        speechSynthesis.speak(utterance);
      } else {
        resolve();
      }
    });
  };

  const startVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      setIsListening(true);
      setVoiceTranscript('');
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        setVoiceTranscript(transcript);
        setIsListening(false);
        processVoiceInput(transcript);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
        speak("Sorry, I couldn't hear you clearly. Please try again.");
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } else {
      toast({
        title: "Voice Recognition Not Supported",
        description: "Your browser doesn't support voice recognition.",
        duration: 3000,
      });
    }
  };

  const processVoiceInput = async (transcript: string) => {
    setVoiceAgentStep('processing');
    
    // Parse shopping list
    const items = extractItemsFromTranscript(transcript);
    setDetectedItems(items);
    
    if (items.length > 0) {
      const products = findMatchingProducts(items);
      setMatchedProducts(products);
      
      if (products.length > 0) {
        await speak(`I found ${products.length} items: ${products.map(p => p.name).join(', ')}. Would you like to add them to your cart?`);
        setVoiceAgentStep('ready');
      } else {
        await speak("I couldn't find any matching products. Please try again with different items.");
        setVoiceAgentStep('listening');
      }
    } else {
      await speak("I didn't detect any items. Please try saying something like: I need apples, bananas, and bread.");
      setVoiceAgentStep('listening');
    }
  };

  const extractItemsFromTranscript = (transcript: string): string[] => {
    const commonItems = ['apple', 'banana', 'bread', 'milk', 'cheese', 'chicken', 'beef', 'rice', 'pasta', 'tomato', 'orange', 'strawberry', 'avocado', 'broccoli', 'butter', 'yogurt', 'salmon', 'croissant', 'cookies'];
    const foundItems: string[] = [];
    
    commonItems.forEach(item => {
      if (transcript.includes(item)) {
        foundItems.push(item);
      }
    });
    
    // Handle plurals and variations
    const itemVariations: {[key: string]: string} = {
      'apples': 'apple',
      'bananas': 'banana',
      'breads': 'bread',
      'tomatoes': 'tomato',
      'oranges': 'orange',
      'strawberries': 'strawberry',
      'avocados': 'avocado',
      'croissants': 'croissant'
    };
    
    Object.entries(itemVariations).forEach(([plural, singular]) => {
      if (transcript.includes(plural) && !foundItems.includes(singular)) {
        foundItems.push(singular);
      }
    });
    
    return foundItems;
  };

  const findMatchingProducts = (items: string[]): Product[] => {
    const matchedProducts: Product[] = [];
    
    items.forEach(item => {
      const matchedProduct = findBestMatchingProduct(item);
      if (matchedProduct) {
        matchedProducts.push(matchedProduct);
      }
    });
    
    return matchedProducts;
  };

  const findBestMatchingProduct = (item: string): Product | null => {
    // Find products that match the item name
    const candidates = products.filter(product => 
      product.name.toLowerCase().includes(item) ||
      product.category.toLowerCase().includes(item)
    );
    
    if (candidates.length === 0) return null;
    
    // Return the first available match (prioritize by stock)
    return candidates.find(product => product.inStock) || candidates[0];
  };

  const addAllItemsToCart = async () => {
    if (matchedProducts.length > 0) {
      await speak(`Adding ${matchedProducts.length} items to your cart now.`);
      
      // Add items to cart with a delay for better UX
      for (let i = 0; i < matchedProducts.length; i++) {
        setTimeout(() => {
          addToCart(matchedProducts[i].id);
        }, i * 300);
      }
      
      setTimeout(() => {
        setIsVoiceAgentOpen(false);
        resetVoiceAgent();
      }, 1500);
    }
  };

  const resetVoiceAgent = () => {
    setVoiceAgentStep('listening');
    setDetectedItems([]);
    setMatchedProducts([]);
    setVoiceTranscript('');
  };

  const handleVoiceAgentToggle = async () => {
    if (!isVoiceAgentOpen) {
      setIsVoiceAgentOpen(true);
      resetVoiceAgent();
      await speak("Hi! I'm your voice shopping assistant. Tell me what items you need and I'll help you add them to your cart. What would you like to buy?");
      setTimeout(() => {
        startVoiceRecognition();
      }, 1000);
    } else {
      setIsVoiceAgentOpen(false);
      speechSynthesis.cancel();
      resetVoiceAgent();
    }
  };

  // Simulate random messages from team members
  useEffect(() => {
    const messageInterval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 10 seconds
        const randomMessages = [
          "Are we still missing anything from the list?",
          "I just checked the budget, we're doing good!",
          "Should we add some snacks for the office?",
          "The strawberries look fresh today 🍓",
          "Let's make sure we have enough for everyone",
          "I can pick up the items on my way to the office",
          "This bread is usually really good",
          "We should consider organic options",
          "How's everyone's budget looking?",
          "Do we need more vegetables? 🥬",
          "The cart total is looking reasonable so far",
          "Should we get some dessert items?",
          "I noticed chicken is on sale today",
          "We might want to stock up on dairy products",
          "Anyone have preferences for brands?",
          "The delivery time looks good for tomorrow",
          "Just checking if we have enough proteins",
          "These prices are pretty competitive!",
          "Should we add more fruits to the cart? 🍎",
          "The yogurt section has some great deals"
        ];
        
        const randomUsers = teamMembers.filter(m => m.name !== 'You' && m.isActive);
        if (randomUsers.length > 0) {
          const randomUser = randomUsers[Math.floor(Math.random() * randomUsers.length)];
          const randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];
          
          const message: ChatMessage = {
            id: Date.now().toString(),
            userId: randomUser.id,
            userName: randomUser.name,
            userAvatar: randomUser.avatar,
            message: randomMessage,
            timestamp: 'Just now',
            type: 'message'
          };

          setChatMessages(prev => [...prev, message]);
        }
      }
    }, 10000); // Every 10 seconds

    return () => clearInterval(messageInterval);
  }, [teamMembers]);

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
          
          <div className="flex items-center space-x-3">
            {/* Budget Button */}
            <Dialog open={isBudgetDialogOpen} onOpenChange={(open) => {
              if (open) {
                setTempBudget((teamMembers.find(m => m.name === 'You')?.budget || 100).toString());
              }
              setIsBudgetDialogOpen(open);
            }}>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-white hover:bg-gray-50">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Budget: ${teamMembers.find(m => m.name === 'You')?.budget || 100}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
                    Set My Budget
                  </DialogTitle>
                  <DialogDescription>
                    Set your personal budget limit for this collaborative cart.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex-1">
                        <Slider
                          value={[parseInt(tempBudget) || 100]}
                          onValueChange={(value) => setTempBudget(value[0].toString())}
                          max={300}
                          min={10}
                          step={5}
                          className="w-full"
                        />
                      </div>
                      <div className="w-20">
                        <Input
                          type="number"
                          value={tempBudget}
                          onChange={(e) => setTempBudget(e.target.value)}
                          className="text-center text-sm h-8"
                          min="10"
                          max="300"
                          step="5"
                        />
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 flex justify-between">
                      <span>$10</span>
                      <span>$300</span>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsBudgetDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        const budgetValue = parseInt(tempBudget) || 100;
                        handleBudgetChange(budgetValue);
                        setIsBudgetDialogOpen(false);
                      }}
                    >
                      Set Budget
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Share Code Button */}
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
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Section - Cart Summary & Team Members */}
          <div className="lg:col-span-4">
            <div className="sticky top-6 space-y-4 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-hide">
              {/* Cart Summary */}
              <Card className="backdrop-blur-sm bg-white/95 border-0 shadow-lg cursor-pointer hover:shadow-xl transition-shadow" onClick={() => setIsCartPopoutOpen(true)}>
                <CardHeader className="pb-3">
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
                      <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">
                        {Object.values(cartItems).reduce((sum, qty) => sum + qty, 0)} items
                      </Badge>
                    </motion.div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative min-h-[200px]">
                  {/* Scrollable Cart Items */}
                  <div className="space-y-2 max-h-[250px] overflow-y-auto scrollbar-hide pb-20">
                    <AnimatePresence>
                      {Object.entries(cartItems).filter(([_, quantity]) => quantity > 0).slice(0, 3).map(([productId, quantity]) => {
                        const product = products.find(p => p.id === productId);
                        if (!product) return null;
                        return (
                          <motion.div
                            key={productId}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-10 h-10 rounded-md object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                              <p className="text-xs text-gray-500">${product.price} × {quantity}</p>
                            </div>
                            <div className="text-sm font-semibold text-blue-600">
                              ${(product.price * quantity).toFixed(2)}
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                    
                    {Object.entries(cartItems).filter(([_, quantity]) => quantity > 0).length > 3 && (
                      <div className="text-center text-sm text-gray-500 py-2">
                        +{Object.entries(cartItems).filter(([_, quantity]) => quantity > 0).length - 3} more items
                      </div>
                    )}
                    
                    {Object.entries(cartItems).filter(([_, quantity]) => quantity > 0).length === 0 && (
                      <div className="text-center text-gray-400 py-8">
                        <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No items in cart yet</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Total at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white to-transparent p-4">
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">Total:</span>
                        <span className="text-lg font-bold text-blue-600">
                          ${getTotalCartValue().toFixed(2)}
                        </span>
                      </div>
                      {getTotalCartValue() > 0 && (
                        <p className="text-xs text-gray-500 mt-1">Click to view full cart</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Team Members */}
              <Card className="backdrop-blur-sm bg-white/95 border-0 shadow-lg">
                <CardHeader className="pb-3">
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
                <CardContent className="relative min-h-[400px]">
                  {/* Team Members List */}
                  <div className="space-y-3 max-h-[450px] overflow-y-auto scrollbar-hide">
                    <AnimatePresence>
                      {teamMembers.map((member, index) => {
                        const budgetColor = getBudgetStatusColor(member);
                        const colorClasses = getBudgetColorClasses(budgetColor);
                        
                        return (
                          <motion.div 
                            key={member.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-3 rounded-lg border ${colorClasses.bg} ${colorClasses.border} hover:shadow-md transition-all`}
                          >
                            <div className="flex items-center space-x-3 mb-2">
                              <Avatar className="w-10 h-10">
                                <AvatarFallback className={`${colorClasses.bg} ${colorClasses.text} text-sm font-semibold`}>
                                  {member.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-sm text-gray-900">{member.name}</span>
                                  <div className="flex items-center space-x-1">
                                    {member.isCreator && (
                                      <Badge variant="secondary" className="text-xs">Creator</Badge>
                                    )}
                                    {member.approvedCart && (
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 500 }}
                                      >
                                        <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                                          <CheckCircle className="w-3 h-3 mr-1" />
                                          Approved
                                        </Badge>
                                      </motion.div>
                                    )}
                                  </div>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {member.isOnline ? 'Online' : `Last seen ${member.lastSeen}`}
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className={`text-xs font-medium ${colorClasses.text}`}>
                                  Budget: ${member.spent.toFixed(2)} / ${member.budget.toFixed(2)}
                                </span>
                                <span className={`text-xs ${colorClasses.text}`}>
                                  {getBudgetProgress(member).toFixed(0)}%
                                </span>
                              </div>
                              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min(getBudgetProgress(member), 100)}%` }}
                                  transition={{ duration: 0.5, delay: index * 0.1 }}
                                  className={`h-full ${colorClasses.progress} rounded-full`}
                                />
                              </div>
                              <div className={`text-xs ${colorClasses.text}`}>
                                {member.spent > member.budget 
                                  ? `$${(member.spent - member.budget).toFixed(2)} over budget`
                                  : `$${(member.budget - member.spent).toFixed(2)} remaining`
                                }
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>

              {/* Cart Approval Section */}
              <AnimatePresence>
                {Object.values(cartItems).some(q => q > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card className="backdrop-blur-sm bg-white/95 border-0 shadow-lg">
                      <CardContent className="p-4">
                        {!userApprovedCart ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl"
                          >
                            <div className="flex items-center mb-3">
                              <AlertCircle className="w-5 h-5 text-orange-600 mr-2" />
                              <span className="text-sm font-semibold text-orange-800">
                                Cart approval required
                              </span>
                            </div>
                            <p className="text-xs text-orange-700 mb-4">
                              All team members must approve the cart before checkout
                            </p>
                            <Button 
                              className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-md"
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
                              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md"
                              onClick={handleCheckout}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Proceed to Checkout
                            </Button>
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl text-center"
                          >
                            <p className="text-sm font-medium text-blue-700">
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
                  <Card className="backdrop-blur-sm bg-white/95 border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-32 overflow-y-auto scrollbar-hide">
                        <AnimatePresence>
                          {cartActivities.slice(0, 5).map((activity, index) => (
                            <motion.div
                              key={activity.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ delay: index * 0.1 }}
                              className="text-xs text-gray-600 p-3 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-lg border border-gray-200/50"
                            >
                              <span className="font-semibold text-blue-600">{activity.memberName}</span>
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

      {/* Cart Popout Dialog */}
      <Dialog open={isCartPopoutOpen} onOpenChange={setIsCartPopoutOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
              <span>Cart Details - {coCartName}</span>
              <Badge variant="outline" className="ml-2 bg-blue-50 border-blue-200 text-blue-700">
                {Object.values(cartItems).reduce((sum, qty) => sum + qty, 0)} items
              </Badge>
            </DialogTitle>
            <DialogDescription>
              Collaborative cart with {teamMembers.length} members • Total: ${getTotalCartValue().toFixed(2)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid lg:grid-cols-3 gap-6 mt-4">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-hide pr-2">
                <h3 className="font-semibold text-lg mb-4 flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Cart Items
                </h3>
                
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
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-200 transition-all"
                      >
                        <div className="flex items-center space-x-4">
                          <img src={product.image} alt={product.name} className="w-16 h-16 rounded-lg object-cover shadow-sm" />
                          <div>
                            <h4 className="font-semibold text-gray-900">{product.name}</h4>
                            <p className="text-sm text-gray-600">{product.brand}</p>
                            <p className="text-sm text-blue-600 font-medium">${product.price.toFixed(2)} each</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
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
                          <span className="text-lg font-semibold min-w-[30px] text-center">{quantity}</span>
                          <motion.div whileTap={{ scale: 0.95 }}>
                            <Button
                              size="sm"
                              onClick={() => addToCart(product.id)}
                              className="h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </motion.div>
                          <div className="min-w-[80px] text-right">
                            <span className="text-lg font-bold text-blue-600">${(product.price * quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                
                {Object.values(cartItems).every(q => q === 0) && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                  >
                    <div className="p-6 bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                      <ShoppingCart className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No items in cart yet</h3>
                    <p className="text-gray-500">Start adding products to see them here</p>
                  </motion.div>
                )}
              </div>
              
              {/* Cart Total */}
              {Object.values(cartItems).some(q => q > 0) && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-t border-gray-200 pt-6 mt-6"
                >
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <span className="text-xl font-semibold text-gray-900">Total:</span>
                    <motion.span 
                      key={getTotalCartValue()}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                      className="text-2xl font-bold text-blue-600"
                    >
                      ${getTotalCartValue().toFixed(2)}
                    </motion.span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Team Members Summary */}
            <div className="lg:col-span-1">
              <h3 className="font-semibold text-lg mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Team Budget Summary
              </h3>
              
              <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
                {teamMembers.map((member, index) => {
                  const budgetColor = getBudgetStatusColor(member);
                  const colorClasses = getBudgetColorClasses(budgetColor);
                  
                  return (
                    <motion.div 
                      key={member.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-3 rounded-lg border ${colorClasses.bg} ${colorClasses.border}`}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className={`${colorClasses.bg} ${colorClasses.text} text-xs font-semibold`}>
                            {member.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="font-semibold text-sm">{member.name}</span>
                          {member.isCreator && <Badge variant="secondary" className="text-xs ml-1">Creator</Badge>}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className={`text-xs font-medium ${colorClasses.text}`}>
                          ${member.spent.toFixed(2)} / ${member.budget.toFixed(2)}
                        </div>
                        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${colorClasses.progress} rounded-full transition-all duration-300`}
                            style={{ width: `${Math.min(getBudgetProgress(member), 100)}%` }}
                          />
                        </div>
                        <div className={`text-xs ${colorClasses.text}`}>
                          {member.spent > member.budget 
                            ? `$${(member.spent - member.budget).toFixed(2)} over budget`
                            : `$${(member.budget - member.spent).toFixed(2)} remaining`
                          }
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              
              {/* Recent Activity in Popout */}
              {cartActivities.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-sm mb-3 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Recent Activity
                  </h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto scrollbar-hide">
                    {cartActivities.slice(0, 6).map((activity, index) => (
                      <div
                        key={activity.id}
                        className="text-xs text-gray-600 p-2 bg-gray-50 rounded border"
                      >
                        <span className="font-semibold text-blue-600">{activity.memberName}</span>
                        {' '}{activity.action} {activity.productName}
                        <div className="text-gray-400 mt-1">
                          {activity.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Voice Agent and Floating Chat Button and Interface */}
      <div className="fixed bottom-6 left-6 z-50">
        <AnimatePresence>
          {/* Voice Agent Interface */}
          {isVoiceAgentOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="mb-4 w-96 h-[400px] bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-2xl border border-blue-200 overflow-hidden backdrop-blur-sm"
            >
              {/* Voice Agent Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-900 text-white p-4 flex items-center justify-between border-b border-blue-400/20">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Mic className="h-6 w-6" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></span>
                  </div>
                  <div>
                    <span className="font-semibold text-lg">Voice Shopping Assistant</span>
                    <p className="text-xs text-blue-100 opacity-90">
                      {voiceAgentStep === 'listening' && 'Tell me what you need...'}
                      {voiceAgentStep === 'processing' && 'Processing your request...'}
                      {voiceAgentStep === 'ready' && 'Ready to add items!'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleVoiceAgentToggle}
                    className="text-white hover:bg-white/20 h-8 w-8 p-0 rounded-full"
                    title="Close"
                  >
                    ×
                  </Button>
                </div>
              </div>

              {/* Voice Agent Content */}
              <div className="flex-1 p-6 space-y-4 overflow-y-auto scrollbar-hide bg-gradient-to-b from-blue-50/50 to-white h-80">
                {/* Status Display */}
                <div className="text-center space-y-4">
                  {/* Microphone Animation */}
                  <div className="relative mx-auto w-20 h-20">
                    <motion.div
                      animate={isListening ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                      transition={{ repeat: isListening ? Infinity : 0, duration: 1 }}
                      className={`w-20 h-20 rounded-full flex items-center justify-center ${
                        isListening 
                          ? 'bg-red-500 shadow-lg shadow-red-500/50' 
                          : 'bg-blue-600 shadow-lg shadow-blue-600/50'
                      }`}
                    >
                      {isListening ? (
                        <MicOff className="h-8 w-8 text-white" />
                      ) : (
                        <Mic className="h-8 w-8 text-white" />
                      )}
                    </motion.div>
                    
                    {/* Sound waves animation when listening */}
                    {isListening && (
                      <>
                        <motion.div
                          animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="absolute inset-0 rounded-full border-2 border-red-500"
                        />
                        <motion.div
                          animate={{ scale: [1, 2.5], opacity: [0.3, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
                          className="absolute inset-0 rounded-full border border-red-400"
                        />
                      </>
                    )}
                  </div>

                  {/* Status Text */}
                  <div className="space-y-2">
                    {voiceAgentStep === 'listening' && !isListening && (
                      <div className="text-center">
                        <p className="text-blue-700 font-medium">🎤 Ready to listen</p>
                        <p className="text-sm text-gray-600">Say something like: "I need apples, bananas, and bread"</p>
                      </div>
                    )}
                    
                    {isListening && (
                      <div className="text-center">
                        <p className="text-red-600 font-medium">🎤 Listening...</p>
                        <p className="text-sm text-gray-600">Speak clearly</p>
                      </div>
                    )}

                    {isSpeaking && (
                      <div className="text-center">
                        <p className="text-blue-700 font-medium">🗣️ Speaking...</p>
                        <div className="flex justify-center space-x-1 mt-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Transcript Display */}
                  {voiceTranscript && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-white rounded-lg border border-blue-200 shadow-sm"
                    >
                      <p className="text-sm text-gray-700">
                        <span className="font-medium text-blue-700">You said:</span> "{voiceTranscript}"
                      </p>
                    </motion.div>
                  )}

                  {/* Detected Items and Products */}
                  {matchedProducts.length > 0 && voiceAgentStep === 'ready' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-blue-50 rounded-lg border border-blue-200 space-y-3"
                    >
                      <p className="text-sm font-medium text-blue-700 mb-2">Found Items:</p>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {matchedProducts.map((product) => (
                          <div 
                            key={product.id}
                            className="flex items-center justify-between p-2 bg-white rounded border border-blue-100"
                          >
                            <div className="flex items-center space-x-2">
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-8 h-8 rounded object-cover"
                              />
                              <div>
                                <p className="text-xs font-medium text-gray-900">{product.name}</p>
                                <p className="text-xs text-gray-500">{product.brand}</p>
                              </div>
                            </div>
                            <span className="text-sm font-medium text-blue-600">${product.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <Button
                        onClick={addAllItemsToCart}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Add All to Cart (${matchedProducts.reduce((sum, p) => sum + p.price, 0).toFixed(2)})
                      </Button>
                    </motion.div>
                  )}

                  {detectedItems.length > 0 && voiceAgentStep !== 'ready' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-blue-50 rounded-lg border border-blue-200"
                    >
                      <p className="text-sm font-medium text-blue-700 mb-2">Detected Items:</p>
                      <div className="flex flex-wrap gap-2">
                        {detectedItems.map((item) => (
                          <span 
                            key={item}
                            className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-3 mt-6">
                  {!isListening && !isSpeaking && voiceAgentStep === 'listening' && (
                    <Button
                      onClick={startVoiceRecognition}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full"
                    >
                      <Mic className="w-4 h-4 mr-2" />
                      Start Speaking
                    </Button>
                  )}
                  
                  {voiceAgentStep === 'ready' && (
                    <Button
                      onClick={() => {
                        setVoiceAgentStep('listening');
                        setDetectedItems([]);
                        setMatchedProducts([]);
                        setVoiceTranscript('');
                      }}
                      variant="outline"
                      className="bg-white border-blue-300 text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-full"
                    >
                      Try Again
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Chat Interface */}
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="mb-4 w-96 h-[500px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden backdrop-blur-sm bg-white/95"
            >
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-900 text-white p-4 flex items-center justify-between border-b border-blue-400/20">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <MessageCircle className="h-6 w-6" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
                  </div>
                  <div>
                    <span className="font-semibold text-lg">Team Chat</span>
                    <p className="text-xs text-blue-100 opacity-90">
                      {teamMembers.filter(m => m.isActive && m.name !== 'You').length} members active
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsChatOpen(false)}
                    className="text-white hover:bg-white/20 h-8 w-8 p-0 rounded-full"
                    title="Close"
                  >
                    ×
                  </Button>
                </div>
              </div>

              {/* Chat Messages */}
              <div 
                id="chat-messages"
                className="flex-1 p-4 space-y-4 overflow-y-auto scrollbar-hide bg-gradient-to-b from-gray-50/50 to-white h-80"
              >
                {chatMessages.map((message) => (
                  <motion.div 
                    key={message.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-7 w-7 ring-2 ring-white shadow-sm">
                        <AvatarImage src={message.userAvatar} />
                        <AvatarFallback className={`text-xs font-semibold ${
                          message.userName === 'WalmartAI' 
                            ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white' 
                            : 'bg-gradient-to-br from-blue-400 to-purple-500 text-white'
                        }`}>
                          {message.userName === 'WalmartAI' ? '🤖' : message.userName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className={`text-sm font-semibold ${
                        message.userName === 'WalmartAI' ? 'text-green-700' : 'text-gray-800'
                      }`}>
                        {message.userName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {message.timestamp}
                      </span>
                      {message.type === 'cart-update' && (
                        <Badge variant="secondary" className="text-xs px-2 py-0.5">
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          Cart
                        </Badge>
                      )}
                      {message.type === 'ai-suggestion' && (
                        <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-green-50 text-green-700 border-green-200">
                          🤖 AI
                        </Badge>
                      )}
                    </div>
                    <div className={`p-3 rounded-xl max-w-[85%] shadow-sm ${
                      message.userName === 'You' 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white ml-9 rounded-br-md' 
                        : message.userName === 'WalmartAI'
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-gray-800 rounded-bl-md'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.message}</p>
                      
                      {/* AI Product Suggestions */}
                      {message.type === 'ai-suggestion' && message.suggestions && message.suggestions.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {message.suggestions.map((suggestion) => (
                            <motion.div
                              key={suggestion.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 transition-all shadow-sm"
                            >
                              <div className="flex items-center space-x-3">
                                <img 
                                  src={suggestion.image} 
                                  alt={suggestion.name}
                                  className="w-12 h-12 rounded-lg object-cover shadow-sm"
                                />
                                <div>
                                  <h4 className="font-semibold text-gray-900 text-sm">{suggestion.name}</h4>
                                  <p className="text-xs text-gray-600">{suggestion.brand}</p>
                                  <p className="text-sm font-bold text-green-600">${suggestion.price.toFixed(2)}</p>
                                </div>
                              </div>
                              <motion.div whileTap={{ scale: 0.95 }}>
                                <Button
                                  size="sm"
                                  onClick={() => addToCart(suggestion.id)}
                                  className="bg-green-600 hover:bg-green-700 text-white h-8 px-3 text-xs"
                                >
                                  <Plus className="w-3 h-3 mr-1" />
                                  Add
                                </Button>
                              </motion.div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                
                {/* Typing Indicator */}
                {teamMembers.some(m => m.isActive && m.name !== 'You') && Math.random() > 0.8 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center space-x-2 text-gray-500"
                  >
                    <div className="flex space-x-1 ml-9">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-xs">Someone is typing...</span>
                  </motion.div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-gray-200 bg-gray-50/80 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="pr-12 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl bg-white shadow-sm"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                      title="Add emoji"
                    >
                      😊
                    </Button>
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md rounded-xl h-10 w-10 p-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Quick Actions */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-gray-600 hover:text-blue-600 px-2 py-1 h-6"
                      onClick={() => setNewMessage("How's the budget looking? 💰")}
                    >
                      💰 Budget
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-gray-600 hover:text-blue-600 px-2 py-1 h-6"
                      onClick={() => setNewMessage("Should we add more items? 🛒")}
                    >
                      🛒 Cart
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-gray-600 hover:text-green-600 px-2 py-1 h-6"
                      onClick={() => setNewMessage("@walmartAi help me find ")}
                    >
                      🤖 AI Help
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-gray-600 hover:text-blue-600 px-2 py-1 h-6"
                      onClick={() => setNewMessage("Ready for checkout! ✅")}
                    >
                      ✅ Ready
                    </Button>
                  </div>
                  <span className="text-xs text-gray-500">
                    {chatMessages.length} messages
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Voice Agent Button */}
        <motion.div
          className="relative mb-4"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.button
            onClick={handleVoiceAgentToggle}
            className="bg-gradient-to-r from-blue-600 to-blue-900 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 border-4 border-white/20 backdrop-blur-sm"
            animate={isVoiceAgentOpen ? { scale: 0.9 } : { scale: 1 }}
          >
            <Mic className="h-6 w-6" />
            
            {/* Voice indicator */}
            {isListening && (
              <motion.span 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
              >
                <span className="text-xs font-bold text-white">🎤</span>
              </motion.span>
            )}
            
            {/* Speaking indicator */}
            {isSpeaking && (
              <motion.span 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
              >
                <span className="text-xs font-bold text-white">🗣️</span>
              </motion.span>
            )}
            
            {/* Pulse animation for activity */}
            {(isListening || isSpeaking) && (
              <span className="absolute inset-0 rounded-full bg-blue-400 opacity-75 animate-ping"></span>
            )}
          </motion.button>
          
          {/* Voice Agent Tooltip */}
          {!isVoiceAgentOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-blue-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap"
            >
              Voice Shopping Assistant
              <div className="absolute top-1/2 left-full transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-blue-900 border-t-4 border-b-4 border-t-transparent border-b-transparent"></div>
            </motion.div>
          )}
        </motion.div>

        {/* Floating Chat Button */}
        <motion.div
          className="relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="bg-gradient-to-r from-blue-600 to-blue-900 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 border-4 border-white/20 backdrop-blur-sm"
            animate={isChatOpen ? { scale: 0.9 } : { scale: 1 }}
          >
            <MessageCircle className="h-6 w-6" />
            
            {/* Active members indicator */}
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
              <span className="text-xs font-bold text-white">
                {teamMembers.filter(m => m.isActive && m.name !== 'You').length}
              </span>
            </span>
            
            {/* New messages indicator */}
            {chatMessages.length > 4 && !isChatOpen && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -left-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg"
              >
                {Math.min(chatMessages.length - 4, 9)}
                {chatMessages.length - 4 > 9 && '+'}
              </motion.span>
            )}
            
            {/* Pulse animation for activity */}
            {teamMembers.some(m => m.isActive && m.name !== 'You') && (
              <span className="absolute inset-0 rounded-full bg-blue-400 opacity-75 animate-ping"></span>
            )}
          </motion.button>
          
          {/* Tooltip */}
          {!isChatOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap"
            >
              Team Chat ({teamMembers.filter(m => m.isActive && m.name !== 'You').length} active)
              <div className="absolute top-1/2 left-full transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-900 border-t-4 border-b-4 border-t-transparent border-b-transparent"></div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CoCartProducts;
