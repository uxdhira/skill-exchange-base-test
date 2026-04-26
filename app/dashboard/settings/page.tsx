"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  useChangePassword,
  useCurrentUser,
  useDeactivateAccount,
} from "@/hooks/auth";
import { formatDateTime } from "@/lib/utility";
import { useState } from "react";
import { toast } from "sonner";

export default function Settings() {
  const { data: user } = useCurrentUser();
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notificationPreferences, setNotificationPreferences] = useState({
    emailBookingReceived: true,
    emailBookingAccepted: true,
    emailBookingRejected: true,
    emailBookingReminder: true,
    emailSkillApproved: true,
    emailReviewReceived: true,
    pushNotifications: true,
    smsNotifications: false,
  });

  const [privacySettings, setPrivacySettings] = useState({
    profilePublic: true,
    showEmail: false,
    showPhone: false,
    showRequestedSkills: true,
    allowMessages: true,
  });
  const { mutate, isPending } = useChangePassword();
  const { mutate: mutateDeactivate } = useDeactivateAccount();

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    mutate({
      currentPassword: passwordData.currentPassword,
      password: passwordData.newPassword,
      passwordConfirmation: passwordData.newPassword,
    });
  };
  // const handlePasswordChange = (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (passwordData.newPassword !== passwordData.confirmPassword) {
  //     toast.error("New passwords do not match");
  //     return;
  //   }

  //   if (passwordData.newPassword.length < 8) {
  //     toast.error("Password must be at least 8 characters");
  //     return;
  //   }

  //   toast.success("Password updated successfully");
  //   setPasswordData({
  //     currentPassword: "",
  //     newPassword: "",
  //     confirmPassword: "",
  //   });
  // };

  const handleNotificationUpdate = () => {
    toast.success("Notification preferences updated");
  };

  const handlePrivacyUpdate = () => {
    toast.success("Privacy settings updated");
  };

  const handleDeactivate = () => {
    mutateDeactivate();
    toast.success(
      "Account deactivated. You can reactivate by logging in again.",
    );
  };

  const handleDelete = () => {
    toast.success(
      "Account deletion request submitted. You will receive a confirmation email.",
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Settings</h1>
        <p className="text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Update your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="font-semibold">Email</p>

                <p>{user?.email}</p>
                <p className="text-xs text-muted-foreground">
                  Contact support to change your email
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-semibold">Member Since</p>

                <p>{formatDateTime(user?.createdAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Update your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" defaultValue="john.doe@example.com" />
                <p className="text-xs text-muted-foreground">
                  Contact support to change your email
                </p>
              </div>
              <div className="space-y-2">
                <Label>Member Since</Label>
                <Input type="text" defaultValue="January 2024" />
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Password */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <Button type="submit">Update Password</Button>
            </form>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>
              Choose how you want to be notified
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Booking Received</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when someone requests to book your skill
                  </p>
                </div>
                <Switch
                  checked={notificationPreferences.emailBookingReceived}
                  onCheckedChange={(checked) =>
                    setNotificationPreferences({
                      ...notificationPreferences,
                      emailBookingReceived: checked,
                    })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Booking Accepted/Rejected</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about booking status changes
                  </p>
                </div>
                <Switch
                  checked={notificationPreferences.emailBookingAccepted}
                  onCheckedChange={(checked) =>
                    setNotificationPreferences({
                      ...notificationPreferences,
                      emailBookingAccepted: checked,
                    })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Booking Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Get reminded about upcoming sessions
                  </p>
                </div>
                <Switch
                  checked={notificationPreferences.emailBookingReminder}
                  onCheckedChange={(checked) =>
                    setNotificationPreferences({
                      ...notificationPreferences,
                      emailBookingReminder: checked,
                    })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Skill Approvals</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when your skills are approved or rejected
                  </p>
                </div>
                <Switch
                  checked={notificationPreferences.emailSkillApproved}
                  onCheckedChange={(checked) =>
                    setNotificationPreferences({
                      ...notificationPreferences,
                      emailSkillApproved: checked,
                    })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Reviews</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when you receive a review
                  </p>
                </div>
                <Switch
                  checked={notificationPreferences.emailReviewReceived}
                  onCheckedChange={(checked) =>
                    setNotificationPreferences({
                      ...notificationPreferences,
                      emailReviewReceived: checked,
                    })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications in your browser
                  </p>
                </div>
                <Switch
                  checked={notificationPreferences.pushNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationPreferences({
                      ...notificationPreferences,
                      pushNotifications: checked,
                    })
                  }
                />
              </div>
            </div>

            <Button onClick={handleNotificationUpdate}>Save Preferences</Button>
          </CardContent>
        </Card> */}

        {/* Privacy Settings */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Privacy Settings</CardTitle>
            <CardDescription>
              Control what information is visible to others
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Public Profile</Label>
                  <p className="text-sm text-muted-foreground">
                    Make your profile visible to all users
                  </p>
                </div>
                <Switch
                  checked={privacySettings.profilePublic}
                  onCheckedChange={(checked) =>
                    setPrivacySettings({
                      ...privacySettings,
                      profilePublic: checked,
                    })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Display your email on your public profile
                  </p>
                </div>
                <Switch
                  checked={privacySettings.showEmail}
                  onCheckedChange={(checked) =>
                    setPrivacySettings({
                      ...privacySettings,
                      showEmail: checked,
                    })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Requested Skills</Label>
                  <p className="text-sm text-muted-foreground">
                    Let others see what skills you want to learn
                  </p>
                </div>
                <Switch
                  checked={privacySettings.showRequestedSkills}
                  onCheckedChange={(checked) =>
                    setPrivacySettings({
                      ...privacySettings,
                      showRequestedSkills: checked,
                    })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow Messages</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow users to send you messages
                  </p>
                </div>
                <Switch
                  checked={privacySettings.allowMessages}
                  onCheckedChange={(checked) =>
                    setPrivacySettings({
                      ...privacySettings,
                      allowMessages: checked,
                    })
                  }
                />
              </div>
            </div>

            <Button onClick={handlePrivacyUpdate}>Save Settings</Button>
          </CardContent>
        </Card> */}

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible actions for your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Deactivate Account</Label>
                <p className="text-sm text-muted-foreground">
                  Temporarily disable your account. You can reactivate it by
                  logging in again.
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">Deactivate</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Deactivate Account?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Your account will be temporarily disabled. You can
                      reactivate it anytime by logging in again. Your data will
                      be preserved.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeactivate}>
                      Deactivate Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-red-600">Delete Account</Label>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data. This
                  action cannot be undone.
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Delete Account Permanently?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove all your data from our servers,
                      including your profile, skills, bookings, and reviews.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete Permanently
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
