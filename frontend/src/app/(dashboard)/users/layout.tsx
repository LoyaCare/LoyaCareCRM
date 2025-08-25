export default function DealsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "stretch",
      }}
    >
      {children}
    </section>
  );
}
