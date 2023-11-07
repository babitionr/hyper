import axios from 'axios';
import { routerLinks } from 'utils';
import { Message } from 'components';

export const DebtService = {
  nameLink: 'Debt',
  get: async (params) => {
    delete params.filter;
    try {
      const { data } = await axios.get(`${routerLinks(DebtService.nameLink, 'api')}`, {
        params,
      });
      return {
        data: data?.data?.content?.map((i) => ({ ...i, key: i.uuid })) || [],
        count: data?.data?.totalElements,
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getAmountDebtTotal: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(DebtService.nameLink, 'api')}/get-amount-debt-total`, {
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
  getDeptNotPaid: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(DebtService.nameLink, 'api')}/receivable-service`, {
        params,
      });
      return {
        data: data?.data || [],
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getAll: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(DebtService.nameLink, 'api')}/get-all`, {
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
      const { data } = await axios.get(`${routerLinks(DebtService.nameLink, 'api')}/${id}`);
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
      const { data } = await axios.post(`${routerLinks(DebtService.nameLink, 'api')}`, values);
      if (data.message)
        Message.success({ text: 'Tạo thu nợ thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  put: async (values, id) => {
    try {
      const { data } = await axios.post(`${routerLinks(DebtService.nameLink, 'api')}`, values);
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
      const { data } = await axios.put(`${routerLinks(DebtService.nameLink, 'api')}/delete?uuid=${params}`);
      if (data.message)
        Message.success({ text: 'Xóa loại chi phí thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
};
