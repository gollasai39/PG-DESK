import React, { useState, useEffect } from 'react';
import { 
  Building, Users, Calendar, DollarSign, Star, TrendingUp,
  Plus, Eye, Edit, Home, Settings, LogOut, BarChart3,
  QrCode
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import QRCodeDisplay from '../../components/owner/QRCodeDisplay';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API calls
    const mockProperties = [
      {
        id: 1,
        name: "Luxury PG - Koramangala",
        location: "Koramangala, Bangalore",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        totalRooms: 20,
        occupiedRooms: 17,
        monthlyRevenue: 136000,
        rating: 4.5,
        status: "active"
      },
      {
        id: 2,
        name: "Comfort Stay - HSR Layout",
        location: "HSR Layout, Bangalore",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        totalRooms: 15,
        occupiedRooms: 12,
        monthlyRevenue: 72000,
        rating: 4.3,
        status: "active"
      }
    ];

    const mockBookings = [
      {
        id: 1,
        tenantName: "Rahul Sharma",
        pgName: "Luxury PG - Koramangala",
        roomType: "Single Sharing",
        amount: 8000,
        checkIn: "2024-01-15",
        status: "active"
      },
      {
        id: 2,
        tenantName: "Priya Patel",
        pgName: "Comfort Stay - HSR Layout",
        roomType: "Double Sharing",
        amount: 6000,
        checkIn: "2024-01-20",
        status: "pending"
      }
    ];

    setTimeout(() => {
      setProperties(mockProperties);
      setBookings(mockBookings);
      setLoading(false);
    }, 1000);
  }, []);

  const stats = {
    totalProperties: properties.length,
    totalRooms: properties.reduce((acc, pg) => acc + pg.totalRooms, 0),
    occupiedRooms: properties.reduce((acc, pg) => acc + pg.occupiedRooms, 0),
    monthlyRevenue: properties.reduce((acc, pg) => acc + pg.monthlyRevenue, 0),
    occupancyRate: properties.length > 0 
      ? Math.round((properties.reduce((acc, pg) => acc + pg.occupiedRooms, 0) / 
          properties.reduce((acc, pg) => acc + pg.totalRooms, 0)) * 100)
      : 0
  };

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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Building className="h-10 w-10 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{user?.name}</h3>
                <p className="text-sm text-gray-600">PG Owner</p>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'overview'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <BarChart3 className="h-5 w-5" />
                  <span>Overview</span>
                </button>
                <button
                  onClick={() => setActiveTab('properties')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'properties'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Building className="h-5 w-5" />
                  <span>My Properties</span>
                </button>
                <button
                  onClick={() => setActiveTab('qr-codes')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'qr-codes'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <QrCode className="h-5 w-5" />
                  <span>QR Codes</span>
                </button>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'bookings'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Calendar className="h-5 w-5" />
                  <span>Bookings</span>
                </button>
                <button
                  onClick={() => setActiveTab('tenants')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'tenants'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Users className="h-5 w-5" />
                  <span>Tenants</span>
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
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Properties</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
                      </div>
                      <Building className="h-8 w-8 text-primary-600" />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Occupancy Rate</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.occupancyRate}%</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Monthly Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">₹{stats.monthlyRevenue.toLocaleString()}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-green-600" />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Rooms</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.occupiedRooms}/{stats.totalRooms}</p>
                      </div>
                      <Home className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                </div>

                {/* Recent Bookings */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Recent Bookings</h3>
                    <button
                      onClick={() => setActiveTab('bookings')}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-4">
                    {bookings.slice(0, 3).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{booking.tenantName}</p>
                          <p className="text-sm text-gray-600">{booking.pgName} - {booking.roomType}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">₹{booking.amount}</p>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            booking.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Properties Tab */}
            {activeTab === 'properties' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">My Properties</h2>
                  <button className="btn-primary flex items-center space-x-2">
                    <Plus className="h-5 w-5" />
                    <span>Add Property</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {properties.map((property) => (
                    <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="h-48">
                        <img
                          src={property.image}
                          alt={property.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{property.name}</h3>
                            <p className="text-sm text-gray-600">{property.location}</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm">{property.rating}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Occupancy</p>
                            <p className="font-medium">{property.occupiedRooms}/{property.totalRooms} rooms</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Monthly Revenue</p>
                            <p className="font-medium">₹{property.monthlyRevenue.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <button className="flex-1 btn-outline text-sm flex items-center justify-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                          </button>
                          <button className="flex-1 btn-outline text-sm flex items-center justify-center space-x-1">
                            <Edit className="h-4 w-4" />
                            <span>Edit</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">All Bookings</h2>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tenant
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Property
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Room Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Check-in
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {bookings.map((booking) => (
                          <tr key={booking.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{booking.tenantName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {booking.pgName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {booking.roomType}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              ₹{booking.amount}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {booking.checkIn}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                booking.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {booking.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-primary-600 hover:text-primary-900 mr-3">View</button>
                              <button className="text-red-600 hover:text-red-900">Cancel</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* QR Codes Tab */}
            {activeTab === 'qr-codes' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">QR Codes</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {properties.map((property) => (
                    <div key={property.id} className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <img
                          src={property.image}
                          alt={property.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">{property.name}</h3>
                          <p className="text-sm text-gray-600">{property.location}</p>
                        </div>
                      </div>
                      
                      <QRCodeDisplay 
                        pgId={property.id}
                        pgName={property.name}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tenants Tab */}
            {activeTab === 'tenants' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Tenant Management</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bookings.filter(b => b.status === 'active').map((booking) => (
                    <div key={booking.id} className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{booking.tenantName}</h3>
                          <p className="text-sm text-gray-600">{booking.pgName}</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Room:</span>
                          <span className="font-medium">{booking.roomType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rent:</span>
                          <span className="font-medium">₹{booking.amount}/month</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Since:</span>
                          <span className="font-medium">{booking.checkIn}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <button className="flex-1 btn-outline text-sm">Contact</button>
                        <button className="flex-1 btn-outline text-sm">View Details</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Profile Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                        <input type="text" className="input-field" defaultValue={user?.name} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input type="email" className="input-field" defaultValue={user?.email} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input type="tel" className="input-field" defaultValue="+91 98765 43210" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700">New booking notifications</span>
                        <input type="checkbox" defaultChecked className="h-4 w-4 text-primary-600" />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700">Payment reminders</span>
                        <input type="checkbox" defaultChecked className="h-4 w-4 text-primary-600" />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-gray-700">Monthly reports</span>
                        <input type="checkbox" className="h-4 w-4 text-primary-600" />
                      </label>
                    </div>
                  </div>

                  <button className="btn-primary">Save Changes</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
