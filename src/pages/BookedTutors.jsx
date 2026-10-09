import React, { useContext, useEffect, useState } from 'react';
import { useLoaderData } from 'react-router';
import Swal from 'sweetalert2';
import { AuthContext } from '../context/AuthContext';

// Main App component
const BookedTutors = () => {
  const bookedTutors = useLoaderData();
  const [myBookedTutor, setMyBookedTutor] = useState([]);
  console.log(bookedTutors);


  // console.log(bookedTutors);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const filteredTiturs = bookedTutors.filter((tutor) => tutor.userEmail === user.email)
    setMyBookedTutor(filteredTiturs);
  }, [])
  // Function to handle leaving a review (for demonstration)
  const handleLeaveReview = (id) => {
    //console.log(`Leaving review for tutor with ID: ${id}`);

    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Your review has been updated successfully",
      showConfirmButton: false,
      timer: 1500
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Header Section */}
        <div className="p-6 sm:p-8 border-b border-gray-200">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">My Booked Tutors</h1>
          <p className="text-gray-600 text-lg">Manage your language learning sessions and leave reviews</p>
        </div>

        {/* Tutors Grid Section */}
        <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myBookedTutor.map((tutor) => (
            <div key={tutor._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              {/* Tutor Image */}
              <img
                src={tutor.image}
                alt={`${tutor.tutorName} profile`}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/300x200/cccccc/333333?text=Image+Error";
                }}
              />

              {/* Tutor Details */}
              <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800 mb-1">{tutor.tutorName}</h2>
                <p className="text-gray-600 text-sm mb-2">{tutor.language}</p>
                <p className="text-gray-700 text-sm mb-2">Tutor: {tutor.tutorEmail}</p>

                <div className="flex justify-between items-center mb-4">
                  <p className="text-lg font-semibold text-gray-900">${tutor.pricePerHour}/hr</p>
                  <p className="text-gray-500 text-sm">Booked: {tutor?.date}</p>
                </div>

                {/* Leave Review Button */}
                <button
                  onClick={() => handleLeaveReview(tutor._id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                >
                  {/* Star Icon for review */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  <span>Leave Review</span>
                </button>
                <p className="text-gray-500 text-xs text-center mt-2">
                  Click to increase the tutor's review count
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookedTutors;
