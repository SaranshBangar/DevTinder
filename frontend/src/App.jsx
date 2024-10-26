import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Provider } from "react-redux"
import Profile from "./pages/Profile"
import LandingPage from "./pages/LandingPage"
import Auth from "./pages/Auth"
import reduxStore from "./utils/reduxStore"
import Feed from "./pages/Feed"

function App() {
  return (
    <main>
      <Provider store={reduxStore}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<LandingPage />}>
              <Route path="/" element={<Feed />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/auth" element={<Auth />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </main>
  )
}

export default App