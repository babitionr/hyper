import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Modal, Select, DatePicker, Button, Tooltip, Tabs, InputNumber } from 'antd';
import { MasterDataService } from 'services/master-data-service';
import { useSearchParams } from 'react-router-dom';
import { MasterDataTeethService } from 'services/master-data-teeth/masterDataTeeth';
import classNames from 'classnames';
import { AuthSerivce } from 'services/Auth';
// import { UserManagementService } from 'services/userManagement';
import moment from 'moment';
import AddPromotion from './addPromotion';
import './index.less';
import { useAuth } from 'global';

export const AddNew = ({
  treatmentSlipDetail,
  setShowModalAddService,
  showModalAddService,
  getListService,
  setGetListService,
  getUuidService,
  setGetUuidService,
}) => {
  const { branchUuid } = useAuth();
  const [searchParams] = useSearchParams();
  const uuidGroup = searchParams.get('uuidGroup');
  const [form] = Form.useForm();
  const [listService, setListService] = useState([]);
  const [listCategoryService, setListCategoryService] = useState([]);

  const [showTeeh, setShowTeeh] = useState(false);
  const [teethPosition, setTeethPosition] = useState([]);
  const [selectTeeth, setSelectTeeth] = useState([]);
  const [listDoctor, setListDoctor] = useState([]);
  const [listConsultant, setListConsultant] = useState([]);
  // const [, setListUser] = useState([]);
  const [oldSelectTeeth, setOldSelectTeeth] = useState([]);
  const [modalDebt, setModalDebt] = useState(false);

  // AddPromotionModal
  const modalPromotionRef = useRef();
  const [getListPromotionApplied, setGetListPromotionApplied] = useState();
  const [curPromotionDto, setCurPromotionDto] = useState();

  const handleSelectTeeth = (teeth) => {
    selectTeeth.find((ele) => ele === teeth)
      ? setSelectTeeth([...selectTeeth].filter((ele) => ele !== teeth))
      : setSelectTeeth([...selectTeeth, teeth]);
  };

  const handleCancel = () => {
    setShowModalAddService(false);
    setGetUuidService();
    form.resetFields();
  };
  const cancelSelectTeeth = () => {
    setShowTeeh(false);
    setSelectTeeth(oldSelectTeeth);
  };
  const initData = async () => {
    if (uuidGroup) {
      form.setFieldsValue({ serviceCategoryUuid: uuidGroup });
    }
    if (getListService?.data?.length) {
      console.log(getListService);
      const listPromotionApplied = getListService?.data
        .filter((e) => typeof e?.uuid === 'number' && e?.promotionDto)
        .map((e) => {
          return { ...e?.promotionDto, count: 1 };
        });
      if (typeof getUuidService?.uuid === 'number') {
        if (getUuidService?.promotionDto) {
          listPromotionApplied.push({ ...getUuidService?.promotionDto, count: -1 });
        }
      }
      console.log(listPromotionApplied);
      setGetListPromotionApplied((prev) => [...listPromotionApplied]);
    }
    if (getUuidService?.uuid) {
      console.log(getUuidService);
      const serviceRes = await MasterDataService.getAllService({ categoryUuid: getUuidService?.categoryDto?.uuid });
      setListService(serviceRes);
      const dataService = {
        ...getUuidService,
        createdDate: moment(getUuidService.createdDate),
        doctorId: getUuidService?.doctorUserDto?.id,
        consultantId: getUuidService?.consultantUserDto?.id,
        assistantUserId: getUuidService?.assistantUserDto?.id,
        consultantEmployeeId: getUuidService?.consultantEmployeeDto?.id,
        productServiceDto: getUuidService?.productServiceDto?.uuid,
        serviceCategoryUuid: getUuidService?.categoryDto?.uuid,
        uomName: 'cái',
      };
      const teethsPosition = getUuidService.saleOrderServiceTeethDtoList.map((ele) => ele.uuid);
      setSelectTeeth(teethsPosition);
      setOldSelectTeeth(teethsPosition);
      setCurPromotionDto(getUuidService?.promotionDto);
      form.setFieldsValue(dataService);
    }
    const resCatagoryService = await MasterDataService.getAllServiceCategory({ type: 'SERVICE' });
    setListCategoryService(resCatagoryService);
    const dataTeeth = await MasterDataTeethService.getDisplayTeeth();
    setTeethPosition(dataTeeth);
    const resDoctor = await AuthSerivce.getUserByPosition({ position: 'DOCTOR', branchUuid });
    setListDoctor(resDoctor.data);
    const resConsultant = await AuthSerivce.getAllUser({ branchUuid });
    setListConsultant(resConsultant.data.filter((e) => e?.position?.code !== 'DOCTOR'));
    // const resUser = await UserManagementService.getList();
    // console.log(resUser?.data?.content?.filter((ele) => ele.roles?.indexOf('DOCTOR') === -1));
    // setListUser(resUser?.data?.filter((ele) => ele.roles?.indexOf('DOCTOR') === -1));
  };
  const handleSelectService = async (e) => {
    const res = await MasterDataService.getDetailService(e);
    const { uomName, price } = res;
    form.setFieldsValue({ ...form.getFieldsValue(), uomName, unitPrice: Number(price) });
  };
  const onSaveData = async () => {
    const { data } = getListService;
    const formValue = form.getFieldsValue();
    const sericeSelect = listService.find((ele) => ele.uuid === formValue.productServiceDto);
    const doctorUserDto = {
      id: listDoctor?.find((ele) => ele.id === formValue.doctorId)?.id,
      firstName: listDoctor?.find((ele) => ele.id === formValue.doctorId)?.firstName,
    };
    const consultantUserDto = {
      id: listDoctor?.find((ele) => ele.id === formValue.consultantId)?.id,
      firstName: listDoctor?.find((ele) => ele.id === formValue.consultantId)?.firstName,
    };
    const assistantUserDto = {
      id: listConsultant?.find((ele) => ele.id === formValue.assistantUserId)?.id,
      firstName: listConsultant?.find((ele) => ele.id === formValue.assistantUserId)?.firstName,
    };
    const consultantEmployeeDto = {
      id: listConsultant?.find((ele) => ele.id === formValue.consultantEmployeeId)?.id,
      firstName: listConsultant?.find((ele) => ele.id === formValue.consultantEmployeeId)?.firstName,
    };
    const promotionAmount =
      curPromotionDto?.promotionType === 'PERCENT'
        ? (Number(formValue.unitPrice) * Number(formValue.quantity) * Number(curPromotionDto?.amount)) / 100
        : curPromotionDto?.promotionType === 'CASH'
        ? Number(curPromotionDto?.amount)
        : 0;

    if (getUuidService?.uuid) {
      console.log(data);

      const editData = [
        {
          ...getUuidService,
          ...formValue,
          createdDate: moment(formValue.createdDate).format('YYYY-MM-DD hh:mm:ss'),
          doctorUserDto,
          consultantUserDto,
          assistantUserDto,
          consultantEmployeeDto,
          saleOrderServiceTeethDtoList: teethPosition.filter((ele) => selectTeeth.find((teeth) => teeth === ele.uuid)),
          serviceNamne: sericeSelect.name,
          productServiceDto: { uuid: formValue.productServiceDto },
          categoryDto: { uuid: formValue.serviceCategoryUuid },
          quantity: Number(formValue.quantity),
          unitPrice: Number(formValue.unitPrice),
          totalPaymentAmount: Number(formValue.quantity ?? 0) * Number(formValue.unitPrice),
          balanceAmount:
            Number(formValue.quantity ?? 0) * Number(formValue.unitPrice) -
            promotionAmount -
            Number(getUuidService?.paidAmount ?? 0),
          promotionDto: curPromotionDto,
        },
      ];
      const newData = data.map((ele) => editData.find((element) => element.uuid === ele.uuid) || ele);
      console.log(newData);
      setGetListService({ data: newData, count: newData.length });
      form.resetFields();
      setGetUuidService();
      setShowModalAddService(false);
    } else {
      console.log(formValue);

      const newData = {
        uuid: Math.random(),
        // ...formValue, createdDate: moment(formValue.createdDate).format('YYYY-MM-DD hh:mm:ss'),
        // doctorUserDto, saleOrderServiceTeethDtoList: teethPosition.filter(ele => selectTeeth.find(teeth => teeth === ele.uuid)),
        //  serviceNamne: sericeSelect.name
        ...formValue,
        createdDate: moment(formValue.createdDate).format('YYYY-MM-DD hh:mm:ss'),
        doctorUserDto,
        consultantUserDto,
        assistantUserDto,
        consultantEmployeeDto,
        saleOrderServiceTeethDtoList: teethPosition.filter((ele) => selectTeeth.find((teeth) => teeth === ele.uuid)),
        serviceNamne: sericeSelect.name,
        productServiceDto: { uuid: formValue.productServiceDto },
        categoryDto: { uuid: formValue.serviceCategoryUuid },
        quantity: Number(formValue.quantity),
        unitPrice: Number(formValue.unitPrice),
        totalPaymentAmount: Number(formValue.quantity ?? 0) * Number(formValue.unitPrice),
        balanceAmount:
          Number(formValue.quantity ?? 0) * Number(formValue.unitPrice) -
          promotionAmount -
          Number(getUuidService?.paidAmount ?? 0),
        paidAmount: 0,
        promotionDto: curPromotionDto,
      };
      console.log({ data: [...data, newData], count: [...data, newData].length });
      setGetListService({ data: [...data, newData], count: [...data, newData].length });
      setShowModalAddService(false);
    }
  };

  useEffect(() => {
    initData();
  }, []);

  const items = [
    {
      label: 'Răng vĩnh viễn',
      key: '1',
      children: (
        <>
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
                        { 'bg-red-500 text-white': selectTeeth.find((ele) => ele === teeth?.uuid) },
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
                      { 'bg-red-500 text-white': selectTeeth.find((ele) => ele === teeth?.uuid) },
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
                        { 'bg-red-500 text-white': selectTeeth.find((ele) => ele === teeth?.uuid) },
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
                      { 'bg-red-500 text-white': selectTeeth.find((ele) => ele === teeth?.uuid) },
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
                        { 'bg-red-500 text-white': selectTeeth.find((ele) => ele === teeth?.uuid) },
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
                      { 'bg-red-500 text-white': selectTeeth.find((ele) => ele === teeth?.uuid) },
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
                        { 'bg-red-500 text-white': selectTeeth.find((ele) => ele === teeth?.uuid) },
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
                      { 'bg-red-500 text-white': selectTeeth.find((ele) => ele === teeth?.uuid) },
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
        </>
      ),
    },
    {
      label: 'Răng sữa',
      key: '2',
      children: (
        <>
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
                        { 'bg-red-500 text-white': selectTeeth.find((ele) => ele === teeth?.uuid) },
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
                      { 'bg-red-500 text-white': selectTeeth.find((ele) => ele === teeth?.uuid) },
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
                          '!opacity-100 !cursor-pointer': teethPosition.find(
                            (element) => Number(element.teethNumber) === ele,
                          ),
                        },
                        { 'bg-red-500 text-white': selectTeeth.find((ele) => ele === teeth?.uuid) },
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
                        '!opacity-100 !cursor-pointer': teethPosition.find(
                          (element) => Number(element.teethNumber) === ele,
                        ),
                      },
                      { 'bg-red-500 text-white': selectTeeth.find((ele) => ele === teeth?.uuid) },
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
        </>
      ),
    },
  ];

  return (
    <div>
      <Modal
        open={showModalAddService}
        destroyOnClose={true}
        title={
          <div className="flex justify-between">
            <div className="text-base font-bold">{getUuidService?.uuid ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ'}</div>
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
        footer={null}
        className=" !w-9/12 xl:!w-6/12  pb-0 z-10"
        closable={false}
      >
        <Form form={form} className="px-4 w-full" colon={false} onFinish={() => onSaveData()}>
          <div>
            <div className="text-lg font-bold text-gray-600 pt-2">Thông tin</div>
            <div>
              <div className="w-full flex justify-between gap-4">
                <Form.Item
                  className="w-6/12"
                  name="serviceCategoryUuid"
                  label="Nhóm dịch vụ"
                  rules={[
                    {
                      required: true,
                      message: 'Chọn nhóm dịch vụ',
                    },
                  ]}
                >
                  <Select
                    options={listCategoryService?.map((ele) => ({ value: ele.uuid, label: ele.name })) ?? []}
                    className=" !rounded-lg"
                    placeholder="Chọn nhóm dịch vụ"
                    onChange={async (e) => {
                      const serviceRes = await MasterDataService.getAllService({ categoryUuid: e });
                      setListService(serviceRes);
                      form.resetFields(['productServiceDto']);
                    }}
                  ></Select>
                </Form.Item>
                <Form.Item
                  className="w-6/12"
                  name="productServiceDto"
                  label="Dịch vụ"
                  rules={[
                    {
                      required: true,
                      message: 'Chọn dịch vụ',
                    },
                  ]}
                >
                  <Select
                    disabled={!form.getFieldValue('serviceCategoryUuid')}
                    options={listService?.map((ele) => ({ value: ele.uuid, label: ele.name })) ?? []}
                    className=" !rounded-lg"
                    placeholder="Chọn dịch vụ"
                    onChange={async (e) => await handleSelectService(e)}
                  ></Select>
                </Form.Item>
              </div>
              <div className="w-full flex justify-between gap-4">
                <Form.Item className="w-6/12" name="createdDate" label="Ngày tạo" initialValue={moment()}>
                  <DatePicker
                    placeholder="Chọn ngày tạo"
                    className="!w-full border rounded-lg !bg-white  border-gray-200"
                    format="DD/MM/YYYY"
                    allowClear={false}
                  />
                </Form.Item>
                <Form.Item
                  className="w-6/12"
                  label="Đơn vị"
                  name="uomName"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Nhập đơn vị tính"
                  //   },
                  // ]}
                >
                  <Input
                    disabled
                    placeholder="Nhập đơn vị tính"
                    className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                  />
                </Form.Item>
              </div>
              <div className="w-full flex justify-between gap-4">
                <Form.Item className="w-6/12" label="Đơn Giá" name="unitPrice">
                  <InputNumber
                    min={0}
                    formatter={(value) => {
                      if (!value) {
                        return 0;
                      }
                      const stringValue = value.toString();
                      const formattedValue = stringValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

                      return formattedValue;
                    }}
                    parser={(value) => {
                      const parsedValue = value.replace(/\./g, '');
                      return isNaN(parsedValue) ? 0 : parsedValue;
                    }}
                    addonAfter="VND"
                    stringMode
                    placeholder="Nhập giá bán"
                    // className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                    className="antdInputNumberSuffix h-10 text-sm font-normal block !w-full rounded-l-lg text-black "
                  />
                </Form.Item>
                <Form.Item
                  className="w-6/12"
                  label="Số lượng"
                  name="quantity"
                  initialValue={1}
                  rules={[
                    {
                      required: true,
                      message: 'Nhập số lượng',
                    },
                  ]}
                >
                  <Input
                    type="number"
                    min={1}
                    placeholder="Nhập số lượng"
                    className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
                  />
                </Form.Item>
              </div>
              <div className="w-full flex justify-between gap-4">
                <div className="w-full pt-4 items-center flex">
                  <div>Răng</div> &nbsp;
                  <Tooltip
                    title={selectTeeth
                      .map((ele) => {
                        const data = teethPosition?.find((element) => element.uuid === ele);
                        return data?.teethNumber;
                      })
                      .sort((a, b) => Number(a) - Number(b))
                      .map((ele) => ele + ' ')}
                  >
                    <p className="truncate pt-0">
                      {selectTeeth
                        .map((ele) => {
                          const data = teethPosition?.find((element) => element.uuid === ele);
                          return data?.teethNumber;
                        })
                        .sort((a, b) => Number(a) - Number(b))
                        .map((ele) => ele + ' ')}
                    </p>
                  </Tooltip>
                  <div className="-mr-2">
                    <Button
                      onClick={() => {
                        setOldSelectTeeth(selectTeeth);
                        setShowTeeh(true);
                      }}
                      className="ml-2 h-10 text-red-500 border focus:text-red-500 !border-red-500 hover:text-red-500"
                    >
                      Chọn răng
                    </Button>
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-between gap-4">
                <Form.Item
                  className="w-6/12"
                  name="doctorId"
                  label="Bác sĩ điều trị"
                  rules={[
                    {
                      required: true,
                      message: 'Chọn bác sĩ điều trị',
                    },
                  ]}
                >
                  <Select
                    options={listDoctor?.map((ele) => ({ value: ele.id, label: ele.firstName })) ?? []}
                    className=" !rounded-lg"
                    placeholder="Chọn bác sĩ điều trị"
                  ></Select>
                </Form.Item>
                <Form.Item
                  className="w-6/12"
                  name="consultantId"
                  label="Bác sĩ tư vấn"
                  rules={[
                    {
                      required: true,
                      message: 'Chọn bác sĩ tư vấn',
                    },
                  ]}
                >
                  <Select
                    options={listDoctor?.map((ele) => ({ value: ele.id, label: ele.firstName })) ?? []}
                    className=" !rounded-lg"
                    placeholder="Chọn bác sĩ tư vấn"
                  ></Select>
                </Form.Item>
              </div>
              <div className="w-full flex justify-between gap-4">
                <Form.Item className="w-6/12" name="assistantUserId" label="Tư vấn viên">
                  <Select
                    allowClear
                    options={listConsultant?.map((ele) => ({ value: ele.id, label: ele.firstName })) ?? []}
                    className=" !rounded-lg"
                    placeholder="Chọn tư vấn viên"
                  ></Select>
                </Form.Item>
                <Form.Item className="w-6/12" name="consultantEmployeeId" label="Trợ thủ">
                  <Select
                    allowClear
                    options={listConsultant?.map((ele) => ({ value: ele.id, label: ele.firstName })) ?? []}
                    className=" !rounded-lg"
                    placeholder="Chọn trợ thủ"
                  ></Select>
                </Form.Item>
              </div>
              <div className="w-full flex justify-between gap-4">
                <Form.Item className="w-full" label="Chuẩn đoán" name="diagnosisNote">
                  <Input.TextArea
                    rows={3}
                    className="w-full text-sm font-normal block  rounded-lg border border-gray-200  py-[7px] px-4 !bg-white "
                    placeholder=""
                  />
                </Form.Item>
              </div>
              <div className="w-full flex gap-4">
                <Form.Item className="w-4/12" name="status" label="Tình trạng" initialValue={'TREATING'}>
                  <Select
                    disabled={
                      !getUuidService?.uuid || typeof getUuidService?.uuid === 'number' || !treatmentSlipDetail?.uuid
                    }
                    className="!rounded-lg"
                    onChange={(e) => {
                      console.log(getUuidService);
                      if (e === 'COMPLETED' && getUuidService?.balanceAmount > 0) {
                        setModalDebt(true);
                      }
                    }}
                  >
                    <Select.Option value="TREATING">
                      <span className="text-yellow-500 text-sm font-bold">Đang điều trị</span>
                    </Select.Option>
                    <Select.Option value="COMPLETED">
                      <span className="text-green-600 text-sm font-bold">Hoàn thành</span>
                    </Select.Option>
                  </Select>
                </Form.Item>
                <span className="mt-8">
                  <div
                    onClick={async () => {
                      try {
                        await form.validateFields(['productServiceDto', 'quantity']);
                        modalPromotionRef?.current?.openModal();
                      } catch (error) {
                        console.log(error);
                      }
                    }}
                    className="bg-white border h-10 border-red-500 text-red-500 px-4 py-2.5 rounded-lg inline-flex items-center cursor-pointer active:ring-0 ring-offset-1 ring-offset-red-200 ring-red-200"
                  >
                    <svg
                      width="20"
                      height="24"
                      viewBox="0 0 20 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-1"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M19.6387 9.39054L11.926 22.7495C11.5209 23.4512 10.6182 23.693 9.91649 23.2879L0.895017 18.0794C0.193345 17.6742 -0.04853 16.7716 0.356564 16.0699L8.06938 2.71095C8.27736 2.35067 8.58866 2.117 8.99267 2.01786L14.7933 0.594123C15.4845 0.424482 16.1718 0.530279 16.8239 0.906826C17.4761 1.28333 17.9114 1.82567 18.11 2.50911L19.7773 8.24445C19.8935 8.64383 19.8467 9.03036 19.6387 9.39054ZM14.8266 4.36625C13.97 3.87172 12.8748 4.1652 12.3803 5.02175C11.8858 5.87829 12.1792 6.97358 13.0358 7.46811C13.8923 7.96264 14.9876 7.66915 15.4821 6.81261C15.9766 5.95601 15.6831 4.86078 14.8266 4.36625ZM8.79097 10.0271C8.36984 9.78397 7.89186 9.73404 7.45953 9.84987C7.0272 9.9657 6.63819 10.2479 6.39505 10.669C6.15191 11.0901 6.10199 11.5682 6.21786 12.0005C6.33416 12.4346 6.61606 12.8243 7.03597 13.0668C7.45588 13.3092 7.93433 13.3585 8.36844 13.2421C8.80077 13.1263 9.18974 12.8441 9.43292 12.4229L9.43475 12.424C9.67719 12.0042 9.72645 11.5257 9.61011 11.0915C9.49428 10.6592 9.21205 10.2702 8.79097 10.0271ZM10.8922 15.974C10.4724 15.7315 9.99388 15.6823 9.55977 15.7986C9.12744 15.9144 8.73847 16.1967 8.49528 16.6178C8.25219 17.0389 8.20222 17.5169 8.3181 17.9492C8.43439 18.3833 8.7163 18.7731 9.1362 19.0155C9.55611 19.2579 10.0346 19.3071 10.4687 19.1908C10.901 19.075 11.29 18.7928 11.5331 18.3717L11.535 18.3727L11.5332 18.3716C11.7763 17.9505 11.8262 17.4725 11.7103 17.0402C11.594 16.6062 11.3121 16.2164 10.8922 15.974ZM10.3506 16.9122C10.1896 16.8192 10.0063 16.8003 9.84008 16.8449C9.67203 16.8899 9.52199 16.9977 9.42978 17.1573C9.33758 17.317 9.31934 17.5008 9.36434 17.6689C9.40888 17.8351 9.51692 17.9844 9.67785 18.0773C9.83877 18.1702 10.0221 18.1891 10.1883 18.1446C10.3564 18.0995 10.5064 17.9918 10.5986 17.8321L10.5968 17.831L10.5986 17.8321C10.6908 17.6724 10.709 17.4886 10.664 17.3205C10.6195 17.1544 10.5115 17.0051 10.3506 16.9122ZM12.0287 12.3948L5.44972 15.5924C5.18117 15.7234 5.06961 16.0474 5.20058 16.3159C5.33155 16.5845 5.6555 16.696 5.92405 16.565L12.503 13.3674C12.7715 13.2364 12.8831 12.9125 12.7521 12.6439C12.6212 12.3754 12.2972 12.2638 12.0287 12.3948ZM8.56386 11.3719C8.51881 11.2039 8.41109 11.0538 8.25144 10.9616C8.09178 10.8694 7.90794 10.8512 7.73989 10.8962C7.57184 10.9412 7.4218 11.049 7.3296 11.2086C7.23739 11.3683 7.21916 11.5522 7.2642 11.7202C7.30874 11.8864 7.41678 12.0357 7.5777 12.1287C7.73863 12.2216 7.92195 12.2405 8.08817 12.1959C8.25622 12.1509 8.40627 12.0432 8.49847 11.8835L8.49664 11.8824C8.5895 11.7215 8.60839 11.5381 8.56386 11.3719Z"
                        fill="#EE4055"
                      />
                    </svg>
                    Ưu đãi dịch vụ
                  </div>
                </span>
                <span className="mt-8">
                  {curPromotionDto && (
                    <div className="h-10 inline-flex items-start  text-sm font-medium text-center text-black  border-black px-2 rounded-lg bg-white focus:ring-4 focus:outline-none ">
                      <div>
                        <div className=" text-start ">{curPromotionDto && `${curPromotionDto?.code ?? ''}`}</div>
                        <Tooltip
                          title={`Ưu đãi: ${
                            curPromotionDto?.promotionType === 'PERCENT'
                              ? curPromotionDto?.amount + '%'
                              : Number(curPromotionDto?.amount).toLocaleString('de-DE') + ' VND'
                          }`}
                        >
                          <div className=" text-start ">
                            {`Ưu đãi: ${
                              curPromotionDto?.promotionType === 'PERCENT'
                                ? curPromotionDto?.amount + '%'
                                : Number(curPromotionDto?.amount).toLocaleString('de-DE') + ' VND'
                            }`}
                          </div>
                        </Tooltip>
                      </div>
                      {/* <span onClick={() => { setCurPromotionDto() }} className="hover:cursor-pointer mt-1 ml-1 inline-flex items-center justify-center w-4 h-4 text-xs font-semibold text-black bg-white border border-black rounded-full">
                        X
                      </span> */}
                      <i
                        className="las la-times-circle text-lg -mt-2 hover:cursor-pointer"
                        onClick={() => {
                          setCurPromotionDto();
                        }}
                      ></i>
                    </div>
                  )}
                </span>
                {/* <span className='mt-10'>{curPromotionDto && `${curPromotionDto?.code ?? ''} Ưu đãi: ${curPromotionDto?.promotionType === 'PERCENT' ? curPromotionDto?.amount + '%' : Number(curPromotionDto?.amount).toLocaleString('en-us') + ' VND'}`}</span> */}

                {/* <Form.Item className="w-6/12" name="assistantUserId" label="Phụ tá"
                  rules={[
                    {
                      required: true,
                      message: "Chọn phụ tá"
                    },
                  ]}
                >
                  <Select
                    options={listUser?.map(ele => ({ value: ele.id, label: ele.firstName })) ?? []}
                    className=" !rounded-lg" placeholder="Chọn dịch vụ" allowClear onChange={(e) => {
                      form.setFieldsValue({ ...form.getFieldsValue(), assistantUserDto: e });
                    }}>
                  </Select>
                </Form.Item> */}
              </div>
            </div>
          </div>
          <div>
            <div className="flex justify-between pt-6">
              <button
                className="active:ring-2 ring-offset-1 ring-offset-gray-300 ring-gray-300 bg-white text-gray-500 border-gray-400 border !rounded-lg px-11 py-2 text-base font-medium  "
                type="button"
                onClick={() => {
                  handleCancel();
                }}
              >
                Hủy
              </button>
              <button
                className="active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-red-500 text-white rounded-lg border border-red-500  items-center !text-base !font-medium px-6 py-2"
                type="submit"
                // onClick={() => onSaveData()}
              >
                {getUuidService?.uuid ? 'Lưu dịch vụ' : 'Thêm dịch vụ'}
              </button>
            </div>
          </div>
        </Form>
      </Modal>
      <Modal
        wrapClassName="modalSelectTeeth"
        open={showTeeh}
        destroyOnClose={true}
        title={
          <div className="flex justify-between">
            <div className="text-base -ml-2 font-bold">{'Sơ đồ vị trí răng'.toUpperCase()}</div>
            <button
              className=""
              onClick={() => {
                cancelSelectTeeth();
              }}
            >
              <span className="icon-x-close pr-2"></span>
            </button>
          </div>
        }
        footer={null}
        className="!w-full xl:!w-8/12 pb-0 z-50"
        closable={false}
      >
        <div className="-mt-9 mb-6 flex flex-col gap-4">
          <Tabs defaultActiveKey={1} items={items}>
            {/* <Tabs.TabPane tab="Răng vĩnh viễn" key="1" className="flex flex-col gap-4">
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
                            { 'bg-red-500 text-white': selectTeeth.find((ele) => ele === teeth?.uuid) },
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
                          { 'bg-red-500 text-white': selectTeeth.find((ele) => ele === teeth?.uuid) },
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
                            { 'bg-red-500 text-white': selectTeeth.find((ele) => ele === teeth?.uuid) },
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
                          { 'bg-red-500 text-white': selectTeeth.find((ele) => ele === teeth?.uuid) },
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
                            { 'bg-red-500 text-white': selectTeeth.find((ele) => ele === teeth?.uuid) },
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
                          { 'bg-red-500 text-white': selectTeeth.find((ele) => ele === teeth?.uuid) },
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
                            { 'bg-red-500 text-white': selectTeeth.find((ele) => ele === teeth?.uuid) },
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
                          { 'bg-red-500 text-white': selectTeeth.find((ele) => ele === teeth?.uuid) },
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
            </Tabs.TabPane>
            <Tabs.TabPane tab="Răng sữa" key="2" className="flex flex-col gap-4">
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
                            { 'bg-red-500 text-white': selectTeeth.find((ele) => ele === teeth?.uuid) },
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
                          { 'bg-red-500 text-white': selectTeeth.find((ele) => ele === teeth?.uuid) },
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
                              '!opacity-100 !cursor-pointer': teethPosition.find(
                                (element) => Number(element.teethNumber) === ele,
                              ),
                            },
                            { 'bg-red-500 text-white': selectTeeth.find((ele) => ele === teeth?.uuid) },
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
                            '!opacity-100 !cursor-pointer': teethPosition.find(
                              (element) => Number(element.teethNumber) === ele,
                            ),
                          },
                          { 'bg-red-500 text-white': selectTeeth.find((ele) => ele === teeth?.uuid) },
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
            </Tabs.TabPane> */}
          </Tabs>
          <div>
            <div className="flex justify-center">
              <button
                className="mr-6 active:ring-2 ring-offset-1 ring-offset-gray-300 ring-gray-300 bg-white text-gray-500 border-gray-400 border !rounded-lg px-11 py-2 text-base font-medium  "
                type="button"
                onClick={() => {
                  cancelSelectTeeth();
                }}
              >
                Hủy
              </button>
              <button
                className="active:ring-2 ring-offset-1 ring-offset-red-300 ring-red-300  bg-red-500 text-white rounded-lg border border-red-500  items-center !text-base !font-medium px-6 py-2"
                type="button"
                onClick={async () => {
                  if (selectTeeth.length > form.getFieldValue('quantity')) {
                    form.setFieldsValue({ quantity: selectTeeth.length });
                  }
                  setShowTeeh(false);
                }}
              >
                Lưu vị trí
              </button>
            </div>
          </div>
        </div>
      </Modal>
      {/* open modal if balance Amount > 0 */}
      <Modal
        destroyOnClose={true}
        title={false}
        open={modalDebt}
        footer={null}
        className="!w-5/12 xl:!w-5/12 min-w-min pb-0"
        closable={false}
        style={{ top: '30%' }}
      >
        <div className="">
          <div className="  bg-white ">
            <div className="p-2">
              <div className="flex gap-4">
                <div className="flex flex-wrap gap-2 w-full">
                  <div className="w-full flex justify-center gap-4">
                    <div className=" text-green-500 font-bold text-3xl">Hoàn thành</div>
                  </div>
                  <div className="w-full flex justify-center gap-4">
                    <div>
                      Dịch vụ chưa được thanh toán hết, còn lại {''}
                      <span className="text-rose-500 underline">
                        {Number(getUuidService?.balanceAmount)?.toLocaleString('de-DE')}
                      </span>
                      {''} VND, Nếu bạn tiếp tục thao tác sẽ tạo công nợ {''}
                      <span className="text-rose-500 underline">
                        {Number(getUuidService?.balanceAmount)?.toLocaleString('de-DE')}
                      </span>
                      {''} VND cho khách hàng. Bạn có muốn tiếp tục?
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-2">
              <div className="flex items-center justify-center  border-solid gap-6 border-slate-200 rounded-b">
                <button
                  className="active:ring-2 ring-offset-1 ring-offset-gray-300 ring-gray-300 bg-white text-gray-500 border-gray-400 border !rounded-lg px-16 py-2 text-base font-medium  "
                  type="button"
                  onClick={() => {
                    form.setFieldsValue({ status: 'TREATING' });
                    setModalDebt(false);
                  }}
                >
                  Hủy
                </button>

                <button
                  className="text-white bg-rose-500 active:ring-2 ring-offset-1 ring-offset-rose-300 ring-rose-300 rounded-lg px-16 py-2 text-base font-medium  hover:bg-rose-600 hover:border-transparent outline-none focus:outline-none "
                  type="submit"
                  onClick={async () => {
                    setModalDebt(false);
                  }}
                >
                  <p className=" whitespace-nowrap">Xác nhận</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <AddPromotion
        getListPromotionApplied={getListPromotionApplied}
        curPromotionDto={curPromotionDto}
        setCurPromotionDto={setCurPromotionDto}
        formAddService={form.getFieldValue}
        ref={modalPromotionRef}
      />
    </div>
  );
};
