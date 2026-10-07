import { CategoryInfo } from '../types';

/**
 * Normalizes a category ID for comparison (lowercased, trimmed, hyphens/underscores unified)
 */
export function normalizeCategoryId(id: string): string {
  return (id || '')
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, '-');
}

/**
 * Normalizes a category name for comparison (lowercased, trimmed)
 */
export function normalizeCategoryName(name?: string): string {
  return (name || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

/**
 * Thoroughly deduplicates categories so duplicate IDs or duplicate Marathi/English names never appear.
 */
export function deduplicateCategories(categories: CategoryInfo[]): CategoryInfo[] {
  if (!Array.isArray(categories)) return [];

  const seenIds = new Set<string>();
  const seenNames = new Set<string>();
  const deduplicated: CategoryInfo[] = [];

  for (const cat of categories) {
    if (!cat || !cat.id) continue;

    const normId = normalizeCategoryId(cat.id);
    const normName = normalizeCategoryName(cat.name);
    const normMarathi = normalizeCategoryName(cat.nameMarathi);

    // Check if ID already exists
    if (seenIds.has(normId)) {
      continue;
    }

    // Check if both English and Marathi name match an existing entry (duplicate display name)
    if (normName && seenNames.has(normName) && normMarathi && seenNames.has(normMarathi)) {
      continue;
    }

    seenIds.add(normId);
    if (normName) seenNames.add(normName);
    if (normMarathi) seenNames.add(normMarathi);

    deduplicated.push(cat);
  }

  return deduplicated;
}
