import { Form, Input, Modal, Button, Select, DatePicker, TimePicker } from 'antd';
import React, { useState } from 'react';
import moment from 'moment';
import { useAuth } from 'global';
import { CustomerCareService } from 'services/customer-care';

const CreateCustomerCare = ({ setShowModal, showModal, handleChange }) => {
  const { branchUuid } = useAuth();
  const [form] = Form.useForm();
  const [dataEdit, setDataEdit] = useState({});
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

  // useEffect(() => {
  //   if (!branchUuid) return;
  //   const initFetch = async () => {
  //     try {
  //       if (showModal) {
  //         console.log(12345235);
  //       }
  //     } catch (error) {
  //       return error;
  //     }
  //   };
  //   initFetch();
  // }, [showModal, branchUuid]);

  const handleCancel = () => {
    form.resetFields();
    setShowModal(false);
    setDataEdit({});
    setIsLoadingSubmit(false);
  };
  const handleSubmit = async () => {
    setIsLoadingSubmit(true);
    const formData = form.getFieldsValue();
    const values = {
      status: formData?.status,
      chanel: formData?.chanel,
      eventTime: `${moment(formData.eventDay).format('YYYY-MM-DD')} ${moment(formData.eventHour).format('HH:mm:ss')}`,
      type: dataEdit?.type,
      description: formData?.description ?? '',
      customer: {
        uuid: dataEdit?.customer?.uuid,
      },
      uuid: dataEdit?.uuid ?? null,
    };
    if (dataEdit?.type === 'AFTER_TREATMENT') {
      values.saleOrder = { uuid: dataEdit?.saleOrder?.uuid };
    }
    if (dataEdit?.type === 'LATE_CALENDAR' || dataEdit?.type === 'REMIND_CALENDAR') {
      values.calendar = { uuid: dataEdit?.calendar?.uuid };
    }

    if (dataEdit?.uuid) {
      const res = await CustomerCareService.update(values, branchUuid);
      if (res) {
        handleCancel();
        handleChange();
      }
    } else {
      try {
        delete values.uuid;
        const res = await CustomerCareService.create(values, branchUuid);
        if (res) {
          handleCancel();
          handleChange();
        }
      } catch (error) {
        return error;
      }
    }
    setIsLoadingSubmit(false);
  };

  const handleOpenModal = async (isOpen, data) => {
    setShowModal(isOpen);
    if (!data) {
      return false;
    }
    console.log(data);
    setDataEdit(data);

    let dataType = '';
    switch (data?.type) {
      case 'REMIND_CALENDAR':
        dataType = 'Nhắc lịch hẹn';
        break;
      case 'AFTER_TREATMENT':
        dataType = 'Sau điều trị';
        break;
      case 'BIRTH_DAY':
        dataType = 'Sinh nhật';
        break;
      case 'REGULAR_CHECK_UP':
        dataType = 'Khám định kỳ';
        break;
      case 'LATE_CALENDAR':
        dataType = 'Trễ hẹn';
        break;
      case 'POTENTIAL':
        dataType = 'Khách hàng tiềm năng';
        break;

      default:
        break;
    }
    form.setFieldsValue({
      type: dataType,
      customerName: data?.customer?.fullName,
      phoneNumber: data?.customer?.phoneNumber,
    });

    if (data?.uuid) {
      const valueDetail = {
        chanel: data?.chanel,
        status: data?.status,
        eventDay: moment(data?.eventTime),
        eventHour: moment(data?.eventTime),
        description: data?.description,
      };
      form.setFieldsValue(valueDetail);
    }
  };

  return [
    handleOpenModal,
    () => (
      <>
        {' '}
        {showModal && (
          <Modal
            destroyOnClose={true}
            title={
              <div className="flex justify-between">
                <div className="text-lg font-bold">{dataEdit?.uuid ? 'Chỉnh sửa chăm sóc' : 'Tạo chăm sóc'}</div>
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
            open={showModal}
            footer={null}
            className="!w-8/12 xl:!w-7/12 min-w-min pb-0"
            closable={false}
            // style={{ top: 5 }}
          >
            <Form
              form={form}
              onFinishFailed={({ errorFields }) =>
                errorFields.length && form.scrollToField(errorFields[0].name, { behavior: 'smooth' })
              }
              colon={false}
              className=" min-w-min"
            >
              <div className="">
                <div className=" bg-white ">
                  <div className="p-2">
                    <div className="flex gap-4">
                      <div className="flex flex-wrap gap-2 w-full">
                        <div className="w-full flex justify-between gap-4">
                          <Form.Item className="w-1/2" label="Tên khách hàng" name="customerName">
                            <Input
                              disabled
                              className="h-10 w-full text-sm font-normal block  rounded-lg border border-gray-200  py-[7px] px-4 "
                              placeholder=""
                            />
                          </Form.Item>
                          <Form.Item className="w-1/2" label="Số điện thoại" name="phoneNumber">
                            <Input
                              disabled
                              className="h-10 w-full text-sm font-normal block  rounded-lg border border-gray-200  py-[7px] px-4 "
                              placeholder=""
                            />
                          </Form.Item>
                        </div>
                        {dataEdit?.type === 'REMIND_CALENDAR' ||
                          (dataEdit?.type === 'LATE_CALENDAR' && (
                            <div className="w-full flex justify-between gap-4">
                              <Form.Item className="w-1/2" label="Mã LH" name="schelduleCode">
                                <Input
                                  disabled
                                  className="h-10 w-full text-sm font-normal block  rounded-lg border border-gray-200  py-[7px] px-4 "
                                  placeholder=""
                                />
                              </Form.Item>
                              <Form.Item className="w-1/2" label="Lịch hẹn gần nhất" name="lastScheldule">
                                <Input
                                  disabled
                                  className="h-10 w-full text-sm font-normal block  rounded-lg border border-gray-200  py-[7px] px-4 "
                                  placeholder=""
                                />
                              </Form.Item>
                            </div>
                          ))}
                        <div className="w-full flex justify-between gap-4">
                          <Form.Item
                            className="w-1/2"
                            label="Thời gian"
                            name="eventDay"
                            rules={[
                              {
                                required: true,
                                message: 'Vui lòng chọn ngày hẹn!',
                              },
                            ]}
                            // initialValue={moment()}
                          >
                            <DatePicker
                              placeholder="DD/MM/YYYY"
                              className="!w-full border rounded-lg !bg-white  border-gray-200"
                              format="DD/MM/YYYY"
                            />
                          </Form.Item>
                          <Form.Item
                            className="w-1/2"
                            label="Giờ"
                            name="eventHour"
                            rules={[
                              {
                                required: true,
                                message: 'Vui lòng chọn giờ hẹn!',
                              },
                            ]}
                            // initialValue={moment()}
                          >
                            <TimePicker
                              placeholder="HH:mm"
                              className="!w-full border rounded-lg !bg-white  border-gray-200"
                              format="HH:mm"
                              disabledTime={() => {
                                return {
                                  disabledHours: () => [0, 1, 2, 3, 4, 5, 6, 21, 22, 23],
                                };
                              }}
                            />
                          </Form.Item>
                        </div>

                        <div className="w-full flex justify-between gap-4">
                          <Form.Item
                            className="w-6/12"
                            name="chanel"
                            label="Kênh chăm sóc"
                            rules={[
                              {
                                required: true,
                                message: 'Vui lòng chọn Kênh chăm sóc!',
                              },
                            ]}
                          >
                            <Select className="w-full !rounded-lg  text-sm font-normal" placeholder="Chọn Kênh CS">
                              <Select.Option className="w-full" value="CALL">
                                Gọi điện
                              </Select.Option>
                              <Select.Option className="w-full" value="CHAT">
                                Chat
                              </Select.Option>
                              <Select.Option className="w-full" value="ZALO">
                                Zalo
                              </Select.Option>
                              <Select.Option className="w-full" value="FACEBOOK">
                                Facebook
                              </Select.Option>
                            </Select>
                          </Form.Item>
                          <Form.Item className="w-6/12" name="status" label="Trạng thái" initialValue={'PENDING'}>
                            <Select className="w-full !rounded-lg  text-sm font-normal" placeholder="Chọn trạng thái">
                              <Select.Option className="w-full text-green-500 font-bold" value="COMPLETE">
                                Đã chăm sóc
                              </Select.Option>
                              <Select.Option className="w-full text-rose-500 font-bold" value="PENDING">
                                Chưa chăm sóc
                              </Select.Option>
                              <Select.Option className="w-full text-yellow-500 font-bold" value="REDO">
                                Cần chăm sóc lại
                              </Select.Option>
                            </Select>
                          </Form.Item>
                        </div>

                        <div className="w-full flex justify-between gap-4">
                          <Form.Item className="w-full" name="type" label="Loại chăm sóc">
                            <Input
                              disabled
                              className="h-10 w-full text-sm font-normal block  rounded-lg border border-gray-200  py-[7px] px-4 "
                              placeholder="Loại chăm sóc"
                            />
                          </Form.Item>
                        </div>

                        <div className="w-full flex justify-between gap-4">
                          <Form.Item className="w-full" name="description" label="Nội dung">
                            <Input.TextArea
                              rows={4}
                              placeholder="Ghi chú"
                              className="w-full text-sm font-normal block  rounded-lg border border-gray-200 !bg-white py-[7px] px-4"
                            />
                          </Form.Item>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Form.Item>
                    <div className="flex items-center justify-center  border-solid gap-6 border-slate-200 rounded-b">
                      <button
                        className="active:ring-2 ring-offset-1 ring-offset-gray-300 ring-gray-300 bg-white text-gray-500 border-gray-400 border !rounded-lg px-16 py-2 text-base font-medium  "
                        type="button"
                        onClick={() => {
                          handleCancel();
                        }}
                      >
                        Hủy
                      </button>
                      <Button
                        className=" !border-rose-500 border !text-white !bg-rose-500 focus:!bg-rose-600 hover:!bg-rose-600 !px-16 flex items-center justify-center !pt-4 !pb-6 !text-base font-medium !mr-0 "
                        loading={isLoadingSubmit}
                        disabled={isLoadingSubmit}
                        onClick={async () => {
                          try {
                            await form.validateFields();
                            await handleSubmit();
                          } catch (error) {
                            console.log(error);
                          }
                        }}
                      >
                        <span className="pt-2">Lưu</span>
                      </Button>
                    </div>
                  </Form.Item>
                </div>
              </div>
            </Form>
          </Modal>
        )}
      </>
    ),
  ];
};

export default CreateCustomerCare;
