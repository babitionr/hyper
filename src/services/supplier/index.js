import axios from 'axios';
import { routerLinks } from 'utils';
import { Message } from 'components';

export const SupplierService = {
  nameLink: 'Supplier',
  get: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(SupplierService.nameLink, 'api')}/list`, {
        params,
      });

      return {
        data: data?.data?.content || [],
        count: data?.data?.totalElements ?? 14,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return [];
    }
  },
  getAll: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(SupplierService.nameLink, 'api')}/all`, {
        params,
      });

      return {
        data: data?.data || [],
        count: data?.data?.totalElements ?? 14,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getById: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(SupplierService.nameLink, 'api')}/detail`, {
        params,
      });
      return {
        ...data?.data,
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  post: async (values) => {
    try {
      const { data } = await axios.post(`${routerLinks(SupplierService.nameLink, 'api')}/create`, values);
      if (data.message)
        Message.success({ text: 'Tạo nhà cung cấp thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  update: async (values, id) => {
    try {
      const { data } = await axios.put(`${routerLinks(SupplierService.nameLink, 'api')}/update`, values);
      if (data.message)
        Message.success({ text: 'Chỉnh sửa nhà cung cấp thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  activeSupplier: async (uuid) => {
    try {
      await axios.put(`${routerLinks(SupplierService.nameLink, 'api')}/active/${uuid}`);
      return true;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  delete: async (uuid) => {
    try {
      const { data } = await axios.delete(`${routerLinks(SupplierService.nameLink, 'api')}/delete/${uuid}`);
      if (data.message)
        await Message.success({ text: 'Xoá nhà cung cấp thành công', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },

  getListProvices: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('Master', 'api')}/province/all`, {
        params,
      });

      return {
        data: data?.data || [],
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getListDistricts: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('Master', 'api')}/district/all`, {
        params,
      });
      return {
        data: data?.data || [],
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getListWards: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('Master', 'api')}/ward/all`, {
        params,
      });
      return {
        data: data?.data || [],
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getBrandHeader: async () => {
    try {
      const { data } = await axios.get(`${routerLinks('Branch', 'api')}`);
      return {
        data: data?.data || [],
      };
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
};
