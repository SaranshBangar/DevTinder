import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { X, Heart } from 'lucide-react';
import { addFeed } from '../utils/feedSlice';
import UserCard from '../components/UserCard';
import { BASE_REQUEST_URL, BASE_USER_URL } from '../utils/constants';
import { AnimatePresence, motion } from 'framer-motion';

const FeedControls = ({ onAction, hasMore }) => {
  const [lastAction, setLastAction] = useState(null)

  const handleAction = async (action) => {
    if (!hasMore) return
    setLastAction(action)
    await onAction(action)
    setTimeout(() => setLastAction(null), 300)
  }

  useEffect(() => {
    const handleKeyPress = (event) => {
      switch (event.key) {
        case 'ArrowRight':
          handleAction('like')
          break
        case 'ArrowLeft':
          handleAction('dislike')
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [hasMore])

  return (
    <div className="p-4 relative">
      <div className="flex items-center justify-center max-w-xl gap-6 mx-auto">
        <AnimatePresence>
          {lastAction === 'dislike' && (
            <motion.div
              initial={{ x: 0, opacity: 1 }}
              animate={{ x: -100, opacity: 0 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <X size={60} className="text-rose-500" />
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => handleAction('dislike')}
          disabled={!hasMore}
          className="flex items-center justify-center w-16 h-16 transition-all duration-200 bg-white border-2 rounded-full shadow-lg border-rose-500 text-rose-500 hover:scale-110 disabled:opacity-50 disabled:hover:scale-100 hover:bg-rose-100"
        >
          <X size={30} />
        </button>

        <button
          onClick={() => handleAction('like')}
          disabled={!hasMore}
          className="flex items-center justify-center w-16 h-16 text-green-500 transition-all duration-200 bg-white border-2 border-green-500 rounded-full shadow-lg hover:scale-110 disabled:opacity-50 disabled:hover:scale-100 hover:bg-green-100"
        >
          <Heart size={30} />
        </button>

        <AnimatePresence>
          {lastAction === 'like' && (
            <motion.div
              initial={{ x: 0, opacity: 1 }}
              animate={{ x: 100, opacity: 0 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <Heart size={60} className="text-green-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

const Feed = () => {
  const feedData = useSelector((state) => state.feed);
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const getFeed = async () => {
    if (feedData?.data?.length > 0) return;

    try {
      const res = await axios.get(BASE_USER_URL + "/feed", {
        withCredentials: true
      });
      dispatch(addFeed(res.data));
    } catch (err) {
      console.error('Error fetching feed:', err);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  const shouldShowUser = feedData?.data && currentIndex < feedData.data.length;
  const currentUser = shouldShowUser ? feedData.data[currentIndex] : null;

  const handleAction = async (action) => {
    if (isLoading || !currentUser) return;

    setIsLoading(true);
    try {
      await axios.post(
        `${BASE_REQUEST_URL}/send/${action}/${currentUser._id}`,
        {},
        { withCredentials: true }
      );
      
      setCurrentIndex(prev => prev + 1);
    } catch (err) {
      console.error(`Error sending ${action} request:`, err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-[15vh] max-h-screen overflow-hidden gap-2">
      <UserCard user={currentUser} />
      <FeedControls 
        onAction={handleAction}
        hasMore={shouldShowUser && !isLoading}
      />
    </div>
  );
};

export default Feed;