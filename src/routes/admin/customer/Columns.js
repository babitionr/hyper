import React from 'react';
import EditIcon from 'assets/svg/edit.js';
import RemoveIcon from 'assets/svg/remove.js';
import { Popconfirm, Tooltip } from 'antd';
import moment from 'moment';

const Columns = (handleOpenModal, handletDelete) => {
  const customerPermisson = JSON.parse(localStorage.getItem('featureDtos'))?.filter((e) => e?.group === 'CUSTOMER')[0];
  return [
    {
      title: 'Mã khách hàng',
      name: 'code',
      tableItem: {
        width: 150,
        render: (text, data) => {
          return text;
        },
      },
      isShow: true,
      isShowCheck: true,
    },
    {
      title: 'Họ và tên',
      name: 'fullName',
      tableItem: {
        width: 200,
      },
      render: (text) => <a>{text}</a>,
      isShow: true,
      isShowCheck: false,
    },
    {
      title: 'Người tạo',
      name: 'createdBy',
      tableItem: {
        width: 150,
      },
      render: (text) => <a>{text}</a>,
      isShow: true,
      isShowCheck: true,
    },
    {
      title: 'Điện thoại',
      name: 'phoneNumber',
      tableItem: {
        width: 100,
        align: 'right',
      },
      isShow: true,
      isShowCheck: true,
    },
    {
      title: 'Ngày sinh',
      name: 'dateOfBirth',
      tableItem: {
        align: 'center',
        render(text) {
          if (!text) return '';
          return moment(text).format('DD/MM/YYYY');
        },
        width: 100,
      },
      isShow: true,
      isShowCheck: true,
    },
    {
      title: 'Tuổi',
      name: 'age',
      tableItem: {
        width: 50,
        align: 'right',
        render: (text, record) => <a>{new Date().getFullYear() - moment(record.dateOfBirth).format('YYYY')}</a>,
      },

      isShow: true,
      isShowCheck: true,
    },
    // {
    //   title: 'Ngày hẹn gần nhất',
    //   name: 'appointmentDate',
    //   tableItem: {
    //     width: 150,
    //     align: 'center',
    //     render(text) {
    //       if(!text) return '';
    //       return moment(text).format('DD/MM/YYYY');
    //     },
    //   },
    //   isShow: true,
    //   isShowCheck: true,
    // },
    // {
    //   title: 'Ngày điều trị gần nhất',
    //   name: 'treatmentDate',
    //   tableItem: {
    //     width: 200,
    //     align: 'center',
    //     render(text) {
    //       if(!text) return '';
    //       return moment(text).format('DD/MM/YYYY');
    //     },
    //   },
    //   isShow: true,
    //   isShowCheck: true,
    // },
    {
      title: 'Tình trạng điều trị',
      name: 'treatmentStatus',
      tableItem: {
        width: 150,
        render: (text) => {
          if (text === 'TREATED') return <div>Đã điều trị</div>;
          else if (text === 'TREATING') return <div>Đang điều trị</div>;
          else if (text === 'NOT_TREAT') return <div>Chưa điều trị</div>;
        },
      },
      isShow: true,
      isShowCheck: true,
    },
    {
      title: 'Dự kiến thu',
      name: 'paymentExpectedAmount',
      tableItem: {
        width: 120,
        align: 'right',
        render: (text, data) => {
          return (text ?? '').toLocaleString('en-us');
        },
      },
      isShow: true,
      isShowCheck: true,
    },
    {
      title: 'Công nợ',
      name: 'debtAmount',
      tableItem: {
        width: 120,
        align: 'right',
        render: (text, data) => {
          return text ? text.toLocaleString('de-DE') + ' VND' : 0;
        },
      },
      isShow: true,
      isShowCheck: true,
    },
    // {
    //   title: 'Thẻ thành viên',
    //   name: 'theThanhVien',
    //   tableItem: {
    //     width: 150,
    //   },
    //   isShow: true,
    //   isShowCheck: true,
    // },
    // {
    //   title: 'Nhãn khách hàng',
    //   name: 'customerResource',
    //   tableItem: {
    //     width: 150,
    //   },
    //   isShow: true,
    //   isShowCheck: true,
    // },
    // {
    // title: 'Chi nhánh tạo',
    // name: 'createdAgency',
    // tableItem: {
    //   width: 150,
    // },
    // isShow: true,
    // isShowCheck: true,
    // },
    {
      title: 'Thao tác',
      name: 'action',
      isShow: !(!customerPermisson?.edit && !customerPermisson?.delete),
      tableItem: {
        width: 100,
        fixed: 'right',
        align: 'center',
        onCell: () => ({ style: { paddingTop: '0.25rem', paddingBottom: 0 } }),
        render: (text, data) => (
          <>
            {customerPermisson?.edit ? (
              <Tooltip title={'Sửa'}>
                <button
                  onClick={() => handleOpenModal && handleOpenModal(data)}
                  className="embed border border-gray-300 text-xs rounded-lg mr-2"
                >
                  <EditIcon />
                </button>
              </Tooltip>
            ) : (
              false
            )}
            {customerPermisson?.delete ? (
              <Tooltip title={'Xóa'}>
                <Popconfirm
                  placement="left"
                  title={'Bạn có chắc muốn xóa ?'}
                  icon={<i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />}
                  onConfirm={() => handletDelete(data.uuid)}
                  okText={'Đồng ý'}
                  cancelText={'Huỷ bỏ'}
                >
                  <button className="embed border border-gray-300 text-xs rounded-lg mr-2">
                    <RemoveIcon />
                  </button>
                </Popconfirm>
              </Tooltip>
            ) : (
              false
            )}
          </>
        ),
      },
    },
  ];
};
export default Columns;
