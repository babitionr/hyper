import React, { useState, useEffect } from 'react';
import { HookDataTable } from 'hooks';
import { columnToothDiagnosis } from './columns/columnToothDiagnosis';
import { Form, Input, Modal, TreeSelect } from 'antd';
// import './index.less';
import { ToothDiagnosis } from 'services/tooth-diagnosis/toothDiagnosis';
import { MasterDataService } from 'services/master-data-service';
import { Message } from 'components';
const Page = ({ canEdit = true, showText = true }) => {
  const { SHOW_CHILD } = TreeSelect;
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState({});
  const handleCancel = () => {
    form.resetFields();
    setShowModal(false);
    setData();
    setServiceDtoFieldValue([]);
  };
  // const deleteService = async (uuid) => {
  //   await SupplierService.delete(uuid);
  //   await handleChange();
  //   return true;
  // };
  // const activeService = async (uuid) => {
  //   await SupplierService.activeSupplier(uuid);
  //   await handleChange();
  //   return true;
  // };

  const handleOpenModal = async (data) => {
    if (!data) {
      return;
    }
    const Formdata = {
      name: data?.name,
      uuid: data?.uuid,
    };
    setData(Formdata);
    setServiceDtoFieldValue(data?.serviceDtoList?.map((e) => e.uuid));
    form.setFieldsValue({ name: data?.name });
  };

  const [handleChange, DataTable] = HookDataTable({
    columns: columnToothDiagnosis({
      handleOpenModal,
      setShowModal,
      //  deleteSupplier, activeSupplier
    }),
    showPagination: false,
    fullTextSearch: 'search',
    Get: async (params) => {
      const resData = await ToothDiagnosis.getToothDiagnosisList();
      return { data: resData, count: resData.length };
    },
    loadFirst: false,
    rightHeader: (
      <div className="flex gap-3 flex-col sm:flex-row">
        {/* <Select
          showSearch
          className="w-full sm:w-[184px]"
          placeholder="Chọn trạng thái"
          optionFilterProp="children"
          onChange={(value) => {setSelected(value); handleChange()}}
          // onSearch={onSearch}
          defaultValue={true}
          filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
          options={[
            {
              value: null,
              label: 'Tất cả',
            },
            {
              value: true,
              label: 'Đang hoạt động',
            },
            {
              value: false,
              label: 'Không hoạt động',
            },
          ]}
        /> */}
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

  const handleSubmit = async () => {
    const Formdata = form.getFieldValue();
    if (data?.uuid) {
      const values = {
        ...Formdata,
        serviceDtoList: serviceDtoFieldValue.map((e) => ({ uuid: e })),
        uuid: data?.uuid,
      };
      const res = await ToothDiagnosis.post(values);
      if (res) {
        Message.success({ text: 'Chỉnh sửa chuẩn đoán thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
        handleCancel();
        handleChange();
      }
    } else {
      const values = {
        ...Formdata,
        serviceDtoList: serviceDtoFieldValue.map((e) => ({ uuid: e })),
      };
      const res = await ToothDiagnosis.post(values);
      if (res) {
        Message.success({ text: 'Thêm chuẩn đoán thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
        handleCancel();
        handleChange();
      }
    }
  };

  const [serviceDtoList, setServiceDtoList] = useState([]);

  const init = async () => {
    const resCatagoryService = await MasterDataService.getAllServiceCategory({ type: 'SERVICE' });
    const serviceDtoList = await Promise.all(
      resCatagoryService.map(async (e) => {
        return {
          title: e.name,
          value: e.uuid,
          key: e.uuid,
          serviceDtoList: await MasterDataService.getAllService({ categoryUuid: e.uuid }),
        };
      }),
    );
    setServiceDtoList(
      serviceDtoList.map((e) => {
        if (e?.serviceDtoList?.length === 0) return { ...e, disableCheckbox: true, selectable: false };
        return { ...e, children: e?.serviceDtoList?.map((e) => ({ title: e.name, value: e.uuid, key: e.uuid })) };
      }),
    );
  };
  useEffect(() => {
    if (showModal) {
      init();
    }
  }, [showModal]);

  useEffect(() => {
    handleChange();
  }, []);

  const [serviceDtoFieldValue, setServiceDtoFieldValue] = useState([]);
  const onChangeService = (newValue) => {
    setServiceDtoFieldValue(newValue);
  };
  return (
    <div className="min-h-screen supplier">
      <div className="bg-white p-4">
        <h2 className="font-semibold text-lg mb-5">{'Danh sách chuẩn đoán'.toUpperCase()}</h2>
        <div>{DataTable()}</div>
        <div>
          <div>
            {showModal && (
              <Modal
                // bodyStyle={{ height: 175 }}
                destroyOnClose={true}
                title={
                  <div className="flex justify-between">
                    {data?.uuid ? (
                      <div className="text-base font-bold">Chỉnh sửa chuẩn đoán răng</div>
                    ) : (
                      <div className="text-base font-bold">Thêm chuẩn đoán răng</div>
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
                            <div className="w-full flex justify-between gap-4">
                              <Form.Item
                                className="w-full"
                                label="Tên chuẩn đoán răng"
                                name="name"
                                rules={[
                                  {
                                    required: true,
                                    message: 'Vui lòng nhập tên chuẩn đoán răng!',
                                  },
                                ]}
                              >
                                <Input
                                  className="h-10 w-full text-sm font-normal block  rounded-lg border border-gray-200  py-[7px] px-4 "
                                  placeholder="Nhập tên chuẩn đoán răng"
                                />
                              </Form.Item>
                            </div>
                            <div className="w-full flex justify-between gap-4">
                              <Form.Item className="w-full" label="Dịch vụ">
                                <TreeSelect
                                  // treeDataSimpleMode
                                  multiple
                                  treeLine={
                                    true && {
                                      showLeafIcon: false,
                                    }
                                  }
                                  treeDefaultExpandedKeys={serviceDtoFieldValue}
                                  showCheckedStrategy={SHOW_CHILD}
                                  treeCheckable
                                  style={{
                                    width: '100%',
                                  }}
                                  value={serviceDtoFieldValue}
                                  dropdownStyle={{
                                    maxHeight: 400,
                                    overflow: 'auto',
                                  }}
                                  showSearch
                                  filterTreeNode={(search, item) => {
                                    const itemValue = item.title.trim().toLowerCase();
                                    const searchValue = search.trim().toLowerCase();
                                    // xóa dấu và thay ký tự đĐ
                                    const itemValueNormalize = itemValue
                                      .normalize('NFD')
                                      .replace(/[\u0300-\u036f]/g, '')
                                      .replace(/[đĐ]/g, 'd');
                                    const searchValueNormalize = searchValue
                                      .normalize('NFD')
                                      .replace(/[\u0300-\u036f]/g, '')
                                      .replace(/[đĐ]/g, 'd');
                                    return itemValueNormalize.indexOf(searchValueNormalize) >= 0;
                                  }}
                                  onChange={onChangeService}
                                  // loadData={onLoadData}
                                  treeData={serviceDtoList}
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
