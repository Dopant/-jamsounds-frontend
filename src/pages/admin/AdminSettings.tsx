import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Palette, 
  Mail, 
  Bell, 
  Shield, 
  Database, 
  Globe,
  Save,
  RefreshCw,
  Upload,
  Download,
  AlertTriangle,
  CheckCircle,
  Settings,
  Link,
  TrendingUp,
  User,
  Lock,
  Key
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRef } from "react";

const AdminSettings = () => {
  const { toast } = useToast();
  
  const [submitRedirectUrl, setSubmitRedirectUrl] = useState('');
  
  const [settings, setSettings] = useState({
    // Platform Branding
    siteName: "JAM JOURNAL SOUND",
    tagline: "Discover. Review. Amplify.",
    logoUrl: "/assets/jam-journal-logo.png",
    faviconUrl: "/favicon.ico",
    primaryColor: "#6366f1",
    accentColor: "#8b5cf6",
    
    // Homepage Statistics
    artistsFeaturedCount: localStorage.getItem('artistsFeaturedCount') || '2.5K+',
    reviewsPublishedCount: localStorage.getItem('reviewsPublishedCount') || '15K+',
    monthlyReadersCount: localStorage.getItem('monthlyReadersCount') || '1M+'
  });

  const [profileSettings, setProfileSettings] = useState({
    fullName: localStorage.getItem('adminFullName') || 'Admin User',
    email: localStorage.getItem('adminEmail') || 'admin@jamjournal.com',
    bio: localStorage.getItem('adminBio') || 'Platform Administrator',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    avatar: localStorage.getItem('adminAvatar') || null
  });

  const [newsletterSettings, setNewsletterSettings] = useState({
    autoSendOnPublish: localStorage.getItem('autoSendOnPublish') === 'true',
    newsletterEnabled: localStorage.getItem('newsletterEnabled') === 'true',
    welcomeMessage: localStorage.getItem('welcomeMessage') || 'Welcome to JAM JOURNAL SOUND newsletter!',
    subscriberCount: localStorage.getItem('subscriberCount') || '0'
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Fetch submit redirect URL from backend on mount
  useEffect(() => {
    async function fetchRedirectUrl() {
      try {
        const res = await fetch('/api/auth/settings/submit-redirect-url');
        if (!res.ok) return;
        const data = await res.json();
        setSubmitRedirectUrl(data.url || '');
      } catch {}
    }
    fetchRedirectUrl();
  }, []);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`
          }
        });
        if (!res.ok) return;
        const data = await res.json();
        setProfileSettings(prev => ({
          ...prev,
          fullName: data.name || prev.fullName,
          email: data.email || prev.email,
          bio: data.bio || prev.bio,
          avatar: data.avatar || null
        }));
        if (data.avatar) setAvatarPreview(data.avatar);
      } catch {}
    }
    fetchProfile();
  }, []);

  const handleSave = (section: string) => {
    // Save submit redirect URL to localStorage
    if (section === 'platform' || section === 'all') {
      localStorage.setItem('submitRedirectUrl', submitRedirectUrl);
      localStorage.setItem('artistsFeaturedCount', settings.artistsFeaturedCount);
      localStorage.setItem('reviewsPublishedCount', settings.reviewsPublishedCount);
      localStorage.setItem('monthlyReadersCount', settings.monthlyReadersCount);
    }
    
    if (section === 'profile' || section === 'all') {
      localStorage.setItem('adminFullName', profileSettings.fullName);
      localStorage.setItem('adminEmail', profileSettings.email);
      localStorage.setItem('adminBio', profileSettings.bio);
      localStorage.setItem('adminAvatar', profileSettings.avatar || null);
    }
    
    if (section === 'newsletter' || section === 'all') {
      localStorage.setItem('autoSendOnPublish', newsletterSettings.autoSendOnPublish.toString());
      localStorage.setItem('newsletterEnabled', newsletterSettings.newsletterEnabled.toString());
      localStorage.setItem('welcomeMessage', newsletterSettings.welcomeMessage);
      localStorage.setItem('subscriberCount', newsletterSettings.subscriberCount);
    }
    
    toast({
      title: "Settings Saved",
      description: `${section === 'all' ? 'All settings' : `${section} settings`} have been updated successfully.`,
    });
  };

  const handlePasswordChange = () => {
    if (profileSettings.newPassword !== profileSettings.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive"
      });
      return;
    }
    
    if (profileSettings.newPassword.length < 8) {
      toast({
        title: "Error", 
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Password Changed",
      description: "Your password has been updated successfully.",
    });
    
    setProfileSettings(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };

  const handleBackupDownload = () => {
    toast({
      title: "Backup Started",
      description: "Your backup will be downloaded shortly.",
    });
  };

  const handleSystemRestart = () => {
    toast({
      title: "System Restart Initiated",
      description: "The system will restart in 30 seconds.",
      variant: "destructive"
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileSave = async () => {
    const formData = new FormData();
    formData.append('name', profileSettings.fullName);
    formData.append('bio', profileSettings.bio);
    if (avatarInputRef.current?.files?.[0]) {
      formData.append('avatar', avatarInputRef.current.files[0]);
    }
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`
        },
        body: formData
      });
      if (!res.ok) throw new Error('Failed to update profile');
      const data = await res.json();
      toast({ title: 'Profile updated', description: 'Your profile has been updated.' });
      if (data.avatar) setAvatarPreview(data.avatar);
    } catch (err) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to update profile', variant: 'destructive' });
    }
  };

  const handleSaveRedirectUrl = async () => {
    try {
      const res = await fetch('/api/auth/settings/submit-redirect-url', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`
        },
        body: JSON.stringify({ url: submitRedirectUrl })
      });
      if (!res.ok) throw new Error('Failed to update redirect URL');
      toast({ title: 'Redirect URL updated', description: 'The submit music redirect URL has been updated.' });
    } catch (err) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Failed to update redirect URL', variant: 'destructive' });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Platform Settings</h1>
            <p className="text-muted-foreground">
              Configure and customize your JAM JOURNAL SOUND platform
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleBackupDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download Backup
            </Button>
            <Button onClick={() => handleSave('all')}>
              <Save className="w-4 h-4 mr-2" />
              Save All
            </Button>
          </div>
        </div>

        <Tabs defaultValue="platform" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="platform">Platform</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
            <TabsTrigger value="redirect">Submit Redirect</TabsTrigger>
          </TabsList>

          {/* Platform Settings */}
          <TabsContent value="platform" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="w-5 h-5 mr-2" />
                  Platform Branding
                </CardTitle>
                <CardDescription>
                  Customize the appearance and branding of your platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={settings.siteName}
                      onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                      id="tagline"
                      value={settings.tagline}
                      onChange={(e) => setSettings(prev => ({ ...prev, tagline: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="w-20"
                      />
                      <Input
                        value={settings.primaryColor}
                        onChange={(e) => setSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="accentColor">Accent Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="accentColor"
                        type="color"
                        value={settings.accentColor}
                        onChange={(e) => setSettings(prev => ({ ...prev, accentColor: e.target.value }))}
                        className="w-20"
                      />
                      <Input
                        value={settings.accentColor}
                        onChange={(e) => setSettings(prev => ({ ...prev, accentColor: e.target.value }))}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
                <Button onClick={() => handleSave('platform')}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Branding
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Homepage Statistics
                </CardTitle>
                <CardDescription>
                  Configure the statistics displayed on the homepage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="artistsFeatured">Artists Featured</Label>
                    <Input
                      id="artistsFeatured"
                      value={settings.artistsFeaturedCount}
                      onChange={(e) => setSettings(prev => ({ ...prev, artistsFeaturedCount: e.target.value }))}
                      placeholder="2.5K+"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reviewsPublished">Reviews Published</Label>
                    <Input
                      id="reviewsPublished"
                      value={settings.reviewsPublishedCount}
                      onChange={(e) => setSettings(prev => ({ ...prev, reviewsPublishedCount: e.target.value }))}
                      placeholder="15K+"
                    />
                  </div>
                  <div>
                    <Label htmlFor="monthlyReaders">Monthly Readers</Label>
                    <Input
                      id="monthlyReaders"
                      value={settings.monthlyReadersCount}
                      onChange={(e) => setSettings(prev => ({ ...prev, monthlyReadersCount: e.target.value }))}
                      placeholder="1M+"
                    />
                  </div>
                </div>
                <Button onClick={() => handleSave('platform')}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Statistics
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your personal information and account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-6 mb-4">
                  <div className="relative w-20 h-20">
                    <img
                      src={avatarPreview || profileSettings.avatar || "/assets/default-avatar.png"}
                      alt="Profile Avatar"
                      className="w-20 h-20 rounded-full object-cover border"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      ref={avatarInputRef}
                      onChange={handleAvatarChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      title="Upload avatar"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={profileSettings.fullName}
                      onChange={(e) => setProfileSettings(prev => ({ ...prev, fullName: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileSettings.bio}
                    onChange={(e) => setProfileSettings(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                  />
                </div>
                <Button onClick={handleProfileSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Profile
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="w-5 h-5 mr-2" />
                  Change Password
                </CardTitle>
                <CardDescription>
                  Update your account password
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={profileSettings.currentPassword}
                    onChange={(e) => setProfileSettings(prev => ({ ...prev, currentPassword: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={profileSettings.newPassword}
                      onChange={(e) => setProfileSettings(prev => ({ ...prev, newPassword: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={profileSettings.confirmPassword}
                      onChange={(e) => setProfileSettings(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    />
                  </div>
                </div>
                <Button onClick={handlePasswordChange}>
                  <Key className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Newsletter Settings */}
          <TabsContent value="newsletter" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Newsletter Configuration
                </CardTitle>
                <CardDescription>
                  Manage newsletter settings and subscriber notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="newsletterEnabled"
                    checked={newsletterSettings.newsletterEnabled}
                    onCheckedChange={(checked) => setNewsletterSettings(prev => ({ ...prev, newsletterEnabled: checked }))}
                  />
                  <Label htmlFor="newsletterEnabled">Enable Newsletter Subscriptions</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="autoSendOnPublish"
                    checked={newsletterSettings.autoSendOnPublish}
                    onCheckedChange={(checked) => setNewsletterSettings(prev => ({ ...prev, autoSendOnPublish: checked }))}
                  />
                  <Label htmlFor="autoSendOnPublish">Auto-send newsletter when new posts are published</Label>
                </div>
                <div>
                  <Label htmlFor="welcomeMessage">Welcome Message</Label>
                  <Textarea
                    id="welcomeMessage"
                    value={newsletterSettings.welcomeMessage}
                    onChange={(e) => setNewsletterSettings(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="subscriberCount">Current Subscribers</Label>
                  <Input
                    id="subscriberCount"
                    value={newsletterSettings.subscriberCount}
                    onChange={(e) => setNewsletterSettings(prev => ({ ...prev, subscriberCount: e.target.value }))}
                    readOnly
                  />
                </div>
                <Button onClick={() => handleSave('newsletter')}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Newsletter Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Submit Redirect Settings */}
          <TabsContent value="redirect" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Link className="w-5 h-5 mr-2" />
                  Submit Music Redirect
                </CardTitle>
                <CardDescription>
                  Configure where users are redirected after submitting music
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="submitRedirectUrl">Redirect URL</Label>
                  <Input
                    id="submitRedirectUrl"
                    value={submitRedirectUrl}
                    onChange={(e) => setSubmitRedirectUrl(e.target.value)}
                    placeholder="https://your-submission-form.com"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Users will be redirected to this URL after clicking the submit music button
                  </p>
                </div>
                <Button onClick={handleSaveRedirectUrl}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Redirect URL
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;