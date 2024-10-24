import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  }
}

const InviteCodePage  = async({
  params
}: InviteCodePageProps) => {

  const profile = await currentProfile();

  if (!profile) return redirectToSignIn();
  if (!params.inviteCode) return redirect("/");

  // 检查是否已在服务器中
  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id //当前用户  
        }
      }
    }
  })

  if (existingServer) return redirect(`/servers/${existingServer.id}`);

  // 将新成员更新到数据库
  const server = await db.server.update({
    where: {
      inviteCode: params.inviteCode
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          }
        ]
      }
    }
  })

  // 重定向到服务器页面
  if (server) return redirect(`/servers/${server.id}`);


  return null;
};

export default InviteCodePage ;
