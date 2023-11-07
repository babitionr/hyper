import React from 'react';
// import EditIcon from 'assets/svg/edit.js';
// import RemoveIcon from 'assets/svg/remove.js';
import { Popconfirm, Tooltip } from 'antd';
import { exportIcons } from 'utils';

export const ColumnServices = ({ handleToggleAddNewService, deleteService, activeService }) => {
  return [
    {
      title: 'Mã DV',
      name: 'serviceCode',
      tableItem: {
        width: 100,
      },
    },
    {
      title: 'Tên dịch vụ',
      name: 'name',
      tableItem: {
        width: 150,
      },
    },
    {
      title: 'Nhóm DV',
      name: 'groupServiceName',
      tableItem: {
        width: 150,
      },
    },
    {
      title: 'Đơn vị tính',
      name: 'uomName',
      tableItem: {
        width: 150,
      },
    },
    {
      title: 'Giá bán',
      name: 'price',
      tableItem: {
        width: 150,
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
          <div className="flex justify-center pr-3">
            <div className="w-8">
              <Tooltip title={'Sửa'}>
                <button
                  className="embed mr-2 pt-1"
                  onClick={() => {
                    if (!data) return false;
                    handleToggleAddNewService(data.uuid);
                  }}
                >
                  {exportIcons('EDIT')}
                </button>
              </Tooltip>
            </div>
            <div className="w-8">
              <Tooltip title={'Xóa'}>
                <Popconfirm
                  placement="left"
                  title={'Bạn có chắc muốn xóa ?'}
                  icon={<i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />}
                  okText={'Đồng ý'}
                  cancelText={'Huỷ bỏ'}
                  onConfirm={() => {
                    if (!data) return false;
                    deleteService(data.uuid);
                  }}
                >
                  <button className="embed mr-2 pt-[6px]">{exportIcons('DEL')}</button>
                </Popconfirm>
              </Tooltip>
            </div>
            <div className="w-0">
              <Tooltip title={data?.active ? 'Khóa' : 'Mở khoá'}>
                <Popconfirm
                  placement="left"
                  title={
                    data?.active
                      ? 'Bạn có chắc muốn khóa chi nhánh không ?'
                      : 'Bạn có chắc muốn mở khóa chi nhánh không ?'
                  }
                  icon={<i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />}
                  okText={'Đồng ý'}
                  onConfirm={() => {
                    if (!data) return false;
                    activeService(data);
                  }}
                  cancelText={'Huỷ bỏ'}
                >
                  <button className="embed">
                    {data?.active ? (
                      <div className="pt-[2.5px]">{exportIcons('BLOCK')}</div>
                    ) : (
                      <i className="las la-unlock -mt-[1.5px] text-2xl text-yellow-500 "></i>
                    )}
                  </button>
                </Popconfirm>
              </Tooltip>
            </div>
          </div>
        ),
      },
    },
  ];
};
