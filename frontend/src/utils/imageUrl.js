/**
 * Resolves an image path to a full URL.
 * Handles both local development (Vite proxy) and production (deployed Render backend).
 *
 * @param {string} imagePath - Relative path (e.g. 'public/temp/...', '/public/temp/...') or absolute URL
 * @returns {string} Fully qualified or normalized URL
 */
export function getImageUrl(imagePath) {
  if (!imagePath) return '';

  // Already a full URL or blob
  if (
    imagePath.startsWith('http://') ||
    imagePath.startsWith('https://') ||
    imagePath.startsWith('blob:') ||
    imagePath.startsWith('data:')
  ) {
    return imagePath;
  }

  // Normalize Windows backslashes
  let cleanPath = imagePath.replace(/\\/g, '/');

  // Strip leading '.' if present (e.g. './public/temp' -> '/public/temp')
  if (cleanPath.startsWith('./')) {
    cleanPath = cleanPath.slice(1);
  }

  if (!cleanPath.startsWith('/')) {
    cleanPath = '/' + cleanPath;
  }

  const apiBase = import.meta.env.VITE_API_URL || '';
  if (apiBase) {
    return `${apiBase.replace(/\/+$/, '')}${cleanPath}`;
  }

  return cleanPath;
}

