import { formatPrice } from 'utils/func';

export const columnRealMoneyByBrahch = () => {
  return [
    {
      title: 'STT',
      name: 'stt',
      tableItem: {
        width: 60,
        align: 'center',
        render: (value, record, index) => index + 1,
      },
    },
    {
      title: 'Tên chi nhánh',
      name: 'branchName',
      tableItem: {},
    },
    {
      title: 'Thanh toán',
      name: 'paidAmount',
      tableItem: {
        render: (value) => formatPrice(value),
      },
    },
  ];
};
