export default function BookingLabel({ title, desc }) {
  return (
    // Header
    <div className="my-2 scale-80 text-center md:my-3">
      {/* Main title */}
      <h2 className="text-main mb-2 text-2xl font-extrabold md:text-4xl">{title}</h2>

      {/* Description */}
      <p className="text-2xl leading-10">{desc}</p>
    </div>
  );
}
