"use client";

import qs from "query-string";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-model-store";
import { ChannelType } from "@prisma/client";
import { useEffect } from "react";

// 表单验证
const formSchema = z.object({
  name: z.string().min(1, {
    message: "名称不能为空"
  }).refine(
    name => name !== "默认",
    {
      message: "名称不能为'默认'"
    }
  ),
  type: z.nativeEnum(ChannelType),
})

export const EditChannelModal = () => {

  const { isOpen, onClose, type, data } = useModal()

  const router = useRouter();

  const isModalOpen = isOpen && type === 'editChannel'
  const { channel, server } = data;

  // 定义表单
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: channel?.type || ChannelType.TEXT,
    }
  });

  useEffect(() => {
    if (channel) {
      form.setValue("name", channel.name)
      form.setValue("type", channel.type)
    }
  },[form, channel])

  // 获取频道类型标签
  const getChannelTypeLabel = (type: ChannelType) => {
    switch (type) {
      case ChannelType.TEXT:
        return "文字频道";
      case ChannelType.AUDIO:
        return "语音频道";
      case ChannelType.VIDEO: // 注意此处的拼写应为 VIDEO，而不是 VODEO
        return "视频频道";
      default:
        return "未知频道类型";
    }
  };

  // 是否加载中
  const isLoading = form.formState.isSubmitting;

  // 提交表单
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {

      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: server?.id,
          name: values.name,
        }
      })
      await axios.patch(url, values)
      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log('error:', error)
    }
  };

  // 关闭弹窗
  const handleClose = () => {
    form.reset();
    onClose();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        {/* 表单头 */}
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            修改频道
          </DialogTitle>
        </DialogHeader>

        {/* 表单内容 */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="spce-y-8 px-6">

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="uppercase text-xs font-bold
                       text-zinc-500 dark:text-secondary/70"
                    >
                      频道名称
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 
                        focus-visible:ring-0 text-black 
                        focus-visible:ring-offset-0"
                        placeholder="请输入频道名称"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* 频道类型 */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      频道类型
                    </FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          className="bg-zinc-300/50 border-0 focus:ring-0 text-black 
                          ring-offset-0 focus:ring-offset-0 capitalize outline-none"
                        >
                          <SelectValue placeholder="请选择频道类型"/>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ChannelType).map((type) => (
                          <SelectItem key={type} value={type} 
                            className="capitalize"
                          >
                            {
                             getChannelTypeLabel(type)
                            }
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant={"primary"} disabled={isLoading}>保存</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}