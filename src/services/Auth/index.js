import axios from 'axios';
import { routerLinks } from 'utils';
import { Message } from 'components';

export const AuthSerivce = {
  nameLink: 'UserPosition',
  // getUserByPosition: async (position) => {
  //   try {
  //     const { data } = await axios.get(`${routerLinks('UserPosition', "api")}/all?position=${position}`);
  //     return data;
  //   } catch (e) {
  //     console.log(e);
  //     if (e.response.data.message) Message.error({ text: e.response.data.message });
  //     return false;
  //   }
  // },
  getUserByPosition: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('UserPosition', 'api')}/all`, {
        params,
      });
      return {
        data: data?.data ?? [],
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getAllUser: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('UserManagement', 'api')}/all`, { params });
      return {
        data: data?.data,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  changePass: async (values) => {
    delete values.passwordComfirm;
    try {
      const { data } = await axios.post(`${routerLinks('UserManagement', 'api')}/change-password`, values);
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
