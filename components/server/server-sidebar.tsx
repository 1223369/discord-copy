import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { ServerHeader } from "@/components/server/server-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ServerSearch } from "@/components/server/server-search";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Label } from "@radix-ui/react-label";

interface ServerSidebarProps {
  serverId: string;
}

export const ServerSidebar = async ({
  serverId
}: ServerSidebarProps) => {

  const profile = await currentProfile()

  if (!profile) return redirect("/")

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

  if (!server) return redirect("/")

  // 频道图标映射
  const iconMap = {
    [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
    [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
    [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />
  };

  // 成员角色图标映射
  const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />,
    [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />
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
      {/* 频道列表 */}
      <ScrollArea className="flex-1 px-3 ">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChanels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type]
                }))
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: audioChanels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type]
                }))
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChanels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type]
                }))
              },
              {
                label: "Menbers",
                type: "member",
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role]
                }))
              }
            ]}
          />
        </div>
      </ScrollArea>
    </div>
  )
}