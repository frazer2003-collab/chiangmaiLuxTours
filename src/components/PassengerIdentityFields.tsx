"use client";

import {
  genderLabel,
  validateDateOfBirth,
  validateFamilyName,
  validateGender,
  validateGivenName,
  validateIdNumber,
  validateNationality,
} from "@/lib/booking-validation";
import type { PassengerFormState } from "@/lib/booking-passengers";
import type { GuestGender } from "@/lib/db/types";
import { DdMmYyDateInput } from "@/components/DdMmYyDateInput";

const fieldClass =
  "w-full rounded-xl border border-[var(--river-blue)]/25 bg-white px-3 py-2.5 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--marker-yellow)]";

type Props = {
  index: number;
  value: PassengerFormState;
  showErrors: boolean;
  onChange: (next: PassengerFormState) => void;
};

export function PassengerIdentityFields({
  index,
  value,
  showErrors,
  onChange,
}: Props) {
  const prefix = `passenger-${index}`;
  const errors = showErrors
    ? {
        familyName: validateFamilyName(value.familyName),
        givenName: validateGivenName(value.givenName),
        gender: validateGender(value.gender),
        idNumber: validateIdNumber(value.idNumber),
        nationality: validateNationality(value.nationality),
        dateOfBirth: validateDateOfBirth(value.dateOfBirth),
      }
    : {
        familyName: null,
        givenName: null,
        gender: null,
        idNumber: null,
        nationality: null,
        dateOfBirth: null,
      };

  function patch(partial: Partial<PassengerFormState>) {
    onChange({ ...value, ...partial });
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${prefix}-family-name`} className="mb-1.5 block text-sm font-medium">
            Family name
          </label>
          <input
            id={`${prefix}-family-name`}
            type="text"
            autoComplete={index === 0 ? "family-name" : "off"}
            maxLength={80}
            value={value.familyName}
            onChange={(e) => patch({ familyName: e.target.value })}
            aria-invalid={errors.familyName ? true : undefined}
            className={fieldClass}
          />
          {errors.familyName ? (
            <p role="alert" className="mt-1.5 text-sm text-[var(--river-blue-deep)]">
              {errors.familyName}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor={`${prefix}-given-name`} className="mb-1.5 block text-sm font-medium">
            Given name
          </label>
          <input
            id={`${prefix}-given-name`}
            type="text"
            autoComplete={index === 0 ? "given-name" : "off"}
            maxLength={80}
            value={value.givenName}
            onChange={(e) => patch({ givenName: e.target.value })}
            aria-invalid={errors.givenName ? true : undefined}
            className={fieldClass}
          />
          {errors.givenName ? (
            <p role="alert" className="mt-1.5 text-sm text-[var(--river-blue-deep)]">
              {errors.givenName}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium" id={`${prefix}-gender-label`}>
          Gender
        </p>
        <div
          className="grid grid-cols-3 gap-2"
          role="radiogroup"
          aria-labelledby={`${prefix}-gender-label`}
          aria-invalid={errors.gender ? true : undefined}
        >
          {(["male", "female", "na"] as const).map((option) => (
            <label
              key={option}
              className={`flex min-h-11 cursor-pointer items-center justify-center rounded-xl border px-1.5 text-center text-xs font-medium leading-snug transition sm:px-2 sm:text-sm ${
                value.gender === option
                  ? "border-[var(--marker-yellow)] bg-[var(--marker-yellow)]/15 text-[var(--ink)]"
                  : "border-[var(--river-blue)]/20 bg-white text-[var(--ink-muted)]"
              }`}
            >
              {genderLabel(option)}
              <input
                type="radio"
                name={`${prefix}-gender`}
                value={option}
                checked={value.gender === option}
                onChange={() => patch({ gender: option as GuestGender })}
                className="sr-only"
              />
            </label>
          ))}
        </div>
        {errors.gender ? (
          <p role="alert" className="mt-1.5 text-sm text-[var(--river-blue-deep)]">
            {errors.gender}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor={`${prefix}-id-number`} className="mb-1.5 block text-sm font-medium">
          Passport ID / Thai ID
        </label>
        <input
          id={`${prefix}-id-number`}
          type="text"
          autoComplete="off"
          maxLength={40}
          value={value.idNumber}
          onChange={(e) => patch({ idNumber: e.target.value })}
          aria-invalid={errors.idNumber ? true : undefined}
          className={fieldClass}
        />
        {errors.idNumber ? (
          <p role="alert" className="mt-1.5 text-sm text-[var(--river-blue-deep)]">
            {errors.idNumber}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor={`${prefix}-nationality`} className="mb-1.5 block text-sm font-medium">
          Nationality
        </label>
        <input
          id={`${prefix}-nationality`}
          type="text"
          autoComplete={index === 0 ? "country-name" : "off"}
          maxLength={60}
          value={value.nationality}
          onChange={(e) => patch({ nationality: e.target.value })}
          aria-invalid={errors.nationality ? true : undefined}
          className={fieldClass}
        />
        {errors.nationality ? (
          <p role="alert" className="mt-1.5 text-sm text-[var(--river-blue-deep)]">
            {errors.nationality}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor={`${prefix}-dob`} className="mb-1.5 block text-sm font-medium">
          Date of birth
        </label>
        <DdMmYyDateInput
          id={`${prefix}-dob`}
          value={value.dateOfBirth}
          onChange={(iso) => patch({ dateOfBirth: iso })}
          placeholder="DD/MM/YY"
          hint="Day / month / year — e.g. 15/03/85"
        />
        {errors.dateOfBirth ? (
          <p role="alert" className="mt-1.5 text-sm text-[var(--river-blue-deep)]">
            {errors.dateOfBirth}
          </p>
        ) : null}
      </div>
    </div>
  );
}
