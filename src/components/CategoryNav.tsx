
import { Button } from '@/components/ui/button';

const categories = [
  'Grocery & Essentials',
  'Fashion',
  'Electronics',
  'Home',
  'Patio & Garden',
  'Sports & Outdoors',
  'Auto & Tires',
  'Toys',
  'Baby',
  'Health & Wellness',
  'Pharmacy',
  'Business & Industrial'
];

const CategoryNav = () => {
  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-8 py-3 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category}
              variant="ghost"
              className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 whitespace-nowrap text-sm font-normal"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default CategoryNav;
