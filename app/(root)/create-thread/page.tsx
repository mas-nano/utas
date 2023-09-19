import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function Page() {
  const user = await currentUser();

  if (!user) return null;

  const userData = await fetchUser(user.id);

  if (!userData?.onboarded) return redirect("/onboarding");

  return (
    <>
      <h1 className="text-heading2-bold text-light-1">Create Thread</h1>
      <PostThread userId={userData._id} />
    </>
  );
}

export default Page;
