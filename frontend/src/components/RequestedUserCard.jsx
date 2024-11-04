import React, { useState } from 'react';
import { Briefcase, MapPin, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import { BASE_REQUEST_URL } from '../utils/constants';

const RequestedUserCard = ({ user }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleConnection = async (status) => {
        if (!user?._id || isLoading) return;
        
        setIsLoading(true);
        try {
            await axios.post(`${BASE_REQUEST_URL}/review/${status}/${user._id}`, {}, {
                withCredentials: true,
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
            window.location.reload();
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className="card bg-base-300 shadow-xl max-w-sm w-full">
            <div className="card-body p-4">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="avatar">
                            <div className="w-16 rounded-full">
                                <img 
                                    src={user.senderId.photoUrl || '/default-avatar.png'} 
                                    alt={`${user.senderId.firstName}'s profile`}
                                    onError={(e) => {
                                        e.target.src = '/default-avatar.png';
                                    }}
                                />
                            </div>
                        </div>
                        <div className="badge badge-success badge-xs absolute bottom-0 right-0 rounded-full border-2 border-base-100"></div>
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-bold">
                            {user.senderId.firstName} {user.senderId.lastName || ''}
                        </h3>
                        <p className="text-sm opacity-70">
                            {user.senderId.age}, {user?.senderId?.gender?.charAt(0).toUpperCase() || 'Not specified'}
                        </p>
                    </div>
                </div>

                <div>
                    {user.senderId.about && (
                        <p className="text-md opacity-90 mt-4">{user.senderId.about}</p>
                    )}
                </div>

                <div className="mt-4 space-y-2 flex justify-evenly items-center">
                    {user?.senderId?.occupation && (
                        <div className="flex items-center gap-2 text-sm opacity-70">
                            <Briefcase className="h-4 w-4" />
                            <span>{user?.senderId?.occupation || 'Not specified'}</span>
                        </div>
                    )}
                    {user.senderId.location && (
                        <div className="flex items-center gap-2 text-sm opacity-70">
                            <MapPin className="h-4 w-4" />
                            <span>{user.senderId.location}</span>
                        </div>
                    )}
                </div>

                {user.senderId.skills?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {user.senderId.skills.slice(0, 3).map((skill, index) => (
                            <div key={index} className="badge badge-primary badge-outline">
                                {skill}
                            </div>
                        ))}
                        {user.senderId.skills.length > 3 && (
                            <span className="text-xs opacity-70">
                                +{user.senderId.skills.length - 3} more
                            </span>
                        )}
                    </div>
                )}

                <div className="card-actions justify-between mt-4 pt-4 border-t">
                    <button 
                        className="btn btn-outline btn-success btn-sm flex-1"
                        onClick={() => handleConnection('accepted')}
                        disabled={isLoading}
                    >
                        <CheckCircle className="h-4 w-4" strokeWidth={1.25} />
                        Accept
                    </button>
                    <button 
                        className="btn btn-outline btn-error btn-sm flex-1"
                        onClick={() => handleConnection('rejected')}
                        disabled={isLoading}
                    >
                        <XCircle className="h-4 w-4" strokeWidth={1.25} />
                        Reject
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RequestedUserCard;