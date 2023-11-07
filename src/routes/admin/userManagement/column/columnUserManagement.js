import React from 'react';
import EditIcon from 'assets/svg/edit.js';
import RemoveIcon from 'assets/svg/remove.js';
import { Popconfirm, Tooltip } from 'antd';

export const ColumnUserManagement = (handleOpenModal, handleDeleteUser) => {
  const userManagementPermisson = JSON.parse(localStorage.getItem('featureDtos'))?.filter(
    (e) => e.code === 'MANAGE_STAFF',
  )[0];
  return [
    {
      title: 'Mã',
      name: 'number',
      tableItem: {
        width: 150,
      },
    },
    {
      title: 'Họ và tên',
      name: 'firstName',
      tableItem: {
        width: 150,
        render: (text, data) => {
          return data.lastName + ' ' + text;
        },
      },
    },
    {
      title: 'Tên tài khoản',
      name: 'userName',
      tableItem: {
        width: 150,
      },
    },
    {
      title: 'Chức vụ',
      name: 'position',
      tableItem: {
        width: 150,
        render: (text) => {
          return text?.name;
        },
      },
    },
    {
      title: 'Vai trò',
      name: 'roleName',
      tableItem: {
        width: 150,
        render: (text, data) => {
          return text;
        },
      },
    },
    {
      title: 'Trạng thái',
      name: 'status',
      tableItem: {
        width: 150,
        render: (text) => {
          if (text === 'WORKING') return <div className="text-sm font-semibold text-green-600">Đang làm việc</div>;
          else return <div className="text-sm font-semibold text-yellow-500">Ngưng làm việc</div>;
        },
      },
    },
    {
      title: 'Thao tác',
      name: 'thaoTac',
      isShow: !(!userManagementPermisson?.edit && !userManagementPermisson?.delete),
      tableItem: {
        width: 150,
        align: 'center',
        fixed: 'right',
        onCell: () => ({ style: { paddingTop: '0.25rem', paddingBottom: 0 } }),
        render: (text, data) => (
          <>
            {userManagementPermisson?.edit ? (
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
            {userManagementPermisson?.delete ? (
              <Tooltip title={'Xóa'}>
                <Popconfirm
                  placement="left"
                  title={'Bạn có chắc muốn xóa ?'}
                  icon={<i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />}
                  okText={'Đồng ý'}
                  cancelText={'Huỷ bỏ'}
                  onConfirm={() => handleDeleteUser && handleDeleteUser(data?.id)}
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
