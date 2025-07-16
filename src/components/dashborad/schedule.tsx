"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";
import { useApi } from "~/hooks/use-api";
import { encodeBase64 } from "~/lib/services";
import AddScheduleModal from "./modals/add-schedule-modal";
import UpdateScheduleModal from "./modals/update-schedule-modal";

function ScheduleDashboard() {
  const { data, getData } =
    useApi<
      { date: string; note: string; user_id: number; user_name: string }[]
    >();
  const [openAddSchedule, setOpenAddSchedule] = useState(false);
  const [openUpdateSchedule, setOpenUpdateSchedule] = useState<
    { user_name: string; day: number } | undefined
  >();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  useEffect(() => {
    getData(
      "/schedule/" +
        encodeBase64({
          type: "month_schedule",
          month: currentMonth + 1,
          year: currentYear,
        })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMonth, currentYear]);
  console.log(data);
  // Tạo mảng các ngày trong tuần
  const weekdays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  // Lấy số ngày trong tháng
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Lấy ngày đầu tiên của tháng là thứ mấy
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // Tạo mảng các ngày trong tháng
  const days = [];
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  // Tạo mảng các ngày trống trước ngày đầu tiên của tháng
  const emptyDays = Array(firstDayOfMonth).fill(null);

  // Chuyển tháng trước
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // Chuyển tháng sau
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Định dạng tên tháng
  const monthNames = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];
  // Kiểm tra xem ngày có sự kiện không
  //   const hasEvent = (day: number) => {
  //     const dateStr = `${currentYear}-${(currentMonth + 1)
  //       .toString()
  //       .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
  //       if(data)
  //        return data.some((event) => event.date === dateStr);
  //       else return false
  //   };
  const getEventsForDay = (day: number) => {
    const dateStr = `${currentYear}-${(currentMonth + 1)
      .toString()
      .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    if (data) return data.find((event) => event.date === dateStr);
  };
  return (
    <div>
      <div className="relative card bg-base-100 shadow-xl p-4">
        <button
          className="absolute top-20 left-3 btn btn-circle btn-outline btn-ghost btn-lg shadow-lg z-10 tooltip"
          data-tip="Phân công trực tháng"
          onClick={() => setOpenAddSchedule(true)}
          aria-label="Phân công trực tháng"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
        <div className="flex justify-between items-center mb-4">
          <button onClick={prevMonth} className="btn btn-circle btn-sm">
            &lt;
          </button>
          <h2 className="text-xl font-bold">
            Lịch trực {monthNames[currentMonth]} {currentYear}
          </h2>
          <button onClick={nextMonth} className="btn btn-circle btn-sm">
            &gt;
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {/* Hiển thị các ngày trong tuần */}
          {weekdays.map((day) => (
            <div key={day} className="text-center font-bold p-2">
              {day}
            </div>
          ))}

          {/* Hiển thị các ô trống trước ngày đầu tiên */}
          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`} className="h-8"></div>
          ))}

          {/* Hiển thị các ngày trong tháng */}
          {days.map((day) => {
            const isToday =
              day === new Date().getDate() &&
              currentMonth === new Date().getMonth() &&
              currentYear === new Date().getFullYear();
            const dayEvents = getEventsForDay(day);
            return (
              <div
                key={day}
                onClick={() =>
                  setOpenUpdateSchedule({
                    user_name: dayEvents?.user_name || "",
                    day,
                  })
                }
                className={
                  "p-2 rounded-full transition-colors h-24 flex flex-col w-full"
                }
              >
                <div className={clsx("border-b text-center p-2 mb-1")}>
                  <span
                    className={
                      isToday
                        ? "bg-primary text-primary-content rounded-full p-2 "
                        : ""
                    }
                  >
                    {day}
                  </span>
                </div>
                {dayEvents && (
                  // <div className="text-xs mt-1 truncate">
                  //   {dayEvents[0].note}
                  //   {dayEvents.length > 1 && ` +${dayEvents.length - 1}`}
                  // </div>
                  <div
                    className="gap-0.5 flex flex-col bg-primary text-primary-content text-xs rounded-lg p-1"
                    key={dayEvents.user_id + "user"}
                  >
                    <span>{dayEvents.user_name}</span>
                    {dayEvents.note.length > 0 && <span>{dayEvents.note}</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {openAddSchedule && (
        <AddScheduleModal
          month={currentMonth + 1}
          year={currentYear}
          onClose={() => setOpenAddSchedule(false)}
          onUpdate={async () => {
            await getData(
              "/schedule/" +
                encodeBase64({
                  type: "month_schedule",
                  month: currentMonth + 1,
                  year: currentYear,
                })
            );
          }}
        />
      )}
      {openUpdateSchedule && (
        <UpdateScheduleModal
          currentUser={openUpdateSchedule.user_name}
          day={openUpdateSchedule.day}
          month={currentMonth + 1}
          year={currentYear}
          onClose={() => setOpenUpdateSchedule(undefined)}
          onUpdate={async () => {
            await getData(
              "/schedule/" +
                encodeBase64({
                  type: "month_schedule",
                  month: currentMonth + 1,
                  year: currentYear,
                })
            );
          }}
        />
      )}
    </div>
  );
}
export default ScheduleDashboard;
