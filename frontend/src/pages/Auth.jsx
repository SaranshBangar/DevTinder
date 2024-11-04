import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_AUTH_URL } from "../utils/constants";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailId, setEmailId] = useState("rs@gmail.com");
  const [password, setPassword] = useState("Rohit@123");
  const [loginError, setLoginError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
  });

  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
  });

  const [signupError, setSignupError] = useState("");

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleLogin = async () => {
    setLoginError("");

    if (!emailId.trim() || !isValidEmail(emailId)) {
      setLoginError("Please enter a valid email address");
      return;
    }

    if (!password || !isValidPassword(password)) {
      setLoginError("Invalid password format");
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    let error = "";

    switch (fieldName) {
      case "firstName":
      case "lastName":
        if (!value.trim()) {
          error = `${fieldName === 'firstName' ? 'First' : 'Last'} name is required`;
        }
        break;
      case "emailId":
        if (!value.trim() || !isValidEmail(value)) {
          error = "Please enter a valid email address";
        }
        break;
      case "password":
        if (!value || !isValidPassword(value)) {
          error = "Password must have 8+ chars, uppercase, lowercase, number, and special char";
        }
        break;
      case "confirmPassword":
        if (value !== formData.password) {
          error = "Passwords do not match";
        }
        break;
      case "birthDate":
        if (!value) {
          error = "Birth date is required";
        }
        break;
      default:
        break;
    }

    setFormErrors(prev => ({
      ...prev,
      [fieldName]: error,
    }));
  };

  const isSignupFormValid = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      isValidEmail(formData.emailId) &&
      isValidPassword(formData.password) &&
      formData.password === formData.confirmPassword &&
      formData.birthDate &&
      !Object.values(formErrors).some(error => error)
    );
  };

  const handleSignup = async () => {
    setSignupError("");

    if (!isSignupFormValid()) {
      setSignupError("Please fix all validation errors before submitting");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_AUTH_URL}/signup`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          emailId: formData.emailId,
          password: formData.password,
          birthDate: formData.birthDate,
        },
        { withCredentials: true }
      );
      
      dispatch(addUser(response.data.data));
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

          {activeTab === "signup" && (
            <>
              <label className="flex items-center gap-2 input input-bordered">
                <input
                  type="text"
                  name="firstName"
                  className="grow"
                  placeholder="First Name"
                  onChange={handleChange}
                />
              </label>

              <label className="flex items-center gap-2 input input-bordered">
                <input
                  type="text"
                  name="lastName"
                  className="grow"
                  placeholder="Last Name"
                  onChange={handleChange}
                />
              </label>

              <label className="flex items-center gap-2 input input-bordered">
                <input
                  type="text"
                  name="emailId"
                  className="grow"
                  placeholder="Email"
                  onChange={handleChange}
                />
              </label>

              <label className="flex items-center gap-2 input input-bordered">
                <input
                  type="date"
                  name="birthDate"
                  className="grow"
                  onChange={handleChange}
                />
              </label>

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

              {Object.values(formErrors).map((error, index) => 
                error ? (
                  <div key={index} className="flex alert alert-warning">
                    <span>{error}</span>
                  </div>
                ) : null
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