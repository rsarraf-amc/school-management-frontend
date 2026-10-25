import { School, Users, ClipboardList } from "lucide-react"

function HowItWorks() {
  const steps = [
    {
      icon: School,
      title: "Add Your School",
      desc: "Register your school and create admin access."
    },
    {
      icon: Users,
      title: "Manage Students",
      desc: "Add students, teachers and classes easily."
    },
    {
      icon: ClipboardList,
      title: "Track Everything",
      desc: "Monitor attendance, results and fees."
    }
  ]

  return (
    <section id="how-it-works" className="w-full py-24 bg-gray-50">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <h2 className="text-4xl font-bold text-gray-900">
            How It Works
          </h2>

        </div>

        <div className="grid md:grid-cols-3 gap-10">

          {steps.map((step, index) => (
            <div
              key={index}
              className="p-8 bg-white rounded-xl shadow-sm"
            >
              <step.icon className="text-blue-600 mb-4" size={48} />
              <div className="text-blue-600 font-bold text-xl mb-4">
                Step {index + 1}
              </div>

              <h3 className="text-xl font-semibold mb-2">
                {step.title}
              </h3>

              <p className="text-gray-600">
                {step.desc}
              </p>

            </div>
          ))}

        </div>

      </div>

    </section>
  )
}

export default HowItWorks;