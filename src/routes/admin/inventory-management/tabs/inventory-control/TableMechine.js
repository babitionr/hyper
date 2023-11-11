import React, { useState, useEffect, useRef, useContext } from 'react';
import { HookDataTable } from 'hooks';
// import classNames from 'classnames';
import { useSearchParams } from 'react-router-dom';
// import { MasterDataService } from 'services/master-data-service';
import { Form, Input, Table, Tooltip, Popconfirm, Tabs, InputNumber } from 'antd';
// import EditIcon from 'assets/svg/edit.js';
// import RemoveIcon from 'assets/svg/remove.js';
import { MaterialMedicineService } from 'services/material-medicine';
import '../../index.less';
import { WarehousingBill } from 'services/warehousing-bill';
import { ColumnTableStatusCompleted } from '../../columns/columnTableStatusCompleted';
import { exportIcons, formatCurrency } from 'utils';

const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell = ({ title, editable, children, dataIndex, record, handleSave, ...restProps }) => {
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
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

export const TableWarehousingProduct = ({ warehousingProductDtoList, setWarehousingProductDtoList }) => {
  const [searchParams] = useSearchParams();
  const uuid = searchParams.get('uuid');
  const status = searchParams.get('status');
  const [dataWarehousingProductDtoList, setDataWarehousingProductDtoList] = useState([]);
  const [materialMedicineType, setMaterialMedicineType] = useState('MATERIAL');
  const [count, setCount] = useState(0);
  const handleDelete = (key) => {
    const newData = dataWarehousingProductDtoList.filter((item) => item.key !== key);
    setDataWarehousingProductDtoList(newData);
  };
  const defaultColumns = [
    {
      title: 'STT',
      dataIndex: 'key',
      width: '5%',
      align: 'center',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: 'code',
      editable: false,
      width: '18%',
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      editable: false,
      width: '18%',
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'inventoryUnit',
      editable: false,
      width: '13%',
      render: (text, record, index) => <div className="">{text} &nbsp;</div>,
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stockQuantity',
      editable: false,
      width: '13%',
      render: (text, record, index) => (
        <div className="">
          {record?.stockQuantity || record?.stockQuantity === 0 ? formatCurrency(text, ' ') : null}
        </div>
      ),
    },
    {
      title: 'Thực tế',
      dataIndex: 'realStockQuantity',
      editable: false,
      width: '13%',
      render: (text, record, index) => (
        <div className="">
          <InputNumber
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
            maxLength={13}
            value={record.realStockQuantity}
            // type="number"
            style={{
              backgroundColor: 'white ',
            }}
            className="not-sr-only h-9 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[3px] !px-0 focus:!outline-none focus:shadow-none"
            onChange={(e) => {
              const newData = [...dataWarehousingProductDtoList];
              newData[index].realStockQuantity = Number(e);
              // newData[index].thanhTien = newData[index]?.quantity * newData[index]?.price;
              setDataWarehousingProductDtoList([...newData]);
            }}
          />
          {/* <Input
            min={0}
            value={record.realStockQuantity}
            type="number"
            style={{
              backgroundColor: 'white ',
            }}
            placeholder=""
            className="h-10 text-sm font-normal block w-full rounded-lg border border-gray-200  py-[7px] px-4 focus:outline-none"
            onChange={(e) => {
              const newData = [...dataWarehousingProductDtoList];
              newData[index].realStockQuantity = Number(e.target.value);
              // newData[index].thanhTien = newData[index]?.quantity * newData[index]?.price;
              setDataWarehousingProductDtoList([...newData]);
            }}
          /> */}
        </div>
      ),
    },
    // {
    //   title: 'Thành tiền',
    //   dataIndex: 'thanhTien',
    //   editable: false,
    //   width: '13%',
    //   render: (text, record, index) => {
    //     return dataWarehousingProductDtoList[index]?.quantity * dataWarehousingProductDtoList[index]?.price;
    //   },
    // },
    {
      title: 'Thao tác',
      dataIndex: 'operation',
      width: '10%',
      align: 'center',
      render: (_, record) =>
        dataWarehousingProductDtoList.length >= 1 ? (
          <>
            <Tooltip title={'Xóa'}>
              <Popconfirm
                placement="left"
                title={'Bạn có chắc muốn xóa ?'}
                icon={<i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />}
                okText={'Đồng ý'}
                cancelText={'Huỷ bỏ'}
                onConfirm={() => handleDelete(record.key)}
              >
                <button className="">{exportIcons('DEL')}</button>
              </Popconfirm>
            </Tooltip>
          </>
        ) : null,
    },
  ];
  const handleAdd = (params) => {
    if (dataWarehousingProductDtoList?.filter((e) => e?.key === params.uuid)[0]) {
      const newData = [...dataWarehousingProductDtoList];
      newData[newData.findIndex((e) => e.key === params.uuid)].quantity += 1;
      newData[newData.findIndex((e) => e.key === params.uuid)].thanhTien =
        newData[newData.findIndex((e) => e.key === params.uuid)].quantity *
        newData[newData.findIndex((e) => e.key === params.uuid)].price;
      setDataWarehousingProductDtoList([...newData]);
    } else {
      const newData = {
        key: params.uuid,
        name: params.name,
        code: params.code,
        stockQuantity: params.stockQuantity,
        realStockQuantity: params.stockQuantity,
        uuid: params.uuid,
        inventoryUnit: params.inventoryUnit,
      };
      setDataWarehousingProductDtoList([...dataWarehousingProductDtoList, newData]);
      setCount(count + 1);
    }
  };
  const handleSave = (row) => {
    const newData = [...dataWarehousingProductDtoList];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataWarehousingProductDtoList(newData);
  };
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
      }),
    };
  });

  // Tên vật tư - thuốc
  const columnMaterialMedicine = [
    {
      title: 'Tên vật tư',
      name: 'name',
      tableItem: {
        width: 150,
        render: (text, data) => (
          <div>
            <div> {text}</div>
            <div>Tồn kho hiện tại: {data.stockQuantity}</div>
          </div>
        ),
      },
    },
    {
      title: 'Giá',
      name: 'costPriceAmount',
      tableItem: {
        width: 150,
        render: (text, data) => (
          <div>
            <div>&nbsp; {text}</div>
          </div>
        ),
      },
    },
  ];
  const getDataMaterialMedicine = async (params) => {
    const data = await MaterialMedicineService.getAll({
      ...params,
      branchUuid: localStorage.getItem('branchUuid'),
      productType: materialMedicineType,
    });
    return { data, count: data.length };
  };

  const items = [
    {
      label: 'Vật tư',
      key: '1',
    },
    {
      label: 'Thuốc',
      key: '2',
    },
  ];

  const [handleChangeGetAllMaterialMedicine, DataTableMaterialMedicine] = HookDataTable({
    showPagination: false,
    loadFirst: false,
    className: 'head-table',
    columns: columnMaterialMedicine,
    Get: getDataMaterialMedicine,
    newRowHeader: (
      <div className="flex w-96 gap-3 flex-col sm:flex-row justify-between">
        <Tabs
          items={items}
          className="laboParameter"
          defaultActiveKey={1}
          onTabClick={(e) => {
            if (e === '2') {
              setMaterialMedicineType('MEDICINE');
            }
            if (e === '1') {
              setMaterialMedicineType('MATERIAL');
            }
          }}
        >
          {/* <Tabs.TabPane tab="Vật tư" key="1" size={'large'} className="flex flex-col gap-4"></Tabs.TabPane>
          <Tabs.TabPane tab="Thuốc" key="2" size={'large'} className="flex flex-col gap-4"></Tabs.TabPane> */}
        </Tabs>
      </div>
    ),
    onRow: (record, rowIndex) => {
      return {
        onClick: (event) => {
          handleAdd(record);
        }, // click row
        onMouseEnter: (event) => {},
      };
    },
  });

  useEffect(() => {
    setWarehousingProductDtoList(dataWarehousingProductDtoList);
  }, [dataWarehousingProductDtoList]);
  // table nếu có uuid và status completed
  const getDataStatusCompleted = async (params) => {
    const data = await WarehousingBill.getListProduct({ ...params, warehousingBillUuid: uuid });
    // console.log(data);
    return { data: data.content, count: data.length };
  };
  const [handleChangeTableCompleted, dataTableCompelted] = HookDataTable({
    Get: getDataStatusCompleted,
    columns: ColumnTableStatusCompleted(),
    showSearch: false,
    loadFirst: false,
  });

  const initWarehousingProductDtoList = async () => {
    const data = await WarehousingBill.getDetailInventoryBill(uuid);
    setDataWarehousingProductDtoList(data.inventoryBillItemDtoList.map((e, index) => ({ ...e, key: e.uuid })));
    setCount(typeof data.inventoryBillItemDtoList.length === 'number' ? data.inventoryBillItemDtoList.length : 0);
  };

  useEffect(() => {
    if (uuid) {
      initWarehousingProductDtoList();
    }
    if (uuid && status === 'COMPLETED') {
      getDataStatusCompleted();
      handleChangeTableCompleted();
    }
  }, []);
  useEffect(() => {
    handleChangeGetAllMaterialMedicine();
  }, [materialMedicineType]);

  return (
    <div>
      {uuid && status === 'COMPLETED' ? (
        <div> {dataTableCompelted()}</div>
      ) : (
        <div className="flex gap-4">
          <div className="w-1/3 border border-gray-200">
            <div className="p-3">{DataTableMaterialMedicine()}</div>
          </div>
          <div className="w-4/6 border">
            <Table
              className="head-table"
              components={components}
              rowClassName={() => 'editable-row'}
              bordered
              dataSource={warehousingProductDtoList}
              columns={columns}
              pagination={false}
              size="small"
            />
          </div>
        </div>
      )}
    </div>
  );
};
