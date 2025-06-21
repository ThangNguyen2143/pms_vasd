"use client";
import { GanttChart } from "../ui/gantt-chart";

interface GanttTask {
  id: string;
  name: string;
  start: string;
  end: string;
  progress: number;
  dependencies?: string;
}

type Props = {
  tasks: GanttTask[];
};

export default function GanttWrapper({ tasks }: Props) {
  return (
    <div className="border rounded shadow">
      <div className="overflow-x-auto max-h-[500px]">
        <div className="min-w-[800px]">
          {tasks.length > 0 && <GanttChart tasks={tasks} />}
        </div>
      </div>
    </div>
  );
}
