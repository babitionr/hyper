import axios from 'axios';
import { routerLinks } from 'utils';
import { Message } from 'components';
// import moment from 'moment';

export const CustomerGroupService = {
  nameLink: 'CustomerGroup',
  getList: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(CustomerGroupService.nameLink, 'api')}`, { params });
      return data?.data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Lấy dữ liệu thất bại.' });
      return [];
    }
  },
  create: async (params) => {
    try {
      const { data } = await axios.post(`${routerLinks(CustomerGroupService.nameLink, 'api')}/`, params);
      if (data.message)
        if (params.uuid)
          Message.success({
            text: 'Chỉnh sửa nhóm khách hàng thành công',
            title: 'Thành Công',
            cancelButtonText: 'Đóng',
          });
      if (!params.uuid)
        Message.success({ text: 'Tạo nhóm khách hàng thành công', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Tạo khách hàng thất bại.' });
      return {};
    }
  },
  getDetail: async (uuid) => {
    try {
      const { data } = await axios.get(`${routerLinks(CustomerGroupService.nameLink, 'api')}/${uuid}`);
      return data.data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Sửa thông tin khách hàng thất bại.' });
      return {};
    }
  },
  delete: async (params) => {
    try {
      const { data } = await axios.put(`${routerLinks(CustomerGroupService.nameLink, 'api')}/delete?uuid=${params}`);
      if (data.message)
        Message.success({ text: 'Xóa thông tin khách hàng thành công', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Xóa thông tin khách hàng thất bại.' });
      return {};
    }
  },
  getAllCustomerGroupList: async (branchUuid) => {
    try {
      const { data } = await axios.get(
        `${routerLinks(CustomerGroupService.nameLink, 'api')}/get-all?branchUuid=${branchUuid}`,
      );
      return data?.data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Lấy dữ liệu thất bại.' });
      return [];
    }
  },
};
