import React, { useEffect, useState } from 'react';
import { HookDataTable } from 'hooks';
import { columnReportRevenue } from '../columns/columnReportRevenue';
// import { Table } from 'antd';
import { ReportService } from 'services/report';
import { Button, DatePicker, Select } from 'antd';
import { BranchsService } from 'services/branchs';
import moment from 'moment';

function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [listBranch, setListBranch] = useState([]);
  const [columnName, setColumnName] = useState([]);
  const [filterDate, setFilterDate] = useState({
    fromDate: moment().startOf('year').format('YYYY-MM-DD 00:00:01'),
    toDate: moment().endOf('month').format('YYYY-MM-DD 23:59:59'),
  });
  const [filterBranch, setFilterBranch] = useState(localStorage.getItem('branchUuid'));

  const getList = async (params) => {
    const res = await ReportService.getResultBusinessReport({
      startDate: filterDate.fromDate,
      endDate: filterDate.toDate,
    });
    const filterByBranch = res.filter((branch) => {
      if (filterBranch === 'ALL') {
        return branch;
      }
      return branch.branchUuid === filterBranch;
    });
    const name = [
      ...new Set(filterByBranch.flatMap((branch) => branch.businessReportItemDtoList).map((e) => e.month)),
    ].sort((a, b) => moment(a, 'MM/YYYY').diff(moment(b, 'MM/YYYY')));
    console.log(res);
    setColumnName(name);
    const data = [
      { name: 'Tổng thực thu, chi tiết:' },
      { name: 'Phân loại theo hình thức thanh toán' },
      { name: 'Phân loại theo nhóm khách hàng' },
      { name: 'Phân loại theo bác sĩ/ HTĐT' },
      { name: 'Tổng thực chi' },
      { name: 'Lợi nhuận thu chi' },
      { name: 'Kết quả kinh doanh' },
    ];
    const dataList = [];
    name.forEach((e) => {
      const getDataList = filterByBranch
        .flatMap((branch) => branch.businessReportItemDtoList)
        .filter((item) => item.month === e)
        .reduce(
          (a, c) => {
            const listDoctor = Object.values(c.revenueDoctorType.listDoctor).reduce((a, c) => a + (c ?? 0), 0);
            console.log(c);
            Object.entries(c?.revenueDoctorType?.listDoctor).forEach(([key, value]) => {
              a.revenueDoctorType.listDoctor[key] = (a.revenueDoctorType.listDoctor[key] ?? 0) + value ?? 0;
            });
            return {
              month: e,
              advertisingCosts: a.advertisingCosts + c.advertisingCosts,
              equipmentCosts: a.equipmentCosts + c.equipmentCosts,
              houseCosts: a.houseCosts + c.houseCosts,
              implantCost: a.implantCost + c.implantCost,
              labCosts: a.labCosts + c.labCosts,
              laundryCosts: a.laundryCosts + c.laundryCosts,
              machineCosts: a.machineCosts + c.machineCosts,
              marketingCosts: a.marketingCosts + c.marketingCosts,
              materialCosts: a.materialCosts + c.materialCosts,
              mposCosts: a.mposCosts + c.mposCosts,
              otherCost: a.otherCost + c.otherCost,
              recommendCosts: a.recommendCosts + c.recommendCosts,
              salesCosts: a.salesCosts + c.salesCosts,
              staffCosts: a.staffCosts + c.staffCosts,
              revenueCustomerType: {
                newCustomer: a.revenueCustomerType.newCustomer + c.revenueCustomerType.newCustomer,
                oldCustomer: a.revenueCustomerType.oldCustomer + c.revenueCustomerType.oldCustomer,
              },
              revenuePaymentMethod: {
                bank: a.revenuePaymentMethod.bank + c.revenuePaymentMethod.bank,
                cash: a.revenuePaymentMethod.cash + c.revenuePaymentMethod.cash,
                credit: a.revenuePaymentMethod.credit + c.revenuePaymentMethod.credit,
                mpos: a.revenuePaymentMethod.mpos + c.revenuePaymentMethod.mpos,
              },
              revenueDoctor: a.revenueDoctor + listDoctor,
              revenueDoctorType: { listDoctor: a.revenueDoctorType.listDoctor },
            };
          },
          {
            month: e,
            advertisingCosts: 0,
            equipmentCosts: 0,
            houseCosts: 0,
            implantCost: 0,
            labCosts: 0,
            laundryCosts: 0,
            machineCosts: 0,
            marketingCosts: 0,
            materialCosts: 0,
            mposCosts: 0,
            otherCost: 0,
            recommendCosts: 0,
            salesCosts: 0,
            staffCosts: 0,
            revenueCustomerType: { newCustomer: 0, oldCustomer: 0 },
            revenuePaymentMethod: { bank: 0, cash: 0, credit: 0, mpos: 0 },
            revenueDoctor: 0,
            revenueDoctorType: { listDoctor: {} },
          },
        );

      dataList.push(getDataList);
    });

    console.log(dataList);
    // chi tiết Phân loại theo hình thức thanh toán
    const data1Children = [
      { key: 'Thực thu tiền mặt', name: 'Thực thu tiền mặt' },
      { key: 'Thực thu chuyển khoản', name: 'Thực thu chuyển khoản' },
      { key: 'Thực thu POS', name: 'Thực thu POS' },
      { key: 'Thực thu trả góp', name: 'Thực thu trả góp' },
    ];

    // chi tiết Phân loại theo nhóm khách hàng
    const data2Children = [
      { key: 'Thực thu khách hàng mới', name: 'Thực thu khách hàng mới' },
      { key: 'Thực thu khách hàng cũ', name: 'Thực thu khách hàng cũ' },
    ];

    // chi tiết TỔNG THỰC CHI
    const data4Children = [
      { key: 'Chi phí quảng cáo', name: 'Chi phí quảng cáo' },
      { key: 'Chi phí thiết bị', name: 'Chi phí thiết bị' },
      { key: 'Chi phí thuê nhà', name: 'Chi phí thuê nhà' },
      { key: 'Chi phí cắm implant', name: 'Chi phí cắm implant' },
      { key: 'Chi phí lab', name: 'Chi phí lab' },
      { key: 'Chi phí giặt ủi', name: 'Chi phí giặt ủi' },
      { key: 'Chi phí mua máy móc', name: 'Chi phí mua máy móc' },
      { key: 'Chi phí Marketing', name: 'Chi phí Marketing' },
      { key: 'Chi phí vật liệu', name: 'Chi phí vật liệu' },
      { key: 'Chi phí cà thẻ mPOS', name: 'Chi phí cà thẻ mPOS' },
      { key: 'Chi phí khác', name: 'Chi phí khác' },
      { key: 'Chi phí sale', name: 'Chi phí sale' },
      { key: 'Chi phí lương nhân viên', name: 'Chi phí lương nhân viên' },
      { key: 'Chi phí % giới thiệu khách', name: 'Chi phí % giới thiệu khách' },
    ];

    // chi tiết Phân loại theo bác sĩ/ HTĐT
    const allNameFromListDoctor = [];
    dataList.forEach((e) => {
      allNameFromListDoctor.push(Object.getOwnPropertyNames(e.revenueDoctorType.listDoctor));
    });
    const data3Children = [];
    allNameFromListDoctor.forEach((subArray) => {
      subArray.forEach((name) => {
        const formattedName = { key: name, name };
        const duplicate = data3Children.some((obj) => obj.name === formattedName.name);
        if (!duplicate) {
          data3Children.push(formattedName);
        }
      });
    });

    dataList.forEach((e) => {
      // Thực thu tiền mặt
      data1Children[0][e.month] = e.revenuePaymentMethod.cash;

      // Thực thu chuyển khoản
      data1Children[1][e.month] = e.revenuePaymentMethod.bank;

      // Thực thu POS
      data1Children[2][e.month] = e.revenuePaymentMethod.mpos;

      // Thực thu trả góp
      data1Children[3][e.month] = e.revenuePaymentMethod.credit;

      // Thực thu khách hàng mới
      data2Children[0][e.month] = e.revenueCustomerType.newCustomer;

      // Thực thu khách hàng cũ
      data2Children[1][e.month] = e.revenueCustomerType.oldCustomer;

      // chi tiết TỔNG THỰC CHI
      data4Children[0][e.month] = e.advertisingCosts;
      data4Children[1][e.month] = e.equipmentCosts;
      data4Children[2][e.month] = e.houseCosts;
      data4Children[3][e.month] = e.implantCost;
      data4Children[4][e.month] = e.labCosts;
      data4Children[5][e.month] = e.laundryCosts;
      data4Children[6][e.month] = e.machineCosts;
      data4Children[7][e.month] = e.marketingCosts;
      data4Children[8][e.month] = e.materialCosts;
      data4Children[9][e.month] = e.mposCosts;
      data4Children[10][e.month] = e.otherCost;
      data4Children[11][e.month] = e.salesCosts;
      data4Children[12][e.month] = e.staffCosts;
      data4Children[13][e.month] = e.recommendCosts;

      // Phân loại theo bác sĩ/ HTĐT
      data3Children.forEach((item) => {
        item[e.month] = e.revenueDoctorType.listDoctor[item.name] ?? 0;
      });

      // TỔNG THỰC THU, CHI TIẾT:
      data[0][e.month] =
        e.revenuePaymentMethod.bank +
        e.revenuePaymentMethod.cash +
        e.revenuePaymentMethod.credit +
        e.revenuePaymentMethod.mpos;

      // Phân loại theo hình thức thanh toán
      data[1][e.month] =
        e.revenuePaymentMethod.bank +
        e.revenuePaymentMethod.cash +
        e.revenuePaymentMethod.credit +
        e.revenuePaymentMethod.mpos;

      // Phân loại theo nhóm khách hàng
      data[2][e.month] = e.revenueCustomerType.newCustomer + e.revenueCustomerType.oldCustomer;

      // Phân loại theo bác sĩ/ HTĐT
      data[3][e.month] = e.revenueDoctor;

      // TỔNG THỰC CHI
      data[4][e.month] =
        e.advertisingCosts +
        e.equipmentCosts +
        e.houseCosts +
        e.implantCost +
        e.labCosts +
        e.laundryCosts +
        e.machineCosts +
        e.marketingCosts +
        e.materialCosts +
        e.mposCosts +
        e.otherCost +
        e.recommendCosts +
        e.salesCosts +
        e.staffCosts;
    });
    data[1].children = data1Children;
    data[2].children = data2Children;
    data[3].children = data3Children;
    data[4].children = data4Children;
    return { data, count: data.length };
  };

  const [handleChange, DataTable] = HookDataTable({
    yScroll: 1300,
    isLoading,
    setIsLoading,
    showSearch: false,
    columns: columnReportRevenue({ columnName }),
    Get: getList,
    save: false,
    showPagination: false,
    loadFirst: false,
    // defaultExpandAllRows: true,
    expandable: {
      // defaultExpandAllRows: true,
      // expandedRowRender: (record) => {
      // if (record.name === 'Phân loại theo bác sĩ/ HTĐT') {
      //   const allNameFromData = [];
      //   allData.forEach((e) => {
      //     allNameFromData.push(Object.getOwnPropertyNames(e.revenueDoctorType.listDoctor));
      //   });
      //   console.log(allNameFromData);
      //   const mergedArray = [];
      //   allNameFromData.forEach((subArray) => {
      //     subArray.forEach((name) => {
      //       const formattedName = { key: name, name };
      //       const duplicate = mergedArray.some((obj) => obj.name === formattedName.name);
      //       if (!duplicate) {
      //         mergedArray.push(formattedName);
      //       }
      //     });
      //   });
      //   console.log(mergedArray);
      //   allData.forEach((e) => {
      //     mergedArray.forEach((item) => {
      //       item[e.month] = e.revenueDoctorType.listDoctor[item.name] ?? 0;
      //     });
      //   });
      //   console.log(mergedArray);
      //   return <Table columns={columns()} dataSource={mergedArray} pagination={false} showHeader={false} />;
      // }
      // const columns = [
      //   {
      //     title: 'Date',
      //     dataIndex: 'date',
      //     key: 'date',
      //   },
      //   {
      //     title: 'Name',
      //     dataIndex: 'name',
      //     key: 'name',
      //   },
      // ];
      // for (let i = 0; i < 3; ++i) {
      //   data.push({
      //     key: i.toString(),
      //     date: '2014-12-24 23:12:00',
      //     name: 'This is production name',
      //     upgradeNum: 'Upgraded: 56',
      //   });
      // }
      // return <Table columns={columns()} dataSource={data} pagination={false} showHeader={false} />;
      // return <div className="pl-[50px] w-full">
      //   <ListLabo record={record}></ListLabo>
      // </div>
      // },
      // rowExpandable: (record) => record.name !== 'Tổng thực thu, chi tiết:',
    },
  });

  const init = async () => {
    const resBranch = await BranchsService.getAll();
    setListBranch(resBranch);
  };
  useEffect(() => {
    init();
  }, []);
  useEffect(() => {
    handleChange();
  }, [filterDate, filterBranch]);

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex gap-4">
          <DatePicker.RangePicker
            allowClear={false}
            picker="month"
            format="MM/YYYY"
            placeholder={['MM/YYYY', 'MM/YYYY']}
            className="w-full sm:w-[250px] mb-4 !bg-white rounded-lg"
            defaultValue={[moment(filterDate.fromDate), moment(filterDate.toDate)]}
            onChange={(dates, dateStrings) => {
              setFilterDate((prev) => ({
                fromDate: moment(dates[0]).startOf('month').format('YYYY-MM-DD 00:00:01'),
                toDate: moment(dates[1]).endOf('month').format('YYYY-MM-DD 23:59:59'),
              }));
            }}
          />
          <div className="w-40">
            <Select
              className="w-[250px] !bg-white rounded-lg"
              placeholder="Chọn chi nhánh"
              options={[
                { value: 'ALL', label: 'Tất cả chi nhánh' },
                ...listBranch.map((ele) => ({ value: ele.uuid, label: ele.branchName })),
              ]}
              defaultValue={filterBranch}
              onChange={(value) => {
                setFilterBranch(value);
              }}
            />
          </div>
        </div>
        <div>
          <span>
            <Button className=" !border-gray-500 border h-10 !text-gray-500 !text-base font-medium " onClick={() => {}}>
              <span className="icon-download pr-2 pl-1" />
              Xuất file
            </Button>
          </span>
        </div>
      </div>
      {DataTable()}
    </div>
  );
}

export default Page;
