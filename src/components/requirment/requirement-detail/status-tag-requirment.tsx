"use client";
import { Star } from "lucide-react";
import React from "react";
import { format_date } from "~/utils/fomat-date";
interface DataRating {
  code: string;
  name: string;
  date: string;
  items: {
    criteria_code: string;
    criteria_title: string;
    selected_value: number;
    weight: number;
  }[];
}
export default function StatusTag({
  data,
  onEvaluate,
}: {
  data?: DataRating[];
  onEvaluate: () => void;
}) {
  const listRatingDisplay = [
    { value: 1, display: "Rất thấp" },
    { value: 2, display: "Thấp" },
    { value: 3, display: "Trung bình" },
    { value: 4, display: "Cao" },
    { value: 5, display: "Rất cao" },
  ];

  return (
    <div className="bg-base-200 p-4 rounded-lg flex flex-col gap-2 items-center">
      <div className="flex w-full justify-between">
        <h3 className="text-lg font-semibold text-primary mb-2">📌 Đánh giá</h3>
        <button
          className="btn btn-sm btn-outline btn-primary tooltip"
          data-tip="Đánh giá yêu cầu"
          onClick={onEvaluate}
        >
          <Star size={16} className="mr-1" />
          Đánh giá
        </button>
      </div>
      {data
        ? data.map((htr) => {
            return (
              <div
                tabIndex={0}
                key={htr.code}
                className="collapse bg-base-100 border-base-300 border"
              >
                <div className="collapse-title font-semibold flex justify-between">
                  <span>{htr.name}</span>
                  <span>
                    đánh giá lúc <br />
                    {format_date(htr.date)}
                  </span>
                </div>
                <div className="collapse-content text-sm">
                  <ul>
                    {htr.items.map((content) => {
                      return (
                        <li
                          key={content.criteria_code + "htr" + htr.code}
                          className="flex justify-between"
                        >
                          <span>{content.criteria_title}:</span>
                          <span>
                            {
                              listRatingDisplay.find(
                                (r) => r.value == content.selected_value
                              )?.display
                            }
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          })
        : "Khum có đánh giá nào"}
    </div>
  );
}
