import React, { useState, useEffect } from 'react';
import { Form, Input, Steps, Select, DatePicker } from 'antd';
import { Message } from 'components';
import { TableWarehousingProduct } from './tableWarehousingProduct';
import { WarehousingBill } from 'services/warehousing-bill';
import { SupplierService } from 'services/supplier';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { routerLinks } from 'utils';
import moment from 'moment';

const AddNew = () => {
  const navigate = useNavigate();

  const { Option } = Select;
  const [searchParams] = useSearchParams();
  const uuid = searchParams.get('uuid');
  const status = searchParams.get('status');

  const [warehousingProductDtoList, setWarehousingProductDtoList] = useState([]);

  const [form] = Form.useForm();
  const { Step } = Steps;

  // eslint-disable-next-line no-unused-vars
  const [step, setStep] = useState(0);

  const [warehousingPartnerList, setWarehousingPartnerList] = useState([]);
  const init = async () => {
    const initWarehousingPartner = await SupplierService.getAll();
    console.log(initWarehousingPartner.data);
    setWarehousingPartnerList(initWarehousingPartner.data);
    if (!uuid) return;
    const data = await WarehousingBill.getDetail(uuid);
    console.log(data);
    form.setFieldsValue({
      ...data,
      warehousingPartnerDto: data.warehousingPartnerDto.code,
      inOutDate: moment(data?.inOutDate),
    });
    setStep(data?.status === 'COMPLETED' ? 2 : 1);
  };

  const navigateToInventoryManagement = () => {
    navigate({
      pathname: routerLinks('InventoryManagement'),
    });
  };
  const navigateToExportStock = () => {
    navigate(-1);
  };

  const onSaveData = async (isComplete) => {
    try {
      await form.validateFields();
      const formValues = form.getFieldsValue();
      const res = {
        ...formValues,
        billType: 'EXPORT',
        status: isComplete ? 'COMPLETED' : step === 0 || step === 1 ? 'DRAFT' : 'COMPLETED',
        branchUuid: localStorage.getItem('branchUuid'),
        inOutDate: moment(formValues.inOutDate).format('YYYY-MM-DD hh:mm:ss'),
        warehousingProductDtoList,
        warehousingPartnerDto: {
          code: formValues.warehousingPartnerDto,
          name: warehousingPartnerList.filter((e) => e.supplierNo === formValues.warehousingPartnerDto)[0].name,
          uuid: warehousingPartnerList.filter((e) => e.supplierNo === formValues.warehousingPartnerDto)[0].uuid,
        },
      };
      console.log(res);
      const data = await WarehousingBill.post({ ...res, uuid });
      if (data.message) {
        if (isComplete) {
          await Message.success({
            text: 'Xuất phiếu xuất kho thành công',
            title: 'Thành Công',
            cancelButtonText: 'Đóng',
          });
        } else if (!uuid) {
          await Message.success({
            text: 'Tạo mới phiếu xuất kho thành công',
            title: 'Thành Công',
            cancelButtonText: 'Đóng',
          });
        } else if (uuid) {
          await Message.success({
            text: 'Chỉnh sửa phiếu xuất kho thành công',
            title: 'Thành Công',
            cancelButtonText: 'Đóng',
          });
        }
      }
      navigateToExportStock();
      return data;
    } catch (error) {
      console?.error(error);
    }
  };

  useEffect(() => {
    init();
    getDataStatusComplete();
  }, []);

  // DataStatusComplete
  const [dataStatusComplete, setDataStatusComplete] = useState({});
  const getDataStatusComplete = async () => {
    if (uuid && status === 'COMPLETED') {
      const data = await WarehousingBill.getDetail(uuid);
      setDataStatusComplete(data);
    }
  };

  return (
    <div className="bg-white rounded-lg py-3 overflow-scroll services__wrap min-h-[86vh]">
      <div className="flex justify-between  pb-4 ">
        <div>
          <div className="ml-3">
            <span
              onClick={() => {
                navigateToInventoryManagement();
              }}
              className="cursor-pointer"
            >
              <span className="hover:text-rose-500">Kho</span> &gt;
            </span>{' '}
            <span
              onClick={() => {
                navigateToExportStock();
              }}
              className="cursor-pointer"
            >
              <span className="hover:text-rose-500">Phiếu xuất kho</span> &gt;
            </span>{' '}
            <span className="cursor-default"> Thêm mới</span>
          </div>
          <div className="ml-3 pt-2 font-bold text-lg text-gray-900 "> Thêm mới xuất nhập kho</div>
        </div>

        <div className="flex pr-3">
          {!(step === 2) && (
            <div>
              <button
                className="h-11 w-32 border rounded-[8px] border-rose-500 text-rose-500 flex justify-center items-center "
                onClick={async () => {
                  if (step === 2) {
                    return;
                  }
                  // setStep(2);
                  await form.validateFields();
                  Message.confirm({
                    onConfirm: () => {
                      setStep(2);
                      onSaveData(true);
                    },
                    title: 'Xác nhận hoàn thành phiếu',
                    text: 'Lưu ý: Phiếu nhập kho sau khi hoàn thành sẽ không cho phép hủy',
                  });
                }}
              >
                <span className="ml-[10px]"> Hoàn thành</span>
              </button>
            </div>
          )}
          <div>
            <button className="h-11 w-32 ml-4 border rounded-[8px] border-rose-500 text-rose-500 flex justify-center items-center ">
              <span className="ml-[10px]"> In phiếu</span>
            </button>
          </div>
          <div>
            {uuid && status === 'COMPLETED' ? (
              <button
                className="h-11 w-32 ml-4 border rounded-[8px] bg-rose-500 text-white flex justify-center items-center "
                type="submit"
                onClick={async () => {
                  await navigate({
                    pathname: routerLinks('ExportInventoryManagementAddNew'),
                  });
                  window.location.reload();
                }}
              >
                Thêm phiếu
              </button>
            ) : (
              <button
                className="h-11 w-32 ml-4 border rounded-[8px] bg-rose-500 text-white flex justify-center items-center "
                type="submit"
                onClick={async () => {
                  await onSaveData();
                }}
              >
                Lưu phiếu
              </button>
            )}
          </div>
        </div>
      </div>
      <div>
        <div className="p-3 w-full flex justify-between">
          <div className=" text-base font-semibold text-gray-600">Thông tin chung</div>
          <div className="">
            <Steps current={step} labelPlacement="vertical" className="w-full flex justify-end " size="medium">
              <Step title="Nháp" />
              <Step title="Hoàn thành" />
            </Steps>
          </div>
        </div>
        <Form form={form} colon={!!(uuid && status === 'COMPLETED')}>
          <div className="w-full flex justify-between gap-4 p-3">
            <Form.Item
              className="w-1/3"
              label="Đối tác"
              name="warehousingPartnerDto"
              rules={[
                {
                  required: !(uuid && status === 'COMPLETED'),
                  message: 'Chọn đối tác',
                },
              ]}
            >
              {uuid && status === 'COMPLETED' ? (
                <div>{dataStatusComplete?.warehousingPartnerDto?.name}</div>
              ) : (
                <Select
                  className=" !rounded-lg"
                  placeholder="Chọn đối tác"
                  onChange={() => {
                    console.log(form.getFieldValue());
                  }}
                >
                  {warehousingPartnerList.map((ele) => (
                    <Option key={ele.supplierNo} value={ele.supplierNo}>
                      {ele.name}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item className="w-1/3" label="Ngày nhập" name="inOutDate">
              {uuid && status === 'COMPLETED' ? (
                <div>{moment(dataStatusComplete?.inOutDate).format('hh:mm, DD/MM/YYYY')}</div>
              ) : (
                <DatePicker
                  placeholder="Chọn ngày nhập"
                  className="!w-full border rounded-lg !bg-white  border-gray-200"
                  format="DD/MM/YYYY hh:mm:ss"
                />
              )}
            </Form.Item>
            <Form.Item className="w-1/3" label="Ghi chú" name="note">
              {uuid && status === 'COMPLETED' ? (
                <div>{dataStatusComplete?.note}</div>
              ) : (
                <Input.TextArea
                  placeholder=""
                  className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                  style={{
                    backgroundColor: 'white ',
                  }}
                />
              )}
            </Form.Item>
          </div>
        </Form>
      </div>
      <div className="p-3 z-50">
        <TableWarehousingProduct
          warehousingProductDtoList={warehousingProductDtoList}
          setWarehousingProductDtoList={setWarehousingProductDtoList}
        />
      </div>
    </div>
  );
};

export default AddNew;
