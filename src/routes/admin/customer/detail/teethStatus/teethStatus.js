import React, { useState, useEffect } from 'react';
import { Form, DatePicker, Modal, Input, Select, Tabs } from 'antd';
import { ColumnTeethStatus } from '../columns/columnTeethStatus';
import { HookDataTable } from 'hooks';
import { TeethStatusMini } from './teethStatusMini';
import { MasterDataTeethService } from 'services/master-data-teeth/masterDataTeeth';
import classNames from 'classnames';
import { CustomerTeethStoryService } from 'services/customer-teeth-story/customerTeethStory';
import { useSearchParams } from 'react-router-dom';
import { AddTreatmentSlip } from './addTreatmentSlip/addTreatmentSlip';
import { ToothDiagnosis } from 'services/tooth-diagnosis/toothDiagnosis';
import { MasterDataService } from 'services/master-data-service';
import moment from 'moment/moment';
import { AuthSerivce } from 'services/Auth';
import { Message } from 'components';
import { toast } from 'react-toastify';
import { useAuth } from 'global';

const { Option } = Select;
const { RangePicker } = DatePicker;

export const TeethStatus = (props) => {
  const { user, cusName, checkPermission } = props;
  const { branchUuid } = useAuth();
  const [searchParams] = useSearchParams();
  const idCustomer = searchParams.get('id');
  const [selectTeeth, setSelectTeeth] = useState();
  const [selectTeethList, setSelectTeethList] = useState([]);
  const [serviceCheck, setServiceCheck] = useState();
  const [teethPosition, setTeethPosition] = useState([]);
  const [listUser, setListUser] = useState([]);
  const [filterDate, setFilterDate] = useState({ fromDate: '', toDate: '' });
  const getTeethPosition = async (param) => {
    const data = await MasterDataTeethService.getDisplayTeeth({ ...param });
    setTeethPosition(data);
    return data;
  };
  const getListTeethStory = async (param) => {
    const data = await CustomerTeethStoryService.getListTeethStory({
      ...param,
      customerUuid: idCustomer,
      fromDate: filterDate.fromDate,
      toDate: filterDate.toDate,
    });
    return {
      data: data?.content,
      count: data?.content?.length,
    };
  };
  const [showModelAddTreatmentSlip, setShowModelAddTreatmentSlip] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const handleCancel = () => {
    setSelectTeethList([]);
    form.resetFields();
    setShowModal(false);
  };
  const handleSubmitHistoryForm = async () => {
    const param = form.getFieldsValue();
    const data = await CustomerTeethStoryService.postService({
      ...param,
      createdAt: moment(param.createdDate).format('YYYY-MM-DD HH:mm:ss'),
      teethStoryDiagnosisDtoList: param.teethStoryDiagnosisDtoList?.map((ele) => ({ uuid: ele })) ?? [],
      teethStoryServiceDtoList: param.teethStoryServiceDtoList?.map((ele) => ({ uuid: ele })) ?? [],
      teethStoryItemDtoList: selectTeethList.map((ele) => ({ uuid: ele })),
      customerUuid: user.uuid,
    });
    if (data) {
      if (data.message) {
        if (!param.uuid) {
          Message.success({ text: 'Thêm tiểu sử thành công' });
        }
        if (param.uuid) {
          Message.success({ text: 'Chỉnh sửa tiểu sử thành công' });
        }
      }
    }
    await handleChange();
    setSelectTeethList([]);
    form.resetFields();
    setShowModal(false);
  };
  const [listToothDiagnosis, setListToothDiagnosis] = useState([]);
  const getListToothDiagnosis = async () => {
    const data = await ToothDiagnosis.getToothDiagnosisList();
    setListToothDiagnosis(data);
  };
  const [listService, setListService] = useState([]);
  const getListService = async () => {
    const data = await MasterDataService.getAllService();
    setListService(data);
  };
  const editHistory = async (data) => {
    const detail = await CustomerTeethStoryService.getListTeethStoryDetail(data.uuid);
    const teethStoryServiceDtoList = detail.teethStoryServiceDtoList.map((ele) => ele.uuid);
    const teethStoryDiagnosisDtoList = detail.teethStoryDiagnosisDtoList.map((ele) => ele.uuid);
    setSelectTeethList(detail.teethStoryItemDtoList.map((ele) => ele.uuid));
    console.log(data);
    form.setFieldsValue({
      ...data,
      cusName,
      createdUserId: detail.createdUserId,
      createdDate: moment(data.createdAt),
      note: detail.note,
      teethStoryServiceDtoList,
      teethStoryDiagnosisDtoList,
      uuid: data.uuid,
    });
    setShowModal(true);
  };
  const deleteTeethStatus = async (data) => {
    const res = await CustomerTeethStoryService.deleteTeethStory(data.uuid);
    if (res) {
      toast.success('Xóa tiểu sử thành công', {
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
      });
      handleChange();
    }
  };

  const [customerUuid, setCustomerUuid] = useState();
  let CusUuid = '';
  let serviceCheckedData = [];
  const sendAddDataTreatmentSlip = async (data, e) => {
    if (e.target.checked) {
      CusUuid = data?.uuid;
      console.log(CusUuid);
      const detail = await CustomerTeethStoryService.getListTeethStoryDetail(data.uuid);
      serviceCheckedData.push({
        teethStoryItemDtoList: detail.teethStoryItemDtoList,
        teethStoryServiceDtoList: detail.teethStoryServiceDtoList,
        uuid: detail.uuid,
      });
      console.log(serviceCheckedData);
      // let a = [];
      // serviceCheckedData.forEach(ele => {a.push(...ele.teethStoryServiceDtoList.map(b => ({teethStoryServiceDtoList: b, saleOrderServiceTeethDtoList: ele.teethStoryItemDtoList})))})
      // console.log(a);
      // let listService= []
      // a.forEach((ele) => { listService.push({ ...ele, serviceNamne: ele.teethStoryServiceDtoList?.name }) })
      // console.log(listService);
    }
    if (e.target.checked === false) {
      CusUuid = '';
      const detail = await CustomerTeethStoryService.getListTeethStoryDetail(data.uuid);
      const unCheckedData = serviceCheckedData.filter((e) => e.uuid !== detail.uuid);
      serviceCheckedData = unCheckedData;
      console.log(serviceCheckedData);
    }
  };

  const [handleChange, DataTable] = HookDataTable({
    onRow: (data) => ({
      onDoubleClick: (event) => {},
    }),
    loadFirst: false,
    save: false,
    Get: getListTeethStory,
    showSearch: false,
    columns: ColumnTeethStatus({ editHistory, sendAddDataTreatmentSlip, deleteTeethStatus }),
    expandable: {
      expandedRowRender: (record) => (
        <div className="pl-4">
          <TeethStatusMini record={record} idCustomer={idCustomer}></TeethStatusMini>
        </div>
      ),
    },
    // expandable:{
    //   expandedRowRender: (record) => (
    //     <div className='pl-4'
    //     >
    //       {TeethStatusMini2()}
    //     </div>
    //   ),
    //   rowExpandable: (record) => record.name !== 'Not Expandable',
    // },
  });
  const getListUser = async () => {
    const res = await AuthSerivce.getAllUser({ branchUuid });
    setListUser(res?.data ?? []);
  };
  useEffect(() => {
    getTeethPosition();
    getListToothDiagnosis();
    getListService();
    getListUser();
    // form.setFieldsValue({ cusName: user?.fullName ?? '', createdDate: moment() });
  }, [user]);
  useEffect(() => {
    handleChange();
  }, [user, filterDate]);
  const handleSelectTeeth = (teeth) => {
    selectTeeth === teeth ? setSelectTeeth() : setSelectTeeth(teeth);
  };
  const handleSelectTeethHistoryList = (teeth) => {
    selectTeethList.find((ele) => ele === teeth?.uuid)
      ? setSelectTeethList([...selectTeethList].filter((ele) => ele !== teeth?.uuid))
      : setSelectTeethList([...selectTeethList, teeth?.uuid]);
  };
  const items = [
    {
      label: 'Răng vĩnh viễn',
      key: '1',
      children: (
        <div>
          <div className="flex justify-center gap-3">
            {Array.from({ length: 8 }, (_, i) => i + 11)
              .reverse()
              .map((ele) => {
                const teeth = teethPosition.find((element) => Number(element.teethNumber) === ele);
                return (
                  <div className={classNames({ 'hidden xl:block': [11, 12, 13].includes(ele) })} key={ele}>
                    <div className="h-14 relative flex justify-center align-bottom mb-4">
                      <img className="absolute bottom-0 " src={require(`assets/images/teeth/${ele}.png`)} />
                    </div>
                    <button
                      onClick={() => handleSelectTeeth(teeth?.uuid)}
                      className={classNames(
                        'border rounded text-sm font-normal py-3 px-2.5 w-10 opacity-0 cursor-default',
                        {
                          '!opacity-100 !cursor-pointer': teethPosition.find(
                            (element) => Number(element.teethNumber) === ele,
                          ),
                        },
                        { 'bg-red-500 text-white': selectTeeth === teeth?.uuid },
                      )}
                    >
                      {' '}
                      {ele}
                    </button>
                  </div>
                );
              })}
            {Array.from({ length: 8 }, (_, i) => i + 21).map((ele) => {
              const teeth = teethPosition.find((element) => Number(element.teethNumber) === ele);
              return (
                <div className={classNames({ 'hidden xl:block': [26, 27, 28].includes(ele) })} key={ele}>
                  <div className="h-14 relative flex justify-center align-bottom mb-4">
                    <img className="absolute bottom-0 " src={require(`assets/images/teeth/${ele}.png`)} />
                  </div>
                  <button
                    onClick={() => handleSelectTeeth(teeth?.uuid)}
                    key={ele}
                    className={classNames(
                      'border rounded text-sm font-normal py-3 px-2.5 w-10 opacity-0 cursor-default',
                      {
                        '!opacity-100 !cursor-pointer': teethPosition.find(
                          (element) => Number(element.teethNumber) === ele,
                        ),
                      },
                      { 'bg-red-500 text-white': selectTeeth === teeth?.uuid },
                    )}
                  >
                    {ele}
                  </button>
                </div>
              );
            })}
          </div>
          <div className="flex justify-center gap-3">
            {Array.from({ length: 3 }, (_, i) => i + 11)
              .reverse()
              .map((ele) => {
                const teeth = teethPosition.find((element) => Number(element.teethNumber) === ele);
                return (
                  <div className="block xl:hidden" key={ele}>
                    <div className="h-14 relative flex justify-center align-bottom mb-4">
                      <img className="absolute bottom-0 " src={require(`assets/images/teeth/${ele}.png`)} />
                    </div>
                    <button
                      onClick={() => handleSelectTeeth(teeth?.uuid)}
                      className={classNames(
                        'border rounded text-sm font-normal py-3 px-2.5 w-10 opacity-0 cursor-default',
                        {
                          '!opacity-100 !cursor-pointer': teethPosition.find(
                            (element) => Number(element.teethNumber) === ele,
                          ),
                        },
                        { 'bg-red-500 text-white': selectTeeth === teeth?.uuid },
                      )}
                    >
                      {' '}
                      {ele}
                    </button>
                  </div>
                );
              })}
            {Array.from({ length: 3 }, (_, i) => i + 26).map((ele) => {
              const teeth = teethPosition.find((element) => Number(element.teethNumber) === ele);
              return (
                <div className="block xl:hidden" key={ele}>
                  <div className="h-14 relative flex justify-center align-bottom mb-4">
                    <img className="absolute bottom-0 " src={require(`assets/images/teeth/${ele}.png`)} />
                  </div>
                  <button
                    onClick={() => handleSelectTeeth(teeth?.uuid)}
                    key={ele}
                    className={classNames(
                      'border rounded text-sm font-normal py-3 px-2.5 w-10 opacity-0 cursor-default',
                      {
                        '!opacity-100 !cursor-pointer': teethPosition.find(
                          (element) => Number(element.teethNumber) === ele,
                        ),
                      },
                      { 'bg-red-500 text-white': selectTeeth === teeth?.uuid },
                    )}
                  >
                    {ele}
                  </button>
                </div>
              );
            })}
          </div>
          <div className="flex justify-center gap-3">
            {Array.from({ length: 8 }, (_, i) => i + 41)
              .reverse()
              .map((ele) => {
                const teeth = teethPosition.find((element) => Number(element.teethNumber) === ele);
                return (
                  <div className={classNames({ 'hidden xl:block': [43, 42, 41].includes(ele) })} key={ele}>
                    <button
                      onClick={() => handleSelectTeeth(teeth?.uuid)}
                      className={classNames(
                        'border rounded text-sm font-normal py-3 px-2.5 w-10 opacity-0 cursor-default',
                        {
                          '!opacity-100 !cursor-pointer': teethPosition.find(
                            (element) => Number(element.teethNumber) === ele,
                          ),
                        },
                        { 'bg-red-500 text-white': selectTeeth === teeth?.uuid },
                      )}
                    >
                      {' '}
                      {ele}
                    </button>
                    <div className="h-14 relative flex justify-center align-top mt-4">
                      <img className="absolute top-0 " src={require(`assets/images/teeth/${ele}.png`)} />
                    </div>
                  </div>
                );
              })}
            {Array.from({ length: 8 }, (_, i) => i + 31).map((ele) => {
              const teeth = teethPosition.find((element) => Number(element.teethNumber) === ele);
              return (
                <div className={classNames({ 'hidden xl:block': [36, 37, 38].includes(ele) })} key={ele}>
                  <button
                    onClick={() => handleSelectTeeth(teeth?.uuid)}
                    className={classNames(
                      'border rounded text-sm font-normal py-3 px-2.5 w-10 opacity-0 cursor-default',
                      {
                        '!opacity-100 !cursor-pointer': teethPosition.find(
                          (element) => Number(element.teethNumber) === ele,
                        ),
                      },
                      { 'bg-red-500 text-white': selectTeeth === teeth?.uuid },
                    )}
                  >
                    {' '}
                    {ele}
                  </button>
                  <div className="h-14 relative flex justify-center align-top mt-4">
                    <img className="absolute top-0 " src={require(`assets/images/teeth/${ele}.png`)} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-center gap-3">
            {Array.from({ length: 3 }, (_, i) => i + 41)
              .reverse()
              .map((ele) => {
                const teeth = teethPosition.find((element) => Number(element.teethNumber) === ele);
                return (
                  <div className="block xl:hidden" key={ele}>
                    <button
                      onClick={() => handleSelectTeeth(teeth?.uuid)}
                      className={classNames(
                        'border rounded text-sm font-normal py-3 px-2.5 w-10 opacity-0 cursor-default',
                        {
                          '!opacity-100 !cursor-pointer': teethPosition.find(
                            (element) => Number(element.teethNumber) === ele,
                          ),
                        },
                        { 'bg-red-500 text-white': selectTeeth === teeth?.uuid },
                      )}
                    >
                      {' '}
                      {ele}
                    </button>
                    <div className="h-14 relative flex justify-center align-bottom mb-4">
                      <img className="absolute bottom-0 " src={require(`assets/images/teeth/${ele}.png`)} />
                    </div>
                  </div>
                );
              })}
            {Array.from({ length: 3 }, (_, i) => i + 36).map((ele) => {
              const teeth = teethPosition.find((element) => Number(element.teethNumber) === ele);
              return (
                <div className="block xl:hidden" key={ele}>
                  <button
                    onClick={() => handleSelectTeeth(teeth?.uuid)}
                    key={ele}
                    className={classNames(
                      'border rounded text-sm font-normal py-3 px-2.5 w-10 opacity-0 cursor-default',
                      {
                        '!opacity-100 !cursor-pointer': teethPosition.find(
                          (element) => Number(element.teethNumber) === ele,
                        ),
                      },
                      { 'bg-red-500 text-white': selectTeeth === teeth?.uuid },
                    )}
                  >
                    {ele}
                  </button>
                  <div className="h-14 relative flex justify-center align-bottom mb-4">
                    <img className="absolute bottom-0 " src={require(`assets/images/teeth/${ele}.png`)} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ),
    },
    {
      label: 'Răng sữa',
      children: (
        <div>
          <div className="flex justify-center gap-3">
            <button className="border rounded text-sm font-normal py-3 px-2.5 w-10 opacity-0 cursor-default">
              {' '}
              00{' '}
            </button>
            <button className="border rounded text-sm font-normal py-3 px-2.5 w-10 opacity-0 cursor-default">
              {' '}
              00{' '}
            </button>
            <button className="border rounded text-sm font-normal py-3 px-2.5 w-10 opacity-0 cursor-default">
              {' '}
              00{' '}
            </button>
            {Array.from({ length: 5 }, (_, i) => i + 51)
              .reverse()
              .map((ele) => {
                const teeth = teethPosition.find((element) => Number(element.teethNumber) === ele);
                return (
                  <div key={ele}>
                    <div className="h-14 relative flex justify-center align-bottom mb-4">
                      <img className="absolute bottom-0 " src={require(`assets/images/teeth/${ele}.png`)} />
                    </div>
                    <button
                      onClick={() => handleSelectTeeth(teeth?.uuid)}
                      className={classNames(
                        'border rounded text-sm font-normal py-3 px-2.5 w-10 opacity-0 cursor-default',
                        {
                          '!opacity-100 !cursor-pointer': teethPosition.find(
                            (element) => Number(element.teethNumber) === ele,
                          ),
                        },
                        { 'bg-red-500 text-white': selectTeeth === teeth?.uuid },
                      )}
                    >
                      {' '}
                      {ele}
                    </button>
                  </div>
                );
              })}
            {Array.from({ length: 5 }, (_, i) => i + 61).map((ele) => {
              const teeth = teethPosition.find((element) => Number(element.teethNumber) === ele);
              return (
                <div key={ele}>
                  <div className="h-14 relative flex justify-center align-bottom mb-4">
                    <img className="absolute bottom-0 " src={require(`assets/images/teeth/${ele}.png`)} />
                  </div>
                  <button
                    onClick={() => handleSelectTeeth(teeth?.uuid)}
                    className={classNames(
                      'border rounded text-sm font-normal py-3 px-2.5 w-10 opacity-0 cursor-default',
                      {
                        '!opacity-100 !cursor-pointer': teethPosition.find(
                          (element) => Number(element.teethNumber) === ele,
                        ),
                      },
                      { 'bg-red-500 text-white': selectTeeth === teeth?.uuid },
                    )}
                  >
                    {' '}
                    {ele}
                  </button>
                </div>
              );
            })}
            <button className="border rounded text-sm font-normal py-3 px-2.5 w-10 opacity-0 cursor-default">
              {' '}
              00{' '}
            </button>
            <button className="border rounded text-sm font-normal py-3 px-2.5 w-10 opacity-0 cursor-default">
              {' '}
              00{' '}
            </button>
            <button className="border rounded text-sm font-normal py-3 px-2.5 w-10 opacity-0 cursor-default">
              {' '}
              00{' '}
            </button>
          </div>
          <div className="flex justify-center gap-3">
            <button className="border rounded text-sm font-normal py-3 px-2.5 w-10 opacity-0 cursor-default">
              {' '}
              00{' '}
            </button>
            <button className="border rounded text-sm font-normal py-3 px-2.5 w-10 opacity-0 cursor-default">
              {' '}
              00{' '}
            </button>
            <button className="border rounded text-sm font-normal py-3 px-2.5 w-10 opacity-0 cursor-default">
              {' '}
              00{' '}
            </button>
            {Array.from({ length: 5 }, (_, i) => i + 81)
              .reverse()
              .map((ele) => {
                const teeth = teethPosition.find((element) => Number(element.teethNumber) === ele);
                return (
                  <div key={ele}>
                    <button
                      onClick={() => handleSelectTeeth(teeth?.uuid)}
                      className={classNames(
                        'border rounded text-sm font-normal py-3 px-2.5 w-10 opacity-0 cursor-default',
                        {
                          '!opacity-100 !cursor-pointer': teeth,
                        },
                        { 'bg-red-500 text-white': selectTeeth === teeth?.uuid },
                      )}
                    >
                      {' '}
                      {ele}
                    </button>
                    <div className="h-14 relative flex justify-center align-top mt-4">
                      <img className="absolute top-0 " src={require(`assets/images/teeth/${ele}.png`)} />
                    </div>
                  </div>
                );
              })}
            {Array.from({ length: 5 }, (_, i) => i + 71).map((ele) => {
              const teeth = teethPosition.find((element) => Number(element.teethNumber) === ele);
              return (
                <div key={ele}>
                  <button
                    onClick={() => handleSelectTeeth(teeth?.uuid)}
                    className={classNames(
                      'border rounded text-sm font-normal py-3 px-2.5 w-10 opacity-0 cursor-default',
                      {
                        '!opacity-100 !cursor-pointer': teeth,
                      },
                      { 'bg-red-500 text-white': selectTeeth === teeth?.uuid },
                    )}
                  >
                    {' '}
                    {ele}
                  </button>
                  <div className="h-14 relative flex justify-center align-top mt-4">
                    <img className="absolute top-0 " src={require(`assets/images/teeth/${ele}.png`)} />
                  </div>
                </div>
              );
            })}
            <button className="border rounded text-sm font-normal py-3 px-2.5 w-10 opacity-0 cursor-default">
              {' '}
              00{' '}
            </button>
            <button className="border rounded text-sm font-normal py-3 px-2.5 w-10 opacity-0 cursor-default">
              {' '}
              00{' '}
            </button>
            <button className="border rounded text-sm font-normal py-3 px-2.5 w-10 opacity-0 cursor-default">
              {' '}
              00{' '}
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="text-lg font-bold">{'Danh sách tiểu sử răng'.toUpperCase()}</div>
      <div className="mt-4 mb-6 flex flex-col gap-4">
        <Tabs defaultActiveKey={1}>
          <Tabs items={items}></Tabs>
        </Tabs>
      </div>

      {checkPermission && checkPermission('MANAGE_CUSTOMER_TH') ? (
        <>
          <div className="flex justify-between">
            <div className="">
              <Form.Item name="treatmentDate">
                <RangePicker
                  clearIcon={
                    <div className="mr-[5px]">
                      <svg
                        viewBox="64 64 896 896"
                        focusable="false"
                        data-icon="close-circle"
                        width="1em"
                        height="1em"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"></path>
                      </svg>
                    </div>
                  }
                  placeholder={['DD/MM/YYYY', 'DD/MM/YYYY']}
                  className="items-stretch border rounded-lg !bg-white border-gray-200"
                  format="DD/MM/YYYY"
                  onChange={(dates, dateStrings) => {
                    if (dates) {
                      setFilterDate((prev) => ({
                        ...prev,
                        fromDate: moment(dates[0]).format('YYYY-MM-DD 00:00:00'),
                        toDate: moment(dates[1]).format('YYYY-MM-DD 23:59:59'),
                      }));
                    }
                    if (!dates?.length || dates === null) {
                      setFilterDate((prev) => ({ ...prev, fromDate: '', toDate: '' }));
                    }
                  }}
                />
              </Form.Item>
            </div>
            <div className="flex gap-2 xl:gap-4">
              <button
                className=" h-10 active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-red-500 text-white rounded-lg border border-red-500  items-center !text-base !font-medium px-2 xl:px-4 py-2"
                type="button"
                onClick={() => {
                  if (serviceCheckedData.length === 0)
                    return Message.error({ text: 'Vui lòng chọn tiểu sử để thêm phiếu điều trị.' });
                  setShowModelAddTreatmentSlip(true);
                  setServiceCheck(serviceCheckedData);
                  setCustomerUuid(CusUuid);
                }}
              >
                <i className="las la-plus mr-1" />
                Thêm phiếu điều trị
              </button>
              <button
                className="w-36 xl:w-40 h-10 active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-red-500 text-white rounded-lg border border-red-500  items-center !text-base !font-medium xl:px-4 py-2"
                type="button"
                onClick={() => {
                  setShowModal(true);
                  form.setFieldsValue({ cusName: user?.fullName ?? '', createdDate: moment() });
                }}
              >
                <i className="las la-plus mr-1" />
                Thêm tiểu sử
              </button>
            </div>
          </div>{' '}
          <div>{DataTable()}</div>{' '}
        </>
      ) : null}

      <div>
        {showModal && (
          <Modal
            destroyOnClose={true}
            title={
              <div className="flex justify-between">
                <div className="text-base font-bold">
                  {form.getFieldValue('uuid') ? 'Chỉnh sửa tiểu sử răng' : 'Thêm tiểu sử răng'}
                </div>
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
            <Form form={form} colon={false} className=" min-w-min">
              <div>
                <div className="px-4">
                  <div>
                    <div className="w-full flex justify-between gap-4">
                      <Form.Item className="w-6/12" label="Khách hàng" name="cusName">
                        <Input
                          disabled
                          className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                        />
                      </Form.Item>
                      <Form.Item className="w-6/12" name="createdDate" label="Ngày tạo">
                        <DatePicker
                          use12Hours={false}
                          placeholder="Chọn ngày tạo"
                          className="!w-full border rounded-lg !bg-white  border-gray-200"
                          format="DD/MM/YYYY"
                          disabledDate={(current) => current && current > moment().endOf('day')}
                        />
                      </Form.Item>
                      <Form.Item className="w-6/12 hidden" name="uuid">
                        <Input
                          disabled
                          className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                        />
                      </Form.Item>
                    </div>
                    <div className="w-full flex justify-between gap-4">
                      <Form.Item className="w-6/12" label="Người tạo" name="createdUserId">
                        <Select
                          className="w-full !rounded-lg"
                          filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                          }
                          showSearch
                          placeholder="Chọn người tạo"
                          allowClear
                          options={listUser.map((ele) => ({ value: ele.id, label: ele.firstName }))}
                        ></Select>
                      </Form.Item>
                      <Form.Item className="w-6/12 opacity-0" label="Người tạo">
                        <Input
                          disabled
                          placeholder="Nhập tên người tạo"
                          className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div>
                    <div>Sơ đồ vị trí răng</div>
                    <div className=" mb-6 flex flex-col gap-4 w-full">
                      <Tabs defaultActiveKey={1} className="customer-detail">
                        <Tabs.TabPane tab="Răng vĩnh viễn" key="1" className="flex flex-col gap-4">
                          <div className="flex justify-center gap-3">
                            {Array.from({ length: 8 }, (_, i) => i + 11)
                              .reverse()
                              .map((ele) => {
                                const teeth = teethPosition.find((element) => Number(element.teethNumber) === ele);
                                return (
                                  <div
                                    className={classNames({ 'hidden xl:block': [11, 12, 13].includes(ele) })}
                                    key={ele}
                                  >
                                    <div className="h-14 relative flex justify-center align-bottom mb-4">
                                      <img
                                        className="absolute bottom-0 "
                                        src={require(`assets/images/teeth/${ele}.png`)}
                                      />
                                    </div>
                                    <button
                                      onClick={() => handleSelectTeethHistoryList(teeth)}
                                      className={classNames(
                                        'border rounded text-sm font-normal py-3 px-2.5 w-10 opacity-0 cursor-default',
                                        {
                                          '!opacity-100 !cursor-pointer': teethPosition.find(
                                            (element) => Number(element.teethNumber) === ele,
                                          ),
                                        },
                                        { 'bg-red-500 text-white': selectTeethList.find((ele) => ele === teeth?.uuid) },
                                      )}
                                    >
                                      {' '}
                                      {ele}
                                    </button>
                                  </div>
                                );
                              })}
                            {Array.from({ length: 8 }, (_, i) => i + 21).map((ele) => {
                              const teeth = teethPosition.find((element) => Number(element.teethNumber) === ele);
                              return (
                                <div
                                  className={classNames({ 'hidden xl:block': [26, 27, 28].includes(ele) })}
                                  key={ele}
                                >
                                  <div className="h-14 relative flex justify-center align-bottom mb-4">
                                    <img
                                      className="absolute bottom-0 "
                                      src={require(`assets/images/teeth/${ele}.png`)}
                                    />
                                  </div>
                                  <button
                                    onClick={() => handleSelectTeethHistoryList(teeth)}
                                    className={classNames(
                                      'border rounded text-sm font-normal py-3 px-2.5 w-10 opacity-0 cursor-default',
                                      {
                                        '!opacity-100 !cursor-pointer': teethPosition.find(
                                          (element) => Number(element.teethNumber) === ele,
                                        ),
                                      },
                                      { 'bg-red-500 text-white': selectTeethList.find((ele) => ele === teeth?.uuid) },
                                    )}
                                  >
                                    {' '}
                                    {ele}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex justify-center gap-3">
                            {Array.from({ length: 3 }, (_, i) => i + 11)
                              .reverse()
                              .map((ele) => {
                                const teeth = teethPosition.find((element) => Number(element.teethNumber) === ele);
                                return (
                                  <div className="block xl:hidden" key={ele}>
                                    <div className="h-14 relative flex justify-center align-bottom mb-4">
                                      <img
                                        className="absolute bottom-0 "
                                        src={require(`assets/images/teeth/${ele}.png`)}
                                      />
                                    </div>
                                    <button
                                      onClick={() => handleSelectTeethHistoryList(teeth)}
                                      className={classNames(
                                        'border rounded text-sm font-normal py-3 px-2.5 w-10 opacity-0 cursor-default',
                                        {
                                          '!opacity-100 !cursor-pointer': teethPosition.find(
                                            (element) => Number(element.teethNumber) === ele,
                                          ),
                                        },
                                        { 'bg-red-500 text-white': selectTeeth === teeth?.uuid },
                                      )}
                                    >
                                      {' '}
                                      {ele}
                                    </button>
                                  </div>
                                );
                              })}
                            {Array.from({ length: 3 }, (_, i) => i + 26).map((ele) => {
                              const teeth = teethPosition.find((element) => Number(element.teethNumber) === ele);
                              return (
                                <div className="block xl:hidden" key={ele}>
                                  <div className="h-14 relative flex justify-center align-bottom mb-4">
                                    <img
                                      className="absolute bottom-0 "
                                      src={require(`assets/images/teeth/${ele}.png`)}
                                    />
                                  </div>
                                  <button
                                    onClick={() => handleSelectTeethHistoryList(teeth)}
                                    key={ele}
                                    className={classNames(
                                      'border rounded text-sm font-normal py-3 px-2.5 w-10 opacity-0 cursor-default',
                                      {
                                        '!opacity-100 !cursor-pointer': teethPosition.find(
                                          (element) => Number(element.teethNumber) === ele,
                                        ),
                                      },
                                      { 'bg-red-500 text-white': selectTeeth === teeth?.uuid },
                                    )}
                                  >
                                    {ele}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex justify-center gap-3">
                            {Array.from({ length: 8 }, (_, i) => i + 41)
                              .reverse()
                              .map((ele) => {
                                const teeth = teethPosition.find((element) => Number(element.teethNumber) === ele);
                                return (
                                  <div
                                    className={classNames({ 'hidden xl:block': [41, 42, 43].includes(ele) })}
                                    key={ele}
                                  >
                                    <button
                                      onClick={() => handleSelectTeethHistoryList(teeth)}
                                      className={classNames(
                                        'border rounded text-sm font-normal py-3 px-2.5 w-10 opacity-0 cursor-default',
                                        {
                                          '!opacity-100 !cursor-pointer': teethPosition.find(
                                            (element) => Number(element.teethNumber) === ele,
                                          ),
                                        },
                                        { 'bg-red-500 text-white': selectTeethList.find((ele) => ele === teeth?.uuid) },
                                      )}
                                    >
                                      {' '}
                                      {ele}
                                    </button>
                                    <div className="h-14 relative flex justify-center align-bottom mb-4">
                                      <img
                                        className="absolute bottom-0 "
                                        src={require(`assets/images/teeth/${ele}.png`)}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            {Array.from({ length: 8 }, (_, i) => i + 31).map((ele) => {
                              const teeth = teethPosition.find((element) => Number(element.teethNumber) === ele);
                              return (
                                <div
                                  className={classNames({ 'hidden xl:block': [36, 37, 38].includes(ele) })}
                                  key={ele}
                                >
                                  <button
                                    onClick={() => handleSelectTeethHistoryList(teeth)}
                                    className={classNames(
                                      'border rounded text-sm font-normal py-3 px-2.5 w-10 opacity-0 cursor-default',
                                      {
                                        '!opacity-100 !cursor-pointer': teethPosition.find(
                                          (element) => Number(element.teethNumber) === ele,
                                        ),
                                      },
                                      { 'bg-red-500 text-white': selectTeethList.find((ele) => ele === teeth?.uuid) },
                                    )}
                                  >
                                    {' '}
                                    {ele}
                                  </button>
                                  <div className="h-14 relative flex justify-center align-bottom mb-4">
                                    <img
                                      className="absolute bottom-0 "
                                      src={require(`assets/images/teeth/${ele}.png`)}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex justify-center gap-3">
                            {Array.from({ length: 3 }, (_, i) => i + 41)
                              .reverse()
                              .map((ele) => {
                                const teeth = teethPosition.find((element) => Number(element.teethNumber) === ele);
                                return (
                                  <div className="block xl:hidden" key={ele}>
                                    <button
                                      onClick={() => handleSelectTeethHistoryList(teeth)}
                                      className={classNames(
                                        'border rounded text-sm font-normal py-3 px-2.5 w-10 opacity-0 cursor-default',
                                        {
                                          '!opacity-100 !cursor-pointer': teethPosition.find(
                                            (element) => Number(element.teethNumber) === ele,
                                          ),
                                        },
                                        { 'bg-red-500 text-white': selectTeeth === teeth?.uuid },
                                      )}
                                    >
                                      {' '}
                                      {ele}
                                    </button>
                                    <div className="h-14 relative flex justify-center align-bottom mb-4">
                                      <img
                                        className="absolute bottom-0 "
                                        src={require(`assets/images/teeth/${ele}.png`)}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            {Array.from({ length: 3 }, (_, i) => i + 36).map((ele) => {
                              const teeth = teethPosition.find((element) => Number(element.teethNumber) === ele);
                              return (
                                <div className="block xl:hidden" key={ele}>
                                  <button
                                    onClick={() => handleSelectTeethHistoryList(teeth)}
                                    className={classNames(
                                      'border rounded text-sm font-normal py-3 px-2.5 w-10 opacity-0 cursor-default',
                                      {
                                        '!opacity-100 !cursor-pointer': teethPosition.find(
                                          (element) => Number(element.teethNumber) === ele,
                                        ),
                                      },
                                      { 'bg-red-500 text-white': selectTeeth === teeth?.uuid },
                                    )}
                                  >
                                    {ele}
                                  </button>
                                  <div className="h-14 relative flex justify-center align-bottom mb-4">
                                    <img
                                      className="absolute bottom-0 "
                                      src={require(`assets/images/teeth/${ele}.png`)}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Răng sữa" key="2" className="flex flex-col gap-4">
                          <div className="flex justify-center gap-3">
                            {Array.from({ length: 5 }, (_, i) => i + 51)
                              .reverse()
                              .map((ele) => {
                                const teeth = teethPosition.find((element) => Number(element.teethNumber) === ele);
                                return (
                                  <div key={ele}>
                                    <div className="h-14 relative flex justify-center align-top mt-4">
                                      <img
                                        className="absolute top-0 "
                                        src={require(`assets/images/teeth/${ele}.png`)}
                                      />
                                    </div>
                                    <button
                                      onClick={() => handleSelectTeethHistoryList(teeth)}
                                      className={classNames(
                                        'border rounded text-sm font-normal py-3 px-2.5 w-10 opacity-0 cursor-default',
                                        {
                                          '!opacity-100 !cursor-pointer': teethPosition.find(
                                            (element) => Number(element.teethNumber) === ele,
                                          ),
                                        },
                                        { 'bg-red-500 text-white': selectTeethList.find((ele) => ele === teeth?.uuid) },
                                      )}
                                    >
                                      {' '}
                                      {ele}
                                    </button>
                                  </div>
                                );
                              })}
                            {Array.from({ length: 5 }, (_, i) => i + 61).map((ele) => {
                              const teeth = teethPosition.find((element) => Number(element.teethNumber) === ele);
                              return (
                                <div key={ele}>
                                  <div className="h-14 relative flex justify-center align-top mt-4">
                                    <img className="absolute top-0 " src={require(`assets/images/teeth/${ele}.png`)} />
                                  </div>
                                  <button
                                    onClick={() => handleSelectTeethHistoryList(teeth)}
                                    className={classNames(
                                      'border rounded text-sm font-normal py-3 px-2.5 w-10 opacity-0 cursor-default',
                                      {
                                        '!opacity-100 !cursor-pointer': teethPosition.find(
                                          (element) => Number(element.teethNumber) === ele,
                                        ),
                                      },
                                      { 'bg-red-500 text-white': selectTeethList.find((ele) => ele === teeth?.uuid) },
                                    )}
                                  >
                                    {' '}
                                    {ele}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex justify-center gap-3">
                            {Array.from({ length: 5 }, (_, i) => i + 81)
                              .reverse()
                              .map((ele) => {
                                const teeth = teethPosition.find((element) => Number(element.teethNumber) === ele);
                                return (
                                  <div key={ele}>
                                    <button
                                      onClick={() => handleSelectTeethHistoryList(teeth)}
                                      className={classNames(
                                        'border rounded text-sm font-normal py-3 px-2.5 w-10 opacity-0 cursor-default',
                                        {
                                          '!opacity-100 !cursor-pointer': teeth,
                                        },
                                        { 'bg-red-500 text-white': selectTeethList.find((ele) => ele === teeth?.uuid) },
                                      )}
                                    >
                                      {' '}
                                      {ele}
                                    </button>
                                    <div className="h-14 relative flex justify-center align-top mt-4">
                                      <img
                                        className="absolute top-0 "
                                        src={require(`assets/images/teeth/${ele}.png`)}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            {Array.from({ length: 5 }, (_, i) => i + 71).map((ele) => {
                              const teeth = teethPosition.find((element) => Number(element.teethNumber) === ele);
                              return (
                                <div key={ele}>
                                  <button
                                    onClick={() => handleSelectTeethHistoryList(teeth)}
                                    className={classNames(
                                      'border rounded text-sm font-normal py-3 px-2.5 w-10 opacity-0 cursor-default',
                                      {
                                        '!opacity-100 !cursor-pointer': teeth,
                                      },
                                      { 'bg-red-500 text-white': selectTeethList.find((ele) => ele === teeth?.uuid) },
                                    )}
                                  >
                                    {' '}
                                    {ele}
                                  </button>
                                  <div className="h-14 relative flex justify-center align-top mt-4">
                                    <img className="absolute top-0 " src={require(`assets/images/teeth/${ele}.png`)} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </Tabs.TabPane>
                      </Tabs>
                    </div>
                  </div>
                  <div>
                    <div className="w-full flex justify-between gap-4">
                      <Form.Item className="w-6/12" name="teethStoryDiagnosisDtoList" label="Chuẩn đoán răng">
                        <Select
                          className="w-full !rounded-lg  text-sm font-normal"
                          allowClear
                          mode="multiple"
                          placeholder="Chọn chuẩn đoán răng"
                        >
                          {listToothDiagnosis.map((ele) => (
                            <Option key={`tool-diagnosis${ele.uuid}`} className="w-full" value={ele.uuid}>
                              {ele.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item className="w-6/12" name="teethStoryServiceDtoList" label="Dịch vụ">
                        <Select
                          mode="multiple"
                          className="w-full !rounded-lg  text-sm font-normal"
                          allowClear
                          placeholder="Chọn dịch vụ"
                        >
                          {listService.map((ele) => (
                            <Option key={`service-${ele.uuid}`} className="w-full" value={ele.uuid}>
                              {ele.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </div>
                    <div>
                      <Form.Item className="w-full" label="Ghi chú" name="note">
                        <Input.TextArea
                          rows={1}
                          className=" w-full h-10 text-sm font-normal block !bg-white rounded-lg border border-gray-200  py-2 px-4 "
                          placeholder="Nhập ghi chú"
                        />
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
                      onClick={() => {
                        handleSubmitHistoryForm();
                      }}
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
      <div>
        {showModelAddTreatmentSlip && (
          <AddTreatmentSlip
            showModelAddTreatmentSlip={showModelAddTreatmentSlip}
            setShowModelAddTreatmentSlip={setShowModelAddTreatmentSlip}
            cusName={cusName}
            serviceCheck={serviceCheck}
            customerUuid={customerUuid}
            idCustomer={idCustomer}
          />
        )}
      </div>
    </div>
  );
};
