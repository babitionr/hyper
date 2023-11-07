import { Form, Input, InputNumber, Table } from 'antd';
import React, { useRef, useEffect, useState, useContext, useMemo } from 'react';
import { formatCurrency, routerLinks } from 'utils';
// import { v4 as uuidv4 } from 'uuid';
import './index.less';
import { formatPrice } from 'utils/func';
import moment from 'moment';
import { useNavigate } from 'react-router';

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

export const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  pageType,
  status,
  ...restProps
}) => {
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
      dataIndex === 'name' ? (
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
            onChange={(e) => handleSave({ ...record, [dataIndex]: e.target.value })}
            onBlur={save}
            placeholder="Nhập khoản thu nhập"
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
            min={0}
            onChange={(e) => {
              handleSave({ ...record, [dataIndex]: e });
            }}
            // onKeyDown={(e) => ![
            //   '0',
            //   '1',
            //   '2',
            //   '3',
            //   '4',
            //   '5',
            //   '6',
            //   '7',
            //   '8',
            //   '9',
            //   'Backspace',
            //   'Delete',
            //   ',',
            //   '.',
            //   'ArrowRight',
            //   'ArrowLeft',
            //   'Tab',
            //   'Ctrl',
            //   'C',
            //   'c',
            //   'V',
            //   'v',
            //   'A',
            //   'a',
            //   'X',
            //   'x',
            // ].includes(e.key) && e.preventDefault()}
            onKeyDown={(event) => {
              const key = event.key;

              // Kiểm tra xem phím ấn có phải là số hay không
              if (/[0-9]/.test(key)) {
                return true;
              }
              if (['Backspace', 'Delete', ',', 'ArrowRight', 'ArrowLeft', 'Tab'].includes(key)) {
                return true;
              }

              // Cho phép các thao tác copy (Ctrl+C), cut (Ctrl+X) và paste (Ctrl+V)
              if ((event.ctrlKey === true || event.metaKey === true) && (key === 'c' || key === 'v' || key === 'x')) {
                return true;
              }

              // Ngăn chặn các sự kiện không được phép
              event.preventDefault();
              return false;
            }}
            maxLength={16}
            onPressEnter={save}
            onBlur={save}
            placeholder="Nhập số tiền"
            className="percentInput h-9 !w-full !rounded-lg !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200"
          />
        </Form.Item>
      )
    ) : (
      <>
        {status === 'IN_PROCESS' ? (
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
                dataIndex === 'name'
                  ? children[1]
                  : children[1] < 0 || children[1] === undefined
                  ? undefined
                  : children[1] === null || children[1] === undefined
                  ? undefined
                  : formatCurrency(children[1], ' ')
              }
              placeholder={dataIndex === 'name' ? 'Nhập khoản thu nhập' : 'Nhập số tiền'}
              className="h-9 !w-full !rounded-[8px] !bg-white border border-gray-200 focus:!shadow-none focus:!border-gray-200 arrReadonly checkHidden"
            />
          </div>
        ) : (
          <div>
            {dataIndex === 'name'
              ? children[1]
              : children[1] < 0 || children[1] === undefined
              ? undefined
              : children[1] === null || children[1] === undefined
              ? undefined
              : formatCurrency(children[1], ' ')}
          </div>
        )}
      </>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const TableData = ({ loading, dataSource, setDataSource, pageType = 'create', status, filterDate }) => {
  const navigate = useNavigate();

  const dataTable = useMemo(() => {
    return dataSource;
  }, [dataSource]);

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setDataSource(newData);
  };

  const defaultColumns = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: 50,
      fixed: 'left',
      align: 'center',
      render: (value, record, index) => index + 1,
    },
    {
      title: 'Tên nhân viên',
      dataIndex: 'userName',
      width: 200,
      fixed: 'left',
      render: (value, record, index) => value,
    },
    {
      title: 'Chức vụ',
      dataIndex: 'userRole',
      width: 100,
      fixed: 'left',
    },
    {
      title: 'Mức lương',
      dataIndex: 'baseSalary',
      width: 150,
      align: 'start',
      render: (value) => formatPrice(Math.round(value)),
    },
    {
      title: 'Ngày công',
      dataIndex: 'workingDayQuantity',
      width: 150,
      align: 'start',
    },
    {
      title: 'Lương ngày công',
      dataIndex: 'salaryWorkingAmount',
      width: 150,
      align: 'start',
      render: (value) => formatPrice(Math.round(value)),
    },
    {
      title: 'Tăng ca',
      dataIndex: 'overTimeHours',
      width: 150,
      align: 'start',
      render: (value) => formatPrice(Math.round(value)),
    },
    {
      title: 'Tiền tăng ca',
      dataIndex: 'overTimeAmount',
      width: 150,
      align: 'start',
      render: (value) => formatPrice(Math.round(value)),
    },
    {
      title: '% Điều trị',
      dataIndex: 'treatmentAmount',
      width: 150,
      align: 'start',
      render: (value) => formatPrice(Math.round(value)),
    },
    {
      title: '% Tư vấn',
      dataIndex: 'adviseAmount',
      width: 150,
      align: 'start',
      render: (value) => formatPrice(Math.round(value)),
    },

    {
      title: 'Phụ cấp xác định',
      dataIndex: 'definiteAllowanceAmount',
      width: 150,
      align: 'start',
      render: (value) => formatPrice(Math.round(value)),
    },
    {
      title: 'Phụ cấp khác',
      dataIndex: 'otherAllowanceAmount',
      width: 150,
      align: 'start',
      editable: true,
    },
    {
      title: 'Thưởng',
      dataIndex: 'bonusAmount',
      width: 150,
      align: 'start',
      editable: true,
    },
    {
      title: 'Phụ cấp lễ tết',
      dataIndex: 'holidayAllowanceAmount',
      width: 150,
      align: 'start',
      editable: true,
    },
    {
      title: 'Hoa hồng',
      dataIndex: 'commissionAmount',
      width: 150,
      align: 'start',
      editable: true,
    },
    {
      title: 'Phạt',
      dataIndex: 'fineAmount',
      width: 150,
      align: 'start',
      editable: true,
    },
    {
      title: 'Tổng thu nhập',
      dataIndex: 'grossIncomeAmount',
      width: 150,
      align: 'start',
      render: (value, record) => {
        const total =
          Math.round(record.salaryWorkingAmount ?? 0) +
          Math.round(record.overTimeAmount ?? 0) +
          Math.round(record.treatmentAmount ?? 0) +
          Math.round(record.adviseAmount ?? 0) +
          Math.round(record.definiteAllowanceAmount ?? 0) +
          Math.round(record.otherAllowanceAmount ?? 0) +
          Math.round(record.bonusAmount ?? 0) +
          Math.round(record.holidayAllowanceAmount ?? 0) +
          Math.round(record.commissionAmount ?? 0) -
          Math.round(record.fineAmount ?? 0);
        record.grossIncomeAmoutTotal = total;
        return formatPrice(Math.round(total));
      },
    },
    {
      title: 'Thuế',
      dataIndex: 'taxAmount',
      width: 150,
      align: 'start',
      editable: true,
    },
    {
      title: 'BHXH',
      dataIndex: 'socialInsuranceAmount',
      width: 150,
      align: 'start',
      editable: true,
    },
    {
      title: 'Thực lãnh',
      dataIndex: 'netIncomeAmount',
      width: 150,
      align: 'start',
      render: (value, record) => {
        const total =
          Math.round(record.salaryWorkingAmount ?? 0) +
          Math.round(record.overTimeAmount ?? 0) +
          Math.round(record.treatmentAmount ?? 0) +
          Math.round(record.adviseAmount ?? 0) +
          Math.round(record.definiteAllowanceAmount ?? 0) +
          Math.round(record.otherAllowanceAmount ?? 0) +
          Math.round(record.bonusAmount ?? 0) +
          Math.round(record.holidayAllowanceAmount ?? 0) +
          Math.round(record.commissionAmount ?? 0) -
          Math.round(record.fineAmount ?? 0) -
          Math.round(record.taxAmount ?? 0) -
          Math.round(record.socialInsuranceAmount ?? 0);
        record.netIncomeAmount = total;
        return formatPrice(Math.round(total));
      },
    },
    {
      title: 'Tạm ứng',
      dataIndex: 'advanceAmount',
      width: 150,
      align: 'start',
      render: (value) => formatPrice(Math.round(value)),
    },
    {
      title: 'Còn lại',
      dataIndex: 'remain',
      width: 150,
      align: 'start',
      render: (value, record) => {
        const total = (record.netIncomeAmount ?? 0) - (record.advanceAmount ?? 0);
        record.netIncomeAmount = total;
        return formatPrice(Math.round(total));
      },
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
        status,
      }),
    };
  });

  return (
    <div className="w-full">
      <div className="flex justify-between mb-[18px]">
        <h2 className="text-base font-semibold"></h2>
      </div>

      <Table
        onRow={(record) => {
          return {
            onDoubleClick: () => {
              if (!record.uuid || status === 'IN_PROCESS') {
                return navigate(
                  routerLinks('SalaryDetail') +
                    `?uuid=${record.userUuid}&month=${moment(filterDate.date).format('MM/YYYY')}&status=${status}`,
                );
              } else {
                return navigate(
                  routerLinks('SalaryDetail') +
                    `?uuid=${record.uuid}&month=${moment(filterDate.date).format('MM/YYYY')}&status=${status}`,
                );
              }
            },
          };
        }}
        className={`w-full stickyTableSalary product-price-table `}
        components={components}
        rowClassName={() => 'editable-row'}
        dataSource={dataTable}
        columns={columns}
        pagination={false}
        scroll={{ x: 1600, y: null }}
        size="small"
        loading={loading}
        sticky
      />
    </div>
  );
};

export default TableData;
