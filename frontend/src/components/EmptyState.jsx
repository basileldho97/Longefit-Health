import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ title = 'No records found', message = 'There are no items to display at this time.' }) => {
  return (
    <div className="empty-state">
      <Inbox className="empty-icon" />
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
};

export default EmptyState;
