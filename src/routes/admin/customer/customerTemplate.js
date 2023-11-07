import { Button } from 'antd';
import React from 'react';
import { OrganizationService } from 'services/organization';

export const CustomerTemplate = () => {
  // eslint-disable-next-line no-unused-vars
  const handleDownload = async () => {
    const data = await OrganizationService.getViewUrl('1683823989842-customer-template.csv');
    const element = document.createElement('a');
    element.href = data;
    element.click();
  };

  return (
    <span>
      <Button
        className=" !border-gray-500 border !text-gray-500 !text-base font-medium "
        onClick={() => {
          handleDownload();
        }}
      >
        <span className="icon-download pr-2 pl-1" />
        Tải template
      </Button>
    </span>
  );
};
