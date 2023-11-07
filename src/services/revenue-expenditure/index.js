import axios from 'axios';
import { routerLinks } from 'utils';
import { Message } from 'components';

export const RevenueExpenditureService = {
  nameLink: 'ReceiptPayment',
  get: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(RevenueExpenditureService.nameLink, 'api')}`, {
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
  getAllExcel: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(RevenueExpenditureService.nameLink, 'api')}`, {
        params,
      });
      return {
        data: data?.data?.itemList || [],
        totalAmount: data?.data?.totalAmount,
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getAll: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(RevenueExpenditureService.nameLink, 'api')}/all`, {
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
  getAllGroupExpense: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('ReceiptPaymentGroup', 'api')}/get-all`, {
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
  getById: async (uuid) => {
    try {
      const { data } = await axios.get(`${routerLinks(RevenueExpenditureService.nameLink, 'api')}/${uuid}`);
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
      const { data } = await axios.post(`${routerLinks(RevenueExpenditureService.nameLink, 'api')}`, values);
      // if (data.message)
      //   Message.success({ text: `Tạo phiếu ${type} thành công.`, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  put: async (values, id) => {
    try {
      const { data } = await axios.put(`${routerLinks(RevenueExpenditureService.nameLink, 'api')}/update`, values);
      if (data.message)
        Message.success({ text: 'Chỉnh sửa phiếu thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },

  delete: async (values, type) => {
    try {
      const { data } = await axios.put(`${routerLinks(RevenueExpenditureService.nameLink, 'api')}/delete`, values);
      if (data.message)
        Message.success({ text: `Xóa phiếu ${type} thành công.`, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
};
