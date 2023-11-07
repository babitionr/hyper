import axios from 'axios';
import { routerLinks } from 'utils';
import { Message } from 'components';
// import moment from 'moment';

export const CustomerResourceService = {
  nameLink: 'CustomerResource',
  getList: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(CustomerResourceService.nameLink, 'api')}`, { params });
      return data?.data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Lấy dữ liệu thất bại.' });
      return [];
    }
  },
  create: async (params) => {
    try {
      const { data } = await axios.post(`${routerLinks(CustomerResourceService.nameLink, 'api')}/`, params);
      if (data.message)
        if (params.uuid)
          Message.success({
            text: 'Chỉnh sửa nguồn khách hàng thành công',
            title: 'Thành Công',
            cancelButtonText: 'Đóng',
          });
      if (!params.uuid)
        Message.success({ text: 'Tạo nguồn khách hàng thành công', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Tạo khách hàng thất bại.' });
      return {};
    }
  },
  getDetail: async (uuid) => {
    try {
      const { data } = await axios.get(`${routerLinks(CustomerResourceService.nameLink, 'api')}/${uuid}`);
      return data.data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Lấy thông tin nguồn khách hàng thất bại.' });
      return {};
    }
  },
  delete: async (params) => {
    try {
      const { data } = await axios.put(`${routerLinks(CustomerResourceService.nameLink, 'api')}/delete?uuid=${params}`);
      if (data.message)
        Message.success({
          text: 'Xóa thông tin nguồn khách hàng thành công',
          title: 'Thành Công',
          cancelButtonText: 'Đóng',
        });
      return true;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Xóa thông tin nguồn khách hàng thất bại.' });
      return {};
    }
  },
  getAllCustomerResourceList: async (branchUuid) => {
    try {
      const { data } = await axios.get(
        `${routerLinks(CustomerResourceService.nameLink, 'api')}/get-all?branchUuid=${branchUuid}`,
      );
      return data?.data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Lấy dữ liệu thất bại.' });
      return [];
    }
  },
};
