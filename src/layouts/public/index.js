import React, { useEffect, useRef, useCallback } from 'react';
// import { useNavigate } from 'react-router';
import classNames from 'classnames';

// import logo from 'assets/images/logo.svg';
// import arrow from 'assets/images/arrow.svg';
import { useTranslation } from 'react-i18next';

// import menus from "./menus";
import './index.less';
import { useAuth } from 'global';
import { exportIcons } from 'utils';
// import { Avatar } from 'components';

const Layout = ({ children }) => {
  // menuVertical, permission,
  // const navigate = useNavigate();
  const { t } = useTranslation();

  const Header = ({ isCollapsed, isDesktop }) => (
    <header
      className={classNames(
        'bg-gray-100 w-full header h-16 transition-all duration-300 ease-in-out sticky top-0 block z-10',
      )}
    >
      <div className="flex items-center justify-between px-5 h-16 bg-white">
        <div className="relative hidden md:block"></div>
      </div>
    </header>
  );

  const { logout } = useAuth();

  const mount = useRef(false);
  const initFunction = useCallback(async () => {
    // if (!!auth.user?.token) {
    //   await UserService.logout();
    // }
    await logout();
  }, [logout]);

  useEffect(() => {
    if (!mount.current) {
      mount.current = true;
      initFunction();
    }
  }, [mount, initFunction]);
  return (
    <div className=" h-full min-h-screen w-full flex flex-col relative !bg-[#0000001a] shadow-xl">
      <div>
        <Header isCollapsed={false} isDesktop={true} />
        <div
          className={classNames(
            't-10 flex items-center text-gray-800 hover:text-gray-500 h-16 fixed top-0 left-0 px-5 font-bold transition-all duration-300 ease-in-out z-10',
            {
              'w-72 justify-between': true,
              // 'w-20 justify-center': isCollapsed,
              'bg-white': true,
            },
          )}
        >
          <div>
            <a href="#/organizationDemo" className="flex items-center">
              <div
                id={'name-application'}
                className={classNames(
                  'transition-all text-white duration-300 ease-in-out absolute w-40 overflow-ellipsis overflow-hidden cursor-pointer',
                  {
                    'opacity-100 text-3xl': true,
                    // 'opacity-0 text-[0px] invisible': !!isCollapsed || !isDesktop,
                  },
                )}
              >
                {exportIcons('LOGO')}
              </div>
            </a>
          </div>
          {/* {isDesktop ? (
          <div
            onClick={() => {
              set_isCollapsed(!isCollapsed);
            }}
          >
            <span className="cursor-pointer">{exportIcons('MENU')}</span>
          </div>
        ) : (
          <div
            onClick={() => {
              set_isCollapsed(!isCollapsed);
              set_isDesktop(!isDesktop);
            }}
          >
            <span className="cursor-pointer">{exportIcons('MENU')}</span>
          </div>
        )} */}
        </div>

        <div
          className={classNames('bg-white px-5 m-5 transition-all duration-300 ease-in-out z-10 pt-6', {
            // 'ml-72': !isCollapsed && isDesktop,
            // 'ml-20': isCollapsed && isDesktop,
          })}
        >
          {children}
          <footer className="text-center bg-blue-50 mt-10 -mx-5">
            {t('layout.footer', { year: new Date().getFullYear() })}
          </footer>
        </div>
        <div className="hidden h-7 w-7 leading-7" />
      </div>
    </div>
  );
};
export default Layout;
