
import { useState } from 'react';
import { Order } from '@/types/admin';

export const useOrderManagement = (orders: Order[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'number' | 'amount'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (column: 'date' | 'number' | 'amount') => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
  };

  const filteredOrders = orders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.userId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'date') {
      return sortDirection === 'asc'
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    
    if (sortBy === 'number') {
      return sortDirection === 'asc'
        ? a.orderNumber.localeCompare(b.orderNumber)
        : b.orderNumber.localeCompare(a.orderNumber);
    }
    
    // amount
    return sortDirection === 'asc'
      ? a.totalAmount - b.totalAmount
      : b.totalAmount - a.totalAmount;
  });

  return {
    searchQuery,
    setSearchQuery,
    sortBy,
    sortDirection,
    handleSort,
    sortedOrders
  };
};
