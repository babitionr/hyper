import React from 'react';
// import EditIcon from 'assets/svg/edit.js';
// import RemoveIcon from 'assets/svg/remove.js';
import { Popconfirm, Tooltip } from 'antd';
import { exportIcons } from 'utils';
// import { BranchsService } from 'services/branchs';

export const columnSupplier = ({ setShowModal, handleOpenModal, deleteSupplier, activeSupplier }) => {
  return [
    {
      title: 'Mã NCC',
      name: 'supplierNo',
      tableItem: {
        width: 200,
      },
    },
    {
      title: 'Tên NCC',
      name: 'name',
      tableItem: {
        width: 400,
      },
    },
    {
      title: 'Điện thoại',
      name: 'phoneNumber',
      tableItem: {
        width: 150,
      },
    },
    {
      title: 'Công nợ NCC',
      name: 'debt',
      tableItem: {
        width: 300,
      },
    },
    {
      title: 'Thao tác',
      name: 'thaoTac',
      tableItem: {
        width: 500,
        align: 'center',
        onCell: () => ({ style: { paddingTop: '0.25rem', paddingBottom: 0 } }),
        render: (text, data) => (
          <div className="flex justify-center pr-3">
            <div className="w-8">
              <Tooltip title={'Sửa'}>
                <button
                  className="embed mr-2 pt-1"
                  onClick={() => {
                    if (!data) return false;
                    setShowModal(true);
                    handleOpenModal(data);
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
                  onConfirm={() => deleteSupplier(data?.uuid)}
                >
                  <button className="embed mr-2 pt-[6px]">{exportIcons('DEL')}</button>
                </Popconfirm>
              </Tooltip>
            </div>
            <div className="w-0">
              <Tooltip title={data?.isActive ? 'Khóa' : 'Mở khóa'}>
                <Popconfirm
                  placement="left"
                  title={
                    data?.isActive
                      ? 'Bạn có chắc muốn khóa nhà cung cấp không ?'
                      : 'Bạn có chắc muốn mở khóa nhà cung cấp không ?'
                  }
                  icon={<i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />}
                  okText={'Đồng ý'}
                  onConfirm={() => activeSupplier(data)}
                  cancelText={'Huỷ bỏ'}
                >
                  <button className="embed">
                    {data?.isActive ? (
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
