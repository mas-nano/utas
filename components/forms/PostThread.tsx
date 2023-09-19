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
import { ThreadValidation } from "@/lib/validations/thread";
import { createThread } from "@/lib/actions/thread.actions";

function PostThread({ userId }: { userId: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: "",
      accountId: userId,
    },
  });

  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    setLoading(true);
    await createThread({
      text: values.thread,
      author: userId,
      communityId: null,
      path: pathname,
    });
    setLoading(false);

    router.push("/");
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-10 flex flex-col justify-start gap-10"
        >
          <FormField
            control={form.control}
            name="thread"
            render={({ field }) => (
              <FormItem className="flex gap-3 w-full flex-col">
                <FormLabel className="text-base-semibold text-light-2">
                  Content
                </FormLabel>
                <FormControl>
                  <Textarea
                    rows={15}
                    className="no-focus border border-dark-4 bg-dark-3 text-light-1"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {loading ? (
            <Button type="button" disabled className="bg-primary-500">
              Loading...
            </Button>
          ) : (
            <Button type="submit" className="bg-primary-500">
              Post Thread
            </Button>
          )}
        </form>
      </Form>
    </>
  );
}

export default PostThread;
