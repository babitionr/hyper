import React, { useState, useEffect } from 'react';
import { ColumnTreatmentSlip } from '../detail/columns/columnTreatmentSlip';
import { HookDataTable } from 'hooks';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { Form, Input, DatePicker, Select, Tabs, Button } from 'antd';
import { SaleOrderService } from 'services/SaleOrder';
import { AddNew } from './addNew';
import { ColumnService } from '../detail/columns/columnService';
import moment from 'moment';
import { AuthSerivce } from 'services/Auth';
import { TreatmentSlipTableMini } from './treatmentSlipTableMini';
import { AddNewSaleOrderHistory } from './addNewSaleOrderHistory';
import { AddNewPayment } from './addNewPayment';
import { ColumnSaleOrderHistory } from './saleOrderHistory/columnSaleOrderHistory';
import { SaleOrderHistoryService } from 'services/saleOrderHistory';
import classNames from 'classnames';
// import paymentIcon from 'assets/images/paymentIcon.svg';

import { Message } from 'components';
import { routerLinks } from 'utils';
import { useAuth } from 'global';
import { PaymentService } from 'services/payment';
import { ColumnPaymentHistory } from './saleOrderHistory/columnPaymentHistory';
import { PrintTreatmentSlip } from './printTreatmentSlip';

