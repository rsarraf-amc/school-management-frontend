function Trusted() {
  const schools = [
    "Green Valley School",
    "Future Academy",
    "Bright Minds School",
    "City Public School",
  ];

  return (
    <section className="w-full py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        
        {/* Title */}
        <p className="text-sm font-semibold tracking-widest text-indigo-600 uppercase mb-3">
          Trusted Worldwide
        </p>

        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Trusted by Leading Schools
        </h2>

        <p className="text-gray-500 mb-12 max-w-2xl mx-auto">
          Join hundreds of schools already using our platform to manage students,
          teachers, and academics seamlessly.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {schools.map((school, index) => (
            <div
              key={index}
              className="group bg-white border border-gray-100 rounded-2xl px-6 py-8 
                         shadow-sm hover:shadow-xl hover:-translate-y-1 
                         transition-all duration-300"
            >
              <div className="text-gray-700 font-semibold group-hover:text-indigo-600 transition">
                {school}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Trusted;