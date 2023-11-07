import axios from 'axios';
import { routerLinks } from 'utils';
import { Message } from 'components';
// import moment from 'moment';

export const UserManagementService = {
  nameLink: 'UserManagement',
  getList: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(UserManagementService.nameLink, 'api')}/list`, { params });
      return data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Lấy dữ liệu thất bại.' });
      return [];
    }
  },
  create: async (params) => {
    try {
      const { data } = await axios.post(`${routerLinks(UserManagementService.nameLink, 'api')}/create`, params);
      if (data.message)
        Message.success({ text: 'Tạo người dùng thành công!', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  update: async (params) => {
    try {
      const { data } = await axios.put(`${routerLinks(UserManagementService.nameLink, 'api')}/update`, params);
      if (data?.message)
        Message.success({
          text: 'Chỉnh sửa thông tin người dùng thành công!',
          title: 'Thành Công',
          cancelButtonText: 'Đóng',
        });
      return true;
    } catch (e) {
      console.error(e);
      if (e?.response?.data?.message) Message?.error({ text: 'Sửa thông tin khách hàng thất bại.' });
      return false;
    }
  },
  getDetail: async (id) => {
    try {
      const { data } = await axios.get(`${routerLinks(UserManagementService.nameLink, 'api')}/detail?id=${id}`);
      return data.data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Sửa thông tin khách hàng thất bại.' });
      return {};
    }
  },
  getListAllUser: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(UserManagementService.nameLink, 'api')}/all`);
      return data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Lấy dữ liệu thất bại.' });
      return [];
    }
  },
  delete: async (params) => {
    try {
      const { data } = await axios.delete(`${routerLinks(UserManagementService.nameLink, 'api')}/delete/${params}`);
      if (data)
        Message.success({ text: 'Xóa người dùng thành Công', title: 'Xóa Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getListAllPosition: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('Master', 'api')}/position/all`);
      return data?.data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Lấy dữ liệu thất bại.' });
      return [];
    }
  },

  // getListTreatmentHistory: async (params) => {
  //   try {
  //     // const { data } = await axios.get(`${routerLinks(CustomerService.nameLink, "api")}/login`, values);

  //     const treatmentHistoryArr = []
  //     for (let i = 0; i < 10; i++) {
  //       treatmentHistoryArr.push({
  //         id: i,
  //         date: moment(new Date()).format('DD/MM/YYYY'),
  //         service: 'Niềng răng',
  //         treatmentSlip: 'SO00001',
  //         quantity: 1,
  //         basicUnit: 'cái',
  //         totalPrice: '5.000.000',
  //         payment: '2.000.000',
  //         remaining: '3.000.000',
  //         tooth: 'Nguyên hàm',
  //         doctor: 'Nguyễn Văn Tài',
  //         diagnostic: 'Răng không đều',
  //         status: 'Đang điều trị'
  //       })
  //     }
  //     return {
  //       data: treatmentHistoryArr || [],
  //       count: 9
  //     };

  //   } catch (e) {
  //     console.error(e);
  //     if (e.response.data.message) Message.error({ text: e.response.data.message });
  //     return false;
  //   }
  // }
};
