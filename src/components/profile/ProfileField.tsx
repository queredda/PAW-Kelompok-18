'use client';

interface ProfileFieldProps {
  label: string;
  value: string;
}

export function ProfileField({ label, value }: ProfileFieldProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-white/5 p-3 sm:p-4 rounded-lg">
      <strong className="min-w-[140px] sm:min-w-[180px] text-Text-A text-sm sm:text-base md:text-lg">
        {label}:
      </strong>
      <p className="text-Text-A text-sm sm:text-base md:text-lg break-all">
        {value}
      </p>
    </div>
  );
} 