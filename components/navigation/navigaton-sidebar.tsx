// 侧边栏
import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { NavigationAction } from "./navigation-action"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { NavigationItem } from "@/components/navigation/navigation-item"

export const NavigationSidebar = async() => {

  const profile = await currentProfile()

  if (!profile) return redirect("/")

  // 获取所有服务器
  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  })

  return (
    <div 
      className="space-y-4 flex flex-col items-center
        h-full text-primary w-full dark:bg-[#1E1F22] py-3"
    >
      {/* 添加频道服务器按钮 */}
      <NavigationAction />

      {/* 分隔符 */}
      <Separator 
        className="h-[2px] bg-zinc-300 dark:bg-zinc-700
        rounded-md w-full mx-auto"
      />

      {/* 频道服务器列表 */}
      <ScrollArea
        className="flex-1 w-full"
      >
        {servers.map((server) => (
          <div key={server.id} className="mb-4">
            <NavigationItem 
              id={server.id}
              name={server.name}
              imageUrl={server.imageUrl}
            />
          </div>
        ))}
      </ScrollArea>
    </div>
  )
}