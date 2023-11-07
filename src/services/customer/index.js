import axios from 'axios';
import { routerLinks } from 'utils';
import { Message } from 'components';
import moment from 'moment';

export const CustomerService = {
  nameLink: 'Customer',
  getList: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(CustomerService.nameLink, 'api')}/`, { params });
      return data.data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return [];
    }
  },
  create: async (params) => {
    try {
      const { data } = await axios.post(`${routerLinks(CustomerService.nameLink, 'api')}/`, params);
      if (data.message)
        Message.success({ text: 'Tạo thông tin khách hàng thành công', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      console.error(e);
      if (e?.response?.data?.message) Message.error({ text: e?.response?.data?.message });
      return false;
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
      if (data.message)
        Message.success({ text: 'Xóa thông tin khách hàng thành công', title: 'Thành Công', cancelButtonText: 'Đóng' });
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
      if (data.message)
        Message.success({
          text: 'Chỉnh sửa thông tin khách hàng thành công',
          title: 'Thành Công',
          cancelButtonText: 'Đóng',
        });
      return data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getByUuid: async (uuid) => {
    try {
      const { data } = await axios.get(`${routerLinks(CustomerService.nameLink, 'api')}/${uuid}`);

      return {
        ...data?.data,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getListTreatmentHistory: async (params) => {
    try {
      // const { data } = await axios.get(`${routerLinks(CustomerService.nameLink, "api")}/login`, values);

      const treatmentHistoryArr = [];
      for (let i = 0; i < 10; i++) {
        treatmentHistoryArr.push({
          id: i,
          date: moment(new Date()).format('DD/MM/YYYY'),
          service: 'Niềng răng',
          treatmentSlip: 'SO00001',
          quantity: 1,
          basicUnit: 'cái',
          totalPrice: '5.000.000',
          payment: '2.000.000',
          remaining: '3.000.000',
          tooth: 'Nguyên hàm',
          doctor: 'Nguyễn Văn Tài',
          diagnostic: 'Răng không đều',
          status: 'Đang điều trị',
        });
      }
      return {
        data: treatmentHistoryArr || [],
        count: 9,
      };
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  uploadCustomer: async (file, branchUuid) => {
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      const data = await axios.post(
        `${routerLinks(CustomerService.nameLink, 'api')}/${branchUuid}/upload`,
        bodyFormData,
      );
      if (data)
        Message.success({
          text: 'Nhập file thành công',
          title: 'Thành Công',
          cancelButtonText: 'Đóng',
        });
      return true;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
};
