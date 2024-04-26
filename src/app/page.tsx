import FileUpload from "@/components/FileUpload";
import SubscriptionButton from "@/components/SubscriptionButton";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { checkSubscription } from "@/lib/subscription";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import {ArrowRight, LogIn} from 'lucide-react'
import Link  from "next/link";
import Image from "next/image";

export default async function Home() {
  const { userId } = await auth()
  const isAuth = !!userId
  const isPro = await checkSubscription()

  let firstChat;

  if (userId) {
    firstChat = await db.select().from(chats).where(eq(chats.userId, userId))

    if (firstChat) {
      firstChat = firstChat[0]
    }
  }

  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-gray-400 to-blue-400">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-4xl font-bold">Chat with any PDF</h1>
            <UserButton afterSignOutUrl="/" />
          </div>

          <div className="flex my-5">
            {isAuth && firstChat && 
            <Link href={`/chat/${firstChat.id}`}>
            <Button>Go to chats <ArrowRight className="ml-2"/></Button>
            </Link> 
            }
            <div className="ml-3">
              <SubscriptionButton isPro={isPro}/>
            </div>
          </div>

          <p className="max-w-xl mt-1 text-lg text-slate-600">
            Join millions of students, researchrs, and professionals to
            instantly answer questions and understand research with AI
          </p>

          <div className="w-full mt-4">
            {isAuth ? (
              <FileUpload/>
            ) : (
              <a href="/sign-in">
                <Button>
                  Login to get Started!
                  <LogIn className="w-4 h-4 ml-2"/>
                </Button>
              </a>
            )}
          </div>


        </div>
      </div>
    </div>
  );
}
