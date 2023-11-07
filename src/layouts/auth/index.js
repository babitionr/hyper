import React, { useEffect, useRef, useCallback } from 'react';
import { useAuth } from 'global';
import classNames from 'classnames';
import { useLocation } from 'react-router-dom';
// import footerImage from 'assets/images/footer.png';
import './index.less';
// import logo from 'assets/images/logo.svg';

const Layout = ({ children }) => {
  const { logout } = useAuth();
  const location = useLocation();

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
  let imageURL = '';

  switch (location.pathname) {
    case '/auth/login':
      imageURL = "bg-[url('assets/images/bg-login.png')]";
      break;
    case '/auth/forgot-password':
      imageURL = "bg-[url('assets/images/bg-forgot.png')]";
      break;
    case '/auth/send-otp':
      imageURL = "bg-[url('assets/images/bg-forgot.png')]";
      break;
    case '/auth/reset-password':
      imageURL = "bg-[url('assets/images/bg-forgot.png')]";
      break;
    default:
      imageURL = "bg-[url('assets/images/bg-login.png')]";
      break;
  }
  return (
    <div className="layout-auth h-screen min-h-screen w-full drop-shadow-2xl flex flex-col relative">
      <div className="bg-white bg-cover bg-center h-full relative min-h-[600px] ">
        <div className="flex  h-full">
          <div className="w-full relative justify-between flex-col flex">
            <div
              className={classNames(
                imageURL,
                'bg-cover bg-center w-full  lg:min-h-full  min-h-[600px] relative lg:overflow-hidden flex justify-between flex-col overflow-auto h-full',
              )}
            >
              <div className="lg:grid grid-cols-2 flex items-center h-full">
                <div></div>
                <div className="tems-center flex flex-col grid m-auto">{children}</div>
              </div>
            </div>
          </div>
        </div>
        {/* <div
          className="absolute w-full z-10 bottom-0 h-28"
          style={{
            backgroundImage: 'url(' + footerImage + ')',
            backgroundSize: 'cover',
          }}
        >
          <div className="absolute -translate-x-1/2  top-1/2 left-1/2 text-white">
            <p className="hidden sm:block">Powered By Hyper tech</p>
          </div>
        </div> */}
      </div>
    </div>
  );
};
export default Layout;
