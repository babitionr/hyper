import React from 'react';
import { Popconfirm, Tooltip } from 'antd';
import { exportIcons } from 'utils';

export const ColumnListLabo = ({ handleDelete, handleEdit }) => {
  const status = {
    DRAFT: 'Nháp',
    ORDER: 'Đặt hàng',
    RECEIVED: 'Đã nhận',
    EXPORTED: 'Đã xuất',
  };
  return [
    {
      title: 'Số phiếu',
      name: 'laboNo',
      tableItem: {},
    },
    {
      title: 'NCC Labo',
      name: 'supplierName',
      tableItem: {},
    },
    {
      title: 'Ngày gửi',
      name: 'timeSend',
      tableItem: {},
    },
    {
      title: 'Ngày nhận dự kiến',
      name: 'timeReceive',
      tableItem: {},
    },
    {
      title: 'Số lượng',
      name: 'quantity',
      tableItem: {},
    },
    {
      title: 'Thành tiền',
      name: 'total',
      tableItem: {},
    },
    {
      title: 'Loại phiếu',
      name: 'type',
      tableItem: {},
    },
    {
      title: 'Trạng thái',
      name: 'status',
      tableItem: {
        render: (state) => status[state],
      },
    },
    {
      title: 'Thao tác',
      name: 'thaoTac',
      tableItem: {
        align: 'center',
        onCell: () => ({ style: { paddingTop: '0.25rem', paddingBottom: 0 } }),
        render: (text, data) => (
          <div className="flex items-center">
            <Tooltip title={'Sửa'}>
              <button
                className="embed mr-2"
                onClick={() => {
                  if (!data) return false;
                  handleEdit(data);
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
          </div>
        ),
      },
    },
  ];
};
