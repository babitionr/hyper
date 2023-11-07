import moment from 'moment';
import React from 'react';

export const ReceivingNotePage3 = ({ billType, dataSource, data }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        color: 'rgba(0, 0, 0, 0.85)',
        minHeight: '100%',
      }}
    >
      {/* <div style={{
              position: 'absolute',
              top: '200%',
              left: 0,
  height: '100%',
  width: '100%',
              overflow: 'hidden',
              zIndex: -1,
              resize: 'auto',
              flexDirection: 'column',
justifyContent: 'center',
alignItems: 'center',



            }}>
              <div style={{
              objectFit: 'cover',
              maxWidth: '100%',
              // resizeMode: 'contain',
              display: 'flex',
              height: '100%',
              flexDirection: 'column',
justifyContent: 'center',
alignItems: 'center',
textAlign: 'center',
            }}>
              <div style={{}}></div>
              <div></div>
 <img src="https://dental-dev.s3.ap-southeast-1.amazonaws.com/image/1692909219304-Screenshot_2023-08-19_201125.png" alt=""
            style={{
              width: '100%',
              height: 'max-content',
              opacity: 0.5,
              // resizeMode: 'contain',
            }}
            />
              <div style={{}}></div>
              </div>
      </div> */}

      <div className="">
        <div
          style={{
            display: 'flex',
            justifyContent: 'left',
            fontWeight: '700',
            fontFamily: 'timesNewsRoman',
            fontSize: '20px',
            textTransform: 'uppercase',
          }}
          onClick={() => {}}
        >
          Tình trạng
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <table
          border={1}
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            borderWidth: '1px',
            borderColor: 'rgb(209, 213, 219, 1 )',
            WebkitPrintColorAdjust: 'exact',
          }}
        >
          <thead
            className="border bg-gray-200 border-gray-300"
            style={{
              textTransform: 'uppercase',
              backgroundColor: 'rgb(229, 231, 235, 1 )',
              borderColor: 'rgb(209, 213, 219, 1 )',
            }}
          >
            {/* <table style={{ width: '100%' }}>
                        <thead className=" border bg-gray-200 border-gray-300"  style={{ textTransform: 'uppercase' }}> */}
            <tr
              // style={{ WebkitPrintColorAdjust: 'exact', backgroundColor: 'red'}}
              style={{ height: '2.5rem' }}
            >
              <th
                scope="col"
                className="border border-gray-300"
                style={{
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  width: '12%',
                  height: '2.5rem',
                  textAlign: 'center',
                }}
              >
                Ngày tạo
              </th>
              <th
                scope="col"
                className="border border-gray-300"
                style={{
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  width: '12%',
                  height: '2.5rem',
                  textAlign: 'center',
                }}
              >
                Số răng
              </th>
              <th
                scope="col"
                style={{
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  width: '21%',
                  height: '2.5rem',
                  textAlign: 'center',
                }}
              >
                Chuẩn đoán
              </th>
              <th
                scope="col"
                style={{
                  width: '16%',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  fontFamily: 'timesNewsRoman',
                  height: '2.5rem',
                  textAlign: 'center',
                }}
              >
                Dịch vụ
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.teethStatus?.map((e, idx) => {
              return (
                <tr key={idx} className=" ">
                  <td
                    className=""
                    style={{
                      fontFamily: 'timesNewsRoman',
                      borderWidth: '1px',
                      borderColor: 'rgb(209, 213, 219, 1 )',
                      width: '12%',
                      height: '2.5rem',
                      textAlign: 'center',
                      whiteSpace: 'pre-line',
                      wordBreak: 'break-word',
                    }}
                  >
                    {moment(e?.createdAt).format('DD-MM-YYYY')}
                  </td>
                  <td
                    className=""
                    style={{
                      fontFamily: 'timesNewsRoman',
                      borderWidth: '1px',
                      borderColor: 'rgb(209, 213, 219, 1 )',
                      width: '12%',
                      height: '2.5rem',
                      paddingLeft: '1rem',
                      paddingRight: '1rem',
                      whiteSpace: 'pre-line',
                      wordBreak: 'break-word',
                    }}
                  >
                    {/* 16, 12, 22, 26, 36, 32, 42, 46 */}
                    {e?.teethList}
                  </td>
                  <td
                    className=""
                    style={{
                      width: '21%',
                      fontFamily: 'timesNewsRoman',
                      borderWidth: '1px',
                      borderColor: 'rgb(209, 213, 219, 1 )',
                      height: '2.5rem',
                      paddingLeft: '0.5rem',
                      paddingRight: '0.5rem',
                      paddingTop: '0.5rem',
                      paddingBottom: '0.5rem',
                      whiteSpace: 'pre-line',
                      wordBreak: 'break-word',
                    }}
                  >
                    {e?.diagnosisList}
                    {/* Chữ ký xác nhận kế hoạch điều trị11111111s1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111 */}
                  </td>
                  <td
                    className=""
                    style={{
                      width: '16%',
                      fontFamily: 'timesNewsRoman',
                      borderWidth: '1px',
                      borderColor: 'rgb(209, 213, 219, 1 )',
                      height: '2.5rem',
                      paddingLeft: '0.5rem',
                      paddingRight: '0.5rem',
                      paddingTop: '0.5rem',
                      paddingBottom: '0.5rem',
                      whiteSpace: 'pre-line',
                      wordBreak: 'break-word',
                    }}
                  >
                    {e?.serviceList}
                    {/* Nguyeenx snvan sabdof mfndsfk */}
                  </td>
                </tr>
              );
            })}

            <tr className=" ">
              <td
                className=""
                style={{
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  width: '12%',
                  height: '2.5rem',
                  textAlign: 'center',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                }}
              >
                {/* {moment(e?.createdDate).format('DD-MM-YYYY')} */}
              </td>
              <td
                className=""
                style={{
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  width: '12%',
                  height: '2.5rem',
                  paddingLeft: '1rem',
                  paddingRight: '1rem',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                }}
              >
                {/* 16, 12, 22, 26, 36, 32, 42, 46 */}
              </td>
              <td
                className=""
                style={{
                  width: '21%',
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  height: '2.5rem',
                  paddingLeft: '0.5rem',
                  paddingRight: '0.5rem',
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                }}
              >
                {/* Chữ ký xác nhận kế hoạch điều trị11111111s1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111 */}
              </td>
              <td
                className=""
                style={{
                  width: '16%',
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  height: '2.5rem',
                  paddingLeft: '0.5rem',
                  paddingRight: '0.5rem',
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                }}
              >
                {/* Nguyeenx snvan sabdof mfndsfk */}
              </td>
            </tr>

            <tr className=" ">
              <td
                className=""
                style={{
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  width: '12%',
                  height: '2.5rem',
                  textAlign: 'center',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                }}
              >
                {/* {moment(e?.createdDate).format('DD-MM-YYYY')} */}
              </td>
              <td
                className=""
                style={{
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  width: '12%',
                  height: '2.5rem',
                  paddingLeft: '1rem',
                  paddingRight: '1rem',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                }}
              >
                {/* 16, 12, 22, 26, 36, 32, 42, 46 */}
              </td>
              <td
                className=""
                style={{
                  width: '21%',
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  height: '2.5rem',
                  paddingLeft: '0.5rem',
                  paddingRight: '0.5rem',
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                }}
              >
                {/* Chữ ký xác nhận kế hoạch điều trị11111111s1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111 */}
              </td>
              <td
                className=""
                style={{
                  width: '16%',
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  height: '2.5rem',
                  paddingLeft: '0.5rem',
                  paddingRight: '0.5rem',
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                }}
              >
                {/* Nguyeenx snvan sabdof mfndsfk */}
              </td>
            </tr>

            <tr className=" ">
              <td
                className=""
                style={{
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  width: '12%',
                  height: '2.5rem',
                  textAlign: 'center',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                }}
              >
                {/* {moment(e?.createdDate).format('DD-MM-YYYY')} */}
              </td>
              <td
                className=""
                style={{
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  width: '12%',
                  height: '2.5rem',
                  paddingLeft: '1rem',
                  paddingRight: '1rem',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                }}
              >
                {/* 16, 12, 22, 26, 36, 32, 42, 46 */}
              </td>
              <td
                className=""
                style={{
                  width: '21%',
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  height: '2.5rem',
                  paddingLeft: '0.5rem',
                  paddingRight: '0.5rem',
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                }}
              >
                {/* Chữ ký xác nhận kế hoạch điều trị11111111s1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111 */}
              </td>
              <td
                className=""
                style={{
                  width: '16%',
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  height: '2.5rem',
                  paddingLeft: '0.5rem',
                  paddingRight: '0.5rem',
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                }}
              >
                {/* Nguyeenx snvan sabdof mfndsfk */}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="">
        <div
          style={{
            display: 'flex',
            justifyContent: 'left',
            fontWeight: '700',
            fontFamily: 'timesNewsRoman',
            fontSize: '20px',
            textTransform: 'uppercase',
          }}
          onClick={() => {}}
        >
          Nhu cầu điều trị
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <table
          border={1}
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            borderWidth: '1px',
            borderColor: 'rgb(209, 213, 219, 1 )',
            WebkitPrintColorAdjust: 'exact',
          }}
        >
          <thead
            className="border bg-gray-200 border-gray-300"
            style={{
              textTransform: 'uppercase',
              backgroundColor: 'rgb(229, 231, 235, 1 )',
              borderColor: 'rgb(209, 213, 219, 1 )',
            }}
          >
            {/* <table style={{ width: '100%' }}>
                        <thead className=" border bg-gray-200 border-gray-300"  style={{ textTransform: 'uppercase' }}> */}
            <tr
              // style={{ WebkitPrintColorAdjust: 'exact', backgroundColor: 'red'}}
              style={{ height: '2.5rem' }}
            >
              <th
                scope="col"
                className="border border-gray-300"
                style={{
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  width: '12%',
                  height: '2.5rem',
                  textAlign: 'center',
                }}
              >
                Ngày
              </th>
              <th
                scope="col"
                className="border border-gray-300"
                style={{
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  width: '12%',
                  height: '2.5rem',
                  textAlign: 'center',
                }}
              >
                Số răng
              </th>
              <th
                scope="col"
                style={{
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  width: '21%',
                  height: '2.5rem',
                  textAlign: 'center',
                }}
              >
                Điều trị đã thực hiện
              </th>
              <th
                scope="col"
                className="border border-gray-300"
                style={{
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  width: '12%',
                  height: '2.5rem',
                  textAlign: 'center',
                }}
              >
                Chi phí
              </th>
              <th
                scope="col"
                className="border border-gray-300"
                style={{
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  width: '12%',
                  height: '2.5rem',
                  textAlign: 'center',
                }}
              >
                Thanh toán
              </th>
              <th
                scope="col"
                className="border border-gray-300"
                style={{
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  width: '12%',
                  height: '2.5rem',
                  textAlign: 'center',
                }}
              >
                Còn lại
              </th>
              {/* <th
                      scope="col"
                      className="border border-gray-300"
                      style={{
                        fontFamily: 'timesNewsRoman',
                        borderWidth: '1px',
                        borderColor: 'rgb(209, 213, 219, 1 )',
                        width: '9%',
                        height: '2.5rem',
                        textAlign: 'center',
                      }}
                    >
                      Ngày hẹn
                    </th> */}
              <th
                scope="col"
                style={{
                  width: '16%',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  fontFamily: 'timesNewsRoman',
                  height: '2.5rem',
                  textAlign: 'center',
                }}
              >
                Bác sĩ
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.allServiceSaleOrder?.map((e, idx) => {
              const promotionAmount = e?.promotionAmount
                ? e?.promotionAmount
                : e?.promotionDto?.promotionType === 'PERCENT'
                ? (Number(e?.totalPaymentAmount) * Number(e?.promotionDto?.amount)) / 100
                : e?.promotionDto?.promotionType === 'CASH'
                ? Number(e?.promotionDto?.amount)
                : 0;
              return (
                <tr key={idx} className=" ">
                  <td
                    className=""
                    style={{
                      fontFamily: 'timesNewsRoman',
                      borderWidth: '1px',
                      borderColor: 'rgb(209, 213, 219, 1 )',
                      width: '12%',
                      height: '2.5rem',
                      textAlign: 'center',
                      whiteSpace: 'pre-line',
                      wordBreak: 'break-word',
                    }}
                  >
                    {moment(e?.createdDate).format('DD-MM-YYYY')}
                  </td>
                  <td
                    className=""
                    style={{
                      fontFamily: 'timesNewsRoman',
                      borderWidth: '1px',
                      borderColor: 'rgb(209, 213, 219, 1 )',
                      width: '12%',
                      height: '2.5rem',
                      paddingLeft: '1rem',
                      paddingRight: '1rem',
                      whiteSpace: 'pre-line',
                      wordBreak: 'break-word',
                    }}
                  >
                    {/* 16, 12, 22, 26, 36, 32, 42, 46 */}
                    {e?.teethNumber}
                  </td>
                  <td
                    className=""
                    style={{
                      width: '21%',
                      fontFamily: 'timesNewsRoman',
                      borderWidth: '1px',
                      borderColor: 'rgb(209, 213, 219, 1 )',
                      height: '2.5rem',
                      paddingLeft: '0.5rem',
                      paddingRight: '0.5rem',
                      paddingTop: '0.5rem',
                      paddingBottom: '0.5rem',
                      whiteSpace: 'pre-line',
                      wordBreak: 'break-word',
                    }}
                  >
                    {e?.serviceNamne}
                    {/* Chữ ký xác nhận kế hoạch điều trị11111111s1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111 */}
                  </td>
                  <td
                    className=""
                    style={{
                      fontFamily: 'timesNewsRoman',
                      borderWidth: '1px',
                      borderColor: 'rgb(209, 213, 219, 1 )',
                      width: '12%',
                      height: '2.5rem',
                      paddingLeft: '0.2rem',
                      paddingRight: '0.1rem',
                      whiteSpace: 'pre-line',
                      wordBreak: 'break-word',
                    }}
                  >
                    {Number(e?.totalPaymentAmount - promotionAmount).toLocaleString('de-DE')} VND
                    {/* 700000000 VND */}
                  </td>
                  <td
                    className=""
                    style={{
                      fontFamily: 'timesNewsRoman',
                      borderWidth: '1px',
                      borderColor: 'rgb(209, 213, 219, 1 )',
                      width: '12%',
                      height: '2.5rem',
                      paddingLeft: '0.2rem',
                      paddingRight: '0.1rem',
                      whiteSpace: 'pre-line',
                      wordBreak: 'break-word',
                    }}
                  >
                    {/* 700000000 VND */}
                    {e?.paidAmount.toLocaleString('de-DE')} VND
                  </td>
                  <td
                    className=""
                    style={{
                      fontFamily: 'timesNewsRoman',
                      borderWidth: '1px',
                      borderColor: 'rgb(209, 213, 219, 1 )',
                      width: '12%',
                      height: '2.5rem',
                      paddingLeft: '0.2rem',
                      paddingRight: '0.1rem',
                      whiteSpace: 'pre-line',
                      wordBreak: 'break-word',
                    }}
                  >
                    {Number(e?.totalPaymentAmount - promotionAmount - e?.paidAmount).toLocaleString('de-DE')} VND
                    {/* 700000000 VND */}
                  </td>
                  {/* <td
                          className=""
                          style={{
                            fontFamily: 'timesNewsRoman',
                            borderWidth: '1px',
                            borderColor: 'rgb(209, 213, 219, 1 )',
                            width: '10%',
                            height: '2.5rem',
                            paddingLeft: '0.3rem',
                            paddingRight: '0.3rem',
                            whiteSpace: 'pre-line',
                            wordBreak : 'break-word',

                          }}
                        >
                          16/07/2021
                        </td> */}
                  <td
                    className=""
                    style={{
                      width: '16%',
                      fontFamily: 'timesNewsRoman',
                      borderWidth: '1px',
                      borderColor: 'rgb(209, 213, 219, 1 )',
                      height: '2.5rem',
                      paddingLeft: '0.5rem',
                      paddingRight: '0.5rem',
                      paddingTop: '0.5rem',
                      paddingBottom: '0.5rem',
                      whiteSpace: 'pre-line',
                      wordBreak: 'break-word',
                    }}
                  >
                    {e?.doctorUserName}
                    {/* Nguyeenx snvan sabdof mfndsfk */}
                  </td>
                </tr>
              );
            })}
            <tr className=" ">
              <td
                className=""
                style={{
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  width: '12%',
                  height: '2.5rem',
                  textAlign: 'center',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                }}
              >
                {/* {moment(e?.createdDate).format('DD-MM-YYYY')} */}
              </td>
              <td
                className=""
                style={{
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  width: '12%',
                  height: '2.5rem',
                  paddingLeft: '1rem',
                  paddingRight: '1rem',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                }}
              >
                {/* 16, 12, 22, 26, 36, 32, 42, 46 */}
              </td>
              <td
                className=""
                style={{
                  width: '21%',
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  height: '2.5rem',
                  paddingLeft: '0.5rem',
                  paddingRight: '0.5rem',
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                }}
              >
                {/* Chữ ký xác nhận kế hoạch điều trị11111111s1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111 */}
              </td>
              <td
                className=""
                style={{
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  width: '12%',
                  height: '2.5rem',
                  paddingLeft: '0.2rem',
                  paddingRight: '0.1rem',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                }}
              >
                {/* 700000000 VND */}
              </td>
              <td
                className=""
                style={{
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  width: '12%',
                  height: '2.5rem',
                  paddingLeft: '0.2rem',
                  paddingRight: '0.1rem',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                }}
              >
                {/* 700000000 VND */}
              </td>
              <td
                className=""
                style={{
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  width: '12%',
                  height: '2.5rem',
                  paddingLeft: '0.2rem',
                  paddingRight: '0.1rem',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                }}
              >
                {/* 700000000 VND */}
              </td>
              <td
                className=""
                style={{
                  width: '16%',
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  height: '2.5rem',
                  paddingLeft: '0.5rem',
                  paddingRight: '0.5rem',
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                }}
              >
                {/* Nguyeenx snvan sabdof mfndsfk */}
              </td>
            </tr>

            <tr className=" ">
              <td
                className=""
                style={{
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  width: '12%',
                  height: '2.5rem',
                  textAlign: 'center',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                }}
              >
                {/* {moment(e?.createdDate).format('DD-MM-YYYY')} */}
              </td>
              <td
                className=""
                style={{
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  width: '12%',
                  height: '2.5rem',
                  paddingLeft: '1rem',
                  paddingRight: '1rem',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                }}
              >
                {/* 16, 12, 22, 26, 36, 32, 42, 46 */}
              </td>
              <td
                className=""
                style={{
                  width: '21%',
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  height: '2.5rem',
                  paddingLeft: '0.5rem',
                  paddingRight: '0.5rem',
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                }}
              >
                {/* Chữ ký xác nhận kế hoạch điều trị11111111s1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111 */}
              </td>
              <td
                className=""
                style={{
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  width: '12%',
                  height: '2.5rem',
                  paddingLeft: '0.2rem',
                  paddingRight: '0.1rem',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                }}
              >
                {/* 700000000 VND */}
              </td>
              <td
                className=""
                style={{
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  width: '12%',
                  height: '2.5rem',
                  paddingLeft: '0.2rem',
                  paddingRight: '0.1rem',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                }}
              >
                {/* 700000000 VND */}
              </td>
              <td
                className=""
                style={{
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  width: '12%',
                  height: '2.5rem',
                  paddingLeft: '0.2rem',
                  paddingRight: '0.1rem',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                }}
              >
                {/* 700000000 VND */}
              </td>
              <td
                className=""
                style={{
                  width: '16%',
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  height: '2.5rem',
                  paddingLeft: '0.5rem',
                  paddingRight: '0.5rem',
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                }}
              >
                {/* Nguyeenx snvan sabdof mfndsfk */}
              </td>
            </tr>

            <tr className=" ">
              <td
                className=""
                style={{
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  width: '12%',
                  height: '2.5rem',
                  textAlign: 'center',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                }}
              >
                {/* {moment(e?.createdDate).format('DD-MM-YYYY')} */}
              </td>
              <td
                className=""
                style={{
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  width: '12%',
                  height: '2.5rem',
                  paddingLeft: '1rem',
                  paddingRight: '1rem',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                }}
              >
                {/* 16, 12, 22, 26, 36, 32, 42, 46 */}
              </td>
              <td
                className=""
                style={{
                  width: '21%',
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  height: '2.5rem',
                  paddingLeft: '0.5rem',
                  paddingRight: '0.5rem',
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                }}
              >
                {/* Chữ ký xác nhận kế hoạch điều trị11111111s1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111 */}
              </td>
              <td
                className=""
                style={{
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  width: '12%',
                  height: '2.5rem',
                  paddingLeft: '0.2rem',
                  paddingRight: '0.1rem',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                }}
              >
                {/* 700000000 VND */}
              </td>
              <td
                className=""
                style={{
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  width: '12%',
                  height: '2.5rem',
                  paddingLeft: '0.2rem',
                  paddingRight: '0.1rem',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                }}
              >
                {/* 700000000 VND */}
              </td>
              <td
                className=""
                style={{
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  width: '12%',
                  height: '2.5rem',
                  paddingLeft: '0.2rem',
                  paddingRight: '0.1rem',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                }}
              >
                {/* 700000000 VND */}
              </td>
              <td
                className=""
                style={{
                  width: '16%',
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  height: '2.5rem',
                  paddingLeft: '0.5rem',
                  paddingRight: '0.5rem',
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                }}
              >
                {/* Nguyeenx snvan sabdof mfndsfk */}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
