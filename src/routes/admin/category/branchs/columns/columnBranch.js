import React from 'react';
// import EditIcon from 'assets/svg/edit.js';
// import RemoveIcon from 'assets/svg/remove.js';
import { Popconfirm, Tooltip } from 'antd';
import { exportIcons } from 'utils';
// import { BranchsService } from 'services/branchs';

export const columnBranch = ({ setShowModal, handleOpenModal, deleteBranch, activeBranch, unClockBranch }) => {
  return [
    {
      title: 'Chi nhánh',
      name: 'branchName',
      tableItem: {
        width: '50%',
      },
    },
    {
      title: 'Thao tác',
      name: 'thaoTac',
      tableItem: {
        width: '50%',
        onCell: () => ({ style: { paddingTop: '0.25rem', paddingBottom: 0 } }),
        render: (text, data) => (
          <div className="flex items-center">
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
                onConfirm={() => deleteBranch(data?.uuid)}
              >
                <button className="embed mr-2">{exportIcons('DEL')}</button>
              </Popconfirm>
            </Tooltip>
            <Tooltip title={'Khóa'}>
              <Popconfirm
                placement="left"
                title={
                  data?.isActive
                    ? 'Bạn có chắc muốn khóa chi nhánh không ?'
                    : 'Bạn có chắc muốn mở khóa chi nhánh không ?'
                }
                icon={<i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />}
                okText={'Đồng ý'}
                onConfirm={() => (data?.isActive ? activeBranch(data?.uuid) : unClockBranch(data?.uuid))}
                cancelText={'Huỷ bỏ'}
              >
                <button className="embed">
                  {data?.isActive ? exportIcons('BLOCK') : <i className="las la-unlock text-2xl text-yellow-500"></i>}
                </button>
              </Popconfirm>
            </Tooltip>
          </div>
        ),
      },
    },
  ];
};
