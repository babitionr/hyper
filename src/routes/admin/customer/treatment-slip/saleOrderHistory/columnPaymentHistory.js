import React from 'react';
import moment from 'moment';
import { Tooltip } from 'antd';
import { formatPrice } from 'utils/func';

export const ColumnPaymentHistory = () => {
  return [
    {
      title: 'Ngày',
      name: 'paymentDate',
      tableItem: {
        render(text) {
          if (!text) return '';
          return moment(text).format('DD/MM/YYYY');
        },
        width: 150,
      },
    },
    {
      title: 'Nội dung',
      name: 'content',
      tableItem: {
        width: 250,
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
      title: 'Hình thức thanh toán',
      name: 'paymentForm',
      tableItem: {
        render(text) {
          if (!text) return '';
          if (text === 'CASH') return 'Tiền mặt';
          if (text === 'BANK') return 'Chuyển khoản ngân hàng';
          if (text === 'POS') return 'POS';
          if (text === 'INS') return 'Trả góp';
        },
        width: 175,
      },
    },
    {
      title: 'Thành tiền',
      name: 'totalAmount',
      tableItem: {
        width: 200,
        render: (value, recored) => `${formatPrice(Number(recored?.totalAmount ?? 0))} VND`,
      },
    },
    {
      title: 'Thanh toán',
      name: 'paidAmount',
      tableItem: {
        width: 200,
        render: (value, recored) => `${formatPrice(Number(recored?.paidAmount ?? 0))} VND`,
      },
    },
    {
      title: 'Còn lại',
      name: 'balanceAmount',
      tableItem: {
        width: 200,
        render: (value, recored) =>
          `${formatPrice(Number(recored?.totalAmount ?? 0) - Number(recored?.paidAmount ?? 0))} VND`,
      },
    },
  ];
};
