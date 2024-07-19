import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';

const Setup2FA = ({ userId }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const response = await fetch(`/generate-qr/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch QR code');
        }
        const data = await response.json();
        setQrCodeUrl(data.qrCodeUrl);
      } catch (error) {
        console.error('Failed to generate QR code', error);
      }
    };

    fetchQRCode();
  }, [userId]);

  return (
    <div>
      <h3>Scan this QR Code with your authenticator app:</h3>
      {qrCodeUrl && <QRCode value={qrCodeUrl} />}
    </div>
  );
};

export default Setup2FA;
