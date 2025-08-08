
export default function LeadsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="max-w-7xl mx-auto">
      {children}
    </section>
  );
}