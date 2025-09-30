export default function BookingLabel({ title, desc }) {
  return (
    // Header
    <div className="my-6 scale-80 text-center">
      {/* Main title */}
      <h2 className="mb-2 text-2xl font-bold">{title}</h2>

      {/* Description */}
      <p className="text-gray-900">{desc}</p>
    </div>
  );
}
