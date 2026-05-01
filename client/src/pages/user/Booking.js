import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { 
  MapPin, Shield, Home, ArrowLeft, Check, Info, Clock
} from 'lucide-react';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pg, setPG] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingStep, setBookingStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const checkInDate = watch('checkInDate');
  const checkOutDate = watch('checkOutDate');

  useEffect(() => {
    // Simulate API call to get PG details
    const mockPG = {
      id: parseInt(id),
      name: "Luxury PG - Koramangala",
      location: "Koramangala, Bangalore",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      rooms: [
        {
          id: 1,
          type: "Single Sharing",
          price: 8000,
          available: 3,
          size: "120 sq.ft",
          features: ["Attached Bathroom", "Balcony", "AC"]
        },
        {
          id: 2,
          type: "Double Sharing",
          price: 6000,
          available: 5,
          size: "180 sq.ft",
          features: ["Attached Bathroom", "AC"]
        },
        {
          id: 3,
          type: "Triple Sharing",
          price: 4500,
          available: 2,
          size: "240 sq.ft",
          features: ["Common Bathroom"]
        }
      ],
      rules: [
        "One month advance payment required",
        "Security deposit of one month rent",
        "Notice period of 30 days for checkout",
        "Valid ID proof required"
      ]
    };

    setTimeout(() => {
      setPG(mockPG);
      setLoading(false);
    }, 1000);
  }, [id]);

  const calculateTotalAmount = () => {
    if (!selectedRoom || !checkInDate || !checkOutDate) return 0;
    
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const months = Math.ceil((end - start) / (1000 * 60 * 60 * 24 * 30));
    
    return selectedRoom.price * months;
  };

  const onSubmitRoom = (data) => {
    const room = pg.rooms.find(r => r.id === parseInt(data.roomId));
    setSelectedRoom(room);
    setBookingStep(2);
  };

  const onSubmitBooking = async (data) => {
    setSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Booking confirmed! Please proceed with payment.');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

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
          <button
            onClick={() => navigate('/search')}
            className="btn-primary"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/pg/${id}`)}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to PG Details</span>
          </button>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start space-x-4">
              <img
                src={pg.image}
                alt={pg.name}
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{pg.name}</h1>
                <div className="flex items-center text-gray-600 mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{pg.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${bookingStep >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                bookingStep >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200'
              }`}>
                1
              </div>
              <span className="ml-2 font-medium">Select Room</span>
            </div>
            <div className={`w-16 h-1 ${bookingStep >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center ${bookingStep >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                bookingStep >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200'
              }`}>
                2
              </div>
              <span className="ml-2 font-medium">Booking Details</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {bookingStep === 1 ? (
              /* Step 1: Select Room */
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Select Room Type</h2>
                <form onSubmit={handleSubmit(onSubmitRoom)}>
                  <div className="space-y-4">
                    {pg.rooms.map((room) => (
                      <label key={room.id} className="block">
                        <input
                          {...register('roomId', { required: 'Please select a room' })}
                          type="radio"
                          value={room.id}
                          className="sr-only peer"
                        />
                        <div className="border rounded-lg p-4 cursor-pointer peer-checked:border-primary-600 peer-checked:bg-primary-50 hover:border-gray-300 transition-colors">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-900">{room.type}</h3>
                              <p className="text-sm text-gray-600 mt-1">{room.size}</p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {room.features.map((feature, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                                  >
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary-600">₹{room.price}</div>
                              <div className="text-sm text-gray-600">/month</div>
                              <div className="text-sm text-green-600 mt-1">
                                {room.available} rooms available
                              </div>
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.roomId && (
                    <p className="mt-2 text-sm text-red-600">{errors.roomId.message}</p>
                  )}
                  <button type="submit" className="w-full btn-primary mt-6">
                    Continue to Booking Details
                  </button>
                </form>
              </div>
            ) : (
              /* Step 2: Booking Details */
              <div>
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-6">Booking Information</h2>
                  <form onSubmit={handleSubmit(onSubmitBooking)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Check-in Date
                        </label>
                        <input
                          {...register('checkInDate', { required: 'Check-in date is required' })}
                          type="date"
                          className="input-field"
                          min={new Date().toISOString().split('T')[0]}
                        />
                        {errors.checkInDate && (
                          <p className="mt-1 text-sm text-red-600">{errors.checkInDate.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Check-out Date
                        </label>
                        <input
                          {...register('checkOutDate', { 
                            required: 'Check-out date is required',
                            validate: value => new Date(value) > new Date(checkInDate) || 'Check-out date must be after check-in date'
                          })}
                          type="date"
                          className="input-field"
                          min={checkInDate}
                        />
                        {errors.checkOutDate && (
                          <p className="mt-1 text-sm text-red-600">{errors.checkOutDate.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Requirements (Optional)
                      </label>
                      <textarea
                        {...register('requirements')}
                        className="input-field"
                        rows={3}
                        placeholder="Any special requirements or preferences..."
                      />
                    </div>

                    <div className="mt-6">
                      <label className="flex items-center">
                        <input
                          {...register('terms', { required: 'Please accept the terms and conditions' })}
                          type="checkbox"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          I agree to the terms and conditions and cancellation policy
                        </span>
                      </label>
                      {errors.terms && (
                        <p className="mt-1 text-sm text-red-600">{errors.terms.message}</p>
                      )}
                    </div>

                    <div className="flex space-x-3 mt-6">
                      <button
                        type="button"
                        onClick={() => setBookingStep(1)}
                        className="btn-outline"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary flex-1 disabled:opacity-50"
                      >
                        {submitting ? 'Processing...' : 'Confirm Booking'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Important Information */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                    <Info className="h-5 w-5 mr-2" />
                    Important Information
                  </h3>
                  <ul className="space-y-2 text-sm text-blue-800">
                    {pg.rules.map((rule, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
              
              {selectedRoom && (
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <h4 className="font-medium text-gray-900">{pg.name}</h4>
                    <p className="text-sm text-gray-600">{pg.location}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Room Type:</span>
                      <span className="font-medium">{selectedRoom.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monthly Rent:</span>
                      <span className="font-medium">₹{selectedRoom.price}</span>
                    </div>
                    {checkInDate && checkOutDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">
                          {Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24 * 30))} months
                        </span>
                      </div>
                    )}
                    {checkInDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Check-in:</span>
                        <span className="font-medium">{checkInDate}</span>
                      </div>
                    )}
                    {checkOutDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Check-out:</span>
                        <span className="font-medium">{checkOutDate}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold">Total Amount:</span>
                      <span className="text-2xl font-bold text-primary-600">
                        ₹{calculateTotalAmount()}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-2 text-green-600" />
                        <span>Secure payment gateway</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-blue-600" />
                        <span>Instant confirmation</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!selectedRoom && (
                <div className="text-center text-gray-500">
                  <Home className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Select a room type to see booking summary</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
