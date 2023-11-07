import React from 'react';
import { routerLinks } from 'utils';
import { Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
const Column = ({ onChangeCapcha }) => {
  return [
    {
      name: 'email',
      title: 'Tên đăng nhập',
      formItem: {
        placeholder: 'Nhập tên đăng nhập',
        rules: [{ type: 'required' }],
      },
    },
    {
      name: 'password',
      title: 'Mật khẩu',
      formItem: {
        placeholder: 'Nhập mật khẩu',
        type: 'password',
        rules: [{ type: 'required' }],
      },
    },
    {
      name: 'Ghi nhớ tài khoản',
      title: '',
      formItem: {
        col: 7,
        type: 'only_text',
        render: () => '',
        // list: [{ label: 'Ghi nhớ tài khoản', value: 'Ghi nhớ tài khoản' }],
      },
    },
    {
      name: 'Quên mật khẩu?',
      title: 'Quên mật khẩu?',
      formItem: {
        col: 5,
        type: 'only_text',
        render: () => {
          return (
            <div className="mt-[7px] mb-2">
              <Link className="text-gray-700 underline colorText " id="reset-pass-link" to={routerLinks('ForgotPass')}>
                {'Quên mật khẩu?'}
              </Link>
            </div>
          );
        },
      },
    },
    {
      formItem: {
        render: () => {
          return (
            <div className="mb-3">
              <ReCAPTCHA sitekey="6LfDLzIlAAAAAMCr_UYkzgdJCMSxFHXr1LYlk9g-" onChange={onChangeCapcha} />
            </div>
          );
        },
      },
    },
  ];
};
export default Column;
