import { Checkbox, Form, Input, Modal, Radio } from 'antd';
import React, { useEffect, useState } from 'react';
import './index.less';
import { AttendanceService } from 'services/attendance';
import moment from 'moment';

export const AddUser = ({ handleChange, showModal, setShowModal, listBranch }) => {
  const branchUuid = localStorage.getItem('branchUuid');
  const [form] = Form.useForm();

  const [isShowOverTime, setIsShowOverTime] = useState('FULL_TIME');
  const [isChecked, setIsChecked] = useState(false);
  const [overTimeHour, setOverTimeHour] = useState(1);

  // eslint-disable-next-line no-unused-vars
  const [formValues, setFormValues] = useState({});
  const [dataEdit, setDataEdit] = useState();

  const [dataUser, setDataUser] = useState({});
  const handleOk = async () => {
    if (dataEdit?.uuid) {
      const data = await form.getFieldsValue();
      const value = {
        ...data,
        uuid: dataEdit?.uuid,
        workType: isShowOverTime || data.workType,
        branchUuid,
        date: dataUser.dateFull ? moment(dataUser.dateFull).format('YYYY-MM-DD 00:00:00') : null,
        overTime: isShowOverTime === 'FULL_TIME' ? isChecked : false,
        overTimeHour: isShowOverTime === 'FULL_TIME' ? (isChecked ? overTimeHour : null) : null,
        userId: dataUser?.id,
      };
      const res = await AttendanceService.post(value);
      if (res) {
        handleCancel();
        handleChange && handleChange();
      }
    } else {
      const data = await form.validateFields();
      const value = {
        ...data,
        uuid: null,
        workType: isShowOverTime || data.workType,
        branchUuid,
        date: dataUser.dateFull ? moment(dataUser.dateFull).format('YYYY-MM-DD 00:00:00') : null,
        overTime: isChecked,
        overTimeHour: isChecked ? overTimeHour : null,
        userId: dataUser?.id,
      };
      const res = await AttendanceService.post(value);
      if (!res) {
        return false;
      }
      if (res) {
        handleCancel();
        handleChange && handleChange();
      }
    }
  };
  const handleCancel = () => {
    setOverTimeHour(1);
    setIsShowOverTime('FULL_TIME');
    setIsChecked(false);
    setDataEdit();
    form.resetFields();
    setShowModal(false);
  };
  const handleOpenModal = async (isOpen, data) => {
    setShowModal(isOpen);
    if (!data) {
      return;
    }
    setDataUser(data);
    const item = data.child.find(
      (i) => moment(i.date).format('DD/MM/YYYY') === moment(data.dateFull).format('DD/MM/YYYY'),
    );
    if (item) {
      const res = await AttendanceService.getById(item.chamCongUuid);
      setIsShowOverTime(res.workType);
      setIsChecked(res.overTime);
      setOverTimeHour(res.overTimeHour ?? 1);
      setDataEdit(res);

      form.setFieldsValue({ ...res, overTime: res.overTime });
    }
  };

  const validateRadioGroup = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Vui lòng chọn một giá trị trong châm công!'));
    }
    return Promise.resolve();
  };
  const validateOvertimeInput = (_, value) => {
    if (form.getFieldValue('overTime') && !/^\d+$/.test(value)) {
      return Promise.reject(new Error('Vui lòng nhập số!'));
    }
    return Promise.resolve();
  };

  useEffect(() => {
    form.setFieldsValue(dataEdit);
  }, [form.getFieldValue()]);
  return [
    handleOpenModal,
    () => (
      <div>
        {showModal && (
          <Modal
            destroyOnClose={true}
            centered={true}
            title={
              dataEdit?.uuid ? (
                <div className="flex justify-between">
                  <div className="text-base font-bold">Chỉnh sửa chấm công</div>
                  <button
                    className=""
                    onClick={() => {
                      handleCancel();
                    }}
                  >
                    <span className="icon-x-close pr-2"></span>
                  </button>
                </div>
              ) : (
                <div className="flex justify-between">
                  <div className="text-base font-bold">Chấm công</div>
                  <button
                    className=""
                    onClick={() => {
                      handleCancel();
                    }}
                  >
                    <span className="icon-x-close pr-2"></span>
                  </button>
                </div>
              )
            }
            open={showModal}
            footer={null}
            className=" min-w-min pb-0"
            width={500}
            closable={false}
            style={{ top: 5 }}
          >
            <Form
              onFinish={() => {
                handleOk();
              }}
              form={form}
              onValuesChange={(_, values) =>
                setFormValues((prevState) => ({
                  ...prevState,
                  ...values,
                }))
              }
              colon={false}
              className=" min-w-min"
            >
              <div>
                <div className="px-4">
                  <div>
                    <div className="w-full flex justify-between gap-4">
                      <Form.Item
                        name="workType"
                        label="Chấm công"
                        rules={[
                          {
                            validator: validateRadioGroup,
                          },
                        ]}
                        initialValue={'FULL_TIME'}
                      >
                        <Radio.Group
                          onChange={(e) => setIsShowOverTime(e.target.value)}
                          defaultValue={'FULL_TIME'}
                          value={isShowOverTime}
                        >
                          <Radio value="FULL_TIME"> Cả ngày </Radio>
                          <Radio value="HALF_TIME"> Nửa ngày </Radio>
                          <Radio value="OFF"> Nghỉ </Radio>{' '}
                        </Radio.Group>{' '}
                      </Form.Item>{' '}
                    </div>{' '}
                    {isShowOverTime === 'FULL_TIME' && (
                      <>
                        <div className="w-full flex justify-between gap-4">
                          <Form.Item name="overTime" valuePropName="checked" label="">
                            <Checkbox
                              onChange={(e) => setIsChecked(e.target.checked)}
                              value={isChecked}
                              checked={isChecked}
                            >
                              {' '}
                              Tăng ca{' '}
                            </Checkbox>{' '}
                          </Form.Item>{' '}
                        </div>{' '}
                        {isChecked && (
                          <div className="w-full flex justify-between gap-4">
                            <Form.Item
                              name="overTimeHour"
                              label="Số giờ tăng ca"
                              dependencies={['overTime', 'workType']}
                              initialValue={1}
                              rules={[
                                ({ getFieldValue }) => ({
                                  validator(_, value) {
                                    if (getFieldValue('overTime')) {
                                      return validateOvertimeInput(_, value);
                                    }
                                    return Promise.resolve();
                                  },
                                }),
                              ]}
                            >
                              <Input
                                type="number"
                                className="p-2 !bg-white !border !border-gray-200 !w-[200px]"
                                max={16}
                                min={1}
                                value={overTimeHour}
                                onChange={(e) => setOverTimeHour(+e.target.value)}
                              />{' '}
                            </Form.Item>
                          </div>
                        )}{' '}
                      </>
                    )}
                  </div>{' '}
                </div>{' '}
                <Form.Item>
                  <div className="flex items-center justify-center  border-solid gap-6 border-slate-200 ">
                    <button
                      className="active:ring-2 ring-offset-1 ring-offset-gray-300 ring-gray-300 bg-white text-gray-500 border-gray-400 border !rounded-lg px-16 py-2 text-base font-medium  "
                      type="button"
                      onClick={() => {
                        handleCancel();
                      }}
                    >
                      Hủy{' '}
                    </button>{' '}
                    <button
                      className="text-white bg-red-500 active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300 rounded-lg px-16 py-2 text-base font-medium  hover:bg-red-600 hover:border-transparent outline-none focus:outline-none "
                      type="submit"
                    >
                      Lưu{' '}
                    </button>{' '}
                  </div>{' '}
                </Form.Item>{' '}
              </div>{' '}
            </Form>
          </Modal>
        )}
      </div>
    ),
  ];
};
