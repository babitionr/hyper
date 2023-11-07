import moment from 'moment';

export const ColumnTeethStatusMini = () => {
  return [
    {
      title: 'Ngày tạo',
      name: 'dateOrder',
      tableItem: {
        render(text) {
          if (!text) return '';
          return moment(text).format('DD/MM/YYYY');
        },
        width: 150,
      },
    },
    {
      title: 'Số phiếu',
      name: 'code',
      tableItem: {
        width: 150,
      },
    },
    {
      title: 'Dịch vụ',
      name: 'age',
      tableItem: {
        width: 100,
      },
    },
    {
      title: 'Đơn vị tính',
      name: 'chuanDoan',
      tableItem: {
        width: 200,
      },
    },
    {
      title: 'Bác sĩ',
      name: 'doctorUserName',
      tableItem: {
        width: 400,
      },
    },
    {
      title: 'Số lượng',
      name: 'soLuong',
      tableItem: {
        width: 400,
      },
    },
  ];
};
