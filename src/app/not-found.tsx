import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Image src="/404.png" width={500} height={500} alt="404" />
        <Link href="/planner/myday" className="text-lg font-bold border px-[50px] py-[10px] rounded-full hover:bg-white hover:text-black">Go to Home</Link>
      </div> 
    );
  }