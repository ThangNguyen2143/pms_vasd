"use client";
import { useState } from "react";

const prizeConfig = [
  { label: "You was login success", weight: 5 },
  { label: "Tài khoản bị khóa", weight: 15 },
  { label: "Mất lượt", weight: 25 },
  { label: "Chờ 1 phút để quay tiếp", weight: 30 },
  { label: "Vé đảm bảo", weight: 5 },
  { label: "Bye", weight: 20 },
];
const prizes = prizeConfig.map((p) => p.label);
const colors = [
  "#facc15",
  "#4ade80",
  "#f87171",
  "#60a5fa",
  "#a78bfa",
  "#fb923c",
];

export default function Spinner() {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState("");
  const getWeightedPrizeIndex = () => {
    const total = prizeConfig.reduce((sum, item) => sum + item.weight, 0);
    const rand = Math.random() * total;
    let acc = 0;
    for (let i = 0; i < prizeConfig.length; i++) {
      acc += prizeConfig[i].weight;
      if (rand <= acc) return i;
    }
    return prizeConfig.length - 1; // fallback
  };

  const handleSpin = () => {
    if (spinning) return;

    const prizeIndex = getWeightedPrizeIndex();
    const degreesPerSlice = 360 / prizes.length;
    const newRotation =
      360 * 5 + (360 - prizeIndex * degreesPerSlice - degreesPerSlice / 2); // Trừ thêm 1/2 slice để canh giữa

    setSpinning(true);
    setRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);
      setResult(prizeConfig[prizeIndex].label);
    }, 4000);
  };

  const renderSlices = () => {
    const sliceAngle = 360 / prizes.length;
    return prizes.map((prize, i) => {
      const angle = i * sliceAngle;
      return (
        <div
          key={i}
          className="absolute w-full h-full flex items-center justify-center"
          style={{
            transform: `rotate(${angle}deg)`,
          }}
        >
          <div
            className="absolute text-[10px] font-bold text-center"
            style={{
              transform: `rotate(${
                sliceAngle / 2
              }deg) translateY(-85px) rotate(-${angle + sliceAngle / 2}deg)`,
              width: "60px",
            }}
          >
            {prize}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col items-center mt-10 space-y-4">
      <div className="flex gap-2 justify-center items-center">
        <div className="relative w-64 h-64">
          <div
            className="absolute top-1/2 left-1/2 w-60 h-60 rounded-full border-4 border-primary"
            style={{
              transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
              transition: "transform 4s cubic-bezier(0.33, 1, 0.68, 1)",
              background: `conic-gradient(
              ${colors
                .map(
                  (c, i) =>
                    `${c} ${(100 / prizes.length) * i}% ${
                      (100 / prizes.length) * (i + 1)
                    }%`
                )
                .join(",")}
            )`,
            }}
          >
            {renderSlices()}
          </div>

          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-3xl">
            🔻
          </div>
        </div>
        <div>
          <ul className="list rounded-box shadow-md">
            <li className="p-4 pb-2 text-xl opacity-60 tracking-wide">
              Tỉ lệ vòng quay
            </li>
            {prizeConfig.map((prize, i) => {
              return (
                <li key={i + "a"} className="list-row">
                  {prize.label}: {prize.weight}%
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <button
        className="btn btn-primary"
        onClick={handleSpin}
        disabled={spinning}
      >
        {spinning ? "Đang quay..." : "Quay"}
      </button>

      {result && <div className="text-xl font-bold">{result}</div>}
    </div>
  );
}
