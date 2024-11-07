"use client"

import { ServerWithMembersWithProfiles } from "@/type";
import { ChannelType, MemberRole } from "@prisma/client";
import { ActionTooltip } from "@/components/action-tooltip";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/use-model-store";

interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  sectionType?: "channels" | "members";
  channelType?: ChannelType;
  server?: ServerWithMembersWithProfiles;
}

export const ServerSection = ({
  label,
  role,
  sectionType,
  channelType,
  server
}: ServerSectionProps) => {

  const { onOpen } = useModal();


  return (
    <div className="flex items=center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {/* 创建频道按钮 */}
      {role !== MemberRole.GUEST && sectionType === "channels" && (
        <ActionTooltip label="创建频道" side="top">
          <button
            onClick={() => onOpen("createChannel")}
            className="text-zinc-500 hover:text-zinc-600z
             dark:text-zinc-400 dark:hover:text-zinc-300 transititon"
          >
            <Plus className="h-4 w-5" />
          </button>
        </ActionTooltip>
      )}

      {/*  */}
      {role === MemberRole.ADMIN && sectionType === "members" && (

        <ActionTooltip label="管理成员" side="top">
          <button
            onClick={() => onOpen("members", { server })}
            className="text-zinc-500 hover:text-zinc-600z
             dark:text-zinc-400 dark:hover:text-zinc-300 transititon"
          >
            <Settings className="h-4 w-5" />
          </button>
        </ActionTooltip>
      )}
    </div>
  )
}