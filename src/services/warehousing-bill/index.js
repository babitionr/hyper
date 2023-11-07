import axios from 'axios';
import { routerLinks } from 'utils';
import { Message } from 'components';

export const WarehousingBill = {
  nameLink: 'WarehousingBill',
  getListExportImportExist: async (params) => {
    try {
      const { data } = await axios.get(
        `${routerLinks(WarehousingBill.nameLink, 'api')}/warehousing-inventory-product`,
        { params },
      );
      return data.data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Lấy dữ liệu thất bại.' });
      return {};
    }
  },
  getList: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(WarehousingBill.nameLink, 'api')}/`, { params });
      return data.data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Lấy dữ liệu thất bại.' });
      return {};
    }
  },
  post: async (params) => {
    try {
      const { data } = await axios.post(`${routerLinks(WarehousingBill.nameLink, 'api')}/`, params);
      // if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Lấy dữ liệu thất bại.' });
      return {};
    }
  },
  getDetail: async (uuid) => {
    try {
      const { data } = await axios.get(`${routerLinks(WarehousingBill.nameLink, 'api')}/${uuid}`);
      return data.data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Lấy dữ liệu thất bại.' });
      return {};
    }
  },
  delete: async (uuid) => {
    try {
      const { data } = await axios.put(`${routerLinks(WarehousingBill.nameLink, 'api')}/delete?uuid=${uuid}`);
      if (data.message)
        await Message.success({ text: 'Xoá phiếu thành công', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getListProduct: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(WarehousingBill.nameLink, 'api')}/list-product`, { params });
      return data.data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Lấy dữ liệu thất bại.' });
      return {};
    }
  },
  getListInventoryControl: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('InventoryBill', 'api')}`, { params });
      return data.data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Lấy dữ liệu thất bại.' });
      return {};
    }
  },
  createOrSaveInventoryBill: async (params) => {
    try {
      const { data } = await axios.post(`${routerLinks('InventoryBill', 'api')}`, params);
      // if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return {};
    }
  },
  deleteInventoryBill: async (params) => {
    try {
      const { data } = await axios.put(`${routerLinks('InventoryBill', 'api')}/delete?uuid=${params}`);
      if (data.message)
        Message.success({ text: 'Xóa phiếu kiểm kho thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  startInventoryBill: async (params) => {
    try {
      const { data } = await axios.put(`${routerLinks('InventoryBill', 'api')}/start-inventory-bill?uuid=${params}`);
      if (data.message)
        // Message.success({ text: 'Kiểm kho thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
        return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  cancelInventoryBill: async (params) => {
    try {
      const { data } = await axios.put(`${routerLinks('InventoryBill', 'api')}/cancel-inventory-bill?uuid=${params}`);
      if (data.message)
        Message.success({ text: 'Hủy phiếu kiểm kho thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getDetailInventoryBill: async (uuid) => {
    try {
      const { data } = await axios.get(`${routerLinks('InventoryBill', 'api')}/${uuid}`);
      return data.data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Lấy dữ liệu thất bại.' });
      return {};
    }
  },
  getListWarehousingHistory: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(WarehousingBill.nameLink, 'api')}/warehousing-history`, {
        params,
      });
      return data.data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Lấy dữ liệu thất bại.' });
      return {};
    }
  },
};
