import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Users, Wifi, Car, Shield, HomeIcon, Building, Star, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredPGs, setFeaturedPGs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedPGs();
  }, []);

  const fetchFeaturedPGs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/pg');
      const data = await response.json();
      
      if (data.success) {
        setFeaturedPGs(data.data.slice(0, 6)); // Show max 6 featured PGs
      } else {
        toast.error('Failed to load PGs');
      }
    } catch (error) {
      console.error('Error fetching PGs:', error);
      toast.error('Failed to load PGs');
    } finally {
      setLoading(false);
    }
  };

  const cities = ["Bangalore", "Hyderabad", "Chennai", "Mumbai", "Pune", "Delhi"];

  const amenities = [
    { icon: Wifi, label: "High-Speed WiFi" },
    { icon: Users, label: "Community Living" },
    { icon: Car, label: "Parking Facility" },
    { icon: Shield, label: "24/7 Security" },
    { icon: HomeIcon, label: "Fully Furnished" },
    { icon: Building, label: "Modern Infrastructure" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight">
                Find Your Perfect
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-400">
                  PG Accommodation
                </span>
              </h1>
              <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                Discover comfortable, affordable, and secure PG accommodations in top cities. 
                Your ideal home away from home is just a click away.
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search by location, city, or PG name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white/90 backdrop-blur text-gray-900 placeholder-gray-600 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <button className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    <div className="flex items-center justify-center space-x-2">
                      <Search className="h-5 w-5" />
                      <span>Search</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Popular Cities */}
            <div className="mt-8">
              <p className="text-sm text-primary-200 mb-3">Popular Cities:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {cities.map((city) => (
                  <Link
                    key={city}
                    to={`/search?city=${encodeURIComponent(city)}`}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-colors"
                  >
                    {city}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-700">
                PG Desk
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide the best amenities and facilities to ensure your comfort and safety
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {amenities.map((amenity, index) => {
              const Icon = amenity.icon;
              return (
                <div key={index} className="group relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-600/5 to-primary-700/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="bg-gradient-to-br from-primary-600 to-primary-700 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{amenity.label}</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Premium facilities designed for your comfort and convenience
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured PGs Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end mb-16">
            <div className="mb-8 lg:mb-0">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Featured
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-700">
                  PG Properties
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl">
                Hand-picked accommodations with verified reviews and premium amenities
              </p>
            </div>
            <Link
              to="/search"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span>View All Properties</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredPGs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No PG Properties Available</h3>
              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                No PG properties have been registered yet. Be the first to list your property!
              </p>
              <Link
                to="/register?role=owner"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span>List Your PG</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPGs.map((pg) => (
                <div key={pg._id} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={pg.images?.[0]?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'}
                      alt={pg.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {pg.rating && (
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-900">{pg.rating}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary-700 transition-colors">{pg.name}</h3>
                        <div className="flex items-center text-gray-600 text-sm mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{pg.location?.city || 'Bangalore'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {pg.amenities?.slice(0, 3).map((amenity, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 text-xs font-medium rounded-full border border-primary-200"
                        >
                          {amenity}
                        </span>
                      ))}
                      {pg.amenities?.length > 3 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                          +{pg.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div>
                        <div className="flex items-baseline">
                          <span className="text-2xl font-bold text-gray-900">
                            {pg.rooms?.[0]?.price ? `₹${pg.rooms[0].price}` : 'Price on Request'}
                          </span>
                          <span className="text-gray-600 text-sm ml-1">/month</span>
                        </div>
                        {pg.rooms?.[0]?.type && (
                          <span className="text-xs text-gray-500 capitalize">{pg.rooms[0].type}</span>
                        )}
                      </div>
                      <Link
                        to={`/pg/${pg._id}`}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-medium rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-md hover:shadow-lg group-hover:scale-105 transform"
                      >
                        <span>View Details</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">
            Are you a PG Owner?
          </h2>
          <p className="text-xl mb-8 text-secondary-100">
            List your property on PG Desk and reach thousands of potential tenants
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register?role=owner" className="btn-primary bg-white text-secondary-600 hover:bg-gray-100">
              List Your Property
            </Link>
            <Link to="/about" className="btn-outline border-white text-white hover:bg-white hover:text-secondary-600">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
