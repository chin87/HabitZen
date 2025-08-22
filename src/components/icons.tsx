import type { SVGProps } from 'react';

export function LeafIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c-2.8 2.34-2.23 7.51-5 9.5C12.33 13.62 14 17.5 11 20z" />
      <path d="M9 6.1C9 12.5 4 14 4 14.5S9 18.5 9 6.1z" />
    </svg>
  );
}
