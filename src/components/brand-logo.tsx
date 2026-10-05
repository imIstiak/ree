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
  const height = variant === "mark" ? 200 : variant === "wordmark" ? 54 : 270;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 200 ${height}`}
      width={200}
      height={height}
      className={`ree-logo ${className}`}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : "REE"}
      aria-hidden={decorative || undefined}
      focusable="false"
    >
      <use href={`/ree-logo.svg#ree-${variant}`} />
    </svg>
  );
}
