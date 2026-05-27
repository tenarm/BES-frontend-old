import React from 'react';
import { Search, Plus, Edit, RefreshCw } from 'lucide-react';
import { Button, Table, Badge, Card, Skeleton } from '@bes/shared-ui';
import { ItemDetailsRead } from '../types';

interface ItemListTabProps {
  items: ItemDetailsRead[];
  search: string;
  setSearch: (s: string) => void;
  loading: boolean;
  onOnboard: () => void;
  onEdit: (item: ItemDetailsRead) => void;
  onRefresh: () => void;
  page: number;
  pageSize: number;
  total: number;
  setPage: (p: number) => void;
  setPageSize: (size: number) => void;
  activeTier: 'Basic' | 'Pro' | 'Premium';
}

export const ItemListTab: React.FC<ItemListTabProps> = ({
  items,
  search,
  setSearch,
  loading,
  onOnboard,
  onEdit,
  onRefresh,
  page,
  pageSize,
  total,
  setPage,
  setPageSize,
  activeTier
}) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <Card style={{ padding: 'var(--ui-spacing-lg)', background: 'var(--ui-white)', borderRadius: 'var(--ui-radius-lg)' }}>
      {/* Controls Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--ui-spacing-lg)', gap: 'var(--ui-spacing-md)', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--ui-gray-400)' }} />
          <input 
            type="text" 
            placeholder="Search catalog by product name or SKU..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // Reset page to 1 on search change
            }}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '10px 12px 10px 38px',
              borderRadius: 'var(--ui-radius-md)',
              border: '1px solid var(--ui-gray-300)',
              fontSize: 'var(--ui-text-sm)',
              outline: 'none',
              transition: 'border-color 0.2s',
              fontFamily: 'var(--ui-font-sans)'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--ui-primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--ui-gray-300)'}
          />
        </div>
        <div style={{ display: 'flex', gap: 'var(--ui-spacing-sm)' }}>
          <Button variant="secondary" onClick={onRefresh} size="sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <RefreshCw size={14} /> Refresh
          </Button>
          <Button variant="primary" onClick={onOnboard} size="sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={16} /> Onboard New Item
          </Button>
        </div>
      </div>

      {/* Main Table */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--ui-spacing-md)' }}>
          <Skeleton height="36px" />
          <Skeleton height="40px" count={5} />
        </div>
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <th style={{ width: '120px' }}>SKU</th>
                <th>Item Name</th>
                <th>Category</th>
                <th>Base UOM</th>
                <th style={{ textAlign: 'right' }}>Std Cost</th>
                <th style={{ textAlign: 'right' }}>WAC</th>
                <th style={{ textAlign: 'right' }}>Base Price</th>
                <th style={{ textAlign: 'right', width: '100px' }}>Safety Stock</th>
                <th style={{ textAlign: 'center', width: '100px' }}>Status</th>
                <th style={{ textAlign: 'right', width: '100px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: '40px', color: 'var(--ui-gray-500)' }}>
                    No catalog items found matching your filters.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} style={{ height: '38px' }}>
                    <td style={{ 
                      fontFamily: 'var(--ui-font-mono)', 
                      fontWeight: 700, 
                      color: 'var(--ui-gray-800)',
                      fontSize: '0.85rem'
                    }}>
                      {item.sku}
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--ui-gray-900)' }}>{item.name}</td>
                    <td style={{ color: 'var(--ui-gray-500)', fontSize: '0.825rem' }}>
                      {item.notes?.includes('Category:') 
                        ? item.notes.split('Category:')[1].split(';')[0].trim() 
                        : 'Standard Product'}
                    </td>
                    <td>
                      <Badge variant="info" style={{ fontSize: '0.75rem', padding: '2px 6px' }}>
                        {item.uom_id ? 'Base' : 'None'}
                      </Badge>
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--ui-font-mono)', fontSize: '0.825rem' }}>
                      ${Number(item.standard_cost || 0).toFixed(4)}
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--ui-font-mono)', fontSize: '0.825rem', color: 'var(--ui-gray-500)' }}>
                      ${Number(item.weighted_average_cost || 0).toFixed(4)}
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--ui-font-mono)', fontSize: '0.825rem', fontWeight: 600 }}>
                      ${Number(item.base_price || 0).toFixed(4)}
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--ui-font-mono)', fontSize: '0.825rem' }}>
                      {Number(item.safety_stock || 0).toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <Badge variant={!item.is_deleted ? 'success' : 'warning'}>
                        {!item.is_deleted ? 'Active' : 'Archived'}
                      </Badge>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Button variant="secondary" size="sm" onClick={() => onEdit(item)} style={{ padding: '4px 8px', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <Edit size={12} /> Edit
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          {/* Pagination Controls */}
          {total > 0 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginTop: 'var(--ui-spacing-lg)',
              paddingTop: 'var(--ui-spacing-md)',
              borderTop: '1px solid var(--ui-gray-200)',
              fontSize: 'var(--ui-text-sm)',
              color: 'var(--ui-gray-600)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>Show</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  style={{
                    padding: '4px 8px',
                    borderRadius: 'var(--ui-radius-sm)',
                    border: '1px solid var(--ui-gray-300)',
                    outline: 'none',
                    fontSize: '0.85rem'
                  }}
                >
                  <option value={10}>10 rows</option>
                  <option value={20}>20 rows</option>
                  <option value={50}>50 rows</option>
                  <option value={100}>100 rows</option>
                </select>
                <span>of {total} items</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ui-spacing-sm)' }}>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <span style={{ fontWeight: 600 }}>Page {page} of {totalPages}</span>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
};
