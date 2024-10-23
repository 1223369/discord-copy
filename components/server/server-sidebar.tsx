import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";
import { ServerHeader } from "@/components/server/server-header";

interface ServerSidebarProps {
  serverId: string;
}

export const ServerSidebar = async ({
  serverId
}: ServerSidebarProps) => {

  const profile = await currentProfile()

  if (!profile) {
    return redirect("/")
  }

  // 获取当前用户的服务器列表
  const server = await db.server.findUnique({
    where: {
      id: serverId
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc"
        }
      },
      members: {
        include: {
          profile: true
        },
        orderBy: {
          role: "asc"
        }
      }
    }
  })

  if (!server) {
    return redirect("/")
  }

  // 获取文字聊天频道
  const textChanels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT)

  // 获取语音聊天频道
  const audioChanels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO)

  // 获取视频聊天频道
  const videoChanels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO)

  // 获取频道成员
  const members = server?.members.filter((member) => member.profileId !== profile.id)

  // 获取当前用户的角色
  const role = server?.members.find((member) => member.profileId === profile.id)?.role

  return (
    <div className="flex flex-col h-full w-full text-primary dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader
        server={server}
        role={role}
      />
    </div>
  )
}