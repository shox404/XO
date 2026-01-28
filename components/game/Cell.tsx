import { Button } from "@/components/ui/button";

interface CellProps {
    value: string;
    disabled?: boolean;
    onClick: () => void;
}

export function Cell({ value, disabled, onClick }: CellProps) {
    return (
        <Button
            variant="outline"
            disabled={disabled}
            onClick={onClick}
            className="rounded-none size-24 text-4xl"
        >
            {(value === "X" || value === "O") && (
                value === "X" ? (
                    <svg
                        width="150"
                        height="150"
                        viewBox="0 0 100 100"
                        style={{ transform: "scale(3)", transformOrigin: "center" }}
                    >
                        <line
                            x1="10" y1="10" x2="90" y2="90"
                            stroke="#FA5C5C" strokeWidth="8" strokeLinecap="round"
                            strokeDasharray="113" strokeDashoffset="113"
                            style={{ animation: "draw 0.5s forwards" }}
                        />
                        <line
                            x1="90" y1="10" x2="10" y2="90"
                            stroke="#FA5C5C" strokeWidth="8" strokeLinecap="round"
                            strokeDasharray="113" strokeDashoffset="113"
                            style={{ animation: "draw 0.5s 0.25s forwards" }}
                        />
                    </svg>
                ) : (
                    <svg
                        width="150"
                        height="150"
                        viewBox="0 0 100 100"
                        style={{ transform: "scale(3)", transformOrigin: "center" }}
                    >
                        <circle
                            cx="50" cy="50" r="40"
                            stroke="#00B7B5" strokeWidth="8" fill="none"
                            strokeDasharray="251" strokeDashoffset="251"
                            style={{ animation: "draw 0.5s forwards" }}
                        />
                    </svg>
                )
            )}
        </Button>
    );
}
