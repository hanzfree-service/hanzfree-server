// const crypto = require('crypto');

// export function generateBookingNumber() {
//   const bytes = crypto.randomBytes(16);
//   const hexString = bytes.toString('hex');
//   return hexString.slice(0, 8);
// }

export function generateBookingNumber() {
  const chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const length = 12;
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}
