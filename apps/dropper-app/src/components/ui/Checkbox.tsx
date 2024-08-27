import { cn } from "@/lib/utils/classNames";
import { mono } from "@/lib/utils/fonts";

type CheckboxProps = {
  label?: string;
  checked: boolean;
  onClick?: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Checkbox({
  label,
  checked,
  onClick,
  ...props
}: CheckboxProps) {
  return (
    <button
      {...props}
      className={cn(
        mono.className,
        props.className,
        "flex flex-row gap-2.5 items-center hover:cursor-pointer"
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
