const QRCode = require('qrcode');
const crypto = require('crypto');

/**
 * Generate QR code for PG property
 * @param {string} pgId - PG ID
 * @param {string} pgName - PG name
 * @param {string} baseUrl - Base URL for the application
 * @returns {Promise<Object>} QR code data
 */
const generatePGQRCode = async (pgId, pgName, baseUrl) => {
  try {
    // Create unique QR data with timestamp and signature
    const timestamp = Date.now();
    const data = {
      pgId,
      pgName,
      timestamp,
      type: 'pg_property'
    };
    
    // Create signature for verification
    const signature = crypto
      .createHmac('sha256', process.env.JWT_SECRET || 'fallback_secret')
      .update(JSON.stringify(data))
      .digest('hex');
    
    // Add signature to data
    data.signature = signature;
    
    // Create URL for QR code
    const qrData = `${baseUrl}/pg/${pgId}?qr=${encodeURIComponent(JSON.stringify(data))}`;
    
    // Generate QR code
    const qrCodeOptions = {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H'
    };
    
    const qrCodeDataUrl = await QRCode.toDataURL(qrData, qrCodeOptions);
    
    // Also generate QR code as buffer for storage
    const qrCodeBuffer = await QRCode.toBuffer(qrData, qrCodeOptions);
    
    return {
      success: true,
      qrCodeDataUrl,
      qrCodeBuffer,
      qrData,
      signature,
      timestamp
    };
    
  } catch (error) {
    console.error('QR Code generation error:', error);
    return {
      success: false,
      error: 'Failed to generate QR code'
    };
  }
};

/**
 * Verify QR code data
 * @param {string} qrDataString - QR data string
 * @returns {Object} Verification result
 */
const verifyQRCode = (qrDataString) => {
  try {
    const data = JSON.parse(decodeURIComponent(qrDataString));
    
    // Check if data has required fields
    if (!data.pgId || !data.timestamp || !data.signature) {
      return {
        valid: false,
        error: 'Invalid QR code format'
      };
    }
    
    // Verify signature
    const expectedData = { ...data };
    const signature = expectedData.signature;
    delete expectedData.signature;
    
    const expectedSignature = crypto
      .createHmac('sha256', process.env.JWT_SECRET || 'fallback_secret')
      .update(JSON.stringify(expectedData))
      .digest('hex');
    
    if (signature !== expectedSignature) {
      return {
        valid: false,
        error: 'Invalid QR code signature'
      };
    }
    
    // Check if QR code is not expired (24 hours)
    const currentTime = Date.now();
    const qrTime = data.timestamp;
    const timeDiff = currentTime - qrTime;
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    if (timeDiff > maxAge) {
      return {
        valid: false,
        error: 'QR code has expired'
      };
    }
    
    return {
      valid: true,
      data
    };
    
  } catch (error) {
    console.error('QR Code verification error:', error);
    return {
      valid: false,
      error: 'Failed to verify QR code'
    };
  }
};

/**
 * Generate QR code for PG owner's contact/business card
 * @param {Object} ownerData - Owner information
 * @param {string} baseUrl - Base URL for the application
 * @returns {Promise<Object>} QR code data
 */
const generateOwnerQRCode = async (ownerData, baseUrl) => {
  try {
    const data = {
      ownerId: ownerData._id,
      name: ownerData.name,
      email: ownerData.email,
      phone: ownerData.phone,
      type: 'owner_contact',
      timestamp: Date.now()
    };
    
    // Create signature
    const signature = crypto
      .createHmac('sha256', process.env.JWT_SECRET || 'fallback_secret')
      .update(JSON.stringify(data))
      .digest('hex');
    
    data.signature = signature;
    
    // Create URL for QR code
    const qrData = `${baseUrl}/owner/contact?qr=${encodeURIComponent(JSON.stringify(data))}`;
    
    const qrCodeOptions = {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    };
    
    const qrCodeDataUrl = await QRCode.toDataURL(qrData, qrCodeOptions);
    
    return {
      success: true,
      qrCodeDataUrl,
      qrData: data
    };
    
  } catch (error) {
    console.error('Owner QR Code generation error:', error);
    return {
      success: false,
      error: 'Failed to generate owner QR code'
    };
  }
};

module.exports = {
  generatePGQRCode,
  generateOwnerQRCode,
  verifyQRCode
};
