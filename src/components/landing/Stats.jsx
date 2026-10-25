function Stats() {
  const stats = [
    { number: "120+", label: "Schools Using Our Platform" },
    { number: "15K+", label: "Students Managed" },
    { number: "1.2K+", label: "Teachers Connected" },
    { number: "98%", label: "Customer Satisfaction" },
  ];

  return (
    <section className="w-full py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <h3 className="text-4xl font-bold text-blue-600 mb-2">
                {stat.number}
              </h3>

              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Stats;
