import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Outlet, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { BASE_PROFILE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addUser } from '../utils/userSlice'
import { useEffect } from 'react'

const LandingPage = () => {

  const userData = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchUser = async () => {
    if (userData)
      return;
    try {
      const res = await axios.get(BASE_PROFILE_URL, {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
    }
    catch (error) {
      if (error.response.status === 401) {
        navigate('/auth');
      }
      else navigate('/error');
      console.error(error)
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <main className='flex flex-col min-h-screen'>
        <Navbar />
        <Outlet />
        <div className='fixed bottom-0 w-full'><Footer /></div>
    </main>
  )
}

export default LandingPage