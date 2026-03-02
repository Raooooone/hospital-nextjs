import "./globals.css";
import SessionWrapper from "./components/SessionWrapper"; // Importe ton wrapper
import Navbar from "./components/Navbar"; // Si tu as déjà créé la Navbar

export const metadata = {
  title: "MediCare",
  description: "Plateforme de gestion hospitalière",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <SessionWrapper>
          <Navbar />
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
        </SessionWrapper>
      </body>
    </html>
  );
}