import React, { Fragment, useEffect, useState } from 'react';
import coin1 from 'assets/images/icons/coin.png';
import coin2 from 'assets/images/icons/coin2.png';
import coin3 from 'assets/images/icons/coin3.png';
import avatarDefault from 'assets/images/imageAva.png';
import { exportIcons, formatCurrency } from 'utils';
import { AddSaleOrderHistory } from './addSaleOrderHistory';
import { Select, Timeline } from 'antd';
import { HookDataTable } from 'hooks';
import { ColumnCustomerDetailTable } from 'columns/customer';
import moment from 'moment';
import { SaleOrderHistoryService } from 'services/saleOrderHistory';
import AddCustomer from '../../AddCustomer';
import { DebtService } from 'services/debt';
import { useSearchParams } from 'react-router-dom';
import { CustomerService } from 'services/customer';
import { isNullOrUndefinedOrEmpty } from 'utils/func';
import { useLocation } from 'react-router';

function Profile({ idCustomer, checkPermission }) {
  const [showModalAddNewSaleOrderHistory, setShowModalAddNewSaleOrderHistory] = useState(false);
  const GetSaleOrderHistoryList = async (param) => {
    const data = await SaleOrderHistoryService.getSaleOrderHistoryList({ ...param, customerUuid: idCustomer });
    return {
      data: data?.content,
      count: data?.content?.length,
    };
  };
  const [data, setData] = useState();
  const [searchParams] = useSearchParams();
  const idCus = searchParams.get('id');
  const [, setTotalDept] = useState();
  const location = useLocation();
  useEffect(() => {
    const getDetailProfile = async () => {
      if (idCus) {
        try {
          const res = await CustomerService.getByUuid(idCus);
          setData(res);
        } catch (error) {
          return error;
        }
      }
    };
    getDetailProfile();
  }, [idCus, location.pathname]);
  useEffect(() => {
    const getDebt = async () => {
      const res = await DebtService.getAmountDebtTotal({ customerUuid: idCus ?? idCustomer });
      setTotalDept(res);
    };
    getDebt();
  }, [location.pathname]);

  const [dataSaleOrderHistory, setDataSaleOrderHistory] = useState({ data: [], isView: false });
  const deleteSaleOrderHistory = async (id) => {
    try {
      await SaleOrderHistoryService.delete(id);
      handleChange();
    } catch (error) {
      console.log(error);
    }
  };
  const [handleChange, DataTable] = HookDataTable({
    onRow: (data) => ({
      onDoubleClick: (event) => {},
    }),
    xScroll: 800,
    loadFirst: false,
    Get: GetSaleOrderHistoryList,
    columns: ColumnCustomerDetailTable({
      setDataSaleOrderHistory,
      setShowModalAddNewSaleOrderHistory,
      deleteSaleOrderHistory,
    }),
    yScroll: 700,
  });
  const [showModal, setShowModal] = useState(false);
  const [handleOpenModal, AddCustomerModal] = AddCustomer({ handleChange, setShowModal, showModal, setData });
  useEffect(() => {
    handleChange();
  }, []);
  return (
    <Fragment>
      <div>
        <div className="grid grid-cols-3 gap-x-4 mb-5 custom-grid">
          <div className="col-span-2">
            <div className=" border border-gray-300 rounded-[10px]  p-3 mb-5">
              <div className="grid grid-cols-3 gap-x-3">
                <div className="col-span-1 max-sm:col-span-3 max-sm:mb-4">
                  <img
                    src={isNullOrUndefinedOrEmpty(data?.imgUrl) ? avatarDefault : data?.imgUrl}
                    alt="productImage"
                    className="aspect-square object-cover rounded-[0.625rem] shadow-md bg-gray-100 cursor-pointer"
                  />
                </div>
                <div className="col-span-2 max-sm:col-span-3">
                  <div className="flex items-center justify-between">
                    <span className="text-base text-zinc-900 font-bold">{data?.fullName ?? ''}</span>
                    <button onClick={() => handleOpenModal(true, data)}>{exportIcons('PEN')}</button>
                  </div>
                  <div className="mb-2 border-b border-gray-400">
                    <i className="las la-map-marker text-base"></i>
                    <span className="text-gray-400 ml-2 text-sm">
                      {[
                        data?.address?.street,
                        data?.address?.mtWard?.name,
                        data?.address?.mtDistrict?.name,
                        data?.address?.mtProvince?.name,
                      ]
                        .filter((e) => !!e)
                        .join()}
                    </span>
                  </div>
                  <div>
                    <h3 className="my-4 text-sm text-gray-600 font-bold">Thông tin cơ bản:</h3>
                    <div className="grid grid-cols-2 gap-x-2">
                      <div className="">
                        <div className="mb-4">
                          <h4 className="text-gray-500 text-sm font-normal">Giới tính</h4>
                          <p className="text-gray-400 text-sm font-normal">
                            {data?.gender === 'FEMALE' ? 'Nữ' : 'Nam'}
                          </p>
                        </div>
                        <div className="mb-4">
                          <h4 className="text-gray-500 text-sm font-normal">Nghề nghiệp</h4>
                          <p className="text-gray-400 text-sm font-normal">
                            {data?.jobTitle === '' ? '\u00A0' : data?.jobTitle ?? '\u00A0'}
                          </p>
                        </div>
                        <div className="mb-4">
                          <h4 className="text-gray-500 text-sm font-normal">Ngày sinh</h4>
                          <p className="text-gray-400 text-sm font-normal">
                            {moment(data?.dateOfBirth).format('DD/MM/YYYY')}
                          </p>
                        </div>
                        <div className="mb-4">
                          <h4 className="text-gray-500 text-sm font-normal">Số điện thoại</h4>
                          <p className="text-gray-400 text-sm font-normal">{data?.phoneNumber ?? ''}</p>
                        </div>
                        <div className="mb-4">
                          <h4 className="text-gray-500 text-sm font-normal">Email</h4>
                          <p className="text-gray-400 text-sm font-normal">{data?.email ?? ''}</p>
                        </div>
                      </div>
                      <div className="">
                        <div className="mb-4">
                          <h4 className="text-gray-500 text-sm font-normal">Số thẻ BHYT</h4>
                          <p className="text-gray-400 text-sm font-normal">
                            {data?.healthInsuranceNumber === '' ? '\u00A0' : data?.healthInsuranceNumber ?? '\u00A0'}
                          </p>
                        </div>
                        <div className="mb-4">
                          <h4 className="text-gray-500 text-sm font-normal mt-4">Nguồn khách hàng</h4>
                          <p className="text-gray-400 text-sm font-normal">
                            {data?.customerResource === 'FACEBOOK'
                              ? 'Facebook'
                              : data?.customerResource === 'ZALO'
                              ? 'Zalo'
                              : 'Website'}
                          </p>
                        </div>
                        <div className="mb-4">
                          <h4 className="text-gray-500 text-sm font-normal">Nhóm khách hàng</h4>
                          <p className="text-gray-400 text-sm font-normal">
                            {data?.customerGroupDto?.name ?? '\u00A0'}
                          </p>
                        </div>
                        <div className="mb-4">
                          <h4 className="text-gray-500 text-sm font-normal">Bác sĩ chính</h4>
                          <p className="text-gray-400 text-sm font-normal">{data?.bacSiChinh ?? '\u00A0'}</p>
                        </div>
                        <div className="mb-4">
                          <h4 className="text-gray-500 text-sm font-normal">Mô tả</h4>
                          <p className="text-gray-400 text-sm font-normal">{data?.description ?? '\u00A0'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {checkPermission && checkPermission('MANAGE_CUSTOMER_DEBT') && (
              <div>
                <div className="grid grid-cols-3 gap-x-4 max-sm:grid-cols-1 max-sm:gap-y-4">
                  <div className="flex items-center justify-between border rounded-[10px] border-gray-300 h-28 px-2">
                    <img src={coin1} alt="" />
                    <div className="text-right">
                      <p>Tổng doanh thu</p>
                      <h3 className="text-base font-bold text-green-600">
                        {formatCurrency(data?.totalAmount, ' VND')}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border rounded-[10px] border-gray-300 h-28 px-2">
                    <img src={coin2} alt="" />
                    <div className="text-right">
                      <p>Tổng thực thu</p>
                      <h3 className="text-base font-bold text-blue-600">{formatCurrency(data?.paidAmount, ' VND')}</h3>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border rounded-[10px] border-gray-300 h-28 px-2">
                    <img src={coin3} alt="" />
                    <div className="text-right">
                      <p>Tổng còn nợ</p>
                      <h3 className="text-base font-bold text-rose-600">
                        {formatCurrency(Number(data?.totalAmount) - Number(data?.paidAmount), ' VND')}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* table */}
            {checkPermission && checkPermission('MANAGE_CUSTOMER_TH') ? (
              <div className="border border-gray-300 p-3 rounded-[10px] mt-5">
                <div className="flex justify-between">
                  <h3 className="my-4 text-base text-gray-600 font-bold">Lịch sử điều trị</h3>

                  <div
                    onClick={() => {
                      setShowModalAddNewSaleOrderHistory(true);
                    }}
                    className="bg-[#EE4055] text-white justify-center px-4 h-[42px] rounded-xl hover:bg-rose-400 inline-flex items-center cursor-pointer"
                  >
                    <i className="las la-plus mr-1" />
                    Thêm lịch sử và thanh toán
                  </div>
                </div>
                {DataTable()}
              </div>
            ) : null}
          </div>

          <div className="p-3 border border-gray-300 rounded-[10px]">
            <h3 className="text-gray-600 font-bold text-base mb-4">Hoạt động</h3>
            <button className="w-[171px] h-[40px] block bg-rose-500 text-white rounded-[10px] mb-2">
              <i className="las la-plus mr-1 bold"></i>Thêm ghi chú
            </button>
            <Select
              showSearch
              placeholder="Tất cả hoạt động"
              optionFilterProp="children"
              // onChange={onChange}
              // onSearch={onSearch}
              filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
            >
              <Select.Option value="jack">Thanh toán</Select.Option>
              <Select.Option value="lucy">Dịch vụ</Select.Option>
            </Select>
            <div className="mt-16">
              <Timeline mode="left">
                <Timeline.Item dot={<i className="las la-circle text-2xl"></i>} color="grey">
                  07/10/2022
                </Timeline.Item>
                <Timeline.Item color="red">
                  <h4 className="text-gray-900 font-medium text-sm">Thanh toán</h4>
                  <p className="text-sm text-gray-600">
                    Thanh toán đợt 2 cho phiếu điều trị SO0001 số tiền 5.000.000 đồng
                  </p>
                  <p className="text-xs text-gray-400">Được tạo lúc 13:00 bởi Nguyễn Văn An</p>
                </Timeline.Item>
                <Timeline.Item dot={<i className="las la-circle text-2xl"></i>} color="gray">
                  06/10/2022
                </Timeline.Item>
                <Timeline.Item color="red">
                  <h4 className="text-gray-900 font-medium text-sm">Dịch vụ</h4>
                  <p className="text-sm text-gray-600">
                    Thanh toán đợt 2 cho phiếu điều trị SO0001 số tiền 5.000.000 đồng
                  </p>
                  <p className="text-xs text-gray-400">Được tạo lúc 13:00 bởi Nguyễn Văn An</p>
                </Timeline.Item>
              </Timeline>
            </div>
          </div>
        </div>
      </div>
      {AddCustomerModal()}
      <AddSaleOrderHistory
        handleChange={handleChange}
        idCustomer={idCustomer}
        showModalAddNewSaleOrderHistory={showModalAddNewSaleOrderHistory}
        setShowModalAddNewSaleOrderHistory={setShowModalAddNewSaleOrderHistory}
        dataSaleOrderHistory={dataSaleOrderHistory}
        setDataSaleOrderHistory={setDataSaleOrderHistory}
      />
    </Fragment>
  );
}

export default Profile;
