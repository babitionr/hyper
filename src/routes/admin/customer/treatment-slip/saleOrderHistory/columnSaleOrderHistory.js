import React from 'react';
import moment from 'moment';
import { Tooltip, Popconfirm } from 'antd';
import { formatPrice } from 'utils/func';
import { exportIcons } from 'utils';
import { useAuth } from 'global';

export const ColumnSaleOrderHistory = ({
  setShowModalAddNewSaleOrderHistory,
  setDataSaleOrderHistory,
  deleteHistory,
}) => {
  const { user } = useAuth();
  const permission = user?.featureDtos?.find((i) => i?.code === 'MANAGE_CUSTOMER_TH') ?? {};
  return [
    {
      title: 'Ngày',
      name: 'dateExamination',
      tableItem: {
        render(text) {
          if (!text) return '';
          return moment(text).format('DD/MM/YYYY');
        },
        width: 150,
      },
    },
    {
      title: 'Dịch vụ',
      name: 'services',
      tableItem: {
        width: 200,
      },
    },
    {
      title: 'Thành tiền',
      name: 'totalAmount',
      tableItem: {
        width: 200,
        render: (value, recored) => formatPrice(recored?.totalAmount),
      },
    },
    {
      title: 'Thanh toán',
      name: 'paidAmount',
      tableItem: {
        width: 200,
        render: (value, recored) => formatPrice((recored?.totalAmount ?? 0) - (recored.balanceAmount ?? 0)),
      },
    },
    {
      title: 'Còn lại',
      name: 'balanceAmount',
      tableItem: {
        width: 200,
        render: (value, recored) => formatPrice(recored?.balanceAmount),
      },
    },
    {
      title: 'Nội dung điều trị',
      name: 'content',
      tableItem: {
        width: 400,
        render: (text, data) => (
          <div>
            <Tooltip title={text}>
              <div className=" truncate w-full flex ">
                <p className=" w-96 truncate">{text}</p>
              </div>
            </Tooltip>
          </div>
        ),
      },
    },
    {
      title: 'Thao tác',
      name: 'thaoTac',
      tableItem: {
        width: 100,
        fixed: 'right',
        align: 'center',
        onCell: () => ({ style: { paddingTop: '0.25rem', paddingBottom: 0 } }),
        render: (text, data) => (
          <>
            <>
              <Tooltip title={'Sửa'}>
                <button
                  className="embed mr-2"
                  onClick={() => {
                    if (!data) return false;
                    setShowModalAddNewSaleOrderHistory(true);
                    setDataSaleOrderHistory((prev) => ({ ...prev, data, isView: true }));
                  }}
                >
                  {exportIcons('EDIT')}
                </button>
              </Tooltip>
              {permission?.delete && (
                <Tooltip title={'Xóa'}>
                  <Popconfirm
                    placement="left"
                    title={'Bạn có chắc muốn xóa ?'}
                    icon={<i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />}
                    okText={'Đồng ý'}
                    cancelText={'Huỷ bỏ'}
                    onConfirm={() => deleteHistory(data?.uuid)}
                  >
                    <button className="embed mr-2">{exportIcons('DEL')}</button>
                  </Popconfirm>
                </Tooltip>
              )}
            </>
          </>
        ),
      },
    },
  ];
};
