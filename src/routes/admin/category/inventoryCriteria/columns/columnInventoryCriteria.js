import React from 'react';
// import EditIcon from 'assets/svg/edit.js';
// import RemoveIcon from 'assets/svg/remove.js';
import { Popconfirm, Tooltip } from 'antd';
import { exportIcons } from 'utils';
// import { BranchsService } from 'services/branchs';

export const columnInventoryCriteria = ({ setShowModal, handleOpenModal, handleDelete, activeBranch }) => {
  return [
    {
      title: 'Tên tiêu chí kiểm kho',
      name: 'name',
      tableItem: {
        width: '50%',
      },
    },
    {
      title: 'Thao tác',
      name: 'thaoTac',
      tableItem: {
        width: '50%',
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
                onConfirm={() => handleDelete(data?.uuid)}
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
