import { DatePicker, Input, Spin, Timeline } from 'antd';
import { Collapse } from 'components';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { CameraService } from 'services/camera';
import { exportIcons, formatCurrency } from 'utils';
import { fortmatType } from 'utils/constants';
import useDebounce, { convertUtcTimeToLocalTime } from 'utils/func';
import '../index.less';
import classNames from 'classnames';
import AddCamPerson from '../comp/addCamPerson';
import { useLocation } from 'react-router';

function Customer() {
  const branchUuid = localStorage.getItem('branchUuid');
  const [isLoading, setIsLoading] = useState(false);
  const [totalStatistics, setTotalStatistics] = useState();
  const [params, setParams] = useState({
    search: null,
    startTime: moment().startOf('day').utc().format(fortmatType.formatDateTimeSend),
    endTime: moment().endOf('day').utc().format(fortmatType.formatDateTimeSend),
  });
  const [showModal, setShowModal] = useState(false);
  const [handleOpenModal, AddCamPersonModal] = AddCamPerson({ showModal, setShowModal });
  const [listCam, setListCam] = useState([]);
  const filterSearch = useDebounce(params.search, 500);
  const location = useLocation();
  useEffect(() => {
    setTimeout(() => {
      import('glightbox').then(({ default: GLightbox }) => GLightbox());
    });
  }, [listCam.length, location.pathname]);

  useEffect(() => {
    const get_totalStatistics = async () => {
      try {
        const res = await CameraService.getStatistic(
          { fromDate: params.startTime, toDate: params.endTime },
          branchUuid,
        );
        setTotalStatistics(res.data);
      } catch (error) {
        console.log('error: ', error);
      }
    };
    get_totalStatistics();
  }, [location.pathname, params.startTime, params.endTime]);

  useEffect(() => {
    const get_ListCamEvent = async () => {
      try {
        setIsLoading(true);
        const res = await CameraService.getListCamEvent(
          { ...params, search: filterSearch, isCustomer: true },
          branchUuid,
        );
        setListCam(res?.data ?? []);
      } catch (error) {
        console.log('error: ', error);
      } finally {
        setIsLoading(false);
      }
    };
    get_ListCamEvent();
  }, [location.pathname, params.startTime, params.endTime, filterSearch]);

  const removeFilter = () => {
    setParams((prev) => ({
      ...prev,
      startTime: moment().startOf('day').utc().format(fortmatType.formatDateTimeSend),
      endTime: moment().endOf('day').utc().format(fortmatType.formatDateTimeSend),
      search: null,
    }));
  };

  return (
    <div className="min-h-screen camera-statistics">
      {AddCamPersonModal()}
      <div className="bg-white p-4 ">
        <div className="flex justify-end items-center mb-4">
          <button
            className="rounded-xl bg-rose-500 text-white h-10 w-[136px] text-center hover:bg-red-600"
            onClick={removeFilter}
          >
            Xóa bộ lọc
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 items-center justify-between gap-4">
          <div className="border border-gray-200 rounded-xl p-5 text-center h-full">
            <h3 className="text-sm font-normal mb-2 ">Khách hàng check in</h3>
            <p className="text-base text-rose-500">
              {formatCurrency(totalStatistics?.numberCustomerCheckIn ?? 0, ' ')}
            </p>
          </div>
          <div className="border border-gray-200 rounded-xl p-5 text-center h-full">
            <h3 className="text-sm font-normal mb-2  ">Người lạ check in</h3>
            <p className="text-base text-rose-500">
              {formatCurrency(totalStatistics?.numberStrangerCheckIn ?? 0, ' ')}
            </p>
          </div>
          <div className="border border-gray-200 rounded-xl p-5 text-center h-full">
            <h3 className="text-sm font-normal mb-2  ">Khách hàng mới có face ID</h3>
            <p className="text-base text-rose-500">
              {formatCurrency(totalStatistics?.numberNewCustomerWithFaceId ?? 0, ' ')}
            </p>
          </div>
          <div className="border border-gray-200 rounded-xl p-5 text-center h-full">
            <h3 className="text-sm font-normal mb-2  ">Khách hàng mới không có faceID </h3>
            <p className="text-base text-rose-500">
              {formatCurrency(totalStatistics?.numberNewCustomerWithoutFaceId ?? 0, ' ')}
            </p>
          </div>
          <div className="border border-gray-200 rounded-xl p-5 text-center h-full">
            <h3 className="text-sm font-normal mb-2  ">Khách hàng cũ update face ID</h3>
            <p className="text-base text-rose-500">
              {formatCurrency(totalStatistics?.numberCustomerUpdateFaceId ?? 0, ' ')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 my-5 gap-4">
          <DatePicker.RangePicker
            showTime
            allowClear={false}
            // value={[moment('2015-01-01'), moment('2015-01-02')]}
            value={[moment(params.startTime).add(7, 'hours'), moment(params.endTime).add(7, 'hours')]}
            className="!bg-white w-full "
            format={'DD/MM/YYYY HH:mm:ss'}
            onChange={(date) => {
              if (!date) {
                setParams((prev) => ({
                  ...prev,
                  startTime: moment().startOf('day').utc().format(fortmatType.formatDateTimeSend),
                  endTime: moment().endOf('day').utc().format(fortmatType.formatDateTimeSend),
                }));
                return;
              }
              setParams((prev) => ({
                ...prev,
                startTime: moment(date[0]).utc().format(fortmatType.formatDateTimeSend),
                endTime: moment(date[1]).utc().format(fortmatType.formatDateTimeSend),
              }));
            }}
          />
          <div className="relative h-[40px] w-full sm:w-[280px] ">
            <Input
              value={params.search}
              placeholder="Tìm kiếm"
              className=" relative !bg-white border border-gray-300 h-[42px] w-full  rounded-[12px] px-3 focus:!shadow-none focus:!outline-none"
              onChange={(e) => {
                setParams((prev) => ({ ...prev, search: e.target.value }));
              }}
            />
            <span className="absolute right-4 top-2.5">{exportIcons('SEARCH')}</span>
            {/* {params.search === null ? (
              <span className="absolute right-4 top-2.5">{exportIcons('SEARCH')}</span>
            ) : (
              <span className="absolute right-4 top-2.5" onClick={() => setParams((prev) => ({ ...prev, search: null }))}> <i className="las la-times"></i></span>
            )} */}
          </div>
        </div>
        <div
          className={classNames('mt-4 pt-5 overflow-x-auto', {
            // 'overflow-x-auto ': window.innerWidth < 1024
          })}
        >
          {isLoading ? (
            <Spin className="flex items-center justify-center w-full" />
          ) : (
            <>
              {listCam.length > 0 ? (
                <Timeline mode="left" className={classNames(' ', {})}>
                  {listCam.map(({ recentEvent, camEventDtos }, index) => (
                    <Timeline.Item
                      label={convertUtcTimeToLocalTime(recentEvent?.date)}
                      key={recentEvent.id}
                      color="red"
                      dot={<div className="h-4 w-4 bg-zinc-400 rounded-full"></div>}
                    >
                      {camEventDtos && camEventDtos.length > 1 ? (
                        <Collapse
                          key={index}
                          classNameParent="my-2 items-center"
                          title={
                            <div className="flex items-center justify-between w-[90%] relative">
                              <div className=" flex items-center gap-4 relative ">
                                <div className="relative">
                                  <a
                                    href={recentEvent?.detected_image_url}
                                    className="glightbox"
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <img
                                      src={recentEvent?.detected_image_url}
                                      alt="image"
                                      className="h-[70px] w-[100px] rounded-xl overflow-hidden object-cover  aspect-square"
                                    />
                                  </a>
                                </div>
                                {/* <img
                                src={recentEvent?.detected_image_url}
                                alt="camera image"
                                className="h-[70px] w-[100px] rounded-xl overflow-hidden object-cover"
                              /> */}
                                <div>
                                  <h4 className="text-zinc-900 font-semibold">
                                    {recentEvent.personName === '' ? 'Người lạ' : recentEvent.personName}
                                  </h4>
                                  <p className="text-gray-500">{recentEvent?.placeName}</p>
                                </div>
                              </div>
                              <div className="text-rose-500 border border-rose-500 rounded-xl py-1 w-[60px] text-center">
                                {camEventDtos.length}
                              </div>
                            </div>
                          }
                          className="flex items-center border border-gray-200 rounded-xl "
                        >
                          <div className="px-4 mx-4">
                            {camEventDtos?.map((i, idx) => {
                              return (
                                <div key={idx} className="flex items-center justify-between rounded-xl gap-4 my-4">
                                  <div className="flex items-center gap-4 relative">
                                    <div className="relative">
                                      <a
                                        href={i?.detected_image_url}
                                        className="glightbox"
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        <img
                                          src={i?.detected_image_url}
                                          alt="image"
                                          className="h-[70px] w-[100px] rounded-xl overflow-hidden object-cover  aspect-square"
                                        />
                                      </a>
                                    </div>
                                    <div>
                                      <h4 className="text-zinc-900 font-semibold">
                                        {i.personName === '' ? 'Người lạ' : i.personName}
                                      </h4>
                                      <p className="text-gray-500">{i?.placeName}</p>
                                    </div>
                                    {i.personName === '' && (
                                      <button
                                        className="bg-rose-500  text-white rounded-lg ml-4 px-3 py-2 hover:bg-rose-600"
                                        onClick={() => handleOpenModal(true, i)}
                                      >
                                        Cập nhật FaceId
                                      </button>
                                    )}
                                  </div>
                                  <p className="text-gray-500">{convertUtcTimeToLocalTime(i?.date)}</p>
                                </div>
                              );
                            })}
                          </div>
                        </Collapse>
                      ) : (
                        <div className="border border-gray-200 flex items-center rounded-xl gap-4 relative">
                          <div className="relative">
                            <a
                              href={recentEvent?.detected_image_url}
                              className="glightbox"
                              target="_blank"
                              rel="noreferrer"
                            >
                              <img
                                src={recentEvent?.detected_image_url}
                                alt="image"
                                className="h-[70px] w-[100px] rounded-xl  object-cover  aspect-square"
                              />
                            </a>
                          </div>
                          <div>
                            <h4 className="text-zinc-900 font-semibold">
                              {recentEvent.personName === '' ? 'Người lạ' : recentEvent.personName}
                            </h4>
                            <p className="text-gray-500">{recentEvent?.placeName}</p>
                          </div>
                          {recentEvent.personName === '' && (
                            <button
                              className="bg-rose-500  text-white rounded-lg ml-4 px-3 py-2 hover:bg-rose-600"
                              onClick={() => handleOpenModal(true, recentEvent)}
                            >
                              Cập nhật FaceId
                            </button>
                          )}
                        </div>
                      )}
                    </Timeline.Item>
                  ))}
                </Timeline>
              ) : (
                <div className="text-center my-5">Trống</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Customer;