export const TreatmentSlip = (props) => {
  const { searchParams, idCustomer, cusName, checkPermission } = props;
  const { user, branchUuid } = useAuth();
  const type = searchParams.get('type');
  const navigate = useNavigate();
  const [toggleAddNew, setToggleAddNew] = useState(type === 'addNew');
  const [showModalAddService, setShowModalAddService] = useState(false);
  const [getListService, setGetListService] = useState({ data: [], count: 0 });
  const [form] = Form.useForm();
  const [listUser, setListUser] = useState([]);
  const [listDoctor, setListDoctor] = useState([]);
  // const [column] = useState(ColumnTreatmentSlip((param) => handleToggleAddNew(param)));
  const [dataEdit, setDataEdit] = useState({});
  const [getUuidService, setGetUuidService] = useState();
  // const columnService = ColumnService((param) => handleGetUuidService(param));
  const [toggleDoubleClick, setToggleDoubleClick] = useState(false);
  const [showModalAddNewSaleOrderHistory, setShowModalAddNewSaleOrderHistory] = useState(false);
  const [showModalAddNewPayment, setShowModalAddNewPayment] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

  const deleteHistory = async (uuid) => {
    await SaleOrderHistoryService.delete(uuid);
    await handleChangeSaleOrderHistory();
    return true;
  };

  const initForm = async (uuid) => {
    const datatreatmentslip = await SaleOrderService.GetDetailSaleOrderCopy(uuid);
    // console.log(datatreatmentslip);
    setGetListService({ data: [], count: 0 });
    form.resetFields();
    const valuedata = {
      ...datatreatmentslip,
      expiredDate: moment(datatreatmentslip.expiredDate),
      dateOrder: moment(datatreatmentslip.dateOrder),
      customer: cusName,
      doctorId: datatreatmentslip?.doctorUserDto?.id,
    };
    // console.log(cusName);
    form.setFieldsValue({ ...valuedata });
    const listService = [];
    datatreatmentslip.saleOrderServiceItemDtoList?.forEach((ele) => {
      listService.push({
        ...ele,
        serviceNamne: ele.productServiceDto?.name,
        doctorUserName: ele.doctorUserDto?.firstName,
        saleOrderServiceTeethDtoList: ele.saleOrderServiceTeethDtoList,
      });
    });
    setGetListService({ data: listService, count: listService.length });
    setDataEdit(datatreatmentslip);
    setShowModalAddService(false);
  };

  const handleDelete = async (param) => {
    await SaleOrderService.delete(param);
    handleChange();
  };

  const handleToggleAddNew = async (data) => {
    if (!data) {
      setToggleAddNew(!toggleAddNew);
      setGetListService({ data: [], count: 0 });
      form.resetFields();
      form.setFieldsValue({ customer: cusName });
      setShowModalAddService(false);
      handleChangeService();
      navigate({
        search: createSearchParams({
          tab: 'TreatmentSlip',
          type: 'addNew',
          id: idCustomer,
        }).toString(),
      });
    } else {
      setToggleDoubleClick(false);
      setToggleAddNew(true);
      initForm(data?.uuid);
      navigate({
        search: createSearchParams({
          tab: 'TreatmentSlip',
          type: 'addNew',
          id: idCustomer,
          saleOrderId: data.uuid,
        }).toString(),
      });
    }
  };
  const handleGetUuidService = (data) => {
    const dataService = data;
    // console.log(dataService);
    setGetUuidService(dataService);
    setShowModalAddService(true);
  };
  const returnButton = () => {
    setIsLoadingSubmit(false);
    setToggleAddNew(false);
    setDataEdit({});
    setSubTabDetailTreatmentSlip('serviceList');
    handleChange();
    navigate({
      search: createSearchParams({
        tab: 'TreatmentSlip',
        type: 'detail',
        id: idCustomer,
      }).toString(),
    });
  };
  const init = async () => {
    const res = await AuthSerivce.getAllUser({ branchUuid });
    setListDoctor(res.data?.filter((ele) => ele.position?.code === 'DOCTOR'));
    form.setFieldsValue({ customer: cusName });
    setListUser(res.data);
  };
  // console.log(dataEdit);
  const okButton = async () => {
    setIsLoadingSubmit(true);
    const dataSaleOrderServiceItemList = getListService?.data.map((ele) => {
      if (typeof ele.uuid === 'number') {
        return {
          ...ele,
          uuid: null,
          productServiceDto: { uuid: ele.productServiceDto.uuid, name: ele.serviceNamne },
        };
      }
      return { ...ele, productServiceDto: { uuid: ele.productServiceDto.uuid, name: ele.serviceNamne } };
    });
    if (dataEdit?.uuid) {
      try {
        setToggleAddNew(false);
        const formValue = form.getFieldValue();
        const data = {
          ...formValue,
          customerUuid: idCustomer,
          uuid: dataEdit.uuid,
          dateOrder: moment(formValue.dateOrder).format('YYYY-MM-DD hh:mm:ss'),
          expiredDate: moment(formValue.expiredDate).format('YYYY-MM-DD hh:mm:ss'),
          doctorUserDto: { id: formValue.doctorId },
          // dateApplyTotal: Number(formValue.dateApplyTotal),
          saleOrderServiceItemDtoList: dataSaleOrderServiceItemList.filter((ele) => ele.uuid || !ele.deleteAction),
        };
        // console.log(data);
        const res = await SaleOrderService.postService(data);
        if (res) {
          if (res.message && dataEdit?.uuid)
            await Message.success({
              text: 'Chỉnh sửa phiếu điều trị thành công.',
              title: 'Thành Công',
              cancelButtonText: 'Đóng',
            });
        }
        returnButton();
        return res;
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        setToggleAddNew(false);
        const formValue = form.getFieldValue();
        const data = {
          ...formValue,
          customerUuid: idCustomer,
          dateOrder: moment(formValue.dateOrder).format('YYYY-MM-DD hh:mm:ss'),
          expiredDate: moment(formValue.expiredDate).format('YYYY-MM-DD hh:mm:ss'),
          doctorUserDto: { id: formValue.doctorId },
          // dateApplyTotal: Number(formValue.dateApplyTotal),
          saleOrderServiceItemDtoList: dataSaleOrderServiceItemList.filter((ele) => ele.uuid || !ele.deleteAction),
        };
        // console.log(data);
        const res = await SaleOrderService.postService(data);
        if (res) {
          if (res.message)
            await Message.success({
              text: 'Tạo phiếu điều trị thành công.',
              title: 'Thành Công',
              cancelButtonText: 'Đóng',
            });
        }
        returnButton();
        return res;
      } catch (error) {
        console.log(error);
      }
    }
    setIsLoadingSubmit(false);
  };

  const deleteItemServiceList = (data) => {
    const dataService = getListService.data.map((ele) => {
      if (ele.uuid === data.uuid) {
        return { ...ele, deleteAction: true };
      }
      return ele;
    });
    setGetListService({ data: dataService, count: dataService.length });
  };

  const totalMoney = React.useCallback(() => {
    let thanhTien = 0;
    let tongGiamGia = 0;
    let tongTienDaTra = 0;
    getListService.data
      .filter((ele) => !ele.deleteAction)
      .forEach((ele) => {
        thanhTien = thanhTien + Number(ele?.quantity ?? 0) * ele?.unitPrice;
        tongTienDaTra += Number(ele.paidAmount);
        if (ele?.promotionDto?.promotionType === 'PERCENT') {
          tongGiamGia =
            tongGiamGia +
            (Number(ele?.quantity ?? 0) * Number(ele?.unitPrice) * Number(ele?.promotionDto?.amount)) / 100;
        }
        if (ele?.promotionDto?.promotionType === 'CASH') {
          tongGiamGia = tongGiamGia + Number(Number(ele?.promotionDto?.amount));
        }
      });
    const tongTien = thanhTien - tongGiamGia;
    const tongTienConLai = tongTien - tongTienDaTra;
    return { thanhTien, tongGiamGia, tongTien, tongTienDaTra, tongTienConLai };
  }, [getListService]);
  const getList = async (params) => {
    const res = await SaleOrderService.getList({
      page: params.page,
      perPage: params.perPage,
      customerUuid: idCustomer,
    });
    return { data: res.content, count: res.totalElements };
  };
  useEffect(() => {
    handleChangeService();
  }, [getListService]);

  useEffect(() => {
    setToggleAddNew(false);
    handleChange();
    init();
  }, [cusName]);

  const [subTabDetailTreatmentSlip, setSubTabDetailTreatmentSlip] = useState('serviceList');
  const handleChangeSubTabDetailTreatmentSlip = (key, event) => {
    if (!key) return null;
    setSubTabDetailTreatmentSlip(key);
    if (saleOrderId && key === 'saleOrderHistory') {
      handleChangeSaleOrderHistory();
    }
    if (saleOrderId && key === 'paymentHistory') {
      handleChangePaymentHistory();
    }
  };

  useEffect(() => {
    if (saleOrderId && subTabDetailTreatmentSlip === 'saleOrderHistory') {
      handleChangeSaleOrderHistory();
    }
    if (saleOrderId && subTabDetailTreatmentSlip === 'paymentHistory') {
      handleChangePaymentHistory();
    }
  }, [subTabDetailTreatmentSlip]);

  const [handleChange, DataTable] = HookDataTable({
    Get: getList,
    onRow: (data) => ({
      onDoubleClick: (event) => {
        handleToggleAddNew(data);
      },
    }),
    save: false,
    expandable: {
      expandedRowRender: (record) => (
        <div className="pl-4">
          <TreatmentSlipTableMini record={record}></TreatmentSlipTableMini>
        </div>
      ),
      rowExpandable: (record) => record.uuid !== 'Not Expandable',
    },
    columns: ColumnTreatmentSlip(
      (param) => handleToggleAddNew(param),
      (param) => handleDelete(param),
    ),
    rightHeader: (
      <div className="flex gap-4">
        <button
          onClick={() => {
            setToggleDoubleClick(false);
            handleToggleAddNew();
          }}
          className="bg-red-500 text-white px-4 py-2.5 rounded-xl hover:bg-red-400 inline-flex items-center"
        >
          <i className="las la-plus mr-1" />
          Thêm phiếu
        </button>
        {/* <button
          className="active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-white text-red-500 rounded-lg border border-red-500  items-center !text-base !font-medium px-4 py-2"
          type="button"
        >
          <i className="las la-plus mr-1 text-red-500" />
          Thêm ưu đãi
        </button> */}
        {/* <button
          className="active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-red-500 text-white rounded-lg border border-red-500  items-center !text-base !font-medium px-4 py-2"
          type="button"
        >
          <i className="las la-plus mr-1" />
          Thêm dịch vụ
        </button> */}
      </div>
    ),
  });
  const [handleChangeService, DataTableService] = HookDataTable({
    Get: () => {
      const data = getListService.data.filter((ele) => !ele.deleteAction);
      return { data, count: data.length };
    },
    yScroll: true,
    showPagination: false,
    onRow: (data) => ({
      onDoubleClick: (event) => {},
    }),
    columns: ColumnService({ handleGetUuidService, toggleDoubleClick, deleteItemServiceList }),
    rightHeader: (
      <div className="flex gap-4">
        {
          <div
            onClick={() => setShowModalAddService(true)}
            className="bg-rose-500 text-white px-4 py-2.5 rounded-xl hover:bg-rose-400 inline-flex items-center cursor-pointer"
          >
            <i className="las la-plus mr-1" />
            Thêm dịch vụ
          </div>
        }
      </div>
    ),
  });
  const saleOrderId = searchParams.get('saleOrderId');

  const GetSaleOrderHistoryList = async (param) => {
    const params = { ...param };
    delete params.saleOrderId;
    delete params.type;
    delete params.id;
    delete params.tab;

    const data = await SaleOrderHistoryService.getSaleOrderHistoryList({
      ...params,
      customerUuid: idCustomer,
      saleOrderUuid: searchParams.get('saleOrderId'),
    });
    return {
      data: data?.content,
      count: data?.totalElements,
    };
  };

  const [dataSaleOrderHistory, setDataSaleOrderHistory] = useState({ data: {}, isView: false });
  const [handleChangeSaleOrderHistory, DataSaleOrderHistory] = HookDataTable({
    Get: GetSaleOrderHistoryList,
    showSearch: false,
    columns: ColumnSaleOrderHistory({ setShowModalAddNewSaleOrderHistory, setDataSaleOrderHistory, deleteHistory }),
    save: false,
    loadFirst: false,
  });

  const GetPaymentHistoryList = async (param) => {
    const params = { ...param };
    delete params.saleOrderId;
    delete params.type;
    delete params.id;
    delete params.tab;

    const resPayment = await PaymentService.getListPaymentByTreatmentSlipHistory({
      ...params,
      saleOrderUuid: saleOrderId,
    });
    return {
      data: resPayment?.data?.content,
      count: resPayment?.data?.totalElements,
    };
  };

  const [handleChangePaymentHistory, DataPaymentHistory] = HookDataTable({
    Get: GetPaymentHistoryList,
    showSearch: false,
    yScroll: true,
    columns: ColumnPaymentHistory(),
    save: false,
    loadFirst: false,
  });

  const handleCreateLabo = async () => {
    const record = dataEdit;
    navigate(
      {
        pathname: routerLinks('CustomerDetail'),
        search: createSearchParams({
          id: idCustomer,
          tab: 'Labo',
          type: 'addNew',
        }).toString(),
      },
      { state: record },
    );
  };

  const codeId = form.getFieldValue('code');

  const items = [
    {
      label: 'Dịch vụ',
      key: 'serviceList',
      children: (
        <>
          <div className="text-lg font-bold mb-2">Danh sách dịch vụ</div>
          <>{DataTableService()}</>
          <div className="flex justify-between pt-3">
            <div></div>
            <div>
              <div className="flex gap-36 justify-between">
                <div className="text-base font-medium">Thành tiền</div>

                <div className="text-base font-medium">
                  {Number(totalMoney().thanhTien).toLocaleString('de-DE') + ' VND'}
                </div>
              </div>
              <div className="flex gap-36 justify-between">
                <div className="text-base font-medium">Tổng giảm giá</div>
                <div className="text-base font-medium">
                  {Number(totalMoney().tongGiamGia).toLocaleString('de-DE') + ' VND'}
                </div>
              </div>
              <div className="flex gap-36 justify-between">
                <div className="text-base font-medium">Tổng tiền</div>
                <div className="text-base font-medium">
                  {Number(totalMoney().tongTien).toLocaleString('de-DE') + ' VND'}
                </div>
              </div>
              <div className="flex gap-36 justify-between">
                <div className="text-base font-medium">Tổng tiền đã trả</div>
                <div className="text-base font-medium">
                  {Number(totalMoney().tongTienDaTra).toLocaleString('de-DE') + ' VND'}
                </div>
              </div>
              <div className="flex gap-36 justify-between">
                <div className="text-base font-medium">Tổng số tiền còn lại</div>
                <div className="text-base font-medium">
                  {Number(totalMoney().tongTienConLai).toLocaleString('de-DE') + ' VND'}
                </div>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      label: 'Lịch sử điều trị',
      key: 'saleOrderHistory',
      children:
        checkPermission && checkPermission('MANAGE_CUSTOMER_TH') ? (
          saleOrderId ? (
            <div className="">
              <div className="flex justify-between">
                <div className="text-lg font-bold">Lịch sử điều trị</div>
                <div>
                  {!toggleDoubleClick ? (
                    <div
                      onClick={() => {
                        setShowModalAddNewSaleOrderHistory(true);
                      }}
                      className="bg-rose-500 text-white px-4 py-2.5 rounded-xl hover:bg-rose-400 inline-flex items-center cursor-pointer"
                    >
                      <i className="las la-plus mr-1" />
                      Thêm lịch sử và thanh toán
                    </div>
                  ) : null}
                </div>
              </div>
              {DataSaleOrderHistory()}
            </div>
          ) : null
        ) : null,
    },
    {
      label: 'Lịch sử thanh toán',
      key: 'paymentHistory',
      children:
        checkPermission && checkPermission('MANAGE_CUSTOMER_TH') ? (
          saleOrderId ? (
            <div className="">
              <div className="flex justify-between">
                <div className="text-lg font-bold">Lịch sử thanh toán</div>
                <div></div>
              </div>
              {DataPaymentHistory()}
            </div>
          ) : null
        ) : null,
    },
  ];

  return (
    <div>
      {toggleAddNew === false ? (
        <div>
          <div className="text-lg font-bold">{'Danh sách phiếu điều trị'.toUpperCase()}</div>

          <div>{DataTable()}</div>
          <div>
            <div className="flex justify-between pt-6">
              {/* <button
                className="active:ring-2 ring-offset-1 ring-offset-gray-300 ring-gray-300 bg-white text-gray-500 border-gray-400 border !rounded-lg px-11 py-2 text-base font-medium  "
                type="button"
              >
                Trở về
              </button> */}
              {/* <button
                className="active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-red-500 text-white rounded-lg border border-red-500  items-center !text-base !font-medium px-6 py-2"
                type="button"
                onClick={handleToggleAddNew}
              >
                Thêm phiếu
              </button> */}
            </div>
          </div>
        </div>
      ) : (
        <Form colon={false} form={form}>
          <div>
            <div className="text-lg font-bold flex justify-between">
              <div>Thông tin khách hàng</div>
              {dataEdit?.uuid ? (
                <div className="flex gap-4">
                  <PrintTreatmentSlip idCustomer={idCustomer} saleOrderId={searchParams.get('saleOrderId')} />
                  {/* <ExportPdf/> */}
                  {/* PAYMENT IN EDIT TREATMENT SLIP
                  <button
                    className="flex active:ring-2 ring-offset-1 ring-offset-rose-300 ring-rose-300  bg-rose-500 text-white rounded-lg border border-rose-500  items-center !text-base !font-medium px-6 py-2"
                    type="button"
                    onClick={() => {
                      setShowModalAddNewPayment(true);
                    }}
                  >
                    <img src={paymentIcon} className="mr-1"></img>
                    Thanh toán
                  </button> */}
                  <button
                    className="active:ring-2 ring-offset-1 ring-offset-rose-300 ring-rose-300  bg-rose-500 text-white rounded-lg border border-rose-500  items-center !text-base !font-medium px-6 py-2"
                    type="button"
                    onClick={handleCreateLabo}
                  >
                    <i className="las la-plus mr-1" />
                    Thêm phiếu Labo
                  </button>
                </div>
              ) : null}
            </div>

            <div>
              <div className="w-full flex justify-between gap-4">
                <Form.Item className="w-4/12" label="Khách hàng" name="customer">
                  <Input
                    disabled
                    placeholder="Nhập tên khách hàng"
                    className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                  />
                </Form.Item>
                <Form.Item
                  className="w-4/12"
                  name="dateOrder"
                  label="Ngày tạo"
                  initialValue={moment()}
                  rules={[
                    {
                      required: true,
                      message: 'Chọn ngày tạo ',
                    },
                  ]}
                >
                  <DatePicker
                    allowClear={false}
                    placeholder="Chọn ngày tạo"
                    className={classNames('!w-full border rounded-lg !bg-white  border-gray-200', {
                      '': !toggleDoubleClick,
                    })}
                    disabledDate={(date) => new Date(date).getTime() > new Date().getTime()}
                    format="DD/MM/YYYY"
                  />
                </Form.Item>
                <Form.Item
                  className="w-4/12"
                  label="Người tạo"
                  name="createdUserUuid"
                  rules={[
                    {
                      required: true,
                      message: 'Chọn người tạo ',
                    },
                  ]}
                >
                  {/* <Input
                    placeholder="Nhập tên người tạo"
                    className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                  /> */}
                  <Select
                    className="w-full !rounded-lg"
                    placeholder="Người tạo"
                    allowClear
                    options={listUser.map((ele) => ({ value: ele.uuid, label: ele.firstName }))}
                    defaultValue={() => {
                      const createdName = listUser.find((ele) => ele.uuid === user.uuid);
                      if (createdName?.uuid) return { value: createdName?.uuid, label: createdName?.firstName };
                    }}
                  ></Select>
                </Form.Item>
              </div>
              <div className="w-full flex justify-between gap-4">
                <Form.Item className="w-4/12" name="expiredDate" label="Ngày dự kiến kết thúc điều trị">
                  <DatePicker
                    placeholder="Chọn ngày dự kiến kết thúc điều trị"
                    className={classNames('!w-full border rounded-lg !bg-white  border-gray-200', {
                      '': !toggleDoubleClick,
                    })}
                    format="DD/MM/YYYY"
                    disabledDate={(current) => {
                      const value = moment(form.getFieldsValue().dateOrder ?? false);
                      const isValid = moment(form.getFieldsValue().dateOrder ?? false).isValid();
                      return !isValid ? false : current && current.valueOf() < value;
                    }}
                  />
                </Form.Item>
                {/* <Form.Item
                  className="w-4/12 "
                  label="Số ngày áp dụng"
                  name="dateApplyTotal"
                  rules={[
                    {
                      required: true,
                      message: 'Nhập số ngày áp dụng',
                    },
                  ]}
                >
                  <Input
                    placeholder="Nhập số ngày áp dụng"
                    type="number"
                    min={1}
                    className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                  />
                </Form.Item> */}
                <Form.Item className="w-4/12" label="Ghi chú" name="note">
                  <Input
                    placeholder="Nhập ghi chú"
                    className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                  />
                </Form.Item>
                <Form.Item
                  className="w-4/12"
                  label="Bác sĩ điều trị"
                  name="doctorId"
                  rules={[
                    {
                      required: true,
                      message: 'Chọn bác sĩ điều trị',
                    },
                  ]}
                >
                  <Select
                    className="w-full !rounded-lg"
                    placeholder="Bác sĩ điều trị"
                    options={listDoctor.map((ele) => ({ value: ele.id, label: ele.firstName }))}
                    defaultValue={() => {
                      const doctor = listDoctor.find((ele) => ele.uuid === user.uuid);
                      if (doctor?.id) return { value: doctor?.id, label: doctor?.firstName };
                    }}
                  ></Select>
                </Form.Item>
              </div>
            </div>
          </div>
          {/* SubTab trong detail phiếu điều trị */}
          <Tabs
            activeKey={subTabDetailTreatmentSlip}
            onTabClick={handleChangeSubTabDetailTreatmentSlip}
            className="border rounded-lg px-4 pb-4"
            items={items}
          >
            {/* <Tabs.TabPane tab="Dịch vụ" key="serviceList">
              <div className="text-lg font-bold mb-2">Danh sách dịch vụ</div>
              <>{DataTableService()}</>
              <div className="flex justify-between pt-3">
                <div></div>
                <div>
                  <div className="flex gap-36 justify-between">
                    <div className="text-base font-medium">Thành tiền</div>

                    <div className="text-base font-medium">
                      {Number(totalMoney().thanhTien).toLocaleString('de-DE') + ' VND'}
                    </div>
                  </div>
                  <div className="flex gap-36 justify-between">
                    <div className="text-base font-medium">Tổng giảm giá</div>
                    <div className="text-base font-medium">
                      {Number(totalMoney().tongGiamGia).toLocaleString('de-DE') + ' VND'}
                    </div>
                  </div>
                  <div className="flex gap-36 justify-between">
                    <div className="text-base font-medium">Tổng tiền</div>
                    <div className="text-base font-medium">
                      {Number(totalMoney().tongTien).toLocaleString('de-DE') + ' VND'}
                    </div>
                  </div>
                  <div className="flex gap-36 justify-between">
                    <div className="text-base font-medium">Tổng tiền đã trả</div>
                    <div className="text-base font-medium">
                      {Number(totalMoney().tongTienDaTra).toLocaleString('de-DE') + ' VND'}
                    </div>
                  </div>
                  <div className="flex gap-36 justify-between">
                    <div className="text-base font-medium">Tổng số tiền còn lại</div>
                    <div className="text-base font-medium">
                      {Number(totalMoney().tongTienConLai).toLocaleString('de-DE') + ' VND'}
                    </div>
                  </div>
                </div>
              </div>
            </Tabs.TabPane>
            {checkPermission && checkPermission('MANAGE_CUSTOMER_TH') ? (
              saleOrderId ? (
                <Tabs.TabPane tab="Lịch sử điều trị" key="saleOrderHistory">
                  <div className="">
                    <div className="flex justify-between">
                      <div className="text-lg font-bold">Lịch sử điều trị</div>
                      <div>
                        {!toggleDoubleClick ? (
                          <div
                            onClick={() => {
                              setShowModalAddNewSaleOrderHistory(true);
                            }}
                            className="bg-rose-500 text-white px-4 py-2.5 rounded-xl hover:bg-rose-400 inline-flex items-center cursor-pointer"
                          >
                            <i className="las la-plus mr-1" />
                            Thêm lịch sử và thanh toán
                          </div>
                        ) : null}
                      </div>
                    </div>
                    {DataSaleOrderHistory()}
                  </div>
                </Tabs.TabPane>
              ) : null
            ) : null}
            {checkPermission && checkPermission('MANAGE_CUSTOMER_TH') ? (
              saleOrderId ? (
                <Tabs.TabPane tab="Lịch sử thanh toán" key="paymentHistory">
                  <div className="">
                    <div className="flex justify-between">
                      <div className="text-lg font-bold">Lịch sử thanh toán</div>
                      <div></div>
                    </div>
                    {DataPaymentHistory()}
                  </div>
                </Tabs.TabPane>
              ) : null
            ) : null} */}
          </Tabs>

          <Form.Item>
            <div className="flex justify-between pt-6">
              <button
                className="active:ring-2 ring-offset-1 ring-offset-gray-300 ring-gray-300 bg-white text-gray-500 border-gray-400 border !rounded-lg px-11 py-2 text-base font-medium  "
                type="button"
                onClick={returnButton}
              >
                Trở về
              </button>
              <Button
                className=" !border-rose-500 border !text-white !bg-rose-500 focus:!bg-rose-600 hover:!bg-rose-600 !px-6 flex items-center justify-center !pt-4 !pb-6 !text-base font-medium "
                loading={isLoadingSubmit}
                disabled={isLoadingSubmit}
                onClick={async () => {
                  try {
                    await form.validateFields();
                    await okButton();
                  } catch (error) {
                    console.log(error);
                  }
                }}
              >
                <span className="pt-2">{saleOrderId ? 'Lưu phiếu' : 'Thêm phiếu'}</span>
              </Button>
            </div>
          </Form.Item>
        </Form>
      )}

      {showModalAddService && (
        <AddNew
          treatmentSlipDetail={dataEdit}
          setGetUuidService={setGetUuidService}
          getUuidService={getUuidService}
          showModalAddService={showModalAddService}
          setGetListService={setGetListService}
          getListService={getListService}
          setShowModalAddService={setShowModalAddService}
        />
      )}
      {showModalAddNewSaleOrderHistory && (
        <AddNewSaleOrderHistory
          handleChangeService={handleChangeService}
          handleChangePaymentHistory={handleChangePaymentHistory}
          handleChangeSaleOrderHistory={handleChangeSaleOrderHistory}
          saleOrderId={saleOrderId}
          showModalAddNewSaleOrderHistory={showModalAddNewSaleOrderHistory}
          setShowModalAddNewSaleOrderHistory={setShowModalAddNewSaleOrderHistory}
          initForm={initForm}
          dataSaleOrderHistory={dataSaleOrderHistory}
          setDataSaleOrderHistory={setDataSaleOrderHistory}
        />
      )}
      {showModalAddNewPayment && (
        <AddNewPayment
          handleChangeService={handleChangeService}
          handleChangePaymentHistory={handleChangePaymentHistory}
          codeId={codeId}
          saleOrderId={saleOrderId}
          showModalAddNewPayment={showModalAddNewPayment}
          setShowModalAddNewPayment={setShowModalAddNewPayment}
          initForm={initForm}
        />
      )}
    </div>
  );
};
