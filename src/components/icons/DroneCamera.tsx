import { forwardRef, type SVGProps } from "react";

/** Custom drone-with-camera icon (lucide-style, uses currentColor). */
const DroneCamera = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* propeller arms */}
      <path d="M9 9 6.5 6.5M15 9l2.5-2.5M9 15l-2.5 2.5M15 15l2.5 2.5" />
      {/* rotors */}
      <circle cx="5" cy="5" r="2" />
      <circle cx="19" cy="5" r="2" />
      <circle cx="5" cy="19" r="2" />
      <circle cx="19" cy="19" r="2" />
      {/* body */}
      <rect x="9" y="9" width="6" height="5" rx="1" />
      {/* camera gimbal lens */}
      <path d="M11 14v1.5a1 1 0 0 0 1 1 1 1 0 0 0 1-1V14" />
      <circle cx="12" cy="17.5" r="0.5" fill="currentColor" />
    </svg>
  )
);
DroneCamera.displayName = "DroneCamera";

export default DroneCamera;
