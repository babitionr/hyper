import axios from 'axios';
import { Message } from 'components';
import { routerLinks } from 'utils';
import { CustomerService } from '../customer';

export const AddressService = {
  nameLink: 'Customer',
  getList: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(CustomerService.nameLink, 'api')}/`, { params });
      return data.data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Lấy dữ liệu thất bại.' });
      return {};
    }
  },
  create: async (params) => {
    try {
      const { data } = await axios.post(`${routerLinks(CustomerService.nameLink, 'api')}/`, params);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data.data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Tạo khách hàng thất bại.' });
      return {};
    }
  },
  getDetail: async (id) => {
    try {
      const { data } = await axios.get(`${routerLinks(CustomerService.nameLink, 'api')}/${id}`);
      return data.data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Sửa thông tin khách hàng thất bại.' });
      return {};
    }
  },
  delete: async (params) => {
    try {
      const { data } = await axios.put(`${routerLinks(CustomerService.nameLink, 'api')}/delete?uuid=${params}`);
      if (data.message) Message.success({ text: data.message, title: 'Xóa Thành Công', cancelButtonText: 'Đóng' });
      return data.data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Xóa thông tin khách hàng thất bại.' });
      return {};
    }
  },
  update: async (params) => {
    try {
      const { data } = await axios.put(`${routerLinks(CustomerService.nameLink, 'api')}/`, params);
      if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data.data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Sửa thông tin khách hàng thất bại.' });
      return {};
    }
  },
};
