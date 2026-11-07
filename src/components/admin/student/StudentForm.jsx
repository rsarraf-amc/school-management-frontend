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
import { apiService } from "../../../services/apiService";

/* ------ Input ------- */
const Input = ({
  label,
  name,
  type = "text",
  placeholder,
  options = null,
  required = false,
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
        required={required}
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
        required={required}
        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm font-bold"
      />
    )}
  </div>
);

const initialStudentState = {
  ecNumber: "",
  admissionNo: "",
  rollNo: "",
  studentClass: "",
  section: "",
  firstName: "",
  lastName: "",
  gender: "Male",
  dob: "",
  email: "",
  category: "General",
  religion: "",
  bloodGroup: "",
  phone: "",
  admissionDate: new Date().toISOString().split("T")[0],
  fatherName: "",
  motherName: "",
  guardianName: "",
  guardianPhone: "",
  address: "",
  photo: null,
};

/* --------- Main ---------- */
export default function StudentForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialStudentState);
  const [classRecords, setClassRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const loadFormData = async () => {
      try {
        const [classes, student] = await Promise.all([
          apiService.getAllClasses(),
          id ? apiService.getStudentById(id) : Promise.resolve(null),
        ]);
        if (!active) return;
        setClassRecords(classes);
        if (student) {
          setFormData({
            ...initialStudentState,
            ecNumber: student.ecNumber || "",
            admissionNo: student.admissionNumber || "",
            rollNo: student.rollNumber || "",
            studentClass: student.class || "",
            section: student.section || "",
            firstName: student.firstName || "",
            lastName: student.lastName || "",
            gender: student.gender || "Male",
            dob: student.dateOfBirth || "",
            email: student.email || "",
            phone: student.mobileNumber || "",
            guardianName: student.guardianName || "",
            guardianPhone: student.guardianPhone || "",
            address: student.address || "",
            photo: student.profilePhotoUrl || null,
          });
        }
      } catch (requestError) {
        if (active) setError(requestError.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadFormData();
    return () => {
      active = false;
    };
  }, [id]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedClass = classRecords.find(
      (classRecord) => classRecord.name === formData.studentClass,
    );
    if (!selectedClass) {
      setError("Select a class before submitting the student record.");
      return;
    }

    const payload = new FormData();
    const fields = {
      ecNumber: formData.ecNumber,
      admissionNumber: formData.admissionNo,
      rollNumber: formData.rollNo,
      class: selectedClass.name,
      classId: selectedClass.id,
      section: formData.section,
      firstName: formData.firstName,
      lastName: formData.lastName,
      gender: formData.gender,
      dateOfBirth: formData.dob,
      email: formData.email,
      mobileNumber: formData.phone,
      guardianName: formData.guardianName,
      guardianPhone: formData.guardianPhone,
      address: formData.address,
    };
    Object.entries(fields).forEach(([key, value]) => payload.append(key, value));
    if (formData.photo instanceof File) {
      payload.append("profilePhoto", formData.photo);
    }

    setSaving(true);
    setError("");
    try {
      if (id) await apiService.updateStudent(id, payload);
      else await apiService.createStudent(payload);
      navigate("../list");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  if (id && error && !loading) {
    return (
      <div role="alert" className="rounded-xl bg-rose-50 p-5 text-sm font-medium text-rose-700">
        <p>{error}</p>
        <button type="button" onClick={handleCancel} className="mt-4 rounded-xl bg-white px-4 py-2 text-slate-700">
          Back
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-12">
      {error && (
        <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm font-medium text-rose-700">
          {error}
        </p>
      )}
      {loading && (
        <p className="rounded-xl bg-white p-4 text-sm font-medium text-slate-500">
          Loading student...
        </p>
      )}
      <div className="grid xl:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="xl:col-span-2 space-y-8">
          <SectionCard title="Academic Info" icon={BookOpen}>
            <div className="p-6 grid md:grid-cols-2 gap-6">
              <Input
                  name="ecNumber"
                  label="EC Number"
                  value={formData.ecNumber}
                  onChange={handleChange}
                />
                <Input
                  name="admissionNo"
                  label="Admission No"
                  required
                value={formData.admissionNo}
                onChange={handleChange}
              />
              <Input
                name="email"
                type="email"
                label="Email"
                required
                value={formData.email}
                onChange={handleChange}
              />
              <Input
                name="rollNo"
                label="Roll No"
                required
                value={formData.rollNo}
                onChange={handleChange}
              />
              <Input
                name="studentClass"
                label="Class"
                required
                options={classRecords.map((classRecord) => classRecord.name)}
                value={formData.studentClass}
                onChange={handleChange}
              />
              <Input
                name="section"
                label="Section"
                required
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
                required
                value={formData.firstName}
                onChange={handleChange}
              />
              <Input
                name="lastName"
                label="Last Name"
                required
                value={formData.lastName}
                onChange={handleChange}
              />
              <Input
                name="gender"
                label="Gender"
                options={["Male", "Female"]}
                required
                value={formData.gender}
                onChange={handleChange}
              />
              <Input
                name="dob"
                type="date"
                label="DOB"
                required
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
                required
                value={formData.guardianName}
                onChange={handleChange}
              />
              <Input
                name="guardianPhone"
                label="Phone"
                required
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
                required
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
          disabled={loading || saving || Boolean(id && error)}
          className="px-8 py-3 bg-indigo-600 text-white rounded-2xl flex items-center gap-2 font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
        >
          <Save size={18} /> {saving ? "Saving..." : id ? "Update Student" : "Submit Admission"}
        </button>
      </div>
    </form>
  );
}
