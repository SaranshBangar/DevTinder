import React from "react"
import { User, MapPin, Briefcase, Calendar } from "lucide-react"

const UserCard = ({ user }) => {
  if (!user) {
    return (
      <div className="flex items-center justify-center w-fit p-6 mx-auto bg-base-300 rounded-lg shadow-3xl">
        <p className="text-xl font-semibold text-gray-500">No more users available 😢</p>
      </div>
    )
  }

  return (
    <div className="card w-full max-w-sm mx-auto bg-base-300 shadow-xl overflow-hidden rounded-3xl">
      <div className="relative h-48 bg-gradient-to-r from-primary to-secondary">
        <img
          src={user.photoUrl}
          alt={user.firstName}
          className="object-cover w-32 h-32 mx-auto mt-8 border-4 border-base-100 rounded-full shadow-lg"
        />
      </div>
      <div className="card-body p-6">
        <div className="text-center">
          <h2 className="card-title justify-center text-2xl font-bold">
            {user.firstName} {user.lastName}
          </h2>
          <div className="flex items-center justify-center mt-2 space-x-2 text-base-content/70">
            {user.age && (
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {user.age} years
              </span>
            )}
            {user.gender && (
              <span className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {user.gender}
              </span>
            )}
          </div>
        </div>
        {user.about && (
          <p className="mt-4 text-sm text-center text-base-content/80">{user.about}</p>
        )}
        {(user.location || user.occupation) && (
          <div className="flex justify-center mt-4 space-x-4 text-sm text-base-content/70">
            {user.location && (
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {user.location}
              </span>
            )}
            {user.occupation && (
              <span className="flex items-center">
                <Briefcase className="w-4 h-4 mr-1" />
                {user.occupation}
              </span>
            )}
          </div>
        )}
        {user.skills && user.skills.length > 0 && (
          <div className="card-actions justify-center mt-6">
            {user.skills.map((skill, index) => (
              <div
                key={index}
                className="badge badge-outline hover:badge-primary transition-colors duration-200"
              >
                {skill}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserCard