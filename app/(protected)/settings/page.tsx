import { Button } from "@/components/ui/button";
import { UserProfileDialog } from "@/components/user/profile-dialog";

const SettingsPage = async () => {
  return (
    <div className="container py-4">
      <UserProfileDialog trigger={<Button>Account Settings</Button>} />
    </div>
  );
};

export default SettingsPage;
