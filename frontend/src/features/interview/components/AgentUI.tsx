import { ControlBar, TrackToggle, useVoiceAssistant } from "@livekit/components-react";
import AgentVisualizer from "./AgentVisualizer";
import { useState } from "react";

export default function AgentUI() {
    const { state, audioTrack } = useVoiceAssistant();

    return <div className="w-full h-full">
        <AgentVisualizer />
        <ControlBar />
    </div>
}