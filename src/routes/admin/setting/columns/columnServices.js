import React from 'react';
import EditIcon from 'assets/svg/edit.js';
import RemoveIcon from 'assets/svg/remove.js';
import { Popconfirm, Tooltip } from 'antd';

export const ColumnServices = () => {
  return [
    {
      title: 'Mã DV',
      name: 'maDV',
      tableItem: {
        width: 100,
      },
    },
    {
      title: 'Tên dịch vụ',
      name: 'tenDichVu',
      tableItem: {
        width: 150,
      },
    },
    {
      title: 'Nhóm DV',
      name: 'nhomDV',
      tableItem: {
        width: 150,
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
      title: 'Giá bán',
      name: 'giaBan',
      tableItem: {
        width: 150,
      },
    },
    {
      title: 'Thao tác',
      name: 'thaoTac',
      tableItem: {
        width: 100,
        align: 'center',
        fixed: 'right',
        onCell: () => ({ style: { paddingTop: '0.25rem', paddingBottom: 0 } }),
        render: (text, data) => (
          <>
            <Tooltip title={'Sửa'}>
              <button className="embed border border-gray-300 text-xs rounded-lg mr-2">
                <EditIcon />
              </button>
            </Tooltip>
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
