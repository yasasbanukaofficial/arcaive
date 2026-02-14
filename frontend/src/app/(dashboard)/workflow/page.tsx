import { Background, Controls, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

export default function WorkflowPage() {
  return (
    <div className="w-full h-full" style={{ width: "100vw", height: "91vh" }}>
      <ReactFlow>
        <Background />
        <Controls style={{ color: "black" }} />
      </ReactFlow>
    </div>
  );
}
