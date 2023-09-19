"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

interface CommentParams {
  threadId: string;
  commentText: string;
  userId: string;
  path: string;
}

export async function createThread({
  text,
  author,
  communityId,
  path,
}: Params) {
  connectToDB();

  try {
    const createdThread = await Thread.create({
      text,
      author,
      community: null,
    });

    await User.findByIdAndUpdate(author, {
      $push: {
        threads: createdThread._id,
      },
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create thread. Error: ${error.message}`);
  }
}

export async function fetchThreads(pageNumber = 1, pageSize = 25) {
  connectToDB();

  const skipAmount = (pageNumber - 1) * pageSize;
  try {
    const threadsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
      .sort({ createdAt: "descending" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: "author", model: User })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: User,
          select: "_id name parentId image",
        },
      });
    const totalThreadsCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    });
    const threads = await threadsQuery.exec();
    const isNext = totalThreadsCount > skipAmount + threads.length;
    return { threads, isNext };
  } catch (error: any) {
    throw new Error(`Failed to fetch threads. Error: ${error.message}`);
  }
}

export async function fetchThreadById(id: string) {
  connectToDB();
  try {
    const thread = await Thread.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id firstName lastName image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id firstName lastName image parentId",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id firstName lastName parentId image",
            },
          },
        ],
      })
      .exec();

    return thread;
  } catch (error: any) {
    throw new Error(`Failed to fetch thread by id. Error: ${error.message}`);
  }
}

export async function addCommentToThread({
  threadId,
  commentText,
  userId,
  path,
}: CommentParams) {
  connectToDB();

  try {
    const originalThread = await Thread.findById(threadId);

    if (!originalThread) {
      throw new Error("Thread not found");
    }

    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    });

    const savedCommentThread = await commentThread.save();

    originalThread.children.push(savedCommentThread._id);

    await originalThread.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed add comment to thread: ${error.message}`);
  }
}
