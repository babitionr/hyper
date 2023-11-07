import React from 'react';
import { Popconfirm, Tooltip } from 'antd';
import { exportIcons, routerLinks } from 'utils';
import { useNavigate } from 'react-router';
import { createSearchParams } from 'react-router-dom';
import { formatDate } from 'utils/func';

export const ColumnLabo = ({ handleDelete }) => {
  const navigate = useNavigate();
  const status = {
    DRAFT: 'Nháp',
    ORDER: 'Đặt hàng',
    RECEIVED: 'Đã nhận',
    EXPORTED: 'Đã xuất',
  };
  const type = {
    NEW: 'Đặt mới',
    WARRANTY: 'Bảo hành',
  };
  return [
    {
      title: 'Phiếu Labo',
      name: 'laboNo',
      tableItem: {},
    },
    {
      title: 'Phiếu điều trị',
      name: 'saleOrderNumber',
      tableItem: {},
    },
    {
      title: 'Loại phục hình',
      name: 'prostheticsType',
      tableItem: {},
    },
    {
      title: 'Số lượng',
      name: 'quantity',
      tableItem: {
        align: 'right',
      },
    },
    {
      title: 'Răng',
      name: 'teeth',
      tableItem: {
        render: (_, record) => <div className="flex items-center gap-3">{record?.teeth.join(', ')}</div>,
      },
    },
    {
      title: 'Ngày xuất',
      name: 'timeExport',
      tableItem: {
        align: 'center',
        render: (value) => formatDate(value),
      },
    },
    {
      title: 'Mã bảo hành',
      name: 'warrantyNo',
      tableItem: {},
    },
    {
      title: 'Hạn bảo hành',
      name: 'warrantyPeriod',
      tableItem: {
        align: 'center',
        render: (value) => formatDate(value),
      },
    },
    {
      title: 'Trạng thái',
      name: 'status',
      tableItem: {
        render: (v) => status[v],
      },
    },
    {
      title: 'Loại phiếu',
      name: 'type',
      tableItem: {
        render: (value) => type[value],
      },
    },
    {
      title: 'Thao tác',
      name: 'action',
      tableItem: {
        fixed: 'right',
        width: 150,
        align: 'center',
        onCell: () => ({ style: { paddingTop: '0.25rem', paddingBottom: 0 } }),
        render: (text, data) => (
          <div className="flex items-center justify-center">
            {/* <Tooltip title={'In'}>
              <button
                className="embed mr-2"
                // onClick={() => {
                //   if (!data) return false;
                //   setShowModal(true);
                //   setIdRequest(data?.uuid);
                // }}
              >
                {exportIcons('PRINT')}
              </button>
            </Tooltip> */}
            <Tooltip title={'Sửa'}>
              <button
                className="embed mr-2"
                // onClick={() => {
                //   if (!data) return false;
                //   setShowModal(true);
                //   setIdRequest(data?.uuid);
                // }}
                onClick={() =>
                  navigate(
                    {
                      pathname: routerLinks('CustomerDetail'),
                      search: createSearchParams({
                        id: data?.customer?.uuid,
                        tab: 'Labo',
                        type: 'edit',
                        laboId: data?.uuid,
                      }).toString(),
                    },
                    { state: data },
                  )
                }
              >
                {exportIcons('PEN')}
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
          </div>
        ),
      },
    },
  ];
};
