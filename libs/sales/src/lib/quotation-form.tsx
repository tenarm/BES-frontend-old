import React, { useState } from 'react';
import { Card, Button, Input, Badge } from '@erp/shared-ui';
import { CustomerDrawer } from './customer-drawer';
import styles from './quotation-form.module.css';

interface QuotationItem {
  id: string;
  productName: string;
  qty: number;
  rate: number;
  amount: number;
}

export const QuotationForm: React.FC = () => {
  const [customer, setCustomer] = useState<{ id: string, name: string } | null>(null);
  const [isCustomerDrawerOpen, setIsCustomerDrawerOpen] = useState(false);
  const [items, setItems] = useState<QuotationItem[]>([
    { id: '1', productName: '', qty: 1, rate: 0, amount: 0 }
  ]);
  const [postingDate, setPostingDate] = useState(new Date().toISOString().split('T')[0]);

  // Totals calculation
  const subtotal = items.reduce((acc, item) => acc + item.amount, 0);
  const tax = subtotal * 0.18; // Example 18% GST
  const total = subtotal + tax;

  const handleAddItem = () => {
    setItems([...items, { 
        id: crypto.randomUUID(), 
        productName: '', 
        qty: 1, 
        rate: 0, 
        amount: 0 
    }]);
  };

  const updateItem = (id: string, field: keyof QuotationItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'qty' || field === 'rate') {
          updated.amount = (updated.qty || 0) * (updated.rate || 0);
        }
        return updated;
      }
      return item;
    }));
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h1>New Sales Quotation</h1>
          <Badge variant="info">DRAFT</Badge>
        </div>
        <div className={styles.actions}>
            <Button variant="secondary">Discard</Button>
            <Button variant="primary">Submit Quotation</Button>
        </div>
      </header>

      <div className={styles.content}>
        <Card title="General Information">
          <div className={styles.grid2}>
            <Input 
              label="Customer" 
              placeholder="Search or Quick-Create..." 
              value={customer?.name || ''} 
              readOnly
              onActionClick={() => setIsCustomerDrawerOpen(true)}
              actionLabel="+"
              helperText="Click + to add a new customer on the fly"
            />
            <Input 
              label="Posting Date" 
              type="date" 
              value={postingDate} 
              onChange={(e) => setPostingDate(e.target.value)} 
            />
          </div>
        </Card>

        <Card title="Line Items" className={styles.itemsCard}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Item / Product</th>
                  <th style={{ width: '100px' }}>Qty</th>
                  <th style={{ width: '150px' }}>Rate</th>
                  <th style={{ width: '150px' }}>Amount</th>
                  <th style={{ width: '40px' }}></th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td>
                      <Input 
                        placeholder="Type product name..." 
                        value={item.productName} 
                        onChange={(e) => updateItem(item.id, 'productName', e.target.value)} 
                      />
                    </td>
                    <td>
                      <Input 
                        type="number" 
                        value={item.qty} 
                        onChange={(e) => updateItem(item.id, 'qty', parseFloat(e.target.value))} 
                      />
                    </td>
                    <td>
                      <Input 
                        type="number" 
                        value={item.rate} 
                        onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value))} 
                        placeholder="0.00"
                      />
                    </td>
                    <td className={styles.amount}>
                      ${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td>
                      <button 
                        className={styles.removeRow} 
                        onClick={() => handleRemoveItem(item.id)}
                        title="Remove Row"
                      >
                        &times;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button variant="secondary" onClick={handleAddItem} className={styles.addRowBtn}>
            + Add Row
          </Button>
        </Card>

        <div className={styles.footerSection}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryItem}>
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className={styles.summaryItem}>
              <span>Tax (GST 18%)</span>
              <span>${tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className={`${styles.summaryItem} ${styles.total}`}>
              <span>Grand Total</span>
              <span>${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </div>

      <CustomerDrawer 
        isOpen={isCustomerDrawerOpen} 
        onClose={() => setIsCustomerDrawerOpen(false)} 
        onSuccess={(c) => setCustomer(c)} 
      />
    </div>
  );
};
