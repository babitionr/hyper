import React from 'react';
import EditIcon from 'assets/svg/edit.js';
import RemoveIcon from 'assets/svg/remove.js';
import { Popconfirm, Tooltip } from 'antd';
import { formatDate } from 'utils/func';
import { useAuth } from 'global';

export const ColumnTreatmentSlip = (handleToggleAddNew, handleDelete) => {
  const { user } = useAuth();
  const permission = user?.featureDtos?.find((i) => i?.code === 'MANAGE_CUSTOMER_SO') ?? {};
  return [
    {
      title: 'Số phiếu',
      name: 'code',
      tableItem: {
        width: 150,
      },
    },
    {
      title: 'Người tạo',
      name: 'createdUserName',
      tableItem: {
        width: 150,
      },
    },
    {
      title: 'Ngày tạo',
      name: 'dateOrder',
      tableItem: {
        width: 150,
        render: (value) => formatDate(value, 'DD/MM/YYYY HH:mm:ss'),
      },
    },
    {
      title: 'Bác sĩ',
      name: 'doctorUserName',
      tableItem: {
        width: 200,
      },
    },
    {
      title: 'Tổng tiền',
      name: 'totalPaymentAmount',
      tableItem: {
        width: 150,
        render: (text, data) => {
          return text ? text.toLocaleString('de-DE') + ' VND' : 0;
        },
      },
    },
    {
      title: 'Thanh toán',
      name: 'paidAmount',
      tableItem: {
        width: 150,
        render: (text, data) => {
          return text ? text.toLocaleString('de-DE') + ' VND' : 0;
        },
      },
    },
    {
      title: 'Còn lại',
      name: 'balanceAmount',
      tableItem: {
        width: 150,
        render: (text, data) => {
          return text ? text.toLocaleString('de-DE') + ' VND' : 0;
        },
      },
    },
    {
      title: 'Trạng thái',
      name: 'status',
      tableItem: {
        width: 150,
        render: (text, data) => {
          switch (text) {
            case 'TREATING':
              return 'Đang điều trị';
            case 'COMPLETED':
              return 'Đã hoàn thành';
            default:
              return '';
          }
        },
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
          <div className="flex justify-center">
            <Tooltip title={'Sửa'}>
              <button
                onClick={() => {
                  handleToggleAddNew && handleToggleAddNew(data);
                }}
                className="embed border border-gray-300 text-xs rounded-lg mr-2"
              >
                <EditIcon />
              </button>
            </Tooltip>
            {permission?.delete && (
              <Tooltip title={'Xóa'}>
                <Popconfirm
                  placement="left"
                  title={'Bạn có chắc muốn xóa ?'}
                  icon={<i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />}
                  onConfirm={() => handleDelete(data.uuid)}
                  okText={'Đồng ý'}
                  cancelText={'Huỷ bỏ'}
                >
                  <button className="embed border border-gray-300 text-xs rounded-lg mr-2">
                    <RemoveIcon />
                  </button>
                </Popconfirm>
              </Tooltip>
            )}
          </div>
        ),
      },
    },
  ];
};
