import moment from 'moment';
import React from 'react';

export const ReceivingNotePage4 = ({ billType, dataSource, data }) => {
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
      <div className="">
        <div
          style={{
            display: 'flex',
            justifyContent: 'left',
            fontWeight: '700',
            fontFamily: 'timesNewsRoman',
            fontSize: '20px',
            textTransform: 'uppercase',
            marginTop: '1rem',
          }}
          onClick={() => {}}
        >
          Lịch sử điều trị
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
            <tr style={{ height: '2.5rem' }}>
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
                style={{
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  width: '21%',
                  height: '2.5rem',
                  textAlign: 'center',
                }}
              >
                Dịch vụ
              </th>
              <th
                scope="col"
                className="border border-gray-300"
                style={{
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  width: '16%',
                  height: '2.5rem',
                  textAlign: 'center',
                }}
              >
                Thành tiền
              </th>
              <th
                scope="col"
                className="border border-gray-300"
                style={{
                  fontFamily: 'timesNewsRoman',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  width: '16%',
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
                  width: '16%',
                  height: '2.5rem',
                  textAlign: 'center',
                }}
              >
                Còn lại
              </th>
              <th
                scope="col"
                style={{
                  width: '19%',
                  borderWidth: '1px',
                  borderColor: 'rgb(209, 213, 219, 1 )',
                  fontFamily: 'timesNewsRoman',
                  height: '2.5rem',
                  textAlign: 'center',
                }}
              >
                Nội dung điều trị
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.saleOrderHistory?.map((e, idx) => {
              console.log(data?.saleOrderHistory);
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
                    {moment(e?.dateExamination).format('DD-MM-YYYY')}
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
                    {e?.services}
                    {/* Chữ ký xác nhận kế hoạch điều trị11111111s1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111 */}
                  </td>
                  <td
                    className=""
                    style={{
                      fontFamily: 'timesNewsRoman',
                      borderWidth: '1px',
                      borderColor: 'rgb(209, 213, 219, 1 )',
                      width: '16%',
                      height: '2.5rem',
                      paddingLeft: '0.2rem',
                      paddingRight: '0.1rem',
                      whiteSpace: 'pre-line',
                      wordBreak: 'break-word',
                    }}
                  >
                    {Number(e?.totalAmount).toLocaleString('de-DE')} VND
                    {/* 700000000 VND */}
                  </td>
                  <td
                    className=""
                    style={{
                      fontFamily: 'timesNewsRoman',
                      borderWidth: '1px',
                      borderColor: 'rgb(209, 213, 219, 1 )',
                      width: '16%',
                      height: '2.5rem',
                      paddingLeft: '0.2rem',
                      paddingRight: '0.1rem',
                      whiteSpace: 'pre-line',
                      wordBreak: 'break-word',
                    }}
                  >
                    {/* 700000000 VND */}
                    {(Number(e?.totalAmount) - Number(e?.balanceAmount)).toLocaleString('de-DE')} VND
                  </td>
                  <td
                    className=""
                    style={{
                      fontFamily: 'timesNewsRoman',
                      borderWidth: '1px',
                      borderColor: 'rgb(209, 213, 219, 1 )',
                      width: '16%',
                      height: '2.5rem',
                      paddingLeft: '0.2rem',
                      paddingRight: '0.1rem',
                      whiteSpace: 'pre-line',
                      wordBreak: 'break-word',
                    }}
                  >
                    {Number(e?.balanceAmount).toLocaleString('de-DE')} VND
                    {/* 700000000 VND */}
                  </td>
                  <td
                    className=""
                    style={{
                      width: '19%',
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
                    {e?.content}
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
                  width: '16%',
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
                  width: '16%',
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
                  width: '16%',
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
                  width: '19%',
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
                  width: '16%',
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
                  width: '16%',
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
                  width: '16%',
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
                  width: '19%',
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
                  width: '16%',
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
                  width: '16%',
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
                  width: '16%',
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
                  width: '19%',
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
            Lịch sử thanh toán
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {data?.paymentHistory?.reverse()?.map((e, idx) => {
            return (
              <div key={idx} style={{ display: 'flex' }}>
                <div style={{ display: 'flex', justifyContent: 'start', gap: '0.45rem', width: '70%' }}>
                  <div style={{ fontFamily: 'timesNewsRoman' }}>
                    Thanh toán lần {idx + 1}{' '}
                    {e?.paymentDate && `(${moment(e?.paymentDate).format('DD/MM/YYYY HH:mm:ss')})`}:
                  </div>{' '}
                  <div style={{ fontFamily: 'timesNewsRoman' }}>
                    {`${Number(e?.paidAmount ?? 0).toLocaleString('de-DE')} VND`}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'start', gap: '0.5rem', width: '30%' }}>
                  <div style={{ fontFamily: 'timesNewsRoman' }}>Còn lại: </div>{' '}
                  <div style={{ fontFamily: 'timesNewsRoman' }}>
                    {`${(Number(e?.totalAmount ?? 0) - Number(e?.paidAmount ?? 0)).toLocaleString('de-DE')} VND`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            className="font-bold"
            style={{
              fontFamily: 'timesNewsRoman',
              display: 'flex',
              justifyContent: 'center',
              fontWeight: '700',
            }}
          >
            Khách hàng
          </div>
          <div style={{ fontFamily: 'timesNewsRoman', display: 'flex', justifyContent: 'center' }}>
            (Ký và ghi rõ họ tên)
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            className="font-bold"
            style={{
              fontFamily: 'timesNewsRoman',
              display: 'flex',
              justifyContent: 'center',
              fontWeight: '700',
            }}
          >
            Thu ngân
          </div>
          <div style={{ fontFamily: 'timesNewsRoman', display: 'flex', justifyContent: 'center' }}>
            (Ký và ghi rõ họ tên)
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            className="font-bold"
            style={{
              fontFamily: 'timesNewsRoman',
              display: 'flex',
              justifyContent: 'center',
              fontWeight: '700',
            }}
          >
            Bác sĩ
          </div>
          <div style={{ fontFamily: 'timesNewsRoman', display: 'flex', justifyContent: 'center' }}>
            (Ký và ghi rõ họ tên)
          </div>
        </div>
      </div>
    </div>
  );
};
