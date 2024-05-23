import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/main.scss";
import Providers from "./providers";
import { ProviderMain } from "@/redux/Provider";
import MainComponents from "./MainComponents";

export const metadata: Metadata = {
  title: "Kepler Planner",
  description: "Kepler Planner",
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
          <link rel="shortcut icon" href="/logo.svg" type="image/x-icon" />
      </head>
      <body>  

        <ProviderMain>

            <MainComponents>
              {children}
            </MainComponents>

        </ProviderMain>

      </body>
    </html>
  );
}
