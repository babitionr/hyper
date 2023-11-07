import axios from 'axios';
import { routerLinks } from 'utils';
import { Message } from 'components';
import { toast } from 'react-toastify';

export const InventoryCriteriaService = {
  nameLink: 'InventoryCriteria',
  get: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(InventoryCriteriaService.nameLink, 'api')}`, {
        params,
      });
      return {
        data: data?.data?.content || [],
        count: data?.data?.totalElements,
      };
    } catch (e) {
      if (e.response.data.message)
        toast.error(e.response.data.message, {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
        });
      return false;
    }
  },
  getAll: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(InventoryCriteriaService.nameLink, 'api')}/get-all-by-branch`, {
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
  getById: async (id) => {
    try {
      const { data } = await axios.get(`${routerLinks(InventoryCriteriaService.nameLink, 'api')}/${id}`);
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
      const { data } = await axios.post(`${routerLinks(InventoryCriteriaService.nameLink, 'api')}`, values);
      if (data.message)
        Message.success({ text: 'Tạo tiêu chí kiểm kho thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  put: async (values, id) => {
    try {
      const { data } = await axios.post(`${routerLinks(InventoryCriteriaService.nameLink, 'api')}`, values);
      if (data.message)
        Message.success({
          text: 'Chỉnh sửa tiêu chí kiểm kho thành công.',
          title: 'Thành Công',
          cancelButtonText: 'Đóng',
        });
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },

  delete: async (params) => {
    try {
      const { data } = await axios.put(
        `${routerLinks(InventoryCriteriaService.nameLink, 'api')}/delete?uuid=${params}`,
      );
      if (data.message)
        Message.success({ text: 'Xóa tiêu chí kiểm kho thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
};
