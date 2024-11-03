import React, { useEffect } from 'react';
import { X, Heart, Info } from 'lucide-react';

const FeedControls = () => {
  const handleAction = (action) => {
    console.log(action);
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      switch (event.key) {
        case 'ArrowRight':
          handleAction('like');
          break;
        case 'ArrowLeft':
          handleAction('dislike');
          break;
        case 'ArrowUp':
          handleAction('info');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <div className="p-4">
      <div className="flex items-center justify-center max-w-xl gap-6 mx-auto">
        {/* Dislike Button */}
        <button
          onClick={() => handleAction('dislike')}
          className="flex items-center justify-center w-16 h-16 transition-transform duration-200 bg-white border-2 rounded-full shadow-lg border-rose-500 text-rose-500 hover:scale-110"
        >
          <X size={30} />
        </button>

        {/* Info Button */}
        <button
          onClick={() => handleAction('info')}
          className="flex items-center justify-center text-blue-400 transition-transform duration-200 bg-white border-2 border-blue-400 rounded-full shadow-lg w-14 h-14 hover:scale-110"
        >
          <Info size={24} />
        </button>

        {/* Like Button */}
        <button
          onClick={() => handleAction('like')}
          className="flex items-center justify-center w-16 h-16 text-green-500 transition-transform duration-200 bg-white border-2 border-green-500 rounded-full shadow-lg hover:scale-110"
        >
          <Heart size={30} />
        </button>
      </div>
    </div>
  );
};

export default FeedControls;