import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useApiData from "../../../hooks/useApiData";
import { studentsApi } from "../../../services/api";
import { studentFromApi } from "../../../utils/mappers";

export default function CollectFees() {
  const navigate = useNavigate();

  const [activeSearch, setActiveSearch] = useState("filter");
  const [keyword, setKeyword] = useState("");
  const [studentId, setStudentId] = useState("");

  const { data, loading, error, reload } = useApiData(
    async () => (await studentsApi.list()).map(studentFromApi),
    [],
    [],
  );

  const students = (data || []).filter((s) =>
    activeSearch === "keyword" && keyword
      ? `${s.name} ${s.admissionNo} ${s.class}`
          .toLowerCase()
          .includes(keyword.toLowerCase())
      : true,
  );

  const goToStudent = (e) => {
    e.preventDefault();
    const id = studentId.trim();
    if (id) navigate(`/admin/fees/collect/${id}`);
  };

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        {/* Toggle */}
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

        {/* Filters */}
        {activeSearch === "filter" ? (
          <button
            onClick={reload}
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Fetching..." : "Fetch Students"}
          </button>
        ) : (
          <input
            placeholder="Search..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="border p-2 rounded w-full"
          />
        )}

        {/* Manual fallback */}
        <form onSubmit={goToStudent} className="mt-6 flex gap-2">
          <input
            placeholder="Or enter a student ID (UUID)"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button
            type="submit"
            disabled={!studentId.trim()}
            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Open
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border">
        <div className="p-6 flex justify-between">
          <h3 className="font-bold">Student List</h3>
        </div>

        {loading && <p className="p-6 text-sm text-slate-400">Loading students...</p>}
        {error && !loading && (
          <p className="p-6 text-sm text-rose-600">
            Could not load students: {error}{" "}
            <button onClick={reload} className="font-bold underline">
              Retry
            </button>
            . You can still open a student by entering their ID above.
          </p>
        )}
        {!loading && !error && students.length === 0 && (
          <p className="p-6 text-sm text-slate-400">No students found.</p>
        )}

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
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.admissionNo}</td>
                <td>{student.class}</td>
                <td>{student.fatherName}</td>
                <td>
                  <button
                    onClick={() =>
                      navigate(`/admin/fees/collect/${student.id}`)
                    }
                    className="text-green-600"
                  >
                    Collect
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
