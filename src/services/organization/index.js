import axios from 'axios';
import { routerLinks } from 'utils';
import { Message } from 'components';
import { linkApi } from 'variable';

export const OrganizationService = {
  nameLink: 'Organization',
  uploadImage: async (file, type) => {
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    // bodyFormData.append('type', type);
    try {
      const { data } = await axios.post(linkApi + '/file/upload', bodyFormData);
      return data?.data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  uploadContract: async (file, type) => {
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    // bodyFormData.append('type', type);
    try {
      const { data } = await axios.post(linkApi + '/file/private/upload', bodyFormData);
      return data?.data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getViewUrl: async (params) => {
    try {
      const { data } = await axios.get(`${linkApi}/file/view/${params}`);
      return data?.data || '';
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getListOrganization: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(OrganizationService.nameLink, 'api')}/list`, { params });
      return data?.data || [];
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  createOrganization: async (params) => {
    try {
      const { data } = await axios.post(`${routerLinks(OrganizationService.nameLink, 'api')}/create`, params);
      if (data.message)
        Message.success({ text: 'Tạo tổ chức thành công!', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getDetailOrganization: async (id) => {
    try {
      const { data } = await axios.get(`${routerLinks(OrganizationService.nameLink, 'api')}/detail/${id}`);
      return data.data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Sửa thông tin khách hàng thất bại.' });
      return {};
    }
  },
  updateOrganization: async (params) => {
    try {
      const { data } = await axios.put(`${routerLinks(OrganizationService.nameLink, 'api')}/update`, params);
      if (data.message)
        Message.success({ text: 'Chỉnh sửa tổ chức thành công!', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Sửa tổ chức thất bại.' });
      return false;
    }
  },
  activeOrDeactiveOrganization: async (params) => {
    try {
      const { data } = await axios.put(
        `${routerLinks(OrganizationService.nameLink, 'api')}/activate-or-deactivate/${params.uuid}`,
      );
      if (data.message)
        if (params.isActive) {
          Message.success({ text: 'Khóa tổ chức thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
        }
      if (!params.isActive) {
        Message.success({ text: 'Mở khoá tổ chức thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
      }
      return true;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  approveOrganization: async (params) => {
    try {
      const { data } = await axios.put(`${routerLinks(OrganizationService.nameLink, 'api')}/approve/${params?.uuid}`);
      if (data.message)
        Message.success({ text: 'Phê duyệt tổ chức thành công!', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
};
