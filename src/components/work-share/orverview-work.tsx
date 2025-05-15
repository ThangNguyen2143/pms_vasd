import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Pie } from "react-chartjs-2";
import { Priority, WorkShareDto, WorkStatus } from "~/lib/types";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

// export const data = {
//   labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
//   datasets: [
//     {
//       label: "# of Votes",
//       data: [12, 19, 3, 5, 2, 3],
//       borderWidth: 1,
//     },
//   ],
// };

function OverviewWork({
  priorityList,
  statusList,
  dataRaw,
}: {
  priorityList: Priority[];
  statusList: WorkStatus[];
  dataRaw: WorkShareDto[] | null;
}) {
  const labelsPie = statusList.map((st) => st.display);
  const dataFeild = priorityList.map((priority) => {
    let data: number[];
    if (dataRaw) {
      const groupPriotity = dataRaw.filter((d) => d.priority == priority.code);
      data = statusList.map((st) => {
        return groupPriotity.filter((g) => g.status == st.code).length;
      });
    } else data = [];
    return {
      code: priority.code,
      data,
    };
  });
  const data = (priority_code: string) => {
    const datafield = dataFeild.find((f) => f.code == priority_code);
    return {
      labels: labelsPie,
      datasets: [
        {
          label: "Số lượng: ",
          data: datafield ? datafield.data : [],
          backgroundColor: [
            "rgba(0, 255, 255, 0.2)",
            "rgba(0, 102, 204, 0.2)",
            "rgba(255, 51, 51, 0.2)",
            "rgba(255, 255, 0, 0.2)",
            "rgba(0, 220, 0, 0.2)",
            "rgba(160,160,160, 0.2)",
            "rgba(255, 99, 132, 0.2)",
          ],
        },
      ],
    };
  };
  return (
    <div className="container grid grid-cols-5 shadow">
      {priorityList.map((prio, i) => {
        const dt = data(prio.code);
        if (dt.datasets[0].data.length == 0)
          return (
            <div className="h-[250px] w-full" key={i + "nochart"}>
              <p>{prio.display}</p>
              <p className="text-wrap">
                Không có công việc nào ở mức độ ưu tiên này
              </p>
            </div>
          );
        else
          return (
            <div className="h-[250px] w-full" key={i + "char"}>
              <Pie
                data={dt}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { title: { text: prio.display, display: true } },
                }}
              />
            </div>
          );
      })}
    </div>
  );
}

export default OverviewWork;
