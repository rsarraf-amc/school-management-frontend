import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { apiService } from "../../../services/apiService";

export default function CollectFees() {
  const navigate = useNavigate();
  const [activeSearch, setActiveSearch] = useState("filter");
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([apiService.getAllStudents(), apiService.getAllClasses()])
      .then(([studentRecords, classRecords]) => {
        if (!active) return;
        setStudents(studentRecords);
        setClasses(classRecords);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filteredStudents = useMemo(() => {
    const query = searchTerm.toLowerCase();
    return students.filter((student) => {
      const name = [student.firstName, student.lastName]
        .filter(Boolean)
        .join(" ");
      const matchesSearch =
        !query ||
        name.toLowerCase().includes(query) ||
        String(student.admissionNumber || "").toLowerCase().includes(query);
      const matchesClass =
        !selectedClass || String(student.class) === String(selectedClass);
      return matchesSearch && matchesClass;
    });
  }, [searchTerm, selectedClass, students]);

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveSearch("filter")}
            className={activeSearch === "filter" ? "font-bold text-blue-600" : ""}
          >
            Select Criteria
          </button>
          <button
            onClick={() => setActiveSearch("keyword")}
            className={activeSearch === "keyword" ? "font-bold text-blue-600" : ""}
          >
            Search Keyword
          </button>
        </div>

        {activeSearch === "filter" ? (
          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={selectedClass}
              onChange={(event) => setSelectedClass(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2"
            >
              <option value="">All classes</option>
              {classes.map((classRecord) => (
                <option key={classRecord.id} value={classRecord.name}>
                  {classRecord.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="bg-black text-white px-4 py-2 rounded"
              onClick={() => setSearchTerm("")}
            >
              Fetch Students
            </button>
          </div>
        ) : (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by name or admission number..."
              className="w-full rounded-xl border border-slate-200 py-2 pl-10 pr-4"
            />
          </div>
        )}
      </div>

      {error && <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm font-medium text-rose-700">{error}</p>}

      <div className="bg-white rounded-xl border">
        <div className="p-6 flex justify-between">
          <h3 className="font-bold">Student List</h3>
        </div>

        {loading ? (
          <p className="p-6 text-sm text-slate-500">Loading students...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Admission</th>
                  <th>Class</th>
                  <th>Guardian</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>{[student.firstName, student.lastName].filter(Boolean).join(" ")}</td>
                    <td>{student.admissionNumber}</td>
                    <td>{student.class}</td>
                    <td>{student.guardianName}</td>
                    <td>
                      <button
                        onClick={() => navigate(`/admin/fees/collect/${student.id}`)}
                        className="text-green-600"
                      >
                        Collect
                      </button>
                    </td>
                  </tr>
                ))}
                {!error && filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-sm text-slate-500">
                      No students match the selected criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
