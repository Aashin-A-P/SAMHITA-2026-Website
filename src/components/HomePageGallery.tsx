import { useEffect, useRef, useState } from 'react';

const imageUrls = [
  "gallery-images/A_img1.png",
  "gallery-images/A_img3.png",
  "gallery-images/A_img4.png",
  "gallery-images/1.jpg",
  "gallery-images/2.jpg",
  "gallery-images/3.jpg",
  "gallery-images/4.jpg",
  "gallery-images/5.jpg",
  "gallery-images/6.jpg",
  "gallery-images/7.jpg",
  "gallery-images/8.jpg",
  "gallery-images/9.jpg",
  "gallery-images/CBKO Exclusive Event.png",
  "gallery-images/Community Service 2014-2015.png",
  "gallery-images/Community Service 2015-2016.png",
  "gallery-images/CSMIT Inaugration 19-20.png",
  "gallery-images/CSMIT Inaugration 2019-2020.png",
  "gallery-images/Demonstrating science through experiments for Government school students.png",
  "gallery-images/Demonstrating science through experiments for Government school students(1).png",
  "gallery-images/Development Workshop.png",
  "gallery-images/Ethical Hacking Workshop.png",
  "gallery-images/General Quiz.png",
  "gallery-images/Machine Learning Workshop.png",
  "gallery-images/Math 'O' Mania.png",
  "gallery-images/Paper Presentation.png",
  "gallery-images/Python and Web Development.png",
  "gallery-images/Registration Desk.png",
  "gallery-images/School Events.png"
];


export default function HomePageGallery() {
  const imagesToShow = imageUrls;
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [showArrows, setShowArrows] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (scrollRef.current) {
        setShowArrows(scrollRef.current.scrollWidth > scrollRef.current.clientWidth);
      }
    };
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [imagesToShow.length]);

  return (
    <section id="gallery" className="py-20 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center mb-12 text-gold-gradient">The Hall of Memories</h2>
      <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto text-center">
      Stories of valor, unity, and ingenuity - captured as legends in the realm of SAMHITA.
      </p>

      <div className="max-w-7xl mx-auto relative overflow-hidden">
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar pr-16">
          {imagesToShow.map((url, index) => (
            <div key={index} className="min-w-[220px] sm:min-w-[260px] md:min-w-[280px] snap-start bg-gray-900/70 backdrop-blur-md border border-gold-500/30 p-2 rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
              <img src={`${import.meta.env.BASE_URL}${url}`} alt={`Gallery image ${index + 1}`} className="w-full h-48 object-cover rounded-md" />
            </div>
          ))}
        </div>
        {showArrows && (
          <>
            <button
              type="button"
              onClick={() => scrollRef.current?.scrollBy({ left: -320, behavior: 'smooth' })}
              className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border-2 border-samhita-600 text-samhita-600 bg-black/70 hover:bg-samhita-600 hover:text-black transition text-lg font-bold"
              aria-label="Scroll gallery left"
            >
              &lsaquo;
            </button>
            <button
              type="button"
              onClick={() => scrollRef.current?.scrollBy({ left: 320, behavior: 'smooth' })}
              className="absolute right-0 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border-2 border-samhita-600 text-samhita-600 bg-black/70 hover:bg-samhita-600 hover:text-black transition text-lg font-bold"
              aria-label="Scroll gallery right"
            >
              &rsaquo;
            </button>
          </>
        )}
      </div>
    </section>
  );
}



