type SelectProps = {} & React.HTMLAttributes<HTMLSelectElement>;

const Select = ({ ...props }: SelectProps) => {
  return (
    <select
      {...props}
      className="relative shadow-[0px_1px_2px_rgba(0,_0,_0,_0.05)] rounded-xl bg-secondary box-border flex flex-row items-start justify-start py-1.5 px-4 text-left text-[10px] text-text font-fff-forward border-[2px] border-solid border-primary"
    >
      {props.children}
    </select>
  );
};

export default Select;
