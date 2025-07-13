
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const categories = [
  {
    title: 'Electronics',
    subtitle: 'Latest tech deals',
    image: '/placeholder.svg',
    color: 'from-blue-500 to-purple-600'
  },
  {
    title: 'Fashion',
    subtitle: 'Trending styles',
    image: '/placeholder.svg',
    color: 'from-pink-500 to-rose-600'
  },
  {
    title: 'Home & Garden',
    subtitle: 'Transform your space',
    image: '/placeholder.svg',
    color: 'from-green-500 to-emerald-600'
  },
  {
    title: 'Grocery',
    subtitle: 'Fresh & affordable',
    image: '/placeholder.svg',
    color: 'from-orange-500 to-red-600'
  },
  {
    title: 'Health & Beauty',
    subtitle: 'Self-care essentials',
    image: '/placeholder.svg',
    color: 'from-purple-500 to-pink-600'
  },
  {
    title: 'Sports & Outdoors',
    subtitle: 'Gear up for adventure',
    image: '/placeholder.svg',
    color: 'from-teal-500 to-cyan-600'
  }
];

const CategoryShowcase = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Shop by category</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <Card key={index} className="group cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-0">
                <div className={`h-32 bg-gradient-to-br ${category.color} rounded-t-lg relative overflow-hidden`}>
                  <img 
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover opacity-20"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h3 className="font-bold text-sm mb-1">{category.title}</h3>
                      <p className="text-xs opacity-90">{category.subtitle}</p>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <Button variant="ghost" size="sm" className="w-full text-xs hover:bg-gray-100">
                    Shop now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
