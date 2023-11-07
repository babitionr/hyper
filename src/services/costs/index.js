import axios from 'axios';
import { routerLinks } from 'utils';
import { Message } from 'components';

export const CostsService = {
  nameLink: 'Costs',
  get: async (params) => {
    delete params.filter;
    try {
      const { data } = await axios.get(`${routerLinks(CostsService.nameLink, 'api')}`, {
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
      const { data } = await axios.get(`${routerLinks(CostsService.nameLink, 'api')}/get-all`, {
        params,
      });
      return {
        data: data?.data || [],
        count: data?.data?.totalElements ?? 17,
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getById: async (id) => {
    try {
      const { data } = await axios.get(`${routerLinks(CostsService.nameLink, 'api')}/${id}`);
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
      const { data } = await axios.post(`${routerLinks(CostsService.nameLink, 'api')}`, values);
      if (data.message)
        // Message.success({ text: 'Tạoloại chi phí thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
        return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  put: async (values, id) => {
    try {
      const { data } = await axios.post(`${routerLinks(CostsService.nameLink, 'api')}`, values);
      if (data.message)
        // Message.success({ text: 'Chỉnh sửaloại chi phí thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
        return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },

  delete: async (params) => {
    try {
      const { data } = await axios.put(`${routerLinks(CostsService.nameLink, 'api')}/delete?uuid=${params}`);
      if (data.message)
        Message.success({ text: 'Xóa loại chi phí thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
};
