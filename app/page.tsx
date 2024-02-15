import { LoginButton } from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <LoginButton>
        <Button>Sign In</Button>
      </LoginButton>
    </div>
  );
}
