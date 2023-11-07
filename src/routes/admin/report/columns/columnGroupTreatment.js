import { formatPrice } from 'utils/func';

export const columnGroupTreatment = () => {
  return [
    {
      title: 'Nhóm dịch vụ',
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
