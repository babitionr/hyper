import React, { useState, useEffect } from 'react';
import { HookDataTable } from 'hooks';
import { columnBranch } from './columns/columnBranch';
import { Form, Input, Modal, Select } from 'antd';
import { Message, Spin, Upload } from 'components';
import { UtilService } from 'services/util';
import classNames from 'classnames';
import './index.less';
import { BranchsService } from 'services/branchs';
// import { useNavigate } from 'react-router';
// const { Option } = Select;
const Page = ({ canEdit = true, showText = true }) => {
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  // const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState('');
  const removeImg = () => {
    setImageUrl('');
  };
  const [data, setData] = useState({});
  const [address, setAddress] = useState({
    province: [],
    provinceCode: '',
    district: [],
    districtCode: '',
    ward: [],
  });
  const [selected, setSelected] = useState(true);
  const handleCancel = () => {
    setImageUrl('');
    form.resetFields();
    setShowModal(false);
    setData();
  };
  const deleteBranch = async (uuid) => {
    await BranchsService.delete(uuid);
    await handleChange();
    // navigate(0);
    return true;
  };
  const activeBranch = async (uuid) => {
    await BranchsService.activeBranch(uuid);
    setSelected(false);
    // await handleChange();
    return true;
  };
  const unClockBranch = async (uuid) => {
    await BranchsService.unClockBranch(uuid);
    setSelected(true);
    // await handleChange();
    return true;
  };

  const handleOpenModal = async (data) => {
    if (!data) {
      return;
    }
    const res = await BranchsService.getById({ uuid: data.uuid });
    setData({
      ...res,
      provinceId: res?.branchAddress?.mtProvince?.id,
      districtId: res?.branchAddress?.mtDistrict?.id,
      wardId: res?.branchAddress?.mtWard?.id,
      street: res?.branchAddress?.street,
    });
    setAddress((prev) => ({
      ...prev,
      provinceCode: res?.branchAddress?.mtProvince?.code,
      districtCode: res?.branchAddress?.mtDistrict?.code,
    }));
    form.setFieldsValue({
      ...res,
      provinceId: res?.branchAddress?.mtProvince?.id,
      districtId: res?.branchAddress?.mtDistrict?.id,
      wardId: res?.branchAddress?.mtWard?.id,
      street: res?.branchAddress?.street,
    });
    setImageUrl(res?.imageUrl);
  };

  const [handleChange, DataTable] = HookDataTable({
    columns: columnBranch({ handleOpenModal, setShowModal, deleteBranch, activeBranch, unClockBranch }),
    fullTextSearch: 'search',
    Get: async (params) => {
      return await BranchsService.get({ ...params, isActive: selected });
    },
    loadFirst: false,
    rightHeader: (
      <div className="flex gap-3 flex-col sm:flex-row">
        <Select
          showSearch
          className="w-full sm:w-[184px]"
          placeholder="Chọn trạng thái"
          optionFilterProp="children"
          onChange={(value) => setSelected(value)}
          value={selected}
          // onSearch={onSearch}
          defaultValue={'Đang hoạt động'}
          filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
          options={[
            {
              value: true,
              label: 'Đang hoạt động',
            },
            {
              value: false,
              label: 'Không hoạt động',
            },
            {
              value: null,
              label: 'Tất cả',
            },
          ]}
        />
        <button
          className="active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-red-500 text-white rounded-lg border border-red-500  items-center !text-base !font-medium px-4 py-2"
          type="button"
          onClick={() => setShowModal(true)}
        >
          <i className="las la-plus mr-1" />
          Thêm mới
        </button>
      </div>
    ),
  });

  useEffect(() => {
    handleChange();
  }, [selected]);

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

  // useEffect(() => {
  //   const getDetail = async () => {
  //     if (idRequest !== '') {
  //       const res = await BranchsService.getById({ uuid: idRequest })
  //       console.log(res);
  //       setData({ ...res, provinceId: res?.branchAddress?.mtProvince?.id, districtId: res?.branchAddress?.mtDistrict?.id, wardId: res?.branchAddress?.mtWard?.id, street: res?.branchAddress?.street })
  //       setAddress((prev) => ({ ...prev, provinceCode: res?.branchAddress?.mtProvince?.code, districtCode: res?.branchAddress?.mtDistrict?.code }))
  //       form.setFieldsValue({ ...res, provinceId: res?.branchAddress?.mtProvince?.id, districtId: res?.branchAddress?.mtDistrict?.id, wardId: res?.branchAddress?.mtWard?.id, street: res?.branchAddress?.street });
  //       setImageUrl(res?.imageUrl)
  //     }
  //   }
  //   getDetail()
  // }, [idRequest])

  const isStringEmpty = (value) => value === '';

  const handleSubmit = async () => {
    if (isStringEmpty(imageUrl)) return Message.error({ text: 'Hình ảnh không được để trống.' });
    if (data?.uuid) {
      const formData = form.getFieldValue();
      const values = {
        uuid: data?.uuid,
        branchName: formData.branchName,
        facilityCode: formData.facilityCode,
        phone: formData.phone,
        email: formData.email,
        imageUrl,
        branchAddress: {
          street: formData.street,
          mtProvince: {
            id: formData.provinceId,
          },
          mtDistrict: {
            id: formData.districtId,
          },
          mtWard: {
            id: formData.wardId,
          },
        },
      };

      const res = await BranchsService.put(values);
      if (res) {
        setImageUrl('');
        form.resetFields();
        setShowModal(false);
        handleChange();
        if (res.message)
          await Message.success({
            text: 'Chỉnh sửa chi nhánh thành công.',
            title: 'Thành Công',
            cancelButtonText: 'Đóng',
          });
        // navigate(0);
      }
    } else {
      const formData = form.getFieldValue();
      const values = {
        branchName: formData.branchName,
        facilityCode: formData.facilityCode,
        phone: formData.phone,
        email: formData.email,
        imageUrl,
        branchAddress: {
          street: formData.street,
          mtProvince: {
            id: formData.provinceId,
          },
          mtDistrict: {
            id: formData.districtId,
          },
          mtWard: {
            id: formData.wardId,
          },
        },
      };

      const res = await BranchsService.post(values);
      if (res) {
        setImageUrl('');
        form.resetFields();
        setShowModal(false);
        handleChange();
        if (data.message)
          await Message.success({ text: 'Tạo chi nhánh thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
        // navigate(0);
      }
    }
  };
  return (
    <div className="min-h-screen branchs">
      <div className="bg-white p-4">
        <h2 className="font-semibold text-lg mb-5">{'Danh sách chi nhánh'.toUpperCase()}</h2>
        <div>{DataTable()}</div>
        <div>
          <div>
            {showModal && (
              <Modal
                destroyOnClose={true}
                title={
                  <div className="flex justify-between">
                    {data?.uuid ? (
                      <div className="text-base font-bold">Chỉnh sửa chi nhánh</div>
                    ) : (
                      <div className="text-base font-bold">Thêm chi nhánh</div>
                    )}
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
                className="min-w-min pb-0"
                closable={false}
                width={900}
              >
                <Form form={form} colon={false} className="min-w-min" onFinish={handleSubmit}>
                  <div className="">
                    <div className="  bg-white ">
                      <div className="p-2">
                        <div className="flex gap-4">
                          <div className="flex flex-wrap gap-2 w-full">
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
                                              <span className="">Tải ảnh lên từ thiết bị</span>
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
                                          'bg-cover bg-center rounded-[10px] relative',
                                          '!rounded-2xl h-52 w-full aspect-square object-cover',
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
                                            className="w-full h-52 block rounded-[10px] z-10"
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
                            <div className="w-full flex justify-between gap-4">
                              <Form.Item
                                className="w-6/12"
                                label="Tên chi nhánh"
                                name="branchName"
                                rules={[
                                  {
                                    required: true,
                                    message: 'Vui lòng nhập chi nhánh!',
                                  },
                                ]}
                              >
                                <Input
                                  className="h-10 w-full text-sm font-normal block  rounded-lg border border-gray-200  py-[7px] px-4 "
                                  placeholder="Nhập tên chi nhánh"
                                />
                              </Form.Item>
                              <Form.Item
                                className="w-6/12"
                                name="facilityCode"
                                label="Mã cơ sở khám bệnh"
                                // rules={[
                                //   {
                                //     required: true,
                                //     message: 'Vui lòng nhập mã cơ sở khám bệnh',
                                //   },
                                // ]}
                              >
                                <Input
                                  className="h-10 w-full text-sm font-normal block  rounded-lg border border-gray-200  py-[7px] px-4 "
                                  placeholder="Nhập mã cơ sở"
                                />
                              </Form.Item>
                            </div>
                            <div className="w-full flex justify-between gap-4">
                              <Form.Item
                                className="w-6/12"
                                name="phone"
                                label="Số điện thoại"
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
                                <Input
                                  className="h-10 w-full text-sm font-normal block  rounded-lg border border-gray-200  py-[7px] px-4 "
                                  placeholder="Nhập số điện thoại"
                                />
                              </Form.Item>
                              <Form.Item
                                className="w-6/12"
                                name="email"
                                label="Email"
                                rules={[
                                  {
                                    type: 'email',
                                    message: 'Email không đúng định dạng.',
                                  },
                                ]}
                              >
                                <Input
                                  className="h-10 w-full text-sm font-normal block  rounded-lg border border-gray-200  py-[7px] px-4 "
                                  placeholder="Nhập email"
                                />
                              </Form.Item>
                            </div>
                            <div className=" px-2 pb-2 w-full">
                              <div className=" text-sm font-medium text-gray-500 ">Địa chỉ</div>
                              <div className="flex justify-between gap-4">
                                <Form.Item
                                  className="w-1/4"
                                  label="Số nhà, đường"
                                  name="street"
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Vui lòng nhập số nhà, đường!',
                                    },
                                  ]}
                                >
                                  <Input
                                    className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                                    placeholder="Nhập số nhà, đường"
                                  />
                                </Form.Item>
                                <Form.Item
                                  className="w-1/4"
                                  name="provinceId"
                                  label="Tỉnh/TP"
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Vui lòng chọn tỉnh hoặc thành phố!',
                                    },
                                  ]}
                                >
                                  <Select
                                    allowClear
                                    showSearch
                                    className="w-full"
                                    placeholder="Chọn Tỉnh/TP"
                                    optionFilterProp="children"
                                    onChange={(value) => {
                                      const p = address?.province?.find((ele) => ele.id === value);
                                      setAddress((prev) => ({ ...prev, provinceCode: p?.code }));
                                      form.setFieldsValue({ districtId: undefined, wardId: undefined });
                                    }}
                                    filterOption={(input, option) =>
                                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={address.province.map((i) => ({ value: i.id, label: i.name }))}
                                  />
                                </Form.Item>
                                <Form.Item
                                  className="w-1/4"
                                  name="districtId"
                                  label="Quận/ Huyện"
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Vui lòng nhập quận huyện!',
                                    },
                                  ]}
                                >
                                  <Select
                                    allowClear
                                    showSearch
                                    className="w-full"
                                    placeholder="Chọn Quận/ Huyện"
                                    optionFilterProp="children"
                                    onChange={(value) => {
                                      const d = address?.district.find((ele) => ele.id === value);
                                      setAddress((prev) => ({ ...prev, districtCode: d?.code }));
                                      form.setFieldsValue({ wardId: undefined });
                                    }}
                                    // onSearch={onSearch}
                                    filterOption={(input, option) =>
                                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={address.district.map((i) => ({ value: i.id, label: i.name }))}
                                  />
                                </Form.Item>
                                <Form.Item
                                  className="w-1/4"
                                  name="wardId"
                                  label="Phường/Xã"
                                  rules={[
                                    {
                                      required: true,
                                      message: 'Vui lòng nhập phường xã!',
                                    },
                                  ]}
                                >
                                  {/* <Select className="!w-full !rounded-lg  text-sm font-normal" placeholder="Chọn Phường/Xã">
                          <Option value="MALE">Nam</Option>
                          <Option value="FEMALE">Nữ</Option>
                        </Select> */}
                                  <Select
                                    allowClear
                                    showSearch
                                    className="w-full"
                                    placeholder="Chọn Phường/Xã"
                                    optionFilterProp="children"
                                    // onChange={(v) => setAddress((prev) => ({ ...prev, districtCode: v }))}
                                    // onSearch={onSearch}
                                    filterOption={(input, option) =>
                                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={address.ward.map((i) => ({ value: i.id, label: i.name }))}
                                  />
                                </Form.Item>
                              </div>
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
                          <button
                            className="text-white bg-red-500 active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300 rounded-lg px-16 py-2 text-base font-medium  hover:bg-red-600 hover:border-transparent outline-none focus:outline-none "
                            type="submit"
                            // disabled={disable}
                            // onClick={() => {
                            //   handleOk();
                            // }}
                          >
                            Lưu
                          </button>
                        </div>
                      </Form.Item>
                    </div>
                  </div>
                </Form>
              </Modal>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
