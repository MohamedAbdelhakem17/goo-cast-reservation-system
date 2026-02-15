export default function OfferSectionTitle({ title, info }) {
  return (
    <div className="border-main my-1 border-l-4 pl-4">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{title}</h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{info}</p>
    </div>
  );
}
