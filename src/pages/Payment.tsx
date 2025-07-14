import { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Check, Users, Receipt, Zap, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { motion, AnimatePresence } from 'framer-motion';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  addedBy: string;
}

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  budget: number;
  spent: number;
  isCreator: boolean;
}

const Payment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState('splitwise');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [paidMembers, setPaidMembers] = useState<string[]>([]);

  const coCartCode = localStorage.getItem('coCartCode') || '';
  const coCartName = localStorage.getItem('coCartName') || 'Shared Cart';

  // Randomly select 2 members (excluding 'You') to show as already paid
  const getRandomPaidMembers = () => {
    const otherMembers = teamMembers.filter(member => member.name !== 'You').map(m => m.name);
    const shuffled = otherMembers.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2);
  };

  // Initialize paid members on component mount
  useEffect(() => {
    setPaidMembers(getRandomPaidMembers());
  }, []);

  // Mock data - in a real app, this would come from the previous page or API
  const [teamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'You',
      avatar: '',
      budget: 100,
      spent: 45.50,
      isCreator: true
    },
    {
      id: '2',
      name: 'Deepanshi',
      avatar: '',
      budget: 80,
      spent: 32.75,
      isCreator: false
    },
    {
      id: '3',
      name: 'Anshumaan',
      avatar: '',
      budget: 120,
      spent: 28.40,
      isCreator: false
    },
    {
      id: '4',
      name: 'Anshuman',
      avatar: '',
      budget: 90,
      spent: 19.85,
      isCreator: false
    }
  ]);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart items from localStorage when component mounts
  useEffect(() => {
    const loadCartItems = () => {
      // First try to load from coCartItems (CoCart scenario)
      const coCartItems = localStorage.getItem('coCartItems');
      const coCartProductDetails = localStorage.getItem('coCartProductDetails');
      
      if (coCartItems && coCartProductDetails) {
        try {
          const cartQuantities = JSON.parse(coCartItems);
          const productDetails = JSON.parse(coCartProductDetails);
          
          const items: CartItem[] = productDetails
            .filter((product: any) => cartQuantities[product.id] > 0)
            .map((product: any) => ({
              id: product.id,
              name: product.name,
              price: product.price,
              quantity: cartQuantities[product.id],
              image: product.image,
              addedBy: product.addedBy || 'You' // Use stored addedBy info or default to 'You'
            }));
          
          setCartItems(items);
          return;
        } catch (error) {
          console.error('Error loading CoCart items:', error);
        }
      }
      
      // Fallback to regular cart items
      const regularCartItems = localStorage.getItem('cartItems');
      if (regularCartItems) {
        try {
          const items = JSON.parse(regularCartItems);
          const formattedItems: CartItem[] = items.map((item: any) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            addedBy: item.addedBy || 'You'
          }));
          
          setCartItems(formattedItems);
          return;
        } catch (error) {
          console.error('Error loading regular cart items:', error);
        }
      }
      
      // Fallback to mock data if no items found
      setCartItems([
        {
          id: '1',
          name: 'Organic Bananas',
          price: 2.99,
          quantity: 2,
          image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop',
          addedBy: 'You'
        },
        {
          id: '3',
          name: 'Fresh Milk 2%',
          price: 4.29,
          quantity: 3,
          image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop',
          addedBy: 'Deepanshi'
        }
      ]);
    };

    loadCartItems();
  }, []);

  // Original mock data as fallback (keeping structure but making it dynamic)
  const [fallbackCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Organic Bananas',
      price: 2.99,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop',
      addedBy: 'You'
    },
    {
      id: '3',
      name: 'Fresh Milk 2%',
      price: 4.29,
      quantity: 3,
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop',
      addedBy: 'Deepanshi'
    },
    {
      id: '7',
      name: 'Fresh Avocados',
      price: 1.99,
      quantity: 4,
      image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=400&fit=crop',
      addedBy: 'You'
    },
    {
      id: '9',
      name: 'Salmon Fillet',
      price: 12.99,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=400&fit=crop',
      addedBy: 'Anshumaan'
    },
    {
      id: '11',
      name: 'Fresh Strawberries',
      price: 3.99,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop',
      addedBy: 'Deepanshi'
    },
    {
      id: '14',
      name: 'Extra Virgin Olive Oil',
      price: 8.99,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop',
      addedBy: 'Anshuman'
    },
    {
      id: '6',
      name: 'Greek Yogurt',
      price: 5.99,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop',
      addedBy: 'You'
    }
  ]);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateMemberCosts = () => {
    const memberCosts: { [key: string]: number } = {};
    
    cartItems.forEach(item => {
      const cost = item.price * item.quantity;
      memberCosts[item.addedBy] = (memberCosts[item.addedBy] || 0) + cost;
    });

    return memberCosts;
  };

  const calculateSplitCosts = () => {
    const subtotal = calculateSubtotal();
    const perPerson = subtotal / teamMembers.length;
    const splitCosts: { [key: string]: number } = {};
    
    teamMembers.forEach(member => {
      splitCosts[member.name] = perPerson;
    });

    return splitCosts;
  };

  const getDisplayCosts = () => {
    return paymentMethod === 'splitwise' ? calculateSplitCosts() : calculateMemberCosts();
  };

  const getMyShare = () => {
    const costs = getDisplayCosts();
    return costs['You'] || 0;
  };

  const getMyTotalWithTax = () => {
    const myShare = getMyShare();
    const myTax = myShare * 0.08; // 8% tax on my share
    return myShare + myTax;
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.08; // 8% tax
  const originalDeliveryFee = 5.99;
  const deliveryFee = 0; // Free delivery with CoCart
  const total = subtotal + tax + deliveryFee;

  const handlePayment = async () => {
    if (!cardNumber || !expiryDate || !cvv || !cardName) {
      toast({
        title: "Payment Error",
        description: "Please fill in all card details",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      
      // Clear cart data after successful payment
      localStorage.removeItem('cartItems');
      localStorage.removeItem('coCartItems');
      localStorage.removeItem('coCartProductDetails');
      localStorage.removeItem('coCartCode');
      localStorage.removeItem('coCartName');
      localStorage.removeItem('isCoCartCreator');
      
      toast({
        title: "Payment Successful!",
        description: `Your ${coCartCode ? 'CoCart' : 'cart'} order has been processed successfully`,
        duration: 4000,
      });

      // Redirect to success page after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }, 2000);
  };

  if (showSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50"
      >
        <Header />
        <div className="container mx-auto px-4 py-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, delay: 0.3 }}
              className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Check className="w-12 h-12 text-green-600" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              Payment Successful!
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-gray-600 mb-8"
            >
              Your CoCart order has been processed and you'll receive a confirmation email shortly.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.4 }}
            >
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Order Total:</span>
                              <span className="font-semibold">${total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>My Share Paid:</span>
                              <span className="font-semibold">${getMyTotalWithTax().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-green-600">
                              <span>CoCart Delivery Savings:</span>
                              <span className="font-semibold">-${(originalDeliveryFee / teamMembers.length).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Payment Method:</span>
                              <span className="capitalize">{paymentMethod}</span>
                            </div>
                          </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="text-gray-500"
            >
              Redirecting to home page...
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-50"
    >
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/cocart/products')}
                className="text-blue-600 hover:text-blue-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
              </Button>
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Checkout - {coCartName}</h1>
              <p className="text-gray-600">Code: {coCartCode}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Section - Order Details */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-8 space-y-6"
          >
            {/* Cart Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Receipt className="w-5 h-5 mr-2 text-blue-600" />
                    Order Items ({cartItems.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <AnimatePresence>
                      {cartItems.map((item, index) => (
                        <motion.div 
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.01, backgroundColor: "#f8fafc" }}
                          className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg transition-colors"
                        >
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-gray-600">Added by: {item.addedBy}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                            <p className="text-sm text-gray-500">${item.price} each</p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Payment Method Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-600" />
                    Payment Method
                  </CardTitle>
                  <CardDescription>
                    Choose how to split the costs among team members
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <motion.div 
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center space-x-2 p-4 border rounded-lg"
                    >
                      <RadioGroupItem value="splitwise" id="splitwise" />
                      <Label htmlFor="splitwise" className="flex-1 cursor-pointer">
                        <div>
                          <div className="font-medium">Split Equally</div>
                          <div className="text-sm text-gray-600">
                            Total cost divided equally among all {teamMembers.length} members
                          </div>
                        </div>
                      </Label>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center space-x-2 p-4 border rounded-lg"
                    >
                      <RadioGroupItem value="individual" id="individual" />
                      <Label htmlFor="individual" className="flex-1 cursor-pointer">
                        <div>
                          <div className="font-medium">Pay Individually</div>
                          <div className="text-sm text-gray-600">
                            Each member pays for what they added to the cart
                          </div>
                        </div>
                      </Label>
                    </motion.div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </motion.div>

            {/* Team Cost Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Cost Breakdown by Member</CardTitle>
                  <CardDescription>
                    {paymentMethod === 'splitwise' 
                      ? 'Equal split among all members' 
                      : 'Individual costs based on items added'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <AnimatePresence>
                      {teamMembers.map((member, index) => {
                        const memberCost = getDisplayCosts()[member.name] || 0;
                        const isPaid = paidMembers.includes(member.name);
                        return (
                          <motion.div 
                            key={member.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.01, backgroundColor: isPaid ? "#dcfce7" : "#f8fafc" }}
                            className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                              isPaid 
                                ? 'bg-green-50 border-2 border-green-200' 
                                : 'bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <motion.div 
                                whileHover={{ scale: 1.1 }}
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  isPaid 
                                    ? 'bg-green-100 border-2 border-green-300' 
                                    : 'bg-blue-100'
                                }`}
                              >
                                <span className={`font-semibold ${
                                  isPaid ? 'text-green-600' : 'text-blue-600'
                                }`}>
                                  {member.name.charAt(0).toUpperCase()}
                                </span>
                              </motion.div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">{member.name}</span>
                                  {member.isCreator && <Badge variant="secondary" className="text-xs">Creator</Badge>}
                                  {isPaid && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ type: "spring", stiffness: 500 }}
                                    >
                                      <Badge className="bg-green-500 text-white text-xs">
                                        <Check className="w-3 h-3 mr-1" />
                                        Paid
                                      </Badge>
                                    </motion.div>
                                  )}
                                </div>
                                {isPaid && (
                                  <p className="text-xs text-green-600">Payment completed</p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <motion.span 
                                key={memberCost}
                                initial={{ scale: 1.1, color: isPaid ? "#16a34a" : "#3b82f6" }}
                                animate={{ scale: 1, color: isPaid ? "#16a34a" : "#000" }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className={`font-semibold text-lg ${
                                  isPaid ? 'text-green-600' : ''
                                }`}
                              >
                                ${memberCost.toFixed(2)}
                              </motion.span>
                              {isPaid && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.2 }}
                                  className="text-xs text-green-600"
                                >
                                  ✓ Confirmed
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Payment Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                    Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div whileFocus={{ scale: 1.02 }}>
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input
                        id="cardName"
                        placeholder="John Doe"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                      />
                    </motion.div>
                    <motion.div whileFocus={{ scale: 1.02 }}>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        maxLength={19}
                      />
                    </motion.div>
                    <motion.div whileFocus={{ scale: 1.02 }}>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        maxLength={5}
                      />
                    </motion.div>
                    <motion.div whileFocus={{ scale: 1.02 }}>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        maxLength={3}
                      />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Right Section - Order Summary */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-4"
          >
            <div className="sticky top-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>My Share ({paymentMethod === 'splitwise' ? 'Split Equally' : 'Items Added'})</span>
                        <span>${getMyShare().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax (8% on my share)</span>
                        <span>${(getMyShare() * 0.08).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-500 line-through">
                        <span>My Delivery Fee</span>
                        <span>${(originalDeliveryFee / teamMembers.length).toFixed(2)}</span>
                      </div>
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 }}
                        className="flex justify-between text-green-600 font-medium"
                      >
                        <span className="flex items-center">
                          <Gift className="w-4 h-4 mr-1" />
                          CoCart Delivery Savings
                        </span>
                        <span>-${(originalDeliveryFee / teamMembers.length).toFixed(2)}</span>
                      </motion.div>
                    </div>
                    
                    <hr />
                    
                    <motion.div 
                      key={getMyTotalWithTax()}
                      initial={{ scale: 1.05 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="flex justify-between text-lg font-semibold"
                    >
                      <span>My Total</span>
                      <span>${getMyTotalWithTax().toFixed(2)}</span>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="bg-blue-50 p-3 rounded-lg"
                    >
                      <div className="flex items-center text-blue-600 mb-2">
                        <Zap className="w-4 h-4 mr-2" />
                        <span className="font-medium">CoCart Benefits</span>
                      </div>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Free delivery (saved ${(originalDeliveryFee / teamMembers.length).toFixed(2)})</li>
                        <li>• Collaborative shopping</li>
                        <li>• Budget tracking</li>
                        <li>• Split payment options</li>
                        <li>• {paidMembers.length} members already paid</li>
                      </ul>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
                      >
                        {isProcessing ? (
                          <div className="flex items-center">
                            <motion.div 
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="rounded-full h-4 w-4 border-b-2 border-white mr-2"
                            />
                            Processing...
                          </div>
                        ) : (
                          `Pay My Share $${getMyTotalWithTax().toFixed(2)}`
                        )}
                      </Button>
                    </motion.div>

                    <p className="text-xs text-gray-500 text-center">
                      Your payment information is secure and encrypted
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Payment;