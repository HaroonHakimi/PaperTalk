import FileUpload from "@/components/FileUpload";
import SubscriptionButton from "@/components/SubscriptionButton";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { checkSubscription } from "@/lib/subscription";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { ArrowRight, LogIn } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;
  const isPro = await checkSubscription();

  let firstChat;

  if (userId) {
    firstChat = await db.select().from(chats).where(eq(chats.userId, userId));

    if (firstChat) {
      firstChat = firstChat[0];
    }
  }

  return (
    <div className="bg-gradient-to-r from-gray-200 to-blue-300">
      <div className="w-screen min-h-screen ">
        <nav className="bg-white bg-opacity-20 ">
          <div className="px-20 py-5 flex justify-between ">
            <div className="font-bold flex items-center text-xl">
              PaperTalk.
            </div>
            <ul className="flex items-center  gap-7">
              {isAuth && firstChat ? (
                <Link href={`/chat/${firstChat.id}`}>
                  <Button>
                    Go to chats <ArrowRight className="ml-2" />
                  </Button>
                </Link>
              ) : (
                <>
                  <li>
                    <Link href='/'>
                    Pricing
                    </Link>
                    
                  </li>
                  <li>
                    <Link href='/sign-in'>
                    <Button>
                      Get Started
                      <ArrowRight className="ml-2" />
                    </Button>
                    </Link>
                    
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center">
              <h1 className="mr-3 text-5xl font-bold">
                Chat with your <span className="text-blue-900">documents</span>{" "}
                in seconds.
              </h1>
              <UserButton afterSignOutUrl="/" />
            </div>

            <div className="flex my-5">
              {isAuth && firstChat && (
                <Link href={`/chat/${firstChat.id}`}>
                  <Button>
                    Go to chats <ArrowRight className="ml-2" />
                  </Button>
                </Link>
              )}
              <div className="ml-3">
                <SubscriptionButton isPro={isPro} />
              </div>
            </div>

            <p className="max-w-xl mt-1 text-lg text-slate-800">
              PaperTalk allows you to have conversations with any PDF document.
              Simply upload your file and start asking questions right away.
            </p>

            <div className="w-full mt-4">
              {isAuth ? (
                <FileUpload />
              ) : (
                <a href="/sign-in">
                  <Button>
                    Login to get Started!
                    <LogIn className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto pb-32  max-w-5xl sm:mt-56">
        <div className="mb-12 px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="mt-2 font-bold text-4xl text-gray-900 sm:text-5xl">
              Start chatting in minutes
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Chatting to your PDF files has never been easier than with PaperTalk.
            </p>
          </div>
        </div>

        {/* steps */}
        <ol className="my-8 space-y-4 pt-8 md:flex md:space-x-12 md:space-y-0">
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-600 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-blue-600">Step 1</span>
              <span className="text-xl font-semibold">
                Sign up for an account
              </span>
              <span className="mt-2 text-zinc-700">
                Either starting out with a free plan or choose our Pro Plan.
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-600 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-blue-600">Step 2</span>
              <span className="text-xl font-semibold">
                Upload your PDF file
              </span>
              <span className="mt-2 text-zinc-700">
                We&apos;ll process your file and make it ready for you to chat
                with.
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-600 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-blue-600">Step 3</span>
              <span className="text-xl font-semibold">
                Start asking questions
              </span>
              <span className="mt-2 text-zinc-700">
                It&apos;s that simple. Try out PaperTalk today - it really takes
                less than a minute.
              </span>
            </div>
          </li>
        </ol>

        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mt-16 flow-root sm:mt-24">
            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <Image
                src="/file-upload-preview.png"
                alt="uploading preview"
                width={1419}
                height={732}
                quality={100}
                className="rounded-md bg-white p-2 sm:p-8 md:p-20 shadow-2xl ring-1 ring-gray-900/10"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
