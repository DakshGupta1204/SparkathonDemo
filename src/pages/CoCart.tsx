import { useState, useEffect } from 'react';
import { Users, Plus, LogIn, ShoppingCart, Heart, Share2, Zap, Globe, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

const CoCart = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [cartName, setCartName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [realtimeStats, setRealtimeStats] = useState({ activeCarts: 1247, activeUsers: 3892 });
  const navigate = useNavigate();
  const { toast } = useToast();

  const generateCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  // Simulate real-time statistics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeStats(prev => ({
        activeCarts: prev.activeCarts + Math.floor(Math.random() * 5) - 2,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 20) - 10
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleCreateCart = () => {
    const code = generateCode();
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('coCartCode', code);
      localStorage.setItem('coCartName', cartName);
      localStorage.setItem('isCoCartCreator', 'true');
      
      toast({
        title: "CoCart Created Successfully!",
        description: `Your cart "${cartName}" is ready. Share code: ${code}`,
        duration: 4000,
      });
      
      setIsCreateDialogOpen(false);
      navigate('/cocart/products');
    }, 1000);
  };

  const handleJoinCart = () => {
    if (joinCode.length === 6) {
      // Simulate API validation
      setTimeout(() => {
        localStorage.setItem('coCartCode', joinCode);
        localStorage.setItem('isCoCartCreator', 'false');
        
        toast({
          title: "Joined CoCart Successfully!",
          description: `You've joined the collaborative cart with code: ${joinCode}`,
          duration: 4000,
        });
        
        setIsJoinDialogOpen(false);
        navigate('/cocart/products');
      }, 800);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-white"
    >
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className="bg-blue-100 p-4 rounded-full">
              <Users className="w-16 h-16 text-blue-600" />
            </div>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-5xl font-bold text-gray-900 mb-6"
          >
            Welcome to <span className="text-blue-600">CoCart</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
          >
            Shop together with family and friends! Create collaborative shopping carts, 
            set budgets, and make group purchasing decisions in real-time.
          </motion.p>
          
          {/* Real-time stats */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex justify-center space-x-8 mb-8"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <motion.div 
                key={realtimeStats.activeCarts}
                initial={{ scale: 1.2, color: "#2563eb" }}
                animate={{ scale: 1, color: "#2563eb" }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-2xl font-bold text-blue-600"
              >
                {realtimeStats.activeCarts.toLocaleString()}
              </motion.div>
              <div className="text-sm text-gray-500">Active CoCart</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <motion.div 
                key={realtimeStats.activeUsers}
                initial={{ scale: 1.2, color: "#2563eb" }}
                animate={{ scale: 1, color: "#2563eb" }}
                transition={{ type: "spring", stiffness: 300 }}
                className="text-2xl font-bold text-blue-600"
              >
                {realtimeStats.activeUsers.toLocaleString()}
              </motion.div>
              <div className="text-sm text-gray-500">Users Shopping Together</div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <Card className="text-center border-blue-200 hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="flex justify-center mb-4"
                >
                  <Share2 className="w-12 h-12 text-blue-600" />
                </motion.div>
                <CardTitle className="text-blue-900">Share & Collaborate</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Share a simple 6-digit code with your family and friends to start shopping together
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <Card className="text-center border-blue-200 hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <motion.div 
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className="flex justify-center mb-4"
                >
                  <Zap className="w-12 h-12 text-blue-600" />
                </motion.div>
                <CardTitle className="text-blue-900">Real-time Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  See what everyone adds to the cart instantly and make decisions together
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <Card className="text-center border-blue-200 hover:shadow-lg transition-shadow h-full">
              <CardHeader>
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex justify-center mb-4"
                >
                  <Shield className="w-12 h-12 text-blue-600" />
                </motion.div>
                <CardTitle className="text-blue-900">Budget Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Set individual budgets and track spending to stay within your limits
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.6 }}
          className="flex flex-col md:flex-row gap-4 justify-center items-center"
        >
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                  <Plus className="w-6 h-6 mr-2" />
                  Create a CoCart
                </Button>
              </motion.div>
            </DialogTrigger>
            <AnimatePresence>
              {isCreateDialogOpen && (
                <DialogContent className="sm:max-w-md">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <DialogHeader>
                      <DialogTitle className="text-blue-900">Create a New CoCart</DialogTitle>
                      <DialogDescription>
                        Give your collaborative cart a name and we'll generate a sharing code.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Label htmlFor="cartName">Cart Name</Label>
                        <Input
                          id="cartName"
                          placeholder="e.g., Family Grocery Shopping"
                          value={cartName}
                          onChange={(e) => setCartName(e.target.value)}
                        />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          onClick={handleCreateCart} 
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          disabled={!cartName.trim()}
                        >
                          Create CoCart
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                </DialogContent>
              )}
            </AnimatePresence>
          </Dialog>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2 }}
            className="text-gray-400 hidden md:block"
          >
            or
          </motion.div>

          <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
            <DialogTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg">
                  <LogIn className="w-6 h-6 mr-2" />
                  Join a CoCart
                </Button>
              </motion.div>
            </DialogTrigger>
            <AnimatePresence>
              {isJoinDialogOpen && (
                <DialogContent className="sm:max-w-md">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <DialogHeader>
                      <DialogTitle className="text-blue-900">Join a CoCart</DialogTitle>
                      <DialogDescription>
                        Enter the 6-digit code shared by your friend or family member.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Label htmlFor="joinCode">6-Digit Code</Label>
                        <Input
                          id="joinCode"
                          placeholder="ABC123"
                          value={joinCode}
                          onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                          maxLength={6}
                          className="text-center text-lg tracking-wider"
                        />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          onClick={handleJoinCart} 
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          disabled={joinCode.length !== 6}
                        >
                          Join CoCart
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                </DialogContent>
              )}
            </AnimatePresence>
          </Dialog>
        </motion.div>

        {/* How it Works Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.4, duration: 0.8 }}
          className="mt-20"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.6, duration: 0.6 }}
            className="text-3xl font-bold text-center text-gray-900 mb-12"
          >
            How It Works
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.8, duration: 0.6 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="text-center"
            >
              <motion.div 
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <span className="text-2xl font-bold text-blue-600">1</span>
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">Create or Join</h3>
              <p className="text-gray-600">Start a new CoCart or join an existing one with a 6-digit code</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3, duration: 0.6 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="text-center"
            >
              <motion.div 
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <span className="text-2xl font-bold text-blue-600">2</span>
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">Set Budgets</h3>
              <p className="text-gray-600">Each member can set their individual budget and track spending</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.2, duration: 0.6 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="text-center"
            >
              <motion.div 
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <span className="text-2xl font-bold text-blue-600">3</span>
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">Shop Together</h3>
              <p className="text-gray-600">Add items to the shared cart and see everyone's contributions in real-time</p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </motion.div>
  );
};

export default CoCart;
