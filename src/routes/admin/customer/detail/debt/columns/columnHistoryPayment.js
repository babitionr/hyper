// import React from "react";
// import { Popconfirm, Tooltip } from "antd";
// import { exportIcons } from "utils";
// import moment from "moment";

import { formatDate, formatPrice } from 'utils/func';

export const ColumnHistoryPayment = () => {
  return [
    {
      title: 'Ngày thu nợ',
      name: 'createdAt',
      tableItem: {
        render: (value) => formatDate(value, 'DD/MM/YYYY'),
      },
    },
    // {
    //   title: 'Mã HĐ',
    //   name: 'createdAt',
    //   tableItem: {
    //     render: (value) =>formatDate(value,'DD/MM/YYYY')

    //   },
    // },
    {
      title: 'Số phiếu',
      name: 'code',
      tableItem: {},
    },
    {
      title: 'Số tiền',
      name: 'totalAmount',
      tableItem: {
        render: (value) => (value ? formatPrice(value) : 0),
      },
    },
    {
      title: 'Phương thức',
      name: 'form',
      tableItem: {
        render: (value) => {
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
      title: 'Nội dung',
      name: 'note',
      tableItem: {},
    },
    // {
    //   title: 'Thao tác',
    //   name: 'thaoTac',
    //   tableItem: {
    //     width: 180,
    //     align: 'center',
    //     onCell: () => ({ style: { paddingTop: '0.25rem', paddingBottom: 0 } }),
    //     render: (text, data) => (
    //       <div className="flex items-center">
    //         <Tooltip title={'In'}>
    //           <button
    //             className="embed mr-2"
    //           // onClick={() => {
    //           //   if (!data) return false;
    //           //   setShowModal(true);
    //           //   setIdRequest(data?.uuid);
    //           // }}
    //           >
    //             {exportIcons('PRINT')}
    //           </button>
    //         </Tooltip>
    //         <Tooltip title={'Xóa'}>
    //           <Popconfirm
    //             placement="left"
    //             title={'Bạn có chắc muốn xóa ?'}
    //             icon={<i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />}
    //             okText={'Đồng ý'}
    //             cancelText={'Huỷ bỏ'}
    //           // onConfirm={() => deleteBranch(data?.uuid)}
    //           >
    //             <button className="embed mr-2">{exportIcons('DEL')}</button>
    //           </Popconfirm>
    //         </Tooltip>
    //       </div>
    //     ),
    //   },
    // },
  ];
};
