"use client";

import { ServerWithMembersWithProfiles } from "@/type";
import { MemberRole } from "@prisma/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { ChevronDown, UserPlus, Settings, Users, PlusCircle, Trash, LogOut } from "lucide-react";
import { useModal } from "@/hooks/use-model-store";

interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles;
  role?: MemberRole;
}

export const ServerHeader = ({
  server,
  role
}: ServerHeaderProps) => {

  const { onOpen } = useModal();

  // 确认是否为管理员
  const isAdmin = role === MemberRole.ADMIN;
  // 确认是否为群主
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  return (
    <DropdownMenu>
      {/* 频道名称 */}
      <DropdownMenuTrigger
        className="focus:outline-none"
        asChild
      >
        <button
          className="w-full text-md font-semibold px-3 flex items-center
          h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10
          dark:hover:bg-zinc-700/50 transition"
        >
          {server.name}
          <ChevronDown
            className="w-5 h-5 ml-auto"
          />
        </button>
      </DropdownMenuTrigger>

      {/* 操作选项 */}
      <DropdownMenuContent
        className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]"
      >
        {/* 群主-邀请成员选项 */}
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen("invite", { server })}
            className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
          >
            邀请成员
            <UserPlus className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {/* 管理员-服务器设置选项 */}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("editServer", { server })}
            className=" px-3 py-2 text-sm cursor-pointer"
          >
            服务器设置
            <Settings className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {/* 管理员-管理成员选项 */}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("members", { server })}
            className=" px-3 py-2 text-sm cursor-pointer"
          >
            管理成员
            <Users className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {/* 群主-创建频道选项 */}
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen("createChannel")}
            className=" px-3 py-2 text-sm cursor-pointer"
          >
            创建频道
            <PlusCircle className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {/* 分隔符 */}
        {isModerator && (
          <DropdownMenuSeparator />
        )}

        {/* 管理员删除服务器选项 */}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("deleteServer", { server })}
            className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
          >
            删除服务
            <Trash className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {/* 非管理员退出服务器选项 */}
        {!isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("leaveServer", { server })}
            className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
          >
            退出服务器
            <LogOut className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

      </DropdownMenuContent>

    </DropdownMenu>
  )
}