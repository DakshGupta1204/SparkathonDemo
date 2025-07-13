
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Newsletter */}
        <div className="bg-blue-600 rounded-lg p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2">Get the Walmart App</h3>
              <p className="text-blue-100">Shop, save money & live better - all in one app.</p>
            </div>
            <div className="flex space-x-4">
              <Button className="bg-black hover:bg-gray-800 text-white px-6">
                <img src="/placeholder.svg" alt="App Store" className="w-6 h-6 mr-2" />
                App Store
              </Button>
              <Button className="bg-black hover:bg-gray-800 text-white px-6">
                <img src="/placeholder.svg" alt="Google Play" className="w-6 h-6 mr-2" />
                Google Play
              </Button>
            </div>
          </div>
        </div>

        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-bold text-lg mb-4">All Departments</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white">Auto & Tires</a></li>
              <li><a href="#" className="hover:text-white">Baby</a></li>
              <li><a href="#" className="hover:text-white">Beauty</a></li>
              <li><a href="#" className="hover:text-white">Books</a></li>
              <li><a href="#" className="hover:text-white">Cell Phones</a></li>
              <li><a href="#" className="hover:text-white">Clothing</a></li>
              <li><a href="#" className="hover:text-white">Electronics</a></li>
              <li><a href="#" className="hover:text-white">Food</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white">Auto Services</a></li>
              <li><a href="#" className="hover:text-white">Credit & Payment</a></li>
              <li><a href="#" className="hover:text-white">Gift Cards</a></li>
              <li><a href="#" className="hover:text-white">Money Services</a></li>
              <li><a href="#" className="hover:text-white">Pharmacy</a></li>
              <li><a href="#" className="hover:text-white">Photo Services</a></li>
              <li><a href="#" className="hover:text-white">Protection Plans</a></li>
              <li><a href="#" className="hover:text-white">Walmart+</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Customer Care</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white">Store Directory</a></li>
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
              <li><a href="#" className="hover:text-white">Returns</a></li>
              <li><a href="#" className="hover:text-white">Product Recalls</a></li>
              <li><a href="#" className="hover:text-white">Accessibility</a></li>
              <li><a href="#" className="hover:text-white">Tax Exempt Program</a></li>
              <li><a href="#" className="hover:text-white">Get to Know Us</a></li>
              <li><a href="#" className="hover:text-white">Help</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Get to Know Us</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Our Company</a></li>
              <li><a href="#" className="hover:text-white">Sell on Walmart.com</a></li>
              <li><a href="#" className="hover:text-white">Investors</a></li>
              <li><a href="#" className="hover:text-white">Affiliates & Partners</a></li>
              <li><a href="#" className="hover:text-white">Press Room</a></li>
              <li><a href="#" className="hover:text-white">Walmart Foundation</a></li>
            </ul>

            <div className="mt-6">
              <h5 className="font-semibold mb-3">Follow Us</h5>
              <div className="flex space-x-3">
                <Button size="sm" variant="ghost" className="text-gray-300 hover:text-white">
                  <Facebook className="w-5 h-5" />
                </Button>
                <Button size="sm" variant="ghost" className="text-gray-300 hover:text-white">
                  <Twitter className="w-5 h-5" />
                </Button>
                <Button size="sm" variant="ghost" className="text-gray-300 hover:text-white">
                  <Instagram className="w-5 h-5" />
                </Button>
                <Button size="sm" variant="ghost" className="text-gray-300 hover:text-white">
                  <Youtube className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter signup */}
        <div className="border-t border-gray-700 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="font-bold text-lg mb-2">Sign up for email</h4>
              <p className="text-gray-300 text-sm">Get the latest news, offers and more.</p>
            </div>
            <div className="flex space-x-2">
              <Input 
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              />
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Mail className="w-4 h-4 mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <div className="mb-4 md:mb-0">
            <p>&copy; 2024 Walmart. All Rights Reserved.</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Use</a>
            <a href="#" className="hover:text-white">California Privacy Rights</a>
            <a href="#" className="hover:text-white">Your Privacy Choices</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
