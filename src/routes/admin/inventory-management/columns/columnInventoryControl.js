import React from 'react';
import { Popconfirm, Tooltip } from 'antd';
import { exportIcons } from 'utils';
import { formatDate } from 'utils/func';

export const ColumnInventoryControl = ({ handleEdit, handleDelete }) => {
  return [
    {
      title: 'Số phiếu',
      name: 'code',
      tableItem: {
        width: 150,
      },
    },
    {
      title: 'Ngày kiểm kho',
      name: 'date',

      tableItem: {
        width: 150,
        align: 'center',
        render: (value) => formatDate(value),
      },
    },
    {
      title: 'Trạng thái',
      name: 'status',
      tableItem: {
        width: 150,
        render: (text) => {
          if (text === 'COMPLETED') return <div className="text-sm //font-semibold text-blue-500">Hoàn thành</div>;
          else if (text === 'DRAFT') return <div className="text-sm //font-semibold text-blue-500">Nháp</div>;
          else if (text === 'IN_PROGRESS')
            return <div className="text-sm //font-semibold text-blue-500">Đang xử lý</div>;
        },
      },
    },
    {
      title: 'Thao tác',
      name: 'thaoTac',
      tableItem: {
        width: '10%',
        align: 'center',
        fixed: 'right',
        onCell: () => ({ style: { paddingTop: '0.25rem', paddingBottom: 0 } }),
        render: (text, data) => (
          <div className="flex items-center justify-center gap-2">
            <Tooltip title={'Sửa'}>
              <button
                onClick={() => {
                  handleEdit(data?.uuid);
                }}
                // className="embed border border-gray-300 text-xs rounded-lg mr-2"
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
                onConfirm={() => handleDelete(data?.uuid)}
                cancelText={'Huỷ bỏ'}
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
