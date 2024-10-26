import { BrowserRouter, Route, Routes } from "react-router-dom"
import Profile from "./pages/Profile"
import LandingPage from "./pages/LandingPage"
import Auth from "./pages/Auth"

function App() {
  return (
    <main>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<LandingPage />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/auth" element={<Auth />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </main>
  )
}

export default App