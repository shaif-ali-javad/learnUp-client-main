import React, { useContext, useEffect, useState } from 'react';
import { useLoaderData } from 'react-router';
import Swal from 'sweetalert2';
import { AuthContext } from '../context/AuthContext';

const MyTutorials = () => {
  const tutorials = useLoaderData();
  const [initialTutorialsData] = useState(tutorials);
  const [tutorialsData, setTutorialsData] = useState([]);
  const [selectedTutorial, setSelectedTutorial] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useContext(AuthContext);
  console.log('tutorialsData', tutorialsData);
  console.log(user);

  useEffect(() => {
    if (!user) return;

    const filtered = tutorials.filter((data) => data.yourEmail === user.email);
    setTutorialsData(filtered);
    setLoading(false);
  }, [user, tutorials]);




  // handle popup
  const handlePopup = (id) => {
    document.getElementById('my_modal_2').showModal();
    const selected = initialTutorialsData.find((data) => data._id === id);
    setSelectedTutorial(selected);
  };

  // handle tutorial delete
  const handleTutorialDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:4000/my-tutorials/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(res => res.json())
          .then(data => {
            if (data.deletedCount > 0) {
              const remaining = tutorialsData.filter(tipsData => tipsData._id !== id);
              setTutorialsData(remaining);
              Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
              });
            }
          });
      }
    });
  };

  // handle tutorial update
  const handleTutorialUpdate = (e) => {
    e.preventDefault();
    if (!selectedTutorial) return;
    const form = e.target;
    const formData = new FormData(form);
    const updatedTutorialData = Object.fromEntries(formData.entries());

    fetch(`http://localhost:4000/my-tutorials/${selectedTutorial._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedTutorialData)
    }).then(res => res.json()).then(data => {
      if (data.modifiedCount > 0) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your tutorial has been updated successfully",
          showConfirmButton: false,
          timer: 1500
        });
        document.getElementById('my_modal_2').close();
        const updatedTutorials = tutorialsData.map(tut =>
          tut._id === selectedTutorial._id ? { ...tut, ...updatedTutorialData } : tut
        );
        setTutorialsData(updatedTutorials);
        setSelectedTutorial(null);
      } else {
        Swal.fire({
          title: "Something went wrong",
          text: data.message || "Please try again later.",
          icon: "error"
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Header Section */}
        <div className="p-6 sm:p-8 border-b border-gray-200">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">My Tutorials</h1>
          <p className="text-gray-600 text-lg">Manage your language tutorials and track their performance</p>
        </div>

        {/* Tutorials Table Section */}
        <div className="p-4 sm:p-6 lg:p-8 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
                  Image
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Language
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reviews
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {
                tutorialsData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-500 text-lg">
                      No tutorials found for your account.
                    </td>
                  </tr>
                ) : (tutorialsData.map((tutorial) => (
                  <tr key={tutorial._id} className="hover:bg-gray-50">
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-16">
                          <img
                            className="h-full w-full rounded-md object-cover"
                            src={tutorial.tutorialImageUrl}
                            alt={`${tutorial.language} tutorial`}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://placehold.co/80x80/cccccc/333333?text=Error";
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {tutorial.language}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {tutorial.pricePerHour}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-700 max-w-xs truncate">
                      {tutorial.description}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-400">★</span>
                        <span>{tutorial.reviews}</span>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handlePopup(tutorial._id)}
                          className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                          title="Edit Tutorial"
                        >
                          {/* Edit Icon */}
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button
                          onClick={() => handleTutorialDelete(tutorial._id)}
                          className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                          title="Delete Tutorial"
                        >
                          {/* Trash Icon */}
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )))
              }

            </tbody>
          </table>
        </div>
      </div>
      {/* Modal for editing tutorial */}
      <dialog id="my_modal_2" className="modal bg-white ">
        {selectedTutorial && (
          <form onSubmit={handleTutorialUpdate} className="space-y-6 p-4 bg-white shadow-md rounded-lg z-10">
            {/* Name and Email fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="yourName" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="yourName"
                  name="yourName"
                  defaultValue={selectedTutorial.yourName}
                  placeholder="naim"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                  required
                />
              </div>
              <div>
                <label htmlFor="yourEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Email
                </label>
                <input
                  type="email"
                  id="yourEmail"
                  name="yourEmail"
                  defaultValue={selectedTutorial.yourEmail}
                  placeholder="naim@gmail.com"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                  required
                />
              </div>
            </div>

            {/* Tutorial Image URL */}
            <div>
              <label htmlFor="tutorialImageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Tutorial Image URL
              </label>
              <input
                type="url"
                id="tutorialImageUrl"
                name="tutorialImageUrl"
                defaultValue={selectedTutorial.tutorialImageUrl}
                placeholder="Enter image URL for your tutorial"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
              />
            </div>

            {/* Language */}
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <input
                type="text"
                id="language"
                name="language"
                defaultValue={selectedTutorial.language}
                placeholder="e.g., English, Spanish, French"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                required
              />
            </div>

            {/* Price per Hour */}
            <div>
              <label htmlFor="pricePerHour" className="block text-sm font-medium text-gray-700 mb-1">
                Price per Hour ($)
              </label>
              <input
                type="number"
                id="pricePerHour"
                name="pricePerHour"
                defaultValue={selectedTutorial.pricePerHour}
                placeholder="25.00"
                step="0.01"
                min="0"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                defaultValue={selectedTutorial.description}
                rows="4"
                placeholder="Describe your teaching experience, methodology, and what students can expect from your lessons..."
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out resize-y"
                required
              ></textarea>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
              >
                Update Tutorial
              </button>
            </div>
          </form>
        )}
      </dialog>
    </div>
  );
};

export default MyTutorials;