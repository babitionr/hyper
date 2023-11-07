import axios from 'axios';
import { routerLinks } from 'utils';
import { Message } from 'components';
import moment from 'moment';

export const LaboService = {
  nameLink: 'Labo',
  get: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('SaleOrder', 'api')}/labo-sale-order-list`, {
        params,
      });
      // const convertData = data?.data?.content?.map((i) => ({
      //   ...i,
      //   customerName: i?.customer?.fullName,
      //   doctor: i?.doctor?.firstName + ' ' + i?.doctor?.lastName,
      // }));
      return {
        data: data?.data?.content || [],
        count: data?.data?.totalElements,
      };
      // return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getListWarrantyByCustomer: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(LaboService.nameLink, 'api')}/customer/list/warranty`, {
        params,
      });
      return {
        data: data?.data?.content || [],
        count: data?.data?.totalElements,
      };
      // return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },

  getAllBySaleOrder: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(LaboService.nameLink, 'api')}/sale-order/all`, {
        params,
      });
      const convertData = data?.data?.map((i) => ({
        ...i,
        supplierName: i?.supplier?.name,
        timeSend: moment(i.timeSend).format('DD/MM/YYYY hh:mm:ss'),
        timeReceive: moment(i.timeReceive).format('DD/MM/YYYY hh:mm:ss'),
      }));
      return {
        data: convertData || [],
        count: data?.data?.totalElements,
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getListByCustomer: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(LaboService.nameLink, 'api')}/customer/list`, {
        params,
      });
      const convertData = data?.data?.content?.map((i) => ({
        ...i,
        timeSend: moment(i.timeSend).format('DD/MM/YYYY'),
      }));
      return {
        data: convertData || [],
        count: data?.data?.total,
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
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
      return false;
    }
  },
  getById: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(LaboService.nameLink, 'api')}/detail`, {
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
      const { data } = await axios.post(`${routerLinks(LaboService.nameLink, 'api')}/save`, values);
      if (data.message)
        Message.success({ text: 'Tạo phiếu labo thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  put: async (values, id) => {
    try {
      const { data } = await axios.put(`${routerLinks(LaboService.nameLink, 'api')}/update`, values);
      if (data.message)
        Message.success({ text: 'Chỉnh sửa phiếu labo thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },

  delete: async (id) => {
    try {
      const { data } = await axios.delete(`${routerLinks(LaboService.nameLink, 'api')}/delete/${id}`);
      if (data.message)
        Message.success({ text: 'Xóa thông số labo thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },

  receiveLabo: async (value) => {
    try {
      const { data } = await axios.put(`${routerLinks(LaboService.nameLink, 'api')}/update/receive`, value);
      if (data.message)
        Message.success({ text: 'Nhận labo thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },

  exportLabo: async (value) => {
    try {
      const { data } = await axios.put(`${routerLinks(LaboService.nameLink, 'api')}/update/export`, value);
      if (data.message)
        Message.success({ text: 'Xuất labo thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getListLabo: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(LaboService.nameLink, 'api')}/list`, {
        params,
      });
      // const convertData = data?.data?.content?.map((i) => ({
      //   ...i,
      //   customerName: i?.customer?.fullName,
      //   doctor: i?.doctor?.firstName + ' ' + i?.doctor?.lastName,
      // }));
      return data.data;
      // return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  updateReceiveLabo: async (value) => {
    try {
      const { data } = await axios.post(`${routerLinks(LaboService.nameLink, 'api')}/update-receive-labo`, value);
      if (data.message)
        Message.success({ text: 'Thêm chi phí tính vào thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
};
