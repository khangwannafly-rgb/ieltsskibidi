"use client";

import {
  Star,
  Award,
  Users,
  Target,
  TrendingUp,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  ArrowRight,
  FilterX,
} from "lucide-react";
import { useState, useMemo } from "react";
import Link from "next/link";

const reviews = [
  {
    id: 1,
    name: "Ộ I i",
    score: "Band 8.0",
    skill: "Writing",
    comment:
      "Cảm ơn vũ vì giới thiệu anh tới ielts skibidi. Một nền tảng học tập cực kỳ thông minh, giúp mình tiết kiệm được rất nhiều thời gian ôn luyện.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbwOaIfBgo681SnQ9tXxsYxs7XP6IRLfDmUw&s",
    date: "15/12/2025",
    size: "wide",
  },
  {
    id: 2,
    name: "Faker",
    score: "Band 7.5",
    skill: "Reading",
    comment: "Chiếc cúp thứ 7 là dành cho Ielts Skibidi. Trải nghiệm học tập tuyệt vời.",
    image:
      "https://cdn2.tuoitre.vn/thumb_w/480/471584752817336320/2025/11/20/0b89fcc0-92c9-4458-addd-1f4b13bbf00b-17636300163231290204390.jpg",
    date: "10/12/2025",
    size: "small",
  },
  {
    id: 3,
    name: "anh ALO",
    score: "Band 7.0",
    skill: "Speaking",
    comment: "7.0 ielts easy! Skibidi giúp mình tự tin hơn khi giao tiếp tiếng Anh.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREK5zSrwzVYwXVoazwMynFv4szRnlLA1MAFQ&s",
    date: "05/12/2025",
    size: "small",
  },
  {
    id: 4,
    name: "Sơn Tùng MTP",
    score: "Band 8.5",
    skill: "Listening",
    comment:
      "FLOP QUÁ THÌ GHI TÊN ANH VÀO!!! Ielts Skibidi thực sự là một cú hích lớn cho kỹ năng Listening của mình, giúp mình nghe rõ từng từ.",
    image:
      "https://yt3.googleusercontent.com/c-Z7mIlntSpG6VyQ5ZqaPggqkZRhaySr-H5ZEazFN2iR1pP4eD1UGekwu0y--c4CSVhJJ1A4QT8=s900-c-k-c0x00ffffff-no-rj",
    date: "01/12/2025",
    size: "wide",
  },
  {
    id: 5,
    name: "Học viên Ẩn danh",
    score: "Band 7.5",
    skill: "Writing",
    comment: "AI sửa lỗi cực kỳ chi tiết, giúp mình tiến bộ từng ngày.",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000&auto=format&fit=crop",
    date: "20/12/2025",
    size: "small",
  },
  {
    id: 6,
    name: "Vinh Râu",
    score: "Band 6.5",
    skill: "Speaking",
    comment:
      "Tự học ở nhà mà cảm giác như có giáo viên kèm 1-1 vậy, đỉnh thực sự! Mình đã tự tin hơn rất nhiều khi đối diện với giám khảo.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSq7tW8t6O7Y2_J5n9_v8Z7y-U5Z6L-n5p8_Q&s",
    date: "25/12/2025",
    size: "wide",
  },
  {
    id: 7,
    name: "Hieuthuhai",
    score: "Band 8.0",
    skill: "Listening",
    comment: "Nghe Skibidi xong đi thi nghe như nghe nhạc rap, dễ hiểu vô cùng.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0Y6M8p8vW9Z8Y_mYp8_z_z_z_z_z_z_z_z_z&s",
    date: "28/12/2025",
    size: "small",
  },
  {
    id: 8,
    name: "Linh Ngọc Đàm",
    score: "Band 7.5",
    skill: "Reading",
    comment:
      "Giao diện đẹp xỉu, học mà cứ ngỡ đang lướt Pinterest luôn á! Rất cảm hứng để học mỗi ngày mà không thấy chán.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSW8y1p_79fN2_Xm9r8Tz_Z_z_z_z_z_z_z_z_z&s",
    date: "30/12/2025",
    size: "wide",
  },
  {
    id: 9,
    name: "Độ Mixi",
    score: "Band 7.0",
    skill: "Speaking",
    comment: "Hợp lý! Học Ielts ở đây thấy giải trí mà vẫn hiệu quả. Anh em nên thử nhé.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRr3n_W7rL_z_z_z_z_z_z_z_z_z_z_z_z_z&s",
    date: "02/01/2026",
    size: "small",
  },
  {
    id: 10,
    name: "PewPew",
    score: "Band 8.0",
    skill: "Writing",
    comment:
      "Bạn có thể không giỏi, nhưng bạn phải cố gắng. Ielts Skibidi là công cụ tuyệt vời để bạn hiện thực hóa điều đó.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7y_z_z_z_z_z_z_z_z_z_z_z_z_z_z_z&s",
    date: "03/01/2026",
    size: "wide",
  },
  {
    id: 11,
    name: "Misthy",
    score: "Band 7.5",
    skill: "Reading",
    comment: "Thích nhất phần Reading, bài đọc phong phú và giải thích cực kỳ dễ hiểu.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_z_z_z_z_z_z_z_z_z_z_z_z_z_z_z&s",
    date: "04/01/2026",
    size: "small",
  },
  {
    id: 12,
    name: "Xemesis",
    score: "Band 7.0",
    skill: "Listening",
    comment: "Đúng chất Skibidi! Học hiệu quả mà không bị gò bó. 10 điểm cho chất lượng!",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_z_z_z_z_z_z_z_z_z_z_z_z_z_z_z&s",
    date: "05/01/2026",
    size: "small",
  },
  {
    id: 13,
    name: "Hậu Hoàng",
    score: "Band 7.5",
    skill: "Speaking",
    comment: "Vừa học vừa nhảy cũng ra được 7.5 Speaking nè. Skibidi đỉnh thật sự!",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_z_z_z_z_z_z_z_z_z_z_z_z_z_z_z&s",
    date: "06/01/2026",
    size: "small",
  },
  {
    id: 14,
    name: "Quang Hải",
    score: "Band 6.5",
    skill: "Reading",
    comment:
      "Đọc hiểu chiến thuật trên sân cỏ hay trong bài thi Ielts đều cần sự tập trung. Skibidi đã giúp tôi điều đó.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_z_z_z_z_z_z_z_z_z_z_z_z_z_z_z&s",
    date: "07/01/2026",
    size: "wide",
  },
  {
    id: 15,
    name: "Lê Bống",
    score: "Band 7.0",
    skill: "Writing",
    comment: "Viết lách không còn là nỗi sợ nhờ AI của Skibidi. Cảm ơn team rất nhiều!",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_z_z_z_z_z_z_z_z_z_z_z_z_z_z_z&s",
    date: "08/01/2026",
    size: "small",
  },
  {
    id: 16,
    name: "Trấn Thành",
    score: "Band 8.0",
    skill: "Speaking",
    comment:
      "Ielts Skibidi là một bước ngoặt lớn. Ngôn ngữ không chỉ là công cụ, nó là nghệ thuật.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_z_z_z_z_z_z_z_z_z_z_z_z_z_z_z&s",
    date: "10/01/2026",
    size: "small",
  },
];

