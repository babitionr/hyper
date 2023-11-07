import React from 'react';
// import EditIcon from 'assets/svg/edit.js';
// import RemoveIcon from 'assets/svg/remove.js';
import { Popconfirm, Tooltip } from 'antd';
import { exportIcons } from 'utils';
import moment from 'moment';
// import { BranchsService } from 'services/branchs';

export const columnPromotion = ({ setShowModal, deletePromotion, activePromotion }) => {
  return [
    {
      title: 'Mã KM',
      name: 'code',
      tableItem: {
        width: 200,
      },
    },
    {
      title: 'Mô tả',
      name: 'description',
      tableItem: {
        width: 300,
      },
    },
    {
      title: 'Giá trị',
      name: 'totalAmount',
      tableItem: {
        width: 150,
        render: (text, data) => (
          <div className="">
            {Number(data?.totalAmount).toLocaleString('de-DE')}
            {data?.promotionType === 'PERCENT' ? '%' : ' VND'}
          </div>
        ),
      },
    },
    {
      title: 'Số lượng',
      name: 'quantity',
      tableItem: {
        width: 150,
      },
    },
    {
      title: 'Hình thức',
      name: 'promotionType',
      tableItem: {
        width: 200,
        render: (text, data) => <div className="">{data?.promotionType === 'PERCENT' ? '%' : 'Tiền mặt'}</div>,
      },
    },
    {
      title: 'Ngày bắt đầu',
      name: 'fromDate',
      tableItem: {
        width: 200,
        render: (text, data) => <div className="">{moment(data?.fromDate).format('DD/MM/YYYY')}</div>,
      },
    },
    {
      title: 'Ngày kết thúc',
      name: 'toDate',
      tableItem: {
        width: 200,
        render: (text, data) => <div className="">{moment(data?.toDate).format('DD/MM/YYYY')}</div>,
      },
    },
    {
      title: 'Trạng thái',
      name: 'isActivated',
      tableItem: {
        width: 300,
        render: (text, data) => <div className="">{data?.isActivated ? 'Hoạt động' : 'Ngưng hoạt động'}</div>,
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
          <div className="flex justify-center pr-6">
            <div className="w-8">
              <Tooltip title={'Xóa'}>
                <Popconfirm
                  placement="left"
                  title={'Bạn có chắc muốn xóa ?'}
                  icon={<i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />}
                  okText={'Đồng ý'}
                  cancelText={'Huỷ bỏ'}
                  onConfirm={() => deletePromotion(data?.uuid)}
                >
                  <button className="embed mr-2 pt-[6px]">{exportIcons('DEL')}</button>
                </Popconfirm>
              </Tooltip>
            </div>
            <div className="w-0">
              <Popconfirm
                placement="left"
                title={
                  data?.isActivated
                    ? 'Bạn có chắc muốn khóa mã khuyến mãi không ?'
                    : 'Bạn có chắc muốn mở khóa mã khuyến mãi không ?'
                }
                icon={<i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />}
                okText={'Đồng ý'}
                onConfirm={() => {
                  activePromotion(data);
                }}
                cancelText={'Huỷ bỏ'}
              >
                <button className="embed">
                  {data?.isActivated ? (
                    <Tooltip title={'Khóa'}>
                      <div className="pt-[2.5px]">{exportIcons('BLOCK')}</div>
                    </Tooltip>
                  ) : (
                    <Tooltip title={'Mở khóa'}>
                      <i className="las la-unlock text-2xl text-yellow-500 -mt-0.5 "></i>
                    </Tooltip>
                  )}
                </button>
              </Popconfirm>
            </div>
          </div>
        ),
      },
    },
  ];
};
