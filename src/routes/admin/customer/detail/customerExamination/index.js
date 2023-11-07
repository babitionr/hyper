import { Checkbox, Form, Input, Select } from 'antd';
import classNames from 'classnames';
import MultipleUploadFiles from 'components/multipleUploadFiles';
import React, { useState, useEffect, useRef } from 'react';
import { CustomerExaminationService } from 'services/customer-examination';
import { MedicalHistory } from './medicalHistory';
import { useAuth } from 'global';
import { AuthSerivce } from 'services/Auth';

const CustomerExamination = ({ idCustomer }) => {
  const [form] = Form.useForm();
  const { branchUuid } = useAuth();
  const { TextArea } = Input;
  const [showCustomerExamination, setShowCustomerExamination] = useState(true);
  const [showSpecialize, setShowSpecialize] = useState(true);
  const [showMedicalHistory, setShowMedicalHistory] = useState(true);
  const [pathological, setPathological] = useState([]);
  const [buttonCheck, setButtonCheck] = useState('');
  const [listDoctor, setListDoctor] = useState([]);
  const [xrayFileList, setXrayFileList] = useState([]);
  const [testFileList, setTestFileList] = useState([]);
  const [imageFileList, setImageFileList] = useState([]);
  const [otherFileList, setOtherFileList] = useState([]);
  const rawXrayFile = useRef([]);
  const rawTestFile = useRef([]);
  const rawImageFile = useRef([]);
  const rawOtherFile = useRef([]);

  const handleSubmit = async () => {
    const XrayFilter = rawXrayFile.current.filter((ele) => !xrayFileList.find((e) => e.id === ele.url));
    const xrayFile = xrayFileList
      .map((ele) => {
        return { ...ele, imageType: 'X_RAY', url: ele.id };
      })
      .concat(
        XrayFilter.map((ele) => {
          return { ...ele, imageType: 'X_RAY', url: ele.url, actionDelete: true };
        }),
      );
    const testFilter = rawTestFile.current.filter((ele) => !testFileList.find((e) => e.id === ele.url));
    const testFile = testFileList
      .map((ele) => ({ ...ele, imageType: 'TEST', url: ele.id }))
      .concat(testFilter.map((ele) => ({ ...ele, imageType: 'TEST', url: ele.url, actionDelete: true })));
    const imageFilter = rawImageFile.current.filter((ele) => !imageFileList.find((e) => e.id === ele.url));
    const imageFile = imageFileList
      .map((ele) => ({ ...ele, imageType: 'IMAGE', url: ele.id }))
      .concat(imageFilter.map((ele) => ({ ...ele, imageType: 'IMAGE', url: ele.url, actionDelete: true })));
    const otherFilter = rawOtherFile.current.filter((ele) => !otherFileList.find((e) => e.id === ele.url));
    const otherFile = otherFileList
      .map((ele) => ({ ...ele, imageType: 'OTHER', url: ele.id }))
      .concat(otherFilter.map((ele) => ({ ...ele, imageType: 'OTHER', url: ele.url, actionDelete: true })));
    const formValue = form.getFieldsValue();
    const data = {
      customerUuid: idCustomer,
      doctorUuid: formValue.doctorUuid,
      examinationNote: formValue.examinationNote,
      treatmentNote: formValue.treatmentNote,
      imageList: [...xrayFile, ...testFile, ...imageFile, ...otherFile],
      pathological: pathological.filter((e) => !!e).join(', '),
    };
    await CustomerExaminationService.create(data);
    console.log('data: ', data);
  };

  const init = async () => {
    const resDoctor = await AuthSerivce.getUserByPosition({ position: 'DOCTOR', branchUuid });
    setListDoctor(resDoctor.data);
    const resUser = await CustomerExaminationService.getDetail({ customerUuid: idCustomer });
    setPathological(resUser?.pathological?.split(', ') ?? []);
    form.setFieldsValue({
      doctorUuid: resUser?.doctorUuid,
      examinationNote: resUser?.examinationNote,
      treatmentNote: resUser?.treatmentNote,
    });
    const regexName = /\/([^/]+)$/;
    const regex2 = /[^-]*-(.*)/;
    rawXrayFile.current = resUser?.imageList?.filter((ele) => ele?.imageType === 'X_RAY');
    rawImageFile.current = resUser?.imageList?.filter((ele) => ele?.imageType === 'IMAGE');
    rawTestFile.current = resUser?.imageList?.filter((ele) => ele?.imageType === 'TEST');
    rawOtherFile.current = resUser?.imageList?.filter((ele) => ele?.imageType === 'OTHER');

    setXrayFileList(
      resUser?.imageList
        ?.filter((ele) => ele?.imageType === 'X_RAY')
        .map((ele) => ({ ...ele, id: ele?.url, name: regex2.exec(regexName.exec(ele?.url)[1])[1] })),
    );
    setImageFileList(
      resUser?.imageList
        ?.filter((ele) => ele?.imageType === 'IMAGE')
        .map((ele) => ({ ...ele, id: ele?.url, name: regex2.exec(regexName.exec(ele?.url)[1])[1] })),
    );
    setTestFileList(
      resUser?.imageList
        ?.filter((ele) => ele?.imageType === 'TEST')
        .map((ele) => ({ ...ele, id: ele?.url, name: regex2.exec(regexName.exec(ele?.url)[1])[1] })),
    );
    setOtherFileList(
      resUser?.imageList
        ?.filter((ele) => ele?.imageType === 'OTHER')
        .map((ele) => ({ ...ele, id: ele?.url, name: regex2.exec(regexName.exec(ele?.url)[1])[1] })),
    );
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <div>
      <div className="flex flex-col gap-4">
        <div
          className=" cursor-pointer border-b flex gap-2"
          onClick={() => {
            setShowMedicalHistory((prev) => !prev);
          }}
        >
          <div>
            <i
              className={classNames('', {
                'las la-angle-down': !showMedicalHistory,
                'las la-angle-up': showMedicalHistory,
              })}
            ></i>
          </div>
          <div className=" uppercase font-bold pb-2">Tiểu sử bệnh lý</div>
        </div>
        {showMedicalHistory && <MedicalHistory pathological={pathological} setPathological={setPathological} />}
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <div
          className=" cursor-pointer border-b flex gap-2"
          onClick={() => {
            setShowCustomerExamination((prev) => !prev);
          }}
        >
          <div>
            <i
              className={classNames('', {
                'las la-angle-down': !showCustomerExamination,
                'las la-angle-up': showCustomerExamination,
              })}
            ></i>
          </div>
          <div className=" uppercase font-bold pb-2">Khám tổng quát</div>
        </div>
        {showCustomerExamination && (
          <div>
            <Form form={form} colon={false}>
              <div>
                <div className="w-full flex justify-between gap-4">
                  <Form.Item
                    className="flex w-6/12"
                    name="doctorUuid"
                    label="Bác sĩ khám"
                    rules={[{ required: true, message: 'Vui lòng chọn bác sĩ khám' }]}
                  >
                    <Select
                      className="w-full !rounded-lg"
                      placeholder="Bác sĩ khám"
                      options={listDoctor.map((ele) => ({ value: ele.uuid, label: ele.firstName }))}
                    ></Select>
                  </Form.Item>
                  <Form.Item className="w-6/12 opacity-0" label="Bác sĩ điều trị"></Form.Item>
                </div>
                <div className="w-full flex justify-between gap-4">
                  <Form.Item className="w-6/12" name="examinationNote" label="Ghi chú khám tổng quát">
                    <TextArea
                      rows={4}
                      className=" w-full text-sm font-normal block !bg-white rounded-lg border border-gray-200  py-[7px] px-4 "
                      placeholder=""
                    />
                  </Form.Item>
                  <Form.Item className="w-6/12" name="treatmentNote" label="Ghi chú kế hoạch điều trị">
                    <TextArea
                      rows={4}
                      className=" w-full text-sm font-normal block !bg-white rounded-lg border border-gray-200  py-[7px] px-4 "
                      placeholder=""
                    />
                  </Form.Item>
                </div>
              </div>
            </Form>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <div
          className=" cursor-pointer border-b flex gap-2"
          onClick={() => {
            setShowSpecialize((prev) => !prev);
          }}
        >
          <div>
            <i
              className={classNames('', { 'las la-angle-down': !showSpecialize, 'las la-angle-up': showSpecialize })}
            ></i>
          </div>
          <div className=" uppercase font-bold pb-2">Chỉ định</div>
        </div>
        {showSpecialize && (
          <div>
            <div className="flex flex-col gap-7">
              <div className="w-full flex justify-between gap-4">
                <Checkbox.Group
                  className="w-full flex"
                  onClick={(e) => {
                    setButtonCheck(e.target.value);
                  }}
                  value={buttonCheck}
                >
                  <Checkbox className="w-1/4" value={'1'}>
                    X-quang
                  </Checkbox>
                  <Checkbox className="w-1/4" value={'2'}>
                    Xét nghiệm
                  </Checkbox>
                  <Checkbox className="w-1/4" value={'3'}>
                    Ảnh
                  </Checkbox>
                  <Checkbox className="w-1/4" value={'4'}>
                    Khác
                  </Checkbox>
                </Checkbox.Group>
              </div>
              {['1', '2', '3', '4'].includes(buttonCheck) && (
                <div className="w-full flex justify-start items-center">
                  <div className="w-full">
                    <MultipleUploadFiles
                      apiType="image"
                      boxText="Kéo thả hoặc nhấn vào đây để tải ảnh lên"
                      fileType={['image/png', 'image/jpeg', 'image/jpg']}
                      setFileList={
                        buttonCheck === '1'
                          ? setXrayFileList
                          : buttonCheck === '2'
                          ? setTestFileList
                          : buttonCheck === '3'
                          ? setImageFileList
                          : setOtherFileList
                      }
                      fileList={
                        buttonCheck === '1'
                          ? xrayFileList
                          : buttonCheck === '2'
                          ? testFileList
                          : buttonCheck === '3'
                          ? imageFileList
                          : otherFileList
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="w-full flex justify-between mt-7">
        <div></div>
        <button
          className="h-11 w-32 ml-4 border rounded-[8px] bg-rose-500 text-white flex justify-center items-center "
          type="submit"
          onClick={async () => {
            try {
              await form.validateFields();
              handleSubmit();
            } catch (error) {
              console.log('error: ', error);
            }
          }}
        >
          Lưu
        </button>
      </div>
    </div>
  );
};

export default CustomerExamination;
