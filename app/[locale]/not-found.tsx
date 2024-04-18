import { ServerCrash } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <main className="flex items-center justify-center flex-col">
      <div className="flex flex-col justify-center items-center gap-1">
        {/* <ServerCrash className="h-20 md:h-40 w-20 md:w-40 text-zinc-500" /> */}
        <div className="w-96 h-56 relative rounded-lg overflow-hidden max-w-full">
          <Image
            src={"/not-found.gif"}
            className="object-cover"
            alt="not found image"
            priority
            fill
          />
        </div>
        <h2>Not Found</h2>
        <p className="text-sm md:text-lg text-zinc-500 dark:text-zinc-400">
          Could not find requested resource
        </p>

        <div className="flex-1">
          <Link href="/" className="hover:underline text-primary">
            Return Home
          </Link>
        </div>
      </div>
    </main>
  );
}
