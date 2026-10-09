import React, { useState } from 'react';
import { IoIosStar } from 'react-icons/io';
import { Link } from 'react-router';




// Tutor Card Component
const TutorCard = ({ tutor }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl">
    <img
      src={tutor.tutorialImageUrl}
      alt={`Portrait of ${tutor.yourName}`}
      className="w-full h-48 object-cover"
      onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/E2E8F0/4A5568?text=Image+Not+Found'; }}
    />
    <div className="p-6">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold text-gray-800">{tutor.yourName}</h3>
        <div className="flex items-center space-x-1 text-gray-600">
          <IoIosStar className='text-yellow-400' />
          <span>({tutor.reviews || 5})</span>
        </div>
      </div>
      <p className="text-md text-indigo-600 font-semibold mt-1">{tutor.language}</p>
      <p className="text-gray-700 mt-2 text-sm">{tutor.description}</p>
      <div className="mt-4 flex justify-between items-center">
        <p className="text-lg font-bold text-gray-900">${tutor.pricePerHour}/hr</p>
        <Link to={`/tutor/${tutor._id}`}>
          <button className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200">
            View Details
          </button>
        </Link>
      </div>
    </div>
  </div>
);


export default TutorCard;