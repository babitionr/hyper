import React from 'react';
import './index.less';
import { Typography } from 'antd';

const Page = () => {
  const { Title, Text } = Typography;

  return (
    <div className="bg-white p-3 rounded  h-[1250px] lg:h-max">
      <Title className="text-center text-2xl" level={2}>
        Chính sách và quy định chung
      </Title>
      <br></br>
      <div>
        <Text>
          Hypert Dental yêu cầu khách hàng cung cấp các thông tin cơ bản như họ tên, số điện thoại, email, địa chỉ khách
          hàng đăng ký sử dụng phần mềm của Công ty Cổ phần Công nghệ Hyper Tech (sau gọi tắt là Hypert) và một số thông
          tin bắt buộc khác. Ngoài ra, để đảm bảo quyền lợi và trải nghiệm của khách hàng được tốt nhất, HyperT áp dụng
          một số điều khoản khi khách hàng sử dụng phần mềm:
        </Text>
        <br></br>
      </div>
      <br></br>
      <>
        <Title className="mt-1" level={5}>
          1. Quy định về sử dụng
        </Title>
        <div>
          <Text>
            Khách hàng được khởi tạo tên miền và đăng ký tài khoản dùng thử. Khi đó, khách hàng được truy cập và sử dụng
            các tính năng mà phần mềm cung cấp. Một số thông tin khách hàng cần cung cấp để công ty có thể phục vụ bạn
            tốt hơn:
          </Text>
          <br></br>
          <Text>- Họ tên khách hàng</Text>
          <br></br>
          <Text>- Tên Shop</Text>
          <br></br>
          <Text>- Số điện thoại liên hệ</Text>
          <br></br>
          <Text>- Email</Text>
          <br></br>
          <Text>- Địa chỉ hiện tại</Text>
          <br></br>
          <Text>
            Đối với khách hàng đã sử dụng phần mềm trên thiết bị di động: Chúng tôi chỉ thu thập các dữ liệu thông tin
            mà bạn cho phép, dựa trên sự đồng ý của bạn. Các thông tin này sẽ được chúng tôi bảo mật theo các quy định
            hiện hành. Ngoài ra, các thông tin này chỉ sử dụng vào giúp chúng tôi có thể đưa ra phương án điều trị, dịch
            vụ tốt nhất dành cho bạn.
          </Text>
          <br></br>
          <Text>
            Đối với khách hàng đã sử dụng phần mềm trên Website: chúng tôi có quyền được biết vị trí hiện tại của bạn,
            lưu trữ dữ liệu của bạn trên phần mềm, truy cập vào internet từ thiết bị của bạn.
          </Text>
          <br></br>
          <Text>
            Lưu ý: mọi quy định về sử dụng phần mềm có thể được điều chỉnh theo chính sách của công ty để đảm bảo quyền
            lợi của khách hàng. Mọi thay đổi sẽ được thông báo bằng văn bản gửi đến Quý khách hàng.
          </Text>
          <br></br>
        </div>
        <br></br>
      </>
      <>
        <Title level={5}>2. Quản lý thông tin</Title>
        <div>
          <Text>
            Sau khi bàn giao các thông số quản trị dịch vụ cho người dùng, Hypert Dental không chịu trách nhiệm về những
            thông tin, nội dung của khách hàng trên phần mềm. Hypert Dental không chịu trách nhiệm pháp lý cũng như bồi
            thường cho người dùng và bên thứ ba đối với các trường hợp xảy ra thiệt hại trực tiếp, gián tiếp, vô ý, đặc
            biệt, vô hình, các thiệt hại về lợi nhuận, doanh thu, uy tín phát sinh từ việc sử dụng sản phẩm, dịch vụ của
            Hypert Dental.
          </Text>
          <br></br>
        </div>
        <br></br>
      </>
      <>
        <Title level={5}>3. Đối với khách hàng sử dụng phần mềm</Title>
        <div>
          <Text>Chúng tôi có quyền ngừng cung cấp dịch vụ mà không hoàn bất kỳ chi phí nào nếu:</Text>
          <br></br>
          <Text>- Người dùng không thanh toán đầy đủ chi phí sử dụng phần mềm và những nguyên nhân xấu khác.</Text>
          <br></br>
          <Text>- Người dùng có hành vi vi phạm pháp luật khi sử dụng phần mềm (buôn bán hàng trái pháp luật)</Text>
          <br></br>
          <Text>
            - Người dùng mạo danh hoặc xâm nhập trái phép gây ảnh hưởng đến quyền và lợi ích cá nhân của người khác.
          </Text>
          <br></br>
        </div>
        <br></br>
      </>
      <>
        <Title level={5}>4. Quản lý tài khoản quản trị.</Title>
        <div>
          <Text>
            - Người dùng có trách nhiệm giữ an toàn các thông tin nhận biết (tài khoản đăng nhập phần mềm, tên miền, mật
            khẩu,...).
          </Text>
          <br></br>
          <Text>- Báo với chúng tôi ngay khi phát hiện các hình thức truy cập trái phép bằng tài khoản khác.</Text>
          <br></br>
          <Text>Trong mọi trường hợp, quyết định của Hypert Dental là quyết định cuối cùng.</Text>
          <br></br>
        </div>
      </>
      <br></br>
      <div>
        <Title level={5}>Liên hệ:</Title>
        <div>
          <Text>
            Trong trường hợp có bất cứ vấn đề gì phát sinh trong quá trình sử dụng (ngoại trừ các vấn đề liên quan câu
            hỏi, câu trả lời, bình luận và thời gian phản hồi), vui lòng liên hệ với chúng tôi thông qua email:
            dental.hypertech@gmail.com
          </Text>
        </div>
      </div>
    </div>
  );
};
// to={routerLinks("ForgotPass")}
export default Page;
