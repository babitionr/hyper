// import { CSVLink } from 'react-csv';
import { Button } from 'antd';
import moment from 'moment';
import React from 'react';
import { utils, writeFile } from 'xlsx';

export const Export = (props) => {
  // eslint-disable-next-line no-unused-vars
  const { data, headers } = props;

  const handleOnExport = () => {
    const dataExcel = data.map((e) => {
      const res = {
        ...e,
        dateOfBirth: moment(e.dateOfBirth).format('DD/MM/YYYY'),
        age: new Date().getFullYear() - moment(e.dateOfBirth).format('YYYY'),
      };
      if (res.treatmentStatus === 'NOT_TREAT') {
        res.treatmentStatus = 'Chưa điều trị';
      }
      if (res.treatmentStatus === 'TREAT') {
        res.treatmentStatus = 'Đã điều trị';
      }
      if (res.treatmentStatus === 'TREATING') {
        res.treatmentStatus = 'Đang điều trị';
      }
      delete res.uuid;
      delete res.treatmentDate;
      delete res.appointmentDate;
      delete res.createdAgency;
      headers.map((e) => {
        if (!e.isShow) delete res[`${e.key}`];
        return !e.isShow;
      });
      return res;
    });

    const Heading = [[]];
    headers.forEach((e) => {
      if (e.isShow) {
        Heading[0].push(e.label);
      }
    });

    // const Heading = [
    //   [
    //     'Họ và tên',
    //     'Điện thoại',
    //     'Ngày sinh',
    //     'Tuổi',
    //     // 'Ngày hẹn gần nhất',
    //     // 'Ngày điều trị gần nhất',
    //     'Tình trạng điều trị',
    //     'Dự kiến thu',
    //     'Công nợ',
    //     // 'Thẻ thành viên',
    //     // 'Nhãn khách hàng',
    //     // 'Chi nhánh tạo',
    //   ],
    // ];
    const wb = utils.book_new();
    utils.sheet_add_aoa(wb, Heading);

    // const ws = utils.json_to_sheet(data);
    const ws = utils.sheet_add_json(wb, dataExcel, { origin: 'A2', skipHeader: true, skipcolumn: 1 });
    utils.book_append_sheet(wb, ws, 'Sheet1');
    writeFile(wb, 'Time Detail Report.xlsx');
  };
  return (
    // <CSVLink filename={'Time Detail Report.csv'} data={data} headers={headers} >
    //   <Button className=" !border-gray-500 border !text-gray-500 !text-base font-medium ">
    //     <span className="icon-download pr-2 pl-1" />
    //     Export
    //   </Button>
    // </CSVLink>
    <span>
      <Button
        className=" !border-gray-500 border !text-gray-500 !text-base font-medium "
        onClick={() => {
          handleOnExport();
        }}
      >
        <span className="icon-download pr-2 pl-1" />
        Xuất file
      </Button>
    </span>
  );
};
