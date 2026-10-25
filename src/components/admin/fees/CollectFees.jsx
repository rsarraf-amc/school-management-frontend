import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  ArrowRight,
  BookOpen,
  Clock,
  AlertCircle,
} from "lucide-react";

import { feesStudents } from "../../../mock/feesData";

export default function CollectFees() {
  const navigate = useNavigate();

  const [activeSearch, setActiveSearch] = useState("filter");

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
          <button className="bg-black text-white px-4 py-2 rounded">
            Fetch Students
          </button>
        ) : (
          <input
            placeholder="Search..."
            className="border p-2 rounded w-full"
          />
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border">
        <div className="p-6 flex justify-between">
          <h3 className="font-bold">Student List</h3>
        </div>

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
            {feesStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.admissionNo}</td>
                <td>{student.class}</td>
                <td>{student.father}</td>
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