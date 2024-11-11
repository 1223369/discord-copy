"use client";

import axios from "axios";
import qs from "query-string"
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
  FormItem
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FileUploader } from "../file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-model-store";

// 表单验证
const formSchema = z.object({
  fileUrl: z.string().min(1, {
    message: "附件不能为空"
  }),
})

export const MessageFileModal = () => {

  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const { apiUrl, query } = data;

  const isModalOpen = isOpen && type === "messageFile";

  // 定义表单
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: "",
    }
  });
  // 是否加载中
  const isLoading = form.formState.isSubmitting;

  // 关闭弹窗
  const handleClose = () => {
    form.reset();
    onClose();
  }

  // 提交表单
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      })

      await axios.post(url, {
        ...values,
        content: values.fileUrl,
      })
      form.reset();
      router.refresh();
      handleClose();
    } catch (error) {
      console.log('error:', error)
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        {/* 表单头 */}
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            添加附件
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            请上传附件
          </DialogDescription>
        </DialogHeader>

        {/* 表单内容 */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="spce-y-8 px-6">
              <div className="flex items-center justify-center">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUploader
                          endpoint="messageFile"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                >
                </FormField>
              </div>

            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
                <Button variant={"primary"} disabled={isLoading}>发送</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}