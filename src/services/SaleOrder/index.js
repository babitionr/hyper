import axios from 'axios';
import { routerLinks } from 'utils';
import { Message } from 'components';

export const SaleOrderService = {
  nameLink: 'SaleOrder',
  getList: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(SaleOrderService.nameLink, 'api')}`, {
        params,
      });
      return data?.data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return [];
    }
  },
  getListDoctor: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('UserPosition', 'api')}/all`, {
        params,
      });
      return {
        data: data?.data || [],
        // count: data?.pagination?.total
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return [];
    }
  },
  postService: async (params) => {
    try {
      const { data } = await axios.post(`${routerLinks(SaleOrderService.nameLink, 'api')}`, params);
      // if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return {};
    }
  },
  GetListSaleOrderService: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(SaleOrderService.nameLink, 'api')}/service-list`, {
        params,
      });
      return data?.data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getAllSaleOrderByCustomer: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(SaleOrderService.nameLink, 'api')}/get-all-by-customer`, {
        params,
      });
      return data?.data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getAllServiecBySaleOrder: async (params) => {
    try {
      const { data } = await axios.get(
        `${routerLinks(SaleOrderService.nameLink, 'api')}/get-all-service-by-sale-order`,
        {
          params,
        },
      );
      return data?.data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  GetDetailSaleOrderCopy: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(SaleOrderService.nameLink, 'api')}/${params}`);
      return data?.data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  GetDetailSaleOrder: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(SaleOrderService.nameLink, 'api')}/${params}`);
      return data?.data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  delete: async (params) => {
    try {
      const { data } = await axios.put(`${routerLinks(SaleOrderService.nameLink, 'api')}/delete/${params}`);
      if (data.message)
        Message.success({ text: 'Xóa phiếu điều trị thành công', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data.data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Xóa phiếu điều trị thất bại.' });
      return {};
    }
  },
};
