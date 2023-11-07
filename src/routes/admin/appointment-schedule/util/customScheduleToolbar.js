import { DatePicker } from 'antd';
import classNames from 'classnames';
import React, { useState } from 'react';

export const CustomScheduleToolbar = (props) => {
  // console.log(new Date('2022-03-25'));
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '10px',
        fontSize: '16px',
        gap: '10px',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
        <button
          onClick={() => {
            props.onNavigate('TODAY');
          }}
          style={{
            border: '1px solid #EE4055',
            borderRadius: '8px',
            color: '#EE4055',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            order: '2',
            marginLeft: '20px',
          }}
          className="px-4 py-2 bg-white shadow-sm hover:bg-rose-500 hover:!text-white"
        >
          Hôm nay
        </button>
        <span className="inline-flex items-center rounded-lg shadow-sm order-1">
          <button
            onClick={() => {
              props.onNavigate('PREV');
            }}
            className=" text-[#4B5563] bg-white border border-gray-200 rounded-l-lg hover:text-rose-500 hover:bg-gray-100"
          >
            <svg
              width="36"
              height="36"
              className="rounded-l-lg"
              viewBox="0 0 40 38"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="36" height="36"></rect>
              <path
                d="M23 26L17 20L23 14"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </button>
          <button
            onClick={() => {
              props.onNavigate('NEXT');
            }}
            className="text-[#4B5563] bg-white border-r border-y border-gray-200 rounded-r-lg hover:text-rose-500 hover:bg-gray-100"
          >
            <svg
              width="36"
              className="rounded-r-lg"
              height="36"
              viewBox="0 0 40 38"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="36" height="36"></rect>
              <path
                d="M17 14L23 20L17 26"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </button>
        </span>
      </span>
      <span style={{ flexGrow: 1, padding: '0 10px', textAlign: 'center', width: 'min-content' }}>
        <span className="relative">
          <button
            onClick={() => {
              if (open) setOpen(false);
              if (!open) setOpen(true);
            }}
            onBlurCapture={() => {
              if (open) setOpen(false);
            }}
            className=" hover:text-rose-500 "
          >
            {props.label}
          </button>
          <DatePicker
            placement="bottomRight"
            open={open}
            picker={props.view === 'month' ? props.view : 'date'}
            className={classNames('!w-0 !h-0 opacity-0 absolute bottom-[11%] left-48')}
            onSelect={(date) => {
              props.onNavigate('DATE', date.toDate());
              setOpen(false);
            }}
          />
        </span>
      </span>

      <span className="inline-flex items-center rounded-lg shadow-sm">
        <button
          onClick={() => {
            props.onView('agenda');
          }}
          className={classNames(
            'px-4 py-[9px] text-[#4B5563] bg-white border border-[#ccc] rounded-l-lg hover:text-rose-500 hover:bg-gray-100',
            {
              '!bg-rose-500 text-white hover:bg-rose-500 hover:text-white !border-rose-500': props.view === 'agenda',
              '!border-r-transparent': props.view === 'day',
            },
          )}
        >
          <svg
            className="ml-[-3px] fill-current"
            width="19"
            height="18"
            viewBox="0 0 19 18"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0.25 3C0.25 3.59674 0.487053 4.16903 0.90901 4.59099C1.33097 5.01295 1.90326 5.25 2.5 5.25C3.09674 5.25 3.66903 5.01295 4.09099 4.59099C4.51295 4.16903 4.75 3.59674 4.75 3C4.75 2.40326 4.51295 1.83097 4.09099 1.40901C3.66903 0.987053 3.09674 0.75 2.5 0.75C1.90326 0.75 1.33097 0.987053 0.90901 1.40901C0.487053 1.83097 0.25 2.40326 0.25 3ZM7 1.5H19V4.5H7V1.5ZM0.25 9C0.25 9.59674 0.487053 10.169 0.90901 10.591C1.33097 11.0129 1.90326 11.25 2.5 11.25C3.09674 11.25 3.66903 11.0129 4.09099 10.591C4.51295 10.169 4.75 9.59674 4.75 9C4.75 8.40326 4.51295 7.83097 4.09099 7.40901C3.66903 6.98705 3.09674 6.75 2.5 6.75C1.90326 6.75 1.33097 6.98705 0.90901 7.40901C0.487053 7.83097 0.25 8.40326 0.25 9ZM7 7.5H19V10.5H7V7.5ZM0.25 15C0.25 15.5967 0.487053 16.169 0.90901 16.591C1.33097 17.0129 1.90326 17.25 2.5 17.25C3.09674 17.25 3.66903 17.0129 4.09099 16.591C4.51295 16.169 4.75 15.5967 4.75 15C4.75 14.4033 4.51295 13.831 4.09099 13.409C3.66903 12.9871 3.09674 12.75 2.5 12.75C1.90326 12.75 1.33097 12.9871 0.90901 13.409C0.487053 13.831 0.25 14.4033 0.25 15ZM7 13.5H19V16.5H7V13.5Z"></path>
          </svg>
        </button>
        <button
          onClick={() => {
            props.onView('day');
          }}
          className={classNames(
            'px-4 py-2 bg-white border-t border-b border-r border-[#ccc] hover:bg-gray-100 hover:text-rose-500',
            {
              '!bg-rose-500 text-white hover:bg-rose-500 hover:text-white !border-r-rose-500 border-y-rose-500 ':
                props.view === 'day',
              '!border-r-transparent': props.view === 'week',
            },
          )}
        >
          Ngày
        </button>
        <button
          onClick={() => {
            props.onView('week');
          }}
          className={classNames(
            'px-4 py-2 bg-white border-y border-r border-[#ccc] hover:bg-gray-100 hover:text-rose-500',
            {
              '!bg-rose-500 text-white hover:bg-rose-500 hover:text-white !border-rose-500': props.view === 'week',
              '!border-r-transparent': props.view === 'month',
            },
          )}
          style={props.view === 'day' ? { borderLeft: '1px white' } : {}}
        >
          Tuần
        </button>
        <button
          onClick={() => {
            props.onView('month');
          }}
          className={classNames(
            'px-4 py-2 bg-white border-y border-r border-[#ccc] rounded-r-lg hover:bg-gray-100 hover:text-rose-500',
            {
              '!bg-rose-500 text-white hover:bg-rose-500 hover:text-white !border-rose-500': props.view === 'month',
            },
          )}
        >
          Tháng
        </button>
      </span>
    </div>
  );
};

