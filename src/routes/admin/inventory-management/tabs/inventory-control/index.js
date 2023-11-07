import React, { useEffect, useState } from 'react';
import { HookDataTable } from 'hooks';
import { Select, DatePicker } from 'antd';
import { WarehousingBill } from 'services/warehousing-bill';
import { ColumnInventoryControl } from '../../columns/columnInventoryControl';
import { useNavigate } from 'react-router';
import { routerLinks } from 'utils';
import './index.less';
import moment from 'moment';

export const InventoryControl = () => {
  const { Option } = Select;
  const { RangePicker } = DatePicker;
  const branchUuid = localStorage.getItem('branchUuid');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [statusFilter, setStatusFilter] = useState();
  const [filterDate, setFilterDate] = useState({
    fromDate: '',
    toDate: '',
  });
  const getData = async (params) => {
    const data = await WarehousingBill.getListInventoryControl({
      ...params,
      branchUuid,
      status: statusFilter,
      fromDate: filterDate.fromDate,
      toDate: filterDate.toDate,
    });
    return { data: data?.content, count: data?.totalElements };
  };
  const handleEdit = async (uuid) => {
    if (!uuid) return false;
    return navigate(routerLinks('InventoryControlCreate') + `?uuid=${uuid}`);
  };
  const handleDelete = async (uuid) => {
    if (!uuid) return false;
    const res = await WarehousingBill.deleteInventoryBill(uuid);
    if (res) {
      handleChange();
    }
  };

  const [handleChange, DataTable] = HookDataTable({
    Get: getData,
    columns: ColumnInventoryControl({ handleEdit, handleDelete }),
    loadFirst: false,
    save: false,
    isLoading,
    setIsLoading,
    className: 'head-table data-table',
    rightHeader: (
      <div className="flex gap-5">
        <RangePicker
          clearIcon={
            <div className="mr-[5px]">
              <svg
                viewBox="64 64 896 896"
                focusable="false"
                data-icon="close-circle"
                width="1em"
                height="1em"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"></path>
              </svg>
            </div>
          }
          placeholder={['DD/MM/YYYY', 'DD/MM/YYYY']}
          className="items-stretch border rounded-lg !bg-white border-gray-200 !w-72"
          format="DD/MM/YYYY"
          onChange={(dates, dateStrings) => {
            if (!dates) return false;
            setFilterDate((prev) => ({
              ...prev,
              fromDate: moment(dates[0]).format('YYYY-MM-DD') + ' 00:00:00',
              toDate: moment(dates[1]).format('YYYY-MM-DD') + ' 23:59:59',
            }));
          }}
        />
        <Select
          className="!w-48 !rounded-lg"
          placeholder="Trạng thái"
          allowClear
          onChange={(ele) => {
            setStatusFilter(ele);
          }}
        >
          <Option value="DRAFT">Nháp</Option>
          <Option value="IN_PROGRESS">Đang xử lý</Option>
          <Option value="COMPLETED">Hoàn thành</Option>
        </Select>
        <button
          className="w-36 active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-red-500 text-white rounded-lg border border-red-500  items-center !text-base !font-medium px-4 py-2"
          type="button"
          onClick={() => {
            return navigate(routerLinks('InventoryControlCreate'));
          }}
        >
          <i className="las la-plus mr-1" />
          Tạo phiếu
        </button>
      </div>
    ),
  });
  useEffect(() => {
    handleChange();
  }, [statusFilter, filterDate]);
  return (
    <div className="bg-white rounded-lg">
      <div className="p-2">{DataTable()}</div>
    </div>
  );
};
