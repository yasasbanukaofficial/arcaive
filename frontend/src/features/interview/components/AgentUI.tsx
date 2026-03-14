import { ControlBar, TrackToggle } from "@livekit/components-react";
import AgentVisualizer from "./AgentVisualizer";
import { useState } from "react";

export default function AgentUI() {
    const [micActive, setMicActive] = useState(false);

    return <div className="w-full h-full">
        <AgentVisualizer />
        <ControlBar />
    </div>
}