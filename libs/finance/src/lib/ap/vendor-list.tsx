import React, { useState, useEffect } from 'react';
import { Plus, Search, Mail, Phone, MoreVertical } from 'lucide-react';
import { Button, Table, THead, TBody, TR, TH, TD, Skeleton, Input } from '@bes/shared-ui';

const API_BASE = import.meta.env.VITE_API_URL || '';

export const VendorList: React.FC = () => {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/v1/finance/vendors`);
      const json = await res.json();
      setVendors(json.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const filteredVendors = vendors.filter(v => 
    v.name.toLowerCase().includes(search.toLowerCase()) || 
    (v.tax_id && v.tax_id.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ padding: 'var(--ui-spacing-lg)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--ui-spacing-lg)' }}>
        <div>
          <h2 style={{ fontSize: 'var(--ui-text-xl)', fontWeight: '700', color: 'var(--ui-gray-900)', margin: 0 }}>Vendors</h2>
          <p style={{ fontSize: 'var(--ui-text-sm)', color: 'var(--ui-gray-500)', marginTop: '4px' }}>Manage your suppliers and service providers.</p>
        </div>
        <Button variant="primary" size="sm">
          <Plus size={16} style={{ marginRight: '4px' }} /> New Vendor
        </Button>
      </header>

      <div style={{ marginBottom: 'var(--ui-spacing-lg)', maxWidth: '400px' }}>
        <Input 
          placeholder="Search vendors..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          prefix={<Search size={16} color="var(--ui-gray-400)" />}
        />
      </div>

      <div style={{ background: 'var(--ui-white)', borderRadius: 'var(--ui-radius-lg)', border: '1px solid var(--ui-gray-200)', overflow: 'hidden' }}>
        <Table>
          <THead style={{ background: 'var(--ui-gray-50)' }}>
            <TR>
              <TH>Vendor Name</TH>
              <TH>Tax ID</TH>
              <TH>Contact Information</TH>
              <TH>Payment Terms</TH>
              <TH style={{ width: '48px' }}></TH>
            </TR>
          </THead>
          <TBody>
            {loading ? (
              [1, 2, 3].map(i => (
                <TR key={i}>
                  <TD><Skeleton width="180px" /></TD>
                  <TD><Skeleton width="100px" /></TD>
                  <TD><Skeleton width="200px" /></TD>
                  <TD><Skeleton width="80px" /></TD>
                  <TD><Skeleton width="24px" /></TD>
                </TR>
              ))
            ) : filteredVendors.length === 0 ? (
              <TR>
                <TD colSpan={5} style={{ textAlign: 'center', padding: 'var(--ui-spacing-xl) 0', color: 'var(--ui-gray-400)' }}>
                  <p>No vendors found.</p>
                </TD>
              </TR>
            ) : (
              filteredVendors.map(vendor => (
                <TR key={vendor.id} style={{ borderBottom: '1px solid var(--ui-gray-100)' }}>
                  <TD style={{ fontWeight: '600', color: 'var(--ui-gray-900)' }}>{vendor.name}</TD>
                  <TD>{vendor.tax_id || '-'}</TD>
                  <TD>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {vendor.primary_email && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--ui-text-xs)', color: 'var(--ui-gray-500)' }}>
                          <Mail size={12} /> {vendor.primary_email}
                        </div>
                      )}
                    </div>
                  </TD>
                  <TD>{vendor.payment_terms || 'Net 30'}</TD>
                  <TD>
                    <button style={{ background: 'none', border: 'none', color: 'var(--ui-gray-400)', cursor: 'pointer' }}>
                      <MoreVertical size={16} />
                    </button>
                  </TD>
                </TR>
              ))
            )}
          </TBody>
        </Table>
      </div>
    </div>
  );
};
