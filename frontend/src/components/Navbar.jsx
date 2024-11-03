import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BASE_USER_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { Heart, Users, Menu } from 'lucide-react';
import { useEffect, useState } from "react";

function Navbar() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_AUTH_URL + "/logout", {}, { 
        withCredentials: true 
      });
      localStorage.clear();
      sessionStorage.clear();
      dispatch(removeUser());
      navigate("/auth");
    } catch (error) {
      console.error(error);
    }
  };

  const [totalRequests, setTotalRequests] = useState(0)
  const getRequests = async () => {
    try {
      const response = await axios.get(BASE_USER_URL + "/requests", {
        withCredentials: true,
      });
      setTotalRequests(response.data.data.length);
    } catch (error) {
      console.error(error);
    }
  };

  const [totalConnections, setTotalConnections] = useState(0)
  const getConnections = async () => {
    try {
      const response = await axios.get(BASE_USER_URL + "/connections", {
        withCredentials: true,
      });
      setTotalConnections(response.data.data.length);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getRequests();
    getConnections();
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-10">
      <div className="navbar bg-base-300">
        {/* Company Name */}
        <div className="flex-1">
          <Link to="/" className="text-xl font-bold normal-case btn btn-ghost">
            DevTinder
          </Link>
        </div>

        {/* Desktop Navigation */}
        {user && 
          <div className="hidden gap-6 mx-8 md:flex">
            <Link
              to="/requests"
              className="p-2 transition-colors duration-200 rounded-full indicator hover:bg-neutral-content/30"
            >
              <Heart className="w-6 h-6" />
              <span className="badge badge-sm badge-primary indicator-item">{totalRequests}</span>
            </Link>
            <Link
              to="/connections"
              className="p-2 transition-colors duration-200 rounded-full indicator hover:bg-neutral-content/30"
            >
              <Users className="w-6 h-6" />
              <span className="badge badge-sm badge-secondary indicator-item">{totalConnections}</span>
            </Link>
          </div>
        }

        {/* Desktop Profile */}
        {user && (
          <div className="hidden md:flex">
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar online"
              >
                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={user?.data?.photoUrl} alt={`${user?.data?.firstName}'s avatar`} />
                </div>
              </div>

              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-200 rounded-box w-52"
              >
                <li className="px-4 py-2 text-sm font-medium menu-title">
                  <span>{user?.data?.firstName} {user?.data?.lastName}</span>
                </li>
                <div className="my-0 divider"></div>
                <li><Link to="/profile">Profile</Link></li>
                <li><button onClick={handleLogout} className="text-error">Logout</button></li>
              </ul>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {user && (
          <div className="dropdown dropdown-end md:hidden">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <Menu className="w-6 h-6" />
            </label>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-200 rounded-box w-52">
              {/* Requests */}
              <li>
                <Link to="/requests" className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Requests
                  <span className="badge badge-sm badge-primary">{totalRequests}</span>
                </Link>
              </li>
              {/* Connections */}
              <li>
                <Link to="/connections" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Connections
                  <span className="badge badge-sm badge-secondary">{totalConnections}</span>
                </Link>
              </li>
              
              <div className="my-0 divider"></div>
              
              {/* Nested Profile Dropdown */}
              <li>
                <details>
                  <summary className="flex items-center gap-2">
                    <div className="avatar">
                      <div className="w-4 h-4 rounded-full">
                        <img alt={`${user?.data?.firstName}'s avatar`} src={user?.data?.photoUrl} />
                      </div>
                    </div>
                    {user?.data?.firstName}'s Profile
                  </summary>
                  <ul>
                    <li>
                      <Link to="/profile">View Profile</Link>
                    </li>
                    <li>
                      <button onClick={handleLogout} className="text-error">
                        Logout
                      </button>
                    </li>
                  </ul>
                </details>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;