import React, { useRef, useState } from 'react';
import { Modal, Tooltip, Upload } from 'antd';
import { OrganizationService } from 'services/organization';
import './index.less';
// import axios from 'axios';
import moment from 'moment';
import { Message } from 'components';
import classNames from 'classnames';

const MultipleUploadFiles = ({
  fileList,
  setFileList,
  boxText = 'Kéo thả hoặc nhấn vào đây để tải file lên',
  apiType = 'file',
}) => {
  const { Dragger } = Upload;
  const fileType = ['image/png', 'image/jpeg', 'image/jpg'];
  const [multipleUploadLoading, setMultipleUploadLoading] = useState(false);
  let multipleUploadCount = 0;
  const handleUpload = async (file) => {
    setMultipleUploadLoading(true);
    multipleUploadCount = multipleUploadCount + 1;

    if (apiType === 'image') {
      if (fileType && !fileType.includes(file.type)) {
        Message.error({ text: `${file.name} không phải file ảnh` });
        return Upload.LIST_IGNORE;
      }
      const dataImagine = await OrganizationService.uploadImage(file);
      if (dataImagine) {
        multipleUploadCount = multipleUploadCount - 1;
        if (multipleUploadCount === 0) {
          setMultipleUploadLoading(false);
        }
      }
      console.log(dataImagine);
      try {
        const regex1 = /\/([^/]+)$/;
        const regex2 = /[^-]*-(.*)/;
        const titleName = regex2.exec(regex1.exec(dataImagine)[1])[1];
        console.log(titleName);
        setFileList((prev) => [
          { id: dataImagine, name: titleName, uploadedAt: moment().format('YYYY-MM-DD HH:mm:ss') },
          ...prev,
        ]);
        setPreviewImage(dataImagine);
        return false; // prevent file from being uploaded automatically
      } catch (error) {
        console.log(error);
      }
    } else {
      const data = await OrganizationService.uploadContract(file);
      if (data) {
        multipleUploadCount = multipleUploadCount - 1;
        if (multipleUploadCount === 0) {
          setMultipleUploadLoading(false);
        }
      }
      console.log(data);
      // const fileData = await OrganizationService.getViewUrl(data);
      // console.log(fileData);
      try {
        const regex = /[^-]*-(.*)/;
        const titleName = regex.exec(data)[1];
        setFileList((prev) => [
          { id: data, name: titleName, uploadedAt: moment().format('YYYY-MM-DD HH:mm:ss') },
          ...prev,
        ]);
        console.log(fileList);
        return false; // prevent file from being uploaded automatically
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleRemoveAll = () => {
    setFileList([]);
  };

  const uploadProps = {
    name: 'file',
    multiple: true,
    showUploadList: false,
    fileList,
    beforeUpload: handleUpload,
  };

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const handlePreview = async (file) => {
    let data;
    if (apiType === 'image') {
      data = file?.id;
    } else {
      data = await OrganizationService.getViewUrl(file.id);
    }
    setPreviewImage(data);
    setPreviewOpen(true);
    setPreviewTitle(file.name);
  };

  const handleDownload = async (file) => {
    if (apiType === 'image') {
      window.open(file?.id, '_blank', 'noreferrer');
    } else {
      const data = await OrganizationService.getViewUrl(file.id);
      window.open(data, '_blank', 'noreferrer');
    }
  };

  // const [count, setCount] = React.useState(0);
  // // const [isDone, setIsDone] = React.useState(true);

  // // setLoading when axios call api
  // useEffect(() => {
  //   axios.interceptors.request.use(function (config) {
  //     setCount((prev) => prev + 1);
  //     // setIsDone((prev) => false);
  //     return config;
  //   });
  //   const responseFunc = function responseFunc(response) {
  //     const localCount = count - 1;
  //     setCount((prev) => prev - 1);
  //     if (localCount === 0) {
  //       // setIsDone((prev) => true);
  //     }
  //     return response;
  //   };

  //   const errorFunc = function errorFunc(error) {
  //     const localCount = count - 1;
  //     setCount((prev) => prev - 1);
  //     if (localCount === 0) {
  //       // setIsDone((prev) => true);
  //     }
  //     return Promise.reject(error);
  //   };

  //   axios.interceptors.response.use(responseFunc, errorFunc);

  //   if (fileList.length > 0 && apiType === 'image') {
  //     setPreviewImage(fileList[0].id);
  //   }
  // }, []);

  const listToScroll = useRef(null);

  return (
    <div style={{ display: 'flex' }} className="multiple-upload-drag gap-2 w-full h-full">
      <Dragger
        showUploadList={false}
        {...uploadProps}
        disabled={multipleUploadLoading}
        className="  bg-white flex justify-center text-center border border-dashed border-gray-500  !rounded-2xl h-52 w-full aspect-square object-cover  items-center"
      >
        {multipleUploadLoading ? (
          <div className="">
            <svg
              aria-hidden="true"
              className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          <div className=" h-full w-full ">
            <i className="las la-file-upload la-4x "></i>
            <div> {boxText}</div>
            {/* <div>
            <label htmlFor="progress-bar">0%</label>
            <progress id="progress-bar" value="0" max="100"></progress>
          </div> */}
          </div>
        )}
      </Dragger>
      {fileList.length > 0 && apiType === 'file' && (
        <div className="mutiple-upload-file-list bg-white border border-dashed border-gray-500  !rounded-2xl h-52 w-full aspect-square object-cover  items-center p-2 overflow-hidden">
          <div className="flex justify-between">
            Danh sách tệp:
            <button className="mr-1" onClick={() => handleRemoveAll()}>
              Xoá tất cả
            </button>
          </div>
          {fileList.map((file, index) => (
            <div key={index + file.id} className="flex  w-full">
              <div style={{ marginLeft: -2 }} className="bg-white flex gap-0.5 items-center">
                <svg
                  width="25px"
                  height="25px"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#000000"
                  stroke=""
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0" />

                  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />

                  <g id="SVGRepo_iconCarrier">
                    {' '}
                    <title />{' '}
                    <g id="Complete">
                      {' '}
                      <g id="F-File">
                        {' '}
                        <g id="Text">
                          {' '}
                          <g>
                            {' '}
                            <path
                              d="M18,22H6a2,2,0,0,1-2-2V4A2,2,0,0,1,6,2h7.1a2,2,0,0,1,1.5.6l4.9,5.2A2,2,0,0,1,20,9.2V20A2,2,0,0,1,18,22Z"
                              fill="none"
                              id="File"
                              stroke="#2196F3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                            />{' '}
                            <line
                              fill="none"
                              stroke="#2196F3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              x1="7.9"
                              x2="16.1"
                              y1="17.5"
                              y2="17.5"
                            />{' '}
                            <line
                              fill="none"
                              stroke="#2196F3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              x1="7.9"
                              x2="16.1"
                              y1="13.5"
                              y2="13.5"
                            />{' '}
                            <line
                              fill="none"
                              stroke="#2196F3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              x1="8"
                              x2="13"
                              y1="9.5"
                              y2="9.5"
                            />{' '}
                          </g>{' '}
                        </g>{' '}
                      </g>{' '}
                    </g>{' '}
                  </g>
                </svg>
              </div>
              <Tooltip className="" title={file.name}>
                <div className="mt-2 truncate w-full flex" onClick={() => handlePreview(file)}>
                  <p className="truncate">{file.name.split('.').slice(0, -1).join('.')}</p>
                  <p className="">.{file.name.split('.').pop()}</p>
                </div>
              </Tooltip>

              <Tooltip title={'Tải về'}>
                <button
                  href="#"
                  className="items-center text-center justify-center flex"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDownload(file);
                  }}
                >
                  <i className="las la-download text-3xl h-full w-full"></i>
                </button>
              </Tooltip>
              {/* {['jpg', 'png', 'jpeg', 'webp', 'svg', 'gif'].includes(file.name.split('.').pop().toLowerCase()) && (
                <button
                  onClick={(e) => {
                    handlePreview(file);
                    e.preventDefault();
                  }}
                >
                  <i className="las la-eye  text-yellow-400 h-full w-full hover:text-yellow-300 cursor-pointer text-3xl"></i>
                </button>
              )} */}

              <Tooltip title={'Xoá'}>
                <button
                  className="items-center text-center justify-center flex"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFileList(fileList.filter((item) => item.id !== file.id));
                  }}
                >
                  <i className="las la-trash-alt text-red-500 h-full w-full hover:text-red-400 cursor-pointer text-3xl"></i>
                </button>
              </Tooltip>
            </div>
          ))}
        </div>
      )}
      {fileList.length > 0 && apiType === 'image' && (
        <div className=" flex flex-col relative bg-white border border-dashed border-gray-500  !rounded-2xl h-52 w-full aspect-square object-cover  items-center p-1 overflow-hidden">
          <div className="h-34 ">
            {/* left arrow */}
            <div className=" flex absolute left-0 gap-2 top-[28%] ">
              <button
                className="mr-1 "
                onClick={() => {
                  const listFile = listToScroll.current;
                  const fileIndex = fileList.findIndex((item) => item.id === previewImage) - 1;
                  const img = listFile.querySelectorAll('div')[fileIndex];
                  setPreviewImage(fileList[fileIndex].id);
                  img.scrollIntoView({ block: 'nearest', inline: 'center' });
                }}
                disabled={fileList.findIndex((e) => e.id === previewImage) === 0}
              >
                <i
                  className={classNames('las la-angle-left text-black h-full w-full cursor-pointer text-3xl', {
                    'text-[#A3A3A3]': fileList.findIndex((e) => e.id === previewImage) === 0,
                  })}
                ></i>
              </button>
            </div>
            {/* right arrow  */}
            <div className=" flex absolute right-0 gap-2 top-[28%] ">
              <button
                className="mr-1"
                onClick={() => {
                  const listFile = listToScroll.current;
                  const fileIndex = fileList.findIndex((item) => item.id === previewImage) + 1;
                  const img = listFile.querySelectorAll('div')[fileIndex];
                  setPreviewImage(fileList[fileIndex].id);
                  img.scrollIntoView({ block: 'nearest', inline: 'center' });
                }}
                disabled={fileList.findIndex((e) => e.id === previewImage) === fileList.length - 1}
              >
                <i
                  className={classNames('las la-angle-right text-black h-full w-full cursor-pointer text-3xl', {
                    'text-[#A3A3A3]': fileList.findIndex((e) => e.id === previewImage) === fileList.length - 1,
                  })}
                ></i>
              </button>
            </div>
            <div className=" flex absolute right-0 gap-2 ">
              <Tooltip title={'Xoá'}>
                <button
                  className="items-center text-center justify-center flex"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewImage((ele) => {
                      const prevItemIndex = fileList.findIndex((i) => i.id === ele);
                      if (prevItemIndex === 0 && fileList.length === 1) return '';
                      if (prevItemIndex === 0 && fileList.length > 1) return fileList[prevItemIndex + 1]?.id;
                      else return fileList[prevItemIndex - 1]?.id;
                    });
                    setFileList(fileList.filter((item) => item.id !== previewImage));
                  }}
                >
                  <i className="las la-trash-alt text-red-500 h-full w-full hover:text-red-400 cursor-pointer text-3xl"></i>
                </button>
              </Tooltip>
              <button className="mr-1 hover:text-rose-500" onClick={() => handleRemoveAll()}>
                Xóa tất cả
              </button>
            </div>
            <img
              alt="example"
              className="hover:cursor-pointer"
              style={{ width: '134px', height: '134px' }}
              src={previewImage}
              onClick={(e) => {
                e.preventDefault();
                handlePreview(fileList.find((item) => item.id === previewImage));
              }}
            />
          </div>
          <div className="w-full px-2">
            {/* eslint-disable-next-line no-dupe-keys */}
            <div
              ref={listToScroll}
              style={{ listStyleType: 'none', display: '-webkit-box' }}
              className=" w-full overflow-auto whitespace-nowrap"
            >
              {fileList.map((file, index) => (
                <div
                  key={index + file.id}
                  className={classNames('float-left border-2 border-transparent', {
                    'border-red-500': previewImage === file.id,
                  })}
                  id={file.id}
                >
                  <img
                    onMouseEnter={(e) => {
                      setPreviewImage(e.target.src);
                    }}
                    onClick={(e) => {
                      handlePreview(file);
                      e.preventDefault();
                    }}
                    className=" w-12 h-12 leading-12 text-center "
                    src={file.id}
                    alt={file.name}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <Modal
        open={previewOpen}
        // title={previewTitle}
        footer={null}
        style={{ top: '0%' }}
        className="!w-10/12 h-full"
        onCancel={() => {
          setPreviewOpen(false);
        }}
      >
        <div className="zoomImagePreview text-center h-full">
          <input type="checkbox" id="zoomImagePreviewInput"></input>
          <label htmlFor="zoomImagePreviewInput">
            <img alt={previewTitle} style={{ width: '60%' }} src={previewImage} />
          </label>
        </div>
      </Modal>
    </div>
  );
};

export default MultipleUploadFiles;
