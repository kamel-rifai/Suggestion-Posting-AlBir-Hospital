"use client";
import React, { useState } from "react";
import { Link } from "react-router-dom";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  requesterName: string;
  location: string;
  issueType: string;
  additionalNotes: string;
  device: string;
}

interface ComplaintData {
  name: string;
  reporter_name: string;
  floor: number;
  device_type: string;
  complaint_type: string;
  notes: string;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const locations = [
  { value: "0", label: "القبو" },
  { value: "1", label: "الطابق الأرضي" },
  { value: "2", label: "الطابق الثاني" },
  { value: "13", label: "قسم ال IT" },
  { value: "16", label: "معالجة فيزيائية" },
  { value: "17", label: "تشريح مرضي" },
  { value: "3", label: "قسم التدريب" },
  { value: "4", label: "الطابق الرابع" },
  { value: "5", label: "الطابق الخامس" },
  { value: "6", label: "الطابق السادس" },
  { value: "7", label: "الطابق السابع" },
  { value: "8", label: "الطابق الثامن" },
  { value: "9", label: "الطابق التاسع" },
  { value: "10", label: "الطابق العاشر" },
  { value: "11", label: "العيادات" },
  { value: "12", label: "الاسعاف" },
  { value: "18", label: "قسم الكلية" },
];

const devices = [
  {
    value: "phone",
    label: "الهاتف",
    options: [
      { value: "full", label: "توقف كامل" },
      { value: "no_connection", label: "لا يوجد إتصال" },
      { value: "no_answer", label: "لا يوجد إستقبال" },
      { value: "other", label: "أخرى" },
    ],
  },
  {
    value: "internet",
    label: "انترنت",
    options: [
      { value: "full", label: "توقف كامل" },
      { value: "coverage", label: "ضعف تغطية" },
      { value: "outage", label: "بُطأ انترنت" },
      { value: "other", label: "مشاكل أخرى" },
    ],
  },
  {
    value: "nursing",
    label: "التمريض",
    options: [
      { value: "full", label: "توقف كامل" },
      { value: "call_button", label: "مشكلة في زر الاستدعاء" },
      { value: "room_control", label: "مشكلة في تحكم الغرفة" },
      { value: "reception_control", label: "مشكلة في تحكم الاستقبال" },
    ],
  },
  {
    value: "laptop",
    label: "لابتوب",
    options: [
      { value: "full", label: "توقف كامل" },
      { value: "pause", label: "تعليق" },
      { value: "software", label: "مشكلة برنامج" },
      { value: "other", label: "مشاكل أخرى" },
    ],
  },
  {
    value: "printer",
    label: "طابعة",
    options: [
      { value: "full", label: "توقف كامل" },
      { value: "no_connection", label: "لا يوجد إتصال" },
      { value: "other", label: "أخرى" },
    ],
  },
  {
    value: "other",
    label: "غير ذلك",
    options: [
      { value: "full", label: "توقف كامل" },
      { value: "other", label: "أخرى" },
    ],
  },
];

const EMPTY_FORM: FormData = {
  requesterName: "",
  location: "",
  issueType: "",
  device: "",
  additionalNotes: "",
};

// ─── Input / Select shared styles ────────────────────────────────────────────

const fieldBase =
  "w-full px-4 py-3 rounded-xl border text-right bg-slate-50 focus:outline-none focus:ring-2 transition-all duration-150 text-slate-800 placeholder:text-slate-400";
const fieldNormal =
  "border-slate-200 focus:ring-teal-400 focus:border-teal-700";
const fieldError = "border-red-300 focus:ring-red-100 focus:border-red-400";

// ─── Component ────────────────────────────────────────────────────────────────

const ComplaintForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const selectedDevice = devices.find((d) => d.value === formData.device);