const stats = [
  { label: "Học viên", value: "5,000+", icon: Users },
  { label: "Band cao nhất", value: "8.5", icon: Award },
  { label: "Mục tiêu đạt được", value: "92%", icon: Target },
  { label: "Bài làm mỗi ngày", value: "1,200+", icon: TrendingUp },
];

const categories = [
  { id: "all", label: "Tất cả", icon: FilterX },
  { id: "Reading", label: "Reading", icon: BookOpen },
  { id: "Listening", label: "Listening", icon: Headphones },
  { id: "Writing", label: "Writing", icon: PenTool },
  { id: "Speaking", label: "Speaking", icon: Mic },
];

function ReviewCard({ review }: { review: (typeof reviews)[number] }) {
  const [imgError, setImgError] = useState(false);
  const sizeClasses = {
    small: "col-span-1",
    wide: "col-span-1 md:col-span-2",
  };
  const isInvalidUrl = !review.image || review.image.includes("_z_z_z");

  return (
    <div
      className={`${sizeClasses[review.size as keyof typeof sizeClasses]} bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between`}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-900 flex items-center justify-center text-white text-base font-bold shrink-0">
              {!imgError && !isInvalidUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={review.image}
                  alt={review.name}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{review.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{review.name}</h3>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                Kỹ năng: <span className="text-slate-700 font-semibold">{review.skill}</span>
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold font-mono shrink-0">
            {review.score}
          </span>
        </div>

        <p className="text-slate-600 text-sm leading-relaxed">&ldquo;{review.comment}&rdquo;</p>
      </div>

      <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <span className="text-slate-400 font-mono">{review.date}</span>
      </div>
    </div>
  );
}

export default function ReviewsPage() {
  const [filter, setFilter] = useState("all");

  const filteredReviews = useMemo(() => {
    if (filter === "all") return reviews;
    return reviews.filter((r) => r.skill === filter);
  }, [filter]);

  return (
    <div className="bg-[#F8FAFC] min-h-screen pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-sm">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold uppercase tracking-wider">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="IELTS SKIBIDI" className="w-4 h-4 rounded-xs object-cover" />
              IELTS SKIBIDI • Kết quả học viên
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Bảng vàng thành tích học viên IELTS SKIBIDI
            </h1>

            <p className="text-slate-600 text-base leading-relaxed">
              Nơi lưu giữ những cột mốc đáng nhớ của cộng đồng học viên IELTS SKIBIDI trên hành
              trình chinh phục Band điểm mục tiêu.
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-100">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900 font-mono">{stat.value}</div>
                  <div className="text-xs font-medium text-slate-500">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all border ${
                  filter === cat.id
                    ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <cat.icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            ))}
          </div>

          <div className="text-xs font-medium text-slate-500">
            Hiển thị <span className="font-bold text-slate-900">{filteredReviews.length}</span> đánh
            giá từ học viên
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 grid-flow-dense">
          {filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="bg-slate-900 rounded-2xl p-8 sm:p-10 text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              IELTS SKIBIDI • Computer-Delivered Practice
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Sẵn sàng ghi tên mình lên bảng thành tích IELTS SKIBIDI?
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Luyện thi đầy đủ 4 kỹ năng với bộ đề chuẩn Cambridge và nhận phân tích chi tiết theo
              từng tiêu chí chấm điểm.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/dashboard"
              className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-sm transition-colors inline-flex items-center gap-2"
            >
              Bắt đầu luyện tập
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
