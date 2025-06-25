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
  project_start: string;
  project_end: string;
};

export default function GanttWrapper({
  tasks,
  project_end,
  project_start,
}: Props) {
  return (
    <div className="rounded shadow">
      <div className="overflow-x-auto max-h-[500px]">
        <div className="min-w-[800px]">
          {tasks.length > 0 && (
            <GanttChart tasks={tasks} start={project_start} end={project_end} />
          )}
        </div>
      </div>
    </div>
  );
}
