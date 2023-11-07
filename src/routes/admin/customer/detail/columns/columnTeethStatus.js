import React from 'react';
import EditIcon from 'assets/svg/edit.js';
import RemoveIcon from 'assets/svg/remove.js';
import { Popconfirm, Tooltip, Checkbox } from 'antd';
import { formatDate } from 'utils/func';

export const ColumnTeethStatus = ({ editHistory, sendAddDataTreatmentSlip, deleteTeethStatus }) => {
  return [
    {
      title: '',
      name: 'checkBox',
      tableItem: {
        width: 10,
        onCell: () => ({ style: { paddingTop: '0.25rem', paddingBottom: 0 } }),
        render: (text, data) => (
          <>
            <Checkbox
              onChange={(e) => {
                sendAddDataTreatmentSlip(data, e);
              }}
            ></Checkbox>
          </>
        ),
      },
    },
    {
      title: 'Ngày tạo',
      name: 'createdAt',
      tableItem: {
        width: 150,
        render: (value) => formatDate(value, 'DD/MM/YYYY HH:mm:ss'),
      },
    },
    {
      title: 'Người tạo',
      name: 'createdBy',
      tableItem: {
        width: 150,
      },
    },
    {
      title: 'Răng',
      name: 'teethList',
      tableItem: {
        width: 100,
      },
    },
    {
      title: 'Chuẩn đoán',
      name: 'diagnosisList',
      tableItem: {
        width: 200,
      },
    },
    {
      title: 'Dịch vụ',
      name: 'serviceList',
      tableItem: {
        width: 400,
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
          <>
            <Tooltip title={'Sửa'}>
              <button
                onClick={() => editHistory(data)}
                className="embed border border-gray-300 text-xs rounded-lg mr-2"
              >
                <EditIcon />
              </button>
            </Tooltip>
            <Tooltip title={'Xóa'}>
              <Popconfirm
                placement="left"
                title={'Bạn có chắc muốn xóa ?'}
                icon={<i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />}
                okText={'Đồng ý'}
                cancelText={'Huỷ bỏ'}
                onConfirm={() => {
                  deleteTeethStatus(data);
                }}
              >
                <button className="embed border border-gray-300 text-xs rounded-lg mr-2">
                  <RemoveIcon />
                </button>
              </Popconfirm>
            </Tooltip>
          </>
        ),
      },
    },
  ];
};
