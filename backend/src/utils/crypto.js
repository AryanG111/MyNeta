const crypto = require('crypto');
const { dataEncKeyB64, ipSalt } = require('../config');

function getKey() {
  if (!dataEncKeyB64) throw new Error('DATA_ENC_KEY not set');
  const key = Buffer.from(dataEncKeyB64, 'base64');
  if (key.length !== 32) throw new Error('DATA_ENC_KEY must be 32 bytes base64');
  return key;
}

function encrypt(value) {
  if (value == null) return null;
  const key = getKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(String(value), 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, ciphertext]).toString('base64');
}

function decrypt(payloadB64) {
  if (payloadB64 == null) return null;
  const key = getKey();
  const buf = Buffer.from(payloadB64, 'base64');
  const iv = buf.subarray(0, 12);
  const authTag = buf.subarray(12, 28);
  const ciphertext = buf.subarray(28);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return plaintext.toString('utf8');
}

function maskEpic(epic) {
  if (!epic) return '';
  const s = String(epic);
  if (s.length <= 5) return '*'.repeat(Math.max(0, s.length - 1)) + s.slice(-1);
  return s.slice(0, 3) + '*'.repeat(Math.max(0, s.length - 5)) + s.slice(-2);
}

function hashIp(ip) {
  if (!ip) return null;
  const h = crypto.createHash('sha256');
  h.update(String(ip));
  h.update('|');
  h.update(ipSalt || '');
  return h.digest('hex');
}

module.exports = { encrypt, decrypt, maskEpic, hashIp };

