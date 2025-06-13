"use client";
import { useEffect } from "react";
import { useApi } from "~/hooks/use-api";
import { BugSeverity, Priority } from "~/lib/types";

function ClientMatrixBug() {
  const { data: severity, getData: getSeverity } = useApi<BugSeverity[]>();
  const { data: priority, getData: getPriority } = useApi<Priority[]>();
  useEffect(() => {
    getPriority("/system/config/eyJ0eXBlIjoicHJpb3JpdHkifQ==", "force-cache");
    getSeverity(
      "/system/config/eyJ0eXBlIjoiYnVnX3NldmVyaXR5In0=",
      "force-cache"
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="container">
      <h2 className="text-xl">Ma trận bug</h2>
      <div className="flex flex-col">
        <div className="flex gap-2">
          <div className="py-2 px-4 w-24"></div>
          {severity
            ? severity.map((se) => {
                return (
                  <div key={se.code} className="py-2 px-4 border rounded-lg">
                    {se.display}
                  </div>
                );
              })
            : ""}
        </div>
        {priority
          ? priority.map((prio) => (
              <div className="" key={prio.code}>
                {prio.display}
              </div>
            ))
          : ""}
      </div>
    </div>
  );
}

export default ClientMatrixBug;
