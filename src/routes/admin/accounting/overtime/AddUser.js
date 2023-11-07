import { Form, Input, DatePicker, Select, Modal } from 'antd';
import React, { useState, useEffect } from 'react';
import { UserManagementService } from 'services/userManagement';
import moment from 'moment/moment';
import { SettingService } from 'services/setting';
import { BranchsService } from 'services/branchs';

export const AddUser = ({ handleChange, showModal, setShowModal, listBranch }) => {
  const [form] = Form.useForm();
  const { Option } = Select;
  // eslint-disable-next-line no-unused-vars
  const [formValues, setFormValues] = useState({});
  const [dataEdit, setDataEdit] = useState();
  const [listRole, setListRole] = useState([]);

  const [address, setAddress] = useState({
    province: [],
    provinceCode: '',
    district: [],
    districtCode: '',
    ward: [],
  });
  useEffect(() => {
    const initProvinces = async () => {
      const res = await BranchsService.getListProvices();
      setAddress((prev) => ({ ...prev, province: res.data }));
    };
    initProvinces();
  }, []);
  useEffect(() => {
    const initDistricts = async () => {
      if (address.provinceCode) {
        const res = await BranchsService.getListDistricts({ provinceCode: address.provinceCode });
        setAddress((prev) => ({ ...prev, district: res.data }));
      }
    };
    initDistricts();
  }, [address.provinceCode]);
  useEffect(() => {
    const initWards = async () => {
      if (address.districtCode) {
        const res = await BranchsService.getListWards({ districtCode: address.districtCode });
        setAddress((prev) => ({ ...prev, ward: res.data }));
      }
    };
    initWards();
  }, [address.districtCode]);

  const initData = async () => {
    const res = await SettingService.get();
    setListRole(res.data.sort((a, b) => a.id - b.id));
  };
  useEffect(() => {
    initData();
  }, []);

  const handleOk = async () => {
    if (dataEdit?.id) {
      const res = form.getFieldValue();
      const value = {
        ...res,
        id: dataEdit.id,
        birthDay: res.birthDay ? moment(res.birthDay).format('YYYY-MM-DD 00:00:00') : null,
        timeStart: res.timeStart ? moment(res.timeStart).format('YYYY-MM-DD 00:00:00') : null,
        position: {
          code: res.position,
        },
        roles: [res.roles],
        lastName: '',
        branchDtos: res.branchDtos.map((ele) => ({ uuid: ele })),
        firstName: res.firstName.trim(),
        address: {
          street: res.street,
          mtProvince: {
            id: res.provinceId,
          },
          mtDistrict: {
            id: res.districtId,
          },
          mtWard: {
            id: res.wardId,
          },
        },
      };
      await UserManagementService.update(value);
      setDataEdit();
      handleChange();
      form.resetFields();
      setShowModal(false);
    } else {
      const data = form.getFieldValue();
      const value = {
        ...data,
        birthDay: moment(data.birthDay).format('YYYY-MM-DD 00:00:00'),
        timeStart: moment(data.timeStart).format('YYYY-MM-DD 00:00:00'),
        position: {
          code: data.position,
        },
        branchDtos: data.branchDtos.map((ele) => ({ uuid: ele })),
        roles: [data.roles],
        lastName: '',
        address: {
          street: data.street,
          mtProvince: {
            id: data.provinceId,
          },
          mtDistrict: {
            id: data.districtId,
          },
          mtWard: {
            id: data.wardId,
          },
        },
      };
      const res = await UserManagementService.create(value);
      if (!res) {
        return false;
      }
      if (res) {
        handleChange();
        form.resetFields();
        setShowModal(false);
      }
    }
  };
  const handleCancel = () => {
    setDataEdit();
    form.resetFields();
    setShowModal(false);
  };
  const handleOpenModal = async (isOpen, data) => {
    setShowModal(isOpen);
    if (!data) {
      return;
    }
    const dataUserManagement = await UserManagementService.getDetail(data.id);
    const valueUser = {
      ...dataUserManagement,
      birthDay: dataUserManagement.birthDay ? moment(dataUserManagement.birthDay) : null,
      timeStart: dataUserManagement.timeStart ? moment(dataUserManagement.timeStart) : null,
      firstName: dataUserManagement.firstName,
      position: dataUserManagement.position.code,
      branchDtos: dataUserManagement.branchDtos.map((e) => e.uuid),
      roles: dataUserManagement.roles[0],
      provinceId: dataUserManagement?.address?.mtProvince?.id,
      districtId: dataUserManagement?.address?.mtDistrict?.id,
      wardId: dataUserManagement?.address?.mtWard?.id,
      street: dataUserManagement?.address?.street,
    };
    setDataEdit(valueUser);
    setAddress((prev) => ({
      ...prev,
      provinceCode: dataUserManagement?.address?.mtProvince?.code,
      districtCode: dataUserManagement?.address?.mtDistrict?.code,
    }));
    form.setFieldsValue(valueUser);
  };
  return [
    handleOpenModal,
    () => (
      <div>
        {showModal && (
          <Modal
            // bodyStyle={{ height: 625 }}
            destroyOnClose={true}
            title={
              dataEdit?.id ? (
                <div className="flex justify-between">
                  <div className="text-base font-bold">Chỉnh sửa người dùng</div>
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
                  <div className="text-base font-bold">Thêm người dùng</div>
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
            className="!w-8/12 min-w-min pb-0"
            closable={false}
            style={{ top: 5 }}
          >
            <Form
              onFinish={() => {
                handleOk();
              }}
              form={form}
              onValuesChange={(_, values) => setFormValues((prevState) => ({ ...prevState, ...values }))}
              colon={false}
              className=" min-w-min"
            >
              <div>
                <div className="px-4">
                  <div>
                    <div className="w-full flex justify-between gap-4">
                      <Form.Item
                        className="w-6/12"
                        label="Tên người dùng"
                        name="firstName"
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng nhập họ tên!',
                          },
                          {
                            pattern:
                              /^(?=.*[a-vwxyzỳọáầảấờễàạằệếýộậốũứĩõúữịỗìềểẩớặòùồợãụủíỹắẫựỉỏừỷởóéửỵẳẹèẽổẵẻỡơôưăêâđ])[a-vwxyzỳọáầảấờễàạằệếýộậốũứĩõúữịỗìềểẩớặòùồợãụủíỹắẫựỉỏừỷởóéửỵẳẹèẽổẵẻỡơôưăêâđ ]{1,}$/i,
                            message: 'Vui lòng chỉ nhập chữ',
                          },
                        ]}
                      >
                        <Input
                          placeholder="Nhập tên người dùng"
                          className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                        />
                      </Form.Item>

                      <Form.Item className="w-6/12" name="gender" label="Giới tính">
                        <Select
                          className="w-full !rounded-lg  text-sm font-normal"
                          allowClear
                          placeholder="Chọn giới tính"
                        >
                          <Option className="w-full" value="MALE">
                            Nam
                          </Option>
                          <Option className="w-full" value="FEMALE">
                            Nữ
                          </Option>
                        </Select>
                      </Form.Item>
                    </div>
                    <div className="w-full flex justify-between gap-4">
                      <Form.Item className="w-6/12" name="birthDay" label="Ngày sinh">
                        <DatePicker
                          placeholder="DD/MM/YYYY"
                          className="!w-full border rounded-lg !bg-white  border-gray-200"
                          format="DD/MM/YYYY"
                          disabledDate={(current) => {
                            return current && current > moment().endOf('day');
                          }}
                        />
                      </Form.Item>
                      <Form.Item
                        className="w-6/12 "
                        name="identityCard"
                        label="CMND/CCCD"
                        rules={[
                          {
                            min: 9,
                            message: 'Vui lòng nhập tối thiểu 9 chữ số!',
                          },
                          {
                            max: 12,
                            message: 'Vui lòng nhập tối đa 12 chữ số!',
                          },
                        ]}
                      >
                        <Input
                          placeholder="Nhập số CMND/CCCD"
                          className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                        />
                      </Form.Item>
                    </div>
                    <div className="w-full flex justify-between gap-4">
                      <Form.Item
                        className="w-6/12"
                        name="phone"
                        label="Số điện thoại"
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng nhập số điện thoại!',
                          },
                          {
                            min: 10,
                            max: 10,
                            message: 'Vui lòng nhập 10 chữ số!',
                          },
                          {
                            pattern: /^[0-9]+$/i,
                            message: 'Vui lòng chỉ nhập số !',
                          },
                        ]}
                      >
                        <Input
                          placeholder="Nhập số điện thoại"
                          className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                        />
                      </Form.Item>
                      <Form.Item
                        className="w-6/12"
                        name="email"
                        label="Email"
                        rules={[
                          {
                            type: 'email',
                            message: 'Vui lòng nhập đúng định dạng email!',
                          },
                          {
                            required: true,
                            message: 'Vui lòng nhập email!',
                          },
                        ]}
                      >
                        <Input
                          type="email"
                          placeholder="Nhập Email"
                          className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                        />
                      </Form.Item>
                    </div>
                    <div className="w-full flex justify-between gap-4">
                      <Form.Item className="w-1/4" label="Số nhà, đường" name="street">
                        <Input
                          className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                          placeholder="Nhập số nhà, đường"
                        />
                      </Form.Item>
                      <Form.Item className="w-1/4" name="provinceId" label="Tỉnh/TP">
                        <Select
                          className="!w-full !rounded-lg  text-sm font-normal"
                          placeholder="Chọn Tỉnh/TP"
                          allowClear
                          onChange={(value) => {
                            const p = address?.province?.find((ele) => ele.id === value);
                            setAddress((prev) => ({ ...prev, provinceCode: p?.code }));
                            form.setFieldsValue({ districtId: undefined, wardId: undefined });
                          }}
                          options={address.province.map((i) => ({ value: i.id, label: i.name }))}
                          showSearch
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                          }
                        ></Select>
                      </Form.Item>
                      <Form.Item className="w-1/4" name="districtId" label="Quận/ Huyện">
                        <Select
                          className="!w-full !rounded-lg  text-sm font-normal"
                          placeholder="Chọn Quận/ Huyện"
                          allowClear
                          showSearch
                          optionFilterProp="children"
                          onChange={(value) => {
                            const d = address?.district.find((ele) => ele.id === value);
                            setAddress((prev) => ({ ...prev, districtCode: d?.code }));
                            form.setFieldsValue({ wardId: undefined });
                          }}
                          filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                          }
                          options={address.district.map((i) => ({ value: i.id, label: i.name }))}
                        ></Select>
                      </Form.Item>
                      <Form.Item className="w-1/4" name="wardId" label="Phường/Xã">
                        <Select
                          className="!w-full !rounded-lg  text-sm font-normal"
                          placeholder="Chọn Phường/Xã"
                          allowClear
                          showSearch
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                          }
                          options={address.ward.map((i) => ({ value: i.id, label: i.name }))}
                        ></Select>
                      </Form.Item>
                    </div>
                    <div className="w-full flex justify-between gap-4">
                      <Form.Item className="w-6/12" name="timeStart" label="Ngày bắt đầu làm việc">
                        <DatePicker
                          placeholder="DD/MM/YYYY"
                          className="!w-full border rounded-lg !bg-white  border-gray-200"
                          format="DD/MM/YYYY"
                        />
                      </Form.Item>
                      <Form.Item
                        className="w-6/12"
                        name="roles"
                        label="Vai trò"
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng chọn vai trò!',
                          },
                        ]}
                      >
                        <Select
                          className="w-full !rounded-lg  text-sm font-normal"
                          allowClear
                          placeholder="Chọn vai trò"
                          options={listRole.map((ele) => ({ value: ele.roleCode, label: ele.roleName }))}
                        ></Select>
                      </Form.Item>
                    </div>
                    <div className="w-full flex justify-between gap-4">
                      <Form.Item className="w-6/12" name="position" label="Chức vụ">
                        <Select
                          className="w-full !rounded-lg  text-sm font-normal"
                          allowClear
                          placeholder="Chọn chức vụ"
                        >
                          <Option className="w-full" value="DOCTOR">
                            Bác sĩ
                          </Option>
                          <Option className="w-full" value="ACCOUNTANT">
                            Kế toán
                          </Option>
                          <Option className="w-full" value="ORG_ADMIN">
                            Admin
                          </Option>
                          <Option className="w-full" value="RECEPTIONIST">
                            Lễ Tân
                          </Option>
                        </Select>
                      </Form.Item>
                      <Form.Item
                        className="w-6/12"
                        name="userName"
                        label="Tài khoản"
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng nhập tên tài khoản!',
                          },
                        ]}
                      >
                        <Input
                          placeholder="Nhập tên tài khoản"
                          className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                        />
                      </Form.Item>
                    </div>
                    <div className="w-full flex justify-between gap-4">
                      <Form.Item
                        className="w-6/12"
                        name="branchDtos"
                        label="Chọn chi nhánh"
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng chọn chi nhánh!',
                          },
                        ]}
                      >
                        <Select
                          mode="multiple"
                          className="w-full !rounded-lg  text-sm font-normal"
                          allowClear
                          placeholder="Chọn chi nhánh"
                          options={listBranch.map((ele) => ({ value: ele.uuid, label: ele.branchName }))}
                        ></Select>
                      </Form.Item>
                    </div>
                  </div>
                </div>
                <Form.Item>
                  <div className="flex items-center justify-center  border-solid gap-6 border-slate-200 ">
                    <button
                      className="active:ring-2 ring-offset-1 ring-offset-gray-300 ring-gray-300 bg-white text-gray-500 border-gray-400 border !rounded-lg px-16 py-2 text-base font-medium  "
                      type="button"
                      onClick={() => {
                        handleCancel();
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
              </div>
            </Form>
          </Modal>
        )}
      </div>
    ),
  ];
};
