import React from 'react';

export const ColumnExportStockMini = () => {
  return [
    {
      title: 'STT',
      name: 'stt',
      tableItem: {
        width: 50,
        render: (text, record, index) => <div className="">&nbsp; {index + 1} &nbsp;</div>,
      },
    },
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
          if (text === 'MATERIAL') return <div>&nbsp; Vật tư </div>;
          else if (text === 'MEDICINE') return <div>&nbsp; Thuốc </div>;
        },
      },
    },
    {
      title: 'Đơn vị tính',
      name: 'inventoryUnit',
      tableItem: {
        width: 150,
        render: (text, record, index) => <div className="">&nbsp;{text}</div>,
      },
    },
    {
      title: 'Số lượng',
      name: 'quantity',
      tableItem: {
        width: 150,
        render: (text, record, index) => <div className="">&nbsp;{text}</div>,
      },
    },
    {
      title: 'Đơn giá',
      name: 'price',
      tableItem: {
        width: 150,
        render: (text, record, index) => <div className="">&nbsp;{text} </div>,
      },
    },
    {
      title: 'Thành tiền',
      name: 'thanhTien',
      tableItem: {
        width: 150,
        render: (text, record, index) => {
          return <div>&nbsp;{record?.quantity * record?.price}</div>;
        },
      },
    },
  ];
};
