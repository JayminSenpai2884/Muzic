import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

//@ts-expect-error: Third party NPM package
import youtubesearchapi from "youtube-search-api";

const YT_REGEX =
  /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;
//var urlRegex = /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;

const CreateStreamSchema = z.object({
  creatorId: z.string(),
  url: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const data = CreateStreamSchema.parse(await req.json());
    const isYt = data.url.match(YT_REGEX);
    if (!isYt) {
      return NextResponse.json(
        {
          message: "Wrong URL format!!",
        },
        {
          status: 411,
        }
      );
    }

    const extrectedId = data.url.split("?v=")[1];
    const res = await youtubesearchapi.GetVideoDetails(extrectedId);
    const thumbnails = res.thumbnail.thumbnails;
    thumbnails.sort((a: { width: number }, b: { width: number }) =>
      a.width < b.width ? -1 : 1
    );

    const stream = await prismaClient.stream.create({
      data: {
        userId: data.creatorId,
        url: data.url,
        extrectedId,
        type: "Youtube",
        upvote: 0,
        title: res.title ?? "Fix your Fking Code man!!!",
        smallImg:
          (thumbnails.length > 1
            ? thumbnails[thumbnails.length - 2].url
            : thumbnails[thumbnails.length - 1].url) ?? "https://static.wikia.nocookie.net/pokemon/images/8/88/Ash_Oshawott.png/revision/latest/scale-to-width-down/1200?cb=20230204032926",
        bigImg: thumbnails[thumbnails.length - 1].url ?? "https://static.wikia.nocookie.net/pokemon/images/8/88/Ash_Oshawott.png/revision/latest/scale-to-width-down/1200?cb=20230204032926",
      },
    });

    return NextResponse.json({
      message: "Added Stream!!",
      id: stream.id,
    });
  } catch (e) {
    console.log(e)
    return NextResponse.json(
      {
        message: "Error while adding a stream",
      },
      {
        status: 411,
      }
    );
  }
}

export async function GET(req: NextRequest) {
  const creatorId = req.nextUrl.searchParams.get("creatorId");
  const stream = await prismaClient.stream.findMany({
    where: {
      userId: creatorId ?? "",
    },
  });

  return NextResponse.json({
    stream,
  });
}
