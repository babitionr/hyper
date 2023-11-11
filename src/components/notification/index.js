import React, { useEffect, useState } from 'react';
import { Popover, Select, Badge, Avatar } from 'antd';
import './index.less';
import moment from 'moment';
import { NotificationService } from 'services/notification';
import { onMessageListener } from 'firebaseInit';
import { useAuth } from 'global';
import avatar from 'assets/images/imageAva.png';
import classNames from 'classnames';

const NotificationMenu = ({ getNotifiList }) => {
  const [notiList, setNotiList] = useState([]);
  const [filters, setFilters] = useState('All');

  const init = async () => {
    const res = await NotificationService.getAllNoti();
    const data = res?.content ?? [];
    setNotiList(
      data.map((e, index) => {
        return { ...e };
      }),
    );
  };
  const { changeNotifiMenu, openNotifiMenu } = useAuth();

  // const onClick = useCallback((e) => {
  //   if (e.isRead) {
  //   setNotiList(notiList.map((item, index) => {
  //     console.log(item);
  //     return item.id !== e.id ? item : { ...item, isRead: false }
  //   }));
  // }
  // })

  const markAllAsRead = async () => {
    const data = await NotificationService.markAllAsRead();
    if (data) {
      init();
    }
  };

  const markAsRead = async (id) => {
    const data = await NotificationService.markAsRead({ id });
    if (data) {
      setNotiList(
        notiList.map((item, index) => {
          return item.id !== id ? item : { ...item, isRead: true };
        }),
      );
    }
  };

  const content = (
    <div className="  !w-full" style={{ position: 'fix' }}>
      <div className="flow-root">
        <div className="no-scrollbar divide-solid divide-y divide-gray-200 dark:divide-gray-700 h-96 overflow-scroll overflow-x-hidden !relative ">
          {notiList
            .filter((ele) => (filters === 'All' ? ele : filters === 'isRead' ? ele.isRead : !ele.isRead))
            .map((e, index) => {
              return (
                <div
                  className={classNames(' px-3 flex  space-x-4 py-3 sm:py-4 hover:bg-gray-200 hover:cursor-pointer', {
                    'bg-gray-100': !e.isRead,
                  })}
                  key={e.id}
                  onClick={() => {
                    if (!e.isRead) {
                      // setNotiList(notiList.map((item, index) => {
                      //   return item.id !== e.id ? item : { ...item, isRead: false }
                      // }));
                      markAsRead(e.id);
                    }
                    window.open(e?.urlRedirect, '_blank', 'noreferrer');
                  }}
                >
                  <div className=" flex-shrink">
                    <img className=" w-8 h-8 rounded-full" src={e.imageURL ?? avatar} alt="avatar" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate dark:text-white mb-2 mt-1">{e.subject}</p>
                    <p className="mb-3 text-sm font-normal">{e.contents}</p>

                    <p className=" text-sm font-medium text-[#A5ACB8]">{moment(e?.createdAt + 'Z').fromNow()}</p>
                  </div>
                </div>
              );
            })}
          {/* <div className="flex items-center space-x-4 py-3 sm:py-4">
            <div className="flex-shrink">
              <img
                className="w-8 h-8 rounded-full"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8&w=1000&q=80"
                alt="Neil image"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate dark:text-white">Neil Sims</p>
              <p className="mb-3 text-gray-500 dark:text-gray-400">
                Empower Developers, IT Ops, and business teams to collaborate at high velocity. Respond to changes and
                deliver great customer and employee service experiences fast.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4 py-3 sm:py-4">
            <div className="flex-shrink">
              <img
                className="w-8 h-8 rounded-full"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8&w=1000&q=80"
                alt="Neil image"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate dark:text-white">Neil Sims</p>
              <p className="mb-3 text-gray-500 dark:text-gray-400">
                Empower Developers, IT Ops, and business teams to collaborate at high velocity. Respond to changes and
                deliver great customer and employee service experiences fast.
              </p>
            </div>
          </div> */}
        </div>

        {/* <ul
          role="list"
          className="no-scrollbar divide-solid divide-y divide-gray-200 dark:divide-gray-700 h-96 overflow-scroll overflow-x-hidden !relative "
        >
          <li className="py-3 sm:py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink">
                <img
                  className="w-8 h-8 rounded-full"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8&w=1000&q=80"
                  alt="Neil image"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">Neil Sims</p>
                <p className="mb-3 text-gray-500 dark:text-gray-400">
                  Empower Developers, IT Ops, and business teams to collaborate at high velocity. Respond to changes and
                  deliver great customer and employee service experiences fast.
                </p>
              </div>
            </div>
          </li>
          <li className="py-3 sm:py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <img
                  className="w-8 h-8 rounded-full"
                  src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8&w=1000&q=80"
                  alt="Bonnie image"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">Bonnie Green</p>
                <p className="text-sm text-gray-500 truncate dark:text-gray-400">email@windster.com</p>
              </div>
            </div>
          </li>
          <li className="py-3 sm:py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <img
                  className="w-8 h-8 rounded-full"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8&w=1000&q=80"
                  alt="Michael image"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">Michael Gough</p>
                <p className="text-sm text-gray-500 truncate dark:text-gray-400">email@windster.com</p>
              </div>
            </div>
          </li>
          <li className="py-3 sm:py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <img
                  className="w-8 h-8 rounded-full"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8&w=1000&q=80"
                  alt="Lana image"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">Lana Byrd</p>
                <p className="text-sm text-gray-500 truncate dark:text-gray-400">email@windster.com</p>
              </div>
            </div>
          </li>
          <li className="pt-3 pb-0 sm:pt-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <img
                  className="w-8 h-8 rounded-full"
                  src="/docs/images/people/profile-picture-5.jpg"
                  alt="Thomas image"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">Thomes Lean</p>
                <p className="text-sm text-gray-500 truncate dark:text-gray-400">email@windster.com</p>
              </div>
            </div>
          </li>
          <li className="py-3 sm:py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <img
                  className="w-8 h-8 rounded-full"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8&w=1000&q=80"
                  alt="Neil image"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">Neil Sims</p>
                <p className="mb-3 text-gray-500 dark:text-gray-400">
                  Empower Developers, IT Ops, and business teams to collaborate at high velocity. Respond to changes and
                  deliver great customer and employee service experiences fast.
                </p>
              </div>
            </div>
          </li>
          <li className="py-3 sm:py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <img
                  className="w-8 h-8 rounded-full"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8&w=1000&q=80"
                  alt="Neil image"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">Neil Sims</p>
                <p className="mb-3 text-gray-500 dark:text-gray-400">
                  Empower Developers, IT Ops, and business teams to collaborate at high velocity. Respond to changes and
                  deliver great customer and employee service experiences fast.
                </p>
              </div>
            </div>
          </li>
          <li className="py-3 sm:py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <img
                  className="w-8 h-8 rounded-full"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8&w=1000&q=80"
                  alt="Neil image"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">Neil Sims</p>
                <p className="mb-3 text-gray-500 dark:text-gray-400">
                  Empower Developers, IT Ops, and business teams to collaborate at high velocity. Respond to changes and
                  deliver great customer and employee service experiences fast.
                </p>
              </div>
            </div>
          </li>
          <li className="py-3 sm:py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <img
                  className="w-8 h-8 rounded-full"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8&w=1000&q=80"
                  alt="Neil image"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">Neil Sims</p>
                <p className="mb-3 text-gray-500 dark:text-gray-400">
                  Empower Developers, IT Ops, and business teams to collaborate at high velocity. Respond to changes and
                  deliver great customer and employee service experiences fast.
                </p>
              </div>
            </div>
          </li>
          <li className="py-3 sm:py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <img
                  className="w-8 h-8 rounded-full"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8&w=1000&q=80"
                  alt="Neil image"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">Neil Sims</p>
                <p className="mb-3 text-gray-500 dark:text-gray-400">
                  Empower Developers, IT Ops, and business teams to collaborate at high velocity. Respond to changes and
                  deliver great customer and employee service experiences fast.
                </p>
              </div>
            </div>
          </li>
        </ul> */}
      </div>
    </div>
  );

  useEffect(() => {
    init();
    return () => {
      setNotiList([]);
    };
  }, [onMessageListener]);

  const setNoti = async (e) => {
    try {
      changeNotifiMenu(e);

      if (e) {
        await init();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mr-4 relative flex group">
      <Popover
        content={content}
        arrow={false}
        open={openNotifiMenu}
        trigger="click"
        className="w-96"
        overlayClassName="notification-menu"
        onOpenChange={(e) => setNoti(e)}
        title={() => {
          return (
            <div className="flex items-center justify-between gap-20 !relative z-20 bg-white">
              <div className="flex gap-2 items-center">
                <div className="text-sm font-normal">Notifications</div>
                <Select
                  className="w-full"
                  defaultValue={filters}
                  showArrow={false}
                  onChange={setFilters}
                  style={{
                    width: 150,
                  }}
                  options={[
                    {
                      value: 'All',
                      label: 'Tất cả',
                    },
                    {
                      value: 'isRead',
                      label: 'Đã xem',
                    },
                    {
                      value: false,
                      label: 'Chưa xem',
                    },
                  ]}
                >
                  <Select.Option value="All">Tất cả</Select.Option>
                  <Select.Option value="isRead">Đã xem</Select.Option>
                  <Select.Option value={false}>Chưa xem</Select.Option>
                </Select>
              </div>
              <button
                className="text-sm font-normal"
                onClick={() => {
                  markAllAsRead();
                }}
              >
                Đánh dấu tất cả là đã đọc <i className="las la-check-circle"></i>
              </button>
            </div>
          );
        }}
      >
        <button className="!w-full mr-1 flex">
          {/* <div className="rounded-full text-white w-5 h-5 bg-red-500 absolute -right-1.5 -top-1.5 leading-none text-center pt-1 text-xs group-hover:animate-bounce">
            11
          </div> */}
          <Avatar className="las la-bell text-2xl text-gray-500" />
          {notiList.filter((item) => !item.isRead).length ? (
            <Badge
              count={notiList.filter((item) => !item.isRead).length}
              overflowCount={10}
              className="rounded-full text-white w-5 h-5 bg-red-500 absolute -right-1 -top-1 leading-none text-center pt-2 text-xs"
            ></Badge>
          ) : null}
          {/* <i className="las la-bell text-4xl text-gray-500" /> */}
        </button>
      </Popover>
    </div>
  );
};

export default NotificationMenu;
