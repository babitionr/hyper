import React, { Fragment, useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useLocation } from 'react-router';
import { Input, Select } from 'antd';
import { CalendarService } from '../../../services/appointment-schedule';
import CreateCalendar from './create';
import './index.less';
import { useTranslation } from 'react-i18next';
// import format from 'date-fns/format';
// import getDay from 'date-fns/getDay';
// import parse from 'date-fns/parse';
// import startOfWeek from 'date-fns/startOfWeek';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { Event, MyDayEvent, MyMonthEvent, MyWeekEvent } from './util/customEvent';
import { useAuth } from 'global';
import moment from 'moment';
import 'moment/locale/vi';
import { CustomScheduleToolbar } from './util/customScheduleToolbar';
// import overlap from 'react-big-calendar/lib/utils/layout-algorithms/overlap'
moment.locale('vi');
moment.updateLocale('vi');
const localizer = momentLocalizer(moment);
// const locales = {
//   vi: require('moment/locale/vi'),
// };
// const localizer = dateFnsLocalizer({
//   format,
//   parse,
//   startOfWeek,
//   getDay,
//   locales,
// });

const Page = () => {
  const { branchUuid } = useAuth();
  const mount = useRef(false);
  const [showModal, setShowModal] = useState(false);
  const { pathname } = useLocation();
  const { t } = useTranslation();
  // const [listEvents, setListEvents] = useState([]);
  const [listEventsFilter, setListEventsFilter] = useState([]);
  const uuidRequest = useState(null);
  const [listDoctor, setListDoctor] = useState([]);
  const [filter, setFilter] = useState({
    type: '',
    status: '',
    doctorId: '',
  });
  const [params] = useState({
    startTime: moment().startOf('year').format('YYYY-MM-DD HH:mm:ss'),
    endTime: moment().endOf('year').format('YYYY-MM-DD HH:mm:ss'),
  });

  const date = new Date();
  const changeDate = (date, est) => {
    const d = new Date(date);
    const endDate = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      d.getHours(),
      d.getMinutes() + est,
      d.getSeconds(),
    );
    return endDate;
  };

  const initFunction = useCallback(async () => {
    if (!mount.current) {
      mount.current = true;
    }
  }, [mount]);

  useEffect(() => {
    initFunction();
  }, [initFunction, pathname]);

  useEffect(() => {
    if (!branchUuid) return;
    const getListCalendar = async () => {
      const res = await CalendarService.get({ ...params }, branchUuid);
      // setListEvents(res.data);
      setListEventsFilter(res.data);
    };
    getListCalendar();
  }, [showModal, branchUuid, params]);

  const backgroundColorForDoctor = [
    '#f8fafc',
    '#fef2f2',
    '#fff7ed',
    '#fffbeb',
    '#fefce8',
    '#f7fee7',
    '#f0fdf4',
    '#ecfdf5',
    '#f0fdfa',
    '#ecfeff',
    '#f0f9ff',
    '#eff6ff',
    '#eef2ff',
    '#f5f3ff',
    '#faf5ff',
    '#fdf4ff',
    '#fdf2f8',
    '#fff1f2',
  ];

  const doctorListId = useRef([]);

  useEffect(() => {
    const initFetch = async () => {
      try {
        const res = await CalendarService.getListDoctor({ position: 'DOCTOR', branchUuid });
        setListDoctor(res?.data ?? []);
        doctorListId.current = res.data.map((i, index) => {
          const randomColor =
            'rgb(' +
            (Math.floor(Math.random() * 56) + 200) +
            ', ' +
            (Math.floor(Math.random() * 56) + 200) +
            ', ' +
            (Math.floor(Math.random() * 56) + 200) +
            ')';
          return {
            id: i?.id,
            backgroundColor: index < backgroundColorForDoctor.length ? backgroundColorForDoctor[index] : randomColor,
          };
        });
      } catch (error) {
        return error;
      }
    };
    initFetch();

    // const groupBtn = document.getElementsByClassName('rbc-btn-group');
    // console.log(groupBtn);
    // const groupBtnLeft = groupBtn[0]?.childNodes;
    // const groupBtnRight = groupBtn[1]?.childNodes;

    // groupBtn[0].style = 'display: flex; align-items: center;';
    // groupBtn[1].style = 'display: flex; align-items: center;';
    // groupBtnLeft[0].style =
    //   'width: 101px; height: 44px; border: 1px solid #EE4055;border-radius: 8px; color: #EE4055; display:flex; justify-content: center; align-items: center; margin-left: 20px; order: 3;';
    // groupBtnLeft[0].innerText = 'Hôm nay';
    // groupBtnLeft[1].style = 'width: 40px; height: 40px; padding: 0 !important; border: none; border-radius: 8px';
    // groupBtnLeft[1].innerHTML =
    //   '<svg width="40" height="40" class="rounded-l-lg" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="#F3F4F6"/><path d="M23 26L17 20L23 14" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    // groupBtnLeft[2].style = 'width: 40px; height: 40px; padding: 0 !important; border: none; border-radius: 8px';
    // groupBtnLeft[2].innerHTML =
    //   '<svg width="40" class="rounded-r-lg" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" fill="#F3F4F6"/><path d="M17 14L23 20L17 26" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    // groupBtnRight[0].style =
    //   'order: 4; width: 85px ; height: 44px; border-top-right-radius: 8px;  border-bottom-right-radius: 8px; border-top-left-radius: 0px;  border-bottom-left-radius: 0px;';
    // groupBtnRight[0].innerText = 'Tháng';

    // groupBtnRight[1].style = 'order: 3; width: 85px ; height: 44px;';
    // groupBtnRight[1].innerText = 'Tuần';

    // groupBtnRight[2].style = 'order: 2; width: 85px ; height: 44px;';
    // groupBtnRight[2].innerText = 'Ngày';

    // groupBtnRight[3].style =
    //   'order: 1; width: 44px; height: 44px; border-top-left-radius: 8px;  border-bottom-left-radius: 8px;';
    // groupBtnRight[3].innerHTML =
    //   '<svg width="19" class="ml-[-3px]" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.25 3C0.25 3.59674 0.487053 4.16903 0.90901 4.59099C1.33097 5.01295 1.90326 5.25 2.5 5.25C3.09674 5.25 3.66903 5.01295 4.09099 4.59099C4.51295 4.16903 4.75 3.59674 4.75 3C4.75 2.40326 4.51295 1.83097 4.09099 1.40901C3.66903 0.987053 3.09674 0.75 2.5 0.75C1.90326 0.75 1.33097 0.987053 0.90901 1.40901C0.487053 1.83097 0.25 2.40326 0.25 3ZM7 1.5H19V4.5H7V1.5ZM0.25 9C0.25 9.59674 0.487053 10.169 0.90901 10.591C1.33097 11.0129 1.90326 11.25 2.5 11.25C3.09674 11.25 3.66903 11.0129 4.09099 10.591C4.51295 10.169 4.75 9.59674 4.75 9C4.75 8.40326 4.51295 7.83097 4.09099 7.40901C3.66903 6.98705 3.09674 6.75 2.5 6.75C1.90326 6.75 1.33097 6.98705 0.90901 7.40901C0.487053 7.83097 0.25 8.40326 0.25 9ZM7 7.5H19V10.5H7V7.5ZM0.25 15C0.25 15.5967 0.487053 16.169 0.90901 16.591C1.33097 17.0129 1.90326 17.25 2.5 17.25C3.09674 17.25 3.66903 17.0129 4.09099 16.591C4.51295 16.169 4.75 15.5967 4.75 15C4.75 14.4033 4.51295 13.831 4.09099 13.409C3.66903 12.9871 3.09674 12.75 2.5 12.75C1.90326 12.75 1.33097 12.9871 0.90901 13.409C0.487053 13.831 0.25 14.4033 0.25 15ZM7 13.5H19V16.5H7V13.5Z" fill="#4B5563"  /></svg>';
  }, []);

  const [handleOpenModal, AddCalenderModal] = CreateCalendar({ setShowModal, showModal, uuidRequest });
  const handleClick = (data) => {
    setShowModal(true);
    handleOpenModal(true, data);
  };
  const customBgEvent = (event, start, end, isSelected) => {
    return {
      style: {
        backgroundColor: event?.backgroundDoctorColor ?? 'transparent',
        color: 'black',
        borderRadius: '8px',
        border: '1px solid #E5E7EB',
        // boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        opacity: 1,
        // display: 'block',
        // width: '100%',
        // height: '100%',
        padding: '0px',
        margin: '0px',
        // fontSize: '14px',
        // fontWeight: '500',
        // lineHeight: '20px',
        // textAlign: 'left',
        cursor: 'pointer',
      },
    };
  };

  function CustomEventWrapper({ children, event, ...rest }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [height, setHeight] = useState(0);

    const handleExpandClick = () => {
      setIsExpanded(!isExpanded);
    };
    const styleElement = {
      ...children.props.style,
      minHeight: '40px',
      width: 'max-content',
    };
    const clonedElementRef = useRef(null);
    useEffect(() => {
      if (clonedElementRef.current) {
        setHeight(clonedElementRef.current.getBoundingClientRect().height ?? 0);
      }
    }, [clonedElementRef]);

    if (isExpanded) {
      if (height < 96) {
        styleElement.height = 'max-content';
        styleElement.zIndex = 9;
      }
    }

    return (
      <div style={{ height: '105px', width: '120px' }} onClick={handleExpandClick}>
        {React.Children.map(children, (child) => {
          return React.cloneElement(child, { style: { ...styleElement }, ref: clonedElementRef });
        })}
      </div>
    );
  }
  function CustomCpontainerWrapper({ children, event, ...rest }) {
    return <>{children}</>;
  }

  const TimeSlot = (props, listDoctorId, day, isRender) => {
    if (listDoctorId.find((i) => i?.id === props?.resource)) {
      return React.cloneElement(props.children, {
        style: { backgroundColor: listDoctorId.find((i) => i?.id === props?.resource)?.backgroundColor },
        'data-time': moment(props.value).format('HH:mm'),
      });
    } else
      return React.cloneElement(props.children, {
        style: { backgroundColor: 'white' },
        'data-time': moment(props.value).format('HH:mm'),
      });
  };

  const { components, defaultDate } = useMemo(
    () => ({
      components: {
        eventWrapper: CustomEventWrapper,
        eventContainerWrapper: CustomCpontainerWrapper,
        event: Event,
        // custom background color for doctor header title
        timeSlotWrapper: (props) => {
          return TimeSlot(props, doctorListId.current);
        },

        toolbar: CustomScheduleToolbar,

        day: {
          // header: MyDayHeader,
          event: MyDayEvent,
        },
        week: {
          // header: MyWeekHeader,
          event: MyWeekEvent,
        },
        month: {
          // header: MyMonthHeader,
          // dateHeader: MyMonthEvent,
          event: MyMonthEvent,
        },
      },
    }),
    [],
  );

  const handleFilter = (filter) => {
    setFilter({ ...filter });
  };

  const handleChangeDoctor = (doctorId) => {
    handleFilter({ ...filter, doctorId });
  };

  const handleChangeStatus = (status) => {
    // setFilter({ ...filter, status });
    handleFilter({ ...filter, status });
  };

  const handleChangeType = (type) => {
    handleFilter({ ...filter, type });
  };

  const doctorNameMap = listDoctor?.map((i) => ({ resourceId: i?.id, resourceTitle: i?.firstName })) ?? [];

  // change height timeSlot
  const slotGroupPropGetter = useCallback(
    () => ({
      style: {
        minHeight: 100,
      },
    }),
    [],
  );

  return (
    <Fragment>
      <div className="bg-white rounded-[10px] " id="appointment-schedule">
        <div className="px-3 py-3 border-b border-blue-50">
          <h2 className="text-base lg:text-lg font-semibold pb-1">{'Quản lý lịch hẹn'.toUpperCase()}</h2>
        </div>

        <div className="px-4 py-4 flex justify-between items-center">
          <div className="relative h-[44px] w-[434px]">
            <Input
              placeholder="Tìm kiếm"
              className=" relative !bg-white border border-gray-300 h-[44px] w-full  rounded-[10px] px-3 focus:!shadow-none focus:!outline-none"
            />
            <span className="absolute right-4 top-2.5">
              {' '}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M14.25 2.25C10.1162 2.25 6.75 5.61621 6.75 9.75C6.75 11.5459 7.37988 13.1924 8.4375 14.4844L2.46094 20.4609L3.53906 21.5391L9.51562 15.5625C10.8076 16.6201 12.4541 17.25 14.25 17.25C18.3838 17.25 21.75 13.8838 21.75 9.75C21.75 5.61621 18.3838 2.25 14.25 2.25ZM14.25 3.75C17.5723 3.75 20.25 6.42773 20.25 9.75C20.25 13.0723 17.5723 15.75 14.25 15.75C10.9277 15.75 8.25 13.0723 8.25 9.75C8.25 6.42773 10.9277 3.75 14.25 3.75Z"
                  fill="#6B7280"
                />
              </svg>
            </span>
          </div>

          <div className="flex items-center">
            {/* <button className='h-[40px] w-[131px] border rounded-[8px] border-rose-500 text-rose-500 flex justify-center items-center '><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 14C20.7348 14 20.4804 14.1054 20.2929 14.2929C20.1054 14.4804 20 14.7348 20 15V19C20 19.2652 19.8946 19.5196 19.7071 19.7071C19.5196 19.8946 19.2652 20 19 20H5C4.73478 20 4.48043 19.8946 4.29289 19.7071C4.10536 19.5196 4 19.2652 4 19V15C4 14.7348 3.89464 14.4804 3.70711 14.2929C3.51957 14.1054 3.26522 14 3 14C2.73478 14 2.48043 14.1054 2.29289 14.2929C2.10536 14.4804 2 14.7348 2 15V19C2 19.7956 2.31607 20.5587 2.87868 21.1213C3.44129 21.6839 4.20435 22 5 22H19C19.7956 22 20.5587 21.6839 21.1213 21.1213C21.6839 20.5587 22 19.7956 22 19V15C22 14.7348 21.8946 14.4804 21.7071 14.2929C21.5196 14.1054 21.2652 14 21 14ZM11.29 15.71C11.3851 15.801 11.4972 15.8724 11.62 15.92C11.7397 15.9729 11.8691 16.0002 12 16.0002C12.1309 16.0002 12.2603 15.9729 12.38 15.92C12.5028 15.8724 12.6149 15.801 12.71 15.71L16.71 11.71C16.8983 11.5217 17.0041 11.2663 17.0041 11C17.0041 10.7337 16.8983 10.4783 16.71 10.29C16.5217 10.1017 16.2663 9.99591 16 9.99591C15.7337 9.99591 15.4783 10.1017 15.29 10.29L13 12.59V3C13 2.73478 12.8946 2.48043 12.7071 2.29289C12.5196 2.10536 12.2652 2 12 2C11.7348 2 11.4804 2.10536 11.2929 2.29289C11.1054 2.48043 11 2.73478 11 3V12.59L8.71 10.29C8.61676 10.1968 8.50607 10.1228 8.38425 10.0723C8.26243 10.0219 8.13186 9.99591 8 9.99591C7.86814 9.99591 7.73757 10.0219 7.61575 10.0723C7.49393 10.1228 7.38324 10.1968 7.29 10.29C7.19676 10.3832 7.1228 10.4939 7.07234 10.6158C7.02188 10.7376 6.99591 10.8681 6.99591 11C6.99591 11.1319 7.02188 11.2624 7.07234 11.3842C7.1228 11.5061 7.19676 11.6168 7.29 11.71L11.29 15.71Z" fill="#EE4055" />
            </svg>
              <span className='ml-[10px]'>  Xuất file</span>
            </button> */}
            <button
              onClick={() => setShowModal(true)}
              className="h-[40px] w-[131px] ml-4 border rounded-[8px] bg-rose-500 text-white flex justify-center items-center "
            >
              {' '}
              <i className="las la-plus bold"></i>
              <span className="ml-[10px]"> Thêm mới </span>
            </button>
          </div>
        </div>
        <div className="border border-gray-200">
          <h3 className="text-base font-normal border-b border-gray-200 px-3 py-2">Bộ lọc</h3>
          <div className="p-3">
            <h4 className="text-gray-500 text-sm mb-1">Bác sĩ:</h4>
            <Select
              allowClear
              className="w-full !rounded-lg  text-sm font-normal"
              placeholder="Chọn bác sĩ"
              onChange={handleChangeDoctor}
            >
              {listDoctor?.map((i, idx) => (
                <Select.Option key={idx} className="w-full" value={i.id}>
                  {i.lastName + ' ' + i.firstName}
                </Select.Option>
              ))}
            </Select>
            <div className="flex justify-between">
              <div className="gap-2 items-center content-center mt-2">
                <h4 className="text-gray-500 text-sm mb-1 mt-3">Trạng thái: </h4>
                <div className="flex gap-2">
                  <button
                    className={`px-2 h-9 rounded-lg ${!filter.status ? 'btn-active' : 'btn-non-active'}`}
                    onClick={() => handleChangeStatus('')}
                  >
                    Tất cả
                  </button>
                  <button
                    className={`px-2 h-9 rounded-lg ${filter.status === 'COMING' ? 'btn-active' : 'btn-non-active'}`}
                    onClick={() => handleChangeStatus('COMING')}
                  >
                    Đang đến
                  </button>
                  <button
                    className={`px-2 h-9 rounded-lg ${filter.status === 'CAME' ? 'btn-active' : 'btn-non-active'}`}
                    onClick={() => handleChangeStatus('CAME')}
                  >
                    Đã đến
                  </button>
                  <button
                    className={`px-2 h-9 rounded-lg ${filter.status === 'CANCEL' ? 'btn-active' : 'btn-non-active'}`}
                    onClick={() => handleChangeStatus('CANCEL')}
                  >
                    Hủy hẹn
                  </button>
                  <button
                    className={`px-2 h-9 rounded-lg ${filter.status === 'DELAY' ? 'btn-active' : 'btn-non-active'}`}
                    onClick={() => handleChangeStatus('DELAY')}
                  >
                    Trễ hẹn
                  </button>
                  <button
                    className={`px-2 h-9 rounded-lg ${filter.status === 'NOT_COME' ? 'btn-active' : 'btn-non-active'}`}
                    onClick={() => handleChangeStatus('NOT_COME')}
                  >
                    Không đến
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <h4 className="text-gray-500 text-sm mb-1 mt-3">Loại khách:</h4>
                <div className="flex gap-2">
                  <button
                    className={`px-2 h-9 rounded-lg ${!filter.type ? 'btn-active' : 'btn-non-active'}`}
                    onClick={() => handleChangeType('')}
                  >
                    Tất cả
                  </button>
                  <button
                    className={`px-2 h-9 rounded-lg ${
                      filter.type === 'RE_EXAMINATION' ? 'btn-active' : 'btn-non-active'
                    }`}
                    onClick={() => handleChangeType('RE_EXAMINATION')}
                  >
                    Tái khám
                  </button>
                  <button
                    className={`px-2 h-9 rounded-lg ${filter.type === 'NEW' ? 'btn-active' : 'btn-non-active'}`}
                    onClick={() => handleChangeType('NEW')}
                  >
                    Khách mới
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="col-span-4 p-3 border border-gray-200">
            <Calendar
              // key={filter.status} add key to rerender when updated
              dayLayoutAlgorithm="no-overlap"
              // dayLayoutAlgorithm={(params) => {
              //   console.log('params: ', params);
              //   return overlap({ ...params, minimumStartDifference: 15 })
              // }}
              selectable
              localizer={localizer}
              events={listEventsFilter
                .filter((i) => (filter?.doctorId ? i?.doctor?.id === filter?.doctorId : true))
                .filter((i) => (filter?.status ? i?.status === filter?.status : true))
                .filter((i) => (filter?.type ? i?.customerType === filter?.type : true))
                .map((i) => {
                  return {
                    title: i.status,
                    backgroundDoctorColor: doctorListId.current.find((j) => j?.id === i?.doctor?.id)?.backgroundColor,
                    id: i.id,
                    start: new Date(i.eventTime),
                    end: changeDate(i.eventTime, i.estTime),
                    data: i,
                    uuid: i.uuid,
                    arrEvent: listEventsFilter,
                    resourceId: i?.doctor?.id,
                    click: handleClick,
                  };
                })}
              drilldownView="agenda"
              components={components}
              defaultDate={defaultDate}
              culture="vi"
              startAccessor="start"
              endAccessor="end"
              defaultView={Views.DAY}
              // defaultDate={new Date()}
              style={{ height: '80vh' }}
              // views={{ day: true }}
              // onSelectEvent={handleClick}
              // onNavigate={async (date) => await console.log(date)}
              // popup={true}
              // showMore={true}
              messages={{
                showMore: (total) => '+' + total + ' ' + t('components.calendar.more'),
              }}
              min={new Date(date.getFullYear(), date.getMonth(), date.getDate(), 7, 0, 0)}
              max={new Date(date.getFullYear(), date.getMonth(), date.getDate(), 21, 0, 0)}
              // Doctor header title in date view
              resourceIdAccessor="resourceId"
              resources={doctorNameMap.filter((i) => (filter?.doctorId ? i.resourceId === filter?.doctorId : true))}
              resourceTitleAccessor={(event) => {
                return event.resourceTitle;
              }}
              resourceAccessor={(event) => {
                return event.resourceId;
              }}
              eventPropGetter={customBgEvent}
              slotGroupPropGetter={slotGroupPropGetter}
            />
          </div>
        </div>
        <div></div>
      </div>
      {AddCalenderModal()}
    </Fragment>
  );
};
export default Page;
