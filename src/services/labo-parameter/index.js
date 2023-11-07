import axios from 'axios';
import { routerLinks } from 'utils';
import { Message } from 'components';

export const LaboParameterService = {
  nameLink: 'LaboParameter',
  get: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(LaboParameterService.nameLink, 'api')}/list`, {
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
  getAll: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(LaboParameterService.nameLink, 'api')}/all`, {
        params,
      });
      return {
        data: data?.data || [],
        count: data?.data?.totalElements,
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getById: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(LaboParameterService.nameLink, 'api')}/detail`, {
        params,
      });
      return {
        ...data?.data,
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  post: async (values) => {
    try {
      const { data } = await axios.post(`${routerLinks(LaboParameterService.nameLink, 'api')}/create`, values);
      if (data.message)
        Message.success({ text: 'Tạo thông số labo thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  put: async (values, id) => {
    try {
      const { data } = await axios.put(`${routerLinks(LaboParameterService.nameLink, 'api')}/update`, values);
      if (data.message)
        Message.success({ text: 'Chỉnh sửa thông số labo thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },

  delete: async (id) => {
    try {
      const { data } = await axios.delete(`${routerLinks(LaboParameterService.nameLink, 'api')}/delete/${id}`);
      if (data.message)
        Message.success({ text: 'Xóa thông số labo thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
};
