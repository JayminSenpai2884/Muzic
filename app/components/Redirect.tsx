"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Correct import for Next.js 13+
import React, { useEffect } from 'react';

export function Redirect() {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.data?.user) {
      router.push("/dashboard");
    }
  }, [session, router]);
  return null;
}
