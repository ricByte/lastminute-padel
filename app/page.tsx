"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";

export default function Home() {
  const tasks = useQuery(api.tasks.get);
  return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        {tasks?.map(function ({_id, text}: {_id: string, text: string}) {
          return <div key={_id}>{text}</div>;
        })}
      </main>
  );
}
