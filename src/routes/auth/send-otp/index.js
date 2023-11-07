import React, { Fragment, useEffect, useRef, useState } from 'react';
// import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { UserService } from 'services/user';
import { routerLinks } from 'utils';
import './index.less';
import { Message } from 'components';

const Page = () => {
  // const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(Array(6).fill(''));
  const [activeIndex, setActiveIndex] = useState(0);

  const ref = useRef(null);

  const [, setLoading] = useState(false);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [activeIndex]);

  const submit = async () => {
    try {
      setLoading(true);
      const res = await UserService.sendOtp({
        passCode: value.join(''),
        email: location.state.email,
      });
      if (res.statusCode === 200) {
        navigate(routerLinks('ResetPass'), {
          state: { email: location.state.email, passCode: value.join('') },
        });
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const handleChange = (e, i) => {
    const arr = [...value];
    if (e.target.value) {
      if (!value[i]) {
        setActiveIndex(i + 1);
        arr.splice(i, 1, e.target.value);
        setValue(arr);
      }
    } else {
      setActiveIndex(i - 1);
      arr.splice(i, 1, '');
      setValue(arr);
    }
  };

  const handleKeyDown = (e, i) => {
    if (e.key === 'ArrowRight' && i < 5) {
      setActiveIndex(i + 1);
    }
    if (e.key === 'ArrowLeft' && i > 0) {
      setActiveIndex(i - 1);
    }
  };

  const sendAgain = async () => {
    const res = await UserService.forgotPass({
      email: location.state.email,
    });
    if (res.statusCode === 200) {
      Message.success({
        text: 'Đã gửi lại mã thành công.',
        title: 'Thành Công',
        cancelButtonText: 'Đóng',
      });
    }
  };
  return (
    <Fragment>
      <div className="relative h-[556px] w-[500px] rounded-[16px] flex items-center justify-center bgForm">
        <div>
          <div className="mb-8 -mt-28 title-auth">
            <h1 className="mb-4">{'Nhập Mã Xác thực'}</h1>
            <h5>{'Nhập mã xác thực OTP đã được gửi đến e-mail của bạn'}</h5>
          </div>
          <div className="flex gap-6 justify-center flex-col items-center">
            <div className="flex gap-2 justify-center">
              {value.map((i, index) => (
                <input
                  key={index}
                  ref={activeIndex === index ? ref : null}
                  className="w-[58px] text-center text-[20px] h-[44px] rounded-lg bg-[#F3F4F6] outline-none"
                  type="number"
                  value={value[index]}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>
            <button className="bg-[#EE4055] rounded-lg w-[300px] h-[45px] text-white" onClick={submit}>
              Gửi mã
            </button>
          </div>
          {/* <Spin spinning={loading} className="hidden">
            <Form
              className="mx-auto form-login w-[300px] "
              columns={ColumnSendOtp({ t })}
              textSubmit={'Gửi mã'}
              handSubmit={submit}
              idSubmit={'submit-btn'}
            />
          </Spin> */}
          <div className="w-[300px] mx-auto mt-4">
            {/* <Link to="/"> */}
            Bạn chưa nhận được mã?{' '}
            <span className="text-blue-500 cursor-pointer" onClick={() => sendAgain()}>
              Chọn gửi lại.
            </span>
            {/* </Link> */}
          </div>
          <div className="text-left mt-1 w-[300px] mx-auto">
            <Link className="text-blue-500 flex items-center " to={routerLinks('Login')} id="back">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M6.64062 3.39062L2.39062 7.64062L2.04688 8L2.39062 8.35938L6.64062 12.6094L7.35938 11.8906L3.96875 8.5H14V7.5H3.96875L7.35938 4.10938L6.64062 3.39062Z"
                  fill="#3B82F6"
                />
              </svg>
              <span className="ml-[10px]">{'Quay trở lại Đăng nhập'}</span>
            </Link>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Page;
