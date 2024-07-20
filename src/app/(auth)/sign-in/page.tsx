"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function Component() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <p>Signed in as {session.user.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </>)
  }


}

