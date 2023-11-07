export const ColumnAddNewPayment = () => {
  return [
    {
      title: 'Dịch vụ',
      name: 'name',
      tableItem: {
        width: 200,
      },
    },
    {
      title: 'Thành tiền',
      name: 'totalPaymentAmount',
      tableItem: {
        align: 'right',
        width: 150,
        render: (text, record, index) => {
          return Number(text).toLocaleString('de-DE') + ' VND';
        },
      },
    },
    {
      title: 'Đã trả',
      name: 'paidAmount',
      tableItem: {
        align: 'right',
        width: 150,
        render: (text, record, index) => {
          return Number(text).toLocaleString('de-DE') + ' VND';
        },
      },
    },
    {
      title: 'Còn lại',
      name: 'balanceAmount',
      tableItem: {
        align: 'right',
        width: 150,
        render: (text, record, index) => {
          return Number(text).toLocaleString('de-DE') + ' VND';
        },
      },
    },
    {
      title: 'Thanh toán',
      name: 'inputPayment',
      editable: true,
    },
  ];
};
