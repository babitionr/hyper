import React, { useState, Fragment } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Message, Form, Spin } from 'components';
import { routerLinks } from 'utils';
import { UserService } from 'services/user';
import { ColumnForgetPassword } from 'columns/auth';
import { Link } from 'react-router-dom';
import './index.less';

const Page = ({ location }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const submit = async (values) => {
    try {
      setLoading(true);
      const res = await UserService.forgotPass({
        ...values,
      });
      if (res.statusCode === 200) {
        setLoading(false);
        navigate(routerLinks('SendOTP'), {
          state: { email: values.email },
        });
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      await Message.error(err.response.data.message);
    }
  };

  return (
    <Fragment>
      <div className="relative h-[556px] p-7 lg:w-[500px] rounded-[16px] flex items-center justify-center bgForm">
        <div>
          <div className="mb-8 -mt-28 text-center">
            <h1 className="text-4xl text-gray-600 mb-3">{'Quên Mật Khẩu'}</h1>
            <h5 className="text-base text-gray-600">
              Vui lòng nhập e-mail của bạn.
              <br />
              Mã OTP sẽ được gửi đến e-mail bạn
            </h5>
          </div>
          <Spin spinning={loading}>
            <Form
              className="w-[300px] mx-auto form-login"
              columns={ColumnForgetPassword({ t })}
              textSubmit={'Lấy lại mật khẩu'}
              handSubmit={submit}
              idSubmit={'submit-btn'}
            />
          </Spin>
          <div className="text-left mt-4 w-[300px] mx-auto">
            {/* absolute xl:absolute */}
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
