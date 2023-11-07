import React, { useState, Fragment } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Message, Form, Spin } from 'components';
import { routerLinks } from 'utils';
import { UserService } from 'services/user';
import { ColumnResetPassword } from 'columns/auth';
import './index.less';
import { Link } from 'react-router-dom';

const Page = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const submit = async (values) => {
    try {
      setLoading(true);
      const res = await UserService.setPass({
        ...values,
        email: location.state.email,
        passCode: location.state.passCode,
        newPassword: values.password,
      });
      if (res.statusCode === 200) {
        Message.success({
          text: res.message,
          title: 'Thành Công',
          cancelButtonText: 'Đóng',
        });
        navigate(routerLinks('Login'));
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      await Message.error(err.response.data.message);
    }
  };

  return (
    <Fragment>
      <div className="relative lg:h-[556px] p-7 lg:w-[500px] rounded-[16px] flex items-center justify-center bgForm">
        <div>
          <div className="mb-4 -mt-28 title-auth">
            <h1 className="mb-3">{'Đặt Lại Mật Khẩu'}</h1>
            <h5>Vui lòng tạo mật khẩu mới để đăng nhập hệ thống.</h5>
          </div>
          <Spin spinning={loading}>
            <Form
              className="w-[300px] mx-auto form-login"
              columns={ColumnResetPassword({ t })}
              textSubmit={'Đặt lại mật khẩu'}
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
