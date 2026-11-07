import { Clock, BarChart3, MessageSquare, FileText } from "lucide-react";

function Benefits() {
  const benefits = [
    {
      icon: <Clock size={28} className="text-blue-600" />,
      title: "Save Administrative Time",
      desc: "Automate attendance, reports and communication so staff can focus on students.",
    },
    {
      icon: <BarChart3 size={28} className="text-blue-600" />,
      title: "Real-Time Insights",
      desc: "Monitor student performance, attendance trends and school metrics instantly.",
    },
    {
      icon: <MessageSquare size={28} className="text-blue-600" />,
      title: "Better Parent Communication",
      desc: "Keep parents informed with notifications, announcements and updates.",
    },
    {
      icon: <FileText size={28} className="text-blue-600" />,
      title: "Paperless Administration",
      desc: "Digitize records, exams and reports to eliminate paperwork.",
    },
  ];

  return (
    <section id="benefits" className="w-full py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900">
            Why Schools Choose Our Platform
          </h2>

          <p className="text-gray-600 mt-4">
            Built to simplify school administration and improve productivity.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex gap-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition"
            >
              <div className="p-3 bg-blue-50 rounded-lg h-fit">
                {benefit.icon}
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>

                <p className="text-gray-600">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Benefits;
