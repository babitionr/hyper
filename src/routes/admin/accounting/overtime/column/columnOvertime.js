import React from 'react';
import { exportIcons } from 'utils';

export const columnOvertime = (handleOpenModal, currDate) => {
  function getDatesForMonth(string) {
    const [month, year] = string.split('/');
    const currentDate = new Date();
    const daysInMonth = new Date(year, month, 0).getDate();
    const dates = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month - 1, i);
      const dayOfWeek = date.toLocaleDateString('vi-VN', { weekday: 'long' });

      if (date <= currentDate) {
        dates.push({ date: i, dayOfWeek });
      }
    }

    return dates;
  }
  const listDate = getDatesForMonth(currDate.format('MM/YYYY'));
  const convertToColumn = listDate.map((e) => ({
    title: e.date + '\n' + e.dayOfWeek,
    name: 'date',
    tableItem: {
      className: 'text-center whitespace-pre-line',
      width: 100,
      align: 'center',
      onCell: () => ({ style: { paddingTop: '0.25rem', paddingBottom: 0 } }),
      render: (text, data) => (
        <>
          <button onClick={() => handleOpenModal && handleOpenModal(data)}>{exportIcons('EDIT')}</button>
        </>
      ),
    },
  }));

  return [
    {
      title: 'Tên nhân viên',
      name: 'name',
      tableItem: {
        width: 150,
        fixed: 'left',
      },
    },
    {
      title: 'Chức vụ',
      name: 'role',
      tableItem: {
        width: 100,
        fixed: 'left',
      },
    },
    ...convertToColumn,
  ];
};
