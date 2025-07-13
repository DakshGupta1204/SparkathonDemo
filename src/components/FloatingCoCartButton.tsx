import { useState } from 'react';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const FloatingCoCartButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <Button
        onClick={() => navigate('/cocart')}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
          text-white shadow-lg hover:shadow-xl
          rounded-full transition-all duration-300 ease-in-out
          px-6 py-3 flex items-center space-x-3
          ${isHovered ? 'scale-105' : 'scale-100'}
        `}
      >
        <Users className="w-6 h-6" />
        <span className="font-semibold text-lg">
          CoCart
        </span>
      </Button>
    </div>
  );
};

export default FloatingCoCartButton;
