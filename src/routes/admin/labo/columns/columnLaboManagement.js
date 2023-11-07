import React from 'react';
import { Popconfirm, Tooltip } from 'antd';
import { exportIcons } from 'utils';
import { formatDate, formatPrice } from 'utils/func';

export const ColumnLaboManagement = ({ handleDelete, handleEdit, handleOpenAddCostToBeChargeModal }) => {
  const status = {
    DRAFT: 'Nháp',
    ORDER: 'Đặt hàng',
    RECEIVED: 'Đã nhận',
    EXPORTED: 'Đã xuất',
  };
  const type = {
    NEW: 'Đặt mới',
    WARRANTY: 'Bảo hành',
  };
  // const formatNumber = (number) => new Intl.NumberFormat().format(number);

  return [
    {
      title: 'Số phiếu',
      name: 'laboNo',
      tableItem: {
        width: 150,
      },
    },
    {
      title: 'Khách hàng',
      name: 'customerName',
      tableItem: {
        width: 200,
      },
    },
    {
      title: 'NCC Labo',
      name: 'supplierName',
      tableItem: {
        width: 200,
      },
    },
    {
      title: 'Ngày gửi',
      name: 'timeSend',
      tableItem: {
        width: 200,
        align: 'center',
        render: (value) => formatDate(value, 'DD-MM-YYYY HH:mm:ss'),
      },
    },
    {
      title: 'Ngày nhận dự kiến',
      name: 'timeReceive',
      tableItem: {
        width: 200,
        align: 'center',
        render: (value) => formatDate(value, 'DD-MM-YYYY HH:mm:ss'),
      },
    },
    {
      title: 'Số lượng',
      name: 'quantity',
      tableItem: {
        width: 100,
        align: 'right',
        render: (value) => formatPrice(value),
      },
    },
    {
      title: 'Thành tiền',
      name: 'total',
      tableItem: {
        width: 200,
        align: 'right',
        render: (value) => formatPrice(value),
      },
    },
    {
      title: 'Đã trả',
      name: 'paidAmount',
      tableItem: {
        width: 200,
        align: 'right',
        render: (value) => formatPrice(value),
      },
    },
    {
      title: 'Còn lại',
      name: 'remainingAmount',
      tableItem: {
        width: 200,
        align: 'right',
        render: (value) => formatPrice(value),
      },
    },
    {
      title: 'Loại phiếu',
      name: 'type',
      tableItem: {
        width: 150,
        render: (state) => type[state],
      },
    },
    {
      title: 'Trạng thái',
      name: 'status',
      tableItem: {
        width: 150,
        render: (state) => status[state],
      },
    },
    {
      title: 'Chi phí được tính cho',
      name: 'expenseForType',
      tableItem: {
        width: 170,
        render: (state) => state,
      },
    },
    {
      title: 'Thao tác',
      name: 'thaoTac',
      tableItem: {
        width: 150,
        fixed: 'right',
        align: 'center',
        onCell: () => ({ style: { paddingTop: '0.25rem', paddingBottom: 0 } }),
        render: (text, data) => (
          <div className="flex items-center justify-center">
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

            <Tooltip title={'Thêm chi phí tính vào'}>
              <button
                className="embed mb-0.5 mr-2"
                onClick={() => {
                  if (!data) return false;
                  handleOpenAddCostToBeChargeModal(data);
                }}
              >
                {exportIcons('FILE_PLUS')}
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
