import "./globals.css";
import { GameProvider } from "../context/context";

export default function RootLayout({ children }) {
  return (
    <GameProvider>
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
    </GameProvider>
  );
}
