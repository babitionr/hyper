// import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { HookDataTable } from 'hooks';
// import classNames from 'classnames';
// import { routerLinks } from 'utils';
// import { useNavigate } from 'react-router';
import './index.less';
import { OrganizationService } from 'services/organization';
import { ColumnOrganizationManagement } from './columns/columnOrganizationManagement';
import { AddOrganization } from './addOrganization';

const Page = () => {
  // const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  // const [filterTableData, setFilterTableData] = useState({});
  const [columns] = useState(
    ColumnOrganizationManagement(
      (param) => handleOpenModal(true, param),
      (param) => handleActiveOrDeactiveOrganization(param),
      (param) => handleApprove(param),
    ),
  );

  const getDataTable = async (param) => {
    const data = await OrganizationService.getListOrganization({ ...param });
    return {
      data: data?.content ?? [],
      count: data?.totalElements,
    };
  };
  const [handleChange, DataTable] = HookDataTable({
    searchPlaceholder: 'Tìm kiếm',
    columns,
    Get: getDataTable,
    xScroll: 1000,
    save: false,
    rightHeader: (
      <>
        {
          <button
            className="active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-red-500 text-white rounded-lg border border-red-500  items-center !text-base !font-medium px-4 py-2"
            type="button"
            onClick={() => handleOpenModal(true)}
          >
            <i className="las la-plus mr-1" />
            Thêm mới
          </button>
        }
      </>
    ),
  });
  useEffect(() => {
    handleChange();
  }, []);
  const [handleActiveOrDeactiveOrganization, handleOpenModal, handleApprove, AddOrganizationModal] = AddOrganization({
    handleChange,
    setShowModal,
    showModal,
  });

  return (
    <div className="min-h-screen">
      <div className="bg-white rounded-lg">
        <div className="flex justify-between p-3 border-b border-blue-50 ">
          <div className="font-semibold text-lg text-black "> {'Quản lý tổ chức'.toUpperCase()}</div>
          <div className=""></div>
        </div>
        <div className="p-2">{DataTable()}</div>
      </div>
      {AddOrganizationModal()}
    </div>
  );
};

export default Page;
