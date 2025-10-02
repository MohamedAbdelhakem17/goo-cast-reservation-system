import MatrixCard from "./matrix-card";

export default function StatCard({ title, icon: Icon, value, description }) {
  return (
    <MatrixCard>
      <div className="flex h-full flex-col justify-between gap-y-4 p-5">
        {/* Title + Icon */}
        <div className="flex flex-row items-center justify-between pb-2">
          <h2 className="text-sm font-medium">{title}</h2>
          {Icon && <Icon className="text-muted-foreground size-4" />}
        </div>

        {/* Value + Description */}
        <div>
          <p className="pb-1 text-2xl font-bold">{value}</p>
          {description && <p className="text-muted-foreground text-xs">{description}</p>}
        </div>
      </div>
    </MatrixCard>
  );
}
