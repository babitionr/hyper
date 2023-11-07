import React from 'react';
import { Tooltip } from 'antd';
import { exportIcons } from 'utils';
import moment from 'moment';

export const ColumnLateCalendar = ({ handleOpenDetailModal, handleOpenCreateModal }) => {
  return [
    {
      title: 'Mã LH',
      name: 'code',
      tableItem: {
        width: 170,
        render: (text, data, index) => {
          return data?.code ?? '';
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
      title: 'Lịch hẹn gần nhất',
      name: 'eventTime',
      tableItem: {
        width: 170,
        render: (text, data, index) => {
          return data?.calendar?.eventTime ? moment(data?.calendar?.eventTime).format('DD/MM/YYYY HH:mm:ss') : '';
        },
      },
    },
    {
      title: 'Nguyên nhân trễ hẹn',
      name: 'reason',
      tableItem: {
        width: 200,
        render: (text, data, index) => {
          return data?.calendar?.reason ?? '';
        },
      },
    },
    {
      title: 'Trạng thái chăm sóc',
      name: 'status',
      tableItem: {
        width: 180,
        render: (text, record, index) => {
          if (text === 'PENDING') return <div className=" text-rose-500 font-bold">Chưa chăm sóc</div>;
          if (text === 'COMPLETE') return <div className=" text-green-500 font-bold">Đã chăm sóc</div>;
          if (text === 'REDO') return <div className=" text-yellow-500 font-bold">Cần chăm sóc lại</div>;
        },
      },
    },
    {
      title: 'Kênh chăm sóc',
      name: 'chanel',
      tableItem: {
        width: 120,
        render: (text, record, index) => {
          if (text === 'CALL') return <div className=" ">Gọi điện</div>;
          if (text === 'CHAT') return <div className=" ">Chat</div>;
          if (text === 'ZALO') return <div className=" ">Zalo</div>;
          if (text === 'FACEBOOK') return <div className=" ">Facebook</div>;
        },
      },
    },
    {
      title: 'Thời gian chăm sóc',
      name: 'careTime',
      tableItem: {
        width: 150,
        render: (text, data, index) => {
          return data?.eventTime ? moment(data?.eventTime).format('DD/MM/YYYY HH:mm:ss') : '';
        },
      },
    },
    {
      title: 'Nội dung',
      name: 'description',
      tableItem: {
        width: 180,
      },
    },
    {
      title: 'Thao tác',
      name: 'thaoTac',
      tableItem: {
        width: 80,
        align: 'center',
        fixed: 'right',
        onCell: () => ({ style: { paddingTop: '0.25rem', paddingBottom: 0 } }),
        render: (text, data) => (
          <div className="flex justify-center ">
            <div className="w-8">
              <Tooltip title={'Chi tiết chăm sóc'}>
                <button
                  className="embed mr-2 pt-1"
                  onClick={() => {
                    if (!data) return false;
                    handleOpenDetailModal(true, data);
                  }}
                >
                  {exportIcons('EDIT')}
                </button>
              </Tooltip>
            </div>
            <div className="w-8">
              <Tooltip title={data?.uuid ? 'Sửa chăm sóc' : 'Tạo chăm sóc'}>
                <button
                  className="embed mr-2 pt-1"
                  onClick={() => {
                    if (!data) return false;
                    handleOpenCreateModal(true, data);
                  }}
                >
                  {exportIcons('FILE_PLUS')}
                </button>
              </Tooltip>
            </div>
          </div>
        ),
      },
    },
  ];
};
