import { useEffect, useState } from "react";
import axios from "axios";

const DailyPatientDisplay = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/patient/getPatient"
        );
        console.log(res);
        setPatients(res.data.data);
      } catch (err) {
        console.error("Failed to fetch patients:", err);
      }
    };

    fetchPatients();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <header className="bg-white text-white p-4 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-semibold flex items-center text-black text-opacity-90 hover:text-opacity-100 transition-opacity duration-300 font-agile">
            Triage Ai
          </h1>
        </div>
      </header>
      <h1 className="mt-10 text-3xl font-bold text-center text-gray-800 mb-8">
        Today's Patients
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-5">
        {patients.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">
            No patients for today.
          </p>
        ) : (
          patients.map((patient) => (
            <div
              key={patient._id}
              className="p-6 shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 rounded-2xl border border-gray-200 bg-white cursor-pointer hover:ring-2 hover:ring-blue-300"
            >
              <h2 className="text-2xl font-semibold mb-3 text-gray-800">
                {patient.name}
              </h2>
              <p className="text-gray-600 mb-1">
                Age: <span className="font-medium">{patient.age}</span>
              </p>
              <p className="text-gray-600 mb-1">
                Gender: <span className="font-medium">{patient.gender}</span>
              </p>
              <p className="text-gray-600 mb-3">
                Doctor Type:{" "}
                <span className="font-medium">{patient.doctorType}</span>
              </p>

              <div className="flex flex-wrap gap-2">
                {patient.symptoms.map((symptom, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition"
                  >
                    {symptom}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DailyPatientDisplay;
