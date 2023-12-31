import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { Spin } from 'components';

const Hook = forwardRef(
  (
    {
      title,
      widthModal = 800,
      onOk,
      onCancel,
      GetById,
      isLoading,
      setIsLoading,
      firstChange = true,
      textSubmit,
      className = '',
      footerCustom,
      children,
    },
    ref,
  ) => {
    useImperativeHandle(ref, () => ({ handleShow, handleCancel, data, set_data, setIsOpen }));

    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [data, set_data] = useState({});
    const handleCancel = () => {
      setIsOpen(false);
      !!onCancel && onCancel(data);
    };
    const handleOk = async () => {
      setIsLoading && setIsLoading(true);
      if (!!onOk && (await onOk(data)) === false) {
        setIsLoading && setIsLoading(false);
        return false;
      }
      setIsLoading && setIsLoading(false);
      handleCancel();
    };

    const handleShow = async (item = {}) => {
      if (GetById) {
        setIsLoading(true);
        const { data } = await GetById(item.id);
        item = { ...item, ...data };
        setIsLoading(false);
      }
      set_data(item);
      setIsOpen(true);
    };

    return (
      <Modal
        maskClosable={false}
        destroyOnClose={true}
        centered={true}
        width={widthModal}
        title={<h3 className="font-bold text-lg">{title(data)}</h3>}
        open={isOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        wrapClassName={className}
        footer={
          !!onOk &&
          ((footerCustom && footerCustom(handleOk, handleCancel)) || (
            <div className="flex justify-end">
              <button
                type={'button'}
                className="bg-blue-100 px-4 py-2.5 rounded-xl hover:bg-blue-500 hover:text-white mr-2 btn-cancel"
                onClick={handleCancel}
              >
                {t('components.form.modal.cancel')}
              </button>
              <button
                type={'button'}
                disabled={!firstChange}
                className={classNames('px-4 py-2.5 rounded-xl inline-flex items-center btn-save', {
                  'bg-gray-100 hover:bg-gray-300 hover:text-white text-gray-400': !firstChange,
                  'text-white bg-blue-500 hover:bg-blue-400': firstChange,
                })}
                onClick={handleOk}
              >
                {isLoading && <i className="las la-spinner mr-1 animate-spin" />}
                {textSubmit || t('components.form.modal.save')}
              </button>
            </div>
          ))
        }
      >
        <Spin spinning={isLoading}>{children}</Spin>
      </Modal>
    );
  },
);
Hook.displayName = 'HookModal';
export default Hook;
