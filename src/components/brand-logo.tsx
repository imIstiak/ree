type BrandLogoProps = {
  className?: string;
  variant?: "logo" | "mark" | "wordmark";
  decorative?: boolean;
};

// Every placement references the same vector artwork; lettering inherits the theme.
export function BrandLogo({
  className = "",
  variant = "logo",
  decorative = false,
}: BrandLogoProps) {
  // The wordmark's acute (Reé) rises 14 units above its cap line, so that view starts at y = -14.
  const top = variant === "wordmark" ? -14 : 0;
  const height = variant === "mark" ? 200 : variant === "wordmark" ? 68 : 270;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 ${top} 200 ${height}`}
      width={200}
      height={height}
      className={`ree-logo ${className}`}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : "Reé"}
      aria-hidden={decorative || undefined}
      focusable="false"
    >
      <use href={`/ree-logo.svg#ree-${variant}`} />
    </svg>
  );
}
