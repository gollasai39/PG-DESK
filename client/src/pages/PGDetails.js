import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Star, Wifi, Car, Shield, Home, Building, Users, 
  Phone, Mail, Bed, Bath, Maximize2, ChevronLeft,
  Heart, Share2, Camera
} from 'lucide-react';

const PGDetails = () => {
  const { id } = useParams();
  const [pg, setPG] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    // Simulate API call
    const mockPG = {
      id: parseInt(id),
      name: "Luxury PG - Koramangala",
      location: "Koramangala, Bangalore",
      price: 8000,
      rating: 4.5,
      reviews: 128,
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1611892440177-821a974b8513?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
      ],
      description: "Experience luxury living at its finest in our premium PG accommodation in Koramangala. This modern facility offers spacious rooms with all amenities, high-speed WiFi, delicious meals, and 24/7 security. Perfect for students and working professionals looking for comfort and convenience.",
      amenities: [
        { icon: Wifi, label: "High-Speed WiFi", included: true },
        { icon: Home, label: "Homely Food", included: true },
        { icon: Car, label: "Parking Facility", included: true },
        { icon: Shield, label: "24/7 Security", included: true },
        { icon: Building, label: "Gym Access", included: true },
        { icon: Users, label: "Common Room", included: true },
        { icon: Bath, label: "Hot Water", included: true },
        { icon: Bed, label: "Fully Furnished", included: true }
      ],
      rooms: [
        {
          type: "Single Sharing",
          price: 8000,
          available: 3,
          size: "120 sq.ft",
          features: ["Attached Bathroom", "Balcony", "AC"]
        },
        {
          type: "Double Sharing",
          price: 6000,
          available: 5,
          size: "180 sq.ft",
          features: ["Attached Bathroom", "AC"]
        },
        {
          type: "Triple Sharing",
          price: 4500,
          available: 2,
          size: "240 sq.ft",
          features: ["Common Bathroom"]
        }
      ],
      rules: [
        "No smoking inside the premises",
        "Visitors allowed until 9 PM",
        "Monthly rent should be paid by 5th of every month",
        "One month advance payment required",
        "Strict adherence to COVID-19 guidelines"
      ],
      owner: {
        name: "Rajesh Kumar",
        phone: "+91 98765 43210",
        email: "rajesh@luxurypg.com",
        experience: "5+ years"
      },
      nearbyPlaces: [
          "Koramangala Metro Station - 0.5 km",
          "Forum Mall - 1.2 km",
          "Manipal Hospital - 2.1 km",
          "Christ University - 3.5 km"
        ]
    };

    setTimeout(() => {
      setPG(mockPG);
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!pg) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">PG not found</h2>
          <Link to="/search" className="btn-primary">
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container py-4">
          <Link
            to="/search"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Back to Search</span>
          </Link>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8">
              <div className="relative">
                <img
                  src={pg.images[activeImage]}
                  alt={pg.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
                  </button>
                  <button className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                    <Share2 className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4 bg-white px-3 py-1 rounded-full flex items-center space-x-2">
                  <Camera className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-700">{pg.images.length} Photos</span>
                </div>
              </div>
              <div className="flex space-x-2 mt-4 overflow-x-auto">
                {pg.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      activeImage === index ? 'border-primary-600' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${pg.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* PG Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{pg.name}</h1>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{pg.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="text-xl font-semibold">{pg.rating}</span>
                  </div>
                  <span className="text-sm text-gray-600">({pg.reviews} reviews)</span>
                </div>
              </div>

              <p className="text-gray-700 mb-6">{pg.description}</p>

              <h3 className="text-xl font-semibold mb-4">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {pg.amenities.map((amenity, index) => {
                  const Icon = amenity.icon;
                  return (
                    <div key={index} className="flex items-center space-x-2">
                      <Icon className={`h-5 w-5 ${amenity.included ? 'text-primary-600' : 'text-gray-400'}`} />
                      <span className={amenity.included ? 'text-gray-900' : 'text-gray-400 line-through'}>
                        {amenity.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Room Options */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">Room Options</h3>
              <div className="space-y-4">
                {pg.rooms.map((room, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{room.type}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center">
                            <Maximize2 className="h-4 w-4 mr-1" />
                            {room.size}
                          </span>
                          <span>{room.available} rooms available</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-primary-600">₹{room.price}</span>
                        <span className="text-gray-600 text-sm">/month</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {room.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rules */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">House Rules</h3>
              <ul className="space-y-2">
                {pg.rules.map((rule, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    <span className="text-gray-700">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Booking Card */}
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="mb-4">
                <div className="text-3xl font-bold text-primary-600">₹{pg.price}</div>
                <div className="text-gray-600">per month</div>
              </div>

              <div className="space-y-3 mb-6">
                <Link
                  to={`/booking/${pg.id}`}
                  className="w-full btn-primary text-center block"
                >
                  Book Now
                </Link>
                <button className="w-full btn-outline">
                  Schedule Visit
                </button>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Contact Owner</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span className="text-sm">{pg.owner.name}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    <a href={`tel:${pg.owner.phone}`} className="text-sm text-primary-600 hover:underline">
                      {pg.owner.phone}
                    </a>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    <a href={`mailto:${pg.owner.email}`} className="text-sm text-primary-600 hover:underline">
                      {pg.owner.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="text-lg font-semibold mb-3">Location</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">{pg.location.address}</p>
                <div className="border-t pt-3">
                  <h4 className="font-medium text-sm mb-2">Nearby Places</h4>
                  <ul className="space-y-1">
                    {pg.location.nearby.map((place, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        • {place}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PGDetails;
