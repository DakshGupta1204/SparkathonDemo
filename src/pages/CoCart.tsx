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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full">
              <Users className="w-16 h-16 text-blue-600" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">CoCart</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Shop together with family and friends! Create collaborative shopping carts, 
            set budgets, and make group purchasing decisions in real-time.
          </p>
          
          {/* Real-time stats */}
          <div className="flex justify-center space-x-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{realtimeStats.activeCarts.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Active CoCart</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{realtimeStats.activeUsers.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Users Shopping Together</div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center border-blue-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Share2 className="w-12 h-12 text-blue-600" />
              </div>
              <CardTitle className="text-blue-900">Share & Collaborate</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600">
                Share a simple 6-digit code with your family and friends to start shopping together
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-blue-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Zap className="w-12 h-12 text-blue-600" />
              </div>
              <CardTitle className="text-blue-900">Real-time Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600">
                See what everyone adds to the cart instantly and make decisions together
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-blue-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Shield className="w-12 h-12 text-blue-600" />
              </div>
              <CardTitle className="text-blue-900">Budget Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600">
                Set individual budgets and track spending to stay within your limits
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                <Plus className="w-6 h-6 mr-2" />
                Create a CoCart
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-blue-900">Create a New CoCart</DialogTitle>
                <DialogDescription>
                  Give your collaborative cart a name and we'll generate a sharing code.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cartName">Cart Name</Label>
                  <Input
                    id="cartName"
                    placeholder="e.g., Family Grocery Shopping"
                    value={cartName}
                    onChange={(e) => setCartName(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleCreateCart} 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!cartName.trim()}
                >
                  Create CoCart
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <div className="text-gray-400 hidden md:block">or</div>

          <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg">
                <LogIn className="w-6 h-6 mr-2" />
                Join a CoCart
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-blue-900">Join a CoCart</DialogTitle>
                <DialogDescription>
                  Enter the 6-digit code shared by your friend or family member.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="joinCode">6-Digit Code</Label>
                  <Input
                    id="joinCode"
                    placeholder="ABC123"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    maxLength={6}
                    className="text-center text-lg tracking-wider"
                  />
                </div>
                <Button 
                  onClick={handleJoinCart} 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={joinCode.length !== 6}
                >
                  Join CoCart
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* How it Works Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create or Join</h3>
              <p className="text-gray-600">Start a new CoCart or join an existing one with a 6-digit code</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Set Budgets</h3>
              <p className="text-gray-600">Each member can set their individual budget and track spending</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Shop Together</h3>
              <p className="text-gray-600">Add items to the shared cart and see everyone's contributions in real-time</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CoCart;
