"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-model-store";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export const LeaveServerModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const router = useRouter();

  const isModalOpen = isOpen && type === 'leaveServer'

  const { server } = data

  const [isLoading, setIsLoading] = useState(false)

  // 退出服务器
  const onClick = async () => {
    try {
      setIsLoading(true)

      await axios.patch(`/api/servers/${server?.id}/leave`)
      onClose()
      router.refresh()
      router.push('/')
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
            退出
          </DialogTitle>
          <DialogDescription className="text-zinc-500 text-center">
            你确定要退出 <span className="font-semibold text-indigo-500">{server?.name}</span>吗？
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex justify-between w-full">
            <Button 
              disabled={isLoading}
              onClick={onClose}
              variant="ghost"
            >
              取消
            </Button>
            <Button
              disabled={isLoading}
              variant="primary"
              onClick={onClick}
            >
              确认
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}