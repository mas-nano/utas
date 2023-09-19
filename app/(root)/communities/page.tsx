import CommunityCard from "@/components/cards/CommunityCard";
import UserCard from "@/components/cards/UserCard";
import { fetchCommunities } from "@/lib/actions/community.actions";
import { fetchUser, fetchUsers } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userData = await fetchUser(user.id);
  if (!userData) redirect("/onboarding");

  const result = await fetchCommunities({});
  return (
    <>
      <h1 className="head-text mb-10">Search</h1>
      <div className="mt-14 flex flex-col gap-4">
        {result.communities.length === 0 ? (
          <p className="no-result">No Community</p>
        ) : (
          <>
            {result.communities.map((community) => {
              console.log(community);

              return (
                <CommunityCard
                  key={community.id}
                  id={community.id}
                  name={community.name}
                  username={community.username}
                  imgUrl={community.image}
                  bio={community.bio}
                  members={community.members}
                />
              );
            })}
          </>
        )}
      </div>
    </>
  );
}
