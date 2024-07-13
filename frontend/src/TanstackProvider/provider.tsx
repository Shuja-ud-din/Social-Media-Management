"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function TanstackProviders({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient());

  return (
        <QueryClientProvider client={client}>
          {children}
          <ToastContainer />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
  );
}