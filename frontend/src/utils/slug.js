// Utilities for building and parsing human‑readable slugs

const stripDiacritics = (str = '') =>
  str.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');

const ordinal = (n) => {
  const num = Number(n);
  if (!Number.isFinite(num)) return '';
  const s = ['th', 'st', 'nd', 'rd'];
  const v = num % 100;
  return num + (s[(v - 20) % 10] || s[v] || s[0]);
};

export const slugify = (str = '') => {
  const s = stripDiacritics(String(str).toLowerCase());
  return s
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
};

// Build a canonical MP slug like:
//   mp-name-constituency-state-<24hexId>
export const buildMPSlug = (mp) => {
  if (!mp) return '';
  const id = mp.id || mp._id || '';
  const parts = [mp.name || mp.mpName, mp.constituency, mp.state]
    .filter(Boolean)
    .map(slugify);
  const base = parts.filter(Boolean).join('-');
  return [base, id].filter(Boolean).join('-');
};

// Build a human‑readable MP slug without ID
// Default: name-constituency-state
export const buildMPSlugHuman = (mp, opts = {}) => {
  if (!mp) return '';
  const { lsTerm, includeHouse = true, includeTerm = true } = opts;
  const parts = [mp.name || mp.mpName, mp.constituency, mp.state]
    .filter(Boolean)
    .map(slugify);
  const house = String(mp.house || '').toLowerCase();
  if (includeHouse && house) {
    if (house.includes('lok')) {
      if (includeTerm && (lsTerm || mp.ls_term)) {
        parts.push(slugify(`${ordinal(lsTerm || mp.ls_term)} lok sabha`));
      } else {
        parts.push('lok-sabha');
      }
    } else if (house.includes('rajya')) {
      parts.push('rajya-sabha');
    }
  }
  return parts.filter(Boolean).join('-');
};

export const buildMPSlugCandidates = (mp) => {
  if (!mp) return [];
  const base = buildMPSlugHuman(mp, { includeHouse: false, includeTerm: false });
  const withHouseOnly = buildMPSlugHuman(mp, { includeHouse: true, includeTerm: false });
  const candidates = new Set([base, withHouseOnly]);
  if (String(mp.house || '').toLowerCase().includes('lok')) {
    candidates.add(buildMPSlugHuman(mp, { includeHouse: true, includeTerm: true, lsTerm: 18 }));
    candidates.add(buildMPSlugHuman(mp, { includeHouse: true, includeTerm: true, lsTerm: 17 }));
  }
  return Array.from(candidates).filter(Boolean);
};

// Extract id from a slug if present (expects trailing 24-hex)
export const getIdFromSlug = (slug = '') => {
  if (!slug) return null;
  const last = String(slug).split('-').pop();
  return /^[a-f0-9]{24}$/i.test(last) ? last : null;
};

// Check if the param looks like a bare 24-hex id
export const isBareObjectId = (s = '') => /^[a-f0-9]{24}$/i.test(String(s));
