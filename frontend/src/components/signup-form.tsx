import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AiTwotoneCrown } from "react-icons/ai";
import { Link } from "react-router-dom";

interface Signup2Props {
  heading?: string;
  title?: string;
  buttonText?: string;
  googleText?: string;
  signupText?: string;
  signupUrl?: string;
}

const Signup2 = ({
  heading = "Signup",
  title = "React Royale",
  buttonText = "Create Account",
  signupText = "Already a user?",
}: Signup2Props) => {
  return (
    <section className="bg-muted h-screen">
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-6 lg:justify-start">
          {/* Logo */}
          <div className="flex items-center gap-4 text-3xl font-bold">
            <AiTwotoneCrown size={48} className="text-yellow-400" /> {title}
          </div>
          <div className="min-w-sm border-muted bg-background flex w-full max-w-sm flex-col items-center gap-y-4 rounded-md border px-6 py-8 shadow-md">
            {heading && <h1 className="text-xl font-semibold">{heading}</h1>}
            <div className="flex w-full flex-col gap-2">
              <Label>Email</Label>
              <Input type="email" placeholder="Email" className="text-sm" required />
            </div>
            <div className="flex w-full flex-col gap-2">
              <Label>Password</Label>
              <Input type="password" placeholder="Password" className="text-sm" required />
            </div>
            <div className="flex w-full flex-col gap-2">
              <Label>Confirm Password</Label>
              <Input type="password" placeholder="Password" className="text-sm" required />
            </div>
            <Button type="submit" className="w-full">
              {buttonText}
            </Button>
          </div>
          <div className="text-muted-foreground flex justify-center gap-1 text-sm">
            <p>{signupText}</p>
            <Link to="/login" className="text-primary font-medium hover:underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Signup2 };
