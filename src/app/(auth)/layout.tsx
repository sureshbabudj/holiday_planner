import { TreeDeciduous } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center"
      data-auth-layout
    >
      <TreeDeciduous className="mb-8 w-32 text-primary" />
      <div className="min-w-sm rounded-2xl border p-4">{children}</div>
    </div>
  );
}
