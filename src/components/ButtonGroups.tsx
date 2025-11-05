// Button groups for count and platoon splits, pitch types

import React from "react";
import "./ButtonGroup.css";
type CountOption = "All" | "Ahead" | "Behind" | "Even" | "0-0"| "2K" |"3-2";
type HandednessOption = "All" | "vL" | "vR";

interface ButtonGroupProps<T> {
  value?: T;
  onChange?: (v: T) => void;
  className?: string;
}

const baseBtn ="button-group-base";
const activeBtn = "button-group-active";
const inactiveBtn = "button-group-hover";

export function CountButton({ value, onChange, className = "" }: ButtonGroupProps<CountOption>) {
  const OPTIONS: CountOption[] = ["All", "Ahead", "Behind", "Even","0-0", "2K", "3-2"];
  const [internal, setInternal] = React.useState<CountOption>(value ?? "All");

  React.useEffect(() => {
    if (value !== undefined) setInternal(value);
  }, [value]);

  const handleClick = (v: CountOption) => {
    if (onChange) onChange(v);
    if (value === undefined) setInternal(v);
  };

  return (
    <div>
      {OPTIONS.map((opt) => {
        const active = internal === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => handleClick(opt)}
            className={`${baseBtn} ${active ? activeBtn : inactiveBtn}`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export function HandednessButton({ value, onChange, className = "" }: ButtonGroupProps<HandednessOption>) {
  const OPTIONS: HandednessOption[] = ["All", "vL", "vR"];
  const [internal, setInternal] = React.useState<HandednessOption>(value ?? "All");

  React.useEffect(() => {
    if (value !== undefined) setInternal(value);
  }, [value]);

  const handleClick = (v: HandednessOption) => {
    if (onChange) onChange(v);
    if (value === undefined) setInternal(v);
  };

  return (
    <div>
      {OPTIONS.map((opt) => {
        const active = internal === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => handleClick(opt)}
            className={`${baseBtn} ${active ? activeBtn : inactiveBtn}`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
