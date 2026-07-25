import NotifyOnLoad from "./NotifyOnLoad";
import Gallery, { type Photo } from "./Gallery";
import MessageBox from "./MessageBox";

// Danh sách ảnh — thả ảnh của bạn vào thư mục `public/photos/`
// rồi sửa `src` và `caption` bên dưới. Có thể thêm bao nhiêu ảnh tuỳ ý.
const photos: Photo[] = [
  { src: "/display-image.svg", caption: "Ngày đầu tiên đến trường" },
  { src: "/display-image.svg", caption: "Mùa hè bên bà" },
  { src: "/display-image.svg", caption: "Sinh nhật 6 tuổi" },
  { src: "/display-image.svg", caption: "Chuyến đi biển đầu tiên" },
  { src: "/display-image.svg", caption: "Tết năm ấy" },
  { src: "/display-image.svg", caption: "Góc sân và khoảng trời" },
];

export default function Home() {
  return (
    <main className="page">
      <NotifyOnLoad />

      <header className="hero">
        <span className="hero__badge">Album kỷ niệm</span>
        <h1 className="hero__title">Ký ức tuổi thơ</h1>
        <p className="hero__subtitle">
          Những khoảnh khắc đẹp nhất của một thời để nhớ. Bấm vào từng tấm ảnh
          để xem lớn hơn, và để lại đôi lời nhắn gửi bên dưới nhé.
        </p>
      </header>

      <Gallery photos={photos} />

      <MessageBox />
    </main>
  );
}
