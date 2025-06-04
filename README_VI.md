<a href="https://github.com/luochuanyuewu/nextus" target="_blank">
  <h1 align="center">Nextus</h1>
</a>

# Thông báo
<p align="center">Chào mừng bạn đến với Nextus, Nextus là một mẫu website hiện đại, toàn diện và đa chức năng, được xây dựng dựa trên công nghệ Next.js và Directus. Hỗ trợ bạn xây dựng các loại website một cách nhanh chóng hơn.</p>

<p align="center">
  <a href="#introduction"><strong>Giới thiệu</strong></a> ·
  <a href="#tech-stack"><strong>🧰 Công nghệ sử dụng</strong></a> ·
  <a href="#installation-and-development"><strong>🚧 Cài đặt và phát triển</strong></a> ·
  <!-- <a href="#deployment"><strong>🚢 Triển khai/Deployment</strong></a> · -->
  <!-- <a href="#features"><strong>⭐ Tính năng/Features</strong></a> · -->
  <a href="#roadmap"><strong>💼 Kế hoạch phát triển</strong></a> ·
  <a href="#other-resources"><strong>💼 Tài nguyên khác</strong></a> ·
  <a href="#contributors"><strong>👥 Người đóng góp</strong></a>
  <a href="#contributing"><strong>👥 Tham gia đóng góp</strong></a>
</p>

<br />

# Giới thiệu

Xây dựng một website đẹp mắt trong vài phút. Hoặc sử dụng Nextus làm nền tảng cho dự án xuất sắc tiếp theo của bạn.

