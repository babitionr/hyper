import { Form, Input, DatePicker, Select, Modal, Button, Checkbox, InputNumber } from 'antd';
import React, { useState, useEffect } from 'react';
import { UserManagementService } from 'services/userManagement';
import moment from 'moment/moment';
import { SettingService } from 'services/setting';
import { BranchsService } from 'services/branchs';
import CameraPhoto from 'components/camera-photo';
import { UtilService } from 'services/util';
import { Upload, Spin } from 'components';
import classNames from 'classnames';
import TableData from './components/TableOtherIncome';
import { blockInvalidChar } from 'utils/func';
import { RevenueSettingService } from 'services/revenue-setting';
import { useLocation } from 'react-router';

export const AddUser = ({ handleChange, showModal, setShowModal, listBranch, canEdit = true, showText = true }) => {
  const [form] = Form.useForm();
  const { Option } = Select;
  const [dataEdit, setDataEdit] = useState();
  const [listRole, setListRole] = useState([]);
  const [listPosition, setListPosition] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [dataSource, setDataSource] = useState([
    {
      key: 1,
      revenueItemUuid: null,
      unit: null,
      amount: null,
      isDelete: false,
    },
  ]);

  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const organizationUuid = localStorage.getItem('keyOrganizationUuid');

  const [listOrderIncome, setListOrderIncome] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const initOrderIncome = async () => {
      const res = await RevenueSettingService.get(organizationUuid);
      setListOrderIncome(res.data ?? []);
    };
    initOrderIncome();
  }, [location.pathname]);
  const removeImg = () => {
    setImageUrl('');
  };
  const [faceId] = useState(false);
  const [openModalCamera, setOpenModalCamera] = useState(false);

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

  const initData = async () => {
    const res = await SettingService.get();
    setListRole(res.data.sort((a, b) => a.id - b.id));
    const resListPosition = await UserManagementService.getListAllPosition();
    setListPosition(resListPosition);
  };
  useEffect(() => {
    initData();
  }, []);

  const handleOk = async () => {
    setIsLoadingSubmit(true);
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
        faceId: res.faceId ?? false,
        imageUrl,
        salaryAmount: res.salaryAmount ? res.salaryAmount : 0,
        revenueUserDtoList: dataSource
          ?.filter((i) => i.revenueItemUuid !== null)
          .map(({ key, ...rest }) => ({ ...rest })),
      };

      const response = await UserManagementService.update(value);
      if (response) {
        handleCancel();
        handleChange();
      }
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
        faceId: data.faceId ?? false,
        imageUrl,
        salaryAmount: data.salaryAmount ? data.salaryAmount : 0,
        revenueUserDtoList: dataSource
          ?.filter((i) => i.revenueItemUuid !== null)
          ?.map(({ key, ...rest }) => ({ ...rest, uuid: null })),
      };

      const res = await UserManagementService.create(value);
      if (!res) {
        return false;
      }
      if (res) {
        handleCancel();
        handleChange();
      }
    }
    setIsLoadingSubmit(false);
  };
  const handleCancel = () => {
    setDataSource([
      {
        key: 1,
        revenueItemUuid: null,
        unit: null,
        amount: null,
        isDelete: false,
      },
    ]);
    setDataEdit();
    form.resetFields();
    setImageUrl('');
    setShowModal(false);
    setIsLoadingSubmit(false);
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
    setImageUrl(dataUserManagement?.imageUrl);
    const resDistrict = dataUserManagement?.address?.mtProvince?.code
      ? await BranchsService.getListDistricts({ provinceCode: dataUserManagement?.address?.mtProvince?.code })
      : [];
    const resWard = dataUserManagement?.address?.mtDistrict?.code
      ? await BranchsService.getListWards({ districtCode: dataUserManagement?.address?.mtDistrict?.code })
      : [];
    setAddress((prev) => ({
      ...prev,
      provinceCode: dataUserManagement?.address?.mtProvince?.code,
      districtCode: dataUserManagement?.address?.mtDistrict?.code,
      district: resDistrict?.data ?? [],
      ward: resWard?.data ?? [],
    }));
    setDataSource(
      dataUserManagement?.revenueUserDtoList?.length === 0
        ? [
            {
              key: 1,
              revenueItemUuid: null,
              unit: null,
              amount: null,
              isDelete: false,
            },
          ]
        : dataUserManagement?.revenueUserDtoList,
    );
    form.setFieldsValue(valueUser);
  };

  const onUploadImage = async (file) => {
    try {
      const data = await UtilService.post(file);
      setImageUrl(data);
      setOpenModalCamera(false);
    } catch (error) {
      console.log(error);
    }
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
              // onFinish={() => {
              //   handleOk();
              // }}
              form={form}
              colon={false}
              className=" min-w-min"
            >
              <div>
                <div className="px-4">
                  <div className="">
                    <div className="flex gap-4 w-full">
                      <div className="relative w-80 h-60 mt-5">
                        {!imageUrl && (
                          <div className="absolute bottom-10 left-2 z-0 text-center">
                            {faceId === true ? (
                              'Yêu cầu hình ảnh với độ phân giải 1280*736'
                            ) : (
                              <>
                                {' '}
                                Kéo thả ảnh vào khung ảnh, hoặc nhấn
                                <span className="text-blue-500"> tải ảnh từ thiết bị </span>
                              </>
                            )}
                          </div>
                        )}
                        {/* </Form.Item> */}
                        <div className="w-full">
                          {!imageUrl ? (
                            <div>
                              {canEdit ? (
                                <>
                                  <Upload
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
                                        '!rounded-2xl h-52 w-full aspect-square object-cover flex items-center justify-center'
                                      }
                                    >
                                      <div className={'text-center ' + ''}>
                                        <i className={`las la-image text-3xl`}></i>

                                        <p className="text-xs text-gray-700 ">
                                          {/* <span className="">Tải ảnh lên từ thiết bị</span> */}
                                        </p>
                                      </div>
                                    </div>
                                  </Upload>
                                  <i className="las la-upload absolute icon-upload top-1/2 left-1/2 hidden text-4xl -translate-x-2/4 -translate-y-2/4 "></i>
                                  <Button
                                    className="w-full mt-1"
                                    type="primary"
                                    onClick={() => {
                                      setOpenModalCamera(true);
                                    }}
                                  >
                                    Chụp từ Camera
                                  </Button>
                                </>
                              ) : (
                                <div
                                  className={
                                    'border border-dashed border-gray-500 rounded-xl ' +
                                    '!rounded-2xl h-52 w-full aspect-square object-cover'
                                  }
                                >
                                  <div className={'text-center ' + ''}>
                                    <i className="las la-image text-2xl"></i>
                                    {showText === true ? (
                                      <p className="text-xs text-gray-700 ">
                                        <span className="">Tải ảnh từ thiết bị</span>
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
                                      'bg-cover bg-center rounded-[10px] z-30',
                                      '!rounded-2xl h-52 w-full aspect-square object-cover',
                                      {
                                        canEdit: 'cursor-pointer ',
                                      },
                                    )}
                                    style={{ backgroundImage: 'url(' + imageUrl + ')' }}
                                  >
                                    <div className="flex justify-end">
                                      {canEdit ? (
                                        <i
                                          className={'las la-times text-right hover:scale-150 ' + 'text-base'}
                                          onClick={() => removeImg()}
                                        ></i>
                                      ) : null}
                                    </div>
                                  </div>
                                )}
                                <Button
                                  className="w-full mt-1"
                                  type="primary"
                                  onClick={() => {
                                    setOpenModalCamera(true);
                                  }}
                                >
                                  Chụp từ Camera
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="w-full">
                        <div className="w-full flex justify-between gap-4">
                          <Form.Item
                            className="w-9/12"
                            label="Tên người dùng"
                            name="firstName"
                            rules={[
                              {
                                required: true,
                                message: 'Vui lòng nhập họ tên!',
                              },
                              // {
                              //   pattern:
                              //     /^(?=.*[a-vwxyzỳọáầảấờễàạằệếýộậốũứĩõúữịỗìềểẩớặòùồợãụủíỹắẫựỉỏừỷởóéửỵẳẹèẽổẵẻỡơôưăêâđ])[a-vwxyzỳọáầảấờễàạằệếýộậốũứĩõúữịỗìềểẩớặòùồợãụủíỹắẫựỉỏừỷởóéửỵẳẹèẽổẵẻỡơôưăêâđ ]{1,}$/i,
                              //   message: 'Vui lòng chỉ nhập chữ',
                              // },
                            ]}
                          >
                            <Input
                              placeholder="Nhập tên người dùng"
                              className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                            />
                          </Form.Item>
                          <Form.Item className="w-3/12" label="Sử dụng FaceID" name="faceId" valuePropName="checked">
                            <Checkbox>Face ID</Checkbox>
                          </Form.Item>
                        </div>
                        <div className="w-full flex justify-between gap-4">
                          <Form.Item className="w-4/12" name="gender" label="Giới tính">
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
                          <Form.Item className="w-4/12" name="birthDay" label="Ngày sinh">
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
                            className="w-4/12 "
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
                      </div>
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
                          onChange={async (value) => {
                            const p = address?.province?.find((ele) => ele.id === value);
                            const res = p ? await BranchsService.getListDistricts({ provinceCode: p?.code }) : [];
                            setAddress((prev) => ({
                              ...prev,
                              provinceCode: p?.code,
                              district: res?.data ?? [],
                              ward: [],
                            }));
                            form.setFieldsValue({ districtId: undefined, wardId: undefined });
                          }}
                          options={address?.province?.map((i) => ({ value: i?.id, label: i?.name }))}
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
                          onChange={async (value) => {
                            const d = address?.district.find((ele) => ele.id === value);
                            const res = d ? await BranchsService.getListWards({ districtCode: d?.code }) : [];
                            setAddress((prev) => ({ ...prev, districtCode: d?.code, ward: res?.data ?? [] }));
                            form.setFieldsValue({ wardId: undefined });
                          }}
                          filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                          }
                          options={address?.district?.map((i) => ({ value: i?.id, label: i?.name }))}
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
                          options={address?.ward?.map((i) => ({ value: i?.id, label: i?.name }))}
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
                      <Form.Item
                        className="w-6/12"
                        name="position"
                        label="Chức vụ"
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng chọn chức vụ!',
                          },
                        ]}
                      >
                        <Select
                          className="w-full !rounded-lg  text-sm font-normal"
                          allowClear
                          placeholder="Chọn chức vụ"
                          options={listPosition.map((ele) => ({ value: ele.code, label: ele.name }))}
                        ></Select>
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
                      <Form.Item
                        className="w-6/12"
                        name="salaryAmount"
                        label="Lương cứng"
                        rules={[
                          {
                            required: true,
                            message: 'Vui lòng nhập lương cứng!',
                          },
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
                          placeholder="Nhập lương cứng"
                          className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-2 pt-[4px] focus:outline-none"
                        />
                      </Form.Item>
                    </div>
                    <div className="w-full flex justify-between gap-4">
                      <Form.Item className="w-6/12" name="status" label="Trạng thái">
                        <Select
                          className="w-full !rounded-lg  text-sm font-normal"
                          allowClear
                          placeholder="Chọn trạng thái"
                        >
                          <Option className="w-full" value="WORKING">
                            Đang làm việc
                          </Option>
                          <Option className="w-full" value="RETRIED">
                            Ngưng làm việc
                          </Option>
                        </Select>
                      </Form.Item>
                    </div>
                    <div className="w-full flex justify-between gap-4 mb-4">
                      <TableData
                        dataSource={dataSource?.map((i, idx) => ({ ...i, key: idx + 1 }))}
                        setDataSource={setDataSource}
                        listOrderIncome={listOrderIncome}
                      />
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
                    <Button
                      className=" !border-rose-500 border !text-white !bg-rose-500 focus:!bg-rose-600 hover:!bg-rose-600 !px-16 flex items-center justify-center !pt-4 !pb-6 !text-base font-medium "
                      loading={isLoadingSubmit}
                      disabled={isLoadingSubmit}
                      onClick={async () => {
                        try {
                          await form.validateFields();
                          await handleOk();
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
            </Form>
          </Modal>
        )}
        <Modal
          title="Chụp ảnh"
          destroyOnClose={true}
          footer={null}
          closable={true}
          onCancel={() => setOpenModalCamera(false)}
          open={openModalCamera}
          zIndex={9999}
        >
          <CameraPhoto onUploadImage={(param) => onUploadImage(param)} />
        </Modal>
      </div>
    ),
  ];
};
