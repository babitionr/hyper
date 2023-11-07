import React from 'react';

export const ColumnTableStatusCompleted = () => {
  return [
    {
      title: 'Tên sản phẩm',
      name: 'name',
      tableItem: {
        width: 150,
      },
    },
    {
      title: 'Loại sản phẩm',
      name: 'productType',
      tableItem: {
        width: 150,
        render: (text, data) => {
          if (text === 'MATERIAL') return <div>Vật tư &nbsp;</div>;
          else if (text === 'MEDICINE') return <div>Thuốc &nbsp;</div>;
        },
      },
    },
    {
      title: 'Đơn vị tính',
      name: 'inventoryUnit',
      tableItem: {
        width: 150,
        render: (text, record, index) => <div className="">{text} &nbsp;</div>,
      },
    },
    {
      title: 'Số lượng',
      name: 'quantity',
      tableItem: {
        width: 150,
        render: (text, record, index) => <div className="">{text} &nbsp;</div>,
      },
    },
    {
      title: 'Đơn giá',
      name: 'price',
      tableItem: {
        width: 150,
        render: (text, record, index) => <div className="">{text} &nbsp;</div>,
      },
    },
    {
      title: 'Thành tiền',
      name: 'thanhTien',
      tableItem: {
        width: 150,
        render: (text, record, index) => {
          return record?.quantity * record?.price;
        },
      },
    },
  ];
};
