import { useNavigate } from "react-router-dom";
import { ArrowLeft, Construction } from "lucide-react";

export default function ComingSoon({ title }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
      <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center mb-6 animate-pulse">
        <Construction size={40} />
      </div>
      
      <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">
        {title || "Feature Coming Soon"}
      </h1>
      <p className="text-slate-500 font-medium max-w-md mx-auto mb-8">
        We're working hard to bring this module to life. This section will be functional in the next update!
      </p>

      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95"
      >
        <ArrowLeft size={18} />
        Go Back
      </button>

      <div className="mt-12 grid grid-cols-3 gap-4 w-full max-w-sm opacity-20">
        <div className="h-2 bg-slate-200 rounded-full"></div>
        <div className="h-2 bg-slate-200 rounded-full"></div>
        <div className="h-2 bg-slate-200 rounded-full"></div>
      </div>
    </div>
  );
}
