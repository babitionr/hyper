import { formatDate, formatPrice } from 'utils/func';

export const columnImportExportHistory = ({ handleEdit, handleDelete }) => {
  return [
    {
      title: 'Ngày nhập xuất',
      name: 'inOutDate',
      tableItem: {
        width: 150,
        align: 'center',
        render: (value) => formatDate(value, 'DD-MM-YYYY HH:mm'),
      },
    },
    {
      title: 'Ngày hoàn thành',
      name: 'completedDate',
      tableItem: {
        width: 150,
        align: 'center',
        render: (value) => formatDate(value, 'DD-MM-YYYY HH:mm'),
      },
    },
    {
      title: 'Tham chiếu',
      name: 'referenceCode',
      tableItem: {
        width: 150,
      },
    },
    {
      title: 'Đối tác',
      name: 'partnerName',
      tableItem: {
        width: 150,
      },
    },
    {
      title: 'Sản phẩm',
      name: 'productName',
      tableItem: {
        width: 150,
      },
    },
    {
      title: 'Loại sản phẩm',
      name: 'productType',
      tableItem: {
        width: 150,
        render: (value) => (value === 'MATERIAL' ? 'Vật tư' : 'Thuốc'),
      },
    },
    {
      title: 'ĐVT',
      name: 'inventoryUnit',
      tableItem: {
        width: 150,
      },
    },
    {
      title: 'Số lượng',
      name: 'quantity',
      tableItem: {
        width: 150,
        align: 'right',
        render: (value) => formatPrice(value),
      },
    },
    {
      title: 'Đơn giá',
      name: 'price',
      tableItem: {
        width: 150,
        align: 'right',
        render: (value) => formatPrice(value),
      },
    },
    {
      title: 'Thành tiền',
      name: 'totalAmount',
      tableItem: {
        width: 150,
        align: 'right',
        render: (value) => formatPrice(value),
      },
    },
  ];
};
