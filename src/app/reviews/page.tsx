"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Star, Quote, ChevronRight, MessageSquare, Award } from "lucide-react";
import { useRef } from "react";

const reviews = [
  {
    id: 1,
    name: "Ộ I i",
    score: "Band 8.0",
    comment: "alo vũ à vũ, cảm ơn vũ vì giới thiệu anh tới ielts skibidi.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbwOaIfBgo681SnQ9tXxsYxs7XP6IRLfDmUw&s",
    date: "15/12/2025",
    accent: "from-indigo-500/20"
  },
  {
    id: 2,
    name: "Faker",
    score: "Band 7.5",
    comment: "Chiếc cúp thứ 7 là dành cho Ielts Skibidi.",
    image: "https://cdn2.tuoitre.vn/thumb_w/480/471584752817336320/2025/11/20/0b89fcc0-92c9-4458-addd-1f4b13bbf00b-17636300163231290204390.jpg",
    date: "10/12/2025",
    accent: "from-rose-500/20"
  },
  {
    id: 3,
    name: "anh ALO",
    score: "Band 7.0",
    comment: "Sau khi chinh phục được 7.0 ielts với ielts skibidi, thứ tiếp theo tôi hướng đến sẽ là major!!!",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREK5zSrwzVYwXVoazwMynFv4szRnlLA1MAFQ&s",
    date: "05/12/2025",
    accent: "from-emerald-500/20"
  },
  {
    id: 4,
    name: "Sơn Tùng MTP",
    score: "Band 8.5",
    comment: "FLOP QUÁ THÌ GHI TÊN ANH VÀO!!!",
    image: "https://yt3.googleusercontent.com/c-Z7mIlntSpG6VyQ5ZqaPggqkZRhaySr-H5ZEazFN2iR1pP4eD1UGekwu0y--c4CSVhJJ1A4QT8=s900-c-k-c0x00ffffff-no-rj",
    date: "01/12/2025",
    accent: "from-violet-500/20"
  }
];

function ReviewSection({ review, index }: { review: any, index: number }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const isEven = index % 2 === 0;

  return (
    <motion.section 
      ref={containerRef}
      style={{ opacity }}
      className={`min-h-[80vh] flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-24 py-24 relative overflow-hidden`}
    >
      {/* Background Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r ${review.accent} to-transparent rounded-full blur-[120px] -z-10 opacity-30`} />

      {/* Image Side */}
      <div className="w-full lg:w-1/2 relative group">
        <motion.div 
          style={{ y }}
          className="relative aspect-[4/5] lg:aspect-square overflow-hidden rounded-[3rem] border border-white/10 shadow-2xl"
        >
          <img 
            src={review.image} 
            alt={review.name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
        </motion.div>
        
        {/* Floating Stats */}
        <motion.div 
          initial={{ x: isEven ? 50 : -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          className={`absolute ${isEven ? '-right-6' : '-left-6'} top-12 glass-premium !p-6 !rounded-3xl border-white/10 shadow-2xl z-20`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">{review.score}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">IELTS Result</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Content Side */}
      <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left">
        <motion.div
          initial={{ opacity: 0, x: isEven ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-center lg:justify-start gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          
          <div className="relative">
            <Quote className="absolute -top-12 -left-8 w-24 h-24 text-white/5 -z-10" />
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight italic">
              "{review.comment}"
            </h2>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="pt-8 flex flex-col lg:flex-row items-center gap-6"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-2xl font-black text-white shadow-xl">
            {review.name.charAt(0)}
          </div>
          <div>
            <div className="text-2xl font-black text-white tracking-tight">{review.name}</div>
            <div className="flex items-center gap-3 text-slate-500 mt-1">
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Học viên Skibidi</span>
              <span className="w-1 h-1 rounded-full bg-slate-700" />
              <span className="text-xs font-bold uppercase tracking-widest">{review.date}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-slate-950 overflow-x-hidden">
      {/* Hero Header */}
      <div className="relative pt-32 pb-20 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.15),transparent_50%)]" />
        
        <div className="max-w-7xl mx-auto text-center space-y-8 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]"
          >
            <MessageSquare className="w-4 h-4" />
            Wall of Love
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-none"
          >
            THE <span className="gradient-text">VOICE</span> OF<br />SKIBIDIANS
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-slate-400 text-xl max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Không chỉ là những con số, đây là những câu chuyện thực tế về hành trình chinh phục IELTS.
          </motion.p>
        </div>
      </div>

      {/* Main Content - No Cards, Just Immersive Sections */}
      <div className="max-w-7xl mx-auto px-6">
        {reviews.map((review, index) => (
          <ReviewSection key={review.id} review={review} index={index} />
        ))}
      </div>

      {/* Footer CTA */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="py-32 px-6 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative space-y-12">
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight">
            CÂU CHUYỆN TIẾP THEO SẼ LÀ CỦA <span className="text-indigo-500">BẠN?</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            <button className="group px-10 py-5 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-indigo-500 hover:text-white transition-all duration-500 flex items-center gap-3">
              Bắt đầu ngay
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm border border-white/5 hover:bg-slate-800 transition-all">
              Xem lộ trình
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
