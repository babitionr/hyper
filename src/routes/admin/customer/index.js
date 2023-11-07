import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { HookDataTable } from 'hooks';
import { FilterTable } from './filterTable';
// import classNames from 'classnames';
import CheckboxMenu from './CheckboxMenu';
import AddCustomer from './AddCustomer';
import { CustomerService } from 'services/customer';
import { Export } from './Export';
import Columns from './Columns';
import { routerLinks } from 'utils';
import { useNavigate } from 'react-router';
import { useAuth } from 'global';
import './index.less';
import { CustomerTemplate } from './customerTemplate';

const Page = () => {
  const customerPermisson = JSON.parse(localStorage.getItem('featureDtos'))?.filter((e) => e?.group === 'CUSTOMER')[0];
  const navigate = useNavigate();
  const { branchUuid } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [filterTable, setFilterTable] = useState(false);
  const [filterTableData, setFilterTableData] = useState({});
  const [toggleFilter, setToggleFilter] = useState(false);
  const [columns, setColumns] = useState(
    Columns(
      (param) => handleOpenModal(true, param),
      (param) => handletDelete(param),
    ),
  );

  const titleCsv = columns
    .filter((e) => e.title !== 'Thao tác')
    .map(({ title, name, isShow }) => {
      return { label: title, key: name, isShow };
    });
  const [dataCsv, setDataCsv] = useState([]);
  const handletDelete = async (param) => {
    await CustomerService.delete(param);
    handleChange();
  };
  const getDataTable = async (param) => {
    if (!branchUuid) return;
    const data = await CustomerService.getList({ ...param, ...filterTableData, branchUuid });
    setDataCsv(data?.content);
    console.log(data);
    return {
      data: data?.content ?? [],
      count: data?.totalElements,
    };
  };
  const [handleChange, DataTable] = HookDataTable({
    onRow: (data) => {
      return {
        onDoubleClick: (event) => {
          return navigate(routerLinks('CustomerDetail') + `?id=${data.uuid}&tab=TeethProfile`);
        },
      };
    },
    searchPlaceholder: 'Tìm theo Họ & Tên hoặc điện thoại',
    columns: columns.filter((ele) => ele.isShow),
    Get: getDataTable,
    xScroll: 1000,
    save: false,
    rightHeader: (
      <>
        {/* <button className="bg-red-500 text-white px-4 py-2.5 rounded-xl hover:bg-red-400 inline-flex items-center">
          <i className="las la-plus mr-1" />
          Thêm mới
        </button> */}
        {customerPermisson?.add ? (
          <button
            className="active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-red-500 text-white rounded-lg border border-red-500  items-center !text-base !font-medium px-4 py-2"
            type="button"
            onClick={() => handleOpenModal(true)}
          >
            <i className="las la-plus mr-1" />
            Thêm mới
          </button>
        ) : (
          false
        )}
      </>
    ),
    newRowHeader: filterTable && (
      <div className="mb-4">
        <FilterTable
          filterTableData={filterTableData}
          setFilterTableData={setFilterTableData}
          toggleFilter={toggleFilter}
          setToggleFilter={setToggleFilter}
        />
      </div>
    ),
  });

  const handleImport = async (e) => {
    const file = e.target.files[0];
    const data = await CustomerService.uploadCustomer(file, localStorage.getItem('branchUuid'));
    if (data) {
      handleChange();
    }
  };

  useEffect(() => {
    if (!branchUuid) return;
    handleChange();
  }, [toggleFilter, branchUuid]);
  const [handleOpenModal, AddCustomerModal] = AddCustomer({ handleChange, setShowModal, showModal });

  return (
    <div className="min-h-screen">
      <div className="bg-white rounded-lg">
        <div className="flex justify-between p-3 border-b border-blue-50 ">
          <div className="font-semibold text-lg text-black "> {'Quản lý khách hàng'.toUpperCase()}</div>
          <div className="flex">
            <Button
              onClick={() => {
                setFilterTable(!filterTable);
              }}
              className=" !border-gray-500 border !text-gray-500 !text-base font-medium"
            >
              <span className="icon-filter pr-2 pl-1 "></span>
              Bộ lọc
            </Button>
            <CheckboxMenu columns={columns} setColumns={setColumns} />
            <div className="flex mr-2">
              <input type="file" id="files" className="hidden" onChange={(e) => handleImport(e)} />
              <label htmlFor="files" className="flex">
                <div className="cursor-pointer flex rounded-lg items-center !border-gray-500 border !text-gray-500 !text-base font-medium ">
                  <span className="pb-1 pr-2 pl-2">
                    <svg
                      width="16px"
                      height="15px"
                      viewBox="0 0 17 17"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      fill="#6b7280"
                      stroke="#6b7280"
                    >
                      <path
                        d="M4.359 5.956l-0.718-0.697 4.859-5.005 4.859 5.005-0.718 0.696-3.641-3.75v10.767h-1v-10.767l-3.641 3.751zM16 9.030v6.47c0 0.276-0.224 0.5-0.5 0.5h-14c-0.276 0-0.5-0.224-0.5-0.5v-6.475h-1v6.475c0 0.827 0.673 1.5 1.5 1.5h14c0.827 0 1.5-0.673 1.5-1.5v-6.47h-1z"
                        fill="#000000"
                      />
                    </svg>
                  </span>
                  <span className="pr-2">Nhập file</span>
                </div>
              </label>
            </div>
            <Export data={dataCsv} headers={titleCsv} />
            <CustomerTemplate />
          </div>
        </div>
        <div className="p-2">{DataTable()}</div>
        {AddCustomerModal()}
      </div>
    </div>
  );
};

export default Page;
