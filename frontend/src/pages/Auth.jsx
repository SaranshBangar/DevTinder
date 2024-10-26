import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_AUTH_URL } from "../utils/constants";

const Auth = () => {
  // State for toggling between login and signup tabs
  const [activeTab, setActiveTab] = useState("login");

  // State for toggling password visibility in input fields
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State for storing login email and password
  const [emailId, setEmailId] = useState("virat@gmail.com");
  const [password, setPassword] = useState("Virat@123");

  // Redux dispatch function
  const dispatch = useDispatch();

  // State for signup form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Handle change for signup input fields and update the formData state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to handle the login form submission
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const res = await axios.post(BASE_AUTH_URL + "/login", {
        emailId,
        password,
      }, {
        withCredentials : true,
      })
      dispatch(addUser(res.data));
      navigate("/");
    }
    catch (error) {
      console.error(error);
    }
  }

  // Check if password and confirmPassword match for signup validation
  const passwordsMatch = formData.password && formData.password === formData.confirmPassword;

  return (
    <section className="flex items-center justify-center flex-1 max-md:my-10 max-md:mx-2">
      <div className="shadow-xl card bg-base-300 w-96">
        <div className="card-body">
          {/* Toggle buttons for switching between login and signup forms */}
          <div className="relative flex p-1 rounded-lg bg-base-200">
            <div
              className={`absolute transition-all duration-200 ease-in-out bg-primary rounded-md ${
                activeTab === "login" 
                  ? "left-1 w-[calc(50%-4px)]" 
                  : "left-[calc(50%+4px)] w-[calc(50%-8px)]"
              }`}
              style={{ height: "calc(100% - 8px)" }}
            />

            {/* Login tab button */}
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 z-10 py-2 text-center rounded-md transition-colors duration-200 ${
                activeTab === "login" ? "text-primary-content" : "text-base-content"
              }`}
            >
              Login
            </button>

            {/* Signup tab button */}
            <button
              onClick={() => setActiveTab("signup")}
              className={`flex-1 z-10 py-2 text-center rounded-md transition-colors duration-200 ${
                activeTab === "signup" ? "text-primary-content" : "text-base-content"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Login form */}
          {activeTab === "login" && (
            <>
              <label className="flex items-center gap-2 input input-bordered">
                {/* Email input with icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                  <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                  <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                </svg>
                <input
                  type="text"
                  name="email"
                  value={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                  className="grow"
                  placeholder="Email"
                />
              </label>

              {/* Password input with icon and visibility toggle */}
              <label className="flex items-center gap-2 input input-bordered">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                  <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="grow"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn btn-ghost btn-sm btn-square"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </label>
              <button
                className="w-full btn btn-primary"
                onClick={handleLogin}
              >
                Login
              </button>
            </>
          )}

          {/* Signup form */}
          {activeTab === "signup" && (
            <>
              {/* Full Name input */}
              <label className="flex items-center gap-2 input input-bordered">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input
                  type="text"
                  name="name"
                  className="grow"
                  placeholder="Full Name"
                  onChange={handleChange}
                />
              </label>

              {/* Email input */}
              <label className="flex items-center gap-2 input input-bordered">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                  <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                  <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                </svg>
                <input
                  type="text"
                  name="email"
                  className="grow"
                  placeholder="Email"
                  onChange={handleChange}
                />
              </label>

              {/* Password input */}
              <label className="flex items-center gap-2 input input-bordered">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                  <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="grow"
                  placeholder="Password"
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn btn-ghost btn-sm btn-square"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </label>

              {/* Confirm Password input */}
              <label className="flex items-center gap-2 input input-bordered">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70">
                  <path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" />
                </svg>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  className="grow"
                  placeholder="Confirm Password"
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="btn btn-ghost btn-sm btn-square"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </label>

              {/* Submit button for signup */}
              <button className="w-full btn btn-primary" disabled={!passwordsMatch}>
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Auth;
