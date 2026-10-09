import React, { useState } from 'react'
import { IoSearchOutline } from 'react-icons/io5';
import TutorCard from '../components/TutorCard';
import { useLoaderData, useSearchParams } from 'react-router';


const FindTutors = () => {
  const rawTutors = useLoaderData();
  const tutors = rawTutors.map(tutor => ({
    ...tutor,
    rate: parseFloat(tutor.pricePerHour),
    reviews: Math.floor(Math.random() * 100),
    rating: (Math.random() * 2 + 3).toFixed(1)
  }));
  const [searchParams] = useSearchParams();
  const languageParams = searchParams.get('language');
  console.log(languageParams);
  // State to manage the form inputs
  const [language, setLanguage] = useState(languageParams || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minReviews, setMinReviews] = useState('any');
  const [sortBy, setSortBy] = useState('popular');



  // Function to reset all filters to their default state
  const handleClearFilters = () => {
    setLanguage('');
    setMinPrice('');
    setMaxPrice('');
    setMinReviews('any');
  };
  const filteredTutorials = tutors.filter((tutor) => {
    return (
      (language ? tutor.language.toLowerCase().includes(language.toLowerCase()) : true) &&
      (minPrice ? tutor.pricePerHour >= parseFloat(minPrice) : true) &&
      (maxPrice ? tutor.pricePerHour <= parseFloat(maxPrice) : true) &&
      (minReviews === 'any' || tutor.reviews >= parseInt(minReviews))
    );
  })
  // Sorting logic based on the selected sort option
  const sortedTutors = filteredTutorials.sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.reviews - a.reviews;
      case 'rate_asc':
        return a.rate - b.rate;
      case 'rate_desc':
        return b.rate - a.rate;
      case 'rating':
        return b.reviews - a.reviews;
      default:
        return 0;
    }
  });
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 '>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Search and Filters Sidebar */}
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6 bg-white shadow-md p-4 rounded-lg">

            {/* Language Search Input */}
            <div>
              <label htmlFor="language" className="text-sm font-semibold text-gray-600">
                Language
              </label>
              <div className="relative mt-2">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <IoSearchOutline />
                </span>
                <input
                  type="text"
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Search by language..."
                />
              </div>
            </div>

            {/* Price Range Inputs */}
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Price Range
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Min"
                />
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Max"
                />
              </div>
            </div>

            {/* Minimum Reviews Select */}
            <div>
              <label htmlFor="reviews" className="text-sm font-semibold text-gray-600">
                Minimum Reviews
              </label>
              <select
                id="reviews"
                value={minReviews}
                onChange={(e) => setMinReviews(e.target.value)}
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
              >
                <option value="any">Any rating</option>
                <option value="1">1 star & up</option>
                <option value="2">2 stars & up</option>
                <option value="3">3 stars & up</option>
                <option value="4">4 stars & up</option>
                <option value="5">5 stars only</option>
              </select>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 pt-6">
              {/* Clear Filters Button */}
              <button
                type="button"
                onClick={handleClearFilters}
                className="w-full py-2 px-4 text-center text-gray-700 font-semibold bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
              >
                Clear Filters
              </button>
            </div>
          </form>

          <div className="bg-gray-100 min-h-screen font-sans">
            <div className="container mx-auto px-4 py-8">
              {/* Header Section */}
              <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Find Tutors</h1>
                  <p className="text-gray-600 mt-1">{filteredTutorials.length} tutors found</p>
                </div>
                <div className="flex items-center mt-4 md:mt-0">
                  <label htmlFor="sort" className="text-sm font-semibold text-gray-600 mr-2">Sort by:</label>
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="rate_asc">Price: Low to High</option>
                    <option value="rate_desc">Price: High to Low</option>
                    <option value="rating">Highest Rating</option>
                  </select>
                </div>
              </div>

              {/* Grid of Tutor Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedTutors.map(tutor => (
                  <TutorCard key={tutor.id} tutor={tutor} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FindTutors
