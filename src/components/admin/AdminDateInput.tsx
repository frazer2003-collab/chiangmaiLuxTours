"use client";

import { useAdminLocale } from "./AdminLocaleProvider";
import { DdMmYyDateInput } from "@/components/DdMmYyDateInput";

type Props = {
  id?: string;
  value: string;
  onChange: (iso: string) => void;
  disabled?: boolean;
  describedBy?: string;
};

export function AdminDateInput(props: Props) {
  const { tr } = useAdminLocale();
  return (
    <DdMmYyDateInput
      {...props}
      placeholder={tr("dateFormatPlaceholder")}
      hint={tr("dateFormatHint")}
      inputClassName="border-[var(--river-blue)]/20"
    />
  );
}
