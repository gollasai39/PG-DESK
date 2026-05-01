import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, Search, Home, User, Settings, LogOut, CreditCard, Clock
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const mockBookings = [
      {
        id: 1,
        pgName: "Luxury PG - Koramangala",
        pgLocation: "Koramangala, Bangalore",
        pgImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        roomType: "Single Sharing",
        price: 8000,
        status: "active",
        checkIn: "2024-01-15",
        checkOut: "2024-06-15",
        paymentStatus: "paid",
        nextPaymentDate: "2024-02-05"
      },
      {
        id: 2,
        pgName: "Comfort Stay - HSR Layout",
        pgLocation: "HSR Layout, Bangalore",
        pgImage: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        roomType: "Double Sharing",
        price: 6000,
        status: "pending",
        checkIn: "2024-02-01",
        checkOut: "2024-07-01",
        paymentStatus: "pending",
        nextPaymentDate: "2024-02-01"
      }
    ];

    setTimeout(() => {
      setBookings(mockBookings);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-white/30">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{user?.name}</h3>
                  <p className="text-primary-100 text-sm">{user?.email}</p>
                </div>
              </div>
              <nav className="space-y-2 p-6">
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'bookings'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Home className="h-5 w-5" />
                  <span>My Bookings</span>
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab('payments')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'payments'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <CreditCard className="h-5 w-5" />
                  <span>Payments</span>
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </button>
              </nav>

              <div className="mt-6 pt-6 border-t">
                <button className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h2>
                    <p className="text-gray-600">Manage your PG accommodations and bookings</p>
                  </div>
                  <Link
                    to="/search"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mt-4 sm:mt-0"
                  >
                    <Search className="h-5 w-5" />
                    <span>Find New PG</span>
                  </Link>
                </div>

                {bookings.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Home className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">No bookings yet</h3>
                    <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                      Start searching for your perfect PG accommodation from thousands of verified properties
                    </p>
                    <Link 
                      to="/search" 
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <Search className="h-5 w-5" />
                      <span>Search PGs</span>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
                        <div className="md:flex">
                          <div className="md:w-1/3 relative overflow-hidden">
                            <img
                              src={booking.pgImage}
                              alt={booking.pgName}
                              className="w-full h-48 md:h-full object-cover"
                            />
                          </div>
                          <div className="md:w-3/4 p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                  {booking.pgName}
                                </h3>
                                <div className="flex items-center text-gray-600 text-sm">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {booking.pgLocation}
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                                  {booking.paymentStatus === 'paid' ? 'Paid' : 'Payment Due'}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-gray-600">Room Type</p>
                                <p className="font-medium">{booking.roomType}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Price</p>
                                <p className="font-medium">₹{booking.price}/month</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Check-in</p>
                                <p className="font-medium">{booking.checkIn}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Check-out</p>
                                <p className="font-medium">{booking.checkOut}</p>
                              </div>
                            </div>

                            {booking.status === 'active' && (
                              <div className="bg-blue-50 rounded-lg p-3 mb-4">
                                <div className="flex items-center text-blue-800">
                                  <Clock className="h-4 w-4 mr-2" />
                                  <span className="text-sm">
                                    Next payment due on {booking.nextPaymentDate}
                                  </span>
                                </div>
                              </div>
                            )}

                            <div className="flex space-x-3">
                              <Link
                                to={`/pg/${booking.id}`}
                                className="btn-outline text-sm"
                              >
                                View Details
                              </Link>
                              {booking.status === 'active' && (
                                <button className="btn-primary text-sm">
                                  Make Payment
                                </button>
                              )}
                              {booking.status === 'pending' && (
                                <button className="btn-outline text-sm text-red-600 hover:bg-red-50">
                                  Cancel Booking
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          className="input-field"
                          defaultValue={user?.name}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          className="input-field"
                          defaultValue={user?.email}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          className="input-field"
                          defaultValue="+91 98765 43210"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          className="input-field"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <textarea
                        className="input-field"
                        rows={3}
                        placeholder="Enter your address"
                      />
                    </div>

                    <div className="flex space-x-3">
                      <button type="submit" className="btn-primary">
                        Save Changes
                      </button>
                      <button type="button" className="btn-outline">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment History</h2>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            PG Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Method
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            Jan 5, 2024
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            Luxury PG - Koramangala
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ₹8,000
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Paid
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            Credit Card
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            Dec 5, 2023
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            Luxury PG - Koramangala
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ₹8,000
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Paid
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            UPI
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Notifications</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700">Email notifications</span>
                        <input type="checkbox" defaultChecked className="h-4 w-4 text-primary-600" />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700">SMS notifications</span>
                        <input type="checkbox" className="h-4 w-4 text-primary-600" />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700">Payment reminders</span>
                        <input type="checkbox" defaultChecked className="h-4 w-4 text-primary-600" />
                      </label>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Privacy</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700">Profile visibility</span>
                        <select className="input-field w-auto">
                          <option>Public</option>
                          <option>Private</option>
                        </select>
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700">Show contact info to PG owners</span>
                        <input type="checkbox" defaultChecked className="h-4 w-4 text-primary-600" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
