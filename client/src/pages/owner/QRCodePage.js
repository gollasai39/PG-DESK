import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Share2, QrCode } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import QRCodeDisplay from '../../components/owner/QRCodeDisplay';
import toast from 'react-hot-toast';

const QRCodePage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProperty = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/pg/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        // Verify ownership
        if (data.data.owner._id === user.id || data.data.owner === user.id) {
          setProperty(data.data);
        } else {
          toast.error('You are not authorized to view this property');
        }
      } else {
        toast.error(data.message || 'Property not found');
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      toast.error('Failed to fetch property');
    } finally {
      setLoading(false);
    }
  }, [id, user.id]);

  useEffect(() => {
    fetchProperty();
  }, [id, fetchProperty]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-4">The property you're looking for doesn't exist or you don't have access to it.</p>
          <button
            onClick={() => window.history.back()}
            className="btn-primary"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container py-4">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>

      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Property Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center space-x-4">
              <img
                src={property.images?.[0]?.url || 'https://via.placeholder.com/100x100'}
                alt={property.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{property.name}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{property.location?.address}</span>
                  <span>•</span>
                  <span>{property.location?.city}</span>
                  <span>•</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    property.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {property.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* QR Code Section */}
            <div className="lg:col-span-2">
              <QRCodeDisplay 
                pgId={property._id}
                pgName={property.name}
              />
            </div>

            {/* Property Info Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Property Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Rooms:</span>
                    <span className="font-medium">
                      {property.rooms?.reduce((sum, room) => sum + room.totalRooms, 0) || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Occupied:</span>
                    <span className="font-medium text-green-600">
                      {property.rooms?.reduce((sum, room) => sum + (room.totalRooms - room.availableRooms), 0) || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available:</span>
                    <span className="font-medium text-blue-600">
                      {property.rooms?.reduce((sum, room) => sum + room.availableRooms, 0) || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Occupancy Rate:</span>
                    <span className="font-medium">
                      {property.rooms ? Math.round(
                        (property.rooms.reduce((sum, room) => sum + (room.totalRooms - room.availableRooms), 0) /
                        property.rooms.reduce((sum, room) => sum + room.totalRooms, 0)) * 100
                      ) : 0}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => window.open(`/pg/${property._id}`, '_blank')}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>View PG Page</span>
                  </button>
                  <button
                    onClick={() => window.open(`/owner/property/${property._id}/edit`, '_blank')}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span>Edit Property</span>
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/pg/${property._id}`);
                      toast.success('PG link copied to clipboard');
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span>Copy Link</span>
                  </button>
                </div>
              </div>

              {/* Sharing Tips */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Sharing Tips</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Print QR code and display at reception</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Share on social media for more visibility</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Add to marketing materials and brochures</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Include in email signatures</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodePage;
