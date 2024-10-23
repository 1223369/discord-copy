"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useModal } from "@/hooks/use-model-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Copy, RefreshCcw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";

export const InviteModal = () => {
  const origin = useOrigin();
  const { isOpen, onOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === 'invite'

  const { server } = data
  const inviteUrl = `${origin}/invite/${server?.inviteCode}`

  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Todo: 复制链接功能
  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }

  // Todo: 生成新的链接功能
  const onNew = async () => {
    try {
      setIsLoading(true)
      const response = await axios.patch(`/api/servers/${server?.id}/invite-code`,)
      onOpen("invite", { server: response.data })
    } catch (error) {
      console.log('error', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        {/* 表单头 */}
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            邀请成员
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label
            className="uppercase text-xs font-bold
            text-zinc-500 dark:text-secondary/70"
          >
            服务器邀请链接
          </Label>
          {/*  */}
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              disabled={isLoading}
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 
              text-black focus-visible:ring-offset-0"
              value={inviteUrl}
            />
            <Button disabled={isLoading} onClick={onCopy} size="icon">
              {copied ? <Check /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <Button
          onClick={onNew}
            disabled={isLoading}
            variant="link"
            size="sm"
            className="text-xs text-zinc-500 mt-4"
          >
            生成新的链接
            <RefreshCcw
              className="w-4 h-4 ml-2"
            />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}