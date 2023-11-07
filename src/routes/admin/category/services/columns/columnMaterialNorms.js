import React from 'react';
import RemoveIcon from 'assets/svg/remove.js';
import { Popconfirm, Tooltip } from 'antd';

export const ColumnMaterialNorms = () => {
  return [
    {
      title: 'STT',
      name: 'stt',
      tableItem: {
        width: 100,
      },
    },
    {
      title: 'Tên công đoạn',
      name: 'tenCongDoan',
      tableItem: {
        width: 300,
      },
    },
    {
      title: 'Đơn vị tính',
      name: 'donViTinh',
      tableItem: {
        width: 150,
      },
    },
    {
      title: 'Số lượng tối đa',
      name: 'soLuongToiDa',
      tableItem: {
        width: 200,
      },
    },
    {
      title: 'Thao tác',
      name: 'thaoTac',
      tableItem: {
        width: 200,
        align: 'center',
        fixed: 'right',
        onCell: () => ({ style: { paddingTop: '0.25rem', paddingBottom: 0 } }),
        render: (text, data) => (
          <>
            <Tooltip title={'Xóa'}>
              <Popconfirm
                placement="left"
                title={'Bạn có chắc muốn xóa ?'}
                icon={<i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />}
                okText={'Đồng ý'}
                cancelText={'Huỷ bỏ'}
              >
                <button className="embed border border-gray-300 text-xs rounded-lg mr-2">
                  <RemoveIcon />
                </button>
              </Popconfirm>
            </Tooltip>
          </>
        ),
      },
    },
  ];
};
