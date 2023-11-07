import React, { useEffect, useState } from 'react';
import { HookDataTable } from 'hooks';
import { ColumnImportStock } from '../../columns/columnImportStock';
import { Select, DatePicker } from 'antd';
import { ImportStockMini } from './importStockMini';
import { WarehousingBill } from 'services/warehousing-bill';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { routerLinks } from 'utils';
import moment from 'moment';

export const ImportStock = () => {
  const navigate = useNavigate();
  const { Option } = Select;
  const { RangePicker } = DatePicker;
  const branchUuid = localStorage.getItem('branchUuid');

  const [statusFilter, setStatusFilter] = useState();
  const [dateFilter, setDateFilter] = useState({ fromDate: '', toDate: '' });
  const getData = async (params) => {
    const data = await WarehousingBill.getList({
      ...params,
      billType: 'IMPORT',
      branchUuid,
      status: statusFilter,
      fromDate: dateFilter?.fromDate,
      toDate: dateFilter?.toDate,
    });
    return { data: data.content, count: data.totalElements };
  };

  const handleEdit = async (data) => {
    navigate({
      pathname: routerLinks('ImportInventoryManagementAddNew'),
      search: createSearchParams({
        uuid: data?.uuid,
        status: data?.status,
      }).toString(),
    });
  };

  const handleDelete = async (uuid) => {
    await WarehousingBill.delete(uuid);
    handleChange();
  };

  const [handleChange, DataTable] = HookDataTable({
    onRow: (data) => {
      return {
        onDoubleClick: (event) => {
          if (!data) return false;
          handleEdit(data);
        },
      };
    },
    Get: getData,
    columns: ColumnImportStock({ handleEdit, handleDelete }),
    loadFirst: false,
    save: false,
    expandable: {
      expandedRowRender: (record) => (
        <div className="pl-4">
          <ImportStockMini record={record}></ImportStockMini>
        </div>
      ),
    },
    rightHeader: (
      <div className="ml-2 xl:flex gap-2 2xl:gap-5  ">
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
            if (dates) {
              setDateFilter((prev) => ({
                fromDate: moment(dates[0]).format('YYYY-MM-DD 00:00:00'),
                toDate: moment(dates[1]).format('YYYY-MM-DD 23:59:59'),
              }));
            }
            if (!dates) {
              setDateFilter((prev) => ({
                fromDate: '',
                toDate: '',
              }));
            }
          }}
        />
        <div className="flex gap-2  pt-2 xl:pt-0 2xl:gap-5">
          <Select
            className=" 2xl:w-48 !rounded-lg"
            style={{
              width: 135,
            }}
            placeholder="Trạng thái"
            allowClear
            onChange={(ele) => {
              setStatusFilter(ele);
            }}
          >
            <Option value="DRAFT">Nháp</Option>
            <Option value="COMPLETED">Hoàn thành</Option>
          </Select>
          <button
            className="w-36 active:ring-2 h-10 ring-offset-1 ring-offset-red-300 ring-red-300  bg-red-500 text-white rounded-lg border border-red-500  items-center !text-base !font-medium px-4 py-2"
            type="button"
            onClick={() => {
              navigate(routerLinks('ImportInventoryManagementAddNew'));
            }}
          >
            <i className="las la-plus mr-1" />
            Tạo phiếu
          </button>
        </div>
      </div>
    ),
  });
  useEffect(() => handleChange(), [dateFilter, statusFilter]);
  return (
    <div className="bg-white rounded-lg">
      <div className="p-2">{DataTable()}</div>
      {/* <AddNew/> */}
    </div>
  );
};
