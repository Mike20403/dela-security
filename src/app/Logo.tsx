type LogoProps = {
  size?: number
}

/** Static geometric shield/hex brand mark. No external icon dependency. */
export function Logo({ size = 28 }: LogoProps) {
  return (
    <svg
      role="img"
      aria-label="DELA Security logo"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className="fill-action-primary"
        d="M16 2 28 7v9c0 8-5.4 12.7-12 14C9.4 28.7 4 24 4 16V7z"
      />
    </svg>
  )
}
