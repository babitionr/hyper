import moment from 'moment';
import { formatPercent, formatPrice } from 'utils/func';

export const columnAdvise = () => {
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
      title: 'Tên Bệnh Nhân',
      name: 'customerName',
      tableItem: {},
    },
    {
      title: 'Mã phiếu điều trị',
      name: 'soNumber',
      tableItem: {},
    },
    {
      title: 'Tên dịch vụ',
      name: 'serviceName',
      tableItem: {},
    },
    {
      title: 'Ngày tạo phiếu thu',
      name: 'date',
      tableItem: {
        render: (value) => (value ? moment(value).format('DD/MM/YYYY') : null),
      },
    },
    {
      title: 'Thực thu (VND)',
      name: 'totalAmount',
      tableItem: {
        render: (value) => (value ? formatPrice(value) : null),
      },
    },
    {
      title: 'Tiền labo đã trả (VND)',
      name: 'labAmount',
      tableItem: {
        render: (value) => (value ? formatPrice(value) : null),
      },
    },
    {
      title: 'Phần trăm tư vấn (%)',
      name: 'percent',
      tableItem: {
        render: (value) => (value ? formatPercent(value) : null),
      },
    },
    {
      title: 'Phần trăm tư vấn (VND)',
      name: 'percentAmount',
      tableItem: {
        render: (value) => (value ? formatPrice(value) : null),
      },
    },
  ];
};
