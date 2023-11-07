import { Button, Form, Modal, Select } from 'antd';
import classNames from 'classnames';
import { Spin, Upload } from 'components';
import CameraPhoto from 'components/camera-photo';
import React, { useEffect, useState } from 'react';
import { CameraService } from 'services/camera';
import { CustomerService } from 'services/customer';
import { UtilService } from 'services/util';
import { useLocation } from 'react-router';

const AddCamPerson = ({ handleChange, setShowModal, showModal, canEdit = true, showText = true, setData }) => {
  const branchUuid = localStorage.getItem('branchUuid');
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState({});
  const [imageUrl, setImageUrl] = useState('');
  const removeImg = () => {
    setImageUrl('');
  };
  const [customerItem, setCustomerItem] = useState();
  const [openModalCamera, setOpenModalCamera] = useState(false);
  const [faceId] = useState(false);
  const [listCustomer, setListCustomer] = useState([]);
  const location = useLocation();
  useEffect(() => {
    if (!branchUuid) return;
    const getListCustomer = async () => {
      const res = await CustomerService.getList({ page: 1, perPage: 10000, branchUuid });
      setListCustomer(res?.content?.filter((i) => !i?.faceId) ?? []);
    };
    getListCustomer();
  }, [location.pathname, branchUuid]);

  const handleSubmit = async () => {
    const value = await form.validateFields();
    const param = {
      uuid: value.customerUuid ?? formValues?.customerUuid,
      fullName: customerItem?.fullName ?? '',
      jobTitle: customerItem?.jobTitle ?? '',
      faceIdImage: imageUrl,
    };

    const res = await CameraService.addCamPerson(param);
    if (res) {
      handleCancel();
    }
  };
  const handleCancel = () => {
    form.resetFields();
    setShowModal(false);
    // setDataEdit();
  };

  const handleOpenModal = async (isOpen, data) => {
    setImageUrl('');
    setShowModal(isOpen);
    if (!data) {
      return null;
    }
    setImageUrl(data?.detected_image_url);
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
        {showModal && (
          <>
            <Modal
              centered={true}
              destroyOnClose={true}
              title={
                <div className="flex justify-between">
                  <div className="text-lg font-bold">Cập nhật FaceId</div>
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
              width={768}
            >
              <Form
                onFinish={() => {
                  handleSubmit();
                }}
                form={form}
                onValuesChange={(_, values) => setFormValues((prevState) => ({ ...prevState, ...values }))}
                colon={false}
                className=" min-w-min"
              >
                <div className="   ">
                  <div className="  bg-white ">
                    <div className="p-2">
                      <div className="flex gap-4">
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
                        <div className="flex flex-wrap gap-2 w-full">
                          <div className="w-full flex justify-between">
                            <Form.Item
                              className="w-full"
                              name="customerUuid"
                              label="Danh sách khách hàng"
                              rules={[
                                {
                                  required: true,
                                  message: 'Vui lòng chọn tên khách hàng!',
                                },
                              ]}
                            >
                              <Select
                                className="!w-full !rounded-lg  text-sm font-normal"
                                placeholder="Chọn tên khách hàng"
                                onChange={(e, options) => {
                                  setCustomerItem(options?.item ?? {});
                                }}
                                options={listCustomer?.map((i) => ({ value: i.uuid, label: i.fullName, item: i }))}
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                              ></Select>
                            </Form.Item>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-10">
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
                            // onClick={() => {
                            //   handleSubmit();
                            // }}
                          >
                            Lưu
                          </button>
                        </div>
                      </Form.Item>
                    </div>
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

export default AddCamPerson;
