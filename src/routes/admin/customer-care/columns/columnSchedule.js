import React from 'react';
import { Popconfirm, Tooltip } from 'antd';
import { exportIcons } from 'utils';
import { formatDate } from 'utils/func';
import { useAuth } from 'global';

export const ColumnSchedule = ({ handleEditSchedule, handleChange, handleDeleteSchedule }) => {
  const { user } = useAuth();
  const schedulePermission = user?.featureDtos?.find((i) => i?.code === 'MANAGE_CALENDAR') ?? {};
  return [
    {
      title: 'Thời gian',
      name: 'eventTime',
      tableItem: {
        width: 150,
        align: 'center',
        render: (value) => formatDate(value, 'DD-MM-YYYY - HH:mm '),
      },
    },
    {
      title: 'Loại lịch hẹn',
      name: 'number',
      tableItem: {
        width: 150,
      },
    },
    {
      title: 'Bác sĩ',
      name: 'doctorName',
      tableItem: {
        width: 150,
      },
    },
    {
      title: 'Nội dung',
      name: 'content',
      tableItem: {
        width: 300,
      },
    },
    {
      title: 'Trạng thái',
      name: 'status',
      width: 100,
      tableItem: {
        render: (value) =>
          value === 'COMING' ? 'Đang đến' : value === 'CAME' ? 'Đã đến' : value === 'CANCLE' ? 'Hủy hẹn' : ' Trễ hẹn',
      },
    },
    {
      title: 'Thao tác',
      name: 'thaoTac',
      tableItem: {
        // onCell: () => ({ style: { paddingTop: '0.25rem', paddingBottom: 0 } }),
        width: 100,
        render: (text, data) => (
          <div className="flex items-center">
            <Tooltip title={'Sửa'}>
              <button
                className="embed mr-2"
                onClick={() => {
                  handleEditSchedule(true, data);
                }}
              >
                {exportIcons('EDIT')}
              </button>
            </Tooltip>
            {schedulePermission?.delete && (
              <Tooltip title={'Xóa'}>
                <Popconfirm
                  placement="left"
                  title={'Bạn có chắc muốn xóa ?'}
                  icon={<i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />}
                  okText={'Đồng ý'}
                  cancelText={'Huỷ bỏ'}
                  onConfirm={() => handleDeleteSchedule(data)}
                >
                  <button className="embed mr-2">{exportIcons('DEL')}</button>
                </Popconfirm>
              </Tooltip>
            )}
          </div>
        ),
      },
    },
  ];
};
