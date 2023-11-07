import React, { useState, useEffect } from 'react';
import { HookDataTable } from 'hooks';
import { Form, Input, DatePicker, Modal, Select } from 'antd';
import { ColumnAddTreatmentSlip } from './columnAddTreatmentSlip';
import moment from 'moment';
import { AddNew } from './addNew';
import { AuthSerivce } from 'services/Auth';
import { SaleOrderService } from 'services/SaleOrder';
import { Message } from 'components';
import { MasterDataService } from 'services/master-data-service';
import { useAuth } from 'global';

export const AddTreatmentSlip = ({
  showModelAddTreatmentSlip,
  setShowModelAddTreatmentSlip,
  cusName,
  serviceCheck,
  customerUuid,
  idCustomer,
}) => {
  const [form] = Form.useForm();
  const handleCancel = () => {
    form.resetFields();
    setShowModelAddTreatmentSlip(false);
  };
  const { user, branchUuid } = useAuth();

  const [showModalAddService, setShowModalAddService] = useState(false);
  const [getListService, setGetListService] = useState({ data: [], count: 0 });
  const [listUser, setListUser] = useState([]);
  const [listDoctor, setListDoctor] = useState([]);
  const [getUuidService, setGetUuidService] = useState();
  const columnService = ColumnAddTreatmentSlip(
    (param) => handleGetUuidService(param),
    (param) => deleteItemServiceList(param),
  );

  const handleToggleAddNew = async (data) => {
    // if (!serviceCheck) {
    //   setGetListService({ data: [], count: 0 });
    //   form.resetFields();
    //   form.setFieldsValue({ customer: cusName });
    //   setShowModalAddService(false);
    //   handleChangeService();
    // } else {
    // setShowModelAddTreatmentSlip(!showModelAddTreatmentSlip);
    // setGetListService({ data: [], count: 0 });
    // form.resetFields();
    const createdUser = listUser.find((ele) => ele.uuid === user.uuid);
    const valuedata = {
      customer: cusName,
      createdUserUuid: createdUser?.uuid,
    };

    form.setFieldsValue({ ...valuedata });
    const listService = [];
    const list = [];

    const servicePriceList = await MasterDataService.getAllService();

    serviceCheck.forEach((ele) => {
      list.push(
        ...ele.teethStoryServiceDtoList.map((e) => ({
          productServiceDto: e,
          saleOrderServiceTeethDtoList: ele.teethStoryItemDtoList,
        })),
      );
    });
    console.log(list);
    list.forEach((ele) => {
      listService.push({
        ...ele,
        serviceNamne: ele.productServiceDto?.name,
        uuid: Math.random(),
        quantity: 1,
        unitPrice: 0,
        createdDate: moment(),
        status: 'TREATING',
      });
    });
    console.log(listService);
    const listServiceData = listService.map((ele) => {
      const unitPrice = servicePriceList.find((e) => e.uuid === ele.productServiceDto.uuid)?.price;
      const balanceAmount = unitPrice * ele.quantity;
      const paidAmount = 0;
      const totalPaymentAmount = unitPrice * ele.quantity;
      // eslint-disable-next-line no-extra-boolean-cast
      if (!!unitPrice) {
        return { ...ele, unitPrice, deleteAction: false, balanceAmount, paidAmount, totalPaymentAmount };
      }
      return { ...ele, deleteAction: false, balanceAmount, paidAmount, totalPaymentAmount };
    });

    setGetListService((prev) => ({ ...prev, data: listServiceData, count: listServiceData.length }));
    setShowModalAddService(false);
  };
  const handleGetUuidService = async (data) => {
    // get serviceDetail to take categoryUuid because backend not return categoryUuid in get list teethStatus
    const serviceDetail = await MasterDataService.getDetailService(data?.productServiceDto?.uuid);
    const dataService = { categoryDto: { uuid: serviceDetail?.serviceCategoryUuid }, ...data };
    console.log(dataService);
    setGetUuidService(dataService);
    setShowModalAddService(true);
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

  const init = async () => {
    const res = await AuthSerivce.getAllUser({ branchUuid });
    setListDoctor(res.data?.filter((ele) => ele.position?.code === 'DOCTOR'));
    form.setFieldsValue({ customer: cusName });
    setListUser(res.data);
  };
  const okButton = async () => {
    const saleOrderServiceItemList = getListService?.data.map((ele) => {
      if (typeof ele.uuid === 'number') {
        return {
          ...ele,
          createdDate: moment(ele.createdDate).format('YYYY-MM-DD hh:mm:ss'),
          uuid: null,
          productServiceDto: { uuid: ele.productServiceDto.uuid, name: ele.serviceNamne },
        };
      }
      return {
        ...ele,
        createdDate: moment(ele.createdDate).format('YYYY-MM-DD hh:mm:ss'),
        productServiceDto: { uuid: ele?.productServiceDto.uuid, name: ele?.serviceNamne },
      };
    });
    try {
      setShowModelAddTreatmentSlip(false);
      const formValue = form.getFieldValue();
      const data = {
        ...formValue,
        teethStoryDto: { uuid: customerUuid },
        dateOrder: moment(formValue.dateOrder).format('YYYY-MM-DD hh:mm:ss'),
        expiredDate: moment(formValue.expiredDate).format('YYYY-MM-DD hh:mm:ss'),
        doctorUserDto: { id: formValue.doctorId },
        dateApplyTotal: Number(formValue.dateApplyTotal),
        customerUuid: idCustomer,
        saleOrderServiceItemDtoList: saleOrderServiceItemList.filter((ele) => !ele.deleteAction),
      };
      console.log(data);
      const res = await SaleOrderService.postService(data);
      if (res) {
        if (res.message)
          await Message.success({
            text: 'Tạo phiếu điều trị thành công.',
            title: 'Thành Công',
            cancelButtonText: 'Đóng',
          });
      }
      return res;
    } catch (error) {
      console.log(error);
    }
    // }
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

  useEffect(() => {
    init();
  }, [cusName]);
  useEffect(() => {
    handleToggleAddNew();
  }, [showModelAddTreatmentSlip]);

  useEffect(() => {
    handleChangeService();
  }, [getListService]);

  const [isLoading, setIsLoading] = useState(false);
  const [handleChangeService, DataTableService] = HookDataTable({
    Get: async (params) => {
      const data = getListService.data.filter((ele) => !ele.deleteAction);
      return { data, count: data.length };
    },
    onRow: (data) => ({
      onDoubleClick: (event) => {},
    }),
    isLoading,
    setIsLoading,
    xScroll: 1600,
    yScroll: true,
    loadFirst: false,
    save: false,
    showPagination: false,
    columns: columnService,
    rightHeader: (
      <div className="flex gap-4">
        <div
          onClick={() => setShowModalAddService(true)}
          className="bg-red-500 text-white px-4 py-2.5 rounded-xl hover:bg-red-400 inline-flex items-center cursor-pointer"
        >
          <i className="las la-plus mr-1" />
          Thêm dịch vụ
        </div>
      </div>
    ),
  });

  return (
    <Modal
      // bodyStyle={{ height: 725 }}
      destroyOnClose={true}
      title={
        <div className="flex justify-between">
          <div className="text-base font-bold">Thêm phiếu điều trị</div>
          <button
            className=""
            onClick={() => {
              handleCancel();
            }}
          >
            <span className="icon-x-close pr-2"></span>
          </button>
        </div>
      }
      open={showModelAddTreatmentSlip}
      footer={null}
      className="!w-9/12 pb-0"
      closable={false}
      style={{ top: 5 }}
    >
      <Form
        onFinish={async () => {
          okButton();
        }}
        colon={false}
        form={form}
      >
        <div>
          <div className="text-lg font-bold">Thông tin khách hàng</div>
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
                initialValue={moment(new Date())}
                rules={[
                  {
                    required: true,
                    message: 'Chọn ngày tạo ',
                  },
                ]}
              >
                <DatePicker
                  placeholder="Chọn ngày tạo"
                  className="!w-full border rounded-lg !bg-white  border-gray-200"
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
                ></Select>
              </Form.Item>
            </div>
            <div className="w-full flex justify-between gap-4">
              <Form.Item className="w-4/12" name="expiredDate" label="Ngày dự kiến kết thúc điều trị">
                <DatePicker
                  placeholder="Chọn ngày dự kiến kết thúc điều trị"
                  className="!w-full border rounded-lg !bg-white  border-gray-200"
                  format="DD/MM/YYYY"
                />
              </Form.Item>
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
                    message: 'Chọn bác sĩ điều trị',
                  },
                ]}
              >
                <Select
                  className="w-full !rounded-lg"
                  placeholder="Bác sĩ điều trị"
                  options={listDoctor.map((ele) => ({ value: ele.id, label: ele.firstName }))}
                  onChange={(value) => {
                    if (getListService?.data?.length) {
                      const doctorUserDto = listDoctor.find((ele) => ele.id === value);
                      console.log(value);
                      setGetListService((pre) => ({
                        ...pre,
                        data: pre?.data?.map((ele) => {
                          if (!ele.doctorUserDto) {
                            return {
                              ...ele,
                              doctorUserDto: {
                                id: doctorUserDto?.id,
                                firstName: doctorUserDto?.firstName,
                              },
                            };
                          } else return { ...ele };
                        }),
                      }));
                      // handleChangeService();
                    }
                  }}
                ></Select>
              </Form.Item>
            </div>
          </div>
        </div>
        <div className="text-lg font-bold">Danh sách dịch vụ</div>
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
        <Form.Item>
          <div className="flex justify-between pt-6">
            <button
              className="active:ring-2 ring-offset-1 ring-offset-gray-300 ring-gray-300 bg-white text-gray-500 border-gray-400 border !rounded-lg px-11 py-2 text-base font-medium  "
              type="button"
              onClick={() => {
                handleCancel();
              }}
            >
              Trở về
            </button>
            <button
              className="active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-red-500 text-white rounded-lg border border-red-500  items-center !text-base !font-medium px-6 py-2"
              type="submit"
            >
              Thêm phiếu
            </button>
          </div>
        </Form.Item>
      </Form>
      {showModalAddService && (
        <AddNew
          setGetUuidService={setGetUuidService}
          getUuidService={getUuidService}
          showModalAddService={showModalAddService}
          setGetListService={setGetListService}
          getListService={getListService}
          setShowModalAddService={setShowModalAddService}
        />
      )}
    </Modal>
  );
};
