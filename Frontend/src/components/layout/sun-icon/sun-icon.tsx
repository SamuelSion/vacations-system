import "./sun-icon.css";

export function SunIcon() {
    return (
        <svg className="SunIcon" width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <circle cx="20" cy="20" r="9" className="sun-core" />
            <g className="sun-rays">
                <path d="M20 3v5M20 32v5M3 20h5M32 20h5M8 8l3.5 3.5M28.5 28.5L32 32M32 8l-3.5 3.5M11.5 28.5L8 32" />
            </g>
        </svg>
    );
}
