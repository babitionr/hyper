import React from 'react';
// import EditIcon from 'assets/svg/edit.js';
// import RemoveIcon from 'assets/svg/remove.js';
import { Popconfirm, Tooltip } from 'antd';
import { exportIcons } from 'utils';

export const columnNotification = ({ setShowModal, handleOpenModal, handleDelete }) => {
  return [
    {
      title: 'Mã',
      name: 'number',
      tableItem: {
        width: '100',
        render: (value, record, index) => record?.users?.number,
      },
    },
    {
      title: 'Họ và tên',
      name: 'name',
      tableItem: {
        render: (value, record, index) => record?.users?.firstName + ' ' + record?.users?.lastName,
      },
    },
    {
      title: 'Tên tài khoản',
      name: 'userName',
      tableItem: {
        render: (value, record, index) => record?.users?.userName,
      },
    },
    {
      title: 'Thông báo',
      name: 'cameraEvent',
      tableItem: {
        render: (value, record, index) => (value ? 'Thông báo nhận diện khách hàng bằng camera.' : null),
      },
    },
    {
      title: 'Thao tác',
      name: 'thaoTac',
      tableItem: {
        width: '180',
        fixed: 'right',
        align: 'center',
        onCell: () => ({ style: { paddingTop: '0.25rem', paddingBottom: 0 } }),
        render: (text, data) => (
          <>
            <Tooltip title={'Sửa'}>
              <button
                className="embed mr-2"
                onClick={() => {
                  if (!data) return false;
                  setShowModal(true);
                  handleOpenModal(data);
                }}
              >
                {exportIcons('EDIT')}
              </button>
            </Tooltip>
            <Tooltip title={'Xóa'}>
              <Popconfirm
                placement="left"
                title={'Bạn có chắc muốn xóa ?'}
                icon={<i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />}
                okText={'Đồng ý'}
                cancelText={'Huỷ bỏ'}
                onConfirm={() => handleDelete(data?.id)}
              >
                <button className="embed mr-2">{exportIcons('DEL')}</button>
              </Popconfirm>
            </Tooltip>
          </>
        ),
      },
    },
  ];
};
