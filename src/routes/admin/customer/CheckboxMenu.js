import React from 'react';

import { Checkbox, Popover, Button, Menu } from 'antd';

const CheckboxMenu = (props) => {
  const { columns, setColumns } = props;
  const handleChange = (index) => {
    const newColums = [...columns];
    newColums[index].isShow = !newColums[index].isShow;
    setColumns(newColums);
  };

  const CheckboxRender = () => {
    return (
      <Menu>
        {columns.map(
          (props, index) =>
            props.isShowCheck && (
              <Menu.Item key={props.name}>
                <Checkbox onChange={() => handleChange(index)} checked={props.isShow}>
                  {props.title}
                </Checkbox>
              </Menu.Item>
            ),
        )}
      </Menu>
    );
  };
  return (
    <Popover content={<CheckboxRender />} trigger="click" placement="bottomLeft" type="primary">
      <Button className=" !border-gray-500 border !text-gray-500 !text-base font-medium">
        <span className="icon-gear pr-2 pl-1" />
        Hiển thị
      </Button>
    </Popover>
  );
};

export default CheckboxMenu;
