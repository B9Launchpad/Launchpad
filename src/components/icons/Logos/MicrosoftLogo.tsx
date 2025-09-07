import * as React from "react"
import { SVGProps } from "react"
const MicrosoftLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 23 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_249_825)">
      <path d="M0 0.5H23V23.5H0V0.5Z" fill="#F3F3F3" />
      <path d="M1 1.5H11V11.5H1V1.5Z" fill="#F35325" />
      <path d="M12 1.5H22V11.5H12V1.5Z" fill="#81BC06" />
      <path d="M1 12.5H11V22.5H1V12.5Z" fill="#05A6F0" />
      <path d="M12 12.5H22V22.5H12V12.5Z" fill="#FFBA08" />
    </g>
    <defs>
      <clipPath id="clip0_249_825">
        <rect
          width={23}
          height={23}
          fill="white"
          transform="translate(0 0.5)"
        />
      </clipPath>
    </defs>
  </svg>
)
export default MicrosoftLogo
