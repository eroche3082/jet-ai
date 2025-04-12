/**
 * QR Code Generator Functions
 * 
 * This library handles creation of QR codes for different destinations,
 * itineraries, and content sharing.
 */

// Generate QR code as data URL using canvas
export function generateQRCode(content: string, size: number = 300): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Create canvas element
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Canvas context not supported');
      }

      // Clear canvas
      ctx.clearRect(0, 0, size, size);
      
      // Set background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, size, size);
      
      // Import QR code data
      import('qrcode')
        .then((QRCode) => {
          // Generate QR code on canvas
          QRCode.toCanvas(canvas, content, {
            width: size,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          }, (error) => {
            if (error) {
              console.error('QR Code generation error:', error);
              // Fall back to a simpler implementation
              fallbackQRGenerator(ctx, content, size);
              resolve(canvas.toDataURL('image/png'));
            } else {
              // Return data URL from canvas
              resolve(canvas.toDataURL('image/png'));
            }
          });
        })
        .catch((error) => {
          // QRCode library failed to load, use fallback
          console.error('Failed to load QRCode library:', error);
          fallbackQRGenerator(ctx, content, size);
          resolve(canvas.toDataURL('image/png'));
        });
      
    } catch (error) {
      console.error('QR code generation error:', error);
      reject(error);
    }
  });
}

// Simple fallback QR code generator when library fails
function fallbackQRGenerator(ctx: CanvasRenderingContext2D, content: string, size: number): void {
  // Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, size, size);
  
  // Add border
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 5;
  ctx.strokeRect(10, 10, size - 20, size - 20);
  
  // Add position detection patterns (corners)
  drawPositionSquare(ctx, 20, 20, 40);
  drawPositionSquare(ctx, size - 60, 20, 40);
  drawPositionSquare(ctx, 20, size - 60, 40);
  
  // Add text
  ctx.fillStyle = '#000000';
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('QR content (fallback):', size / 2, size / 2 - 15);
  
  // Format content for display (truncate if too long)
  let displayContent = content;
  if (content.length > 30) {
    displayContent = content.substring(0, 27) + '...';
  }
  
  ctx.fillText(displayContent, size / 2, size / 2 + 15);
}

// Helper to draw position detection patterns
function drawPositionSquare(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
  const innerSize = size * 0.7;
  const innerX = x + (size - innerSize) / 2;
  const innerY = y + (size - innerSize) / 2;
  
  // Outer square
  ctx.fillStyle = '#000000';
  ctx.fillRect(x, y, size, size);
  
  // Inner white square
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(innerX, innerY, innerSize, innerSize);
  
  // Inner black square
  ctx.fillStyle = '#000000';
  ctx.fillRect(innerX + innerSize * 0.25, innerY + innerSize * 0.25, innerSize * 0.5, innerSize * 0.5);
}

// Generate QR code for an itinerary
export function generateItineraryQR(itineraryId: string, isPublic: boolean = false): Promise<string> {
  const baseUrl = window.location.origin;
  const shareUrl = `${baseUrl}/itineraries/${itineraryId}${isPublic ? '?shared=true' : ''}`;
  return generateQRCode(shareUrl);
}

// Generate QR code for a destination
export function generateDestinationQR(destinationId: string, slug: string): Promise<string> {
  const baseUrl = window.location.origin;
  const shareUrl = `${baseUrl}/destinations/${destinationId}/${slug}`;
  return generateQRCode(shareUrl);
}

// Generate QR code for contact info
export function generateContactQR(name: string, email: string, phone?: string): Promise<string> {
  let vCardData = `BEGIN:VCARD
VERSION:3.0
FN:${name}
EMAIL:${email}`;
  
  if (phone) {
    vCardData += `\nTEL:${phone}`;
  }
  
  vCardData += '\nEND:VCARD';
  
  return generateQRCode(vCardData);
}

// Generate QR code for WiFi access
export function generateWifiQR(ssid: string, password: string, security: 'WPA' | 'WEP' | 'nopass' = 'WPA'): Promise<string> {
  const wifiData = `WIFI:S:${ssid};T:${security};P:${password};;`;
  return generateQRCode(wifiData);
}

// Generate QR code for a payment/tip
export function generatePaymentQR(amount: number, currency: string = 'USD', recipient: string): Promise<string> {
  // This would ideally use a proper payment protocol
  const paymentData = `PAY:${recipient};AMT:${amount};CUR:${currency}`;
  return generateQRCode(paymentData);
}

// Download QR code as image
export function downloadQRCode(dataUrl: string, filename: string = 'qrcode.png'): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}