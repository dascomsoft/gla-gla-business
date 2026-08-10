/**
 * Generate a URL-friendly slug from a string
 */
const slugify = (text) => {
  if (!text) return '';

  return text
    .toString()
    .toLowerCase()
    // Remove accents/diacritics
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Replace spaces and special characters
    .replace(/[^a-z0-9]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-|-$/g, '')
    // Limit to 50 characters
    .substring(0, 50);
};

/**
 * Generate a unique slug by appending a number if needed
 */
const generateUniqueSlug = async (model, baseSlug, field = 'slug') => {
  let slug = baseSlug;
  let counter = 1;
  let exists = true;

  while (exists) {
    const query = {};
    query[field] = slug;
    const existing = await model.findOne(query);
    
    if (!existing) {
      exists = false;
    } else {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  return slug;
};

module.exports = {
  slugify,
  generateUniqueSlug
};