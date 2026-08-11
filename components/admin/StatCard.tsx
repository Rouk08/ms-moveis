import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: number | string;
  icon: LucideIcon;
};

export default function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-charcoal-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-charcoal-500">{label}</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-wood-100 text-wood-600">
          <Icon size={18} />
        </span>
      </div>
      <p className="mt-3 text-3xl font-semibold text-charcoal-800">{value}</p>
    </div>
  );
}
