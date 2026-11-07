import dashboard from "../../assets/dashboard.png";

function ProductPreview() {
  return (
    <section className="w-full py-28 bg-white">

      <div className="max-w-7xl mx-auto px-6 text-center">

        <h2 className="text-4xl font-bold text-gray-900 mb-6 ">
          One Dashboard For Everything
        </h2>

        <p className="text-gray-600 mb-14">
          Manage students, teachers, attendance and results from a single interface.
        </p>

        <div className="relative">

          <div className="absolute inset-0 bg-blue-100 blur-3xl opacity-40"></div>

          <img
            src={dashboard}
            alt="dashboard"
            className="relative rounded-xl shadow-2xl border w-[23rem] md:w-[64rem] mx-auto h-72 md:h-[36rem] object-cover"
          />

        </div>

      </div>

    </section>
  )
}

export default ProductPreview