import axios from 'axios';

import { routerLinks } from 'utils';
import { Message } from 'components';
// import { UserService } from 'services/user';

// const api = axios.create({
// });

// api.interceptors.request.use(request => {
//   request.headers.common.Authorization = `Bearer ${'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbl9kZ2FyaSIsImV4cCI6MTY5NTAxODMxMiwiaWF0IjoxNjk0OTMxOTEyfQ.G9yfP9lwKR0d4O1ZgVU7O9ShcF6NG1QMwpzP4jcy1SKlendLBIYufzT2RMzCTnvwWnE0Uzn2IkUr0MKc_JRNig'}`;
//   return request;
// });
// api.interceptors.response.use(
//   response => {
//     return response;
//   },
//   async (error) => {
//     if (error.response) {
//       if (error.response.status === 401) {
//         const originalRequest = error.config;
//       await UserService.refreshToken();
//       await api(originalRequest);
//       window.location.reload();
//       }
//     }
//     return error;
//   }
// );

export const PublicService = {
  nameLink: 'Publish',

  getListProvices: async (params) => {
    try {
      const { data } = await axios.get(`${routerLinks('Publish', 'api')}/province/all`, {
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
      const { data } = await axios.get(`${routerLinks('Publish', 'api')}/district/all`, {
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
      const { data } = await axios.get(`${routerLinks('Publish', 'api')}/ward/all`, {
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
  createOrganization: async (params) => {
    try {
      // const { data } =
      await axios.post(`${routerLinks('Publish', 'api')}/organization/register`, params);
      // if (data.message)
      //   Message.success({ text: 'Tạo phòng khám thành công!', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return true;
    } catch (e) {
      console.error(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  uploadPublic: async (file, type) => {
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    // bodyFormData.append('type', type);
    try {
      const { data } = await axios.post(routerLinks('Publish', 'api') + '/upload', bodyFormData);
      return data?.data;
    } catch (e) {
      console.log(e);
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
};
