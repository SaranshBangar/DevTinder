import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Provider } from "react-redux"
import Profile from "./pages/Profile"
import LandingPage from "./pages/LandingPage"
import Auth from "./pages/Auth"
import reduxStore from "./utils/reduxStore"
import Feed from "./pages/Feed"
import Error from "./pages/Error"
import Requests from "./pages/Requests"
import Connections from "./pages/Connections"

function App() {
  return (
    <main>
      <Provider store={reduxStore}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<LandingPage />}>
              <Route path="/" element={<Feed />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/error" element={<Error />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </main>
  )
}

export default App