
import { useState } from 'react';
import { Search, ShoppingCart, Menu, User, MapPin, Heart, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Header = () => {
  const [cartCount] = useState(3);

  return (
    <header className="bg-blue-700 text-white">
      <div className="container mx-auto px-4">

        {/* Main header */}
        <div className="py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="text-2xl font-bold">
              <img src="/image.png" alt="Walmart" className="h-12 rounded-full hover:bg-blue-950 p-2" />
            </div>

            <div className='bg-blue-900 p-2 rounded-full flex items-center space-x-2 w-[80%]'>
              <div>
                <img src="/second.png" className='h-8' />
              </div>
              <div className='mr-4'>
                <div className='font-bold'>Pickup or delivery?</div>
                <div className='text-xs truncate max-w-[220px]'>
                  Sacramento,95829 Sacramento Supermarket
                </div>
              </div>
              <div>
                <div>
                  <ChevronDown className="w-6 h-6 text-white" />
                </div>

              </div>
            </div>

          </div>

          {/* Search bar */}
          <div className="flex-1 w-[50rem] ml-6">
            <div className="relative">
              <input
                placeholder="Search everything at Walmart online and in store"
                className="w-full pl-4 pr-12 py-3 rounded-full border-0 text-black p-6 placeholder-blue-800"
              />
              <Button
                size="sm"
                className="absolute right-2 top-[5px] rounded-full bg-blue-900 hover:bg-blue-950 text-white"
              >
                <Search className="w-8 h-8" />
              </Button>
            </div>
          </div>

          <div className="flex items-center w-[20rem] ml-2 ">
            <Button variant="ghost" className="group hover:bg-blue-950 hover:text-white rounded-full py-2">
              <Heart className="w-5 h-5" />
              <div className="flex flex-col text-left">
                <span className="hidden md:inline text-sm">Reorder</span>
                <span className="hidden md:inline font-extrabold">My Items</span>
              </div>
            </Button>


            <Button variant="ghost" className="hover:bg-blue-950 hover:text-white rounded-full py-2">
              <User className="w-5 h-5" />
              <div className='flex flex-col text-left'>
                <span className="hidden md:inline">Sign In</span>
                <span className='font-extrabold'>Account</span>
              </div>
            </Button>

            <Button variant="ghost" className="text-white hover:bg-blue-700 relative flex flex-col items-center">
              <ShoppingCart className="w-12 h-12" />
              {cartCount > 0 && (
                <Badge className="absolute -top-3 right-5 bg-yellow-400 text-black w-3 h-5 flex items-center justify-center text-xs">
                  {cartCount}
                </Badge>
              )}
              <span className="ml-2 hidden md:inline">${89.55}</span>
            </Button>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;
