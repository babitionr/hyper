import React, { useEffect, useState } from 'react';
import { Table, Select, DatePicker } from 'antd';
import '../../index.less';
import { WarehousingBill } from 'services/warehousing-bill';
import { CheckboxMenu } from './checkboxMenu';
import './index.less';
import { Export } from './export';
import { Pagination } from 'components';
// import moment from 'moment';
import dayjs from 'dayjs';

const { Column, ColumnGroup } = Table;

const ExportImportExist = ({ type }) => {
  const [data, setData] = useState([]);
  const branchUuid = localStorage.getItem('branchUuid');

  const [dateFilter, setDateFilter] = useState({
    fromDate: '2022-02-21 00:00:00',
    toDate: dayjs().format('YYYY-MM-DD 23:59:59'),
  });
  const [reportProductType, setReportProductType] = useState('ALL');
  const [dataExport, setDataExport] = useState([]);
  const [temptData, setTemptData] = useState([]);
  const [paramsTable, setParamsTable] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const calData = (res) => {
    if (res.length) {
      let totalBeginQuantity = 0;
      let totalBeginAmount = 0;
      let totalEndQuantity = 0;
      let totalEndAmount = 0;
      let totalExportQuantity = 0;
      let totalExportAmount = 0;
      let totalImportQuantity = 0;
      let totalImportAmount = 0;

      const { pageIndex, pageSize } = paramsTable;
      const temptData = res.slice((pageIndex - 1) * pageSize, (pageIndex - 1) * pageSize + pageSize);
      temptData.forEach((element) => {
        totalBeginQuantity += element.beginQuantity;
        totalBeginAmount += element.beginAmount;
        totalEndQuantity += element.endQuantity;
        totalEndAmount += element.endAmount;
        totalExportQuantity += element.exportQuantity;
        totalExportAmount += element.exportAmount;
        totalImportQuantity += element.importQuantity;
        totalImportAmount += element.importAmount;
      });
      setTemptData([
        ...temptData,
        {
          productName: 'Tổng',
          beginQuantity: totalBeginQuantity,
          beginAmount: totalBeginAmount,
          endQuantity: totalEndQuantity,
          endAmount: totalEndAmount,
          exportQuantity: totalExportQuantity,
          exportAmount: totalExportAmount,
          importQuantity: totalImportQuantity,
          importAmount: totalImportAmount,
        },
      ]);
      setDataExport([
        ...temptData,
        {
          productName: 'Tổng',
          beginQuantity: totalBeginQuantity,
          beginAmount: totalBeginAmount,
          endQuantity: totalEndQuantity,
          endAmount: totalEndAmount,
          exportQuantity: totalExportQuantity,
          exportAmount: totalExportAmount,
          importQuantity: totalImportQuantity,
          importAmount: totalImportAmount,
        },
      ]);
    }
    if (!res.length) {
      setTemptData([]);
      setDataExport([]);
    }
  };
  const handleTableChange = (pagination, filters = {}, sorts, tempFullTextSearch) => {
    const { current, pageSize } = pagination;
    setParamsTable({ pageIndex: current, pageSize: pageSize === 'All' ? data.length : pageSize });
  };
  useEffect(() => {
    calData(data);
  }, [data, paramsTable]);

  const getData = async (params) => {
    const res = await WarehousingBill.getListExportImportExist({
      ...params,
      // branchUuid:"28a175fa-97a6-4996-9d13-5af909bb9a8c",
      branchUuid,
      // fromDate: '2022-02-21 00:00:00',
      // toDate: '2023-02-21 23:59:59',
      fromDate: dateFilter.fromDate,
      toDate: dateFilter.toDate,
      reportProductType,
    });
    setData(res);
  };
  useEffect(() => {
    getData();
  }, [reportProductType, dateFilter]);
  const [dataCheckBox, setDataCheckBox] = useState([
    {
      title: 'Xuất xứ',
      name: 'origin',
      isShow: false,
    },
    {
      title: 'Thời hạn sử dụng',
      name: 'expiredDays',
      isShow: false,
    },
    {
      title: 'Lượng xuất trung bình',
      name: 'averageQuantity',
      isShow: false,
    },
    {
      title: 'Mức tồn tối thiểu',
      name: 'minimumLossAmount',
      isShow: false,
    },
    {
      title: 'Giá vốn hiện tại',
      name: 'costPrice',
      isShow: false,
    },
  ]);
  return (
    <div className="laboParameter" id="laboParameter">
      <div className="xl:flex justify-between pb-2 2xl:gap-3 gap-2">
        <div className="flex 2xl:gap-3 gap-2 pb-2 justify-between">
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <input
                // value={value}
                // onChange={(e) => {
                //   const currValue = e.target.value.toLowerCase();
                //   setValue(currValue);
                //   const filteredData = data.filter((entry) => entry.tenCongDoan.toLowerCase().includes(currValue));
                //   setDataSource(filteredData);
                // }}
                type="search"
                id="default-search"
                className=" w-full 2xl:w-[300px] h-10 p-4 pl-10 focus:outline-none text-sm font-normal text-gray-900 border border-gray-300 rounded-lg "
                placeholder="Tìm kiếm"
                required
              ></input>
            </div>
          </div>
          <div>
            <DatePicker.RangePicker
              allowClear={false}
              className="w-full sm:w-[300px] h-10 !bg-white rounded-lg"
              defaultValue={[dayjs(dateFilter.fromDate), dayjs(dateFilter.toDate)]}
              onChange={(v) => {
                if (v === null || v === undefined) {
                  setDateFilter({
                    ...dateFilter,
                    fromDate: '2022-02-21 00:00:00',
                    toDate: dayjs().format('YYYY-MM-DD 23:59:59'),
                  });
                } else {
                  setDateFilter({
                    ...dateFilter,
                    fromDate: `${dayjs(v[0]).format('YYYY-MM-DD 00:00:00')}`,
                    toDate: `${dayjs(v[1]).format('YYYY-MM-DD 23:59:59')}`,
                  });
                }
              }}
              format={'DD/MM/YYYY'}
            />
          </div>
        </div>
        <div className="flex 2xl:gap-3 gap-2">
          <div className="flex ">
            <Select
              className=" 2xl:w-52 rounded-lg"
              placeholder="Chọn sản phẩm"
              style={{ width: 184 }}
              optionFilterProp="children"
              onChange={(value) => setReportProductType(value)}
              // onSearch={onSearch}
              defaultValue={reportProductType}
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              options={[
                {
                  value: 'ALL',
                  label: 'Tất cả sản phẩm',
                },
                {
                  value: 'ABOVE',
                  label: 'Trên mức tối thiểu',
                },
                {
                  value: 'BELOW',
                  label: 'Dưới mức tối thiểu',
                },
                {
                  value: 'IN_OF_STOCK',
                  label: 'Còn hàng trong kho',
                },
                {
                  value: 'OUT_OF_STOCK',
                  label: 'Hết hàng trong kho',
                },
              ]}
            />
          </div>
          <div className="flex 2xl:gap-1">
            <CheckboxMenu dataCheckBox={dataCheckBox} setDataCheckBox={setDataCheckBox} />
            <Export data={dataExport} dataCheckBox={dataCheckBox} />
          </div>
        </div>
      </div>
      <Table
        className="table-antd"
        dataSource={temptData.map((i, idx) => ({ ...i, key: idx + 1 }))}
        rowClassName={(record) => {
          return 'abc';
        }}
        bordered={true}
        pagination={false}
      >
        <Column title="Tên sản phẩm" dataIndex="productName" key="productName" align="center" />
        {dataCheckBox.filter((e) => e.name === 'origin')[0].isShow && (
          <Column title="Xuất xứ" dataIndex="origin" align="center" />
        )}
        {dataCheckBox.filter((e) => e.name === 'expiredDays')[0].isShow && (
          <Column title="Thời hạn sử dụng" dataIndex="expiredDays" align="center" />
        )}
        {dataCheckBox.filter((e) => e.name === 'averageQuantity')[0].isShow && (
          <Column
            title="Lượng xuất trung bình"
            dataIndex="averageQuantity"
            align="center"
            render={(text, record) => {
              const fromDate = dayjs(dateFilter.fromDate).format('YYYY-MM-DD 23:59:59');
              const toDate = dayjs(dateFilter.toDate).format('YYYY-MM-DD 23:59:59');
              const number = (
                Number(record.exportQuantity) /
                ((dayjs(toDate, 'YYYY-MM-DD hh:mm:ss') - dayjs(fromDate, 'YYYY-MM-DD hh:mm:ss')) / 86400000)
              ).toFixed(2);
              if (record.inventoryUnit === 'Tổng')
                return {
                  children: <div className="font-bold">{number}</div>,
                };
              else
                return {
                  children: <div className="">{number}</div>,
                };
            }}
          />
        )}
        <Column
          title="Đơn vị tính"
          dataIndex="inventoryUnit"
          align="center"
          render={(text, record) => {
            if (record.inventoryUnit === 'Tổng')
              return {
                children: <div className="font-bold">{text}</div>,
              };
            else
              return {
                children: <div className="">{text}</div>,
              };
          }}
        />
        <ColumnGroup title="Tồn đầu kỳ">
          <Column
            className="abc"
            title="Số lượng"
            dataIndex="beginQuantity"
            align="center"
            render={(text, record) => {
              if (record.inventoryUnit === 'Tổng')
                return {
                  children: <div className="font-bold">{text}</div>,
                };
              else
                return {
                  children: <div className="">{text}</div>,
                };
            }}
          />
          <Column
            title="Thành tiền"
            dataIndex="beginAmount"
            align="center"
            render={(text, record) => {
              if (record.inventoryUnit === 'Tổng')
                return {
                  children: <div className="font-bold">{Number(text).toLocaleString('de-DE') + ' VND'}</div>,
                };
              else
                return {
                  children: <div className="">{Number(text).toLocaleString('de-DE') + ' VND'}</div>,
                };
            }}
          />
        </ColumnGroup>
        <ColumnGroup title="Nhập trong kỳ">
          <Column
            title="Số lượng"
            dataIndex="importQuantity"
            align="center"
            render={(text, record) => {
              if (record.inventoryUnit === 'Tổng')
                return {
                  children: <div className="font-bold">{text}</div>,
                };
              else
                return {
                  children: <div className="">{text}</div>,
                };
            }}
          />
          <Column
            title="Thành tiền"
            dataIndex="importAmount"
            align="center"
            render={(text, record) => {
              if (record.inventoryUnit === 'Tổng')
                return {
                  children: <div className="font-bold">{Number(text).toLocaleString('de-DE') + ' VND'}</div>,
                };
              else
                return {
                  children: <div className="">{Number(text).toLocaleString('de-DE') + ' VND'}</div>,
                };
            }}
          />
        </ColumnGroup>
        <ColumnGroup title="Xuất trong kỳ">
          <Column
            title="Số lượng"
            dataIndex="exportQuantity"
            align="center"
            render={(text, record) => {
              if (record.inventoryUnit === 'Tổng')
                return {
                  children: <div className="font-bold">{text}</div>,
                };
              else
                return {
                  children: <div className="">{text}</div>,
                };
            }}
          />
          <Column
            title="Thành tiền"
            dataIndex="exportAmount"
            align="center"
            render={(text, record) => {
              if (record.inventoryUnit === 'Tổng')
                return {
                  children: <div className="font-bold">{Number(text).toLocaleString('de-DE') + ' VND'}</div>,
                };
              else
                return {
                  children: <div className="">{Number(text).toLocaleString('de-DE') + ' VND'}</div>,
                };
            }}
          />
        </ColumnGroup>
        <ColumnGroup title="Tồn cuối kỳ">
          <Column
            title="Số lượng"
            dataIndex="endQuantity"
            align="center"
            render={(text, record) => {
              if (record.inventoryUnit === 'Tổng')
                return {
                  children: <div className="font-bold">{text}</div>,
                };
              else
                return {
                  children: <div className="">{text}</div>,
                };
            }}
          />
          <Column
            title="Thành tiền"
            dataIndex="endAmount"
            align="center"
            render={(text, record) => {
              if (record.inventoryUnit === 'Tổng')
                return {
                  children: <div className="font-bold">{Number(text).toLocaleString('de-DE') + ' VND'}</div>,
                };
              else
                return {
                  children: <div className="">{Number(text).toLocaleString('de-DE') + ' VND'}</div>,
                };
            }}
          />
        </ColumnGroup>
        {dataCheckBox.filter((e) => e.name === 'costPrice')[0].isShow && (
          <Column title="Giá vốn hiện tại" dataIndex="costPrice" align="center" />
        )}
        {dataCheckBox.filter((e) => e.name === 'minimumLossAmount')[0].isShow && (
          <Column title="Mức tồn tối thiểu" dataIndex="minimumLossAmount" align="center" />
        )}
      </Table>
      <Pagination
        total={data.length}
        pageIndex={paramsTable.pageIndex}
        pageSize={paramsTable.pageSize}
        pageSizeOptions={[10, 20, 30, 40, 'All']}
        pageSizeRender={(sizePage) => sizePage + ' / page'}
        pageSizeWidth={'115px'}
        queryParams={(pagination) => handleTableChange(pagination, '', '', '')}
        paginationDescription={(from, to, total) => from + '-' + to + ' of ' + total + ' items'}
        idElement={'table-export-import-exist-paginaiton'}
      />
    </div>
  );
};

export default ExportImportExist;