// previous schedule tooolbar
//       <div
//         style={{
//           display: 'flex',
//           flexWrap: 'wrap',
//           justifyContent: 'center',
//           alignItems: 'center',
//           marginBottom: '10px',
//           fontSize: '16px',
//         }}
//       >
//         <span
//           style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}
//         >
//           <button
//             onClick={() => {props.onNavigate('DATE', new Date("2022-03-25"))}}
//             type="button"
//             style={{ width: '101px', height: '44px', border: '1px solid #EE4055', borderRadius: '8px', color: '#EE4055', display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '20px', order: '3' }}
//           >
//             Hôm nay
//           </button>
//           <button
//             type="button"
//             style={{ width: '40px', height: '40px', border: 'none', borderRadius: '8px', padding: '0px !important' }}
//           >
//             <svg
//               width="40"
//               height="40"
//               className="rounded-l-lg"
//               viewBox="0 0 40 40"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <rect width="40" height="40" fill="#F3F4F6"></rect>
//               <path
//                 d="M23 26L17 20L23 14"
//                 stroke="black"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               ></path>
//             </svg>
//           </button>
//           <button
//             type="button"
//             style={{ width: '40px', height: '40px', border: 'none', borderRadius: '8px', padding: '0px !important' }}
//           >
//             <svg
//               width="40"
//               className="rounded-r-lg"
//               height="40"
//               viewBox="0 0 40 40"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <rect width="40" height="40" fill="#F3F4F6"></rect>
//               <path
//                 d="M17 14L23 20L17 26"
//                 stroke="black"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               ></path>
//             </svg>
//           </button>
//         </span>
//         <span style={{ flexGrow: 1, padding: '0 10px', textAlign: 'center' }}
//         >
//           {props.label}
//         </span>
//         <span className="rbc-btn-group" style={{ display: 'flex', alignItems: 'center' }}
//         >
//           <button onClick={() => {props.onView('month')}} type="button" style={{ order: '4', width: '85px', height: '44px', borderRadius: '0px 8px 8px 0px' }}
//           >
//             Tháng
//           </button>
//           <button onClick={() => {props.onView('week')}} type="button" style={{ order: '3', width: '85px', height: '44px' }}
//           >
//             Tuần
//           </button>
//           <button onClick={() => {props.onView('day')}} type="button" className="rbc-active" style={{ order: '2', width: '85px', height: '44px' }}
//           >
//             Ngày
//           </button>
//           <button
//             onClick={() => {props.onView('agenda')}}
//             type="button"
//             style={{ order: '1', width: '44px', height: '44px', borderRadius: '8px 0px 0px 8px' }}
//           >
//             <svg
//               width="19"
//               className="ml-[-3px]"
//               height="18"
//               viewBox="0 0 19 18"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 d="M0.25 3C0.25 3.59674 0.487053 4.16903 0.90901 4.59099C1.33097 5.01295 1.90326 5.25 2.5 5.25C3.09674 5.25 3.66903 5.01295 4.09099 4.59099C4.51295 4.16903 4.75 3.59674 4.75 3C4.75 2.40326 4.51295 1.83097 4.09099 1.40901C3.66903 0.987053 3.09674 0.75 2.5 0.75C1.90326 0.75 1.33097 0.987053 0.90901 1.40901C0.487053 1.83097 0.25 2.40326 0.25 3ZM7 1.5H19V4.5H7V1.5ZM0.25 9C0.25 9.59674 0.487053 10.169 0.90901 10.591C1.33097 11.0129 1.90326 11.25 2.5 11.25C3.09674 11.25 3.66903 11.0129 4.09099 10.591C4.51295 10.169 4.75 9.59674 4.75 9C4.75 8.40326 4.51295 7.83097 4.09099 7.40901C3.66903 6.98705 3.09674 6.75 2.5 6.75C1.90326 6.75 1.33097 6.98705 0.90901 7.40901C0.487053 7.83097 0.25 8.40326 0.25 9ZM7 7.5H19V10.5H7V7.5ZM0.25 15C0.25 15.5967 0.487053 16.169 0.90901 16.591C1.33097 17.0129 1.90326 17.25 2.5 17.25C3.09674 17.25 3.66903 17.0129 4.09099 16.591C4.51295 16.169 4.75 15.5967 4.75 15C4.75 14.4033 4.51295 13.831 4.09099 13.409C3.66903 12.9871 3.09674 12.75 2.5 12.75C1.90326 12.75 1.33097 12.9871 0.90901 13.409C0.487053 13.831 0.25 14.4033 0.25 15ZM7 13.5H19V16.5H7V13.5Z"
//                 fill="#4B5563"
//               ></path>
//             </svg>
//           </button>
//         </span>
//       </div>
