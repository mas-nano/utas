"use client";

import { sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

function Bottombar() {
  const pathName = usePathname();
  const router = useRouter();
  return (
    <section className="bottombar">
      <div className="bottombar_container">
        {sidebarLinks.map((item) => {
          const isActive =
            (pathName.includes(item.route) && item.route.length > 1) ||
            pathName === item.route;
          return (
            <Link
              href={item.route}
              key={item.label}
              className={`bottombar_link ${isActive && "bg-primary-500"}`}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={24}
                height={24}
              />
              <p className="text-light-1 text-subtle-medium max-sm:hidden">
                {item.label.split(/\s+./)[0]}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default Bottombar;
