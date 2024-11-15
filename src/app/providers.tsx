// app/providers.tsx
"use client";

import { OnchainKitProvider } from "@coinbase/onchainkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { base, baseSepolia } from "wagmi/chains";
import { type ReactNode, useState, useEffect } from "react";
import { type State, WagmiProvider } from "wagmi";
import { getConfig } from "./config/wagmi";

const NETWORK =
  process.env.NEXT_PUBLIC_NETWORK === "mainnet" ? base : baseSepolia;

export function Providers(props: {
  children: ReactNode;
  initialState?: State;
}) {
  const [mounted, setMounted] = useState(false);
  const [config] = useState(() => getConfig());
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={config} initialState={props.initialState}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={NETWORK}
        >
          {mounted && props.children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
