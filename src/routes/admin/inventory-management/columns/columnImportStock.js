import React from 'react';
import EditIcon from 'assets/svg/edit.js';
import RemoveIcon from 'assets/svg/remove.js';
import { Popconfirm, Tooltip } from 'antd';
import moment from 'moment';

export const ColumnImportStock = ({ handleEdit, handleDelete }) => {
  return [
    {
      title: 'Số phiếu',
      name: 'billNumber',
      tableItem: {
        width: 150,
      },
    },
    {
      title: 'Người tạo',
      name: 'createdBy',
      tableItem: {
        width: 150,
      },
    },
    {
      title: 'Ngày tạo',
      name: 'createdAt',
      tableItem: {
        width: 150,
        render: (text, data) => <span>{moment(data.createdAt).format('DD/MM/YYYY ')}</span>,
      },
    },
    {
      title: 'Đối tác',
      name: 'partnerName',
      tableItem: {
        width: 150,
        render: (text, data) => {
          return <div className="">{text}</div>;
        },
      },
    },
    {
      title: 'Ngày nhập',
      name: 'inOutDate',
      tableItem: {
        width: 150,
        render: (text, data) => <span>{moment(data.inOutDate).format('DD/MM/YYYY ')}</span>,
      },
    },
    {
      title: 'Thành tiền',
      name: 'totalAmount',
      tableItem: {
        width: 150,
      },
    },
    {
      title: 'Trạng thái',
      name: 'status',
      tableItem: {
        width: 150,
        render: (text) => {
          if (text === 'COMPLETED') return <div className="text-sm //font-semibold //text-green-600">Hoàn thành</div>;
          else if (text === 'DRAFT') return <div className="text-sm //font-semibold //text-yellow-500">Nháp</div>;
        },
      },
    },
    {
      title: 'Thao tác',
      name: 'thaoTac',
      tableItem: {
        width: 150,
        align: 'center',
        fixed: 'right',
        onCell: () => ({ style: { paddingTop: '0.25rem', paddingBottom: 0 } }),
        render: (text, data) => (
          <div className="flex justify-center pb-1 ">
            <Tooltip title={'Sửa'}>
              <button
                onClick={() => {
                  if (!data) return false;
                  handleEdit(data);
                }}
                className="embed border border-gray-300 text-xs rounded-lg mr-2"
              >
                <EditIcon />
              </button>
            </Tooltip>
            {data?.status === 'DRAFT' ? (
              <Tooltip title={'Xóa'}>
                <Popconfirm
                  placement="left"
                  title={'Bạn có chắc muốn xóa ?'}
                  icon={<i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />}
                  okText={'Đồng ý'}
                  cancelText={'Huỷ bỏ'}
                  onConfirm={() => {
                    if (!data) return false;
                    handleDelete(data?.uuid);
                  }}
                >
                  <button className="embed border border-gray-300 text-xs rounded-lg mr-2">
                    <RemoveIcon />
                  </button>
                </Popconfirm>
              </Tooltip>
            ) : (
              <span className="w-10 cursor-default">&nbsp;</span>
            )}
          </div>
        ),
      },
    },
  ];
};
