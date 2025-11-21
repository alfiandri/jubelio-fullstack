// @ts-ignore - allow importing global CSS in Next.js app directory without a type declaration file
import "./globals.css";
import SidebarClientWrapper from "./SidebarClientWrapper";

export const metadata = {
  title: "Jubelio Dashboard",
  description: "Interactive dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-gray-100">
        <div className="flex min-h-screen">

          <SidebarClientWrapper />

          <div className="flex-1 flex flex-col">

            <header className="h-14 border-b border-white/10 bg-slate-900/60 backdrop-blur flex items-center px-6">
              <h1 className="text-lg font-semibold tracking-wide">Dashboard</h1>
            </header>

            <div className="p-6">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
