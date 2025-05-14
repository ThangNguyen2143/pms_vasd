// components/task-detail/task-assign.tsx
function TaskAssign({ assignTo }: { assignTo: string }) {
  return (
    <div className="mt-4">
      <h4 className="font-semibold">Giao cho:</h4>
      <p>{assignTo}</p>
    </div>
  );
}

export default TaskAssign;
