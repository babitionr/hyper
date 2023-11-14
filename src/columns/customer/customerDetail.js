import React from 'react';
import moment from 'moment';
import { Popconfirm, Tooltip } from 'antd';
import { useAuth } from 'global';
import { exportIcons } from 'utils';
import './index.less';

const Column = ({ setDataSaleOrderHistory, setShowModalAddNewSaleOrderHistory, deleteSaleOrderHistory }) => {
  const { user } = useAuth();
  const permission = user?.featureDtos?.find((i) => i?.code === 'MANAGE_CUSTOMER_TH') ?? {};
  return [
    {
      title: 'Ngày',
      name: 'dateExamination',
      tableItem: {
        width: 150,
        render: (text, data) => <span>{moment(data.dateExamination).format('DD/MM/YYYY ')}</span>,
      },
    },
    {
      title: 'Dịch vụ',
      name: 'services',
      tableItem: {
        width: 200,
      },
    },
    // {
    //   title: 'Phiếu điều trị',
    //   name: 'treatmentSlip',
    //   tableItem: {
    //     render: (text) => <span className="text-blue-500 underline">{text}</span>
    //   },

    // },
    {
      title: 'Thành tiền',
      name: 'totalAmount',
      tableItem: {
        width: 150,
      },
    },
    {
      title: 'Thanh toán',
      name: 'paidAmount',
      tableItem: {
        width: 150,
      },
    },
    {
      title: 'Còn lại',
      name: 'balanceAmount',
      tableItem: {
        width: 150,
      },
    },

    {
      title: 'Nội dung điều trị',
      name: 'content',
      tableItem: {
        width: 200,
      },
    },
    {
      title: '',
      name: 'thaoTac',
      tableItem: {
        width: 80,
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
                  <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M14.5799 7.66674C14.1532 6.92674 11.8066 3.21341 7.81988 3.33341C4.13322 3.42674 1.99988 6.66674 1.41988 7.66674C1.36137 7.76809 1.33057 7.88305 1.33057 8.00008C1.33057 8.1171 1.36137 8.23206 1.41988 8.33341C1.83988 9.06008 4.08655 12.6667 8.01322 12.6667H8.17988C11.8666 12.5734 14.0066 9.33341 14.5799 8.33341C14.6384 8.23206 14.6692 8.1171 14.6692 8.00008C14.6692 7.88305 14.6384 7.76809 14.5799 7.66674ZM8.14655 11.3334C5.27322 11.4001 3.39988 8.94008 2.81322 8.00008C3.47988 6.92674 5.21988 4.73341 7.88655 4.66674C10.7465 4.59341 12.6265 7.06008 13.2199 8.00008C12.5332 9.07341 10.8132 11.2667 8.14655 11.3334Z"
                      fill="#3B82F6"
                    />
                    <path
                      d="M7.99984 5.6665C7.53835 5.6665 7.08722 5.80335 6.70351 6.05974C6.31979 6.31613 6.02072 6.68055 5.84412 7.10691C5.66751 7.53327 5.62131 8.00243 5.71134 8.45505C5.80137 8.90767 6.0236 9.32343 6.34992 9.64975C6.67625 9.97608 7.09201 10.1983 7.54463 10.2883C7.99725 10.3784 8.46641 10.3322 8.89277 10.1556C9.31913 9.97895 9.68354 9.67988 9.93993 9.29617C10.1963 8.91245 10.3332 8.46133 10.3332 7.99984C10.3332 7.381 10.0873 6.78751 9.64975 6.34992C9.21217 5.91234 8.61868 5.6665 7.99984 5.6665ZM7.99984 8.99984C7.80206 8.99984 7.60872 8.94119 7.44427 8.83131C7.27982 8.72143 7.15165 8.56525 7.07596 8.38252C7.00027 8.19979 6.98047 7.99873 7.01905 7.80475C7.05764 7.61077 7.15288 7.43258 7.29273 7.29273C7.43258 7.15288 7.61077 7.05764 7.80475 7.01905C7.99873 6.98047 8.1998 7.00027 8.38252 7.07596C8.56525 7.15165 8.72143 7.27982 8.83131 7.44427C8.94119 7.60872 8.99984 7.80206 8.99984 7.99984C8.99984 8.26505 8.89448 8.51941 8.70695 8.70694C8.51941 8.89448 8.26506 8.99984 7.99984 8.99984Z"
                      fill="#3B82F6"
                    />
                  </svg>
                </button>
              </Tooltip>
              {permission?.delete && (
                <Tooltip title={'Xóa'}>
                  <Popconfirm
                    placement="left"
                    title={'Bạn có chắc muốn xóa ?'}
                    icon={
                      <i className="mr-2 las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />
                    }
                    okText={'Đồng ý'}
                    cancelText={'Huỷ bỏ'}
                    className="w-30"
                    onConfirm={() => deleteSaleOrderHistory(data?.uuid)}
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
export default Column;
