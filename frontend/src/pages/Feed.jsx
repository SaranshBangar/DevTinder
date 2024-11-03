import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { BASE_USER_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addFeed } from '../utils/feedSlice'
import UserCard from '../components/UserCard'
import FeedControls from '../components/FeedControls'

const Feed = () => {
  const feedData = useSelector((state) => state.feed);
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);

  const getFeed = async () => {
    if (feedData) return;

    try {
      const res = await axios.get(BASE_USER_URL + "/feed", {
        withCredentials: true
      });
      dispatch(addFeed(res.data));
    }
    catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    getFeed();
  }, []);

  // Only render if we have feed data and there are users left to show
  const shouldShowUser = feedData?.data && currentIndex < feedData.data.length;

  return (
    <div className='flex flex-col items-center justify-center mt-[15vh] max-h-screen overflow-hidden gap-2'>
      <UserCard
        user={shouldShowUser ? feedData.data[currentIndex] : null}
      />
      <FeedControls 
        onNext={() => setCurrentIndex(prev => prev + 1)}
        hasMore={shouldShowUser}
      />
    </div>
  )
}

export default Feed;