import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { format_date } from "~/utils/fomat-date";
export type GanttTask = {
  id: string;
  name: string;
  start: string; // ISO date
  end: string;
  dependencies?: string;
};
export function GanttChart({
  tasks,
  start,
  end,
}: {
  tasks: GanttTask[];
  start: string;
  end: string;
}) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); // Xoá nội dung cũ

    const projectStart = new Date(start);
    const projectEnd = new Date(end);
    const taskStart = d3.min(tasks, (d) => new Date(d.start))!;
    const taskEnd = d3.max(tasks, (d) => new Date(d.end))!;
    const widthPerDay = 40;
    // Lấy ngày nhỏ nhất để bắt đầu
    const startDate = projectStart < taskStart ? projectStart : taskStart;

    // Lấy ngày lớn nhất để kết thúc
    const endDate = projectEnd > taskEnd ? projectEnd : taskEnd;

    // Số ngày hiển thị
    const totalDays = d3.timeDay.count(startDate, endDate);
    const width = totalDays * widthPerDay;
    const height = tasks.length * 40;

    const margin = { top: 20, right: 20, bottom: 30, left: 150 };
    const x = d3.scaleTime().domain([startDate, endDate]).range([0, width]);

    const y = d3
      .scaleBand()
      .domain(
        tasks.map((d) => {
          return d.name;
        })
      )
      .range([0, height])
      .padding(0.1);

    const chart = svg
      .attr(
        "viewBox",
        `0 0 ${width + margin.left + margin.right} ${
          height + margin.top + margin.bottom
        }`
      )
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("width", "100%")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Trục X
    chart
      .append("g")
      // .attr("transform", `translate(0,${height})`)
      .call(d3.axisTop(x).ticks(d3.timeDay, "%d/%m"));

    // Trục Y
    chart
      .append("g")
      // .attr("transform", `translate(${labelWidth}, 0)`)
      .call(d3.axisRight(y))
      .call((g) =>
        g
          .selectAll(".tick text")
          .text((d) => {
            const name = String(d);
            const max = 20;
            return name.length > max ? name.slice(0, max) + "…" : name;
          })
          .attr("text-anchor", "end")
          .attr("x", -5)
      );

    // Vẽ thanh Gantt
    chart
      .selectAll("rect")
      .data(tasks)
      .enter()
      .append("rect")
      .attr("x", (d) => x(new Date(d.start)))
      .attr("y", (d) => y(d.name)!)
      .attr("width", (d) => x(new Date(d.end)) - x(new Date(d.start)))
      .attr("height", y.bandwidth())
      .attr("fill", (d) => {
        return d.id.includes("tl") ? "#10b981" : "#4f46e5";
      })
      .on("mouseenter", function (event, d) {
        const [xPos, yPos] = d3.pointer(event);
        chart
          .append("text")
          .attr("x", xPos + 10)
          .attr("y", yPos)
          .attr("class", "gantt-tooltip")
          .text(
            `${d.name} (${d3.timeDay.count(
              new Date(d.start),
              new Date(d.end)
            )}d): ${format_date(d.start)} → ${format_date(d.end)}`
          );
        // setTooltip({
        //   visible: true,
        //   x: event.clientX,
        //   y: event.clientY,
        //   content: `${d.name}: ${d.start} → ${d.end}`,
        // });
      })
      .on("mouseleave", () => {
        // setTooltip((prev) => ({ ...prev, visible: false }));
        chart.selectAll(".gantt-tooltip").remove();
      });
    tasks.forEach((task) => {
      if (!task.dependencies) return;
      const depId = task.dependencies;
      const source = tasks.find((t) => t.id === depId);
      if (!source) return;

      const x1 = x(new Date(source.end));
      const y1 = y(source.name)! + y.bandwidth() / 2;

      const x2 = x(new Date(task.start));
      const y2 = y(task.name)! + y.bandwidth() / 2;
      // Vẽ liên kết
      const path = `m${x1},${y1} 10,0 0,${(y2 - y1) / 2} ${x2 - x1 - 20},0 0,${
        (y2 - y1) / 2
      } 10,0`;

      chart
        .append("path")
        .attr("d", path)
        .attr("fill", "none")
        .attr("stroke", "#999")
        .attr("stroke-width", 2)
        .attr("marker-end", "url(#arrow)");
    });
  }, [tasks, start, end]);

  return (
    <div className="relative w-full">
      <svg ref={ref}></svg>
    </div>
  );
}
