export default function ResponsiveTable({ key, title, subtitle, fields = [], actions }) {
  return (
    <div
      className="my-4 rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
      key={key}
    >
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-gray-900">{title}</h4>
          {subtitle && (
            <span className="mt-1 inline-flex items-center rounded-md border border-gray-200 bg-gray-100 px-2 py-1 font-mono text-xs font-medium text-gray-800 uppercase">
              {subtitle}
            </span>
          )}
        </div>
        <div className="flex gap-2">{actions}</div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        {fields.map((field, i) => (
          <div key={i}>
            <span className="block text-gray-500">{field.label}</span>
            <span className="leading-snug break-words text-gray-900">{field.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
