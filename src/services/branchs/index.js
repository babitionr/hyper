import axios from 'axios';
import { routerLinks } from 'utils';
import { Message } from 'components';

export const BranchsService = {
  nameLink: 'Branch',
  getAll: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(BranchsService.nameLink, 'api')}/all`);
      return data?.data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return [];
    }
  },
  get: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(BranchsService.nameLink, 'api')}/list`, {
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
  getById: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(BranchsService.nameLink, 'api')}/detail`, {
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
      const { data } = await axios.post(`${routerLinks(BranchsService.nameLink, 'api')}/create`, values);
      // if (data.message) Message.success({ text: 'Tạo chi nhánh thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  put: async (values, id) => {
    try {
      const { data } = await axios.put(`${routerLinks(BranchsService.nameLink, 'api')}/update`, values);
      // if (data.message) Message.success({ text: 'Chỉnh sửa chi nhánh thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  activeBranch: async (id) => {
    try {
      const { data } = await axios.put(`${routerLinks(BranchsService.nameLink, 'api')}/active/${id}`);
      if (data.message)
        Message.success({ text: 'Khóa chi nhánh thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  unClockBranch: async (id) => {
    try {
      const { data } = await axios.put(`${routerLinks(BranchsService.nameLink, 'api')}/active/${id}`);
      if (data.message)
        Message.success({ text: 'Mở khóa chi nhánh thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  delete: async (id) => {
    try {
      const { data } = await axios.delete(`${routerLinks(BranchsService.nameLink, 'api')}/delete/${id}`);
      if (data.message)
        await Message.success({ text: 'Xóa chi nhánh thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
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
