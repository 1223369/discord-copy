// 编辑服务器弹窗
"use client";

import axios from "axios";
import * as z from "zod";
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUploader } from "../file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-model-store";
import { useEffect } from "react";

// 表单验证
const formSchema = z.object({
  name: z.string().min(1, {
    message: "名称不能为空"
  }),
  imageUrl: z.string().min(1, {
    message: "图片不能为空"
  }),
})

export const EditeServerModal = () => {

  const { isOpen, onClose, type, data } = useModal()

  const router = useRouter();

  const isModalOpen = isOpen && type === 'editServer'
  const { server } = data;

  // 定义表单
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    }
  });
  // 是否加载中
  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (server) {
      form.setValue("name", server.name)
      form.setValue("imageUrl", server.imageUrl)
    }
  },[server, form])


  // 提交表单
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/servers/${server?.id}`, values)
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
            创建您的服务器
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            请为您的服务器添加一个名称和一个主题。
          </DialogDescription>
        </DialogHeader>

        {/* 表单内容 */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="spce-y-8 px-6">
              <div className="flex items-center justify-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUploader
                          endpoint="serverImage"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                >
                </FormField>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="uppercase text-xs font-bold
                       text-zinc-500 dark:text-secondary/70"
                    >
                      服务器名称
                    </FormLabel>
                    <FormControl>
                      <Input 
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 
                        focus-visible:ring-0 text-black 
                        focus-visible:ring-offset-0"
                        placeholder="请输入服务器名称"
                        {...field}
                      />
                    </FormControl>
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