import axios from 'axios';
import { routerLinks } from 'utils';
import { Message } from 'components';
import { toast } from 'react-toastify';

export const CameraService = {
  nameLink: 'Camera',
  getStatistic: async (values, branchUuid) => {
    try {
      const { data } = await axios.post(
        `${routerLinks(CameraService.nameLink, 'api')}/${branchUuid}/statistic`,
        values,
      );

      return {
        data: data?.data || {},
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
  addCamPerson: async (values) => {
    try {
      const { data } = await axios.post(`${routerLinks(CameraService.nameLink, 'api')}/save`, values);
      if (data.statusCode === 200)
        Message.success({ text: 'Cập nhật FaceId thành công.', title: 'Thành Công', cancelButtonText: 'Đóng' });
      return {
        data: data?.data || {},
      };
    } catch (e) {
      if (e.response.data.message) Message.error({ text: e.response.data.message });
      return false;
    }
  },
  getListCamEvent: async (params, branchUuid) => {
    try {
      const { data } = await axios.get(`${routerLinks(CameraService.nameLink, 'api')}/list/${branchUuid}`, { params });
      return {
        data: data?.data,
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
};
