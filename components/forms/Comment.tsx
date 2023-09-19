"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { usePathname, useRouter } from "next/navigation";
import { CommentValidation, ThreadValidation } from "@/lib/validations/thread";
import { addCommentToThread, createThread } from "@/lib/actions/thread.actions";
import { Input } from "../ui/input";
import Image from "next/image";

interface Props {
  threadId: string;
  currentUserImg: string;
  currentUserId: string;
}

export default function Comment({
  threadId,
  currentUserId,
  currentUserImg,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    setLoading(true);
    await addCommentToThread({
      threadId,
      commentText: values.thread,
      userId: JSON.parse(currentUserId),
      path: pathname,
    });
    setLoading(false);

    form.reset();
  };
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
          <FormField
            control={form.control}
            name="thread"
            render={({ field }) => (
              <FormItem className="flex gap-3 w-full items-center">
                <FormLabel>
                  <Image
                    src={currentUserImg}
                    alt="Photo profile"
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                </FormLabel>
                <FormControl className="border-none bg-transparent">
                  <Input
                    type="text"
                    placeholder="Comment..."
                    className="no-focus outline-none text-light-1"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {loading ? (
            <Button type="button" disabled className="comment-form_btn">
              Loading...
            </Button>
          ) : (
            <Button type="submit" className="comment-form_btn">
              Reply
            </Button>
          )}
        </form>
      </Form>
    </>
  );
}
