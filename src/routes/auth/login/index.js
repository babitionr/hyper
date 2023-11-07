import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useAuth } from 'global';
import { Form, Spin } from 'components';
import { ColumnLogin } from 'columns/auth';
import { UserService } from 'services/user';
import './index.less';
import { routerLinks } from 'utils';
import { permissionMenu } from 'layouts/admin/menus';

const Page = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');

  function onChangeCapcha(value) {
    setToken(value);
  }

  const submit = async (values) => {
    if (token) {
      try {
        setLoading(true);
        const res = await UserService.login({
          ...values,
          userName: values.email,
        });
        setLoading(false);
        if (res.data) {
          auth.login(res.data);
          const menu = permissionMenu(res?.data?.featureDtos);
          if (menu.length) {
            if (menu[0]?.child?.length) {
              const childPage = menu[0].child[0];
              navigate(routerLinks(childPage.routerName), { replace: true });
            } else {
              navigate(routerLinks(menu[0].routerName), { replace: true });
            }
          }

          // const page = res.data.featureDtos?.[0];
          // if (page && page.children && page.children.length > 0) {
          //   const childPage = page.children[0];
          //   navigate(childPage.pageUrl, { replace: true });
          // } else {
          //   navigate(page.pageUrl, { replace: true });
          // }

          // navigate(routerLinks('Home'), { replace: true });
        }
      } catch (err) {
        console.log('Error is:', err);
        setLoading(false);
      }
    }
  };

  return (
    <div className="relative lg:h-[556px] p-7 lg:w-[500px] rounded-[16px] flex items-center justify-center bgForm">
      <div>
        <div className="text-center mb-7">
          <h1 className="text-4xl text-gray-600">{'Đăng Nhập'}</h1>
        </div>
        <Spin spinning={loading}>
          <Form
            className="w-[300px] mx-auto form-login colorText"
            columns={ColumnLogin({ onChangeCapcha, t })}
            handSubmit={submit}
            idSubmit={'submit-btn'}
            textSubmit={'Đăng Nhập'}
          />
        </Spin>

        <div
          className="intro-x pt-1 -mt-28 bottom-16 right-12 sm:right-[6rem] lg:right-16
       md:mt-1 absolute xl:absolute  xl:pt-1 xl:-mt-32"
        ></div>
      </div>
    </div>
  );
};
// to={routerLinks("ForgotPass")}
export default Page;
