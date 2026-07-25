import NotifyOnLoad from "./NotifyOnLoad";
import PhotoGlobe from "./PhotoGlobe";
import { type Photo } from "./Gallery";
import MessageBox from "./MessageBox";

// Danh sách ảnh — thả ảnh của bạn vào thư mục `public/photos/`
// rồi sửa `src` và `caption` bên dưới. Có thể thêm bao nhiêu ảnh tuỳ ý.
const photos: Photo[] = [
  { src: "/baby.jpg", caption: "Baby cute" },
  { src: "/tot_nghiep_cap1.jpg", caption: "Tốt nghiệp cấp 1" },
  { src: "/with_mom.jpg", caption: "Với mẹ" },
  { src: "/display-image.svg", caption: "Góc sân và khoảng trời" },
  { src: "/display-image.svg", caption: "Buổi chiều thả diều" },
  { src: "/display-image.svg", caption: "Cùng lũ bạn trong xóm" },
  { src: "/display-image.svg", caption: "Ngày mưa đầu mùa" },
  { src: "/display-image.svg", caption: "Trung thu rước đèn" },
];

export default function Home() {
  return (
    <main className="page">
      <NotifyOnLoad />

      <header className="hero">
        <span className="hero__badge">Ảnh vu vơ</span>
        <h1 className="hero__title">Ảnh vu vơ vu vơ</h1>
        <p className="hero__subtitle">
          Xoay quả cầu để dạo qua từng khoảnh khắc, bấm vào một tấm ảnh để xem
          lớn hơn, và để lại đôi lời nhắn gửi bên dưới nhé.
        </p>
      </header>

      <PhotoGlobe photos={photos} />

      <MessageBox />
    </main>
  );
}
