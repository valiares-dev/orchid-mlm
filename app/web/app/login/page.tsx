import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Page() {
  return (
    <div className="flex h-svh">
      <div className="flex-1/2 ">
        <div className="flex items-center  h-full justify-center"><AspectRatio ratio={16 / 9} className="w-full max-w-sm rounded-lg bg-muted"></AspectRatio></div>

      </div>
      <div className="flex-1/2">
        <div className="flex mx-10 h-full justify-center flex-col gap-20  items-center ">
          <div className="flex flex-col gap-3 items-center">
            <h3 className="text-4xl font-extrabold">Login here</h3>
            <p>Welcome back you&apos;ve been missed!</p>
          </div>

          <div className="flex w-[50%] flex-col gap-5">
            <Input className="px-5 h-14" placeholder={"Email"} />
            <Input className="px-5 h-14" placeholder={"Password"} />
            <p className="ml-auto  mr-0">Forgot your password?</p>
            <Button className="h-14">Login</Button>
          </div>



           <p>Don&apos;t have an account yet? Sign up</p>
        </div>

      </div>
    </div>
  );
}
