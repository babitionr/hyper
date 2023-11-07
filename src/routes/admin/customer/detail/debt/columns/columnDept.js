// import React from "react";

import { formatCurrency } from 'utils';
import { formatDate } from 'utils/func';

export const ColumnDebt = () => {
  return [
    {
      title: 'Ngày thu nợ',
      name: 'createdAt',
      tableItem: {
        render: (value) => (value ? formatDate(value) : null),
      },
    },
    {
      title: 'Nguồn',
      name: 'code',
      tableItem: {},
    },
    {
      title: 'Nội dung',
      name: 'note',
      tableItem: {},
    },
    {
      title: 'Số tiền',
      name: 'totalAmount',
      tableItem: {
        render: (value) => (value ? formatCurrency(value, ' ') + ' VND' : null),
      },
    },
  ];
};
