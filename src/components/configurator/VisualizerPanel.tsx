import React from "react";
import { Eye, RotateCcw } from "lucide-react";
import {
    ProductType,
    ProductConfig,
    BifoldConfig,
    SliderConfig,
    WindowConfig,
    ShapedConfig,
    FixedConfig,
    BayConfig,
    RoofConfig,
} from "../../types/product";
import BifoldVisualizer from "./visualizers/RealisticBifoldVisualizer";
import RealisticFrenchDoorVisualizer from "./visualizers/RealisticFrenchDoorVisualizer";
import RealisticSingleDoorVisualizer from "./visualizers/RealisticSingleDoorVisualizer";
import RealisticSliderVisualizer from "./visualizers/RealisticSliderVisualizer";
import RealisticAluminiumWindowVisualizer from "./visualizers/RealisticAluminiumWindowVisualizer";
import RealisticShapedFrameVisualizer from "./visualizers/RealisticShapedFrameVisualizer";
import RealisticFixedFrameVisualizer from "./visualizers/RealisticFixedFrameVisualizer";
import BayWindowDiagram from "./visualizers/BayWindowDiagram";
import RooflightVisualizer from "./visualizers/RooflightVisualizer";

interface VisualizerPanelProps {
    config: ProductConfig;
    view: "inside" | "outside";
    onToggleView?: () => void;
    hideControls?: boolean;
    className?: string;
    containerHeight?: string;
}

export default function VisualizerPanel({
    config,
    view,
    onToggleView,
    hideControls,
    className,
    containerHeight,
}: VisualizerPanelProps) {
    const renderVisualizer = () => {
        switch (config.type) {
            case ProductType.Bifold:
                return (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50 p-3">
                        <BifoldVisualizer
                            width={config.width}
                            height={config.height}
                            panels={(config as BifoldConfig).panels}
                            openingDirection={(config as BifoldConfig).openingDirection}
                            configuration={(config as BifoldConfig).configuration}
                            color={
                                view === "outside"
                                    ? (config as BifoldConfig).outsideColor || config.color
                                    : (config as BifoldConfig).insideColor || config.color
                            }
                            handleColor={config.handleColor}
                            cill={(config as BifoldConfig).cill}
                            trickleVents={(config as BifoldConfig).trickleVents as any}
                            view={view}
                            integralBlinds={(config as BifoldConfig).integralBlinds}
                            glassType={(config as BifoldConfig).glassType}
                            addonLeft={(config as BifoldConfig).addons?.left}
                            addonRight={(config as BifoldConfig).addons?.right}
                            addonTop={(config as BifoldConfig).addons?.top}
                            transomBars={(config as BifoldConfig).transomBars}
                            astragalBars={(config as BifoldConfig).astragalBars}
                        />
                    </div>
                );
            case ProductType.FrenchDoor:
                return (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50 p-3">
                        <RealisticFrenchDoorVisualizer
                            config={config as any}
                            width={config.width}
                            height={config.height}
                            view={view}
                        />
                    </div>
                );
            case ProductType.SingleDoor:
                return (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50 p-3">
                        <RealisticSingleDoorVisualizer
                            config={config as any}
                            width={config.width}
                            height={config.height}
                            view={view}
                        />
                    </div>
                );
            case ProductType.Slider:
                return (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50 p-3">
                        <RealisticSliderVisualizer
                            config={config as SliderConfig}
                            width={config.width}
                            height={config.height}
                            view={view}
                        />
                    </div>
                );
            case ProductType.Window:
                return (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50 p-3">
                        <RealisticAluminiumWindowVisualizer
                            config={config as WindowConfig}
                            width={config.width}
                            height={config.height}
                            view={view}
                        />
                    </div>
                );
            case ProductType.Shaped:
                return (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50 p-3">
                        <RealisticShapedFrameVisualizer
                            config={config as ShapedConfig}
                            width={config.width}
                            height={config.height}
                            view={view}
                        />
                    </div>
                );
            case ProductType.Fixed:
                return (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50 p-3">
                        <RealisticFixedFrameVisualizer
                            config={config as FixedConfig}
                            width={config.width}
                            height={config.height}
                            view={view}
                        />
                    </div>
                );
            case ProductType.Bay:
                return (
                    <div className="w-full h-full flex items-center justify-center bg-white p-3">
                        <BayWindowDiagram
                            numberOfPanes={(config as BayConfig).numberOfPanes || 3}
                        />
                    </div>
                );
            case ProductType.Rooflight:
                return (
                    <div className="w-full h-full flex items-center justify-center bg-white p-3">
                        <RooflightVisualizer
                            width={config.width}
                            height={config.height}
                            outsideColor={(config as RoofConfig).outsideColor || "white"}
                        />
                    </div>
                );
            default:
                return (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
                        Visualizer for {config.type} coming soon
                    </div>
                );
        }
    };

    return (
        <div className={className || "w-full xl:w-120 xl:shrink-0 xl:sticky xl:top-20 z-0"}>
            <div className={`bg-white rounded-xl overflow-hidden ${hideControls ? '' : 'shadow-sm border border-slate-200'}`}>
                {/* Visualizer Preview */}
                <div
                    className="relative"
                    style={{ height: containerHeight || "clamp(320px, 45vw, 480px)" }}
                >
                    {renderVisualizer()}
                </div>

                {/* View Toggle Bar */}
                {!hideControls && onToggleView && (
                    <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between bg-white">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Eye className="w-3.5 h-3.5" />
                            <span className="font-medium">
                                {view === "outside" ? "Outside" : "Inside"} View
                            </span>
                        </div>
                        <button
                            onClick={onToggleView}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                        >
                            <RotateCcw className="w-3 h-3" />
                            Flip View
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
