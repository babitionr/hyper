// import React from 'react';

export const ColumnServiceHistory = ({ handleOpenDetailModal, handleOpenCreateModal }) => {
  return [
    {
      title: 'Mã khách hàng',
      name: 'code',
      tableItem: {
        width: 150,
        render: (text, data, index) => {
          return data?.customer?.code ?? '';
        },
      },
    },
    {
      title: 'Tên khách hàng',
      name: 'fullName',
      tableItem: {
        width: 150,
        render: (text, data, index) => {
          return data?.customer?.fullName ?? '';
        },
      },
    },
    {
      title: 'Số điện thoại',
      name: 'phoneNumber',
      tableItem: {
        align: 'right',
        width: 120,
        render: (text, data, index) => {
          return data?.customer?.phoneNumber ?? '';
        },
      },
    },
    {
      title: 'Nội dung điều trị',
      name: 'content',
      tableItem: {
        width: 250,
      },
    },
    {
      title: 'Bác sĩ tư vấn',
      name: 'doctorConsultant',
      tableItem: {
        width: 150,
      },
    },
    {
      title: 'Bác sĩ thực hiện',
      name: 'doctorImpl',
      tableItem: {
        width: 150,
      },
    },
    {
      title: 'Doanh thu',
      name: 'totalAmount',
      tableItem: {
        align: 'right',
        width: 150,
        render: (text, data, index) => {
          return Number(data?.totalAmount ?? 0).toLocaleString('de-DE') + ' VND';
        },
      },
    },
    {
      title: 'Thực thu',
      name: 'paidAmount',
      tableItem: {
        align: 'right',
        width: 150,
        render: (text, data, index) => {
          return Number(data?.paidAmount ?? 0).toLocaleString('de-DE') + ' VND';
        },
      },
    },
    {
      title: 'Còn lại',
      name: 'balanceAmount',
      tableItem: {
        align: 'right',
        width: 150,
        render: (text, data, index) => {
          return Number(data?.balanceAmount ?? 0).toLocaleString('de-DE') + ' VND';
        },
      },
    },
    {
      title: 'Hình thức thanh toán',
      name: 'paymentType',
      tableItem: {
        width: 200,
        render: (text, data, index) => {
          switch (text) {
            case 'CASH':
              return 'Tiền mặt';
            case 'BANK':
              return 'Chuyển khoản ngân hàng';
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
      name: 'nhomKhachHang',
      tableItem: {
        width: 200,
        render: (text, data, index) => {
          return '';
        },
      },
    },
    {
      title: 'Nhóm điều trị',
      name: 'nhomDieuTri',
      tableItem: {
        width: 200,
        render: (text, data, index) => {
          return '';
        },
      },
    },
    {
      title: 'Trợ thủ chính',
      name: 'troThuChinh',
      tableItem: {
        width: 200,
        render: (text, data, index) => {
          return '';
        },
      },
    },
    {
      title: 'Trợ thủ vòng ngoài',
      name: 'troThuVongNgoai',
      tableItem: {
        width: 200,
        render: (text, data, index) => {
          return '';
        },
      },
    },
    {
      title: 'Ngày hẹn',
      name: 'ngayHen',
      tableItem: {
        width: 150,
        render: (text, data, index) => {
          return '';
        },
      },
    },
    {
      title: 'Giờ hẹn',
      name: 'gioHen',
      tableItem: {
        width: 150,
        render: (text, data, index) => {
          return '';
        },
      },
    },
  ];
};
