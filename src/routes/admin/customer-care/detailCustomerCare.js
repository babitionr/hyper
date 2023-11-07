import { Form, Input, Modal, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { CalendarService } from 'services/appointment-schedule';
import { useAuth } from 'global';
import { HookDataTable } from 'hooks';
import { ColumnSchedule } from './columns/columnSchedule';
import { toast } from 'react-toastify';
import CreateCalendar from '../customer/detail/calendar/modal';
import moment from 'moment';

const DetailCustomerCare = ({ setShowModal, showModal }) => {
  const { branchUuid } = useAuth();
  const [form] = Form.useForm();
  const [dataEdit, setDataEdit] = useState({});
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

  useEffect(() => {
    if (!branchUuid) return;
    const initFetch = async () => {
      try {
        if (showModal) {
          handleChangeSchedule();
        }
      } catch (error) {
        return error;
      }
    };
    initFetch();
  }, [showModal, branchUuid]);

  const handleCancel = () => {
    form.resetFields();
    setShowModal(false);
    setDataEdit({});
    setIsLoadingSubmit(false);
  };
  // const handleSubmit = async () => {
  //   setIsLoadingSubmit(true);
  //   const formData = form.getFieldsValue();
  //   if (dataEdit?.id) {
  //     const value = {
  //       id: dataEdit.id,
  //       uuid: dataEdit.uuid,
  //     };
  //     delete value.expected;
  //     delete value.service;

  //     await CalendarService.put(value, branchUuid);
  //     handleCancel();
  //   } else {
  //     try {
  //       const values = {
  //         ...formData,
  //         contactNumber: formData.contactNumber,
  //         customer: {
  //           uuid: formData.customer,
  //         },
  //         doctor: {
  //           id: formData.doctor,
  //         },
  //       };
  //       delete values.expected;
  //       delete values.service;
  //       const res = await CalendarService.post(values, branchUuid);
  //       if (res) {
  //         handleCancel();
  //       }
  //     } catch (error) {
  //       return error;
  //     }
  //   }
  //   setIsLoadingSubmit(false);
  // };

  const handleOpenModal = async (isOpen, data) => {
    setShowModal(isOpen);
    if (!data) {
      return false;
    }
    console.log(data);
    setDataEdit(data);

    const valueDetail = {
      code: data?.customer?.code,
      customerName: data?.customer?.fullName,
      contactNumber: data?.customer?.phoneNumber,
      dateOfBirth: moment(data?.customer?.dateOfBirth).format('DD/MM/YYYY'),
      age: moment().diff(moment(data?.customer?.dateOfBirth).format('YYYY-MM-DD'), 'years'),
    };
    form.setFieldsValue(valueDetail);
  };

  // appointment-schedule
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);

  const getDataSchedule = async (params) => {
    if (dataEdit?.customer?.uuid)
      return await CalendarService.get({ page: 1, perPage: 999, customerUuid: dataEdit?.customer?.uuid }, branchUuid);
    else return { data: [], count: 0 };
  };
  const handleDeleteSchedule = async (data) => {
    const res = await CalendarService.deleteCalendar(data?.uuid, branchUuid);
    if (res) {
      toast.success('Xóa lịch hẹn thành công', {
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
      });
      handleChangeSchedule();
    }
  };

  const [showModalSchedule, setShowModalSchedule] = useState(false);
  const [handleEditSchedule, AddScheduleModal] = CreateCalendar({
    setShowModal: setShowModalSchedule,
    showModal: showModalSchedule,
    dataCustomer: dataEdit?.customer,
  });

  const [handleChangeSchedule, DataTableSchedule] = HookDataTable({
    onRow: (data) => ({
      onDoubleClick: (event) => {},
    }),
    showSearch: false,
    save: false,
    fullTextSearch: 'search',
    showPagination: false,
    xScroll: 1000,
    yScroll: 250,
    isLoadingSchedule,
    setIsLoadingSchedule,
    Get: getDataSchedule,
    columns: ColumnSchedule({ handleDeleteSchedule, handleEditSchedule }),
  });

  useEffect(() => {
    if (showModalSchedule === false) {
      handleChangeSchedule();
    }
  }, [showModalSchedule]);

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
                <div className="text-lg font-bold">Chi tiết chăm sóc</div>
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
                  <div className="pb-8 px-2">
                    <div className="flex gap-4">
                      <div className="flex flex-wrap gap-2 w-full">
                        {!(dataEdit?.type === 'BIRTH_DAY') && (
                          <div className="w-full flex justify-between gap-4">
                            <Form.Item className="w-4/12" name="code" label="Mã hồ sơ">
                              <Input
                                disabled
                                className="h-10 w-full text-sm font-normal block  rounded-lg border border-gray-200  py-[7px] px-4 "
                                placeholder=""
                              />
                            </Form.Item>
                            <Form.Item className="w-4/12" name="customerName" label="Tên khách hàng">
                              <Input
                                disabled
                                className="h-10 w-full text-sm font-normal block  rounded-lg border border-gray-200  py-[7px] px-4 "
                                placeholder=""
                              />
                            </Form.Item>
                            <Form.Item className="w-4/12" name="contactNumber" label="Số điện thoại">
                              <Input
                                disabled
                                className="h-10 w-full text-sm font-normal block  rounded-lg border border-gray-200  py-[7px] px-4 "
                                placeholder=""
                              />
                            </Form.Item>
                          </div>
                        )}

                        {/* Birthday */}
                        {dataEdit?.type === 'BIRTH_DAY' && (
                          <div className="w-full flex justify-between gap-4">
                            <Form.Item className="w-3/12" name="code" label="Mã hồ sơ">
                              <Input
                                disabled
                                className="h-10 w-full text-sm font-normal block  rounded-lg border border-gray-200  py-[7px] px-4 "
                                placeholder=""
                              />
                            </Form.Item>
                            <Form.Item className="w-3/12" name="customerName" label="Tên khách hàng">
                              <Input
                                disabled
                                className="h-10 w-full text-sm font-normal block  rounded-lg border border-gray-200  py-[7px] px-4 "
                                placeholder=""
                              />
                            </Form.Item>
                            <Form.Item className="w-3/12" name="contactNumber" label="Số điện thoại">
                              <Input
                                disabled
                                className="h-10 w-full text-sm font-normal block  rounded-lg border border-gray-200  py-[7px] px-4 "
                                placeholder=""
                              />
                            </Form.Item>
                            <Form.Item className="w-3/12" name="dateOfBirth" label="Ngày sinh">
                              <Input
                                disabled
                                className="h-10 w-full text-sm font-normal block  rounded-lg border border-gray-200  py-[7px] px-4 "
                                placeholder=""
                              />
                            </Form.Item>
                          </div>
                        )}

                        {/* Potential */}
                        {dataEdit?.type === 'POTENTIAL' && (
                          <div className="w-full flex justify-between gap-4">
                            <Form.Item className="w-4/12" name="dateOfBirth" label="Ngày sinh">
                              <Input
                                disabled
                                className="h-10 w-full text-sm font-normal block  rounded-lg border border-gray-200  py-[7px] px-4 "
                                placeholder=""
                              />
                            </Form.Item>
                            <Form.Item className="w-4/12" name="gioiTinh" label="Giới tính">
                              <Input
                                disabled
                                className="h-10 w-full text-sm font-normal block  rounded-lg border border-gray-200  py-[7px] px-4 "
                                placeholder=""
                              />
                            </Form.Item>
                            <Form.Item className="w-4/12" name="age" label="Tuổi">
                              <Input
                                disabled
                                className="h-10 w-full text-sm font-normal block  rounded-lg border border-gray-200  py-[7px] px-4 "
                                placeholder=""
                              />
                            </Form.Item>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* <div className="w-full">
                      <div className="w-full flex justify-between gap-4 flex-row xl:flex-row mb-4">
                        <div className="!h-[40px] text-center flex gap-2 justify-center items-center text-gray-500 text-base !font-medium">
                          Lịch sử chăm sóc
                        </div>
                        <button
                          className="active:ring-2 ring-offset-1 !h-[40px] text-center ring-offset-red-300 ring-red-300 flex gap-2 justify-center bg-rose-500 !rounded-lg border border-rose-500 text-white items-center !text-base !font-medium w-[130px] disabled:opacity-50"
                          type="button"
                        >
                          <i className="las la-plus" />
                          Thêm CS
                        </button>
                      </div>
                      <div className="w-full">{DataTableSchedule()}</div>
                    </div> */}

                    <div className="w-full">
                      <div className="w-full flex justify-between gap-4 flex-row xl:flex-row mb-4">
                        <div className="!h-[40px] text-center flex gap-2 justify-center items-center text-gray-500 text-base !font-medium">
                          Lịch hẹn
                        </div>
                        <button
                          className="active:ring-2 ring-offset-1 !h-[40px] text-center ring-offset-red-300 ring-red-300 flex gap-2 justify-center bg-rose-500 !rounded-lg border border-rose-500 text-white items-center !text-base !font-medium w-[150px] disabled:opacity-50"
                          type="button"
                          onClick={() => {
                            setShowModalSchedule(true);
                          }}
                        >
                          <i className="las la-plus" />
                          Thêm lịch hẹn
                        </button>
                      </div>
                      <div className="w-full">{DataTableSchedule()}</div>
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
                        className=" opacity-0 cursor-default !border-rose-500 border !text-white !bg-rose-500 focus:!bg-rose-600 hover:!bg-rose-600 !px-16 flex items-center justify-center !pt-4 !pb-6 !text-base font-medium !mr-0 "
                        loading={isLoadingSubmit}
                        disabled={isLoadingSubmit}
                        // onClick={async () => {
                        //   try {
                        //     await form.validateFields();
                        //     await handleSubmit();
                        //   } catch (error) {
                        //     console.log(error);
                        //   }
                        // }}
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
        {showModalSchedule && AddScheduleModal()}
      </>
    ),
  ];
};

export default DetailCustomerCare;
