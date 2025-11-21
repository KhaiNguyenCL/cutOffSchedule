import { useEffect, useState } from "react";

function App() {
  const [companies, setCompanies] = useState([]);
  const [areas, setAreas] = useState({});
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ======================
  // 1️⃣ Load dropdown-full
  // ======================
  useEffect(() => {
    console.log("🔍 Fetching dropdown data...");
    fetch("http://localhost:5000/dropdown-full")
      .then((res) => {
        console.log("📡 Response status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("✅ Data received:", data);
        setCompanies(data.companies);
        setAreas(data.areas);
      })
      .catch((err) => {
        console.error("❌ Lỗi load dropdown:", err);
      });
  }, []);

  // ======================
  // 2️⃣ Khi chọn công ty → reset khu vực
  // ======================
  const handleCompanyChange = (value) => {
    setSelectedCompany(value);
    setSelectedArea("");
  };

  // ======================
  // 3️⃣ Gọi API search
  // ======================
  const searchOutages = async () => {
    if (!selectedCompany || !selectedArea) {
      setError("Vui lòng chọn Công ty và Khu vực.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const url = `http://localhost:5000/search?company=${selectedCompany}&area=${selectedArea}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResults(data.results);
      }
    } catch (e) {
      setError("Không thể lấy dữ liệu từ API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Tra cứu lịch cúp điện</h1>

      {/* SELECT BOXES */}
      <div className="bg-white shadow-md rounded p-4 w-full max-w-xl mb-6">

        {/* Company Select */}
        <label className="block font-semibold mb-1">Chọn Công ty:</label>
        <select
          className="w-full p-2 border rounded mb-3"
          value={selectedCompany}
          onChange={(e) => handleCompanyChange(e.target.value)}
        >
          <option value="">-- Chọn Công ty --</option>
          {companies.map((c) => (
            <option key={c.value} value={c.value}>
              {c.text}
            </option>
          ))}
        </select>

        {/* Area Select */}
        <label className="block font-semibold mb-1">Chọn Khu vực:</label>
        <select
          className="w-full p-2 border rounded mb-3"
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          disabled={!selectedCompany}
        >
          <option value="">-- Chọn Khu vực --</option>

          {selectedCompany &&
            areas[selectedCompany]?.map((a) => (
              <option key={a.value} value={a.value}>
                {a.text}
              </option>
            ))}
        </select>

        {/* Search Button */}
        <button
          onClick={searchOutages}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded font-semibold"
        >
          Tra cứu
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-200 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="text-blue-600 font-semibold text-lg">Đang tải...</div>
      )}

      {/* RESULT TABLE */}
      {!loading && results.length > 0 && (
        <div className="w-full max-w-4xl bg-white shadow-md rounded p-4">
          <h2 className="text-xl font-bold mb-3">Kết quả:</h2>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Điện lực</th>
                <th className="border p-2">Từ</th>
                <th className="border p-2">Đến</th>
                <th className="border p-2">Khu vực</th>
                <th className="border p-2">Lý do</th>
              </tr>
            </thead>

            <tbody>
              {results.map((r, idx) => (
                <tr key={idx} className="hover:bg-gray-100">
                  <td className="border p-2">{r.dien_luc}</td>
                  <td className="border p-2">{r.from}</td>
                  <td className="border p-2">{r.to}</td>
                  <td className="border p-2">{r.khu_vuc}</td>
                  <td className="border p-2">{r.ly_do}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
