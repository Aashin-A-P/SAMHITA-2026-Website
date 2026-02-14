const imageUrls = [
  "gallery-images/A_img1.png",
  "gallery-images/A_img3.png",
  "gallery-images/A_img4.png",
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

export default function Gallery() {
  return (
    <section id="gallery" className="py-20 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center mb-12 text-gold-gradient">The Hall of Memories</h2>
      <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto text-center">
        Stories of valor, unity, and ingenuity - captured as legends in the realm of SAMHITA.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-7xl mx-auto">
        {imageUrls.map((url, index) => (
          <div
            key={index}
            className="bg-gray-900/70 backdrop-blur-md border border-gold-500/30 p-2 rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105"
          >
            <img
              src={`${import.meta.env.BASE_URL}${url}`}
              alt={`Gallery image ${index + 1}`}
              className="w-full h-48 object-cover rounded-md"
            />
          </div>
        ))}
      </div>
    </section>
  );
}



