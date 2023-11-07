import { Form, Input, InputNumber, Table } from 'antd';
// import { Message } from 'components';
import React, { useRef, useEffect, useState, useContext, useMemo } from 'react';
import { formatCurrency } from 'utils';
import './index.less';
import { blockInvalidChar, formatPrice, isNullOrUndefinedOrEmpty } from 'utils/func';

const EditableContext = React.createContext(null);

export const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

export const EditableCell = ({ title, editable, children, dataIndex, record, handleSave, pageType, ...restProps }) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      dataIndex === 'note' ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
        >
          <Input
            readOnly={pageType === 'detail'}
            ref={inputRef}
            onPressEnter={save}
            onChange={(e) => handleSave({ ...record, content: e.target.value })}
            onBlur={save}
            placeholder="Nhập nội dung"
            className=" h-9 !w-full !rounded-lg !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200"
          />
        </Form.Item>
      ) : (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
        >
          <InputNumber
            // type="number"
            readOnly={pageType === 'detail'}
            ref={inputRef}
            formatter={(value) => {
              if (!value) {
                return;
              }
              return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            }}
            parser={(value) => {
              if (!value) {
                return;
              }
              return Number.parseFloat(value.replace(/\$\s?|(\.*)/g, ''));
            }}
            onChange={(e) => {
              handleSave({ ...record, paymentAmount: e });
            }}
            onKeyDown={blockInvalidChar}
            onPressEnter={save}
            onBlur={save}
            placeholder="Nhập số tiền"
            className="percentInput h-9 !w-[176px] !rounded-lg !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200"
          />
        </Form.Item>
      )
    ) : (
      <>
        {pageType === 'create' && (
          <div
            onKeyPress={(e) => {
              if (e.key) {
                toggleEdit();
              }
            }}
            onKeyDown={(e) => {
              if (e.key) {
                toggleEdit();
              }
            }}
            onClick={toggleEdit}
          >
            <Input
              value={
                dataIndex === 'note'
                  ? children[1]
                  : children[1] < 0 || children[1] === undefined
                  ? undefined
                  : children[1] === null || children[1] === undefined
                  ? undefined
                  : formatCurrency(children[1], ' ')
              }
              placeholder={dataIndex === 'note' ? 'Nhập nội dung' : 'Nhập số tiền'}
              className="h-9 !w-[176px] !rounded-[8px] !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200 arrReadonly checkHidden"
            />
          </div>
        )}
        {pageType === 'edit' && (
          <div
            onKeyPress={(e) => {
              if (e.key) {
                toggleEdit();
              }
            }}
            onKeyDown={(e) => {
              if (e.key) {
                toggleEdit();
              }
            }}
            onClick={toggleEdit}
          >
            <Input
              onKeyDown={blockInvalidChar}
              value={
                dataIndex === 'note'
                  ? children[1]
                  : children[1] < 0 || children[1] === undefined
                  ? undefined
                  : children[1] === null || children[1] === undefined
                  ? undefined
                  : formatCurrency(children[1], ' ')
              }
              placeholder={dataIndex === 'note' ? 'Nhập nội dung' : 'Nhập số tiền'}
              className="h-9 !w-[176px] !rounded-lg !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200 arrReadonly  checkHidden"
            />
          </div>
        )}
        {pageType === 'detail' && (
          <div className="ml-4">{dataIndex === 'note' ? children : formatCurrency(children[1] || 0, '')}</div>
        )}
      </>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const TableData = ({ dataSource, setDataSource, pageType = 'create' }) => {
  const dataTable = useMemo(() => {
    return dataSource;
  }, [dataSource]);

  const totalPrice = dataSource.reduce((arr, cur) => {
    if (isNullOrUndefinedOrEmpty(cur.returnPrice)) {
      return arr;
    }
    return arr + cur.returnPrice;
  }, 0);

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setDataSource(newData);
  };

  const defaultColumns = [
    {
      title: 'Dịch vụ',
      dataIndex: 'serviceName',
      align: 'start',
      width: '35%',
    },
    {
      title: 'Thành tiền',
      dataIndex: 'totalPaymentAmount',
      render: (value, record, index) => (value ? formatPrice(value) + ' VND' : '0 VND'),
      width: '15%',
    },
    {
      title: 'Đã trả',
      dataIndex: 'paidAmount',
      render: (value, record, index) => (value ? formatPrice(value) + ' VND' : '0 VND'),
      width: '15%',
    },
    {
      title: 'Còn lại',
      dataIndex: 'returnPrice',
      render: (value, record, index) => (value ? formatPrice(value) + ' VND' : '0 VND'),
      width: '15%',
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paymentAmount',
      editable: true,
      width: '20%',
    },
  ];

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
        pageType,
      }),
    };
  });

  return (
    <div className="border border-gray-300 rounded-lg p-4">
      <Table
        className={`w-full product-price-table `}
        components={components}
        rowClassName={() => 'editable-row'}
        dataSource={dataTable}
        columns={columns}
        pagination={false}
        scroll={{ x: '100%', y: null }}
        size="small"
      />

      <div className="flex justify-end mt-5">
        <div className="flex items-center">
          <span className="mr-9 font-semibold">Tổng tiền cần thanh toán:</span>
          <span className="font-semibold"> {formatCurrency(totalPrice, ' VNĐ')}</span>
        </div>
      </div>
    </div>
  );
};

export default TableData;
