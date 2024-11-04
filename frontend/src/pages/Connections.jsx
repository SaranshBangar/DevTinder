import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_USER_URL } from "../utils/constants";
import ConnectedUserCard from "../components/ConnectedUserCard";
import { useNavigate } from "react-router-dom";

export default function Connections() {

  const user = useSelector((state) => state.user);
  const [connections, setConnections] = useState([]);

  const getConnection = async () => {
    try {
      const res = await axios.get(BASE_USER_URL + "/connections", {
        withCredentials: true,
      });
      setConnections(res?.data?.data || []);
    }
    catch (error) {
      console.error(error)
    }
  };

  const navigate = useNavigate();
  const noMoreUsersNavigation = () => {
    navigate('/');
  }

  useEffect(() => {
    getConnection();
  }, []);

  return (
    user && (
      <div className="container mx-auto px-4 py-8">
        {connections.length === 0 && (
          <div className="w-full flex justify-center items-center flex-col mt-16 gap-8">
            <div className="flex items-center justify-center w-fit p-6 mx-auto bg-base-300 rounded-lg shadow-3xl">
              <p className="text-xl font-semibold text-gray-500">No connections available 😢</p>
            </div>
            <div className="flex justify-center">
              <button onClick={noMoreUsersNavigation} className="btn btn-secondary w-fit">Go to Feed</button>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-6 my-12">
          {connections.map((connection) => (
            <ConnectedUserCard key={connection._id} user={connection} />
          ))}
        </div>
      </div>
    )
  );
}