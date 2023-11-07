import React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { exportIcons } from 'utils';

export const statusType = (status) => {
  return status === 'CAME'
    ? 'Đã đến'
    : status === 'COMING'
    ? 'Đang đến'
    : status === 'CANCEL'
    ? 'Hủy hẹn'
    : status === 'NOT_COME'
    ? 'Không đến'
    : status === 'DELAY'
    ? 'Trễ hẹn'
    : '';
};

export const MyMonthEvent = (value) => {
  return (
    <div>
      <ul className={classNames('text-sm text-gray-500 mt-[-4px]')}>
        <li className="flex items-center">
          <i className={classNames('h-[8px] w-[8px] rounded-full mr-1 mb-[1px] bg-green-600')}></i>{' '}
          <span className="!text-[12px]">
            Đã đến:{' '}
            {
              value?.event?.arrEvent
                ?.filter(
                  (i) => moment(i.eventTime).format('YYYY-MM-DD') === moment(value.event.start).format('YYYY-MM-DD'),
                )
                ?.filter((i) => i.status === 'CAME')?.length
            }
          </span>
        </li>
        <li className="flex items-center">
          <i className={classNames('h-[8px] w-[8px] rounded-full mr-1 mb-[1px] bg-blue-600')}></i>{' '}
          <span className="!text-[12px]">
            Đang đến:{' '}
            {
              value?.event?.arrEvent
                ?.filter(
                  (i) => moment(i.eventTime).format('YYYY-MM-DD') === moment(value.event.start).format('YYYY-MM-DD'),
                )
                ?.filter((i) => i.status === 'COME')?.length
            }
          </span>
        </li>
        <li className="flex items-center">
          <i className={classNames('h-[8px] w-[8px] rounded-full mr-1 mb-[1px] bg-red-600')}></i>{' '}
          <span className="!text-[12px]">
            Hủy hẹn:{' '}
            {
              value?.event?.arrEvent
                ?.filter(
                  (i) => moment(i.eventTime).format('YYYY-MM-DD') === moment(value.event.start).format('YYYY-MM-DD'),
                )
                ?.filter((i) => i.status === 'CANCEL')?.length
            }
          </span>
        </li>
        <li className="flex items-center">
          <i className={classNames('h-[8px] w-[8px] rounded-full mr-1 mb-[1px] bg-yellow-600')}></i>{' '}
          <span className="!text-[12px]">
            Trễ hẹn:{' '}
            {
              value?.event?.arrEvent
                ?.filter(
                  (i) => moment(i.eventTime).format('YYYY-MM-DD') === moment(value.event.start).format('YYYY-MM-DD'),
                )
                ?.filter((i) => i.status === 'DELAY')?.length
            }
          </span>
        </li>
        <li className="flex items-center">
          <i className={classNames('h-[8px] w-[8px] rounded-full mr-1 mb-[1px] bg-gray-600')}></i>{' '}
          <span className="!text-[12px]">
            Không đến:{' '}
            {
              value?.event?.arrEvent
                ?.filter(
                  (i) => moment(i.eventTime).format('YYYY-MM-DD') === moment(value.event.start).format('YYYY-MM-DD'),
                )
                ?.filter((i) => i.status === 'NOT_COME')?.length
            }
          </span>
        </li>
      </ul>
    </div>
  );
};

