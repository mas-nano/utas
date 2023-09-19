import UserCard from "@/components/cards/UserCard";
import { fetchUser, fetchUsers } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userData = await fetchUser(user.id);
  if (!userData) redirect("/onboarding");

  const users = await fetchUsers({ userId: user.id });
  return (
    <>
      <h1 className="head-text mb-10">Search</h1>
      <div className="mt-14 flex flex-col gap-4">
        {users.users.length === 0 ? (
          <p className="no-result">No Users</p>
        ) : (
          <>
            {users.users.map((user) => (
              <UserCard
                key={user.id}
                id={user.id}
                firstName={user.firstName}
                username={user.username}
                lastName={user.lastName}
                imgUrl={user.image}
                personType="User"
              />
            ))}
          </>
        )}
      </div>
    </>
  );
}
