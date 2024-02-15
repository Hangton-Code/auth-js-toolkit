interface HeaderProps {
  label: string;
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-2 items-center justify-center">
      <h1 className="text-3xl font-bold font-mono text-center">{label}</h1>
      <p className="text-muted-foreground text-sm">©️ Company Name</p>
    </div>
  );
};
