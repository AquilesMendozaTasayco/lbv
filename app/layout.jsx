import { Sora } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";

const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = {
  title: "LBV Abogados",
  description: "Estudio de abogados especializado en derecho administrativo, civil, laboral y penal.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={sora.variable}>
      <body className="min-h-screen flex flex-col font-sans text-text bg-white antialiased">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
