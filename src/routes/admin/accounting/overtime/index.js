import React, { useEffect, useState } from 'react';
import { HookDataTable } from 'hooks';
import { columnOvertime } from './column/columnOvertime';
import { AddUser } from '../attendance/AddUser';
import { DatePicker } from 'antd';
import { BranchsService } from 'services/branchs';
import './index.less';
import moment from 'moment/moment';

const Page = () => {
  const [filterStatus] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [listBranch, setlistBranch] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [columns, setColumns] = useState(columnOvertime((params) => handleOpenModal(true, params), moment()));

  const getListBranch = async () => {
    const res = await BranchsService.get();
    setlistBranch(res.data);
  };

  const onChangeFilterMonth = (date, dateString) => {
    console.log(date, dateString);
    setColumns(columnOvertime((params) => handleOpenModal(true, params), moment(new Date(date), 'MM/YYYY')));
  };

  const [handleChange, DataTable] = HookDataTable({
    xScroll: 1000,
    yScroll: true,
    className: 'accounting-attenance-table',
    Get: () => ({
      data: Array.from(Array(10).keys()).map((ele) => ({
        name: 'Nguyen Van A',
        role: 'Nhân viên',
      })),
      count: 10,
    }),
    save: false,
    columns,
    loadFirst: false,
    rightHeader: (
      <div className="flex gap-3">
        <DatePicker
          placeholder="MM/YYYY"
          format={'MM/YYYY'}
          className="!w-32 border rounded-lg !bg-white  border-gray-200"
          dropdownClassName="custom-month-picket-accoutning-attentance"
          onChange={onChangeFilterMonth}
          picker="month"
          defaultValue={moment()}
          disabledDate={(current) => {
            return current && current > moment().endOf('day');
          }}
        />
        <button
          className="active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-red-500 text-white rounded-lg border border-red-500  items-center !text-base !font-medium px-4 py-2"
          type="button"
        >
          <i className="las la-plus mr-1" />
          Chấm công
        </button>
      </div>
    ),
  });
  useEffect(() => {
    getListBranch();
  }, []);

  useEffect(() => {
    handleChange();
  }, [filterStatus]);
  const [handleOpenModal, AddUserModal] = AddUser({ handleChange, showModal, setShowModal, listBranch });

  return (
    <div className="min-h-screen">
      <div className="bg-white rounded-lg ">
        <div className="flex justify-between p-3 border-b border-blue-50 pb-4 ">
          <div className="font-semibold text-lg text-black ">LÀM THÊM GIỜ</div>
        </div>
        <div className="p-2">{DataTable()}</div>
        {AddUserModal()}
      </div>
    </div>
  );
};

export default Page;
