import React, { useState, useEffect } from 'react';
import { Dropdown, Avatar, Menu as MenuAnt } from 'antd';
import { useNavigate } from 'react-router';
import classNames from 'classnames';

// import logo from 'assets/images/logo.svg';
// import arrow from 'assets/images/arrow.svg';
import avatar from 'assets/images/imageAva.png';
import { useTranslation } from 'react-i18next';

// import menus from "./menus";
import './index.less';
import { useAuth } from 'global';
import { exportIcons, routerLinks } from 'utils';
// import { Avatar } from 'components';
import Menu from './menu';
import { BranchsService } from 'services/branchs';
import NotificationMenu from 'components/notification';

const Layout = ({ children }) => {
  // menuVertical, permission,
  const { changeLanguage, setBranchUuid } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [listBrand, setlistBrand] = useState([]);
  const [currBrand, setCurrBrand] = useState('');

  const [isCollapsed, set_isCollapsed] = useState(window.innerWidth < 1025);
  const [isDesktop, set_isDesktop] = useState(window.innerWidth > 767);

  // const menuss = (
  //   <MenuAnt
  //     items={listBrand?.map((i) => ({
  //       key: i.uuid,
  //       label: i.branchName,
  //     }))}
  //     onClick={(e) => {
  //       if (e.key === localStorage.getItem('branchUuid')) {
  //         return false;
  //       }
  //       setCurrBrand(e.domEvent.target.textContent);
  //       setBranchUuid(e.key);
  //       window.location.reload();
  //     }}
  //     selectedKeys={localStorage.getItem('branchUuid')}
  //   />
  // );
  const a = listBrand?.map((i) => ({
    key: i.uuid,
    label: (
      <div
        onClick={(e) => {
          console.log(e.key);
          if (e.key === localStorage.getItem('branchUuid')) {
            return false;
          }
          setCurrBrand(e.domEvent.target.textContent);
          setBranchUuid(e.key);
          window.location.reload();
        }}
        selectedKeys={localStorage.getItem('branchUuid')}
      >
        {i.branchName}
      </div>
    ),
  }));
  const menu2 = {
    items: a,
  };

  // console.log(menu2);
  useEffect(() => {
    if (window.innerWidth < 1024 && !isCollapsed) {
      setTimeout(() => {
        set_isCollapsed(true);
      });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });

    function handleResize() {
      if (window.innerWidth < 1025 && !isCollapsed) {
        set_isCollapsed(true);
      }
      if (window.innerWidth > 767 && !isDesktop) {
        set_isDesktop(true);
      } else if (window.innerWidth <= 767 && isDesktop) {
        set_isDesktop(false);
      }
    }
    window.addEventListener('resize', handleResize, true);
    changeLanguage('vi');

    return () => window.removeEventListener('resize', handleResize, true);
  }, []);

  const getBrand = async () => {
    const res = await BranchsService.getBrandHeader();
    if (res?.data?.filter((i) => i.uuid === localStorage.getItem('branchUuid'))[0]?.uuid === undefined) {
      setBranchUuid(res?.data[0]?.uuid);
    } else setBranchUuid(res?.data?.filter((i) => i.uuid === localStorage.getItem('branchUuid'))[0]?.uuid);
    setlistBrand(res.data);
    setCurrBrand(res?.data?.filter((i) => i.uuid === localStorage.getItem('branchUuid'))[0]?.branchName);
  };
  useEffect(() => {
    getBrand();
  }, []);

  // const getNotifiList = async () => {
  //   const res = await NotificationService.getAllNoti();
  //   const data = res?.content ?? [];
  //   return data
  // };
  // useEffect(() => {
  //   getNotifiList();
  // }, []);
  const menuNav = {
    items: [
      {
        label: (
          <li
            className="p-2 hover:bg-gray-100 flex items-center pl-4  border border-b-0 cursor-pointer border-gray-200"
            onClick={() => navigate(routerLinks('Profile') + `?tab=2`)}
          >
            <i className="las la-key text-lg mr-2"></i> Đổi mật khẩu
          </li>
        ),
        key: '1',
      },
      {
        label: (
          <li
            className="p-2 hover:bg-gray-100 flex items-center pl-4 cursor-pointer border  border-solid border-gray-200"
            onClick={() => navigate(routerLinks('Login'), { replace: true })}
          >
            <i className="las la-sign-out-alt text-lg mr-2"></i> Đăng xuất
          </li>
        ),
        key: '2',
      },
    ],
  };
  console.log(currBrand);

  const Header = ({ isCollapsed, isDesktop }) => (
    <header
      className={classNames(
        'bg-gray-100 w-full header h-16 transition-all duration-300 ease-in-out sticky top-0 block z-10',
        {
          'pl-72': !isCollapsed && isDesktop,
          'pl-20': isCollapsed && isDesktop,
          'pl-28': !isDesktop,
        },
      )}
    >
      <div className="flex items-center justify-between px-5 h-16 bg-white">
        <div className="relative hidden md:block">
          {/* <span className="absolute right-4 top-2">
            {' '}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M14.25 2.25C10.1162 2.25 6.75 5.61621 6.75 9.75C6.75 11.5459 7.37988 13.1924 8.4375 14.4844L2.46094 20.4609L3.53906 21.5391L9.51562 15.5625C10.8076 16.6201 12.4541 17.25 14.25 17.25C18.3838 17.25 21.75 13.8838 21.75 9.75C21.75 5.61621 18.3838 2.25 14.25 2.25ZM14.25 3.75C17.5723 3.75 20.25 6.42773 20.25 9.75C20.25 13.0723 17.5723 15.75 14.25 15.75C10.9277 15.75 8.25 13.0723 8.25 9.75C8.25 6.42773 10.9277 3.75 14.25 3.75Z"
                fill="#6B7280"
              />
            </svg>
          </span>
          <Input
            placeholder="Tìm kiếm"
            className="!bg-white border border-gray-300 h-[44px] w-[323px] rounded-[10px] px-3 focus:!shadow-none focus:!outline-none"
          /> */}
        </div>

        <div className="flex items-center justify-end px-5 h-16">
          <div className="flex items-center ">
            <div className="mr-3 ">
              {/* <Dropdown
                menu={
                  
                }
                trigger={['click']}
              >
                <a onClick={(e) => e.preventDefault()}>
                  {listBrand[0]?.branchName}
                </a>
              </Dropdown> */}
              <div className="flex items-center">
                <span className="mr-1 ">{exportIcons('MAP')}</span>
                <Dropdown menu={menu2} trigger={['click']}>
                  <div>123</div>
                </Dropdown>
              </div>
            </div>
            <NotificationMenu className="w-3 h-3 cursor-pointer" />
            {/* <div className="mr-5 relative flex group">
              <div className="rounded-full text-white w-5 h-5 bg-red-500 absolute -right-1.5 -top-1.5 leading-none text-center pt-1 text-xs group-hover:animate-bounce">
                1
              </div>
              <i className="las la-bell text-4xl text-gray-500" />
            </div> */}
            {/* <div className="mr-5 relative flex group">
            <div className="rounded-full text-white w-5 h-5 bg-yellow-500 absolute -right-1.5 -top-1.5 leading-none text-center pt-1 text-xs group-hover:animate-bounce">
              76
            </div>
            <i className="las la-comment text-4xl text-gray-500" />
          </div> */}
            {/*
            <Dropdown
              trigger={['hover', 'click']}
              overlay={
                <ul className="bg-blue-50">
                  <li
                    className="p-2 hover:bg-blue-100"
                    onClick={() => navigate(routerLinks('Login'), { replace: true })}
                  >
                    Sign Out
                  </li>
                </ul>
              }
              placement="bottomRight"
            >
              <section className="flex items-center" id={'dropdown-profile'}>
                <Avatar size={50} src={avatar} id="avatar" />
              </section>
            </Dropdown> */}
            <Dropdown
              className="bg-white"
              trigger={['click', 'hover']}
              // menu={
              //   <ul className="bg-white">
              //     <li
              //       className="p-2 hover:bg-gray-100 flex items-center pl-4  border border-b-0 cursor-pointer border-gray-200"
              //       onClick={() => navigate(routerLinks('Profile') + `?tab=2`)}
              //     >
              //       <i className="las la-key text-lg mr-2"></i> Đổi mật khẩu
              //     </li>
              //     <li
              //       className="p-2 hover:bg-gray-100 flex items-center pl-4 cursor-pointer border  border-solid border-gray-200"
              //       onClick={() => navigate(routerLinks('Login'), { replace: true })}
              //     >
              //       <i className="las la-sign-out-alt text-lg mr-2"></i> Đăng xuất
              //     </li>
              //   </ul>
              // }
              menu={menuNav}
              placement="bottomRight"
            >
              <section className="flex items-center" id={'dropdown-profile'}>
                <Avatar size={40} src={avatar} id="avatar" />
              </section>
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  );
  return (
    <main>
      <Header isCollapsed={isCollapsed} isDesktop={isDesktop} />
      <div
        className={classNames(
          't-10 flex items-center text-gray-800 hover:text-gray-500 h-16 fixed top-0 left-0 px-5 font-bold transition-all duration-300 ease-in-out z-10 shadow-md',
          {
            'w-72 justify-between': !isCollapsed && isDesktop,
            'w-20 justify-center': isCollapsed,
            'bg-white': isDesktop || !isDesktop,
            // 'bg-blue-50': !isDesktop,
          },
        )}
      >
        <div>
          <a href="/" className="flex items-center">
            <div
              id={'name-application'}
              className={classNames(
                'transition-all text-white duration-300 ease-in-out absolute w-40 overflow-ellipsis overflow-hidden cursor-pointer',
                {
                  'opacity-100 text-3xl': !isCollapsed && !!isDesktop,
                  'opacity-0 text-[0px] invisible': !!isCollapsed || !isDesktop,
                },
              )}
            >
              {exportIcons('LOGO')}
            </div>
          </a>
        </div>
        {/* className={classNames("hamburger", )} */}
        {isDesktop ? (
          <div
            onClick={() => {
              set_isCollapsed(!isCollapsed);
            }}
          >
            {/* <img
              className={classNames('w-4 cursor-pointer', {
                'rotate-180': (isCollapsed && isDesktop) || (!isCollapsed && !isDesktop),
              })}
              src={arrow}
              alt=""
            ></img> */}
            <span className="cursor-pointer">{exportIcons('MENU')}</span>
          </div>
        ) : (
          <div
            onClick={() => {
              set_isCollapsed(!isCollapsed);
              set_isDesktop(!isDesktop);
            }}
          >
            {/* <img
              className={classNames('w-4 cursor-pointer', {
                'rotate-180': (isCollapsed && isDesktop) || (!isCollapsed && !isDesktop),
              })}
              src={arrow}
              alt=""
            ></img> */}
            <span className="cursor-pointer">{exportIcons('MENU')}</span>
          </div>
        )}
      </div>
      <div
        className={classNames('fixed z-30 top-16 left-0 h-full bg-zinc-700 transition-all duration-300 ease-in-out', {
          'w-72': !isCollapsed,
          'w-20': isCollapsed,
          // '-left-20': isCollapsed && !isDesktop,
        })}
      >
        <Menu isCollapsed={isCollapsed} />
      </div>
      <div
        className={classNames('bg-gray-100 px-5 transition-all duration-300 ease-in-out z-10 pt-6', {
          'ml-72': !isCollapsed && isDesktop,
          'ml-20': isCollapsed && isDesktop,
        })}
      >
        {children}
        <footer className="text-center bg-blue-50 mt-10 -mx-5">
          {t('layout.footer', { year: new Date().getFullYear() })}
        </footer>
      </div>
      <div className="hidden h-7 w-7 leading-7" />
    </main>
  );
};

export default Layout;
