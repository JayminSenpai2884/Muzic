import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST() { // Removed req parameter
  const session = await getServerSession();
  const user = await prismaClient.user.findFirst({
    where: {
      email: session?.user?.email ?? "",
    },
  });

  if (!user) {
    return NextResponse.json(
      {
        message: "Unauthenticated!!!!",
      },
      {
        status: 403,
      }
    );
  }

  const stream = await prismaClient.stream.findMany({
    where: {
      userId: user.id,
    },
    include: {
      _count: {
        select: {
          Upvotes: true,
        },
      },
      Upvotes: {
        where: {
          userId: user.id,
        },
      },
    },
  });

  return NextResponse.json({
    stream: stream.map(({ _count, ...rest }) => ({
      ...rest,
      upvote: _count.Upvotes,
    })),
  });
}
