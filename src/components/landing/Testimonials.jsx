function Testimonials() {
  const testimonials = [
    {
      name: "David Wilson",
      role: "Principal, Green Valley School",
      feedback:
        "This system transformed how we manage students and attendance. It saved our staff hours every week.",
    },
    {
      name: "Sarah Johnson",
      role: "Administrator, Bright Minds School",
      feedback:
        "The dashboard is extremely intuitive and parents love the communication features.",
    },
    {
      name: "Michael Chen",
      role: "Director, Future Academy",
      feedback:
        "A powerful platform that simplified our entire school administration.",
    },
  ];

  return (
    <section className="w-full py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900">What Schools Say</h2>

          <p className="text-gray-600 mt-4">Trusted by educators worldwide.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="p-8 bg-white rounded-xl shadow-sm hover:shadow-lg transition"
            >
              <p className="text-gray-600 mb-6">"{t.feedback}"</p>

              <div>
                <p className="font-semibold">{t.name}</p>

                <p className="text-sm text-gray-500">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
