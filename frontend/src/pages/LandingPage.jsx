import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Outlet } from 'react-router-dom'

const LandingPage = () => {
  return (
    <main>
        <Navbar />
        <Outlet />
        <Footer />
    </main>
  )
}

export default LandingPage