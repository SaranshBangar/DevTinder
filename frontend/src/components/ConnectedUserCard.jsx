import React from "react";
import { MessageCircle, UserMinus, Briefcase, MapPin } from "lucide-react";
import axios from "axios";
import { BASE_USER_URL } from "../utils/constants";

const ConnectedUserCard = ({ user }) => {
  const removeConnection = async () => {
    try {
      await axios.delete(BASE_USER_URL + "/remove/" + user._id, {
        withCredentials: true,
      });
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="card bg-base-300 shadow-xl max-w-sm w-full">
      <div className="card-body p-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="avatar">
              <div className="w-16 rounded-full">
                <img
                  src={user?.photoUrl || "/default-avatar.png"}
                  alt={`${user?.firstName}'s profile`}
                  onError={(e) => {
                    e.target.src = "/default-avatar.png";
                  }}
                />
              </div>
            </div>
            <div className="badge badge-success badge-xs absolute bottom-0 right-0 rounded-full border-2 border-base-100"></div>
          </div>

          <div>
            <h3 className="text-lg font-bold">
              {user?.firstName} {user?.lastName || ""}
            </h3>
            <p className="text-sm opacity-70">
              {user?.occupation || "Not specified"}
            </p>
          </div>
        </div>

        <div>
            {user?.about && (
                <p className="text-md opacity-90 mt-4">{user?.about}</p>
            )}
        </div>

        <div className="mt-4 space-y-2 flex justify-evenly items-center">
          {user?.occupation && (
            <div className="flex items-center gap-2 text-sm opacity-70">
              <Briefcase className="h-4 w-4" />
              <span>{user?.occupation}</span>
            </div>
          )}
          {user?.location && (
            <div className="flex items-center gap-2 text-sm opacity-70">
              <MapPin className="h-4 w-4" />
              <span>{user.location}</span>
            </div>
          )}
        </div>

        {user?.skills?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {user.skills.slice(0, 3).map((skill, index) => (
              <div key={index} className="badge badge-primary badge-outline">
                {skill}
              </div>
            ))}
            {user.skills.length > 3 && (
              <span className="text-xs opacity-70">
                +{user.skills.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="card-actions justify-between mt-4 pt-4 border-t">
          <button
            className="btn btn-outline btn-error btn-sm flex-1"
            onClick={removeConnection}
          >
            <UserMinus className="h-4 w-4" strokeWidth={1.25} />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectedUserCard;
