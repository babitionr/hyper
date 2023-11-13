import { Form, Input, DatePicker, Select, Modal, Button, Checkbox } from 'antd';
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { CustomerService } from 'services/customer';
import { Upload, Spin } from 'components';
import { UtilService } from 'services/util';
// import default_avatar from '../../../assets/images/default_avatar.png';
import classNames from 'classnames';
// import default_avatar from '../../../assets/images/default_avatar.png';
import { BranchsService } from 'services/branchs';
import CameraPhoto from 'components/camera-photo';
import { CustomerGroupService } from 'services/customer-group';
import { CustomerResourceService } from 'services/customer-resource';
// import { AuthSerivce } from 'services/Auth';

const { Option } = Select;

const AddCustomer = ({ handleChange, setShowModal, showModal, canEdit = true, showText = true, setData }) => {
  const [form] = Form.useForm();
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  // const [formValues, setFormValues] = useState({});
  const [dataEdit, setDataEdit] = useState();
  const [imageUrl, setImageUrl] = useState('');
  const removeImg = () => {
    setImageUrl('');
  };

  const [openModalCamera, setOpenModalCamera] = useState(false);
  const [listBranch, setListBranch] = useState([]);
  const [faceId] = useState(false);
  // const [listDoctors, setListDoctors] = useState([]);
  const getListBranch = async () => {
    const res = await BranchsService.getBrandHeader();
    setListBranch(res.data);
  };

  // get customer group list
  const [customerGroupList, setCustomerGroupList] = useState([]);
  const getListCustomerGroup = async () => {
    const data = await CustomerGroupService.getAllCustomerGroupList(localStorage.getItem('branchUuid'));
    setCustomerGroupList(data);
  };

  // get customer resource list
  const [customerResourceList, setCustomerResourceList] = useState([]);
  const getListCustomerResource = async () => {
    const data = await CustomerResourceService.getAllCustomerResourceList(localStorage.getItem('branchUuid'));
    setCustomerResourceList(data);
  };

  // const getListDoctors = async () => {
  //   const res = await AuthSerivce.getUserByPosition("DOCTOR");
  //   setListDoctors(res.data);
  // };
  // const onChange = (e) => {
  //   setFaceID(e.target.checked);
  // };

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
    getListBranch();
    getListCustomerGroup();
    getListCustomerResource();
  }, []);
  // useEffect(() => {
  //   const initDistricts = async () => {
  //     if (address.provinceCode) {
  //       const res = await BranchsService.getListDistricts({ provinceCode: address.provinceCode });
  //       setAddress((prev) => ({ ...prev, district: res.data }));
  //     }
  //   };
  //   initDistricts();
  // }, [address.provinceCode]);
  // useEffect(() => {
  //   const initWards = async () => {
  //     if (address.districtCode) {
  //       const res = await BranchsService.getListWards({ districtCode: address.districtCode });
  //       setAddress((prev) => ({ ...prev, ward: res.data }));
  //     }
  //   };
  //   initWards();
  // }, [address.districtCode]);

  const handleOk = async () => {
    setIsLoadingSubmit(true);
    const data = form.getFieldsValue();

    if (dataEdit?.uuid) {
      // if (imageUrl === '') return Message.error({ text: 'vui lòng chọn hình ảnh.' })
      const value = {
        ...data,
        uuid: dataEdit.uuid,
        dateOfBirth: data.dateOfBirth ? moment(data.dateOfBirth).format('YYYY-MM-DD hh:mm:ss') : null,
        address:
          data.street || data.ward || data.district || data.province
            ? {
                street: data.street?.length ? data.street : null,
                mtWard: data?.ward
                  ? {
                      id: data?.ward ?? null,
                    }
                  : null,
                mtDistrict: data?.district
                  ? {
                      id: data?.district,
                    }
                  : null,
                mtProvince: data?.province
                  ? {
                      id: data?.province,
                    }
                  : null,
              }
            : null,
        faceId: data.faceId,
        faceIdImage: data.faceId ? imageUrl : null,
        imgUrl: imageUrl,
        customerBranchDtoList: data?.branchDtos?.map((ele) => ({ uuid: ele })),
        customerGroupUuid: data?.customerGroup,
        customerResourceUuid: data?.customerResource,
      };
      delete data.street;
      delete data.ward;
      delete data.district;
      delete data.province;
      const res = await CustomerService.update(value);
      if (res) {
        const dataDetailCustomer = await CustomerService.getDetail(dataEdit?.uuid);
        setData && setData(dataDetailCustomer);
        handleChange();
        setDataEdit();
        handleCancel();
      }
    } else {
      // if (imageUrl === '') return Message.error({ text: 'vui lòng chọn hình ảnh.' })
      const value = {
        ...data,
        dateOfBirth: data.dateOfBirth ? moment(data.dateOfBirth).format('YYYY-MM-DD hh:mm:ss') : null,
        gender: data.gender.toUpperCase(),
        address:
          data.street || data.ward || data.district || data.province
            ? {
                street: data.street?.length ? data.street : null,
                mtWard: data?.ward
                  ? {
                      id: data?.ward ?? null,
                    }
                  : null,
                mtDistrict: data?.district
                  ? {
                      id: data?.district,
                    }
                  : null,
                mtProvince: data?.province
                  ? {
                      id: data?.province,
                    }
                  : null,
              }
            : null,
        imgUrl: imageUrl,
        faceId: data.faceId,
        faceIdImage: data.faceId ? imageUrl : null,
        customerBranchDtoList: data.branchDtos.map((ele) => ({ uuid: ele })),
        customerGroupUuid: data?.customerGroup,
        customerResourceUuid: data?.customerResource,
      };
      delete value.street;
      delete value.ward;
      delete value.district;
      delete value.province;

      const res = await CustomerService.create(value);
      if (res) {
        handleChange();
        handleCancel();
      }
    }
    setIsLoadingSubmit(false);
  };
  const handleCancel = () => {
    form.resetFields();
    setShowModal(false);
    setIsLoadingSubmit(false);
    setAddress((prev) => ({
      ...prev,
      provinceCode: '',
      district: [],
      districtCode: '',
      ward: [],
    }));
  };

  const handleOpenModal = async (isOpen, data) => {
    setImageUrl('');
    setShowModal(isOpen);
    if (!data) {
      return;
    }
    const dataDetailCustomer = await CustomerService.getDetail(data.uuid);
    const valueDetail = {
      ...dataDetailCustomer,
      dateOfBirth: moment(dataDetailCustomer.dateOfBirth),
      street: dataDetailCustomer.address?.street,
      ward: dataDetailCustomer.address?.mtWard?.id,
      district: dataDetailCustomer.address?.mtDistrict?.id,
      province: dataDetailCustomer.address?.mtProvince?.id,
      branchDtos: dataDetailCustomer.customerBranchDtoList.map((ele) => ele.uuid),
      customerGroup: dataDetailCustomer?.customerGroupDto?.uuid,
      customerResource: dataDetailCustomer?.customerResourceDto?.uuid,
    };

    if (!dataDetailCustomer.dateOfBirth) {
      delete valueDetail.dateOfBirth;
    }

    const resDistrict = dataDetailCustomer?.address?.mtProvince?.code
      ? await BranchsService.getListDistricts({ provinceCode: dataDetailCustomer?.address?.mtProvince?.code })
      : [];
    const resWard = dataDetailCustomer?.address?.mtDistrict?.code
      ? await BranchsService.getListWards({ districtCode: dataDetailCustomer?.address?.mtDistrict?.code })
      : [];
    setAddress((prev) => ({
      ...prev,
      provinceCode: dataDetailCustomer?.address?.mtProvince?.code,
      districtCode: dataDetailCustomer?.address?.mtDistrict?.code,
      district: resDistrict?.data ?? [],
      ward: resWard?.data ?? [],
    }));
    setImageUrl(dataDetailCustomer.imgUrl);
    setDataEdit(valueDetail);
    form.setFieldsValue(valueDetail);
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
      <>
        {' '}
        {showModal && (
          <>
            <Modal
              destroyOnClose={true}
              title={
                <div className="flex justify-between">
                  <div className="text-lg font-bold ">Thông tin khách hàng</div>
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
              className="!w-7/12 min-w-min pb-0"
              closable={false}
              style={{ top: 5 }}
            >
              <hr className="overflow-hidden px-0" />
              <Form
                // onFinish={() => {
                //   handleOk();
                // }}
                form={form}
                // onValuesChange={(_, values) => setFormValues((prevState) => ({ ...prevState, ...values }))}
                colon={false}
                className=" min-w-min"
              >
                <div className="   ">
                  <div className="  bg-white ">
                    {/* <div className="flex items-start justify-between p-4 border-b-2 border-solid border-blue-50  rounded-t">
                <h3 className="text-lg font-bold">Thông tin khách hàng</h3>
                <button
                  className=""
                  onClick={() => {
                    onReset();
                    handleCancel();
                  }}
                >
                  <span className="text-4xl pr-2">x</span>
                </button>
              </div> */}

                    <div className="p-2">
                      <div className="flex gap-4">
                        <div className="relative w-80 h-60 mt-5">
                          {/* <img src={default_avatar}></img> */}
                          {/* <Form.Item
                          className="w-full"
                          name="imageUrl"
                          rules={[
                            {
                              required: true,
                              message: 'Vui lòng chọn hình ảnh!',
                            },
                          ]}
                        > */}
                          {/* <Upload
                          onlyImage={true}
                          maxSize={50}
                          className="absolute top-0 left-0 right-0 bottom-0"
                          action={async (file) => {
                            const urlArr = await UtilService.post(file);
                            setImageUrl(urlArr ?? '');
                          }}
                        >
                          <div className='flex text-center justify-center items-center flex-col h-60 border cursor-pointer z-10'>
                            <img
                              src={imageUrl || default_avatar}
                              // alt="image"
                              className="aspect-square object-cover shadow-md bg-gray-100 cursor-pointer z-10 "
                            />
                          </div>
                          {/* <div className="w-[55px] h-[45px] bg-teal-600 opacity-80 absolute right-0 bottom-0 rounded-tl-[0.625rem] rounded-br-[0.625rem] flex items-center justify-center">
                            <i className="las la-camera text-white text-xl"></i>
                          </div> */}
                          {/* </Upload> */}
                          {/* <div className='absolute bottom-10 left-2 z-0 text-center'> */}
                          {/* Kéo thả ảnh vào khung ảnh, hoặc nhấn */}
                          {/* <span className="text-blue-500"> tải ảnh từ thiết bị </span> */}
                          {/* </div>  */}
                          {/* </Upload> */}

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
                        <div className="flex flex-wrap gap-2 w-full">
                          <div className="w-full flex justify-between">
                            <Form.Item
                              className="w-full"
                              label="Họ và tên"
                              name="fullName"
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
                                className="h-10 w-full text-sm font-normal block  rounded-lg border border-gray-200  py-[7px] px-4 "
                                placeholder="Nhập họ và tên"
                              />
                            </Form.Item>
                          </div>
                          <div className="w-full flex justify-between gap-4">
                            <Form.Item
                              className="w-5/12"
                              name="dateOfBirth"
                              label="Ngày sinh"
                              // rules={[
                              //   {
                              //     required: true,
                              //     message: 'Vui lòng chọn ngày sinh!',
                              //   },
                              // ]}
                            >
                              <DatePicker
                                disabledDate={(date) => new Date(date).getTime() > new Date().getTime()}
                                placeholder="Chọn ngày sinh"
                                className="!w-full border rounded-lg !bg-white  border-gray-200"
                                format="DD/MM/YYYY"
                              />
                            </Form.Item>
                            <Form.Item
                              className="w-4/12"
                              name="gender"
                              label="Giới tính"
                              rules={[
                                {
                                  required: true,
                                  message: 'Vui lòng chọn giới tính',
                                },
                              ]}
                            >
                              <Select className="w-full !rounded-lg  text-sm font-normal" placeholder="Chọn giới tính">
                                <Option className="w-full" value="MALE">
                                  Nam
                                </Option>
                                <Option className="w-full" value="FEMALE">
                                  Nữ
                                </Option>
                              </Select>
                            </Form.Item>
                            <Form.Item className="w-3/12" label="Sử dụng FaceID" name="faceId" valuePropName="checked">
                              <Checkbox>Face ID</Checkbox>
                            </Form.Item>
                          </div>
                          <div className="w-full flex justify-between gap-4">
                            <Form.Item
                              className="w-6/12"
                              label="Email"
                              name="email"
                              rules={[
                                {
                                  type: 'email',
                                  message: 'Vui lòng nhập email đúng định dạng',
                                },
                              ]}
                            >
                              <Input
                                placeholder="Nhập email"
                                className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                              />
                            </Form.Item>
                            <Form.Item
                              className="w-6/12"
                              label="Số điện thoại"
                              name="phoneNumber"
                              rules={[
                                {
                                  required: true,
                                  message: 'Vui lòng nhập số điện thoại!',
                                },
                                {
                                  pattern: /^[0-9]+$/i,
                                  message: 'Vui lòng chỉ nhập số !',
                                },
                              ]}
                            >
                              <Input
                                className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                                placeholder="Nhập số điện thoại"
                              />
                            </Form.Item>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className=" px-2 pb-2 ">
                      <div className=" text-sm font-medium text-gray-500 ">Địa chỉ</div>
                      <div className="flex justify-between gap-6">
                        <Form.Item className="w-1/4" label="Số nhà, đường" name="street">
                          <Input
                            className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                            placeholder="Nhập số nhà, đường"
                          />
                        </Form.Item>
                        <Form.Item className="w-1/4" name="province" label="Tỉnh/TP">
                          <Select
                            allowClear
                            className="!w-full !rounded-lg  text-sm font-normal"
                            placeholder="Chọn Tỉnh/TP"
                            onChange={async (value) => {
                              const p = address?.province?.find((ele) => ele.id === value);
                              const res = p ? await BranchsService.getListDistricts({ provinceCode: p?.code }) : [];
                              setAddress((prev) => ({
                                ...prev,
                                provinceCode: p?.code,
                                district: res?.data ?? [],
                                ward: [],
                              }));
                              form.setFieldsValue({ district: undefined, ward: undefined });
                            }}
                            options={address?.province?.map((i) => ({ value: i?.id, label: i?.name }))}
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                          ></Select>
                          {/* <Input
                          className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                          placeholder="Nhập số Tỉnh/TP"
                        /> */}
                        </Form.Item>
                        <Form.Item className="w-1/4" name="district" label="Quận/ Huyện">
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
                              form.setFieldsValue({ ward: undefined });
                            }}
                            filterOption={(input, option) =>
                              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={address?.district?.map((i) => ({ value: i.id, label: i.name }))}
                          ></Select>
                        </Form.Item>
                        <Form.Item className="w-1/4" name="ward" label="Phường/Xã">
                          <Select
                            className="!w-full !rounded-lg  text-sm font-normal"
                            placeholder="Chọn Phường/Xã"
                            allowClear
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={address?.ward?.map((i) => ({ value: i.id, label: i.name }))}
                          ></Select>
                        </Form.Item>
                      </div>
                      <div className="flex flex-row gap-6 ">
                        <Form.Item className="w-1/3" label="Nghề nghiệp" name="jobTitle">
                          <Input
                            className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                            placeholder="Nhập nghề nghiệp"
                          />
                        </Form.Item>
                        <Form.Item className="w-1/3" label="Số thẻ BHYT" name="healthInsuranceNumber">
                          <Input
                            className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                            placeholder="Nhập số thẻ BHYT"
                          />
                        </Form.Item>
                        <Form.Item
                          className="w-1/3"
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
                        {/* <Form.Item className="w-1/3" name="bacSiChinh" label="Bác sĩ chính">
                        <Select
                        options={listDoctors.map(ele=> ({value: ele.id, label: ele.firstName}))}
                        allowClear className="!w-full !rounded-lg  text-sm font-normal" placeholder="Chọn bác sĩ chính">
                        </Select>
                      </Form.Item> */}
                      </div>
                      <div className="flex flex-row gap-6 ">
                        <Form.Item className="w-1/3" name="customerResource" label="Nguồn khách hàng">
                          <Select
                            allowClear
                            className="!w-full !rounded-lg  text-sm font-normal"
                            placeholder="Chọn nguồn khách hàng"
                            options={customerResourceList.map((ele) => ({
                              value: ele.uuid,
                              label: ele.name,
                            }))}
                          ></Select>
                        </Form.Item>
                        <Form.Item className="w-1/3" name="customerGroup" label="Nhóm khách hàng">
                          <Select
                            allowClear
                            className="!w-full !rounded-lg  text-sm font-normal"
                            placeholder="Chọn nhóm khách hàng"
                            options={customerGroupList.map((ele) => ({
                              value: ele.uuid,
                              label: ele.name,
                            }))}
                          ></Select>
                        </Form.Item>
                        <Form.Item className="w-1/3" label="Người giới thiệu" name="nguoiGioiThieu">
                          <Input
                            className="h-10 text-sm font-normal block !w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                            placeholder="Nhập người giới thiệu"
                          />
                        </Form.Item>
                        {/* <Form.Item className="w-1/3" label="FaceID" name="FaceID">
                          <Checkbox onChange={onChange}>Face ID</Checkbox>
                        </Form.Item> */}
                      </div>
                      <div className="w-full">
                        <Form.Item className="w-full" name="description" label="Mô tả">
                          <Input.TextArea
                            rows={2}
                            className=" w-full text-sm font-normal block !bg-white rounded-lg border border-gray-200  py-[7px] px-4 "
                            placeholder=""
                          />
                        </Form.Item>
                      </div>
                    </div>
                    <Form.Item>
                      <div className="flex items-center justify-center  border-solid gap-6 border-slate-200 rounded-b">
                        <button
                          className="active:ring-2 ring-offset-1 ring-offset-gray-300 ring-gray-300 bg-white text-gray-500 border-gray-400 border !rounded-lg px-16 py-2 text-base font-medium  "
                          type="button"
                          onClick={() => {
                            handleCancel();
                            setDataEdit();
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
                </div>
              </Form>
            </Modal>
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
          </>
        )}
      </>
    ),
  ];
};

export default AddCustomer;
