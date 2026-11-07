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
import useApiData from "../../../hooks/useApiData";
import { classesApi, studentsApi } from "../../../services/api";
import { classFromApi } from "../../../utils/mappers";

const dateOnly = (v) => (v ? String(v).slice(0, 10) : "");

/* ------ Input ------- */
const Input = ({
  label,
  name,
  type = "text",
  placeholder,
  options = null,
  value,
  onChange,
  required = false,
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
        {options.map((opt) => {
          const optValue = typeof opt === "object" ? opt.value : opt;
          const optLabel = typeof opt === "object" ? opt.label : opt;
          return <option key={optValue} value={optValue}>{optLabel}</option>;
        })}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
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

  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    data: classList,
    loading: classesLoading,
    error: classesError,
    reload: reloadClasses,
  } = useApiData(async () => (await classesApi.list()).map(classFromApi), [], []);

  const {
    data: existingRaw,
    loading: studentLoading,
    error: studentError,
    reload: reloadStudent,
  } = useApiData(() => (id ? studentsApi.get(id) : Promise.resolve(null)), [id], null);

  /* --------- Initial State ------- */
  const initialState = {
    classId: "",
    admissionNumber: "",
    rollNumber: "",
    class: "",
    section: "",
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "Male",
    dateOfBirth: "",
    religion: "",
    bloodGroup: "",
    mobileNumber: "",
    email: "",
    aadharNumber: "",
    admissionDate: new Date().toISOString().split("T")[0],
    guardianName: "",
    guardianPhone: "",
    guardianEmail: "",
    guardianOccupation: "",
    guardianEducation: "",
    address: "",
    profilePhoto: null,
  };

  const baseData = useMemo(() => {
    const s = existingRaw;
    if (!s) return initialState;
    return {
      ...initialState,
      classId: s.ClassId != null ? String(s.ClassId) : "",
      admissionNumber: s.AdmissionNumber ?? "",
      rollNumber: s.RollNumber ?? "",
      class: s.Class ?? "",
      section: s.Section ?? "",
      firstName: s.FirstName ?? "",
      middleName: s.MiddleName ?? "",
      lastName: s.LastName ?? "",
      gender: s.Gender ?? "Male",
      dateOfBirth: dateOnly(s.DateOfBirth),
      religion: s.Religion ?? "",
      bloodGroup: s.BloodGroup ?? "",
      mobileNumber: s.MobileNumber ?? "",
      email: s.Email ?? "",
      aadharNumber: s.AadharNumber ?? "",
      admissionDate: dateOnly(s.AdmissionDate) || initialState.admissionDate,
      guardianName: s.ParentName ?? "",
      guardianPhone: s.ParentPhone ?? "",
      guardianEmail: s.ParentEmail ?? "",
      guardianOccupation: s.ParentOccupation ?? "",
      guardianEducation: s.ParentEducation ?? "",
      address: s.Address ?? "",
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingRaw]);

  const [edits, setFormData] = useState(null);
  const formData = edits ?? baseData;
  const existingPhoto = existingRaw?.ProfilePhotoUrl || null;
  const classOptions = useMemo(
    () => classList.map((c) => ({ value: String(c.id), label: c.name })),
    [classList],
  );

  const photoPreview = useMemo(() => {
    if (!formData.profilePhoto) return existingPhoto;
    return URL.createObjectURL(formData.profilePhoto);
  }, [formData.profilePhoto, existingPhoto]);

  useEffect(() => {
    return () => {
      if (photoPreview && formData.profilePhoto) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview, formData.profilePhoto]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClassChange = (e) => {
    const classId = e.target.value;
    const selected = classList.find((c) => String(c.id) === classId);
    setFormData({ ...formData, classId, class: selected ? selected.name : "" });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setFormData({ ...formData, profilePhoto: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSubmitError("");
    if (!formData.classId) {
      setSubmitError("Please select a class.");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...formData, classId: Number(formData.classId) };
      if (!payload.profilePhoto) delete payload.profilePhoto;
      if (id) {
        await studentsApi.update(id, payload);
      } else {
        await studentsApi.create(payload);
      }
      navigate("../list");
    } catch (err) {
      setSubmitError(err.message || "Failed to save student");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  if (id && studentLoading) {
    return (
      <div className="bg-white p-12 rounded-3xl text-center border border-slate-100 shadow-sm text-slate-500 font-bold">
        Loading student...
      </div>
    );
  }

  if (id && studentError) {
    return (
      <div className="bg-white p-12 rounded-3xl text-center border border-slate-100 shadow-sm">
        <p className="text-rose-600 mb-6 font-bold">{studentError}</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={reloadStudent}
            className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold"
          >
            Retry
          </button>
          <button
            onClick={handleCancel}
            className="px-6 py-3 border border-slate-200 bg-white text-slate-600 rounded-2xl font-bold"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-12">
      {(submitError || classesError) && (
        <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl text-sm font-bold flex items-center justify-between gap-4">
          <span>{submitError || `Could not load classes: ${classesError}`}</span>
          {!submitError && (
            <button
              type="button"
              onClick={reloadClasses}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
            >
              Retry
            </button>
          )}
        </div>
      )}
      <div className="grid xl:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="xl:col-span-2 space-y-8">
          <SectionCard title="Academic Info" icon={BookOpen}>
            <div className="p-6 grid md:grid-cols-2 gap-6">
              <Input
                name="admissionNumber"
                label="Admission No"
                required
                value={formData.admissionNumber}
                onChange={handleChange}
              />
              <Input
                name="rollNumber"
                label="Roll No"
                required
                value={formData.rollNumber}
                onChange={handleChange}
              />
              <Input
                name="classId"
                label={classesLoading ? "Class (loading...)" : "Class"}
                required
                options={classOptions}
                value={formData.classId}
                onChange={handleClassChange}
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
                name="middleName"
                label="Middle Name"
                value={formData.middleName}
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
                required
                options={["Male", "Female", "Other"]}
                value={formData.gender}
                onChange={handleChange}
              />
              <Input
                name="dateOfBirth"
                type="date"
                label="DOB"
                required
                value={formData.dateOfBirth}
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
                name="mobileNumber"
                label="Mobile Number"
                value={formData.mobileNumber}
                onChange={handleChange}
              />
              <Input
                name="aadharNumber"
                label="Aadhar Number"
                value={formData.aadharNumber}
                onChange={handleChange}
              />
              <Input
                name="religion"
                label="Religion"
                value={formData.religion}
                onChange={handleChange}
              />
              <Input
                name="bloodGroup"
                label="Blood Group"
                value={formData.bloodGroup}
                onChange={handleChange}
              />
              <Input
                name="admissionDate"
                type="date"
                label="Admission Date"
                value={formData.admissionDate}
                onChange={handleChange}
              />
            </div>
          </SectionCard>

          <SectionCard title="Guardian Info" icon={ShieldCheck}>
            <div className="p-6 grid md:grid-cols-2 gap-6">
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
              <Input
                name="guardianEmail"
                type="email"
                label="Email"
                value={formData.guardianEmail}
                onChange={handleChange}
              />
              <Input
                name="guardianOccupation"
                label="Occupation"
                value={formData.guardianOccupation}
                onChange={handleChange}
              />
              <Input
                name="guardianEducation"
                label="Education"
                value={formData.guardianEducation}
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
          disabled={saving}
          className="px-8 py-3 bg-indigo-600 text-white rounded-2xl flex items-center gap-2 font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Save size={18} /> {saving ? "Saving..." : id ? "Update Student" : "Submit Admission"}
        </button>
      </div>
    </form>
  );
}
