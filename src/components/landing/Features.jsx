import Container from "../common/Container";
import {
  Users,
  Book,
  ClipboardClock,
  BookOpenCheck,
  UserRoundCog,
  Speech,
} from "lucide-react";

function Features() {
  const features = [
    {
      icon: Book,
      title: "Student Management",
      desc: "Store and manage all student records securely.",
    },
    {
      icon: ClipboardClock,
      title: "Attendance Tracking",
      desc: "Track daily attendance automatically.",
    },
    {
      icon: BookOpenCheck,
      title: "Exam & Results",
      desc: "Generate report cards and exam analytics.",
    },
    {
      icon: UserRoundCog,
      title: "Teacher Management",
      desc: "Manage teacher schedules and profiles.",
    },
    {
      icon: Speech,
      title: "Parent Communication",
      desc: "Send notifications and updates instantly.",
    },
    {
      icon: Users,
      title: "Fee Management",
      desc: "Track school payments and invoices.",
    },
  ];

  return (
    <section
      id="features"
      className="w-full py-28 bg-gradient-to-b from-white via-blue-50/40 to-white relative overflow-hidden"
    >
      <Container>
        {/* heading */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Everything Your School Needs
          </h2>

          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Powerful modern tools designed to simplify school management and
            improve productivity.
          </p>
        </div>

        {/* grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-2xl 
                         bg-white/60 backdrop-blur-xl
                         border border-white/40
                         shadow-sm hover:shadow-2xl
                         hover:-translate-y-2
                         transition-all duration-300"
            >
              {/* gradient glow */}
              <div className="absolute inset-0 bg-gradient-to-br 
                              from-blue-500/0 via-indigo-500/0 to-purple-500/0
                              group-hover:from-blue-500/10
                              group-hover:via-indigo-500/10
                              group-hover:to-purple-500/10
                              rounded-2xl transition" />

              {/* content */}
              <div className="relative z-10">
                
                {/* icon */}
                <div
                  className="w-14 h-14 rounded-xl 
                             bg-gradient-to-br from-blue-500 to-indigo-600
                             flex items-center justify-center
                             shadow-lg mb-6"
                >
                  <f.icon className="w-7 h-7 text-white" />
                </div>

                {/* title */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {f.title}
                </h3>

                {/* description */}
                <p className="text-gray-600 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default Features;