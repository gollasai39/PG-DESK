import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, MapPin, Star, Wifi, Car, Shield, Home, Building } from 'lucide-react';

const SearchPG = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pgs, setPGs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    amenities: [],
    gender: '',
    roomType: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const query = searchParams.get('q') || '';
  const city = searchParams.get('city') || '';

  useEffect(() => {
    // Simulate API call
    const mockPGs = [
      {
        id: 1,
        name: "Luxury PG - Koramangala",
        location: "Koramangala, Bangalore",
        price: 8000,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        amenities: ["WiFi", "Food", "Laundry", "Security", "Parking"],
        gender: "both",
        roomType: "single",
        distance: "2.5 km"
      },
      {
        id: 2,
        name: "Comfort Stay - HSR Layout",
        location: "HSR Layout, Bangalore",
        price: 6500,
        rating: 4.3,
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        amenities: ["WiFi", "Food", "Parking"],
        gender: "male",
        roomType: "double",
        distance: "4.2 km"
      },
      {
        id: 3,
        name: "Premium PG - Indiranagar",
        location: "Indiranagar, Bangalore",
        price: 10000,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1611892440177-821a974b8513?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        amenities: ["WiFi", "Food", "Gym", "Pool", "Security", "Laundry"],
        gender: "female",
        roomType: "single",
        distance: "6.1 km"
      },
      {
        id: 4,
        name: "Budget PG - Marathahalli",
        location: "Marathahalli, Bangalore",
        price: 4500,
        rating: 3.8,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        amenities: ["WiFi", "Food"],
        gender: "both",
        roomType: "triple",
        distance: "8.3 km"
      }
    ];

    setTimeout(() => {
      setPGs(mockPGs);
      setLoading(false);
    }, 1000);
  }, [query, city]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleAmenity = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const amenityOptions = [
    { icon: Wifi, label: "WiFi", value: "wifi" },
    { icon: Home, label: "Food", value: "food" },
    { icon: Car, label: "Parking", value: "parking" },
    { icon: Shield, label: "Security", value: "security" },
    { icon: Building, label: "Gym", value: "gym" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {city ? `PGs in ${city}` : 'Search PG Accommodations'}
          </h1>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by location, city, or PG name..."
                className="input-field pl-10"
                value={query}
                onChange={(e) => setSearchParams({ q: e.target.value })}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-outline flex items-center space-x-2"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block lg:w-80`}>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Filters</h3>
              
              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Price Range</h4>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="input-field"
                    value={filters.priceMin}
                    onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="input-field"
                    value={filters.priceMax}
                    onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                  />
                </div>
              </div>

              {/* Gender */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Gender</h4>
                <div className="space-y-2">
                  {['both', 'male', 'female'].map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value={option}
                        checked={filters.gender === option}
                        onChange={(e) => handleFilterChange('gender', e.target.value)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Room Type */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Room Type</h4>
                <div className="space-y-2">
                  {['single', 'double', 'triple'].map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="radio"
                        name="roomType"
                        value={option}
                        checked={filters.roomType === option}
                        onChange={(e) => handleFilterChange('roomType', e.target.value)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{option} Sharing</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Amenities</h4>
                <div className="space-y-2">
                  {amenityOptions.map((amenity) => {
                    const Icon = amenity.icon;
                    return (
                      <label key={amenity.value} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.amenities.includes(amenity.value)}
                          onChange={() => toggleAmenity(amenity.value)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <Icon className="h-4 w-4 text-gray-400 ml-2 mr-2" />
                        <span className="text-sm text-gray-700">{amenity.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <button className="w-full btn-primary">Apply Filters</button>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600">
                Found <span className="font-semibold">{pgs.length}</span> PGs
              </p>
              <select className="input-field w-auto">
                <option>Sort by: Recommended</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating: High to Low</option>
                <option>Distance: Near to Far</option>
              </select>
            </div>

            <div className="space-y-6">
              {pgs.map((pg) => (
                <div key={pg.id} className="card overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <img
                        src={pg.image}
                        alt={pg.name}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:w-2/3 p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{pg.name}</h3>
                          <div className="flex items-center text-gray-600 mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="text-sm">{pg.location}</span>
                            <span className="mx-2">•</span>
                            <span className="text-sm">{pg.distance} away</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="font-semibold">{pg.rating}</span>
                          </div>
                          <span className="text-sm text-gray-600">Rating</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {pg.amenities.slice(0, 4).map((amenity, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                          >
                            {amenity}
                          </span>
                        ))}
                        {pg.amenities.length > 4 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            +{pg.amenities.length - 4} more
                          </span>
                        )}
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-2xl font-bold text-primary-600">₹{pg.price}</span>
                          <span className="text-gray-600 text-sm">/month</span>
                        </div>
                        <div className="flex space-x-2">
                          <Link
                            to={`/pg/${pg.id}`}
                            className="btn-outline"
                          >
                            View Details
                          </Link>
                          <Link
                            to={`/booking/${pg.id}`}
                            className="btn-primary"
                          >
                            Book Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPG;
