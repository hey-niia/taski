export default function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      width="10"
      height="8"
      viewBox="0 0 10 8"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M1 4L3.8 6.8L9 1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
