import { DatePicker, Form, Input, InputNumber, Modal, Select, Steps, Upload } from 'antd';
import classNames from 'classnames';
import { Message, Spin } from 'components';

import { HookDataTable } from 'hooks';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { LaboService } from 'services/labo';
import { LaboParameterService } from 'services/labo-parameter';
import { SupplierService } from 'services/supplier';
import { UtilService } from 'services/util';
// import { exportIcons } from 'utils';
import { ColumnLabo } from './columns/columnLabo';
import './index.less';
import { blockInvalidChar, isNullOrUndefinedOrEmpty } from 'utils/func';
import { createSearchParams, useSearchParams } from 'react-router-dom';
import { SaleOrderService } from 'services/SaleOrder';
// import { SaleOrderService } from 'services/SaleOrder';

const { Step } = Steps;

function Labo({ cusName, idCustomer, canEdit = true, showText = true }) {
  const location = useLocation();
  const viewOnly = location?.state?.viewOnly ?? false;
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const type = searchParams.get('type');
  const laboId = searchParams.get('laboId');
  const idCus = searchParams.get('id');
  const root = searchParams.get('root');
  const navigate = useNavigate();
  const status = {
    DRAFT: 1,
    ORDER: 2,
    RECEIVED: 3,
    EXPORTED: 4,
  };
  const [data, setData] = useState({
    price: 5000000,
    total: 0,
  });
  const [detailSaleOrder, setDetailSaleOrder] = useState();

  const [step, setStep] = useState(status[data?.status] || 1);
  const [form] = Form.useForm();
  const [formReceiv] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);
  const [listServiceBySaleOrder, setListServiceBySaleOrder] = useState([]);
  // const [listCategoryService, setListCategoryService] = useState([]);

  const [list, setList] = useState({
    supplier: [],
    doctor: [],
    material: [],
    enclose: [],
    bite: [],
    line: [],
    span: [],
  });
  const [filterParams, setFilterParams] = useState({
    type: '',
    status: '',
  });
  const record = location.state;
  console.log('record: ', record);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await Promise.all([
          SupplierService.getAll(),
          LaboService.getListDoctor({ positon: 'DOCTOR' }),
          LaboParameterService.getAll({ type: 'MATERIAL' }),
          LaboParameterService.getAll({ type: 'ENCLOSE' }),
          LaboParameterService.getAll({ type: 'BITE' }),
          LaboParameterService.getAll({ type: 'LINE' }),
          LaboParameterService.getAll({ type: 'SPAN' }),
          // MasterDataService.getAllServiceCategory({ type: 'SERVICE' })
          SaleOrderService.getAllServiecBySaleOrder({
            saleOrderUuid: type === 'addNew' ? record?.uuid : record?.soUuid,
          }),
        ]);
        const [resSupplier, resDoctor, resMaterial, resEnclose, resBite, resLine, resSpan, resService] = res;
        setListServiceBySaleOrder(resService);
        setList((prev) => ({
          ...prev,
          supplier: resSupplier.data,
          doctor: resDoctor.data,
          material: resMaterial.data,
          enclose: resEnclose.data,
          bite: resBite.data,
          line: resLine.data,
          span: resSpan.data,
        }));
      } catch (error) {
        return error;
      }
    };
    (type === 'addNew' || type === 'edit') && getData();
  }, [location.pathname, type]);

  const listServiceBySaleOrderCheck = useMemo(() => {
    const newData = listServiceBySaleOrder.filter((item) => !!item.isLabo);
    if (newData.length === 0 && listServiceBySaleOrder.length > 0) {
      Message.error({ text: 'Không có dịch vụ nào để tạo labo.' });
      return newData;
    }
    return newData;
  }, [listServiceBySaleOrder]);
  useEffect(() => {
    const getData = async () => {
      if (laboId) {
        const res = await LaboService.getById({ uuid: laboId });
        setData(res);
        setStatusLabo(res?.status);
        setStep(status[res?.status] || 1);
        setImageUrl(res.imageUrl || '');
      }

      if (type === 'addNew' || type === 'edit') {
        // const result = await SaleOrderService.GetDetailSaleOrder(record?.uuid);
        setDetailSaleOrder(record);
      }
    };
    getData();
  }, [laboId, location.pathname]);
  const check = () => {
    return (
      (record?.saleOrderServiceItemDtoList &&
        record?.saleOrderServiceItemDtoList[0] &&
        record?.saleOrderServiceItemDtoList[0]?.saleOrderServiceTeethDtoList) ||
      []
    );
  };
  const [qty, setQty] = useState(data?.quantity ?? 0);
  const [price, setPrice] = useState(data?.price ?? 0);
  const [statusLabo, setStatusLabo] = useState('DRAFT');

  useEffect(() => {
    form.setFieldsValue({
      customer: cusName || record?.customer?.fullName || record?.customerName,
      prostheticsType:
        detailSaleOrder?.prostheticsType ||
        (record?.saleOrderServiceItemDtoList && record?.saleOrderServiceItemDtoList[0]?.productServiceDto?.name),
      brand:
        detailSaleOrder?.brand ||
        (record?.saleOrderServiceItemDtoList && record?.saleOrderServiceItemDtoList[0]?.productServiceDto?.firmName),
      teeth: data?.teeth || detailSaleOrder?.teeth || check(),
      color: data?.color,
      point: data?.point,
      quantity: data?.quantity,
      treatment: record?.saleOrderNumber || record?.code,
      note: data?.note,
      techNote: data?.techNote,
      timeSend: data?.timeSend ? dayjs(data?.timeSend) : dayjs(new Date()),
      timeReceive: data?.timeReceive ? dayjs(data?.timeReceive) : null,
      doctor: data?.doctor?.id,
      providerLabo: data?.supplier?.uuid,
      material: data?.laboSpecifications?.find((i) => i?.parameterType === 'MATERIAL')?.parameterId,
      enclose: data?.laboSpecifications?.find((i) => i?.parameterType === 'ENCLOSE')?.parameterId,
      bite: data?.laboSpecifications?.find((i) => i?.parameterType === 'BITE')?.parameterId,
      line: data?.laboSpecifications?.find((i) => i?.parameterType === 'LINE')?.parameterId,
      span: data?.laboSpecifications?.find((i) => i?.parameterType === 'SPAN')?.parameterId,
      realTimeReceive: isNullOrUndefinedOrEmpty(data?.warrantyPeriod) ? null : dayjs(data?.realTimeReceive),
      warrantyNo: data?.warrantyNo,
      warrantyPeriod: isNullOrUndefinedOrEmpty(data?.warrantyPeriod) ? null : dayjs(data?.warrantyPeriod),
      total: isNullOrUndefinedOrEmpty(data?.total) ? null : data?.total,
      price: data?.price ?? 0,
      timeExport: data?.timeExport ? dayjs(data?.timeExport) : null,
      soServiceItemUuid: data?.soServiceItemUuid,
      soUuid: data?.soUuid,
    });
  }, [data, detailSaleOrder]);

  useEffect(() => {
    if (
      isNullOrUndefinedOrEmpty(form.getFieldValue('price')) ||
      isNullOrUndefinedOrEmpty(form.getFieldValue('quantity'))
    ) {
      return form.setFieldsValue({ total: 0 });
    }
    return form.setFieldsValue({ total: form.getFieldValue('price') * form.getFieldValue('quantity') });
  }, [qty, price]);

  const handleDelete = async (id) => {
    await LaboService.delete(id);
    await handleChange();
  };

  const removeImg = () => {
    setImageUrl('');
  };
  const [handleChange, DataTable] = HookDataTable({
    onRow: (data) => ({
      onDoubleClick: (event) => {},
    }),
    showSearch: true,
    fullTextSearch: 'search',
    save: false,
    loadFirst: false,
    xScroll: 1600,
    isLoading,
    setIsLoading,
    Get: async (params) => {
      return await LaboService.getListByCustomer({ ...params, ...filterParams, customerUuid: idCustomer });
    },
    columns: ColumnLabo({ handleDelete }),
    rightHeader: (
      <div className="w-full flex justify-end gap-4 flex-col xl:flex-row mt-0 sm:mt-9 lg:mt-0">
        <Select
          allowClear
          className="w-full sm:w-[300px]"
          showSearch
          placeholder="Trạng thái phiếu"
          optionFilterProp="children"
          filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
          onChange={(value) => setFilterParams({ ...filterParams, status: value })}
          options={[
            { label: 'Nháp', value: 'DRAFT' },
            { label: 'Đặt hàng', value: 'ORDER' },
            { label: 'Đã nhận', value: 'RECEIVED' },
            { label: 'Đã xuất', value: 'EXPORTED' },
          ]}
        />
        <Select
          allowClear
          className="w-full sm:w-[300px]"
          showSearch
          placeholder="Loại phiếu"
          optionFilterProp="children"
          onChange={(value) => setFilterParams({ ...filterParams, type: value })}
          filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
          options={[
            { label: 'Đã mới', value: 'NEW' },
            { label: 'Bảo hành', value: 'WARRANTY' },
          ]}
        />
        {/* <div className="w-full sm:w-[320px]">
          <DatePicker
            allowClear
            className="!w-full h-[42px] !bg-white"
            // defaultValue={dayjs(new Date()).format('DD/MM/YYYY')}
            format={'DD/MM/YYYY'}
          />
        </div> */}
      </div>
    ),
  });

  useEffect(() => {
    handleChange();
  }, [filterParams]);

  const [imageUrl, setImageUrl] = useState(data?.imageUrl || '');

  const handleSubmit = async (value) => {
    const { material, enclose, bite, line, span } = value;
    const laboSpecificationsArr = [material, enclose, bite, line, span];
    const laboSpecifications = laboSpecificationsArr.map((i) => (i ? { parameterId: i } : undefined)).filter(Boolean);
    const dataCreate = {
      customer: { uuid: idCus },
      saleOrderNumber: value.treatment,
      soUuid: data?.soUuid ?? value?.soUuid ?? record?.uuid,
      soServiceItemUuid: value.soServiceItemUuid,
      status: statusLabo,
      supplier: { uuid: value.providerLabo },
      doctor: { id: value.doctor },
      type: 'NEW',
      timeSend: value.timeSend ? dayjs(value.timeSend).format('YYYY-MM-DD HH:mm:ss') : null,
      timeReceive: value.timeReceive ? dayjs(value.timeReceive).format('YYYY-MM-DD HH:mm:ss') : null,
      prostheticsType: value.prostheticsType,
      brand: value.brand,
      teeth: type === 'addNew' ? value.teeth && value.teeth.map((i) => i.teethNumber) : value.teeth,
      color: value.color,
      quantity: value.quantity,
      price: value.price || price,
      total: value.total ?? form.getFieldValue('price') * form.getFieldValue('quantity'),
      point: value.point,
      note: value.note,
      imageUrl,
      techNote: value.techNote,
      laboSpecifications,
    };
    if (statusLabo === 'RECEIVED') {
      dataCreate.realTimeReceive = value.realTimeReceive
        ? dayjs(value.realTimeReceive).format('YYYY-MM-DD hh:mm:ss')
        : null;
      dataCreate.warrantyNo = value.warrantyNo ?? null;
      dataCreate.warrantyPeriod = value.warrantyPeriod
        ? dayjs(value.warrantyPeriod).format('YYYY-MM-DD hh:mm:ss')
        : null;
    }

    let res;
    type === 'edit'
      ? (res = await LaboService.put({ ...dataCreate, uuid: laboId }))
      : (res = await LaboService.post(dataCreate));
    if (res) {
      handleChange();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (type === 'edit') {
        if (!root) {
          return navigate({
            search: createSearchParams({
              id: idCustomer ?? idCus,
              tab: 'Labo',
              type: 'detail',
            }).toString(),
          });
        } else {
          return navigate('/labo');
        }
      } else {
        return navigate({
          search: createSearchParams({
            id: idCustomer ?? idCus,
            tab: 'Labo',
            type: 'detail',
          }).toString(),
        });
      }
    }
  };

  const handleSubmitModalReceive = async (value) => {
    if (step === 2) {
      const dataReceive = {
        uuid: data?.uuid,
        realTimeReceive: dayjs(value.realTimeReceive).format('YYYY-MM-DD HH:mm:ss'),
        warrantyNo: value.warrantyNo,
        warrantyPeriod: value.warrantyPeriod ? dayjs(value.warrantyPeriod).format('YYYY-MM-DD HH:mm:ss') : null,
      };
      const res = await LaboService.receiveLabo(dataReceive);
      setOpenModal(false);
      if (res) {
        setStep(3);
        await LaboService.getById({ uuid: laboId }).then((res) => setData(res));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
    if (step === 3) {
      setOpenModal(false);
      confirmExport(value);
    }
  };

  const confirmExport = async (value) => {
    return Message.confirm({
      text: 'Phiếu Labo đã xuất cho khách không thể xóa và chỉnh sửa. Bạn chắc chắn muốn xuất Labo cho khách ?',
      title: 'Thông báo',
      onConfirm: async () => {
        const dataExport = {
          uuid: data?.uuid,
          timeExport: dayjs(value.timeExport ?? form.getFieldValue('timeExport')).format('YYYY-MM-DD HH:mm:ss'),
        };

        const res = await LaboService.exportLabo(dataExport);
        if (res) {
          setStep(4);
          await LaboService.getById({ uuid: laboId }).then((res) => setData(res));
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },
    });
  };

  return (
    <div id="labo">
      <Modal
        destroyOnClose={true}
        title={`Thông tin ${step === 2 ? 'nhận' : 'xuất'} Labo`}
        open={openModal}
        footer={null}
        className="min-w-min pb-0"
        closable={false}
        width={636}
      >
        <Form form={formReceiv} colon={false} className="min-w-min" onFinish={handleSubmitModalReceive}>
          {step === 2 ? (
            <>
              <Form.Item
                className="w-full"
                name="realTimeReceive"
                label={`Thời gian nhận thực tế`}
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn thời gian nhận thực tế.',
                  },
                ]}
              >
                <DatePicker
                  className="!w-full border rounded-lg !bg-white  border-gray-200"
                  format="DD/MM/YYYY hh:mm:ss"
                  placeholder="DD/MM/YYYY HH:MM:SS"
                />
              </Form.Item>
              <Form.Item className="w-full" name="warrantyNo" label="Mã bảo hành">
                <Input
                  className="h-10 w-full text-sm font-normal block  rounded-lg border border-gray-200  py-[7px] px-4 "
                  placeholder="Vui lòng nhập mã bảo hành"
                />
              </Form.Item>

              <Form.Item className="w-full" name="warrantyPeriod" label="Hạn bảo hành" placeholder="DD/MM/YYYY">
                <DatePicker className="!w-full border rounded-lg !bg-white  border-gray-200" format="DD/MM/YYYY" />
              </Form.Item>
            </>
          ) : (
            <Form.Item
              className="w-full"
              name="timeExport"
              label="Thời gian xuất"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn thời gian xuất.',
                },
              ]}
            >
              <DatePicker
                className="!w-full border rounded-lg !bg-white  border-gray-200"
                format="DD/MM/YYYY hh:mm:ss"
                placeholder="DD/MM/YYYY HH:MM:SS"
              />
            </Form.Item>
          )}
          <Form.Item>
            <div className="flex items-center justify-center  border-solid gap-6 border-slate-200 rounded-b">
              <button
                className="active:ring-2 ring-offset-1 ring-offset-gray-300 ring-gray-300 bg-white text-gray-500 border-gray-400 border !rounded-lg px-16 py-2 text-base font-medium  "
                type="button"
                onClick={() => {
                  setOpenModal(false);
                }}
              >
                Hủy
              </button>
              <button
                className="text-white bg-red-500 active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300 rounded-lg px-16 py-2 text-base font-medium  hover:bg-red-600 hover:border-transparent outline-none focus:outline-none "
                type="submit"
              >
                Lưu
              </button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      <>
        {type === 'addNew' || type === 'edit' ? (
          <div>
            <div className="flex justify-between flex-col lg:flex-row">
              <div className="text-lg font-bold mb-4 w-full sm:w-1/3">Cập nhật phiếu Labo</div>
              <div>
                <Steps current={step} labelPlacement="vertical" className="w-full  lg:w-[44%] " size="small">
                  <Step title="Nháp" />
                  <Step title="Đặt hàng" />
                  <Step title="Đã nhận" />
                  <Step title="Đã xuất" />
                </Steps>
              </div>
            </div>
            <div className="text-md font-bold">Thông tin chung</div>
            <Form colon={false} form={form} onFinish={handleSubmit} initialValues={data}>
              <div>
                <div>
                  <div className="w-full flex flex-col sm:flex-row justify-between gap-4 items-center">
                    <Form.Item className="w-full sm:w-4/12" label="Khách hàng" name="customer">
                      <Input
                        disabled
                        className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                      />
                    </Form.Item>
                    <Form.Item className="w-full sm:w-4/12" label="Số phiếu điều trị" name="treatment">
                      <Input
                        disabled
                        className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                      />
                    </Form.Item>
                    <Form.Item
                      className="w-full sm:w-4/12"
                      label="Nhà cung cấp Labo"
                      name="providerLabo"
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng chọn nhà cung cấp.',
                        },
                      ]}
                    >
                      <Select
                        disabled={step > 1 || viewOnly}
                        className="w-full !rounded-lg"
                        placeholder="Chọn nhà cung cấp"
                        allowClear
                        options={list.supplier?.map((i) => ({ value: i.uuid, label: i.name }))}
                      ></Select>
                    </Form.Item>
                  </div>
                  <div className="w-full flex  flex-col sm:flex-row justify-between gap-4">
                    <Form.Item
                      className="w-full sm:w-4/12"
                      label="Bác sĩ"
                      name="doctor"
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng chọn nhà bác sĩ.',
                        },
                      ]}
                    >
                      <Select
                        disabled={step > 1 || viewOnly}
                        className="w-full !rounded-lg"
                        placeholder="Bác sĩ"
                        allowClear
                        options={list.doctor?.map((i) => ({ value: i.id, label: `${i.firstName} ${i.lastName}` }))}
                      ></Select>
                    </Form.Item>
                    <Form.Item
                      className="w-full sm:w-4/12"
                      label="Thời gian gửi"
                      name="timeSend"
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng chọn thời gian gửi.',
                        },
                      ]}
                    >
                      <DatePicker
                        placeholder="Thời gian gửi"
                        disabled={step > 1 || viewOnly}
                        className="!w-full border rounded-lg  border-gray-200"
                        format="DD/MM/YYYY hh:mm:ss"
                      />
                    </Form.Item>
                    <Form.Item className="w-full sm:w-4/12" label="Thời gian nhận dự kiến" name="timeReceive">
                      <DatePicker
                        disabled={step >= 3 || viewOnly}
                        placeholder="Thời gian nhận dự kiến"
                        className={`!w-full border rounded-lg  border-gray-200`}
                        format="DD/MM/YYYY hh:mm:ss"
                      />
                    </Form.Item>
                  </div>
                  <div className="w-full flex justify-between gap-4">
                    {/* <Form.Item
                      className="w-6/12"
                      name="serviceCategoryUuid"
                      label="Nhóm dịch vụ"
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: 'Chọn nhóm dịch vụ',
                      //   },
                      // ]}
                    >
                      <Select
                        options={listCategoryService?.map((ele) => ({ value: ele.uuid, label: ele.name })) ?? []}
                        className=" !rounded-lg"
                        placeholder="Chọn nhóm dịch vụ"
                        onChange={async (e) => {
                          const serviceRes = await MasterDataService.getAllService({ categoryUuid: e });
                          setListService(serviceRes);
                          form.resetFields(['productServiceDto'])
                        }}
                      ></Select>
                    </Form.Item> */}
                    <Form.Item
                      className="w-4/12"
                      name="soServiceItemUuid"
                      label="Dịch vụ"
                      rules={[
                        {
                          required: true,
                          message: 'Chọn dịch vụ',
                        },
                      ]}
                    >
                      <Select
                        // disabled={!form.getFieldValue('serviceCategoryUuid')}
                        disabled={viewOnly}
                        options={
                          listServiceBySaleOrderCheck?.map((ele) => ({ value: ele.uuid, label: ele.name })) ?? []
                        }
                        className=" !rounded-lg"
                        placeholder="Chọn dịch vụ"
                      ></Select>
                    </Form.Item>
                    <div className="w-4/12"></div>
                    <div className="w-4/12"></div>
                  </div>
                  <div className="w-full flex  flex-col sm:flex-row  gap-4">
                    {data?.realTimeReceive ? (
                      <Form.Item className="w-full sm:w-4/12" label="Thời gian nhận thực tế" name="realTimeReceive">
                        <DatePicker
                          disabled={step >= 3 || viewOnly}
                          placeholder="Thời gian nhận thực tế"
                          className={`!w-full border rounded-lg  border-gray-200`}
                          format="DD/MM/YYYY hh:mm:ss"
                        />
                      </Form.Item>
                    ) : null}
                    {data?.timeExport ? (
                      <Form.Item className="w-full sm:w-4/12" label="Ngày xuất" name="timeExport">
                        <DatePicker
                          disabled={step >= 3 || viewOnly}
                          // placeholder="Ngày xuất"
                          className={`!w-full border rounded-lg  border-gray-200`}
                          format="DD/MM/YYYY hh:mm:ss"
                        />
                      </Form.Item>
                    ) : null}
                  </div>
                  <h2 className="text-md font-bold">Chi tiết phiếu</h2>
                  <div className="w-full flex  flex-col sm:flex-row justify-between gap-4">
                    <Form.Item className="w-full sm:w-4/12" label="Loại phục hình" name="prostheticsType">
                      <Input
                        disabled={step >= 3 || viewOnly}
                        className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                      />
                    </Form.Item>
                    <Form.Item className="w-full sm:w-4/12" label="Hãng" name="brand">
                      <Input
                        disabled={step >= 3 || viewOnly}
                        className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                      />
                    </Form.Item>

                    <Form.Item className="w-full sm:w-4/12" label="Răng" name="teeth">
                      {/* <Input
                        disabled
                        placeholder={record?.teeth?.map((i) => i)}
                        className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                      /> */}
                      <div className="flex items-center w-full h-[40px] bg-[#F4F4F5] border border-[#E4E4E7] rounded-lg gap-[6px] pl-[6px]">
                        {form.getFieldValue('teeth')?.map((i) => (
                          <div
                            key={i}
                            className="w-[39px] h-8 flex justify-center items-center text-[#A3A3A3] border border-[#D1D5DB] rounded-lg"
                          >
                            {i?.teethNumber || i}
                          </div>
                        ))}
                      </div>
                    </Form.Item>
                  </div>
                  <div className="w-full flex  flex-col sm:flex-row justify-between gap-4">
                    <Form.Item className="w-full sm:w-4/12" label="Màu răng chi tiết" name="color">
                      <Input
                        disabled={step > 1 || viewOnly}
                        placeholder="Nhập màu răng"
                        className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                      />
                    </Form.Item>
                    <Form.Item
                      className="w-full sm:w-4/12"
                      label="Số lượng"
                      name="quantity"
                      rules={[
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || /^[0-9]+$/.test(value)) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('Vui lòng chỉ nhập số.'));
                          },
                        }),
                      ]}
                    >
                      <InputNumber
                        formatter={(value) => {
                          if (!value) {
                            return;
                          }
                          return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                        }}
                        parser={(value) => {
                          if (!value) {
                            return;
                          }
                          return Number.parseFloat(value.replace(/\$\s?|(\.*)/g, ''));
                        }}
                        onKeyDown={blockInvalidChar}
                        disabled={step > 1 || viewOnly}
                        placeholder="Nhập số lượng"
                        // onChange={() => setTotal((form.getFieldValue('quantity') || 0) * 5000000)}
                        onChange={(e) => setQty(e)}
                        className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-2 pt-[4px] focus:outline-none"
                      />
                    </Form.Item>
                    <Form.Item className="w-full sm:w-4/12" label="Đơn giá" name="price">
                      <InputNumber
                        formatter={(value) => {
                          if (!value) {
                            return;
                          }
                          return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                        }}
                        parser={(value) => {
                          if (!value) {
                            return;
                          }
                          return Number.parseFloat(value.replace(/\$\s?|(\.*)/g, ''));
                        }}
                        disabled={step > 1 || viewOnly}
                        onKeyDown={blockInvalidChar}
                        onChange={(e) => setPrice(e)}
                        className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-2 pt-[4px] focus:outline-none"
                      />
                    </Form.Item>
                  </div>
                  <div className="w-full flex  flex-col sm:flex-row justify-between gap-4">
                    <Form.Item className="w-full sm:w-4/12" label="Thành tiền" name="total">
                      <InputNumber
                        disabled
                        formatter={(value) => {
                          if (!value) {
                            return;
                          }
                          return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                        }}
                        parser={(value) => {
                          if (!value) {
                            return;
                          }
                          return Number.parseFloat(value.replace(/\$\s?|(\.*)/g, ''));
                        }}
                        onKeyDown={blockInvalidChar}
                        className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-2 pt-[4px] focus:outline-none"
                      />
                    </Form.Item>
                    <Form.Item className="w-full sm:w-4/12" label="Chỉ định" name="point">
                      <Input
                        // placeholder='Nhập chỉ định'
                        disabled={step > 1 || viewOnly}
                        className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                      />
                    </Form.Item>
                    <Form.Item className="w-full sm:w-4/12" label="Ghi chú" name="note">
                      <Input
                        // placeholder='Nhập chỉ định'
                        disabled={step > 1 || viewOnly}
                        className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                      />
                    </Form.Item>
                  </div>

                  <h2 className="text-md font-bold">Hình ảnh</h2>
                  <div className="w-[120px] h-[120px] my-3">
                    {!imageUrl ? (
                      <div>
                        {canEdit ? (
                          <>
                            <Upload
                              disabled={viewOnly}
                              onlyImage={true}
                              maxSize={50}
                              action={async (file) => {
                                const urlArr = await UtilService.post(file);
                                setImageUrl(urlArr ?? '');
                              }}
                            >
                              <div
                                className={
                                  'cursor-pointer border border-dashed border-gray-500 rounded-xl ' +
                                  '!rounded-2xl h-[120px] w-full aspect-square object-cover flex items-center justify-center'
                                }
                              >
                                <div className={'text-center ' + ''}>
                                  <i className={`las la-image text-3xl`}></i>

                                  <p className="text-xs text-gray-700 ">
                                    <span className="">Thêm ảnh</span>
                                  </p>
                                </div>
                              </div>
                            </Upload>
                            <i className="las la-upload absolute icon-upload top-1/2 left-1/2 hidden text-4xl -translate-x-2/4 -translate-y-2/4 "></i>
                          </>
                        ) : (
                          <div
                            className={
                              'border border-dashed border-gray-500 rounded-xl ' +
                              '!rounded-2xl h-[120px] w-full aspect-square object-cover'
                            }
                          >
                            <div className={'text-center ' + ''}>
                              <i className="las la-image text-2xl"></i>
                              {showText === true ? (
                                <p className="text-xs text-gray-700 ">
                                  <span className="">Thêm ảnh</span>
                                </p>
                              ) : (
                                <></>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <div>
                          {!imageUrl ? (
                            <Spin text={'Đang tải ...'} />
                          ) : (
                            <div
                              className={classNames(
                                'bg-cover bg-center rounded-[10px] relative',
                                '!rounded-2xl h-[120px] w-full aspect-square object-cover',
                                {
                                  canEdit: 'cursor-pointer ',
                                },
                              )}
                              // style={{ backgroundImage: 'url(' + imageUrl + ')' }}
                            >
                              <div>
                                <img
                                  src={imageUrl}
                                  alt=""
                                  className="w-full h-[120px] block rounded-[10px] object-cover z-10"
                                />
                              </div>
                              <div className="flex justify-end absolute right-2 top-2 z-20">
                                {canEdit ? (
                                  <i
                                    className={'las la-times text-right hover:scale-150 ' + 'text-base'}
                                    onClick={() => removeImg()}
                                  ></i>
                                ) : null}
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  <h2 className="text-md font-bold">Thông số Labo</h2>
                  <div className="w-full flex  flex-col sm:flex-row justify-between gap-4">
                    <Form.Item className="w-full sm:w-4/12" label="Vật liệu" name="material">
                      <Select
                        disabled={step > 1 || viewOnly}
                        className="w-full !rounded-lg"
                        placeholder="Chọn vật liệu"
                        allowClear
                        options={list.material.map((i) => ({ value: i.id, label: i.name }))}
                      ></Select>
                    </Form.Item>
                    <Form.Item className="w-full sm:w-4/12" label="Đường hoàn tất" name="enclose">
                      <Select
                        className="w-full !rounded-lg"
                        placeholder="Đường hoàn tất"
                        allowClear
                        disabled={step > 1 || viewOnly}
                        options={list.line.map((i) => ({ value: i.id, label: i.name }))}
                      ></Select>
                    </Form.Item>
                    <Form.Item className="w-full sm:w-4/12" label="Khớp cắn" name="bite">
                      <Select
                        disabled={step > 1 || viewOnly}
                        className="w-full !rounded-lg"
                        placeholder="Khớp cắn"
                        allowClear
                        options={list.bite.map((i) => ({ value: i.id, label: i.name }))}
                      ></Select>
                    </Form.Item>
                  </div>
                  <div className="w-full flex  flex-col sm:flex-row justify-between gap-4">
                    <Form.Item className="w-full sm:w-4/12" label="Kiểu nhịp" name="line">
                      <Select
                        className="w-full !rounded-lg"
                        placeholder="Kiểu nhịp"
                        allowClear
                        options={list.span.map((i) => ({ value: i.id, label: i.name }))}
                        disabled={step > 1 || viewOnly}
                      ></Select>
                    </Form.Item>
                    <Form.Item className="w-full sm:w-4/12" label="Gửi kèm" name="span">
                      <Select
                        disabled={step > 1 || viewOnly}
                        className="w-full !rounded-lg"
                        placeholder="Gửi kèm"
                        allowClear
                        options={list.enclose.map((i) => ({ value: i.id, label: i.name }))}
                      ></Select>
                    </Form.Item>
                    <Form.Item className="w-full sm:w-4/12" label="Ghi chú kỹ thuật" name="techNote">
                      <Input
                        disabled={step > 1 || viewOnly}
                        // placeholder='Nhập chỉ định'
                        className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                      />
                    </Form.Item>
                  </div>

                  {step >= 3 && (
                    <>
                      <h2 className="text-md font-bold mb-2">Thông tin bảo hành</h2>
                      <div className="w-full flex  flex-col sm:flex-row justify-between gap-4">
                        <Form.Item className="w-full sm:w-4/12" label="Mã bảo hành" name="warrantyNo">
                          <Input
                            disabled={step === 4 || viewOnly}
                            className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200 py-[7px] px-4 focus:outline-none"
                          />
                        </Form.Item>
                        <Form.Item className="w-full sm:w-4/12" label="Hạn bảo hành" name="warrantyPeriod">
                          <DatePicker
                            disabled={step === 4 || viewOnly}
                            className={`!w-full border rounded-lg border-gray-200`}
                            format="DD/MM/YYYY"
                          />
                        </Form.Item>
                        <div className="w-4/12"></div>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex items-center justify-center sm:justify-between mt-4 mb-7 flex-col sm:flex-row">
                  <button
                    type="button"
                    className="w-full sm:w-[125px] h-[44px] rounded-lg border border-zinc-400 text-center mb-2 sm:mb-0"
                    onClick={() => {
                      if (!root) {
                        return navigate({
                          search: createSearchParams({
                            id: idCustomer ?? idCus,
                            tab: 'Labo',
                            type: 'detail',
                          }).toString(),
                        });
                      } else {
                        navigate('/labo');
                      }
                    }}
                  >
                    Trở về
                  </button>
                  {viewOnly ? (
                    <div className="w-full"></div>
                  ) : (
                    <div className="w-full">
                      {/* <button
                      className="w-[130px] h-[44px] rounded-lg flex items-center justify-center border border-rose-500 text-center text-rose-500 mr-4"
                      onClick={() => window.history.back()}
                    >
                      {exportIcons('PRINTBTN')} <span className="ml-2">In phiếu</span>
                    </button> */}
                      {step === 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-end">
                          <button
                            type="submit"
                            className="w-full sm:w-[113px] h-[44px] rounded-lg  border border-rose-500 text-center text-white  bg-rose-500 mr-0 sm:mr-4 mb-2 sm:mb-0"
                          >
                            Lưu
                          </button>
                          <button
                            type="submit"
                            onClick={() => setStatusLabo('ORDER')}
                            className="mb-2 sm:mb-0 w-full sm:w-[113px] h-[44px] rounded-lg  border border-rose-500 text-center text-white  bg-rose-500"
                          >
                            Đặt hàng
                          </button>
                        </div>
                      )}

                      {/* {data && step === 1 && (
                      <button
                        type="button"
                        onClick={handeleUpdate}
                        className="w-[113px] h-[44px] rounded-lg flex items-center justify-center border border-rose-500 text-center text-white  bg-rose-500"
                      >
                        Đặt hàng
                      </button>
                    )} */}
                      {step === 2 && (
                        <div className="flex flex-col sm:flex-row items-center justify-end">
                          <button
                            type="submit"
                            className="w-[113px] h-[44px] rounded-lg flex items-center justify-center border border-rose-500 text-center text-white  bg-rose-500 mr-4"
                          >
                            Cập nhật
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setOpenModal(true);
                            }}
                            className="w-[113px] h-[44px] rounded-lg flex items-center justify-center border border-rose-500 text-center text-white  bg-rose-500 mr-4"
                          >
                            Nhận Labo
                          </button>
                        </div>
                      )}
                      {step >= 3 && step !== 4 && (
                        <div className="flex flex-col sm:flex-row items-center justify-end">
                          <button
                            type="submit"
                            onClick={() => setStatusLabo('RECEIVED')}
                            className="w-[113px] h-[44px] rounded-lg flex items-center justify-center border border-rose-500 text-center text-white  bg-rose-500 mr-4"
                          >
                            Cập nhật
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setOpenModal(true);
                            }}
                            className="w-[113px] h-[44px] rounded-lg flex items-center justify-center border border-rose-500 text-center text-white  bg-rose-500 mr-4"
                          >
                            Xuất Labo
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Form>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg text-zinc-600 my-5">{'Danh sách phiếu Labo'.toUpperCase()}</h2>
            </div>
            <div>{DataTable()}</div>
            <div className="mt-6">
              <button
                className="w-full sm:w-[125px] h-[44px] rounded-lg border border-zinc-400 text-center"
                onClick={() => navigate(-1)}
              >
                Trở về
              </button>
            </div>
          </div>
        )}
      </>
    </div>
  );
}

export default Labo;
