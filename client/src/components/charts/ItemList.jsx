import React from 'react';
import { MdTrendingUp, MdTrendingDown } from 'react-icons/md';

const ItemList = ({ items, selectedItemId, onSelectItem }) => {
  return (
    <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
      <h3 style={{ padding: '20px', borderBottom: '1px solid #eee', color: '#495057', margin: 0 }}>Select Item</h3>
      <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
        {items.length === 0 ? (
          <div style={{ padding: '20px', color: '#999', textAlign: 'center' }}>No data available</div>
        ) : (
          items.map((item) => {
            const isSelected = selectedItemId === item.reference_id;
            const profit = item.total_income - item.total_expense;
            const isProfitable = profit >= 0;

            return (
              <div 
                key={item.reference_id}
                onClick={() => onSelectItem(item)}
                style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid #eee',
                  cursor: 'pointer',
                  background: isSelected ? '#f8f9fa' : 'white',
                  borderLeft: isSelected ? '4px solid #1976d2' : '4px solid transparent',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => { if(!isSelected) e.currentTarget.style.background = '#f8f9fa' }}
                onMouseLeave={(e) => { if(!isSelected) e.currentTarget.style.background = 'white' }}
              >
                <div style={{ fontWeight: 600, color: '#212529', marginBottom: '8px' }}>
                  {item.reference_name || 'Unnamed Item'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: '#666' }}>Income: <span style={{ color: '#2e7d32', fontWeight: 500 }}>₹{item.total_income.toLocaleString()}</span></span>
                  <span style={{ color: '#666' }}>Expense: <span style={{ color: '#c62828', fontWeight: 500 }}>₹{item.total_expense.toLocaleString()}</span></span>
                </div>
                <div style={{ 
                  marginTop: '8px', 
                  fontSize: '0.85rem', 
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: isProfitable ? '#2e7d32' : '#c62828' 
                }}>
                  {isProfitable ? <MdTrendingUp /> : <MdTrendingDown />}
                  {isProfitable ? 'Profit' : 'Loss'}: ₹{Math.abs(profit).toLocaleString()}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ItemList;
