import { getOrCreateConversation } from "@/lib/convesation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface MemberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  }
}

const MemberIdPage = async ({
  params
}: MemberIdPageProps) => {

  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();

  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    }
  })

  if (!currentMember) redirect("/")

  // 获取当前成员的消息列表
  const conversation = await getOrCreateConversation(currentMember.id, params.memberId)

  if (!conversation) return redirect(`/servers/${params.serverId}`)

  const { memberOne, memberTwo } = conversation;

  const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className="bg-white dark:bg-[#313338] ">
      MemberId Page
    </div>
  );
};

export default MemberIdPage;
