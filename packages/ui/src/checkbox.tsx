import { cn } from "@repo/ui/utils";
import { mono } from "@repo/ui/utils";

type CheckboxProps = {
  label?: string;
  checked: boolean;
  onClick?: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Checkbox({ label, checked, onClick, ...props }: CheckboxProps) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        mono.className,
        props.className,
        "flex flex-row gap-2 items-center hover:cursor-pointer"
      )}
      onClick={onClick}
    >
      {checked ? (
        <div className="flex w-7 h-7 items-center justify-center border-2 border-primary">
          <span>X</span>
        </div>
      ) : (
        <div className="flex w-7 h-7 border-2 border-primary" />
      )}
      {label && <label className="text-[12px]">{label}</label>}
    </button>
  );
}
