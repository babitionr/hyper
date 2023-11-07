import React from 'react';

import { Popconfirm, Tooltip } from 'antd';
import { exportIcons } from 'utils';
import { formatDate, formatPrice } from 'utils/func';

export const columnExpenditure = ({ handleDelete, type, handleEdit }) => {
  return [
    {
      title: 'Mã hóa đơn',
      name: 'billNumber',
      tableItem: {
        width: 145,
      },
    },
    {
      title: 'Khoản chi',
      name: 'note',
      tableItem: {},
    },
    {
      title: 'Nhóm chi phí',
      name: 'groupName',
      tableItem: {},
    },
    {
      title: 'Số tiền đã chi',
      name: 'totalAmount',
      tableItem: {
        align: 'right',
        render: (value) => formatPrice(value),
      },
    },
    {
      title: 'Hình thức',
      name: 'form',
      tableItem: {
        render: (value, record, index) => {
          switch (value) {
            case 'BANK':
              return 'Ngân hàng';
            case 'CASH':
              return 'Tiền mặt';
            case 'POS':
              return 'POS';
            case 'INS':
              return 'Trả góp';
            default:
              return '';
          }
        },
      },
    },
    {
      title: 'Người tạo',
      name: 'createdBy',
      tableItem: {},
    },
    {
      title: 'Ngày tạo',
      name: 'billDate',
      tableItem: {
        align: 'center',
        render: (value) => formatDate(value, 'DD-MM-YYYY HH:mm'),
      },
    },
    {
      title: 'Thao tác',
      name: 'thaoTac',
      tableItem: {
        width: 180,
        fixed: 'right',
        align: 'center',
        onCell: () => ({ style: { paddingTop: '0.25rem', paddingBottom: 0 } }),
        render: (text, data) => (
          <>
            <Tooltip title={'Sửa'}>
              <button
                className="embed mr-2"
                onClick={() => {
                  if (!data?.uuid) return null;
                  handleEdit(type, data?.uuid);
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
                onConfirm={() => handleDelete(data?.uuid)}
              >
                <button className="embed mr-2">{exportIcons('DEL')}</button>
              </Popconfirm>
            </Tooltip>
          </>
        ),
      },
    },
  ];
};
