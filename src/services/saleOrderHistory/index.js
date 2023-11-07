import axios from 'axios';
import { routerLinks } from 'utils';
import { Message } from 'components';

export const SaleOrderHistoryService = {
  nameLink: 'SaleOrderHistory',
  getSaleOrderHistoryList: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(SaleOrderHistoryService.nameLink, 'api')}`, {
        params,
      });
      return data?.data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return [];
    }
  },
  getSaleOrderHistoryDetail: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(SaleOrderHistoryService.nameLink, 'api')}/${params}`);
      return {
        ...data?.data,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  saveSaleOrderHistory: async (params) => {
    try {
      const value = { ...params };
      const { data } = await axios.post(`${routerLinks(SaleOrderHistoryService.nameLink, 'api')}`, value);
      if (data.message)
        Message.success({ text: 'Tạo lịch sử điều trị thành công', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Lưu dữ liệu thất bại.' });
      return false;
    }
  },
  delete: async (uuid) => {
    try {
      const { data } = await axios.put(`${routerLinks(SaleOrderHistoryService.nameLink, 'api')}/delete/${uuid}`);
      if (data.message)
        Message.success({ text: 'Xoá lịch sử điều trị thành công', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Lưu dữ liệu thất bại.' });
      return false;
    }
  },
};
