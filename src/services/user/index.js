import axios from 'axios';
import { routerLinks } from 'utils';
import { Message } from 'components';
import { keyRefreshToken, keyToken } from '../../variable';

export const UserService = {
  nameLink: 'User',
  login: async (values) => {
    delete values.email;
    try {
      const { data } = await axios.post(`${routerLinks(UserService.nameLink, 'api')}/login`, values);
      return data;
    } catch (e) {
      console.error(e);
      // if (e.response.data.message) Message.error({ text: 'Đăng nhập thất bại. Vui lòng đăng nhập lại.' });
      if (e.response.data.message) {
        Message.error({ text: e.response.data.message });
      } else {
        Message.error('Có lỗi xảy ra trong quá trình đăng nhập.');
      }
      return false;
    }
  },
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem(keyRefreshToken);
      if (refreshToken) {
        const { data } = await axios.post(`${routerLinks(UserService.nameLink, 'api')}/refresh-token`, {
          refreshToken,
        });
        axios.defaults.headers.common.Authorization = 'Bearer ' + data.data.accessToken;
        localStorage.setItem(keyToken, data.data.accessToken);
        localStorage.setItem(keyRefreshToken, data.data.refreshToken);
        return data;
      }
      return null;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) {
        Message.error({ text: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' });
      } else {
        Message.error('Có lỗi xảy ra trong quá trình đăng nhập');
      }
      return false;
    }
  },
  logout: async () => {
    try {
      const { data } = await axios.post(`${routerLinks(UserService.nameLink, 'api')}/log-out`);
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) {
        Message.error({ text: e.response.data.message });
      } else {
        Message.error('Có lỗi xảy ra trong quá trình đăng xuất');
      }
      return false;
    }
  },

  forgotPass: async (values) => {
    try {
      const { data } = await axios.put(`${routerLinks(UserService.nameLink, 'api')}/forgot-password`, values);
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) {
        Message.error({ text: e.response.data.message });
      } else {
        Message.error('Có lỗi xảy ra trong quá trình thao tác');
      }
      return false;
    }
  },

  sendOtp: async (values) => {
    try {
      const { data } = await axios.post(`${routerLinks(UserService.nameLink, 'api')}/verify-pass-code`, values);
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) {
        Message.error({ text: e.response.data.message });
      } else {
        Message.error('Có lỗi xảy ra trong quá trình thao tác');
      }
      return false;
    }
  },

  setPass: async (values) => {
    try {
      const { data } = await axios.post(`${routerLinks(UserService.nameLink, 'api')}/change-password`, values);
      if (data.message) {
        Message.success({
          text: data.message,
          title: 'Thành Công',
          cancelButtonText: 'Đóng',
        });
      }
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) {
        Message.error({ text: e.response.data.message });
      } else {
        Message.error('Có lỗi xảy ra trong quá trình thao tác');
      }
      return false;
    }
  },
};
