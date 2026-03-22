import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useClaimAdminByEmail, useSaveUserProfile } from "../hooks/useQueries";

interface ProfileSetupModalProps {
  open: boolean;
}

export default function ProfileSetupModal({ open }: ProfileSetupModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { mutate: saveProfile, isPending: savePending } = useSaveUserProfile();
  const { mutate: claimAdmin } = useClaimAdminByEmail();

  const isPending = savePending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    saveProfile(
      { name: name.trim() },
      {
        onSuccess: () => {
          if (email.trim()) {
            claimAdmin(email.trim());
          }
        },
      },
    );
  };

  return (
    <Dialog open={open}>
      <DialogContent data-ocid="profile_setup.dialog">
        <DialogHeader>
          <DialogTitle>Welcome to Tirupati Tractors!</DialogTitle>
          <DialogDescription>
            Please enter your details to set up your profile.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="profile-name">Your Name</Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              data-ocid="profile_setup.input"
            />
          </div>
          <div>
            <Label htmlFor="profile-email">Email (optional)</Label>
            <Input
              id="profile-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              data-ocid="profile_setup.input"
            />
          </div>
          <Button
            type="submit"
            disabled={isPending || !name.trim()}
            className="w-full bg-primary text-primary-foreground"
            data-ocid="profile_setup.submit_button"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            {isPending ? "Saving..." : "Continue"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
