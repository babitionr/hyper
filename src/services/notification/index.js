import axios from 'axios';
import { routerLinks } from 'utils';
import { Message } from 'components';

export const NotificationService = {
  nameLink: 'Notification',
  saveToken: async (params) => {
    try {
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${routerLinks(NotificationService.nameLink, 'api')}/save`,
        data: params,
      };
      axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Thất bại.' });
      return {};
    }
  },
  getList: async (params) => {
    delete params.filter;
    try {
      const { data } = await axios.get(`${routerLinks(NotificationService.nameLink, 'api')}/list/setting`, {
        params,
      });
      return {
        data: data?.data?.content || [],
        count: data?.data?.totalElements,
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  post: async (values) => {
    try {
      const { data } = await axios.post(`${routerLinks(NotificationService.nameLink, 'api')}/setting`, values);
      // if (data.message)
      //   Message.success({ text: 'Tạo thông số labo thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getById: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(NotificationService.nameLink, 'api')}/setting`, {
        params,
      });
      return {
        data: data?.data,
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  delete: async (params) => {
    try {
      const { data } = await axios.delete(`${routerLinks(NotificationService.nameLink, 'api')}/setting`, {
        params,
      });
      if (data.message)
        Message.success({ text: 'Xóa thông báo thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getAllNoti: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(NotificationService.nameLink, 'api')}/list`);
      return data?.data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return [];
    }
  },
  markAsRead: async (params) => {
    try {
      const { data } = await axios.put(`${routerLinks(NotificationService.nameLink, 'api')}/mark-as-read/${params.id}`);
      // if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Thất bại.' });
      return {};
    }
  },
  markAllAsRead: async (params) => {
    try {
      const { data } = await axios.put(`${routerLinks(NotificationService.nameLink, 'api')}/mark-all-as-read`);
      // if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Thất bại.' });
      return {};
    }
  },
};
