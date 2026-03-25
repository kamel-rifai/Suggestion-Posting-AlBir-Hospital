"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Complaint {
  id: number;
  name: string;
  reporter_name: string;
  floor: number;
  device_type: string;
  complaint_type: string;
  notes: string;
  status?: string;
  created_at?: string;
}

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  accent: string;
  sub?: string;
}

// ─── Static maps ─────────────────────────────────────────────────────────────

const FLOOR_LABELS: Record<string, string> = {
  "0": "القبو",
  "1": "الطابق الأرضي",
  "2": "الطابق الثاني",
  "3": "قسم التدريب",
  "4": "الطابق الرابع",
  "5": "الطابق الخامس",
  "6": "الطابق السادس",
  "7": "الطابق السابع",
  "8": "الطابق الثامن",
  "9": "الطابق التاسع",
  "10": "الطابق العاشر",
  "11": "العيادات",
  "12": "الاسعاف",
  "13": "قسم ال IT",
  "16": "معالجة فيزيائية",
  "17": "تشريح مرضي",
  "18": "قسم الكلية",
};

const DEVICE_LABELS: Record<string, string> = {
  phone: "الهاتف",
  internet: "انترنت",
  nursing: "التمريض",
  laptop: "لابتوب",
  printer: "طابعة",
  other: "غير ذلك",
};

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; dot: string }
> = {
  new: {
    label: "جديدة",
    color: "bg-gray-50 text-gray-700 border-gray-200",
    dot: "bg-gray-400",
  },
  current: {
    label: "قيد العمل",
    color: "bg-orange-50 text-orange-700 border-orange-200",
    dot: "bg-orange-400",
  },
  finished: {
    label: "منتهية",
    color: "bg-green-50 text-green-700 border-green-200",
    dot: "bg-green-500",
  },
  refused: {
    label: "مرفوضة",
    color: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-400",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat("ar-SA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
};

const getStatus = (c: Complaint) => c.status ?? "new";

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  accent,
  sub,
}) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-start gap-4">
    <div
      className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${accent}`}
    >
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-slate-800 leading-none">{value}</p>
      <p className="text-sm text-slate-500 mt-1">{label}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const BarRow: React.FC<{
  label: string;
  count: number;
  max: number;
  color: string;
}> = ({ label, count, max, color }) => (
  <div className="flex items-center gap-3 text-sm" dir="rtl">
    <span className="text-slate-600 w-36 text-right truncate flex-shrink-0">
      {label}
    </span>
    <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
      <div
        className={`h-2 rounded-full transition-all duration-500 ${color}`}
        style={{ width: max > 0 ? `${(count / max) * 100}%` : "0%" }}
      />
    </div>
    <span className="text-slate-800 font-semibold w-6 text-left flex-shrink-0">
      {count}
    </span>
  </div>
);

// ─── Login Gate ───────────────────────────────────────────────────────────────

const LoginGate: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const attempt = () => {
    if (password === "123") {
      onSuccess();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex items-center justify-center px-4">
      <div
        className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-10 w-full max-w-sm transition-transform ${
          shake ? "animate-[shake_0.4s_ease]" : ""
        }`}
      >
        {/* Lock icon */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center shadow-md">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path strokeLinecap="round" d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
        </div>

        <h2 className="text-center text-xl font-bold text-slate-800 mb-1">
          لوحة التحكم
        </h2>
        <p className="text-center text-slate-500 text-sm mb-7">
          أدخل كلمة المرور للمتابعة
        </p>

        <div className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && attempt()}
              placeholder="كلمة المرور"
              className={`w-full px-4 py-3 rounded-xl border text-right bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 transition-all placeholder:text-slate-400 ${
                error
                  ? "border-red-300 focus:ring-red-100 focus:border-red-400"
                  : "border-slate-200 focus:ring-slate-200 focus:border-slate-400"
              }`}
            />
            {error && (
              <p className="text-red-500 text-xs mt-1.5 text-right">
                كلمة المرور غير صحيحة
              </p>
            )}
          </div>
          <button
            onClick={attempt}
            className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-medium transition-colors duration-150 active:scale-[0.99]"
          >
            دخول
          </button>
        </div>

        <p className="text-center text-slate-400 text-xs mt-8">
          © {new Date().getFullYear()} قسم تقنية المعلومات
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-6px); }
          40%       { transform: translateX(6px); }
          60%       { transform: translateX(-4px); }
          80%       { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

const Dashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://192.168.88.100:3666/complaints/`);
      if (!res.ok) throw new Error("فشل في تحميل البيانات");
      const data: Complaint[] = await res.json();
      setComplaints(data);
      setLastRefreshed(new Date());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "خطأ غير معروف");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  // ── Derived stats ───────────────────────────────────────────────────────────

  const total = complaints.length;
  const newComplaints = complaints.filter((c) => getStatus(c) === "new").length;
  const current = complaints.filter((c) => getStatus(c) === "current").length;
  const finished = complaints.filter((c) => getStatus(c) === "finished").length;
  const refused = complaints.filter((c) => getStatus(c) === "refused").length;

  // By floor
  const byFloor = Object.entries(
    complaints.reduce<Record<string, number>>((acc, c) => {
      const key = String(c.floor);
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);

  // By device
  const byDevice = Object.entries(
    complaints.reduce<Record<string, number>>((acc, c) => {
      acc[c.device_type] = (acc[c.device_type] ?? 0) + 1;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);

  const maxFloor = byFloor[0]?.[1] ?? 1;
  const maxDevice = byDevice[0]?.[1] ?? 1;

  // Recent 10
  const recent = [...complaints]
    .sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""))
    .slice(0, 10);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#f8f7f4]" dir="rtl">
      {/* Top nav */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <span className="font-semibold text-slate-800 text-sm">
              لوحة تحكم IT
            </span>
            <span className="hidden sm:inline text-slate-300">·</span>
            <span className="hidden sm:inline text-slate-400 text-xs">
              مستشفى البر
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-xs hidden sm:inline">
              آخر تحديث: {lastRefreshed.toLocaleTimeString("ar")}
            </span>
            <button
              onClick={fetchComplaints}
              disabled={loading}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-40"
              title="تحديث"
            >
              <svg
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h5M20 20v-5h-5M4 9a9 9 0 0115-4.243M20 15a9 9 0 01-15 4.243"
                />
              </svg>
            </button>
            <button
              onClick={onLogout}
              className="text-xs text-slate-500 hover:text-slate-700 border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg transition-colors"
            >
              خروج
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Error banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-3 text-sm flex items-center gap-2">
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {/* Section: Overview */}
        <section>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
            نظرة عامة
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="إجمالي الشكاوى"
              value={loading ? "—" : total}
              accent="bg-slate-100"
              icon={
                <svg
                  className="w-5 h-5 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              }
            />
            <StatCard
              label="جديدة"
              value={loading ? "—" : newComplaints}
              accent="bg-gray-50"
              icon={
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              }
            />
            <StatCard
              label="قيد العمل"
              value={loading ? "—" : current}
              accent="bg-blue-50"
              icon={
                <svg
                  className="w-5 h-5 text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              }
            />
            <StatCard
              label="منتهية"
              value={loading ? "—" : finished}
              accent="bg-green-50"
              sub={
                total > 0
                  ? `${Math.round((finished / total) * 100)}% من الإجمالي`
                  : undefined
              }
              icon={
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            />
          </div>
        </section>

        {/* Section: Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* By Floor */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-5">
              الشكاوى حسب الموقع
            </h3>
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-4 bg-slate-100 rounded-full animate-pulse"
                    style={{ width: `${70 - i * 10}%` }}
                  />
                ))}
              </div>
            ) : byFloor.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-6">
                لا توجد بيانات
              </p>
            ) : (
              <div className="space-y-3">
                {byFloor.map(([floor, count]) => (
                  <BarRow
                    key={floor}
                    label={FLOOR_LABELS[floor] ?? `طابق ${floor}`}
                    count={count}
                    max={maxFloor}
                    color="bg-slate-700"
                  />
                ))}
              </div>
            )}
          </div>

          {/* By Device */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-5">
              الشكاوى حسب الجهاز
            </h3>
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-4 bg-slate-100 rounded-full animate-pulse"
                    style={{ width: `${80 - i * 12}%` }}
                  />
                ))}
              </div>
            ) : byDevice.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-6">
                لا توجد بيانات
              </p>
            ) : (
              <div className="space-y-3">
                {byDevice.map(([device, count]) => (
                  <BarRow
                    key={device}
                    label={DEVICE_LABELS[device] ?? device}
                    count={count}
                    max={maxDevice}
                    color="bg-teal-600"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section: Recent Complaints Table */}
        <section>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
            آخر الشكاوى
          </h2>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-6 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 bg-slate-100 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : recent.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-slate-400 text-sm">لا توجد شكاوى بعد</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="text-right text-xs font-semibold text-slate-500 px-5 py-3">
                        مقدم الشكوى
                      </th>
                      <th className="text-right text-xs font-semibold text-slate-500 px-5 py-3">
                        الموقع
                      </th>
                      <th className="text-right text-xs font-semibold text-slate-500 px-5 py-3">
                        الجهاز
                      </th>
                      <th className="text-right text-xs font-semibold text-slate-500 px-5 py-3">
                        الحالة
                      </th>
                      <th className="text-right text-xs font-semibold text-slate-500 px-5 py-3">
                        التاريخ
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((c, i) => {
                      const st = getStatus(c);
                      const statusCfg = STATUS_CONFIG[st] ?? STATUS_CONFIG.new;
                      return (
                        <tr
                          key={c.id}
                          className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${i % 2 === 0 ? "" : "bg-[#fafafa]"}`}
                        >
                          <td className="px-5 py-3.5 text-slate-800 font-medium">
                            {c.reporter_name}
                          </td>
                          <td className="px-5 py-3.5 text-slate-600">
                            {FLOOR_LABELS[String(c.floor)] ?? `طابق ${c.floor}`}
                          </td>
                          <td className="px-5 py-3.5 text-slate-600">
                            {DEVICE_LABELS[c.device_type] ?? c.device_type}
                          </td>
                          <td className="px-5 py-3.5">
                            <span
                              className={`inline-flex items-center gap-1.5 border text-xs font-medium px-2.5 py-1 rounded-full ${statusCfg.color}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`}
                              />
                              {statusCfg.label}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-slate-400 text-xs">
                            {formatDate(c.created_at)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

// ─── Root Page ────────────────────────────────────────────────────────────────

const AnalyticsPage: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  return authenticated ? (
    <Dashboard
      onLogout={() => {
        setAuthenticated(false);
        navigate("/");
      }}
    />
  ) : (
    <LoginGate onSuccess={() => setAuthenticated(true)} />
  );
};

export default AnalyticsPage;