export const MyDayEvent = (value) => {
  return (
    <div
      className={classNames('border-l-[5px] p-1 text-xs rounded-lg bg-rose-100 border-rose-400', {
        '!bg-green-50 !border-green-600': value.title === 'CAME',
        '!bg-blue-50 !border-blue-600': value.title === 'COMING',
        '!bg-yellow-50 !border-yellow-600': value.title === 'DELAY',
        '!bg-red-50 !border-red-600': value.title === 'CANCEL',
        '!bg-gray-50 !border-gray-600': value.title === 'NOT_COME',
      })}
    >
      <ul
        className={classNames('text-[10px] flex items-center justify-between', {
          'text-green-600': value.title === 'CAME',
          'text-blue-600': value.title === 'COMING',
          'text-yellow-600': value.title === 'DELAY',
          'text-red-600': value.title === 'CANCEL',
          'text-gray-600': value.title === 'NOT_COME',
        })}
      >
        <li className="flex items-center">
          <i
            className={classNames(' h-[4px] w-[4px] rounded-full mr-1 mb-[0px]', {
              'bg-green-600': value.title === 'CAME',
              'bg-blue-600': value.title === 'COMING',
              'bg-yellow-600': value.title === 'DELAY',
              'bg-red-600': value.title === 'CANCEL',
              'bg-gray-600': value.title === 'NOT_COME',
            })}
          ></i>{' '}
          <span>{statusType(value.title)}</span>
        </li>
        <div className="flex">
          <div
            className={classNames('mr-1', {
              ' text-amber-600': value?.event?.data?.customerType === 'RE_EXAMINATION',
              ' text-purple-600': value?.event?.data?.customerType === 'NEW',
            })}
          >
            {value?.event?.data?.customerType === 'RE_EXAMINATION' ? 'Tái khám' : 'Khách mới'}
          </div>
          <button className="-mt-2" onClick={() => value.event.click(value.event)}>
            {exportIcons('EDIT_CALENDAR')}
          </button>
        </div>
      </ul>
      <div className="mr-4">
        <p className="text-gray-500 mb-1">
          <u>{value?.event?.data?.customer?.fullName}</u>
        </p>
        <p className="text-gray-500 flex items-center">
          <span className="mr-1">{exportIcons('PHONE')}</span>
          {value?.event?.data?.contactNumber}
        </p>
        <p className="text-gray-500 flex items-center">
          <span className="mr-1">{exportIcons('USER')}</span>
          {value?.event?.data?.createdBy}
        </p>
        <p className="text-gray-500 flex items-center">
          <span className="mr-1">{exportIcons('CLOCK')}</span> {moment(value?.event?.start).format('HH:mm')} -{' '}
          {moment(value?.event?.end).format('HH:mm')}
        </p>
      </div>
    </div>
  );
};
export const MyWeekEvent = (value) => {
  return (
    <div
      className={classNames('border-l-[5px] p-1 text-xs rounded-lg bg-rose-100 border-rose-400', {
        '!bg-green-50 !border-green-600': value.title === 'CAME',
        '!bg-blue-50 !border-blue-600': value.title === 'COMING',
        '!bg-yellow-50 !border-yellow-600': value.title === 'DELAY',
        '!bg-red-50 !border-red-600': value.title === 'CANCEL',
        '!bg-gray-50 !border-gray-600': value.title === 'NOT_COME',
      })}
    >
      <ul
        className={classNames('text-[10px] flex items-center justify-between', {
          'text-green-600': value.title === 'CAME',
          'text-blue-600': value.title === 'COMING',
          'text-yellow-600': value.title === 'DELAY',
          'text-red-600': value.title === 'CANCEL',
          'text-gray-600': value.title === 'NOT_COME',
        })}
      >
        <li className="flex items-center">
          <i
            className={classNames(' h-[4px] w-[4px] rounded-full mr-1 mb-[0px]', {
              'bg-green-600': value.title === 'CAME',
              'bg-blue-600': value.title === 'COMING',
              'bg-yellow-600': value.title === 'DELAY',
              'bg-red-600': value.title === 'CANCEL',
              'bg-gray-600': value.title === 'NOT_COME',
            })}
          ></i>{' '}
          <span>{statusType(value.title)}</span>
        </li>
        <div className="flex">
          <div
            className={classNames('mr-1', {
              ' text-amber-600': value?.event?.data?.customerType === 'RE_EXAMINATION',
              ' text-purple-600': value?.event?.data?.customerType === 'NEW',
            })}
          >
            {value?.event?.data?.customerType === 'RE_EXAMINATION' ? 'Tái khám' : 'Khách mới'}
          </div>
          <button className="-mt-2" onClick={() => value.event.click(value.event)}>
            {exportIcons('EDIT_CALENDAR')}
          </button>
        </div>
      </ul>
      <div className="mr-4">
        <p className="text-gray-500 mb-1">
          <u>{value?.event?.data?.customer?.fullName}</u>
        </p>
        <p className="text-gray-500 flex items-center">
          <span className="mr-1">{exportIcons('PHONE')}</span>
          {value?.event?.data?.contactNumber}
        </p>
        <p className="text-gray-500 flex items-center">
          <span className="mr-1">{exportIcons('USER')}</span>
          {value?.event?.data?.createdBy}
        </p>
        <p className="text-gray-500 flex items-center">
          <span className="mr-1">{exportIcons('CLOCK')}</span> {moment(value?.event?.start).format('HH:mm')} -{' '}
          {moment(value?.event?.end).format('HH:mm')}
        </p>
      </div>
    </div>
  );
};
export const Event = (value) => {
  console.log(value);
  return (
    <div
      className={classNames('border-l-[5px] p-1 h-full text-xs rounded-lg bg-rose-100 border-rose-400', {
        '!bg-green-50 !border-green-600': value.title === 'CAME',
        '!bg-blue-50 !border-blue-600': value.title === 'COMING',
        '!bg-yellow-50 !border-yellow-600': value.title === 'DELAY',
        '!bg-red-50 !border-red-600': value.title === 'CANCEL',
        '!bg-gray-50 !border-gray-600': value.title === 'NOT_COME',
      })}
    >
      <ul
        className={classNames('text-[10px] flex items-center justify-between', {
          'text-green-600': value.title === 'CAME',
          'text-blue-600': value.title === 'COMING',
          'text-yellow-600': value.title === 'DELAY',
          'text-red-600': value.title === 'CANCEL',
          'text-gray-600': value.title === 'NOT_COME',
        })}
      >
        <li className="flex items-center">
          <i
            className={classNames(' h-[4px] w-[4px] rounded-full mr-1 mb-[0px]', {
              'bg-green-600': value.title === 'CAME',
              'bg-blue-600': value.title === 'COMING',
              'bg-yellow-600': value.title === 'DELAY',
              'bg-red-600': value.title === 'CANCEL',
              'bg-gray-600': value.title === 'NOT_COME',
            })}
          ></i>{' '}
          <span>{statusType(value.title)}</span>
        </li>
        <div className="flex">
          <div
            className={classNames('mr-1', {
              ' text-amber-600': value?.event?.data?.customerType === 'RE_EXAMINATION',
              ' text-purple-600': value?.event?.data?.customerType === 'NEW',
            })}
          >
            {value?.event?.data?.customerType === 'RE_EXAMINATION' ? 'Tái khám' : 'Khách mới'}
          </div>
          <button className="-mt-2" onClick={() => value.event.click(value.event)}>
            {exportIcons('EDIT_CALENDAR')}
          </button>
        </div>
      </ul>
      <div className="mr-4">
        <p className="text-gray-500 mb-1">
          <u>{value?.event?.data?.customer?.fullName}</u>
        </p>
        <p className="text-gray-500 flex items-center">
          <span className="mr-1">{exportIcons('PHONE')}</span>
          {value?.event?.data?.contactNumber}
        </p>
        <p className="text-gray-500 flex items-center">
          <span className="mr-1">{exportIcons('USER')}</span>
          {value?.event?.data?.createdBy}
        </p>
        <p className="text-gray-500 flex items-center">
          <span className="mr-1">{exportIcons('CLOCK')}</span> {moment(value?.event?.start).format('HH:mm')} -{' '}
          {moment(value?.event?.end).format('HH:mm')}
        </p>
      </div>
    </div>
  );
};
export const Agenda = (value) => {
  return (
    <div
      className={classNames('border-l-[5px] p-1 text-xs rounded-lg', {
        'bg-green-50 border-green-600': value.title === 'CAME',
        'bg-blue-50 border-blue-600': value.title === 'COMING',
        'bg-yellow-50 border-yellow-600': value.title === 'DELAY',
        'bg-red-50 border-red-600': value.title === 'CANCEL',
      })}
    ></div>
  );
};
