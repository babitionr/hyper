import { Popover, Button, Menu, Checkbox } from 'antd';
import React from 'react';

export const CheckboxMenu = ({ dataCheckBox, setDataCheckBox }) => {
  const CheckboxRender = () => {
    const handleChange = (index) => {
      const newColums = [...dataCheckBox];
      newColums[index].isShow = !newColums[index].isShow;
      setDataCheckBox(newColums);
    };
    return (
      <Menu>
        {dataCheckBox.map((props, index) => (
          <Menu.Item key={props.name}>
            <Checkbox onChange={() => handleChange(index)} checked={props.isShow}>
              {props.title}
            </Checkbox>
          </Menu.Item>
        ))}
      </Menu>
    );
  };

  return (
    <div>
      <Popover content={<CheckboxRender />} trigger="click" placement="bottomLeft" type="primary">
        <Button className=" !border-gray-500 border !text-gray-500 !text-base font-medium h-10 rounded-lg">
          <span className="icon-gear pr-2 pl-1" />
          Hiển thị
        </Button>
      </Popover>
    </div>
  );
};
