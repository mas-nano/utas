import UserCard from "@/components/cards/UserCard";
import {
  fetchUser,
  fetchUsers,
  getActivities,
} from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userData = await fetchUser(user.id);
  if (!userData) redirect("/onboarding");

  const activity = await getActivities(userData._id);
  return (
    <>
      <h1 className="head-text mb-10">Activity</h1>
      <section className="mt-10 flex flex-col gap-5">
        {activity.length > 0 ? (
          <>
            {activity.map((act) => (
              <Link key={act._id} href={"/thread/" + act.parentId}>
                <article className="activity-card">
                  <Image
                    src={act.author.image}
                    alt="Photo profile"
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                  <p className="!text-small-regular text-light-1">
                    <span className="mr-1 text-primary-500">
                      @{act.author.username}
                    </span>{" "}
                    replied to your thread
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className="!text-base-regular text-light-3">No activity yet</p>
        )}
      </section>
    </>
  );
}
