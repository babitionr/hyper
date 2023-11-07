import { HookDataTable } from 'hooks';
import React, { useEffect, useState } from 'react';
// import { exportIcons } from 'utils';
import { useAuth } from 'global';
import { useSearchParams } from 'react-router-dom';
import { CustomerCareService } from 'services/customer-care';
import DetailCustomerCare from '../detailCustomerCare';
import CreateCustomerCare from '../createCustomerCare';
import { Select } from 'antd';
import moment from 'moment';
import { ColumnBirthday } from '../columns/columnBirthday';

export const Birthday = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { branchUuid } = useAuth();
  const [searchParams] = useSearchParams();
  const tabName = searchParams?.get('tab') ?? 'remindCalendar';
  const [filter, setFilter] = useState({ status: undefined });

  const [showModal, setShowModal] = useState(false);
  const [showModalCreate, setShowModalCreate] = useState(false);

  const handleChangeTable = (e) => {
    handleChange();
  };

  const [handleOpenDetailModal, AddDetailModal] = DetailCustomerCare({ setShowModal, showModal });
  const [handleOpenCreateModal, AddCreateModal] = CreateCustomerCare({
    setShowModal: setShowModalCreate,
    showModal: showModalCreate,
    handleChange: handleChangeTable,
  });

  const [handleChange, DataTable] = HookDataTable({
    isLoading,
    setIsLoading,
    showSearch: true,
    columns: ColumnBirthday({ handleOpenDetailModal, handleOpenCreateModal }),
    showPagination: false,
    loadFirst: false,
    yScroll: 'max-content',
    rightHeader: (
      <>
        <Select
          allowClear
          showSearch
          className=" w-72 rounded-lg"
          placeholder="Trạng thái"
          // optionFilterProp="children"
          onChange={(e) => setFilter((prev) => ({ ...prev, status: e }))}
          // filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
        >
          <Select.Option value="PENDING">Chưa chăm sóc</Select.Option>
          <Select.Option value="COMPLETED">Đã chăm sóc</Select.Option>
          <Select.Option value="REDO">Cần chăm sóc lại</Select.Option>
        </Select>
      </>
    ),
    Get: async (params) => {
      const res = await CustomerCareService.getBirthdayList(
        { status: filter?.status, month: moment().month() + 1 },
        branchUuid,
      );
      console.log('res: ', res);
      return {
        data: res ?? [],
        count: res?.length ?? 0,
      };
    },
  });

  useEffect(() => {
    if (tabName === 'birthday') {
      handleChange();
      console.log(filter);
    }
  }, [filter, tabName]);

  return (
    <div>
      <div className="">{DataTable()}</div>

      {AddDetailModal()}
      {AddCreateModal()}
    </div>
  );
};
