import React, { useEffect } from 'react';
import { Form, Input, Modal, Select, DatePicker, InputNumber } from 'antd';
import moment from 'moment';
import './index.less';
import { LaboService } from 'services/labo';
// import { LaboService } from 'services/labo';
// import { MasterDataService } from 'services/master-data-service';

export const AddCostToBeCharged = ({
  showModalAddCostToBeCharged,
  setShowModalAddCostToBeCharged,
  idCustomer,
  handleChange,
  detailData,
}) => {
  const [form] = Form.useForm();
  // const [treatmentSlipList, setTreatmentSlipList] = useState([]);
  const listCostsIsIncludedFor = [
    { value: 'DENTAL', label: 'Phòng Khám' },
    { value: 'DOCTOR', label: 'Bác sĩ điều trị' },
    { value: 'ASSISTANT', label: 'Tư vấn viên' },
    { value: 'BOTH', label: 'Bác sĩ điều trị và tư vấn viên' },
  ];

  // const [list, setList] = useState({});

  // const getData = async () => {
  //   try {
  //     const res = await Promise.all([
  //       LaboService.getListDoctor({ positon: 'DOCTOR' }),
  //     ]);
  //     const [ resDoctor] = res;
  //     console.log(resDoctor.data);
  //     setList((prev) => ({
  //       ...prev,
  //       doctor: resDoctor.data,
  //     }));
  //   } catch (error) {
  //     console.log('error: ', error);
  //   }
  // }

  const init = async () => {
    if (showModalAddCostToBeCharged) {
      console.log(detailData);
      // getData();
      form.setFieldsValue({
        // timeReceive: detailData?.timeReceive ? moment(detailData?.timeReceive) : null,
        customerName: detailData?.customerName,
        doctorId: detailData?.doctor?.firstName,
        price: Number(detailData?.price),
        quantity: Number(detailData?.quantity),
        totalAmount: Number(detailData?.price) * Number(detailData?.quantity),
      });
    }
  };
  const handleCancel = () => {
    setShowModalAddCostToBeCharged(false);
    form.resetFields();
  };
  const handleSubmit = async () => {
    try {
      const data = form.getFieldValue();
      const values = {
        laboUuid: detailData?.uuid,
        receiveDate: data?.timeReceive ? moment(data?.timeReceive).format('YYYY-MM-DD hh:mm:ss') : null,
        price: Number(data?.price),
        quantity: Number(data?.quantity),
        expenseForType: data?.expenseForType,
      };
      console.log(values);
      await LaboService.updateReceiveLabo(values);
      setShowModalAddCostToBeCharged(false);
      form.resetFields();
      // handleChange();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    init();
  }, [showModalAddCostToBeCharged]);

  return (
    <div>
      <Modal
        open={showModalAddCostToBeCharged}
        destroyOnClose={true}
        title={
          <div className="flex justify-between">
            <div className="text-base font-bold">Thêm chi phí tính vào</div>
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
        footer={null}
        className="!w-8/12 min-w-min pb-0 z-10"
        closable={false}
      >
        <Form form={form} className="px-4" colon={false} onFinish={() => handleSubmit()}>
          <div>
            <div className="w-full flex justify-between gap-4">
              <div className="w-full flex gap-2">
                <Form.Item
                  className="w-6/12"
                  name="timeReceive"
                  label="Ngày nhận (Nhập phiếu Lab)"
                  rules={[
                    {
                      required: true,
                      message: 'Chọn ngày nhận',
                    },
                  ]}
                >
                  <DatePicker
                    // disabledDate={(date) => new Date(date).getTime() > new Date().getTime()}
                    placeholder=""
                    className="!w-full border rounded-lg !bg-white border-gray-200"
                    format="DD/MM/YYYY HH:mm:ss"
                  />
                </Form.Item>
                <Form.Item className="w-6/12" name="doctorId" label="Tên bác sĩ (Nhập phiếu Lab)">
                  <Input
                    disabled
                    className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                  />
                </Form.Item>
              </div>
            </div>
            <div className="w-full flex">
              <div className="w-full flex gap-2">
                <Form.Item className="w-6/12" name="customerName" label="Tên bệnh nhân (Nhập phiếu Lab)">
                  <Input
                    disabled
                    className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                  />
                </Form.Item>
                <Form.Item
                  className="w-6/12"
                  label="Số lượng"
                  name="quantity"
                  rules={[
                    {
                      required: true,
                      message: 'Nhập số lượng',
                    },
                  ]}
                >
                  <Input
                    type="number"
                    placeholder="Nhập số lượng"
                    onChange={(e) => {
                      const quantity = e.target.value;
                      const price = form.getFieldValue('price') ?? 0;
                      form.setFieldsValue({ totalAmount: Number(quantity) * Number(price) });
                    }}
                    className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                  />
                </Form.Item>
              </div>
            </div>
            <div className="w-full flex">
              <div className="w-full flex gap-2">
                <Form.Item className="w-6/12" label="Đơn giá" name="price">
                  <InputNumber
                    min={0}
                    formatter={(value) => {
                      if (!value) {
                        return 0;
                      }
                      const stringValue = value.toString();
                      const formattedValue = stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

                      return formattedValue;
                    }}
                    parser={(value) => {
                      const parsedValue = value.replace(/\./g, '');
                      return isNaN(parsedValue) ? 0 : parsedValue;
                    }}
                    addonAfter="VND"
                    onChange={(e) => {
                      const quantity = form.getFieldValue('quantity') ?? 0;
                      const price = e;
                      form.setFieldsValue({ totalAmount: Number(quantity) * Number(price) });
                    }}
                    stringMode
                    placeholder="Nhập giá bán"
                    className="antdInputNumberSuffix h-10 text-sm font-normal block !w-full rounded-l-lg text-black "
                  />
                </Form.Item>
                <Form.Item className="w-6/12" label="Thành tiền" name="totalAmount" initialValue={0}>
                  <InputNumber
                    disabled
                    addonAfter="VND"
                    formatter={(value) => {
                      if (!value) {
                        return 0;
                      }
                      const stringValue = value.toString();
                      const formattedValue = stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

                      return formattedValue;
                    }}
                    parser={(value) => {
                      const parsedValue = value.replace(/\./g, '');
                      return isNaN(parsedValue) ? 0 : parsedValue;
                    }}
                    placeholder="Nhập thành tiền"
                    className="antdInputNumberSuffix h-10 text-sm font-normal block !w-full rounded-l-lg text-black "
                  />
                </Form.Item>
              </div>
            </div>
            <div className="w-full ">
              <Form.Item
                initialValue={'DENTAL'}
                className="w-full"
                name="expenseForType"
                label="Chi phí được tính cho"
                rules={[
                  {
                    required: true,
                    message: 'Chọn chi phí được tính cho',
                  },
                ]}
              >
                <Select options={listCostsIsIncludedFor ?? []} className=" !rounded-lg" placeholder=""></Select>
              </Form.Item>
            </div>
            <div>
              <Form.Item>
                <div className="flex justify-center gap-4 pt-6">
                  <button
                    className="active:ring-2 ring-offset-1 ring-offset-gray-300 ring-gray-300 bg-white text-gray-500 border-gray-400 border !rounded-lg px-11 py-2 text-base font-medium  "
                    type="button"
                    onClick={() => {
                      handleCancel();
                    }}
                  >
                    Hủy
                  </button>
                  <button
                    className=" active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-red-500 text-white rounded-lg border border-red-500  items-center !text-base !font-medium px-11 py-2"
                    type="submit"
                  >
                    Lưu
                  </button>
                </div>
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
