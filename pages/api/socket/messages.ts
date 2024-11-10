import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/type";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "该方法不被允许" });

  try {
    const profile = await currentProfilePages(req);
    const { content, fileUrl } = req.body;
    const { serverId, channelId } = req.query;

    if (!profile) return res.status(401).json({ error: "未登录" });
    if (!serverId) return res.status(400).json({ error: "为获取到服务器ID" });
    if (!channelId) return res.status(400).json({ error: "为获取到频道ID" });
    if (!content) return res.status(400).json({ error: "为获取到聊天内容" });

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: profile.id
          }
        }
      },
      include: {
        members: true
      }
    })

    if (!server) return res.status(404).json({ message: "服务器不存在" });

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string
      }
    })

    if (!channel) return res.status(404).json({ message: "频道不存在" });

    const member = server.members.find((m) => m.profileId === profile.id);
    
    if (!member) return res.status(403).json({ message: "你没有权限发送消息" });

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        channelId: channelId as string,
        memberId: member.id
      },
      include: {
        member: {
          include: {
            profile: true
          }
        }
      }
    })

    const channelKey = `chat:${channelId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, message);

    res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGES_POST]", error);
    return res.status(500).json({ error: "网络错误" });
  }
}
