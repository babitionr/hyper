import moment from 'moment';
import { formatPrice } from 'utils/func';

export const ColumnExpectedRevenue = () => {
  return [
    {
      title: 'STT',
      name: 'stt',
      tableItem: {
        align: 'center',
        render: (value, record, index) => index + 1,
      },
    },
    {
      title: 'Khách hàng',
      name: 'createdUserName',
      tableItem: {},
    },

    {
      title: 'Ngày lập phiếu',
      name: 'dateOrder',
      tableItem: {
        align: 'center',
        render: (value) => (value ? moment(value).format('DD/MM/YYYY') : null),
      },
    },
    {
      title: 'Số phiếu',
      name: 'code',
      tableItem: {},
    },
    {
      title: 'Tiền điều trị',
      name: 'totalPaymentAmount',
      tableItem: {
        render: (value) => formatPrice(value),
      },
    },
    {
      title: 'Thanh toán',
      name: 'paidAmount',
      tableItem: {
        render: (value) => formatPrice(value),
      },
    },
    {
      title: 'Còn lại',
      name: 'balanceAmount',
      tableItem: {
        render: (value) => formatPrice(value),
      },
    },
  ];
};
