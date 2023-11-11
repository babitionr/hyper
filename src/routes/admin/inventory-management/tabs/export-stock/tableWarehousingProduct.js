import React, { useState, useEffect, useRef, useContext } from 'react';
import { HookDataTable } from 'hooks';
import { useSearchParams } from 'react-router-dom';
import { Form, Input, Table, Tooltip, Popconfirm, InputNumber, Tabs } from 'antd';
import RemoveIcon from 'assets/svg/remove.js';
import { MaterialMedicineService } from 'services/material-medicine';
import '../../index.less';
import { WarehousingBill } from 'services/warehousing-bill';
import { ColumnTableStatusCompleted } from '../../columns/columnTableStatusCompleted';
import './index.less';

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
      title: () => <div className="justify-center"> Tên sản phẩm</div>,
      dataIndex: 'name',
      editable: false,
      width: '20%',
      render: (text, record, index) => (
        <div className=" justify-center">
          <div> {record.name} </div>
        </div>
      ),
    },
    {
      title: 'Loại sản phẩm',
      dataIndex: 'productType',
      editable: false,
      width: '18%',
      render: (text, record, index) => {
        if (text === 'MATERIAL') return <div>Vật tư &nbsp;</div>;
        else if (text === 'MEDICINE') return <div>Thuốc &nbsp;</div>;
      },
    },
    {
      title: 'Đơn vị tính',
      dataIndex: 'inventoryUnit',
      editable: false,
      width: '13%',
      render: (text, record, index) => <div className="">{text} &nbsp;</div>,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      editable: false,
      width: '13%',
      render: (text, record, index) => (
        <div className="">
          <InputNumber
            onChange={(e) => {
              const newData = [...dataWarehousingProductDtoList];
              newData[index].quantity = Number(e);
              newData[index].thanhTien = newData[index]?.quantity * newData[index]?.price;
              setDataWarehousingProductDtoList([...newData]);
            }}
            min={0}
            value={record.quantity}
          />
        </div>
      ),
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      editable: false,
      width: '13%',
      render: (text, record, index) => (
        <div className="">
          <InputNumber
            onChange={(e) => {
              const newData = [...dataWarehousingProductDtoList];
              newData[index].price = Number(e);
              newData[index].thanhTien = newData[index]?.quantity * newData[index]?.price;
              setDataWarehousingProductDtoList([...newData]);
            }}
            min={0}
            value={record?.price}
          />
        </div>
      ),
    },
    {
      title: 'Thành tiền',
      dataIndex: 'thanhTien',
      editable: false,
      width: '13%',
      render: (text, record, index) => {
        return dataWarehousingProductDtoList[index]?.quantity * dataWarehousingProductDtoList[index]?.price;
      },
    },
    {
      title: 'Thao tác',
      dataIndex: 'operation',
      width: '10%',
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
                <button className="embed border border-gray-300 text-xs rounded-lg mr-2">
                  <RemoveIcon />
                </button>
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
        productType: params.productType,
        quantity: 0,
        price: params.costPriceAmount,
        productItemUuid: params.uuid,
        inventoryUnit: params.inventoryUnit,
        thanhTien: 0,
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
    console.log(dataWarehousingProductDtoList);
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

  // Table Tên vật tư - thuốc
  const columnMaterialMedicine = [
    {
      title: 'Tên vật tư',
      name: 'name',
      tableItem: {
        width: 200,
        render: (text, data) => (
          <div>
            <div> {text}</div>
            <div>Tồn kho hiện tại: {data.stockQuantity}</div>
          </div>
        ),
      },
    },
    {
      title: <div className="flex justify-center">Giá</div>,
      name: 'costPriceAmount',
      tableItem: {
        width: 150,
        render: (text, data) => (
          <div>
            <div className="flex justify-around"> {text}</div>
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
      type: 'INVENTORY_MANAGEMENT',
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
    columns: columnMaterialMedicine,
    Get: getDataMaterialMedicine,
    className: 'DataTableMaterialMedicine',
    newRowHeader: (
      <div className="w-full">
        <Tabs
          items={items}
          className="tabMaterialMedicine"
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
          {/* <Tabs.TabPane tab="Vật tư" key="1" size={'large'} className=""></Tabs.TabPane>
          <Tabs.TabPane tab="Thuốc" key="2" size={'large'} className=""></Tabs.TabPane> */}
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
    console.log(data);
    return { data: data.content, count: data.length };
  };
  const [handleChangeTableCompleted, dataTableCompelted] = HookDataTable({
    Get: getDataStatusCompleted,
    columns: ColumnTableStatusCompleted(),
    showSearch: false,
    loadFirst: false,
  });

  const initWarehousingProductDtoList = async () => {
    const data = await WarehousingBill.getDetail(uuid);
    setDataWarehousingProductDtoList(
      data.warehousingProductDtoList.map((e, index) => ({ ...e, key: e.productItemUuid })),
    );
    console.log(typeof data.warehousingProductDtoList.length);
    setCount(typeof data.warehousingProductDtoList.length === 'number' ? data.warehousingProductDtoList.length : 0);
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
          <div className="w-96 border border-gray-200">
            <div className="p-3">{DataTableMaterialMedicine()}</div>
          </div>
          <div className="w-[calc(100%-25rem)] border">
            <Table
              components={components}
              rowClassName={() => 'editable-row'}
              bordered
              dataSource={warehousingProductDtoList}
              columns={columns}
              pagination={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};
