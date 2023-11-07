import { formatPrice } from 'utils/func';

export const columnSupport = () => {
  return [
    {
      title: 'STT',
      name: 'stt',
      tableItem: {
        width: '50',
        align: 'center',
        render: (value, record, index) => index + 1,
      },
    },
    {
      title: 'Tên phụ cấp',
      name: 'name',
      tableItem: {},
    },
    {
      title: 'Số tiền (VND)',
      name: 'amount',
      tableItem: {
        render: (value) => (value ? formatPrice(value) : null),
      },
    },
  ];
};
