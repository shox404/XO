export function StarToken() {
    return (
        <div className="relative w-10 flex items-center justify-center">
            {/* Glow */}
            <div className="absolute inset-0 rounded-full bg-orange-600 blur-xl animate-pulse" />

            {/* Star */}
            <svg
                viewBox="0 0 24 24"
                className="relative w-6 h-6 drop-shadow-[0_0_10px_#FFA500]"
                fill="orange"
            >
                <path d="M12 2.5l2.9 5.88 6.5.95-4.7 4.58 1.1 6.47L12 17.9l-5.8 3.05 1.1-6.47-4.7-4.58 6.5-.95L12 2.5z" />
            </svg>
        </div>
    );
}