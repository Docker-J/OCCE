import { useState, useEffect } from "react";
import { getAdminGardenAttendanceDetail } from "../../../api/admin";

export const useGardenAttendanceDetail = (open, gardenName, date) => {
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open || !gardenName || !date) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    getAdminGardenAttendanceDetail(gardenName, date)
      .then((res) => {
        if (isMounted) {
          setDetail(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Failed to fetch garden attendance detail:", err);
          setError(
            err.response?.data?.message ||
              "정원 출석 상세 데이터를 불러오지 못했습니다.",
          );
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [open, gardenName, date]);

  const attendees = detail?.attendees || [];
  const absentees = detail?.absentees || [];
  const absenceReasons = detail?.absenceReasons || {};
  const allMembers = detail?.allMembers || [];
  const reported = detail?.reported ?? false;
  const total = detail?.total || 0;
  const rate = detail?.rate || 0;

  return {
    loading,
    detail,
    error,
    attendees,
    absentees,
    absenceReasons,
    allMembers,
    reported,
    total,
    rate,
  };
};

export default useGardenAttendanceDetail;
