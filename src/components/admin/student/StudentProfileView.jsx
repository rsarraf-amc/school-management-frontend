import { useParams, useNavigate } from "react-router-dom";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  BookOpen, 
  ArrowLeft,
  Edit
} from "lucide-react";
import { students } from "../../../mock/studentData";

export default function StudentProfileView() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Find student in mock data
  const student = students.find((s) => s.id === parseInt(id));

  if (!student) {
    return (
      <div className="bg-white p-12 rounded-3xl text-center border border-slate-100 shadow-sm">
        <h2 className="text-2xl font-black text-slate-900 mb-2">Student Not Found</h2>
        <p className="text-slate-500 mb-6">The student with ID {id} could not be located.</p>
        <button 
          onClick={() => navigate("../list")}
          className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold"
        >
          Back to Directory
        </button>
      </div>
    );
  }

  const DetailItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white hover:border-indigo-100 hover:shadow-sm transition-all duration-300">
      <div className="w-10 h-10 bg-white text-indigo-600 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-bold text-slate-800">{value || "Not Provided"}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Profile Card */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-16 -mb-16 blur-2xl"></div>
          
          <button 
            onClick={() => navigate("../list")}
            className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white font-bold text-sm bg-black/20 backdrop-blur-md px-4 py-2 rounded-xl transition-all border border-white/10 hover:bg-black/30"
          >
            <ArrowLeft size={16} />
            Back to Directory
          </button>

          <button 
            onClick={() => navigate(`../edit/${student.id}`)}
            className="absolute top-6 right-6 flex items-center gap-2 text-white font-bold text-sm bg-indigo-500 hover:bg-indigo-400 px-4 py-2 rounded-xl transition-all shadow-lg border border-white/20 active:scale-95"
          >
            <Edit size={16} />
            Edit Profile
          </button>
        </div>

        <div className="px-8 -mt-20 relative z-10 flex flex-col md:flex-row items-end gap-6">
          <div className="w-40 h-40 rounded-[2.5rem] p-2 bg-white shadow-2xl relative group">
            <div className="w-full h-full rounded-[2rem] overflow-hidden border-2 border-slate-50 relative">
              <img 
                src={student.photo} 
                alt={student.name} 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 text-white rounded-2xl flex items-center justify-center border-4 border-white shadow-lg ring-1 ring-emerald-500/20">
               <ShieldCheck size={18} />
            </div>
          </div>

          <div className="flex-1 pb-4">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">{student.name}</h1>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border-2 ${
                student.status === 'Active' 
                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                : 'bg-rose-50 text-rose-600 border-rose-100'
              }`}>
                {student.status}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-slate-500 font-bold text-sm">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg">
                <BookOpen size={14} className="text-indigo-500" />
                Class {student.class} - {student.section}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg">
                <User size={14} className="text-indigo-500" />
                Roll No: {student.rollNo}
              </div>
              <div className="text-slate-400 font-medium">Admission ID: {student.admissionNo}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact & Personal */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                <User size={16} />
              </div>
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem icon={Calendar} label="Date of Birth" value={student.dob} />
              <DetailItem icon={User} label="Gender" value={student.gender} />
              <DetailItem icon={ShieldCheck} label="Blood Group" value={student.bloodGroup} />
              <DetailItem icon={BookOpen} label="Admission Date" value={student.admissionDate} />
              <DetailItem icon={User} label="Category" value={student.category} />
              <DetailItem icon={ShieldCheck} label="Religion" value={student.religion} />
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center">
                <ShieldCheck size={16} />
              </div>
              Guardian Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem icon={User} label="Father Name" value={student.fatherName} />
              <DetailItem icon={User} label="Mother Name" value={student.motherName} />
              <DetailItem icon={User} label="Guardian" value={student.guardianName} />
              <DetailItem icon={Phone} label="Guardian Phone" value={student.guardianPhone} />
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                <Phone size={16} />
              </div>
              Contact Info
            </h3>
            <div className="space-y-4">
              <DetailItem icon={Phone} label="Contact No" value={student.phone} />
              <DetailItem icon={Mail} label="Email Address" value={student.email} />
              <DetailItem icon={MapPin} label="Home Address" value={student.address} />
            </div>
          </div>

          {/* Performance Summary - Visual Flair */}
          <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/30 transition-all"></div>
            <h4 className="font-black text-xl mb-6 relative z-10">Attendance</h4>
            <div className="flex items-end gap-2 mb-2 relative z-10">
              <span className="text-5xl font-black text-indigo-400">92%</span>
              <span className="text-xs text-slate-400 font-bold mb-2 uppercase tracking-tighter">Growth: +2.5%</span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full mb-6 relative z-10 overflow-hidden">
               <div className="bg-indigo-500 h-full w-[92%] transition-all duration-1000"></div>
            </div>
            <div className="grid grid-cols-2 gap-4 relative z-10">
               <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Days</p>
                 <p className="text-lg font-black">180</p>
               </div>
               <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Present</p>
                 <p className="text-lg font-black text-emerald-400">165</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
