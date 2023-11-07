export const ColumnReportAppointmentForSales = () => {
  return [
    {
      title: 'Nhân viên sales',
      name: 'userName',
      tableItem: {
        width: 200,
        // align: 'center',
        render: (value, record, index) => value,
      },
    },
    {
      title: 'Tổng số lịch hẹn',
      name: 'totalSchedule',
      tableItem: {
        width: 150,
        align: 'right',
      },
    },
    {
      title: 'Đã thực hiện',
      name: 'totalCameSchedule',
      tableItem: {
        width: 150,
        align: 'right',
        render: (value, record, index) => value,
      },
    },
    {
      title: 'Chưa thực hiện',
      name: 'totalNotComeSchedule',
      tableItem: {
        width: 150,
        align: 'right',
        render: (value, record, index) => value,
      },
    },
    {
      title: 'Đã hủy',
      name: 'totalCancelSchedule',
      tableItem: {
        width: 150,
        align: 'right',
        render: (value, record, index) => value,
      },
    },
  ];
};
