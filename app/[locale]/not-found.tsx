import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex items-center justify-center flex-col">
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/">
        <Button variant={'outline_destructive'}>Return Home</Button>
      </Link>
    </main>
  );
}
