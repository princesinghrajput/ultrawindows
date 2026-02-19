import React from "react";
import { WINDOW_STYLES, LayoutNode } from "../../../utils/windowLayouts";
import clsx from "clsx";

interface WindowStyleSelectorProps {
    value: string;
    onChange: (styleId: string) => void;
}

const StylePreview: React.FC<{ layout: LayoutNode }> = ({ layout }) => {
    if (layout.type === "pane") {
        return (
            <div
                className={clsx(
                    "w-full h-full border border-slate-400 bg-white",
                    layout.defaultType === "transom" ? "bg-slate-50" : ""
                )}
            />
        );
    }

    return (
        <div
            className={clsx(
                "w-full h-full flex",
                layout.direction === "column" ? "flex-col" : "flex-row"
            )}
        >
            {layout.children.map((child, i) => (
                <div key={i} className="relative p-[1px]" style={{ flex: child.flex || 1 }}>
                    <StylePreview layout={child} />
                </div>
            ))}
        </div>
    );
};

const WindowStyleSelector: React.FC<WindowStyleSelectorProps> = ({
    value,
    onChange,
}) => {
    return (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
            {WINDOW_STYLES.map((style) => (
                <button
                    key={style.id}
                    onClick={() => onChange(style.id)}
                    className={clsx(
                        "flex flex-col items-center gap-2 p-2 rounded-lg border transition-all",
                        value === style.id
                            ? "border-orange-500 bg-orange-50 ring-1 ring-orange-500"
                            : "border-slate-200 hover:border-orange-300 bg-white"
                    )}
                >
                    <div className="w-12 h-12 relative">
                        <div className="absolute inset-0 border-2 border-slate-800 rounded-sm overflow-hidden bg-slate-100">
                            <div className="w-full h-full p-[2px]">
                                <StylePreview layout={style.layout} />
                            </div>
                        </div>
                    </div>
                    <span className="text-[10px] sm:text-xs font-medium text-slate-600 text-center leading-tight">
                        {style.name}
                    </span>
                </button>
            ))}
        </div>
    );
};

export default WindowStyleSelector;
