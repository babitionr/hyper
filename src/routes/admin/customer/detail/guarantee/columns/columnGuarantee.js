import { formatDate } from 'utils/func';
import React from 'react';
export const ColumnGuarantee = ({ handleEdit, handleChange }) => {
  return [
    {
      title: 'Mã bảo hành',
      name: 'warrantyNo',
      tableItem: {},
    },
    {
      title: 'Mã phiếu Labo',
      name: 'laboNo',
      tableItem: {},
    },
    {
      title: 'Mã phiếu điều trị ',
      name: 'saleOrderNumber',
      tableItem: {},
    },
    {
      title: 'Thời gian bảo hành',
      name: 'warrantyYear',
      tableItem: {
        align: 'center',
        render: (value) => value + ' năm',
      },
    },
    {
      title: 'Hạn bảo hành',
      name: 'warrantyPeriod',
      tableItem: {
        align: 'center',
        render: (value) => formatDate(value),
      },
    },
    {
      title: 'Loại phục hình',
      name: 'prostheticsType',
      tableItem: {},
    },
    {
      title: 'Trạng thái',
      name: 'reason',
      tableItem: {
        fixed: 'right',
        align: 'center',
        render: (value, record) =>
          record.warrantyYear > 0 ? (
            <div className="text-green-500">Chưa hết hạn</div>
          ) : (
            <div className="text-rose-500">Đã hết hạn</div>
          ),
      },
    },
  ];
};
