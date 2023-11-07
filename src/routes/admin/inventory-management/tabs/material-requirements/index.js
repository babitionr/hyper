import React, { useEffect } from 'react';
import { HookDataTable } from 'hooks';
import { ColumnMaterialRequirements } from '../../columns/columnMaterialRequirements';
import { Select, DatePicker } from 'antd';

export const MaterialRequirements = () => {
  const { Option } = Select;
  const { RangePicker } = DatePicker;

  const [handleChange, DataTable] = HookDataTable({
    columns: ColumnMaterialRequirements(),
    loadFirst: false,
    rightHeader: (
      <div className="flex gap-5">
        <RangePicker
          clearIcon={
            <div className="mr-[5px]">
              <svg
                viewBox="64 64 896 896"
                focusable="false"
                data-icon="close-circle"
                width="1em"
                height="1em"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"></path>
              </svg>
            </div>
          }
          placeholder={['DD/MM/YYYY', 'DD/MM/YYYY']}
          className="items-stretch border rounded-lg !bg-white border-gray-200 !w-80"
          format="DD/MM/YYYY"
          onChange={(dates, dateStrings) => {
            if (dates) {
              console.log(dateStrings[0], '-', dateStrings[1]);
            }
          }}
        />
        <Select className="!w-72 !rounded-lg" placeholder="Trạng thái" allowClear>
          <Option value="WORKING">Đang yêu cầu</Option>
          <Option value="NOT_TREAT">Đã xuất</Option>
        </Select>
      </div>
    ),
  });
  useEffect(() => {
    handleChange();
  }, []);
  return (
    <div className="bg-white rounded-lg">
      <div className="p-2">{DataTable()}</div>
    </div>
  );
};
