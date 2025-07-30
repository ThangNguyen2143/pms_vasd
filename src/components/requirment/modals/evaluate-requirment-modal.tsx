/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApi } from "~/hooks/use-api";
import { RequirementCritreia } from "~/lib/types";

interface DataUpLoad {
  requirement_id: number;
  criterials: { code: string; selected_code: string }[];
}

export default function EvaluateRequirementModal({
  onClose,
  onUpdate,
  requirement_id,
}: {
  onUpdate: () => Promise<void>;
  requirement_id: number;
  onClose: () => void;
}) {
  const {
    data: criteriaList,
    getData: getCriteria,
    errorData: errorCriteria,
    isLoading,
  } = useApi<RequirementCritreia[]>();
  const {
    postData,
    errorData,
    isLoading: postLoad,
  } = useApi<string, DataUpLoad>();
  const [missingCriteria, setMissingCriteria] = useState<string[]>([]);

  const [selectedValues, setSelectedValues] = useState<Record<string, string>>(
    {}
  );
  useEffect(() => {
    getCriteria("/system/config/eyJ0eXBlIjoicmVxdWlyZW1lbnRfY3JpdGVyaWEifQ==");
  }, []);
  useEffect(() => {
    if (errorData) toast.error(errorData.message);
  }, [errorData]);
  const handleRadioChange = (code: string, value: string) => {
    setSelectedValues((prev) => ({
      ...prev,
      [code]: value,
    }));
  };
  const handleRemoveRating = (code: string) => {
    setSelectedValues((prev) => {
      const newState = { ...prev };
      delete newState[code];
      return newState;
    });
  };
  const sendIt = async () => {
    const dataaa = {
      requirement_id,
      criterials: Object.entries(selectedValues).map(
        ([code, selected_code]) => ({
          code,
          selected_code,
        })
      ),
    };
    const re = await postData("/requirements/assessment", dataaa);
    if (re == null) return;

    toast.success(re);
    await onUpdate();
    onClose();
  };
  const handleSubmit = async () => {
    const missing = criteriaList?.filter((c) => !selectedValues[c.code]);
    if (missing && missing.length > 0) {
      setMissingCriteria(missing.map((m) => m.code));
      toast.warning("Gửi đánh giá chứ?", {
        action: {
          label: "Gửi",
          onClick: () => sendIt(),
        },
      });
      return;
    }
    await sendIt();
  };
  if (!criteriaList) {
    if (errorCriteria)
      return (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-error">Lỗi tải tiêu chí</h3>
            <p className="py-4">{errorCriteria.message}</p>
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={onClose}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      );
  }
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Đánh giá yêu cầu</h3>
        {isLoading ? (
          <span className="loading loading-infinity loading-lg"></span>
        ) : (
          <div className="flex flex-col items-center gap-2">
            {criteriaList?.map((crit, i) => {
              const isMissing = missingCriteria.includes(crit.code);

              return (
                <fieldset
                  key={crit.code}
                  className={`fieldset w-full ${
                    isMissing ? "border border-error bg-red-50" : ""
                  }`}
                >
                  <legend
                    className={`fieldset-label ${
                      isMissing ? "text-error" : ""
                    }`}
                  >
                    Tiêu chí {i + 1}
                  </legend>
                  <div className="join">
                    <div className="join-item collapse bg-base-100 border border-base-300">
                      <input type="checkbox" name="criteria" />
                      <div className="collapse-title font-semibold">
                        <span> {crit.title} </span>{" "}
                      </div>
                      <div className="collapse-content text-sm">
                        {crit.description}
                      </div>
                    </div>
                    <div className="join-item flex flex-col">
                      <div className="rating rating-sm items-center">
                        {crit.scale?.map((rate) => {
                          return (
                            <input
                              type="checkbox"
                              name={"scale" + i}
                              className="mask mask-star"
                              value={rate.code}
                              aria-label={rate.display}
                              key={rate.code + "rating" + i}
                              onChange={(e) => {
                                if (!e.target.checked) {
                                  handleRemoveRating(crit.code);
                                  return;
                                }
                                handleRadioChange(crit.code, rate.code);
                                setMissingCriteria((prev) =>
                                  prev.filter((id) => id !== crit.code)
                                );
                              }}
                              checked={selectedValues[crit.code] === rate.code}
                            />
                          );
                        })}
                      </div>
                      {/* <div className="flex justify-end">
                        <button
                          className="btn btn-ghost tooltip tooltip-left"
                          data-tip="Bỏ đánh giá"
                          onClick={() => handleRemoveRating(crit.code)}
                        >
                          <X></X>
                        </button>
                      </div> */}
                    </div>
                  </div>
                </fieldset>
              );
            })}
          </div>
        )}

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Đóng
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={postLoad}
          >
            {postLoad ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Gửi"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
