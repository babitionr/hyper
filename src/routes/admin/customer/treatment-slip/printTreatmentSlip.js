import React, { useCallback, useState } from 'react';
import { ReceivingNotePage1 } from './treatmentSlipPrintUI/ReceivingNotePage1';
// import { ReceivingNotePage2 } from './treatmentSlipPrintUI/ReceivingNotePage2';
import { CustomerService } from 'services/customer';
import { CustomerExaminationService } from 'services/customer-examination';
import { SaleOrderService } from 'services/SaleOrder';
import { ReceivingNotePage3 } from './treatmentSlipPrintUI/ReceivingNotePage3';
import { useAuth } from 'global';
import { PaymentService } from 'services/payment';
import { ReceivingNotePage4 } from './treatmentSlipPrintUI/ReceivingNotePage4';
import { SaleOrderHistoryService } from 'services/saleOrderHistory';
import { CustomerTeethStoryService } from 'services/customer-teeth-story/customerTeethStory';
import { Button } from 'antd';

export const PrintTreatmentSlip = ({ idCustomer, billType, dataSource, saleOrderId }) => {
  const [totalPages, setTotalPages] = useState(0);
  const { user } = useAuth();
  const [pathological, setPathological] = useState([]);

  const getElementHeight = (el) => {
    const clone = el.cloneNode(true);
    clone.style.cssText =
      'position: fixed; top: 0; left: 0; overflow: auto; visibility: hidden; pointer-events: none; height: unset; max-height: unset';
    document.body.append(clone);
    // var height = clone.getBoundingClientRect().height + 'px';
    const height = Number(clone.getBoundingClientRect().height);
    clone.remove();
    return height;
  };

  const getTotalPages = (value) => {
    const getHeight = getElementHeight(value);
    console.log(getHeight);
    if (((Number(getHeight) / 720) | 0) === getHeight) return Number(getHeight) / 720;
    else return ((Number(getHeight) / 720) | 0) + 1;
  };

  const changeValue = useCallback(
    (e) => {
      setTotalPages(e);
    },
    [totalPages],
  );

  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

  const printFunc = async () => {
    setIsLoadingSubmit(true);
    await init();

    setTimeout(() => {
      setIsLoadingSubmit(false);
      const content = document.getElementById('rawPrint');
      const pri = document.getElementById('ifmcontentstoprint').contentWindow;

      pri.document.open();
      pri.document.write(content.innerHTML);
      pri.document.title = '\u00A0';
      pri.document.close();
      pri.focus();
      pri.print();
    }, 1000);

    console.log(saleOrderId);
  };
  const [data, setData] = useState({});
  const init = async () => {
    const resCustomer = await CustomerService.getDetail(idCustomer);
    console.log(resCustomer);
    const resCustomerExamination = await CustomerExaminationService.getDetail({ customerUuid: idCustomer });
    const resGetAllService = await SaleOrderService.GetDetailSaleOrderCopy(saleOrderId);
    const allService = resGetAllService.saleOrderServiceItemDtoList
      ?.map((ele) => {
        return {
          ...ele,
          serviceNamne: ele.productServiceDto?.name,
          doctorUserName: ele.doctorUserDto?.firstName,
          saleOrderServiceTeethDtoList: ele.saleOrderServiceTeethDtoList,
          teethNumber: ele?.saleOrderServiceTeethDtoList?.map((teeth) => teeth?.teethNumber).join(', '),
        };
      })
      .filter((ele) => !ele.deleteAction);
    console.log(allService);

    const resPaymentHistory = await PaymentService.getListPaymentByTreatmentSlipHistory({
      saleOrderUuid: saleOrderId,
      page: 1,
      perPage: 999,
    });
    const resSaleOrderHistory = await SaleOrderHistoryService.getSaleOrderHistoryList({
      customerUuid: idCustomer,
      saleOrderUuid: saleOrderId,
      page: 1,
      perPage: 999,
    });
    const resTeethStatus = await CustomerTeethStoryService.getListTeethStory({
      customerUuid: idCustomer,
      page: 1,
      perPage: 999,
    });
    console.log(resTeethStatus);
    setData((prev) => ({
      ...prev,
      customerInfo: resCustomer,
      customerExamination: resCustomerExamination,
      allServiceSaleOrder: allService ?? [],
      paymentHistory: resPaymentHistory?.data?.content ?? [],
      saleOrderHistory: resSaleOrderHistory?.content ?? [],
      teethStatus: resTeethStatus?.content ?? [],
    }));
    // setPaymentHistoryList(res.data?.content);

    setPathological(resCustomerExamination?.pathological?.split(', ') ?? []);

    // Set total page to add background image
    const totalPage = getTotalPages(document.getElementById('rawPrint'));
    changeValue(totalPage);
  };
  // useEffect(() => {
  //   if (open && idCustomer && saleOrderId) {
  //     init();
  //   }
  // }, [open]);

  return (
    <div className="">
      <iframe id="ifmcontentstoprint" className="hidden"></iframe>
      <div className="flex gap-4">
        {/* <button
          className="flex justify-center active:ring-2 ring-offset-1 ring-offset-rose-300 ring-rose-300  bg-rose-500 text-white rounded-lg border border-rose-500  items-center !text-base !font-medium h-11 px-2 gap-2"
          type="button"
          onClick={() => {
            printFunc();
          }}
        >
          <i className="las la-print text-2xl" />
          In
        </button> */}
        <Button
          className=" !border-rose-500 border !text-white !bg-rose-500 focus:!bg-rose-600 hover:!bg-rose-600 !px-2 flex items-center justify-center !pt-4 !pb-6 !text-base font-medium "
          loading={isLoadingSubmit}
          disabled={isLoadingSubmit}
          onClick={async () => {
            try {
              printFunc();
            } catch (error) {
              console.log(error);
            }
          }}
        >
          <i className="las la-print text-2xl pt-2" />
          <span className="pt-2 pl-1">In</span>
        </Button>
      </div>
      <div className="hidden">
        <div
          id="rawPrint"
          style={
            {
              //  WebkitPrintColorAdjust: 'exact',
              //   colorAadjust: 'exact' ,
              //   printColorAdjust: 'exact',/* Firefox 97+, Safari 15.4+ */
              // backgroundSize: 'cover', backgroundPosition: 'center',
              // objectFit: 'cover', aspectRatio: 1 / 1,
              // backgroundImage: 'url(' + 'https://dental-dev.s3.ap-southeast-1.amazonaws.com/image/1692909219304-Screenshot_2023-08-19_201125.png' + ')'
            }
          }
        >
          {Array.from({ length: totalPages }, (_, i) => i + 0).map((ele) => {
            return (
              <div
                key={`img${ele}`}
                style={{
                  position: 'absolute',
                  top: `${ele * 100}%`,
                  left: 0,
                  height: '100%',
                  width: '100%',
                  overflow: 'hidden',
                  zIndex: -1,
                  resize: 'auto',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    objectFit: 'cover',
                    maxWidth: '100%',
                    // resizeMode: 'contain',
                    display: 'flex',
                    height: '100%',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <div style={{}}></div>
                  <div></div>
                  <img
                    src={user?.orgLogo ?? ''}
                    alt=""
                    style={{
                      width: 'max-content',
                      height: 'max-content',
                      opacity: !user?.orgLogo || user?.orgLogo === '' ? 0 : 0.2,
                      // resizeMode: 'contain',
                    }}
                  />
                  <div style={{}}></div>
                </div>
              </div>
            );
          })}

          {/* <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: '100%',
              overflow: 'hidden',
              zIndex: -1,
              resize: 'auto',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                objectFit: 'cover',
                maxWidth: '100%',
                // resizeMode: 'contain',
                display: 'flex',
                height: '100%',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <div style={{}}></div>
              <div></div>
              <img
                src={user?.orgLogo ?? ''}
                alt=""
                style={{
                  // width: '100%',
                  width: 'max-content',
                  height: 'max-content',
                  opacity: !user?.orgLogo || user?.orgLogo === '' ? 0 : 0.2,
                  // resizeMode: 'contain',
                }}
              />
              <div style={{}}></div>
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              height: '100%',
              width: '100%',
              overflow: 'hidden',
              zIndex: -1,
              resize: 'auto',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                objectFit: 'cover',
                maxWidth: '100%',
                // resizeMode: 'contain',
                display: 'flex',
                height: '100%',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <div style={{}}></div>
              <div></div>
              <img
                src={user?.orgLogo ?? ''}
                alt=""
                style={{
                  width: 'max-content',
                  height: 'max-content',
                  opacity: !user?.orgLogo || user?.orgLogo === '' ? 0 : 0.2,
                  // resizeMode: 'contain',
                }}
              />
              <div style={{}}></div>
            </div>
          </div> */}

          <ReceivingNotePage1 data={data} pathological={pathological} orgLogo={user?.orgLogo} />
          {/* <ReceivingNotePage2 data={data}/> */}
          <ReceivingNotePage3 data={data} orgLogo={user?.orgLogo} />
          <ReceivingNotePage4 data={data} orgLogo={user?.orgLogo} />
        </div>
      </div>
    </div>
  );
};
