import React from "react";

const UserCard = ({ user }) => {
  if (!user) {
    return (
      <div className="shadow-xl card bg-base-300 w-96 max-md:mx-2 max-[400px]:w-fit p-8 text-center">
        No more users available :(
      </div>
    );
  }

  return (
    <div className="shadow-xl card bg-base-300 w-[350px] max-md:mx-2 max-[400px]:w-fit">
      <figure>
        <img src={user.photoUrl} alt={user.firstName} />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {user.firstName} {user.lastName && user.lastName}
        </h2>
        {user.age ? (user.gender ? <p>{user.age}, {user.gender}</p> : <p>{user.age}</p>) : (user.gender ? <p>{user.gender}</p> : <></>)}
        {user.about && <p>{user.about}</p>}
        {user.skills?.length > 0 && (
          <div className="justify-end card-actions">
            {user.skills.map((skill, index) => (
              <div key={index} className="badge badge-secondary">
                {skill}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
