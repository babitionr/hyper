import React from 'react';
import { Popconfirm, Tooltip } from 'antd';
import { exportIcons } from 'utils';

export const ColumnOrganizationManagement = (handleOpenModal, handleActiveOrDeactiveOrganization, handleApprove) => {
  return [
    {
      title: 'Tên tổ chức',
      name: 'name',
      tableItem: {
        width: 170,
      },
    },
    {
      title: 'Tên viết tắt',
      name: 'shortName',
      tableItem: {
        width: 120,
      },
    },
    {
      title: 'Mã số thuế',
      name: 'taxCode',
      tableItem: {
        align: 'right',
        width: 120,
      },
    },
    {
      title: 'Email',
      name: 'email',
      tableItem: {
        width: 150,
      },
    },
    {
      title: 'Trạng thái',
      name: 'status',
      tableItem: {
        width: 150,
        render: (text, record, index) => {
          if (text === 'APPROVED') return <div className=" text-green-500 font-bold">Đã phê duyệt</div>;
          if (text === 'PENDING_APPROVAL') return <div className=" text-yellow-500 font-bold">Chờ phê duyệt</div>;
        },
      },
    },
    {
      title: 'Số điện thoại',
      name: 'phone',
      tableItem: {
        align: 'right',
        width: 120,
      },
    },
    {
      title: 'Địa chỉ',
      name: 'address',
      tableItem: {
        width: 200,
        render: (text, record, index) => {
          if (!record?.address) return '';
          return (
            record?.address?.street +
            ', ' +
            record?.address?.mtWard?.name +
            ', ' +
            record?.address?.mtDistrict?.name +
            ', ' +
            record?.address?.mtProvince?.name
          );
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
        onCell: () => ({ style: { paddingTop: '0.25rem', paddingBottom: 0 } }),
        render: (text, data) => (
          <div className="flex justify-center ">
            <div className="w-8">
              <Tooltip title={'Sửa'}>
                <button
                  className="embed mr-2 pt-1"
                  onClick={() => {
                    if (!data) return false;
                    handleOpenModal(data);
                  }}
                >
                  {exportIcons('EDIT')}
                </button>
              </Tooltip>
            </div>
            <div className="w-8 pr-2">
              <Tooltip title={data?.isActive ? 'Khóa' : 'Mở khoá'}>
                <Popconfirm
                  placement="left"
                  title={
                    data?.isActive
                      ? 'Bạn có chắc muốn khóa nhà cung cấp không ?'
                      : 'Bạn có chắc muốn mở khóa nhà cung cấp không ?'
                  }
                  icon={<i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />}
                  okText={'Đồng ý'}
                  cancelText={'Huỷ bỏ'}
                  onConfirm={() => handleActiveOrDeactiveOrganization(data)}
                >
                  <button className="embed">
                    {data?.isActive ? (
                      <div className="pt-[2.5px]">{exportIcons('BLOCK')}</div>
                    ) : (
                      <i className="las la-unlock text-2xl text-yellow-500 -mt-[1px]"></i>
                    )}
                  </button>
                </Popconfirm>
              </Tooltip>
            </div>
            <div className="">
              <Tooltip title={'Phê duyệt'}>
                <button
                  className="embed pt-[5px]"
                  onClick={() => {
                    if (!data) return false;
                    handleApprove(data);
                  }}
                >
                  {exportIcons('REQUEST_APPROVE')}
                </button>
              </Tooltip>
            </div>
          </div>
        ),
      },
    },
  ];
};
