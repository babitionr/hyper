import axios from 'axios';
import { routerLinks } from 'utils';
import { Message } from 'components';
import { toast } from 'react-toastify';

export const SalaryService = {
  nameLink: 'Salary',
  get: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(SalaryService.nameLink, 'api')}`, {
        params,
      });
      return {
        data: data?.data || [],
        count: data?.data?.length ?? 0,
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
  checkExistSalary: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(SalaryService.nameLink, 'api')}/check-exist-salary`, {
        params,
      });
      return {
        data: data?.data,
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getByUuid: async (uuid) => {
    try {
      const { data } = await axios.get(`${routerLinks(SalaryService.nameLink, 'api')}/${uuid}`);
      return {
        data: data?.data,
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getDetailSalaryConfirmed: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(SalaryService.nameLink, 'api')}/get-detail`, { params });
      return {
        data: data?.data,
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getDetailSalaryUnconfirmed: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(SalaryService.nameLink, 'api')}/get-detail-by-user`, { params });
      return {
        data: data?.data,
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  post: async (values) => {
    try {
      const { data } = await axios.post(`${routerLinks(SalaryService.nameLink, 'api')}`, values);
      if (data.message)
        // Message.success({ text: 'Xác nhận thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
        return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  confirm: async (uuid) => {
    try {
      const { data } = await axios.put(`${routerLinks(SalaryService.nameLink, 'api')}/confirm/${uuid}`);
      if (data.message)
        Message.success({ text: 'Xác nhận bảng lương thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  cancel: async (uuid) => {
    try {
      const { data } = await axios.put(`${routerLinks(SalaryService.nameLink, 'api')}/cancel/${uuid}`);
      if (data.message)
        Message.success({ text: 'Hủy xác nhận bảng lương thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return data;
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
};
