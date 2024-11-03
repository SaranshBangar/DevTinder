import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit,
  User,
  Mail,
  Calendar,
  Cake,
  MapPin,
  Briefcase,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addUser } from "../utils/userSlice";
import { BASE_PROFILE_URL } from "../utils/constants";

export default function Profile() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("view");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    about: "",
    photoUrl: "",
    skills: [],
    birthDate: "",
    gender: "",
    location: "",
    occupation: "",
  });

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.5 } },
  };

  useEffect(() => {
    if (user?.data) {
      setFormData({
        firstName: user.data.firstName || "",
        lastName: user.data.lastName || "",
        about: user.data.about || "",
        photoUrl: user.data.photoUrl || "",
        skills: user.data.skills || [],
        birthDate: user.data.birthDate ? new Date(user.data.birthDate).toISOString().split('T')[0] : "2000-01-01",
        gender: user.data.gender || "",
        location: user.data.location || "",
        occupation: user.data.occupation || "",
      });
    }
  }, [user]);

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (date) => {
    const now = new Date();
    const joinedDate = new Date(date);
    const years = now.getFullYear() - joinedDate.getFullYear();
    const months = now.getMonth() - joinedDate.getMonth();
    const formattedDate = `${joinedDate.toLocaleString("default", {
      month: "long",
    })} ${joinedDate.getFullYear()}`;
    return `${formattedDate} [${years} year(s), ${months} month(s)]`;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === "skills") {
      setFormData({
        ...formData,
        skills: value.split(",").map((skill) => skill.trim()).filter((skill) => skill !== ""),
      });
    } else {
      setFormData({
        ...formData,
        [id]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const age = calculateAge(formData.birthDate);
      if (age < 18) {
        setError("You must be at least 18 years old to use this platform");
        setLoading(false);
        return;
      }

      const updateData = {
        ...formData,
        age: calculateAge(formData.birthDate),
        skills: Array.isArray(formData.skills) ? formData.skills : formData.skills.split(",").map((s) => s.trim()),
      };

      const res = await axios.patch(BASE_PROFILE_URL + "/update", updateData, {
        withCredentials: true,
      });

      dispatch(addUser(res.data.data));
      setSuccess("Profile updated successfully! Please reload the page to see the changes");
      setActiveTab("view");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    user && (
      <div className="min-h-screen p-4 my-16 bg-base-100 md:p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mb-4 text-center alert alert-error"
              >
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mb-4 alert alert-success"
              >
                <span className="text-center">{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mb-4 tabs tabs-boxed bg-base-300">
            <button
              className={`tab ${activeTab === "view" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("view")}
            >
              <User className="inline-block mr-2" /> View Profile
            </button>
            <button
              className={`tab ${activeTab === "edit" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("edit")}
            >
              <Edit className="inline-block mr-2" /> Edit Profile
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {activeTab === "view" ? (
                <div className="overflow-hidden shadow-xl card bg-base-300">
                  <div className="card-body">
                    <div className="flex items-center space-x-4 justify-evenly max-sm:gap-6 max-sm:flex-col">
                      <div className="avatar">
                        <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                          <img
                            src={user?.data?.photoUrl}
                            alt={`${user?.data?.firstName} ${
                              user?.data?.lastName && user?.data?.lastName
                            }`}
                          />
                        </div>
                      </div>
                      <div>
                        <h2 className="text-3xl card-title max-sm:text-center">
                          {user?.data?.firstName} {user?.data?.lastName && user?.data?.lastName}
                        </h2>
                        <div className="flex items-center mt-2">
                          <Mail className="mr-2" />
                          {user?.data?.emailId ? (
                            <span>{user?.data?.emailId}</span>
                          ) : (
                            <span className="italic text-error">
                              Not specified
                            </span>
                          )}
                        </div>
                        <div className="flex items-center mt-2">
                          <Briefcase className="mr-2" />
                          {user?.data?.occupation ? (
                            <span>{user?.data?.occupation}</span>
                          ) : (
                            <span className="italic text-error">
                              Not specified
                            </span>
                          )}
                        </div>
                        <div className="flex items-center mt-2">
                          <MapPin className="mr-2" />
                          {user?.data?.location ? (
                            <span>{user?.data?.location}</span>
                          ) : (
                            <span className="italic text-error">
                              Not specified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="divider"></div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <h3 className="mb-2 text-xl font-bold">About</h3>
                        {user?.data?.about ? (
                          <p className="text-sm">{user?.data?.about}</p>
                        ) : (
                          <p className="italic text-error">Not specified</p>
                        )}
                      </div>
                      <div>
                        <h3 className="mb-2 text-xl font-bold">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {user?.data?.skills.length > 1 ? (
                            user.data.skills.map((skill, index) => (
                              <span key={index} className="badge badge-primary">
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="italic text-error">
                              Not specified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="divider"></div>
                    <div className="grid grid-cols-2 gap-4 justify-items-center max-sm:grid-cols-1 max-sm:gap-y-6">
                      <div className="flex items-center">
                        <Calendar className="mr-2" />
                        <span>Joined : {formatDate(user?.data?.createdAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <Cake className="mr-2" />
                        {user?.data?.age ? (
                          <span>Age : {user?.data?.age}</span>
                        ) : (
                          <p>
                            Age :{" "}
                            <span className="italic text-error">
                              Not specified
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="shadow-xl card bg-base-300">
                  <div className="card-body">
                    <h2 className="card-title">Edit Your Profile</h2>
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="form-control">
                          <label className="label" htmlFor="firstName">
                            <span className="label-text">First Name</span>
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full input input-bordered"
                          />
                        </div>
                        <div className="form-control">
                          <label className="label" htmlFor="lastName">
                            <span className="label-text">Last Name</span>
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full input input-bordered"
                          />
                        </div>
                      </div>
                      <div className="form-control">
                        <label className="label" htmlFor="about">
                          <span className="label-text">About</span>
                        </label>
                        <textarea
                          id="about"
                          value={formData.about}
                          onChange={handleInputChange}
                          className="h-24 textarea textarea-bordered"
                        />
                      </div>
                      <div className="form-control">
                        <label className="label" htmlFor="firstName">
                          <span className="label-text">Photo URL</span>
                        </label>
                        <input
                          type="text"
                          id="photoUrl"
                          value={formData.photoUrl}
                          onChange={handleInputChange}
                          className="w-full input input-bordered"
                        />
                      </div>
                      <div className="form-control">
                        <label className="label" htmlFor="skills">
                          <span className="label-text">
                            Skills (comma-separated)
                          </span>
                        </label>
                        <input
                          type="text"
                          id="skills"
                          onChange={handleInputChange}
                          className="w-full input input-bordered"
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="form-control">
                          <label className="label" htmlFor="birthDate">
                            <span className="label-text">Birth Date</span>
                          </label>
                          <input
                            type="date"
                            id="birthDate"
                            value={formData.birthDate}
                            onChange={handleInputChange}
                            className="w-full input input-bordered"
                            max={new Date().toISOString().split('T')[0]}
                          />
                        </div>
                        <div className="form-control">
                          <label className="label" htmlFor="gender">
                            <span className="label-text">Gender</span>
                          </label>
                          <select
                            id="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className="w-full select select-bordered"
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="form-control">
                          <label className="label" htmlFor="location">
                            <span className="label-text">Location</span>
                          </label>
                          <input
                            type="text"
                            id="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className="w-full input input-bordered"
                          />
                        </div>
                        <div className="form-control">
                          <label className="label" htmlFor="occupation">
                            <span className="label-text">Occupation</span>
                          </label>
                          <input
                            type="text"
                            id="occupation"
                            value={formData.occupation}
                            onChange={handleInputChange}
                            className="w-full input input-bordered"
                          />
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="w-full btn btn-primary"
                        onClick={handleSubmit}
                        disabled={loading}
                      >
                        {loading ? "Saving..." : "Save Changes"}
                      </motion.button>
                      <p className="text-[10px] text-center">Please refresh the page after updating the profile</p>
                    </form>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    )
  );
}
