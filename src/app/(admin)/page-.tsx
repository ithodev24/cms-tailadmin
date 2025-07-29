"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminHomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      router.push("/signin");
    }
  }, [router]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Dashboard Admin</h1>
      <p>Selamat datang di halaman admin.</p>
    </div>
  );
}
