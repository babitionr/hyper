import React from 'react';

export const ColumnMaterialRequirements = () => {
  return [
    {
      title: 'Ngày yêu cầu',
      name: 'number',
      tableItem: {
        width: 150,
      },
    },
    {
      title: 'Ngày xuất',
      name: 'firstName',
      tableItem: {
        width: 150,
        render: (text, data) => {
          return data.lastName + ' ' + text;
        },
      },
    },
    {
      title: 'Phiếu điều trị',
      name: 'userName',
      tableItem: {
        width: 150,
      },
    },
    {
      title: 'Mã yêu cầu',
      name: 'position',
      tableItem: {
        width: 150,
        render: (text) => {
          if (text.code === 'ACCOUNTANT') return <div className="">Kế Toán</div>;
          else if (text.code === 'DOCTOR') return <div>Bác sĩ</div>;
          else if (text.code === 'RECEPTIONIST') return <div>Lễ Tân</div>;
          else if (text.code === 'ORG_ADMIN') return <div>Admin</div>;
        },
      },
    },
    {
      title: 'Người yêu cầu',
      name: 'roles',
      tableItem: {
        width: 150,
        render: (text) => {
          // eslint-disable-next-line no-unused-vars
          let roles = '';
          text.forEach((ele) => {
            if (ele === 'DOCTOR') {
              roles += 'Bác sĩ';
            } else if (ele === 'ACCOUNTANT') {
              roles += 'Kế toán';
            } else if (ele === 'ORG_ADMIN') {
              roles += 'Admin';
            } else if (ele === 'RECEPTIONIST') {
              roles += 'Lễ Tân';
            }
            if (text.length > 1) {
              roles += ',';
            }
          });
          return roles;
        },
      },
    },
    {
      title: 'Bác sĩ',
      name: 'userName',
      tableItem: {
        width: 150,
      },
    },
    {
      title: 'Trạng thái',
      name: 'status',
      tableItem: {
        width: 150,
        render: (text) => {
          if (text === 'WORKING') return <div className="text-sm font-semibold text-green-600">Đang làm việc</div>;
          else return <div className="text-sm font-semibold text-yellow-500">Ngưng làm việc</div>;
        },
      },
    },
  ];
};
