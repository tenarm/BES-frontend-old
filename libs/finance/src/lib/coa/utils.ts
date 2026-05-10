import { Account, TreeRow } from './types';

/**
 * Transforms a flat list of accounts into a flattened tree structure for table rendering.
 * Injects "new" row placeholder if an ID matches the addingToId state.
 */
export const buildTreeRows = (
  accounts: Account[],
  expandedIds: Set<string>,
  addingToId: string | null
): TreeRow[] => {
  const result: TreeRow[] = [];

  const traverse = (parentId: string | null, level: number) => {
    const children = accounts.filter(a => (a.parent_id || null) === parentId);
    
    children.forEach(item => {
      result.push({ item, level });
      
      if (expandedIds.has(item.id)) {
        // Inject the "New Account" input row right under its parent
        if (addingToId === item.id) {
          result.push({ item: 'new', level: level + 1, parentId: item.id });
        }
        traverse(item.id, level + 1);
      }
    });
  };

  traverse(null, 0);
  
  // Handle root level "New Account"
  if (addingToId === 'root') {
    result.push({ item: 'new', level: 0, parentId: 'root' });
  }

  return result;
};
