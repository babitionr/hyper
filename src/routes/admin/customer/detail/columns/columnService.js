import React from 'react';
import EditIcon from 'assets/svg/edit.js';
import RemoveIcon from 'assets/svg/remove.js';
import { Popconfirm, Tooltip } from 'antd';

export const ColumnService = ({ handleGetUuidService, toggleDoubleClick, deleteItemServiceList }) => {
  return [
    {
      title: 'Tên dịch vụ',
      name: 'serviceNamne',
      tableItem: {
        width: 150,
      },
    },
    {
      title: 'Răng',
      name: 'saleOrderServiceTeethDtoList',
      tableItem: {
        width: 150,
        render: (text, data) => data.saleOrderServiceTeethDtoList?.map((ele) => ele.teethNumber + ' '),
      },
    },
    {
      title: 'Chuẩn đoán',
      name: 'diagnosisNote',
      tableItem: {
        width: 150,
      },
    },
    {
      title: 'Bác sĩ',
      name: 'doctorUserName',
      tableItem: {
        width: 200,
        render: (text, data) => {
          if (text) {
            return text;
          } else {
            return data?.doctorUserDto?.firstName;
          }
        },
      },
    },
    {
      title: 'Nguời tư vấn',
      name: 'consultantUserName',
      tableItem: {
        width: 150,
        render: (text, data) => {
          return data?.consultantUserDto?.firstName;
        },
      },
    },
    {
      title: 'Số lượng',
      name: 'quantity',
      tableItem: {
        width: 150,
        render: (text, data) => Number(text),
      },
    },
    {
      title: 'Đơn giá',
      name: 'unitPrice',
      tableItem: {
        width: 150,
        render: (text, data) => {
          return text ? Number(text).toLocaleString('de-DE') + ' VND' : '0 VND';
        },
      },
    },
    {
      title: 'Thành tiền',
      name: 'totalPaymentAmount',
      tableItem: {
        width: 150,
        render: (text, data) => (text ? text.toLocaleString('de-DE') + ' VND' : '0 VND'),
      },
    },
    {
      title: 'Giảm giá',
      name: 'promotionAmount',
      tableItem: {
        width: 150,
        render: (text, data) => {
          if (data?.promotionAmount) {
            return text ? text.toLocaleString('de-DE') + ' VND' : '0 VND';
          } else if (data?.promotionDto?.promotionType === 'PERCENT') {
            const value = (Number(data?.totalPaymentAmount) * Number(data?.promotionDto?.amount)) / 100;
            return Number(value).toLocaleString('de-DE') + ' VND';
          } else if (data?.promotionDto?.promotionType === 'CASH') {
            return `${Number(data?.promotionDto?.amount).toLocaleString('de-DE')} VND`;
          }
        },
      },
    },
    {
      title: 'Đã trả',
      name: 'paidAmount',
      tableItem: {
        width: 200,
        render: (text, data) => (text ? text.toLocaleString('de-DE') + ' VND' : '0 VND'),
      },
    },
    {
      title: 'Còn lại',
      name: 'balanceAmount',
      tableItem: {
        width: 150,
        render: (text, data) => (text ? text.toLocaleString('de-DE') + ' VND' : '0 VND'),
      },
    },
    {
      title: 'Tình trạng',
      name: 'status',
      tableItem: {
        fixed: 'right',
        width: 150,
        render: (text, data) => {
          if (text === 'TREATING') {
            return <div className="text-yellow-500 text-sm font-bold">Đang điều trị</div>;
          }
          if (text === 'COMPLETED') {
            return <div className="text-green-500 text-sm font-bold">Hoàn thành</div>;
          } else {
            return 'Ngưng điều trị';
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
        onCell: () => ({ style: { paddingTop: '0rem', paddingBottom: 0 } }),
        render: (text, data) => (
          <div className="flex justify-center">
            <Tooltip title={'Sửa'}>
              <div
                onClick={() => handleGetUuidService && handleGetUuidService(data)}
                className="embed border border-gray-300 text-xs rounded-lg mr-2 w-8 cursor-pointer"
              >
                <EditIcon />
              </div>
            </Tooltip>
            <Tooltip title={'Xóa'}>
              <Popconfirm
                placement="left"
                title={'Bạn có chắc muốn xóa ?'}
                icon={<i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />}
                okText={'Đồng ý'}
                cancelText={'Huỷ bỏ'}
                onConfirm={() => deleteItemServiceList && deleteItemServiceList(data)}
              >
                <button className="embed border border-gray-300 text-xs rounded-lg mr-2">
                  <RemoveIcon />
                </button>
              </Popconfirm>
            </Tooltip>
          </div>
        ),
      },
    },
  ];
};
