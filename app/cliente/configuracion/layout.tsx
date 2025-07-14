import type { ReactNode } from "react";

export default function ConfigLayout({ children }: { children: ReactNode }) {
  return (

      <div className="max-w-6xl mx-auto md:flex md:min-h-[80vh] md:my-8 md:rounded-lg md:shadow-lg md:overflow-hidden">
        {children}
      </div>

  );
}