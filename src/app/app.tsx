// filepath: /Users/rabibhaque/Desktop/Freelance Website/e_com/src/pages/_app.tsx
import type { AppProps } from "next/app";
import RootLayout from "@/app/layout"; // Adjust the import path as necessary

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RootLayout>
      <Component {...pageProps} />
    </RootLayout>
  );
}

export default MyApp;