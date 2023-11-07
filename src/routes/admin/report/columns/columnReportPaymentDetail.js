import { formatPrice } from 'utils/func';

export const columnReportPaymentDetail = () => {
  return [
    {
      title: 'STT',
      name: 'stt',
      tableItem: {
        width: 50,
        align: 'center',
        render: (value, record, index) => index + 1,
      },
    },
    {
      title: 'Chi phí',
      name: 'expenseName',
      tableItem: {
        align: 'left',
      },
    },
    {
      title: 'Nội dung',
      name: 'note',
      tableItem: {
        align: 'left',
        render: (value, record, index) => '0958588585',
      },
    },
    {
      title: 'Tổng tiền',
      name: 'totalAmount',
      tableItem: {
        align: 'left',
        render: (value, record, index) => formatPrice(value),
      },
    },
    {
      title: 'Hình thức',
      name: 'form',
      tableItem: {
        align: 'left',
        render: (value, record, index) => {
          switch (value) {
            case 'BANK':
              return 'Ngân hàng';
            case 'CASH':
              return 'Tiền mặt';
            case 'POS':
              return 'POS';
            case 'INS':
              return 'Trả góp';
            default:
              return '';
          }
        },
      },
    },
  ];
};
