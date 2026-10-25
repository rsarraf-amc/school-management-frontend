import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  User,
  BookOpen,
  ShieldCheck,
  MapPin,
  Camera,
  Save,
  ArrowLeft
} from "lucide-react";
import SectionCard from "../../ui/SectionCard";
import { classes, sections, students } from "../../../mock/studentData";

/* ------ Input ------- */
const Input = ({
  label,
  name,
  type = "text",
  placeholder,
  options = null,
  value,
  onChange,
}) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">
      {label}
    </label>

    {options ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm font-bold"
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm font-bold"
      />
    )}
  </div>
);

/* --------- Main ---------- */
export default function StudentForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find existing student
  const existingStudent = useMemo(() => {
    if (!id) return null;
    return students.find(s => s.id === parseInt(id));
  }, [id]);

  /* --------- Initial State ------- */
  const initialState = {
    admissionNo: "",
    rollNo: "",
    studentClass: "",
    section: "",
    firstName: "",
    lastName: "",
    gender: "Male",
    dob: "",
    category: "General",
    religion: "",
    bloodGroup: "",
    phone: "",
    email: "",
    admissionDate: new Date().toISOString().split("T")[0],
    fatherName: "",
    motherName: "",
    guardianName: "",
    guardianPhone: "",
    address: "",
    photo: null,
  };

  const [formData, setFormData] = useState(() => {

    if (!existingStudent) return initialState;

    return {
      ...initialState,
      ...existingStudent,
      firstName: existingStudent.name?.split(" ")[0] || "",
      lastName: existingStudent.name?.split(" ")[1] || "",
      studentClass: existingStudent.class || "",
    };
  });

  const photoPreview = useMemo(() => {
    if (!formData.photo) return null;
    if (typeof formData.photo === "string") return formData.photo;
    return URL.createObjectURL(formData.photo);
  }, [formData.photo]);

  useEffect(() => {
    return () => {
      if (photoPreview && typeof formData.photo !== "string") {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview, formData.photo]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setFormData({ ...formData, photo: file });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    // After submit, go back to list
    navigate("../list");
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-12">
      <div className="grid xl:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="xl:col-span-2 space-y-8">
          <SectionCard title="Academic Info" icon={BookOpen}>
            <div className="p-6 grid md:grid-cols-2 gap-6">
              <Input
                name="admissionNo"
                label="Admission No"
                value={formData.admissionNo}
                onChange={handleChange}
              />
              <Input
                name="rollNo"
                label="Roll No"
                value={formData.rollNo}
                onChange={handleChange}
              />
              <Input
                name="studentClass"
                label="Class"
                options={classes}
                value={formData.studentClass}
                onChange={handleChange}
              />
              <Input
                name="section"
                label="Section"
                options={sections}
                value={formData.section}
                onChange={handleChange}
              />
            </div>
          </SectionCard>

          <SectionCard title="Personal Info" icon={User}>
            <div className="p-6 grid md:grid-cols-2 gap-6">
              <Input
                name="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleChange}
              />
              <Input
                name="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
              <Input
                name="gender"
                label="Gender"
                options={["Male", "Female"]}
                value={formData.gender}
                onChange={handleChange}
              />
              <Input
                name="dob"
                type="date"
                label="DOB"
                value={formData.dob}
                onChange={handleChange}
              />
            </div>
          </SectionCard>

          <SectionCard title="Guardian Info" icon={ShieldCheck}>
            <div className="p-6 grid md:grid-cols-2 gap-6">
              <Input
                name="fatherName"
                label="Father Name"
                value={formData.fatherName}
                onChange={handleChange}
              />
              <Input
                name="motherName"
                label="Mother Name"
                value={formData.motherName}
                onChange={handleChange}
              />
              <Input
                name="guardianName"
                label="Guardian"
                value={formData.guardianName}
                onChange={handleChange}
              />
              <Input
                name="guardianPhone"
                label="Phone"
                value={formData.guardianPhone}
                onChange={handleChange}
              />
            </div>
          </SectionCard>
        </div>

        {/* RIGHT */}
        <div className="space-y-8">
          {/* Photo */}
          <SectionCard title="Photo" icon={Camera}>
            <div className="p-6 text-center">
              <div className="h-48 border-2 border-dashed flex items-center justify-center rounded-2xl overflow-hidden relative">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera size={32} className="text-slate-400" />
                )}
              </div>

              <input type="file" onChange={handleFileChange} className="mt-4" />
            </div>
          </SectionCard>

          {/* Address */}
          <SectionCard title="Address" icon={MapPin}>
            <div className="p-6">
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={5}
                className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-sm"
              />
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={handleCancel}
          type="button"
          className="px-8 py-3 border border-slate-200 bg-white text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-95"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-8 py-3 bg-indigo-600 text-white rounded-2xl flex items-center gap-2 font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
        >
          <Save size={18} /> {id ? "Update Student" : "Submit Admission"}
        </button>
      </div>
    </form>
  );
}
