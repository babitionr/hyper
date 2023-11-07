import { formatPrice } from 'utils/func';

export const columnReportReceiptDetail = () => {
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
      name: 'customerName',
      tableItem: {
        align: 'left',
      },
    },
    {
      title: 'Số điện thoại',
      name: 'customerPhone',
      tableItem: {
        align: 'right',
        render: (value, record, index) => '0958588585',
      },
    },
    {
      title: 'Nội dung điều trị',
      name: 'serviceName',
      tableItem: {
        align: 'left',
      },
    },
    {
      title: 'Bác sĩ',
      name: 'doctorName',
      tableItem: {
        align: 'left',
      },
    },
    {
      title: 'Doanh thu',
      name: 'totalAmount',
      tableItem: {
        align: 'right',
        render: (value, record, index) => formatPrice(value),
      },
    },
    {
      title: 'Thực thu',
      name: 'paidAmount',
      tableItem: {
        align: 'right',
        render: (value, record, index) => formatPrice(value),
      },
    },
    {
      title: 'Còn lại',
      name: 'revenue',
      tableItem: {
        align: 'right',
        render: (value, record, index) => formatPrice(record?.totalAmount - record?.paidAmount),
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
    {
      title: 'Nhóm khách hàng',
      name: 'customerGroup',
      tableItem: {
        align: 'left',
        render: (value, record, index) => (value === 'VIP' ? 'Vip' : 'Bình thường'),
      },
    },
    {
      title: 'Nhóm điều trị',
      name: 'categoryServiceName',
      tableItem: {
        align: 'left',
      },
    },
  ];
};
