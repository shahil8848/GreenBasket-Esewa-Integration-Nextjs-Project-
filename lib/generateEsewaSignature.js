import CryptoJS from "crypto-js";

export function generateEsewaSignature(secretKey, message) {
  const hash = CryptoJS.HmacSHA256(message, secretKey);
  return CryptoJS.enc.Base64.stringify(hash);
}