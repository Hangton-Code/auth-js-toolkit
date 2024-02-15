import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { PersonIcon } from "@radix-ui/react-icons";
import { ProfileSection } from "./profile-section";
import { EmailSection } from "./email-section";
import { AuthSection } from "./auth-section";
import { LogoutButton } from "./logout-button";

interface UserProfileDialogProps {
  trigger: React.ReactNode;
}

export const UserProfileDialog = ({ trigger }: UserProfileDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-[900px] w-[80%] max-sm:w-full">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <PersonIcon className="w-5 h-5" />
              Account
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="py-8 px-4 max-sm:px-0">
          {/* heading */}
          <div className="mb-8">
            <p className="text-3xl font-bold font-mono">Account Settings</p>
            <p className="text-muted-foreground text-sm">
              Manage your account settings
            </p>
          </div>
          {/* sections */}
          <ProfileSection />
          <EmailSection />
          <AuthSection />
          {/* signout button */}
          <LogoutButton className="w-full" />
        </div>
      </DialogContent>
    </Dialog>
  );
};
