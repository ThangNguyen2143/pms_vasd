"use client";

import { useEffect, useRef } from "react";
import Gantt from "frappe-gantt";

interface GanttTask {
  id: string;
  name: string;
  start: string; // yyyy-mm-dd
  end: string; // yyyy-mm-dd
  progress: number;
  dependencies?: string;
}

interface GanttChartProps {
  tasks: GanttTask[];
}

export default function GanttChart({ tasks }: GanttChartProps) {
  const ganttRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ganttInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (ganttRef.current) {
      if (ganttInstanceRef.current) {
        ganttInstanceRef.current.refresh(tasks);
      } else {
        ganttInstanceRef.current = new Gantt(ganttRef.current, tasks, {
          view_mode: "Day", // 'Quarter Day', 'Half Day', 'Day', 'Week', 'Month'
          date_format: "YYYY-MM-DD",
          readonly: true,
          readonly_dates: true,
          readonly_progress: true,
        });
      }
    }
  }, [tasks]);

  return <div ref={ganttRef} />;
}
