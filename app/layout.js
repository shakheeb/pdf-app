import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "./(components)/Nav";
import Provider from "./(components)/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "pdfToPDF",
  description: "Creates new pdf from selected pages in an existing pdf",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <div className="flex flex-col h-screen max-h-screen">
            <main className="app">
              <Nav />

              <div className="flex-grow overflow-y-auto bg-page text-default-text">
                {children}
              </div>
            </main>
          </div>
        </Provider>
      </body>
    </html>
  );
}
