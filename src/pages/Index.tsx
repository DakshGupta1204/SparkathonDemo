
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';
import HeroSection from '@/components/HeroSection';
import CategoryShowcase from '@/components/CategoryShowcase';
import ProductGrid from '@/components/ProductGrid';
import Footer from '@/components/Footer';
import FloatingCoCartButton from '@/components/FloatingCoCartButton';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <CategoryNav />
      <HeroSection />
      <CategoryShowcase />
      <ProductGrid />
      <Footer />
      <FloatingCoCartButton />
    </div>
  );
};

export default Index;
