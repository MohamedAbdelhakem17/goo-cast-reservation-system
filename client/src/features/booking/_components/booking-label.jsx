export default function BookingLabel({ title, desc }) {
  return (
    // Header
    <div className="my-1 scale-80 text-center md:my-3">
      {/* Main title */}
      <h2 className="text-main mn-1 text-2xl font-semibold md:mb-2 md:text-4xl">
        {title}
      </h2>

      {/* Description */}
      <p className="text-lg leading-8 text-gray-800">{desc}</p>
    </div>
  );
}
