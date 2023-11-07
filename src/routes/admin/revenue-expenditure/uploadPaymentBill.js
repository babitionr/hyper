import { Modal } from 'antd';
import classNames from 'classnames';
import { Upload } from 'components';
import React, { useState } from 'react';
import { UtilService } from 'services/util';

export const UploadPaymentBill = ({ paymentBillImageUrl, setPaymentBillImageUrl }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const removeImg = () => {
    setPaymentBillImageUrl('');
  };
  return (
    <div>
      {!paymentBillImageUrl ? (
        <div>
          <>
            <Upload
              loadingText={'Đang tải ...'}
              onlyImage={true}
              maxSize={50}
              action={async (file) => {
                const urlArr = await UtilService.post(file);
                setPaymentBillImageUrl(urlArr ?? '');
              }}
            >
              <div
                className={
                  'cursor-pointer border border-dashed border-gray-500 rounded-xl ' +
                  '!rounded-2xl h-52 w-full aspect-square object-cover flex items-center justify-center'
                }
              >
                <div className={'text-center ' + ''}>
                  <i className={`las la-image text-3xl`}></i>

                  <p className="text-xs text-gray-700 ">
                    <span className="text-sm">Kéo thả hoặc nhấn vào đây để tải ảnh lên</span>
                  </p>
                </div>
              </div>
            </Upload>
          </>
        </div>
      ) : (
        <>
          <div
            className={classNames(
              'bg-cover bg-center rounded-[10px] z-30',
              '!rounded-2xl h-52 w-full aspect-square object-cover',
              {
                'cursor-pointer': !previewOpen,
              },
            )}
            onClick={() => {
              setPreviewOpen(true);
            }}
            style={{ backgroundImage: 'url(' + paymentBillImageUrl + ')' }}
          >
            <div className="flex justify-end">
              <i
                className={'las la-times text-right hover:scale-150 ' + 'text-base'}
                onClick={(e) => {
                  e.stopPropagation();
                  removeImg();
                }}
              ></i>
            </div>
          </div>
        </>
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
            <img alt={''} style={{ width: '60%' }} src={paymentBillImageUrl} />
          </label>
        </div>
      </Modal>
    </div>
  );
};
