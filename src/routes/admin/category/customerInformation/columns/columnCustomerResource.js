import React from 'react';
import EditIcon from 'assets/svg/edit.js';
import RemoveIcon from 'assets/svg/remove.js';
import { Popconfirm, Tooltip } from 'antd';

export const ColumnCustomerResource = ({ handleOpenModal, handleDelete }) => {
  return [
    {
      title: 'Nguồn khách hàng',
      name: 'name',
      tableItem: {
        width: 300,
      },
    },
    {
      title: 'Thao tác',
      name: 'thaoTac',
      tableItem: {
        width: 620,
        align: 'center',
        onCell: () => ({ style: { paddingTop: '0.25rem', paddingBottom: 0 } }),
        render: (text, data) => (
          <>
            <Tooltip title={'Sửa'}>
              <button
                className="embed border border-gray-300 text-xs rounded-lg mr-2"
                onClick={() => {
                  if (!data) return false;
                  handleOpenModal(data);
                }}
              >
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
                onConfirm={() => handleDelete(data?.uuid)}
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
