import { DatePicker, Form, Input, Select, Steps, Checkbox, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import './index.less';
import TableDetailInventoryControl from './TableDetailInventoryControl';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { WarehousingBill } from 'services/warehousing-bill';
import moment from 'moment';
import { MaterialMedicineService } from 'services/material-medicine';
import { Message } from 'components';
import { InventoryCriteriaService } from 'services/inventory-criteria';
import { TableWarehousingProduct } from './TableMechine';
import { routerLinks } from 'utils';
import { isNullOrUndefinedOrEmpty } from 'utils/func';
import { useLocation } from 'react-router';

const { Step } = Steps;
function Page() {
  const branchUuid = localStorage.getItem('branchUuid');
  const [searchParams] = useSearchParams();

  const uuid = searchParams.get('uuid') ?? null;
  const navigate = useNavigate();
  const [form] = Form.useForm();
  // const [detailUuid, setDetailUuid] = useState(null)
  const status = {
    DRAFT: 1,
    IN_PROGRESS: 2,
    COMPLETED: 3,
  };
  const [data, setData] = useState({});
  const [step, setStep] = useState(status[data?.status] || 1);
  const [dataSource, setDataSource] = useState([]);
  const [billType, setBillType] = useState('ALL');
  const [groupProduct, setProductProduct] = useState([]);
  const [InventoryCriteria, setInventoryCreterua] = useState([]);
  const [type, setType] = useState(1);
  const location = useLocation();
  useEffect(() => {
    const getGroupProduct = async () => {
      const res = await MaterialMedicineService.getAllGroup({ branchUuid });
      setProductProduct(res);
    };
    const getAll = async () => {
      const res = await InventoryCriteriaService.getAll({ branchUuid });
      setInventoryCreterua(res?.data);
    };
    if (billType === 'GROUP') {
      getGroupProduct();
    }
    if (billType === 'CRITERIA') {
      getAll();
    }
  }, [location.pathname, billType]);

  useEffect(() => {
    const getDetailData = async () => {
      if (uuid) {
        const res = await WarehousingBill.getDetailInventoryBill(uuid);
        setData(res);
        setStep(status[res?.status] || 1);
        setBillType(res?.billType);
        setDataSource(res?.inventoryBillItemDtoList);
        form.setFieldsValue({ ...res, date: moment(res?.date) });
      }
    };
    !!uuid && getDetailData();
  }, [uuid, location.pathname]);

  const startInventoryBill = async (uuid) => {
    if (!uuid) return null;
    try {
      const values = await form.validateFields();
      if (values) {
        const res = await WarehousingBill.createOrSaveInventoryBill({
          ...values,
          outOfStock: values.outOfStock ?? false,
          date: values.date ? moment(values.date).format('YYYY-MM-DD hh:mm:ss') : null,
          uuid,
          branchUuid,
          status: 'DRAFT',
          inventoryBillItemDtoList:
            billType === 'MANUAL' ? dataSource.map((i) => ({ ...i })) : dataSource?.map((i) => i),
        });
        if (res && res.statusCode === 200) {
          return await WarehousingBill.startInventoryBill(uuid).then(async (result) => {
            const response = await WarehousingBill.getDetailInventoryBill(res?.data);
            if (response) {
              setBillType(response?.billType);
              setData(response);
              setDataSource(response?.inventoryBillItemDtoList);
              form.setFieldsValue({ ...response, date: moment(response?.date) });
              setStep(status[response?.status] || 1);
            }
          });
        }
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const confirmInventoryBill = async (uuid) => {
    if (!uuid) return null;
    try {
      const values = await form.validateFields();
      if (values) {
        const res = await WarehousingBill.createOrSaveInventoryBill({
          ...values,
          outOfStock: values.outOfStock ?? false,
          date: values.date ? moment(values.date).format('YYYY-MM-DD hh:mm:ss') : null,
          uuid,
          branchUuid,
          isVerified: true,
          inventoryBillItemDtoList: dataSource?.map((i) => i),
          status: 'IN_PROGRESS',
        });
        if (res && res.statusCode === 200) {
          const response = await WarehousingBill.getDetailInventoryBill(res?.data ?? uuid);
          if (response) {
            setData(response);
            setBillType(response?.billType);
            setDataSource(response?.inventoryBillItemDtoList ?? []);
            form.setFieldsValue({ ...response, date: moment(response?.date) });
            setStep(status[response?.status] || 1);
          }
        }
      }
    } catch (error) {
      console.log('error', error);
    }
  };
  const cancelInventoryBill = async (uuid) => {
    if (!uuid) return null;
    return Message.confirm({
      title: 'Thông báo',
      text: 'Bạn có chắc chắn hủy phiếu kiểm kho ?',
      onConfirm: async () => {
        const res = await WarehousingBill.cancelInventoryBill(uuid);
        if (res && res.statusCode === 200) {
          const response = await WarehousingBill.getDetailInventoryBill(uuid);
          if (response) {
            setData(response);
            setBillType(response?.billType);
            setDataSource(response?.inventoryBillItemDtoList ?? []);
            form.setFieldsValue({ ...response, date: moment(response?.date) });
            setStep(status[response?.status] || 1);
          }
        }
      },
    });
  };

  const handleSubmit = async (values) => {
    const dataSend = {
      billType: values.billType,
      date: values.date ? moment(values.date).format('YYYY-MM-DD hh:mm:ss') : null,
      note: values.note,
      outOfStock: values.outOfStock ?? false,
      branchUuid,
      isVerified: false,
      buildTypeUuid: values.buildTypeUuid ?? null,
      inventoryBillItemDtoList: dataSource?.map((i) => ({ ...i })),
      status: data?.status,
    };

    if (data?.uuid) {
      await WarehousingBill.createOrSaveInventoryBill({ ...dataSend, uuid: data?.uuid ?? uuid }).then(
        async (result) => {
          Message.success({
            text: 'Chỉnh sửa phiếu kiểm kho thành công.',
            title: 'Thành Công',
            cancelButtonText: 'Đóng',
          });
          const res = await WarehousingBill.getDetailInventoryBill(result.data);
          if (res) {
            setData(res);
            setStep(status[res?.status] || 1);
            setBillType(res?.billType);
            setDataSource(res?.inventoryBillItemDtoList ?? []);
            form.setFieldsValue({ ...res, date: moment(res?.date) });
          }
        },
      );
    } else {
      await WarehousingBill.createOrSaveInventoryBill({ ...dataSend, uuid: null }).then(async (result) => {
        Message.success({ text: 'Tạo phiếu kiểm kho thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
        const res = await WarehousingBill.getDetailInventoryBill(result.data);
        if (res) {
          setData(res);
          setStep(status[res?.status] || 1);
          setBillType(res?.billType);
          setDataSource(res?.inventoryBillItemDtoList ?? []);
          form.setFieldsValue({ ...res, date: moment(res?.date) });
          return navigate(routerLinks('InventoryControlCreate') + `?uuid=${res?.uuid ?? result.data}`);
        }
      });
    }
  };
  const calculatorAmount = (a, b) => {
    if (isNullOrUndefinedOrEmpty(a) || isNullOrUndefinedOrEmpty(b)) {
      return 0;
    }
    return Math.abs(a - b);
  };
  return (
    <div className="min-h-screen">
      <div className="bg-white p-4 rounded-lg inventoryControl">
        <div>
          <h2 className="font-bold text-lg mb-4">Quản lý kho</h2>
          <div className="flex justify-between flex-col lg:flex-row">
            <div className="text-lg font-bold mb-4 w-full sm:w-1/3 text-zinc-600">Thêm phiếu kiểm kho</div>
            <Steps current={step} labelPlacement="vertical" className="w-full  lg:w-[44%] " size="small">
              <Step title="Nháp" />
              <Step title="Đang xử lý" />
              <Step title="Hoàn thành" />
            </Steps>
          </div>
          <div className="text-base font-bold text-zinc-600">Thông tin chung</div>
          <Form
            colon={false}
            form={form}
            onFinish={handleSubmit}
            initialValues={data}
            onFinishFailed={({ errorFields }) =>
              errorFields.length && form.scrollToField(errorFields[0].name, { behavior: 'smooth' })
            }
          >
            <div>
              <div>
                <div className="w-full flex flex-col sm:flex-row justify-between gap-4 items-center">
                  <Form.Item
                    className="w-full sm:w-4/12"
                    label="Kiểm kho"
                    name="billType"
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng chọn kiểm kho.',
                      },
                    ]}
                  >
                    <Select
                      disabled={step > 1}
                      className="w-full !rounded-lg"
                      placeholder="Tất cả sản phẩm"
                      allowClear
                      onChange={(v) => setBillType(v)}
                      options={[
                        {
                          label: 'Tất cả sản phẩm',
                          value: 'ALL',
                        },
                        {
                          label: 'Nhóm sản phẩm',
                          value: 'GROUP',
                        },
                        {
                          label: 'Chọn sản phẩm thủ công',
                          value: 'MANUAL',
                        },
                        {
                          label: 'Tiêu chí kiểm kho',
                          value: 'CRITERIA',
                        },
                      ]}
                    ></Select>
                  </Form.Item>
                  <Form.Item
                    className="w-full sm:w-4/12"
                    label="Ngày xuất"
                    name="date"
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng chọn ngày xuất.',
                      },
                    ]}
                    initialValue={moment()}
                  >
                    <DatePicker
                      // defaultValue={moment()}
                      disabled={step > 1}
                      placeholder="DD/MM/YYYY"
                      className={`!w-full border rounded-lg !bg-white border-gray-200`}
                      format="DD/MM/YYYY"
                      disabledDate={(current) => {
                        return current && current > moment().endOf('day');
                      }}
                    />
                  </Form.Item>
                  <Form.Item className="w-full sm:w-4/12" label="Ghi chú" name="note">
                    <Input
                      disabled={step > 1}
                      placeholder="Nhập ghi chú"
                      className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                    />
                  </Form.Item>
                </div>
                <div className="w-full flex flex-col sm:flex-row justify-between gap-4 items-center">
                  {billType === 'GROUP' && (
                    <Form.Item
                      className="w-full sm:w-4/12"
                      label="Nhóm sản phẩm"
                      name="buildTypeUuid"
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng chọn nhóm sản phẩm.',
                        },
                      ]}
                    >
                      <Select
                        disabled={step > 1}
                        className="w-full !rounded-lg"
                        placeholder="Chọn nhóm sản phẩm"
                        allowClear
                        options={groupProduct?.map((i) => ({ label: i.name, value: i.uuid }))}
                      ></Select>
                    </Form.Item>
                  )}
                  {billType === 'CRITERIA' && (
                    <Form.Item
                      className="w-full sm:w-4/12"
                      label="Tiêu chí kiểm kho"
                      name="buildTypeUuid"
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng chọn tiêu chí kiểm kho.',
                        },
                      ]}
                    >
                      <Select
                        disabled={step > 1}
                        className="w-full !rounded-lg"
                        placeholder="Chọn tiêu chí kiểm kho"
                        allowClear
                        options={InventoryCriteria?.map((i) => ({ label: i.name, value: i.uuid }))}
                      ></Select>
                    </Form.Item>
                  )}
                </div>

                <div>
                  <Form.Item name="outOfStock" valuePropName="checked">
                    <Checkbox disabled={step > 1}>Bao gồm sản phẩm hết hàng</Checkbox>
                  </Form.Item>
                </div>
                {(step === 2 || step === 3) && (
                  <div className="p-4 border border-gray-300 rounded-lg">
                    <Tabs defaultActiveKey={1} onTabClick={(e) => setType(e)}>
                      <Tabs.TabPane tab="Chi tiết kiểm kho" key="1">
                        {billType === 'MANUAL' ? (
                          <>
                            {data?.status === 'COMPLETED' || +step === 3 ? (
                              <TableDetailInventoryControl
                                dataSource={dataSource}
                                setDataSource={setDataSource}
                                pageType="create"
                                status={data?.status}
                              />
                            ) : (
                              <TableWarehousingProduct
                                warehousingProductDtoList={dataSource}
                                setWarehousingProductDtoList={setDataSource}
                              />
                            )}
                          </>
                        ) : (
                          <TableDetailInventoryControl
                            dataSource={dataSource.map((i, idx) => ({ ...i, key: idx }))}
                            setDataSource={setDataSource}
                            pageType="create"
                            status={data?.status}
                          />
                        )}
                      </Tabs.TabPane>
                      {data?.status === 'COMPLETED' ? (
                        <Tabs.TabPane tab="Kết quả điều chỉnh" key="2">
                          <TableDetailInventoryControl
                            dataSource={dataSource
                              ?.filter((i) => i?.stockQuantity !== i?.realStockQuantity)
                              ?.map((i) => ({
                                ...i,
                                amountOfDifference: calculatorAmount(i?.stockQuantity, i?.realStockQuantity),
                              }))}
                            setDataSource={setDataSource}
                            pageType="create"
                            status={data?.status}
                            type={type}
                          />
                        </Tabs.TabPane>
                      ) : null}
                    </Tabs>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center sm:justify-between mt-4 mb-7 flex-col sm:flex-row">
                <button
                  type="button"
                  className="w-full sm:w-[125px] h-[44px] rounded-lg border border-zinc-400 text-center mb-2 sm:mb-0"
                  onClick={() => navigate(routerLinks('InventoryManagement') + `?tab=InventoryControl`)}
                >
                  Trở về
                </button>
                <div className="w-full">
                  {step === 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-end">
                      {data?.status === 'DRAFT' ? (
                        <button
                          type="button"
                          className="w-[130px] h-[44px] rounded-lg flex items-center justify-center border border-rose-500 text-center text-rose-500 mr-4"
                          onClick={() => startInventoryBill(data?.uuid ?? uuid)}
                        >
                          <span className="ml-2">Kiểm kho</span>
                        </button>
                      ) : null}
                      {/* <button
                        type="submit"
                        className="w-[130px] h-[44px] rounded-lg flex items-center justify-center border border-rose-500 text-center text-rose-500 mr-4"
                        onClick={() => window.history.back()}
                      >
                        {exportIcons('PRINTBTN')} <span className="ml-2">In phiếu</span>
                      </button> */}
                      <button
                        type="submit"
                        className="w-[130px] h-[44px] rounded-lg flex items-center justify-center border bg-rose-500 border-rose-500 text-center text-white mr-4"
                      >
                        <span className="ml-2">Lưu phiếu</span>
                      </button>
                    </div>
                  )}
                  {step === 2 && (
                    <div className="flex flex-col sm:flex-row items-center justify-end">
                      <button
                        type="button"
                        className="w-[130px] h-[44px] rounded-lg flex items-center justify-center border border-rose-500 text-center text-rose-500 mr-4"
                        onClick={() => cancelInventoryBill(data?.uuid ?? uuid)}
                      >
                        <span className="ml-2">Hủy phiếu</span>
                      </button>
                      {/* <button
                        className="w-[130px] h-[44px] rounded-lg flex items-center justify-center border border-rose-500 text-center text-rose-500 mr-4"
                        onClick={() => window.history.back()}
                      >
                        {exportIcons('PRINTBTN')} <span className="ml-2">In phiếu</span>
                      </button> */}
                      <button
                        type="button"
                        className="w-[130px] h-[44px] rounded-lg flex items-center justify-center border bg-green-600 border-green-500 text-center text-white mr-4"
                        onClick={() => confirmInventoryBill(data?.uuid ?? uuid)}
                      >
                        <span className="ml-2">Xác nhận</span>
                      </button>
                      <button
                        type="submit"
                        className="w-[130px] h-[44px] rounded-lg flex items-center justify-center border bg-rose-500 border-rose-500 text-center text-white mr-4"
                      >
                        <span className="ml-2">Lưu phiếu</span>
                      </button>
                    </div>
                  )}
                  {step === 3 && (
                    <div className="flex flex-col sm:flex-row items-center justify-end">
                      {/* <button
                        className="w-[130px] h-[44px] rounded-lg flex items-center justify-center border border-rose-500 text-center text-rose-500 mr-4"
                        onClick={() => window.history.back()}
                      >
                        {exportIcons('PRINTBTN')} <span className="ml-2">In phiếu</span>
                      </button> */}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Page;
