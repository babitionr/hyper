import React, { useEffect, useState } from 'react';
import { HookDataTable } from 'hooks';
import { ColumnAttentance } from './column/columnAttentance';
import { AddUser } from '../attendance/AddUser';
import { DatePicker, Select } from 'antd';
import './index.less';
import moment from 'moment/moment';
import { AuthSerivce } from 'services/Auth';
import { AttendanceService } from 'services/attendance';
import { Message } from 'components';

const Page = () => {
  const branchUuid = localStorage.getItem('branchUuid');
  const [filterUser, setFilterUser] = useState();
  const [listUser, setListUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const defaultDate = moment(new Date(), 'MM/YYYY');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  // eslint-disable-next-line no-unused-vars
  const [columns, setColumns] = useState(ColumnAttentance((params) => handleOpenModal(true, params), defaultDate));
  const [filterDate, setFilterDate] = useState(defaultDate || new Date());

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onChangeFilterMonth = (date, dateString) => {
    setFilterDate(date);
    setColumns(ColumnAttentance((params) => handleOpenModal(true, params), moment(new Date(date), 'MM/YYYY')));
  };

  const handleFullMonth = async () => {
    if (selectedRowKeys.length === 0) {
      return Message.error({ text: 'Vui lòng chọn nhân viên.' });
    }
    const body = {
      fromDate: moment(filterDate).startOf('months').format('YYYY-MM-DD 00:00:00'),
      toDate: moment(filterDate).endOf('months').format('YYYY-MM-DD 23:59:59'),
      branchUuid,
      userUuids: selectedRowKeys,
    };

    try {
      setIsLoading(true);
      const res = await AttendanceService.monthTimekeeping(body);
      if (res) {
        handleChange();
      }
    } catch (error) {
      console.log('error: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  const [handleChange, DataTable] = HookDataTable({
    keyIndex: 'uuid',
    isLoading,
    setIsLoading,
    xScroll: 1600,
    yScroll: true,
    rowSelection,
    className: 'accounting-attenance-table',
    Get: async (params) => {
      const res = await AuthSerivce.getAllUser({ branchUuid });
      setListUser(res.data);
      const result = await AttendanceService.get({
        branchUuid,
        fromDate: moment(filterDate).startOf('months').format('YYYY-MM-DD 00:00:00'),
        toDate: moment(filterDate).endOf('months').format('YYYY-MM-DD 23:59:59'),
      });
      const dataChamCong =
        result.data?.map((i) => ({ ...i, chamCongUuid: i.uuid })).map(({ uuid, ...rest }) => rest) ?? [];
      const dataUser = res.data?.map((i) => ({ ...i, child: [] })) ?? [];
      for (let i = 0; i < dataUser.length; i++) {
        for (let j = 0; j < dataChamCong.length; j++) {
          if (dataUser[i].id === dataChamCong[j].userId) {
            dataUser[i].child.push(dataChamCong[j]);
          }
        }
      }
      return {
        data: filterUser ? dataUser?.filter((i) => i?.id === filterUser) : dataUser,
        count: res.data?.length ?? 0,
      };
    },
    showSearch: false,
    save: false,
    showPagination: false,
    columns,
    loadFirst: false,
    fullTextSearch: 'search',
    rightHeader: (
      <div className="flex gap-3">
        <DatePicker
          placeholder="MM/YYYY"
          format={'MM/YYYY'}
          allowClear={false}
          className="!w-32 border rounded-lg !bg-white  border-gray-200"
          dropdownClassName="custom-month-picket-accoutning-attentance"
          onChange={onChangeFilterMonth}
          picker="month"
          defaultValue={defaultDate}
          disabledDate={(current) => {
            return current && current > moment().endOf('day');
          }}
        />
        <button
          className="active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-red-500 text-white rounded-lg border border-red-500  items-center !text-base !font-medium px-4 py-2"
          type="button"
          onClick={() => handleFullMonth()}
        >
          Chấm công tháng
        </button>
      </div>
    ),
    leftHeader: (
      <div className="flex gap-3">
        <Select
          className="!w-[220px] !rounded-lg  text-sm font-normal"
          placeholder="Lọc nhân viên"
          allowClear
          showSearch
          optionFilterProp="children"
          onChange={(value) => {
            setFilterUser(value);
          }}
          filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
          options={listUser.map((i) => ({ value: i.id, label: i.firstName + ' ' + i.lastName }))}
        ></Select>
      </div>
    ),
  });

  useEffect(() => {
    handleChange();
  }, [filterDate, filterUser]);

  const [handleOpenModal, AddUserModal] = AddUser({ handleChange, showModal, setShowModal });

  return (
    <div className="min-h-screen">
      <div className="bg-white rounded-lg ">
        <div className="flex justify-between p-3 border-b border-blue-50 pb-4 ">
          <div className="font-semibold text-lg text-black ">{'BẢNG CHẤM CÔNG'.toUpperCase()}</div>
        </div>
        <div className="p-2">{DataTable()}</div>
        {AddUserModal()}
      </div>
    </div>
  );
};

export default Page;
