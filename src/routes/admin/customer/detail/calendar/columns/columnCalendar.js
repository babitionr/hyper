import React from 'react';
import { Popconfirm, Tooltip } from 'antd';
import { exportIcons } from 'utils';
import { formatDate } from 'utils/func';

export const ColumnCalendar = ({ handleEdit, handleChange }) => {
  return [
    {
      title: 'Mã lịch hẹn',
      name: 'number',
      tableItem: {},
    },
    {
      title: 'Ngày hẹn',
      name: 'eventTime',
      tableItem: {
        align: 'center',
        render: (value) => formatDate(value, 'HH:mm DD-MM-YYYY'),
      },
    },
    {
      title: 'Bác sĩ',
      name: 'doctorName',
      tableItem: {},
    },
    {
      title: 'Nội dung',
      name: 'content',
      tableItem: {},
    },
    {
      title: 'Loại khám',
      name: 'customerType',
      tableItem: {
        render: (value) => (value === 'NEW' ? 'Mới' : 'Tái khám'),
      },
    },
    {
      title: 'Trạng thái',
      name: 'status',
      tableItem: {
        render: (value) =>
          value === 'COMING' ? 'Đang đến' : value === 'CAME' ? 'Đã đến' : value === 'CANCLE' ? 'Hủy hẹn' : ' Trễ hẹn',
      },
    },
    {
      title: 'Lý do',
      name: 'reason',
      tableItem: {},
    },
    {
      title: 'Thao tác',
      name: 'thaoTac',
      tableItem: {
        // onCell: () => ({ style: { paddingTop: '0.25rem', paddingBottom: 0 } }),
        render: (text, data) => (
          <div className="flex items-center">
            <Tooltip title={'In'}>
              <button
                className="embed mr-2"
                // onClick={() => {
                //   if (!data) return false;
                //   setShowModal(true);
                //   setIdRequest(data?.uuid);
                // }}
              >
                {exportIcons('PRINT')}
              </button>
            </Tooltip>
            <Tooltip title={'Sửa'}>
              <button
                className="embed mr-2"
                onClick={() => {
                  handleEdit(true, data, handleChange);
                  // if (!data) return false;
                  // setShowModal(true);
                  // setIdRequest(data?.uuid);
                }}
              >
                {exportIcons('EDIT')}
              </button>
            </Tooltip>
            <Tooltip title={'Xóa'}>
              <Popconfirm
                placement="left"
                title={'Bạn có chắc muốn xóa ?'}
                icon={<i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />}
                okText={'Đồng ý'}
                cancelText={'Huỷ bỏ'}
                // onConfirm={() => deleteBranch(data?.uuid)}
              >
                <button className="embed mr-2">{exportIcons('DEL')}</button>
              </Popconfirm>
            </Tooltip>
          </div>
        ),
      },
    },
  ];
};
