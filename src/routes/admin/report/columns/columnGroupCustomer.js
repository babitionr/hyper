import { formatPrice } from 'utils/func';

export const columnGroupCustomer = () => {
  return [
    {
      title: 'Nhóm khách hàng',
      name: 'name',
      tableItem: {},
    },
    {
      title: 'Thanh toán',
      name: 'amount',
      tableItem: {
        render: (value) => formatPrice(value),
      },
    },
  ];
};
