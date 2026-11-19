"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[JontroHaat Global Error]", error);
  }, [error]);

  return (
    <html lang="bn">
      <body
        style={{
          fontFamily: "sans-serif",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          margin: 0,
          backgroundColor: "#F4F5E9",
          color: "#174C32",
          textAlign: "center",
          padding: "1rem",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: 900, margin: 0 }}>
          JontroHaat — Critical Error
        </h1>
        <p style={{ marginTop: "0.5rem", fontSize: "1rem", color: "#555" }}>
          {error.message || "A critical error occurred. Please refresh the page."}
        </p>
        {error.digest && (
          <p style={{ fontSize: "0.75rem", color: "#888", fontFamily: "monospace" }}>
            Digest: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          style={{
            marginTop: "1.5rem",
            padding: "0.6rem 1.5rem",
            background: "#174C32",
            color: "#F4F5E9",
            border: "none",
            borderRadius: "0.5rem",
            fontWeight: 700,
            fontSize: "0.875rem",
            cursor: "pointer",
          }}
        >
          Reload Application
        </button>
      </body>
    </html>
  );
}
