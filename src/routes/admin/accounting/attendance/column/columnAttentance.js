import React from 'react';
import { Tooltip } from 'antd';
import { exportIcons } from 'utils';
import moment from 'moment';

export const ColumnAttentance = (handleOpenModal, currDate) => {
  function getDatesForMonth(string) {
    const [month, year] = string.split('/');
    // const currentDate = new Date();
    const daysInMonth = new Date(year, month, 0).getDate();
    const dates = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month - 1, i);
      const dayOfWeek = date.toLocaleDateString('vi-VN', { weekday: 'long' });

      // if (date <= currentDate) {
      dates.push({ date: i, dayOfWeek, dateFull: date });
      // }
    }

    return dates;
  }
  const listDate = getDatesForMonth(currDate.format('MM/YYYY'));

  const convertToColumn = listDate.map((e) => ({
    title: e.dayOfWeek + '\n' + e.date,
    name: 'date',
    tableItem: {
      className: 'text-center whitespace-pre-line',
      width: 80,
      align: 'center',
      onCell: () => ({ style: { paddingTop: '0.25rem', paddingBottom: 0 } }),
      render: (text, record) => {
        if (record.child.length === 0)
          return (
            <>
              <Tooltip title={'Sửa'}>
                <button onClick={() => handleOpenModal && handleOpenModal({ ...record, ...e })}>
                  {exportIcons('EDIT')}
                </button>
              </Tooltip>
            </>
          );
        else {
          const item = record.child.find(
            (i) => moment(i.date).format('DD/MM/YYYY') === moment(e.dateFull).format('DD/MM/YYYY'),
          );
          if (item) {
            switch (item?.workType) {
              case 'FULL_TIME':
                return (
                  <button onClick={() => handleOpenModal && handleOpenModal({ ...record, ...e })}>
                    W {item?.overTime ? '\n' + item.overTimeHour + 'h' : null}
                  </button>
                );
              case 'HALF_TIME':
                return (
                  <button onClick={() => handleOpenModal && handleOpenModal({ ...record, ...e })}>
                    W/2 {item?.overTime ? '\n' + item.overTimeHour + 'h' : null}
                  </button>
                );
              case 'OFF':
                return <button onClick={() => handleOpenModal && handleOpenModal({ ...record, ...e })}>O</button>;

              default:
                break;
            }
          }

          return (
            <>
              <button onClick={() => handleOpenModal && handleOpenModal({ ...record, ...e })}>
                {' '}
                {exportIcons('EDIT')}
              </button>
            </>
          );
        }
      },
    },
  }));

  return [
    {
      title: 'STT',
      name: 'stt',
      tableItem: {
        width: 50,
        fixed: 'left',
        align: 'center',
        render: (value, record, index) => index + 1,
      },
    },
    {
      title: 'Tên nhân viên',
      name: 'name',
      tableItem: {
        width: 180,
        fixed: 'left',
        render: (value, record) => record?.firstName + record?.lastName,
      },
    },
    {
      title: 'Chức vụ',
      name: 'role',
      tableItem: {
        width: 100,
        fixed: 'left',
        render: (value, record) => record?.position?.name,
      },
    },
    ...convertToColumn,
  ];
};
