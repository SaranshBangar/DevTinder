import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_AUTH_URL } from "../utils/constants";

const Auth = () => {
  // Tab state management
  const [activeTab, setActiveTab] = useState("login");

  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Login form state
  const [emailId, setEmailId] = useState("rs@gmail.com");
  const [password, setPassword] = useState("Rohit@123");
  const [loginError, setLoginError] = useState("");

  // Redux and navigation hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Signup form state with validation errors
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Form validation error states
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // General signup error state
  const [signupError, setSignupError] = useState("");

  // Email validation using regex
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation - at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  // Handle login form validation and submission
  const handleLogin = async () => {
    setLoginError("");

    if (!emailId.trim()) {
      setLoginError("Email is required");
      return;
    }

    if (!isValidEmail(emailId)) {
      setLoginError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setLoginError("Password is required");
      return;
    }

    if (!isValidPassword(password)) {
      setLoginError("Invalid password format. Please check password requirements.");
      return;
    }

    try {
      const res = await axios.post(
        `${BASE_AUTH_URL}/login`,
        { emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      navigate("/");
    } catch (error) {
      setLoginError(error.response?.data?.message || "Invalid credentials!");
      console.error(error);
    }
  };

  // Handle signup form input changes with validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateField(name, value);
  };

  // Validate individual form fields
  const validateField = (fieldName, value) => {
    let error = "";

    switch (fieldName) {
      case "name":
        if (!value.trim()) {
          error = "Name is required";
        } else if (value.length < 2) {
          error = "Name must be at least 2 characters long";
        }
        break;
      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!isValidEmail(value)) {
          error = "Please enter a valid email address";
        }
        break;
      case "password":
        if (!value) {
          error = "Password is required";
        } else if (!isValidPassword(value)) {
          error = "Password doesn't meet requirements";
        }
        break;
      case "confirmPassword":
        if (!value) {
          error = "Please confirm your password";
        } else if (value !== formData.password) {
          error = "Passwords do not match";
        }
        break;
      default:
        break;
    }

    setFormErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  };

  // Check if all signup form fields are valid
  const isSignupFormValid = () => {
    return (
      formData.name.length >= 2 &&
      isValidEmail(formData.email) &&
      isValidPassword(formData.password) &&
      formData.password === formData.confirmPassword &&
      !Object.values(formErrors).some((error) => error)
    );
  };

  // Handle signup form submission
  const handleSignup = async () => {
    setSignupError("");

    if (!isSignupFormValid()) {
      setSignupError("Please fix all validation errors before submitting");
      return;
    }

    try {
      const res = await axios.post(
        `${BASE_AUTH_URL}/signup`,
        { name: formData.name, email: formData.email, password: formData.password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      navigate("/");
    } catch (error) {
      setSignupError(error.response?.data?.message || "Signup failed. Please try again.");
      console.error(error);
    }
  };

  return (
    <section className="flex items-center justify-center flex-1 max-md:my-10 max-md:mx-2">
      <div className="shadow-xl card bg-base-300 w-96">
        <div className="card-body">
          {/* Tab Toggle Buttons */}
          <div className="relative flex p-1 rounded-lg bg-base-200">
            <div
              className={`absolute transition-all duration-200 ease-in-out bg-primary rounded-md ${
                activeTab === "login" ? "left-1 w-[calc(50%-4px)]" : "left-[calc(50%+4px)] w-[calc(50%-8px)]"
              }`}
              style={{ height: "calc(100% - 8px)" }}
            />
            <button
              onClick={() => {
                setActiveTab("login");
                setLoginError("");
              }}
              className={`flex-1 z-10 py-2 text-center rounded-md transition-colors duration-200 ${
                activeTab === "login" ? "text-primary-content" : "text-base-content"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setActiveTab("signup");
                setSignupError("");
              }}
              className={`flex-1 z-10 py-2 text-center rounded-md transition-colors duration-200 ${
                activeTab === "signup" ? "text-primary-content" : "text-base-content"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Login Form */}
          {activeTab === "login" && (
            <>
              <label className="flex flex-col gap-1">
                <div className="flex items-center gap-2 input input-bordered">
                  <input
                    type="text"
                    name="email"
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                    className="grow"
                    placeholder="Email"
                  />
                </div>
              </label>

              <label className="flex flex-col gap-1">
                <div className="flex items-center gap-2 input input-bordered">
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
                </div>
              </label>

              {loginError && (
                <div className="flex alert alert-error">
                  <span>{loginError}</span>
                </div>
              )}

              <button className="w-full btn btn-primary" onClick={handleLogin}>
                Login
              </button>
            </>
          )}

          {/* Signup form */}
          {activeTab === "signup" && (
            <>
              {/* Full Name input */}
              <label className="flex items-center gap-2 input input-bordered">
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

              {signupError && (
                <div className="flex alert alert-error">
                  <span>{signupError}</span>
                </div>
              )}

              <button
                className="w-full btn btn-primary"
                onClick={handleSignup}
              >
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