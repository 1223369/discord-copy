"use client"
import { useSocket } from "@/components/providers/socket-provider"
import { Badge } from "@/components/ui/badge"

export const SocketIndicator = () => {
  const { isConnected } = useSocket()

  if (!isConnected) {
    return (
      <Badge variant="outline" className="bg-yellow-600 text-white border-none">
        无连接: 正在尝试重新连接...
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="bg-emerald-600 text-white border-none">
      已连接: 会话正常
    </Badge>
  )

}