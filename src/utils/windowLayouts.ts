export type LayoutNode = LayoutContainer | LayoutPane;

export interface LayoutContainer {
    type: "container";
    direction: "row" | "column"; // row = side-by-side, column = stacked
    children: LayoutNode[];
    flex?: number;
}

export interface LayoutPane {
    type: "pane";
    defaultType: "fixed" | "opener" | "top-hung" | "transom";
    id?: string; // Optional ID if needed for specific targeting
    flex?: number; // Sizing share (default 1)
}

export interface WindowStyleDefinition {
    id: string;
    name: string;
    layout: LayoutNode;
}

export const WINDOW_STYLES: WindowStyleDefinition[] = [
    // ── ROW 1 ──
    {
        id: "style-1",
        name: "Style 1",
        layout: { type: "pane", defaultType: "fixed" },
    },
    {
        id: "style-21",
        name: "Style 21",
        layout: {
            type: "container",
            direction: "row",
            children: [
                { type: "pane", defaultType: "fixed", flex: 1 },
                { type: "pane", defaultType: "fixed", flex: 1 },
            ],
        },
    },
    {
        id: "style-22",
        name: "Style 22",
        layout: {
            type: "container",
            direction: "column",
            children: [
                { type: "pane", defaultType: "transom", flex: 0.3 },
                { type: "pane", defaultType: "fixed", flex: 1 },
            ],
        },
    },
    {
        id: "style-31",
        name: "Style 31",
        layout: {
            type: "container",
            direction: "row",
            children: [
                { type: "pane", defaultType: "fixed", flex: 1 },
                {
                    type: "container",
                    direction: "column",
                    flex: 1,
                    children: [
                        { type: "pane", defaultType: "transom", flex: 0.3 },
                        { type: "pane", defaultType: "fixed", flex: 1 }
                    ]
                }
            ]
        }
    },
    {
        id: "style-32",
        name: "Style 32",
        layout: {
            type: "container",
            direction: "column",
            children: [
                { type: "pane", defaultType: "transom", flex: 0.3 },
                {
                    type: "container",
                    direction: "row",
                    flex: 1,
                    children: [
                        { type: "pane", defaultType: "fixed", flex: 1 },
                        { type: "pane", defaultType: "fixed", flex: 1 }
                    ]
                }
            ]
        }
    },
    {
        id: "style-33", // Top Transom over 2 Cols
        name: "Style 33",
        layout: {
            type: "container",
            direction: "column",
            children: [
                { type: "pane", defaultType: "transom", flex: 0.3 },
                {
                    type: "container",
                    direction: "row",
                    flex: 1,
                    children: [
                        { type: "pane", defaultType: "fixed", flex: 1 },
                        { type: "pane", defaultType: "fixed", flex: 1 }
                    ]
                }
            ]
        }
    },
    {
        id: "style-41", // 2 Cols, both with Top Transoms
        name: "Style 41",
        layout: {
            type: "container",
            direction: "row",
            children: [
                {
                    type: "container",
                    direction: "column",
                    flex: 1,
                    children: [
                        { type: "pane", defaultType: "transom", flex: 0.3 },
                        { type: "pane", defaultType: "fixed", flex: 1 }
                    ]
                },
                {
                    type: "container",
                    direction: "column",
                    flex: 1,
                    children: [
                        { type: "pane", defaultType: "transom", flex: 0.3 },
                        { type: "pane", defaultType: "fixed", flex: 1 }
                    ]
                }
            ]
        }
    },
    {
        id: "style-51", // 3 Cols, Top Transoms on outer
        name: "Style 51",
        layout: {
            type: "container",
            direction: "row",
            children: [
                {
                    type: "container",
                    direction: "column",
                    flex: 1,
                    children: [
                        { type: "pane", defaultType: "transom", flex: 0.3 },
                        { type: "pane", defaultType: "fixed", flex: 1 }
                    ]
                },
                { type: "pane", defaultType: "fixed", flex: 1 },
                {
                    type: "container",
                    direction: "column",
                    flex: 1,
                    children: [
                        { type: "pane", defaultType: "transom", flex: 0.3 },
                        { type: "pane", defaultType: "fixed", flex: 1 }
                    ]
                }
            ]
        }
    }
    // Add more styles as needed based on exact requirements
    // For now this covers the main structural types (single, split, transom, mixed)
];

export const getLayoutForStyle = (styleId: string): LayoutNode => {
    const style = WINDOW_STYLES.find(s => s.id === styleId);
    return style ? style.layout : { type: "pane", defaultType: "fixed" };
};
