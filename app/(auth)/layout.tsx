import PageIllustration from "@/components/Page-illustration";

export default function AuthLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <main className="relative flex grow flex-col">
        <PageIllustration multiple />
  
        {children}
      </main>
    );
  }