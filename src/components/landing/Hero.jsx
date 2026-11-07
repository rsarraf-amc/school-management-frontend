import { ArrowRight } from "lucide-react";

function Hero() {
  return (
    <section className="relative w-full py-32 overflow-hidden">
      {/* gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-white to-blue-50"></div>

      {/* floating blur circles */}
      <div className="absolute top-10 left-20 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute bottom-10 right-20 w-72 h-72 bg-sky-200 rounded-full blur-3xl opacity-40"></div>

      <div className="relative max-w-7xl mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
          The Smart Platform to
          <span className="text-primary"> Manage Schools</span>
        </h1>

        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          Simplify student management, attendance, exams and communication with
          one powerful system.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <button className="flex items-center gap-2 bg-primary text-white px-7 py-3 rounded-lg hover:bg-blue-700 transition">
            Get Started
            <ArrowRight size={18} />
          </button>

          <button className="px-7 py-3 border rounded-lg">Book Demo</button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
