import axios from 'axios';
import { routerLinks } from 'utils';
import { Message } from 'components';

export const ToothDiagnosis = {
  nameLink: 'ToothDiagnosis',
  getToothDiagnosisList: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks(ToothDiagnosis.nameLink, 'api')}/get-all`, { params });
      return data.data;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: 'Lấy dữ liệu thất bại.' });
      return [];
    }
  },
  post: async (values, id) => {
    try {
      await axios.post(`${routerLinks(ToothDiagnosis.nameLink, 'api')}/`, values);
      // if (data.message) Message.success({ text: 'Chỉnh sửa nhà cung cấp thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  // getDetail: async (id) => {
  //   try {
  //     const { data } = await axios.get(`${routerLinks(CustomerService.nameLink, "api")}/${id}`);
  //     return data.data;

  //   } catch (e) {
  //     console.error(e);
  //     if (e.response.data.message) Message.error({ text: 'Sửa thông tin khách hàng thất bại.' });
  //     return {};
  //   }
  // },
  // delete: async (params) => {
  //   try {
  //     const { data } = await axios.put(`${routerLinks(CustomerService.nameLink, "api")}/delete?uuid=${params}`);
  //     if (data.message) Message.success({ text: data.message, title: 'Xóa Thành Công', cancelButtonText: 'Đóng' });
  //     return data.data;

  //   } catch (e) {
  //     console.error(e);
  //     if (e.response.data.message) Message.error({ text: 'Xóa thông tin khách hàng thất bại.' });
  //     return {};
  //   }
  // },
  // update: async (params) => {
  //   try {
  //     const { data } = await axios.put(`${routerLinks(CustomerService.nameLink, "api")}/`, params);
  //     if (data.message) Message.success({ text: data.message, title: 'Thành Công', cancelButtonText: 'Đóng' });
  //     return data.data;

  //   } catch (e) {
  //     console.error(e);
  //     if (e.response.data.message) Message.error({ text: 'Sửa thông tin khách hàng thất bại.' });
  //     return {};
  //   }
  // },
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