[**-> Demo website**](https://nextus.vercel.app/)

**Tính năng đã hỗ trợ**

- Ví dụ website hoàn chỉnh với Next.js 13
- Hỗ trợ đa ngôn ngữ, hiện tại hỗ trợ tiếng Trung và tiếng Anh, bạn có thể tự thêm ngôn ngữ khác.
- Tích hợp Directus - Hỗ trợ CMS không đầu (Headless CMS)
- Sử dụng Tailwind CSS và DaisyUI để phát triển chủ đề
- Xây dựng trang web động bằng giao diện Many-to-Any trong Directus
- Bài viết blog và phân loại
- Trang dự án
- Tạo động các biểu mẫu có quy tắc xác thực
- Tạo ảnh xã hội động
- Hỗ trợ SEO
- Thành phần tìm kiếm toàn cầu và tuyến API Next.js
- Thành phần UI chung được chuẩn bị sẵn
- Các hàm thông dụng để bạn không cần bao gồm gói bên thứ ba bổ sung
- Dễ dàng sử dụng nhiều biểu tượng SVG thông qua thư viện Iconify Icon
- Hỗ trợ font chữ Google
- Đã cấu hình sẵn ESLint và Prettier
- Cung cấp nhiều chủ đề thông qua DaisyUI
- Toàn bộ được viết bằng Typescript và sử dụng SDK Typescript mới nhất của Directus

<br />

# Công nghệ sử dụng

## Next.js 13

Xây dựng ứng dụng Next.js tiếp theo của bạn với sự tự tin bằng Next. Một framework mã nguồn mở dưới giấy phép MIT, giúp phát triển web trở nên đơn giản và mạnh mẽ. Framework React hàng đầu xử lý định tuyến, render phía server, và nhiều hơn nữa.

[Tìm hiểu thêm về Next](https://nextjs.org)

---

## Directus

Directus là một CMS không đầu (Headless CMS) ngay lập tức biến cơ sở dữ liệu SQL của bạn thành API REST và GraphQL, đồng thời cung cấp một ứng dụng không cần mã đẹp mắt, trực quan để quản lý tất cả nội dung và dữ liệu của bạn.
Nhưng nó không chỉ là một CMS không đầu. Đây là một nền tảng dữ liệu mở cung cấp tất cả các công cụ bạn cần để tạo, quản lý, phục vụ, trực quan hóa và thậm chí tự động hóa dữ liệu cho dự án web, di động hoặc kỹ thuật số tiếp theo của bạn.

Để trải nghiệm mượt mà, [Directus SDK](https://docs.directus.io/guides/sdk/getting-started.html) đã được tích hợp sẵn và có sẵn toàn cầu.

[Tìm hiểu thêm về Directus](https://directus.io)

---

## Giao diện người dùng (UI)

- [Tailwind CSS](https://tailwindcss.com/) – Framework CSS ưu tiên tiện ích, cho phép bạn xây dựng trang web nhanh chóng và duy trì nhất quán giữa các thành viên trong đội. Có một số plugin Tailwind đã được cài đặt và sẵn sàng sử dụng – [Typography](https://tailwindcss.com/docs/typography-plugin) và [Forms](https://tailwindcss.com/docs/plugins#forms).
- [DaisyUI](https://daisyui.com/) – Thư viện thành phần phổ biến nhất cho Tailwind CSS.
- [React Hook Form](https://react-hook-form.com/) – Thư viện biểu mẫu cho React, giúp bạn tiết kiệm hàng giờ bằng cách đơn giản hóa việc tạo biểu mẫu.
- [Iconify for React](https://github.com/iconify) - Framework SVG thống nhất hiện đại. Cú pháp duy nhất cho nhiều bộ biểu tượng: FontAwesome, Material Design Icons, Dashicons và nhiều hơn nữa. Hơn 150,000 biểu tượng, rất dễ sử dụng.

## Tiện ích

- [React-Use](https://github.com/streamich/react-use) – React Hooks — 👍
- [Framer-Motion](https://www.framer.com/motion/) – Thư viện chuyển động đơn giản nhưng mạnh mẽ cho React.

<br />

# Cài đặt và phát triển

## Directus - Headless CMS

### 1 Thiết lập instance Directus

Sử dụng [Directus Cloud](https://directus.cloud/register) hoặc theo hướng dẫn [tự lưu trữ](https://docs.directus.io/self-hosted/quickstart.html) do Directus cung cấp để nhanh chóng thiết lập instance Directus của riêng bạn.

Sau đó, sử dụng tính năng [Schema Migration](https://docs.directus.io/guides/migration/hoppscotch.html) để áp dụng [Schema](https://github.com/luochuanyuewu/nextus-docker/blob/main/snapshots/schema.yml) được cung cấp bởi Nextus vào instance Directus của bạn.

Hoặc, sử dụng [Nextus-Docker](https://github.com/luochuanyuewu/nextus-docker) để nhanh chóng thiết lập backend Nextus và tự động áp dụng schema khi khởi động.

Như vậy, backend Nextus của bạn đã hoàn toàn sẵn sàng.

### 2 Chuẩn bị nội dung và biến môi trường cần thiết

Sau khi thiết lập instance Directus, bạn cần chuẩn bị các nội dung cần thiết sau để frontend hoạt động bình thường.

Nội dung liên quan:

- Thêm các ngôn ngữ bạn cần vào mô hình Languages,
- Thêm trang có slug là "home",
- Thêm navigation trên cùng có slug là "main" và navigation dưới cùng có slug là "footer"
- Cấu hình dữ liệu cần thiết trong "global"

Biến môi trường:

- Tham khảo .env.example

Tài liệu hình ảnh:

![Thiết lập ngôn ngữ](docs/language_setup.png)

---

## Nextus - Frontend (Frontend)

Frontend Nextus được xây dựng bằng Next.js 13, bạn chỉ cần fork về tài khoản Github của mình, kết nối với Vercel, thiết lập một số biến môi trường (để kết nối với Directus), và Nextus của bạn sẽ được đưa lên trực tuyến.

Tất nhiên, bạn cũng có thể clone kho lưu trữ về máy local và tùy chỉnh phát triển theo nhu cầu của mình.

## Thưởng thức!

Bây giờ, bạn đã có một backend Nextus (xây dựng bằng Directus) và một frontend Nextus (xây dựng bằng Next.js).

Hãy bắt đầu thêm nội dung của riêng bạn vào Nextus và cảm nhận sức hút của CMS không đầu cùng website frontend hiện đại nhé!

<br />

# Kế hoạch phát triển
- [ ] Hỗ trợ phân tích (Google, Baidu, Umami)
- [x] Hỗ trợ đa ngôn ngữ đầy đủ cho biểu mẫu, bài viết, trang và dự án.
- [x] Trang tài liệu chuyên dụng.
- [x] Mô-đun xác thực.
- [x] Mô-đun chuyển hướng (Redirects module)
- [x] Lấy bản dịch frontend thông qua backend (dịch thuật Directus)
- [x] Độ rộng trang được kiểm soát bởi backend.
- [x] Quản lý nội dung cho tài liệu.
- [x] Mô-đun thanh toán (trả tiền để xem bài viết, trang)
- [x] Kiểm soát truy cập dựa trên token cho việc tải file.
- [x] Viết nội dung và tạo hình ảnh bằng AI (tất cả được tích hợp trong Directus)

<br />

# Tài nguyên khác

- **[Directus Discord](https://discord.com/invite/directus)** – Tham gia cùng hơn 10,000 nhà phát triển và thành viên cộng đồng để đặt câu hỏi và thảo luận trực tiếp về Directus.
- **[Next Discord](https://discord.com/invite/bUG2bvbtHy)**

<br />

# Người đóng góp

- Lạc Truyền Nguyệt Vũ ([@luochuanyuewu](https://twitter.com/luochuanyuewu))

# Lời cảm ơn

- Bryant Gillespie ([@bryantgillespie](https://twitter.com/bryantgillespie))

Nextus ban đầu được xây dựng dựa trên mẫu [AgencyOS](https://github.com/directus-community/agency-os) do Bryant Gillespie tạo ra, nhưng giờ đây Nextus đã có hướng phát triển riêng (xem lộ trình).

# Tham gia đóng góp

Chào mừng bạn đóng góp, vui lòng đọc trước [hướng dẫn đóng góp](contributing.md).

[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](code_of_conduct.md)

# Giải thích

Ban đầu, trước khi tôi phát hiện ra Directus, tôi đã sử dụng Strapi, và tôi đã dùng nó để xây dựng website cá nhân của mình (kho lưu trữ này). Sau khi gặp Directus và thử nghiệm trong một tuần, tôi ngay lập tức chuyển từ Strapi sang Directus, và website cá nhân của tôi cũng bắt đầu chuyển đổi dựa trên mẫu AgencyOS. Đó là lý do bạn có thể thấy trong kho lưu trữ vẫn còn một số thành phần liên quan đến Strapi (được đánh dấu là _Deprecated), nhưng đừng lo, những file này cũng sẽ được tích hợp với Directus, giúp Nextus có thêm nhiều Blocks để sử dụng.