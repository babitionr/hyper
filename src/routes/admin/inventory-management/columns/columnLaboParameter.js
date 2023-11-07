import React from 'react';

import { Popconfirm, Tooltip } from 'antd';
import { exportIcons } from 'utils';

export const columnLaboParameter = ({ setShowModal, setIdRequest, deleteBranch, type }) => {
  return [
    {
      title: `${
        type === 'MATERIAL'
          ? 'Tên vật liệu Labo'
          : type === 'ENCLOSE'
          ? 'Tên gửi kèm Labo'
          : type === 'BITE'
          ? 'Tên khớp cắn Labo'
          : type === 'LINE'
          ? 'Tên đường hoàn tất Labo'
          : 'Tên kiểu nhịp Labo'
      }`,
      name: 'name',
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
          <>
            <Tooltip title={'Sửa'}>
              <button
                className="embed mr-2"
                onClick={() => {
                  if (!data?.id) return null;
                  setIdRequest(data?.id);
                  setShowModal(true);
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
                onConfirm={() => deleteBranch(data?.id)}
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
