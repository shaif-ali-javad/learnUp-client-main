import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useLoaderData } from 'react-router';
import Swal from 'sweetalert2';

// Main App component
const TutorDetails = () => {
  const { user } = useContext(AuthContext);
  const tutorDetails = useLoaderData();
  const [isLoading, setIsLoading] = useState(false);

  const handleBooking = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const bookingData = {
      tutorName: tutorDetails.yourName,
      tutorialId: tutorDetails._id,
      tutorEmail: tutorDetails.yourEmail,
      image: tutorDetails.tutorialImageUrl || "https://placehold.co/160x160/cbd5e1/2d3748?text=No+Image",
      pricePerHour: tutorDetails.pricePerHour,
      language: tutorDetails.language,
      date: new Date().toLocaleDateString(),
      userEmail: user.email
    }
    try {
      const res = await fetch('http://localhost:4000/book-tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      })
      const data = await res.json();

      if (data.acknowledged) {
        /*  bookingData({
           tutorName: user?.displayName || '',
           tutorEmail: user?.email || '',
           tutorialImageUrl: '',
           language: '',
           pricePerHour: '',
           description: '',
         }); */

        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Tutor booked successfully!',
          text: 'Thanks !',
          showConfirmButton: false,
          timer: 2000,
        });
        setIsLoading(false)
      } else {
        Swal.fire({
          title: 'Something went wrong',
          text: data.message || 'Please try again later.',
          icon: 'error',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Network Error',
        text: error.message || 'Unable to submit tutorial.',
        icon: 'error',
      });
    }

  }
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Profile Header Section */}
        <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center space-y-6 sm:space-y-0 sm:space-x-8 border-b border-gray-200">
          {/* Profile Image */}
          <div className="flex-shrink-0 w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden shadow-md">
            <img
              src="https://placehold.co/160x160/cbd5e1/2d3748?text=Profile"
              alt="Maria Chen profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/160x160/cbd5e1/2d3748?text=Error";
              }}
            />
          </div>

          {/* Profile Details and Rating */}
          <div className="flex-grow">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{tutorDetails.yourName}</h1>
            <p className="text-xl text-indigo-600 font-semibold mb-3">{tutorDetails.language} Teacher</p>
            <div className="flex items-center mb-4 space-x-2">
              {/* Star Rating - Using Unicode stars for simplicity */}
              <span className="text-yellow-500 text-lg">★★★★★</span>
              <span className="text-gray-600 text-sm">4.9 (89 reviews)</span>
            </div>
            {/* Tags/Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-3 py-1 rounded-full">
                Native Speaker
              </span>
              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-3 py-1 rounded-full">
                Professional Teacher
              </span>
              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-3 py-1 rounded-full">
                {tutorDetails.language} Expert
              </span>
            </div>
            {/* Bio */}
            <p className="text-gray-700 leading-relaxed">
              Certified Mandarin teacher with university education background. Patient and encouraging teaching style.
            </p>
          </div>
        </div>

        {/* Main Content Area - Grid Layout for two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 sm:p-8">
          {/* Left Column: Teaching Experience */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Teaching Experience</h2>

            {/* Professional Chinese Instructor */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Professional {tutorDetails.language} Instructor</h3>
              <p className="text-gray-600 mb-3 text-sm">Language Academy • 2020-Present</p>
              <p className="text-gray-700 leading-relaxed">
                Teaching {tutorDetails.language} to students of all levels with personalized approaches and proven methodologies.
              </p>
            </div>

            {/* Online Chinese Tutor */}
            <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Online {tutorDetails.language} Tutor</h3>
              <p className="text-gray-600 mb-3 text-sm">Freelance • 2018-2020</p>
              <p className="text-gray-700 leading-relaxed">
                Provided personalized {tutorDetails.language} lessons to students worldwide via online platforms.
              </p>
            </div>
          </div>

          {/* Right Column: Booking Information */}
          <div className="lg:col-span-1 bg-gray-50 p-6 rounded-lg shadow-md flex flex-col justify-between">
            <div>
              {/* Hourly Rate */}
              <div className="mb-6 pb-4 border-b border-gray-200">
                <p className="text-4xl font-bold text-gray-900 mb-1">${tutorDetails.pricePerHour}</p>
                <p className="text-sm text-gray-600">per hour</p>
              </div>

              {/* Session Details */}
              <ul className="space-y-3 text-gray-700 mb-6">
                <li className="flex items-center space-x-2">
                  <svg className="h-5 w-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span>Flexible scheduling</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="h-5 w-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span>1-2 hour sessions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="h-5 w-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>Online via video call</span>
                </li>
              </ul>

              {/* Login/Booking Button */}
              <button
                onClick={user ? handleBooking : null}
                disabled={!user || isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
              >
                {isLoading ? 'Booking...' : user ? 'Book Now' : 'Login to Book'}
              </button>



              {/* Cancellation Policy */}
              <p className="text-gray-500 text-xs mt-4 text-center">
                Free cancellation up to 24 hours before
              </p>
            </div>

            {/* Login prompt (if needed) */}
            {
              !user && <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg text-sm mt-6">
                <p className="text-center">Please log in to book a session with this tutor</p>
              </div>
            }

          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDetails;
