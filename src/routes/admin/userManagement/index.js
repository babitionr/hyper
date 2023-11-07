import React, { useEffect, useState } from 'react';
import { HookDataTable } from 'hooks';
import { ColumnUserManagement } from './column/columnUserManagement';
import { UserManagementService } from 'services/userManagement';
import { AddUser } from './AddUser';
import { Select } from 'antd';
import { BranchsService } from 'services/branchs';
import './index.less';

const Page = () => {
  const userManagementPermisson = JSON.parse(localStorage.getItem('featureDtos'))?.filter(
    (e) => e.code === 'MANAGE_STAFF',
  )[0];
  const [filterStatus, setFilterStatus] = useState({});
  const handleFilterChange = (value) => {
    setFilterStatus({ working: value });
  };
  const { Option } = Select;
  const [showModal, setShowModal] = useState(false);
  const [listBranch, setlistBranch] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [columns, setColumns] = useState(
    ColumnUserManagement(
      (params) => handleOpenModal(true, params),
      (param) => handleDeleteUser(param),
    ),
  );

  const getListBranch = async () => {
    const res = await BranchsService.getBrandHeader();
    setlistBranch(res?.data);
  };
  const GetUserManagementList = async (params) => {
    const res = await UserManagementService.getList({ ...params, ...filterStatus });
    const returnData = {
      data: res?.data?.content || [],
      count: res?.data?.totalElements,
    };
    return returnData;
  };

  const handleDeleteUser = async (id) => {
    const res = await UserManagementService.delete(id);
    if (res) {
      handleChange();
    }
  };

  const [handleChange, DataTable] = HookDataTable({
    className: 'user-management-table',
    Get: GetUserManagementList,
    save: false,
    columns,
    loadFirst: false,
    fullTextSearch: 'search',
    rightHeader: (
      <div className="flex gap-3">
        <Select onChange={handleFilterChange} className="!w-48 !rounded-lg" placeholder="Trạng thái" allowClear>
          <Option value="WORKING">Đang làm việc</Option>
          <Option value="RETRIED">Ngưng làm việc</Option>
        </Select>
        {userManagementPermisson?.add ? (
          <button
            className="active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-red-500 text-white rounded-lg border border-red-500  items-center !text-base !font-medium px-4 py-2"
            type="button"
            onClick={() => {
              handleOpenModal(true);
            }}
          >
            <i className="las la-plus mr-1" />
            Thêm mới
          </button>
        ) : (
          false
        )}
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
          <div className="font-semibold text-lg text-black ">{'Danh sách người dùng'.toUpperCase()}</div>
        </div>
        <div className="p-2">{DataTable()}</div>
        {AddUserModal()}
      </div>
    </div>
  );
};

export default Page;
