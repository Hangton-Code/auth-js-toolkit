interface SectionWrapperProps {
  children: React.ReactNode;
  title: string;
}

export const SectionWrapper = ({ children, title }: SectionWrapperProps) => {
  return (
    <div className="mb-6">
      <div className="mb-2 w-full h-10 text-2xl font-semibold font-mono border-b">
        {title}
      </div>
      {children}
    </div>
  );
};
