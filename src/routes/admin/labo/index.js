import { DatePicker, Select } from 'antd';
import { HookDataTable } from 'hooks';
import React, { Fragment, useEffect, useState } from 'react';
import { routerLinks } from 'utils';
import { ColumnLaboManagement } from './columns/columnLaboManagement';
import './index.less';
// import { ListLabo } from './components/ListLabo';
import moment from 'moment';
import { useLocation, useNavigate } from 'react-router';
import { createSearchParams } from 'react-router-dom';
import { LaboService } from 'services/labo';
import { SupplierService } from 'services/supplier';
import { AddCostToBeCharged } from './components/AddCostToBeCharged';

const { RangePicker } = DatePicker;
function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  // const searchRef = useRef(null);
  const [data, setData] = useState();
  const [supplier, setSupplier] = useState([]);
  const [filter, setFiler] = useState({});

  const [detailData, setDetailData] = useState({});
  const [showModalAddCost, setShowModalAddCost] = useState(false);
  const handleOpenAddCostToBeChargeModal = (data) => {
    setShowModalAddCost(true);
    setDetailData(data);
  };

  useEffect(() => {
    handleChange();
  }, [pathname, filter]);

  useEffect(() => {
    const getListSupplier = async () => {
      const result = await SupplierService.getAll();
      setSupplier(result.data);
    };
    getListSupplier();
  }, [pathname]);

  const getData = async (params) => {
    const res = await LaboService.getListLabo({ ...params, ...filter });
    setData(res);
    const data =
      res?.content?.map((i) => ({
        ...i,
        supplierName: i?.supplier?.name ?? '',
        customerName: i?.customer?.fullName ?? '',
      })) ?? [];
    return { data, count: res?.total ?? 0 };
  };

  const handleDelete = async (id) => {
    await LaboService.delete(id);
    await handleChange();
  };

  const handleEdit = async (data) => {
    navigate(
      {
        pathname: routerLinks('CustomerDetail'),
        search: createSearchParams({
          id: data?.customer.uuid,
          tab: 'Labo',
          type: 'edit',
          laboId: data?.uuid,
          root: 'laboSidebar',
        }).toString(),
      },
      { state: data },
    );
  };
  const formatNumber = (number) => new Intl.NumberFormat().format(number);

  const handleViewOnly = async (data, viewOnly = false) => {
    navigate(
      {
        pathname: routerLinks('CustomerDetail'),
        search: createSearchParams({
          id: data?.customer.uuid,
          tab: 'Labo',
          type: 'edit',
          laboId: data?.uuid,
          root: 'laboSidebar',
          display: 'viewOnly',
        }).toString(),
      },
      { state: { ...data, viewOnly } },
    );
  };

  const [handleChange, DataTable] = HookDataTable({
    className: 'labo-table data-table',
    onRow: (data) => ({
      onDoubleClick: (event) => {
        handleViewOnly(data, true);
      },
    }),
    showSearch: true,
    fullTextSearch: 'search',
    save: false,
    xScroll: 1600,
    isLoading,
    setIsLoading,
    Get: getData,
    loadFirst: false,
    columns: ColumnLaboManagement({ handleDelete, handleEdit, handleOpenAddCostToBeChargeModal }),
    // expandable: {
    //   expandedRowRender: (record) => (
    //     <div className="pl-[50px] w-full">
    //       <ListLabo record={record}></ListLabo>
    //     </div>
    //   ),
    //   rowExpandable: (record) => record.uuid !== 'Not Expandable',
    // },
    rightHeader: (
      <div className="w-full flex justify-end gap-4 flex-col xl:flex-row">
        <Select
          allowClear
          className="w-full sm:w-[300px]"
          showSearch
          optionFilterProp="children"
          placeholder="Nhà cung cấp"
          onChange={(v) => {
            setFiler({ ...filter, supplier: v });
          }}
          // onSearch={onSearch}
          filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
          options={supplier.map((i) => ({ label: i.name, value: i.uuid }))}
        />

        <RangePicker
          allowClear
          className="w-full sm:w-[300px] h-[42px] !bg-white"
          // defaultValue={moment(new Date()).format('DD/MM/YYYY')}
          onChange={(v) => {
            if (v === null || v === undefined) {
              setFiler({
                ...filter,
                startTime: undefined,
                endTime: undefined,
              });
            } else {
              setFiler({
                ...filter,
                startTime: `${moment(v[0]).format('YYYY-MM-DD HH:mm:ss')}`,
                endTime: `${moment(v[1]).format('YYYY-MM-DD HH:mm:ss')}`,
              });
            }
          }}
          format={'DD/MM/YYYY'}
        />
      </div>
    ),
    subHeader: () => (
      <>
        <div className="w-full flex flex-col items-end">
          <div className="min-w-[420px] my-5">
            <div className="flex items-center justify-between w-full flex-col sm:flex-row">
              <p className="text-[#6B7280] font-medium">Tổng tiền cần thanh toán:</p>
              <p className="text-[#4B5563] font-semibold">{formatNumber(data?.analyze?.totalAmount) || 0} VND</p>
            </div>
            <div className="flex items-center justify-between w-full my-3 flex-col sm:flex-row">
              <p className="text-[#6B7280] font-medium ">Tổng tiền đã trả:</p>
              <p className="text-[#4B5563] font-semibold">{formatNumber(data?.analyze?.paidAmount) || 0} VND</p>
            </div>
            <div className="flex items-center justify-between w-full  flex-col sm:flex-row">
              <p className="text-[#6B7280] font-medium">Tổng số còn lại:</p>
              <p className="text-[#4B5563] font-semibold">{formatNumber(data?.analyze?.remainingAmount) || 0} VND</p>
            </div>
          </div>
        </div>
      </>
    ),
  });

  return (
    <Fragment>
      <div className="min-h-screen">
        <div className="bg-white p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-4">{'Quản lý phiếu Labo'.toUpperCase()}</h2>
          {/* <div className="flex justify-between items-center gap-4">
            <div className="relative h-[42px] w-1/4 ">
              <Input
                ref={searchRef}
                placeholder="Tìm kiếm"
                // onPressEnter={(v) => setFiler({ ...filter, search: v.target.value })}
                onChange={(v) => setFiler({ ...filter, search: searchRef.current?.input?.value })}
                // onChange={}
                className=" relative !bg-white border border-gray-300 h-[42px] w-full  rounded-[10px] px-3 focus:!shadow-none focus:!outline-none"
              />
              <span
                className="absolute right-4 top-2.5"
                onClick={() => {
                  setFiler({ ...filter, search: searchRef.current?.input?.value });
                }}
              >
                {exportIcons('SEARCH')}
              </span>
            </div> */}
          {/* </div> */}

          <>{DataTable()}</>
          <div className="mt-6">
            <button
              className="w-[125px] h-[44px] rounded-lg border border-zinc-400 text-center"
              onClick={() => window.history.back()}
            >
              Trở về
            </button>
          </div>
        </div>
      </div>
      <AddCostToBeCharged
        showModalAddCostToBeCharged={showModalAddCost}
        setShowModalAddCostToBeCharged={setShowModalAddCost}
        detailData={detailData}
      />
    </Fragment>
  );
}

export default Page;
