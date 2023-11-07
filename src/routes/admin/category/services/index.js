import React, { useState, useEffect } from 'react';
import { HookDataTable } from 'hooks';
import './index.less';
import classNames from 'classnames';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import { AddNew } from './addNew/addNew';
import { ColumnServices } from './columns/columnServices';
import { MasterDataService } from 'services/master-data-service';
import { Form, Input, Modal, Select, Popconfirm, Tooltip } from 'antd';
import EditIcon from 'assets/svg/edit.js';
import RemoveIcon from 'assets/svg/remove.js';
import { Message } from 'components';
import { TableDataAddNewGroupService } from './groupService/tableDataAddNewGroupService';
import ImportData from './components/ImportData';

const Page = () => {
  const [form] = Form.useForm();
  const getData = async (params) => {
    if (!selectedServices) return { data: [], count: 0 };
    const data = await MasterDataService.getServiceByCategory({ ...params, categoryUuid: selectedServices });
    return { data: data.content, count: data.totalElements };
  };
  // const [formValues, setFormValues] = useState({});

  const [servicesTitle, setServicesTitle] = useState([]);
  const getAllServiceCategory = async (param) => {
    const data = await MasterDataService.getAllServiceCategory({ ...param, type: 'SERVICE' });
    setServicesTitle(data);
    return data;
  };

  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');
  const navigate = useNavigate();
  const [toggleAddNew, setToggleAddNew] = useState(type === 'addNew');
  const handleToggleAddNew = async (params) => {
    setShowModal(true);
    if (params?.uuid) {
      form.setFieldsValue({ ...params });
      const res = await MasterDataService.getDetailGroupService(params.uuid);
      setDataAdviseType(
        res?.categoryPercentDtoList?.filter((e) => e?.type === 'ADVISE')?.map((e, idx) => ({ ...e, idx })),
      );
      setDataTreatmentType(
        res?.categoryPercentDtoList?.filter((e) => e?.type === 'TREATMENT')?.map((e, idx) => ({ ...e, idx })),
      );
    }
    getAllServiceCategory();
  };
  const handleCancel = () => {
    form.resetFields();
    setDataAdviseType([]);
    setDataTreatmentType([]);
    setShowModal(false);
  };
  const handSubmitForm = async () => {
    const validateDataAdvise = JSON.parse(JSON.stringify(dataAdviseType)).sort(
      (a, b) => (a?.userId ?? '') - (b?.userId ?? ''),
    );
    const validateDataTreatment = JSON.parse(JSON.stringify(dataTreatmentType)).sort(
      (a, b) => (a?.userId ?? '') - (b?.userId ?? ''),
    );
    if (validateDataAdvise.length && (!validateDataAdvise[0].userId || validateDataAdvise[0].userId === '')) {
      Message.error({ text: 'Vui lòng chọn người dùng ở % Tư vấn' });
      return;
    }
    if (validateDataTreatment.length && (!validateDataTreatment[0].userId || validateDataTreatment[0].userId === '')) {
      Message.error({ text: 'Vui lòng chọn người dùng ở % Điều trị' });
      return;
    }
    const dataAdvise = dataAdviseType?.map((e) => ({ ...e, type: 'ADVISE' }));
    const dataTreatment = dataTreatmentType?.map((e) => ({ ...e, type: 'TREATMENT' }));
    const res = form.getFieldValue();
    const value = { ...res, type: 'SERVICE', categoryPercentDtoList: [...dataAdvise, ...dataTreatment] };
    const data = await MasterDataService.postAllServiceCategory(value);
    if (data.message) {
      if (value.uuid) {
        Message.success({
          text: 'Chỉnh sửa thông tin dịch vụ thành công',
          title: 'Thành Công',
          cancelButtonText: 'Đóng',
        });
      }
      if (!value.uuid) {
        Message.success({ text: 'Thêm nhóm dịch vụ thành công', title: 'Thành Công', cancelButtonText: 'Đóng' });
      }
    }
    form.resetFields();
    setShowModal(false);
    getAllServiceCategory();
    return data;
  };

  const handleToggleAddNewService = (uuid) => {
    setToggleAddNew(!toggleAddNew);
    const dataNav = {
      type: 'addNew',
      uuidGroup: selectedServices,
      uuid,
    };
    if (!uuid) delete dataNav.uuid;
    if (!selectedServices) delete dataNav.uuidGroup;
    navigate({
      search: createSearchParams(dataNav).toString(),
    });
  };
  const returnButton = (uuidGroup) => {
    setToggleAddNew(false);
    const dataNavi = {
      search: createSearchParams({}).toString(),
      uuidGroup,
    };
    if (!uuidGroup) delete dataNavi.uuidGroup;
    navigate(dataNavi);
    getAllServiceCategory();
    handleChange();
  };
  const { Option } = Select;
  const [showModal, setShowModal] = useState(false);
  const [selectedServices, setSelectedServices] = useState(searchParams.get('uuidGroup'));
  useEffect(() => {
    handleChange();
  }, [selectedServices]);

  const deleteService = async (uuid) => {
    const res = await MasterDataService.deleteService(uuid);
    if (res) {
      Message.success({ text: 'Xóa dịch vụ thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
      handleChange();
    }
  };
  const activeService = async (data) => {
    const res = await MasterDataService.activeService(data?.uuid);
    if (res) {
      if (data?.active) {
        Message.success({ text: 'Khóa dịch vụ thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
      }
      if (!data?.active) {
        Message.success({ text: 'Mở khóa dịch vụ thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
      }
      handleChange();
    }
  };

  const [handleChange, DataTable] = HookDataTable({
    Get: getData,
    columns: ColumnServices({ handleToggleAddNewService, deleteService, activeService }),
    loadFirst: false,
    className: 'table-service',
    newRowHeader: (
      <div className="flex gap-3 flex-col sm:flex-row my-4 justify-between">
        <button
          className="active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-red-500 text-white rounded-lg border border-red-500  items-center !text-base !font-medium px-4 py-2"
          type="button"
          onClick={() => {
            !selectedServices
              ? Message.error({ text: 'Vui lòng chọn nhóm dịch vụ để thêm mới.' })
              : handleToggleAddNewService();
          }}
        >
          <i className="las la-plus mr-1" />
          Thêm mới
        </button>
        <ImportData
          handleChange={async () => {
            return await handleChange();
          }}
        />
      </div>
    ),
    rightHeader: (
      <div className="flex">
        <Select className="!w-48 !rounded-lg" placeholder="Trạng thái" allowClear>
          <Option value="true">Đang sử dụng</Option>
          <Option value="false">Ngưng sử dụng</Option>
        </Select>
      </div>
    ),
    bottomHeader: (
      <div className="flex gap-3">
        <button
          className="active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-red-500 text-white rounded-lg border border-red-500  items-center !text-base !font-medium px-4 py-2"
          type="button"
        >
          <i className="las la-plus mr-1" />
          Thêm mới
        </button>
        <button
          className="active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-white text-red-500 rounded-lg border border-red-500  items-center !text-base !font-medium px-4 py-2"
          type="button"
        >
          <span className="icon-download  pr-2 pl-1" />
          Export
        </button>
        <button
          className="active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-white text-red-500 rounded-lg border border-red-500  items-center !text-base !font-medium px-4 py-2"
          type="button"
        >
          <span className="icon-download pr-2 pl-1" />
          Import
        </button>
      </div>
    ),
  });

  const [dataAdviseType, setDataAdviseType] = useState([]);
  const [dataTreatmentType, setDataTreatmentType] = useState([]);

  useEffect(() => {
    handleChange();
    getAllServiceCategory();
  }, [selectedServices]);
  return (
    <div className="bg-white rounded-lg py-3 overflow-scroll services__wrap">
      <div className="flex justify-between border-b border-blue-50 pb-4 ">
        <div className="ml-3 font-semibold text-lg text-gray-900 ">{'Thông tin dịch vụ'.toUpperCase()}</div>
      </div>
      {toggleAddNew === false ? (
        <div className="flex p-3 gap-4 z-50">
          <div className="w-1/3 border border-gray-200">
            <div className="border flex justify-between items-center h-14 bg-gray-200">
              <div className="text-sm 2xl:text-lg font-bold text-gray-600 p-2">Nhóm dịch vụ</div>
              <div className="pr-2">
                <button
                  className="pr-2 w-10 h-9 flex xl:w-24 xl:h-10 active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-red-500 text-white rounded-lg border border-red-500  items-center !text-base !font-medium px-3 xl:px-4 py-2"
                  type="button"
                  onClick={handleToggleAddNew}
                >
                  <i className="las la-plus xl:mr-1" />
                  <span className="hidden xl:block">Thêm</span>
                </button>
              </div>
            </div>
            <div className="relative ">
              <input
                type="text"
                id="simple-search"
                className="border border-gray-300 text-gray-900 text-sm  block w-full p-2.5  "
                placeholder="Tìm kiếm"
                required
              ></input>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
            </div>

            {servicesTitle.map((ele, index) => (
              <div
                key={ele.uuid}
                className={classNames('border cursor-pointer flex justify-between items-center h-[42px]', {
                  'text-red-500 bg-gray-200': selectedServices === ele.uuid,
                })}
                onClick={() => setSelectedServices(ele.uuid)}
              >
                <Tooltip title={ele.name}>
                  <div className="truncate">
                    <button className="p-2 w-full truncate">{ele.name}</button>{' '}
                  </div>
                </Tooltip>
                <div className="2xl:pr-2 flex">
                  <Tooltip title={'Sửa'}>
                    <button
                      onClick={(event) => {
                        handleToggleAddNew(ele);
                        event.stopPropagation();
                      }}
                      className="embed border border-gray-300 text-xs rounded-lg mr-2"
                    >
                      <EditIcon />
                    </button>
                  </Tooltip>
                  <Tooltip title={'Xóa'}>
                    <Popconfirm
                      placement="left"
                      title={'Bạn có chắc muốn xóa ?'}
                      icon={<i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />}
                      okText={'Đồng ý'}
                      cancelText={'Huỷ bỏ'}
                    >
                      <button className="embed border border-gray-300 text-xs rounded-lg mr-2">
                        <RemoveIcon />
                      </button>
                    </Popconfirm>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
          <div className="xl:w-[calc(100%-25%)] w-[29rem] border">
            <div className="p-2">{DataTable()}</div>
          </div>
        </div>
      ) : (
        <AddNew
          returnButton={returnButton}
          setSelectedServices={setSelectedServices}
          servicesList={servicesTitle}
          setShowModal={setShowModal}
        />
      )}
      {showModal && (
        <Modal
          // bodyStyle={{ height: 175 }}
          destroyOnClose={true}
          title={
            <div className="flex justify-between">
              <div className="text-base font-bold">Thêm nhóm dịch vụ</div>
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
        >
          <Form
            form={form}
            // onValuesChange={(_, values) => setFormValues((prevState) => ({ ...prevState, ...values }))}
            colon={false}
            className=" min-w-min"
          >
            <div>
              <div className="px-4">
                <div>
                  <div className="w-full flex justify-between gap-4 pb-1">
                    <Form.Item
                      className="w-full"
                      label="Nhóm dịch vụ"
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng nhập tên nhóm dịch vụ!',
                        },
                      ]}
                    >
                      <Input
                        placeholder="Tên nhóm dịch vụ"
                        className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                      />
                    </Form.Item>
                    <Form.Item hidden={true} className="w-full" label="Nhóm dịch vụ" name="uuid"></Form.Item>
                  </div>
                </div>
                <TableDataAddNewGroupService
                  dataAdviseType={dataAdviseType}
                  setDataAdviseType={setDataAdviseType}
                  setDataTreatmentType={setDataTreatmentType}
                  dataTreatmentType={dataTreatmentType}
                />
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
                    onClick={async () => {
                      try {
                        await form.validateFields();
                        handSubmitForm();
                      } catch (error) {
                        console.log(error);
                      }
                    }}
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
  );
};

export default Page;
