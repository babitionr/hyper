import { Button } from 'antd';
import React from 'react';
import { utils, writeFile } from 'xlsx';

export const Export = (props) => {
  const { data, dataCheckBox } = props;

  const handleOnExport = () => {
    const dataExcel = data.map((e) => {
      const res = { ...e };
      if (dataCheckBox?.filter((ele) => ele.name === 'origin')[0]?.isShow === false) {
        delete res.origin;
      }
      if (dataCheckBox?.filter((ele) => ele.name === 'expiredDays')[0]?.isShow === false) {
        delete res.expiredDays;
      }
      if (dataCheckBox?.filter((ele) => ele.name === 'averageQuantity')[0]?.isShow === false) {
        delete res.averageQuantity;
      }
      if (dataCheckBox?.filter((ele) => ele.name === 'minimumLossAmount')[0]?.isShow === false) {
        delete res.minimumLossAmount;
      }
      if (dataCheckBox?.filter((ele) => ele.name === 'costPrice')[0]?.isShow === false) {
        delete res.costPrice;
      }
      delete res.id;
      return res;
    });

    const initHeaders = [
      {
        '': 'Tên sản phẩm	',
        ' ': 'Xuất xứ',
        '        ': 'Thời hạn sử dụng',
        '         ': 'Lượng xuất trung bình',
        '          ': 'Đơn vị tính',
        'Tồn đầu kỳ': 'Số lượng',
        '  ': 'Thành tiền',
        'Nhập trong kỳ	': 'Số lượng',
        '   ': 'Thành tiền',
        'Xuất trong kỳ	': 'Số lượng',
        '    ': 'Thành tiền',
        'Tồn cuối kỳ': 'Số lượng',
        '     ': 'Thành tiền',
        '      ': 'Giá vốn hiện tại	',
        '       ': 'Mức tồn tối thiểu',
      },
    ];
    const heading = initHeaders.map((e) => {
      const res = { ...e };
      if (dataCheckBox?.filter((ele) => ele.name === 'origin')[0]?.isShow === false) {
        delete res[' '];
      }
      if (dataCheckBox?.filter((ele) => ele.name === 'expiredDays')[0]?.isShow === false) {
        delete res['        '];
      }
      if (dataCheckBox?.filter((ele) => ele.name === 'averageQuantity')[0]?.isShow === false) {
        delete res['         '];
      }
      if (dataCheckBox?.filter((ele) => ele.name === 'minimumLossAmount')[0]?.isShow === false) {
        delete res['      '];
      }
      if (dataCheckBox?.filter((ele) => ele.name === 'costPrice')[0]?.isShow === false) {
        delete res['       '];
      }
      return res;
    });

    const wb = utils.book_new();

    utils.sheet_add_json(wb, heading);

    // const ws = utils.json_to_sheet(data);
    const ws = utils.sheet_add_json(wb, dataExcel, { origin: 'A3', skipHeader: true, skipcolumn: 1 });

    const dataCheckBoxLength = dataCheckBox?.filter(
      (ele) =>
        (ele.name === 'origin' && ele.isShow === true) ||
        (ele.name === 'expiredDays' && ele.isShow === true) ||
        (ele.name === 'averageQuantity' && ele.isShow === true),
    ).length;
    const merge = [
      { s: { r: 0, c: 2 + dataCheckBoxLength }, e: { r: 0, c: 3 + dataCheckBoxLength } },
      { s: { r: 0, c: 4 + dataCheckBoxLength }, e: { r: 0, c: 5 + dataCheckBoxLength } },
      { s: { r: 0, c: 6 + dataCheckBoxLength }, e: { r: 0, c: 7 + dataCheckBoxLength } },
      { s: { r: 0, c: 8 + dataCheckBoxLength }, e: { r: 0, c: 9 + dataCheckBoxLength } },
    ];
    ws['!merges'] = merge;

    // const merge = [
    //   { s: { r: 0, c: 2 }, e: { r: 0, c: 3 } },{ s: { r: 0, c: 4 }, e: { r: 0, c: 5 } },{ s: { r: 0, c: 6 }, e: { r: 0, c: 7 } },{ s: { r: 0, c: 8 }, e: { r: 0, c: 9 } }
    // ];
    // ws["!merges"] = merge;

    utils.book_append_sheet(wb, ws, 'Sheet1');
    writeFile(wb, 'Export-Import-Exist.xlsx');
  };
  return (
    <span>
      <Button
        className=" !border-gray-500 border !text-gray-500 !text-base h-10 rounded-lg font-medium "
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
