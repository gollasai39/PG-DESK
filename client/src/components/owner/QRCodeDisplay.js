import React, { useState, useEffect, useCallback } from 'react';
import { QrCode, Download, RefreshCw, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const QRCodeDisplay = ({ pgId, pgName }) => {
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const fetchQRCode = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/pg/${pgId}/qr`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setQrData(data.data);
      } else {
        toast.error(data.message || 'Failed to fetch QR code');
      }
    } catch (error) {
      console.error('Error fetching QR code:', error);
      toast.error('Failed to fetch QR code');
    } finally {
      setLoading(false);
    }
  }, [pgId]);

  useEffect(() => {
    if (pgId) {
      fetchQRCode();
    }
  }, [pgId, fetchQRCode]);

  const regenerateQRCode = async () => {
    try {
      setRegenerating(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/pg/${pgId}/qr/regenerate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setQrData(data.data);
        toast.success('QR code regenerated successfully');
      } else {
        toast.error(data.message || 'Failed to regenerate QR code');
      }
    } catch (error) {
      console.error('Error regenerating QR code:', error);
      toast.error('Failed to regenerate QR code');
    } finally {
      setRegenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (qrData && qrData.dataUrl) {
      const link = document.createElement('a');
      link.href = qrData.dataUrl;
      link.download = `${pgName.replace(/\s+/g, '_')}_QR_Code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('QR code downloaded successfully');
    }
  };

  const isExpired = qrData && new Date(qrData.expiresAt) < new Date();
  const timeUntilExpiry = qrData ? {
    hours: Math.max(0, Math.floor((new Date(qrData.expiresAt) - new Date()) / (1000 * 60 * 60))),
    minutes: Math.max(0, Math.floor(((new Date(qrData.expiresAt) - new Date()) % (1000 * 60 * 60)) / (1000 * 60)))
  } : null;

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">PG QR Code</h3>
        <button
          onClick={regenerateQRCode}
          disabled={regenerating}
          className="flex items-center space-x-2 px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${regenerating ? 'animate-spin' : ''}`} />
          <span>{regenerating ? 'Regenerating...' : 'Regenerate'}</span>
        </button>
      </div>

      {qrData ? (
        <div className="space-y-4">
          {/* QR Code Status */}
          <div className={`p-3 rounded-lg flex items-center space-x-2 ${
            isExpired ? 'bg-red-50' : 'bg-green-50'
          }`}>
            {isExpired ? (
              <>
                <Clock className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-red-800">QR Code Expired</p>
                  <p className="text-xs text-red-600">Please regenerate to continue sharing</p>
                </div>
              </>
            ) : (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">QR Code Active</p>
                  <p className="text-xs text-green-600">
                    Expires in {timeUntilExpiry?.hours}h {timeUntilExpiry?.minutes}m
                  </p>
                </div>
              </>
            )}
          </div>

          {/* QR Code Display */}
          <div className="flex justify-center">
            <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
              <img
                src={qrData.dataUrl}
                alt={`${pgName} QR Code`}
                className="w-64 h-64 object-contain"
              />
            </div>
          </div>

          {/* QR Code Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">QR Code Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">PG Name:</span>
                <span className="font-medium">{pgName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Generated:</span>
                <span className="font-medium">
                  {new Date(qrData.generatedAt).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Expires:</span>
                <span className={`font-medium ${isExpired ? 'text-red-600' : 'text-gray-900'}`}>
                  {new Date(qrData.expiresAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={downloadQRCode}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Download QR Code</span>
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success('PG link copied to clipboard');
              }}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Copy PG Link
            </button>
          </div>

          {/* Usage Instructions */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">How to Use This QR Code</h4>
            <ul className="space-y-1 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Print and display this QR code at your PG reception</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Users can scan to directly view your PG details</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Share digitally on social media and messaging apps</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>QR code expires every 24 hours for security</span>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No QR code available</p>
          <button
            onClick={fetchQRCode}
            className="mt-4 btn-primary"
          >
            Generate QR Code
          </button>
        </div>
      )}
    </div>
  );
};

export default QRCodeDisplay;