  const generateName = (): string => {
    const deviceLabel = selectedDevice?.label ?? "";
    const issueLabel =
      selectedDevice?.options.find((o) => o.value === formData.issueType)
        ?.label ?? "";
    const locationLabel =
      locations.find((l) => l.value === formData.location)?.label ?? "";
    return `${deviceLabel} - ${issueLabel} (${locationLabel})`;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.requesterName.trim())
      newErrors.requesterName = "هذا الحقل مطلوب";
    if (!formData.location) newErrors.location = "هذا الحقل مطلوب";
    if (!formData.device) newErrors.device = "هذا الحقل مطلوب";
    if (formData.device && !formData.issueType)
      newErrors.issueType = "هذا الحقل مطلوب";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "device") updated.issueType = "";
      return updated;
    });
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const payload: ComplaintData = {
        name: generateName(),
        reporter_name: formData.requesterName,
        floor: parseInt(formData.location) || 0,
        device_type: formData.device,
        complaint_type: formData.issueType,
        notes: formData.additionalNotes,
      };
      const response = await fetch(`http://192.168.88.100:3666/complaints/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to submit");
      setIsSubmitted(true);
      setFormData(EMPTY_FORM);
    } catch {
      setErrors((prev) => ({
        ...prev,
        additionalNotes: "فشل في إرسال النموذج. حاول مرة أخرى.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (isSubmitted) {
    return (
      <div
        className="min-h-screen bg-[#f8f7f4] flex flex-col items-center justify-center px-4"
        dir="rtl"
      >
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0d9488"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 2v4" />
              <path d="M16 2v4" />
              <path d="M21 14V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8" />
              <path d="M3 10h18" />
              <path d="m16 20 2 2 4-4" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            تم إرسال الشكوى بنجاح
          </h2>
          <p className="text-slate-500 text-sm mb-7 leading-relaxed">
            شكراً لك. سيتم مراجعة شكواك والرد عليك في أقرب وقت ممكن.
          </p>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setErrors({});
            }}
            className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium py-2.5 px-7 rounded-xl transition-colors duration-150"
          >
            تقديم شكوى جديدة
          </button>
        </div>
        <p className="text-slate-400 text-xs mt-8">
          © {new Date().getFullYear()} قسم تقنية المعلومات
        </p>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f8f7f4] py-10 px-4" dir="rtl">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-600 mb-4 shadow-md">
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight mb-1">
            نظام الشكاوى والاقتراحات
          </h1>
          <p className="text-slate-500 text-sm">
            قسم تقنية المعلومات — مستشفى البر
          </p>
        </div>
        <div className="fixed top-4 left-4 z-50">
          <Link
            to="/analytics"
            className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-lg text-xs font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            لوحة التحكم
          </Link>
        </div>
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-5">
          {/* Requester Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              اسم مقدم الشكوى <span className="text-teal-600">*</span>
            </label>
            <input
              type="text"
              name="requesterName"
              value={formData.requesterName}
              onChange={handleInputChange}
              className={`${fieldBase} ${errors.requesterName ? fieldError : fieldNormal}`}
              placeholder="أدخل اسمك الكامل"
            />
            {errors.requesterName && (
              <p className="text-red-500 text-xs mt-1.5">
                {errors.requesterName}
              </p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              الموقع <span className="text-teal-600">*</span>
            </label>
            <select
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className={`${fieldBase} ${errors.location ? fieldError : fieldNormal}`}
            >
              <option value="">اختر الموقع</option>
              {locations.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
            {errors.location && (
              <p className="text-red-500 text-xs mt-1.5">{errors.location}</p>
            )}
          </div>

          {/* Device */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              الجهاز <span className="text-teal-600">*</span>
            </label>
            <select
              name="device"
              value={formData.device}
              onChange={handleInputChange}
              className={`${fieldBase} ${errors.device ? fieldError : fieldNormal}`}
            >
              <option value="">اختر الجهاز</option>
              {devices.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
            {errors.device && (
              <p className="text-red-500 text-xs mt-1.5">{errors.device}</p>
            )}
          </div>

          {/* Issue Type */}
          {formData.device && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                نوع المشكلة <span className="text-teal-600">*</span>
              </label>
              <select
                name="issueType"
                value={formData.issueType}
                onChange={handleInputChange}
                className={`${fieldBase} ${errors.issueType ? fieldError : fieldNormal}`}
              >
                <option value="">اختر المشكلة</option>
                {selectedDevice?.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              {errors.issueType && (
                <p className="text-red-500 text-xs mt-1.5">
                  {errors.issueType}
                </p>
              )}
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              ملاحظات إضافية
            </label>
            <textarea
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleInputChange}
              rows={4}
              className={`${fieldBase} resize-none ${errors.additionalNotes ? fieldError : fieldNormal}`}
              placeholder="أي معلومات إضافية تساعد الفريق على الفهم..."
            />
            {errors.additionalNotes && (
              <p className="text-red-500 text-xs mt-1.5">
                {errors.additionalNotes}
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100 pt-1" />

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            onClick={() => {
              const fakeEvent = {
                preventDefault: () => {},
              } as React.FormEvent<HTMLFormElement>;
              handleSubmit(fakeEvent);
            }}
            className={`w-full py-3 rounded-xl font-medium text-sm text-white tracking-wide transition-all duration-150 ${
              isSubmitting
                ? "bg-teal-500 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700 active:scale-[0.99] shadow-sm"
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                جاري الإرسال...
              </span>
            ) : (
              "إرسال الشكوى"
            )}
          </button>
        </div>

        <p className="text-center text-slate-400 text-xs mt-6">
          © {new Date().getFullYear()} قسم تقنية المعلومات
        </p>
      </div>
    </div>
  );
};

export default ComplaintForm;
