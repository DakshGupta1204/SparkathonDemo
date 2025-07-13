
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Truck, DollarSign, RefreshCw } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main hero card */}
          <Card className="lg:col-span-2 p-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-[10%]">
              <div>
                <h1 className="text-4xl font-bold mb-4">
                  Save big on everything you need
                </h1>
                <p className="text-xl mb-6 text-blue-100">
                  Low prices every day on millions of items
                </p>
                <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3">
                  Shop now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                <img 
                  src="/tv.png" 
                  alt="Featured products"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            </div>
          </Card>

          {/* Side promotional cards */}
          <div className="space-y-4">
            <Card className="p-6 bg-blue-500 text-black">
              <div className='flex justify-between items-center mb-4'>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-blue-950">Walmart+</h3>
              <p className="text-sm mb-4">Free shipping, no order minimum</p>
              <Button variant="outline" size="sm" className="border-black text-black hover:bg-gray-200 ">
                Try free for 30 days
              </Button>
                </div>
                <div>
                  <img 
                    src="/head.jpg" 
                    alt="Walmart Plus"
                    className="w-48 h-48 mt-4 rounded-lg object-cover"
                  />
                </div>
              </div>
              
            </Card>

            <Card className="p-6 bg-blue-500 text-white">
              <div className='flex justify-between items-center mb-4'>
                <div>
                  <h3 className="font-bold text-lg mb-2 text-blue-950">Pickup & Delivery</h3>
              <p className="text-sm mb-4 text-blue-950">Get your order when you want it</p>
              <Button variant="outline" size="sm" className="border-white text-black hover:bg-gray-200">
                Schedule now
              </Button>
                </div>
                <div>
                  <img 
                    src="/fri.jpg" 
                    alt="Pickup and Delivery"
                    className="w-48 h-48 mb-4"
                  />
                </div>
              </div>
              
            </Card>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="flex items-center justify-center p-6 bg-white rounded-lg shadow-sm">
            <Truck className="w-8 h-8 text-blue-600 mr-4" />
            <div>
              <h4 className="font-semibold">Free shipping</h4>
              <p className="text-sm text-gray-600">On orders $35+</p>
            </div>
          </div>

          <div className="flex items-center justify-center p-6 bg-white rounded-lg shadow-sm">
            <DollarSign className="w-8 h-8 text-green-600 mr-4" />
            <div>
              <h4 className="font-semibold">Low prices</h4>
              <p className="text-sm text-gray-600">Every day</p>
            </div>
          </div>

          <div className="flex items-center justify-center p-6 bg-white rounded-lg shadow-sm">
            <RefreshCw className="w-8 h-8 text-purple-600 mr-4" />
            <div>
              <h4 className="font-semibold">Easy returns</h4>
              <p className="text-sm text-gray-600">In store or online</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
