export default function SectionDivider() {
  return (
    <div
      className="section-clip relative h-10 w-full overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-0 bg-linear-to-r from-(--accent)/15 via-(--accent-tertiary)/10 to-(--accent-secondary)/15" />
      <div className="absolute inset-x-0 top-1/2 h-px bg-linear-to-r from-transparent via-(--accent)/40 to-transparent" />
    </div>
  );
}
