/**
 * Web Crypto API SHA-256 Hasher for Client-Side Evidence Integrity
 */

export async function computeFileSha256(file) {
  if (!file) return null;
  try {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    console.error('Failed to compute client SHA-256:', error);
    return null;
  }
}

export function truncateHash(hash, length = 16) {
  if (!hash) return '';
  if (hash.length <= length) return hash;
  return `${hash.substring(0, length / 2)}...${hash.substring(hash.length - length / 2)}`;
}

