import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  MousePointer,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  DollarSign,
  Download,
  Calendar,
  Filter,
  RefreshCw
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState("7d");
  const [dataType, setDataType] = useState("all");

  const userAnalytics = {
    totalUsers: 15420,
    newUsers: 2180,
    returningUsers: 13240,
    userGrowth: 12.5,
    averageSessionTime: "4m 32s",
    bounceRate: 32.4,
    pageViews: 89420,
    uniqueVisitors: 24180
  };

  const contentAnalytics = {
    totalArticles: 156,
    totalViews: 245680,
    avgTimeOnPage: "3m 45s",
    socialShares: 8940,
    comments: 1240,
    engagementRate: 67.8
  };

  const revenueAnalytics = {
    totalRevenue: 12450,
    submissionFees: 8940,
    campaignRevenue: 3510,
    revenueGrowth: 18.2,
    averageOrderValue: 29.50,
    conversionRate: 4.2
  };

  const performanceMetrics = {
    avgLoadTime: 1.2,
    uptime: 99.9,
    errorRate: 0.08,
    serverResponse: 180
  };

  const topContent = [
    { title: "Digital Dreams Review", views: 12450, engagement: 89 },
    { title: "Lo-Fi Hip Hop Trends", views: 9870, engagement: 76 },
    { title: "Artist Spotlight: Luna", views: 8920, engagement: 82 },
    { title: "Genre Analysis: Shoegaze", views: 7650, engagement: 71 },
    { title: "Electronic Music 2024", views: 6780, engagement: 68 }
  ];

  const trafficSources = [
    { source: "Direct", visitors: 8940, percentage: 42 },
    { source: "Social Media", visitors: 6120, percentage: 29 },
    { source: "Search Engines", visitors: 4380, percentage: 21 },
    { source: "Referrals", visitors: 1740, percentage: 8 }
  ];

  const deviceBreakdown = [
    { device: "Desktop", users: 9850, percentage: 64 },
    { device: "Mobile", users: 4620, percentage: 30 },
    { device: "Tablet", users: 950, percentage: 6 }
  ];

  const demographics = [
    { country: "United States", users: 6180, percentage: 40 },
    { country: "United Kingdom", users: 2470, percentage: 16 },
    { country: "Canada", users: 1850, percentage: 12 },
    { country: "Germany", users: 1390, percentage: 9 },
    { country: "Australia", users: 1080, percentage: 7 },
    { country: "Others", users: 2450, percentage: 16 }
  ];

  const trafficData = [
    { name: 'Jan', visitors: 4000, pageViews: 7400, uniqueVisitors: 2400 },
    { name: 'Feb', visitors: 3000, pageViews: 6398, uniqueVisitors: 2210 },
    { name: 'Mar', visitors: 2000, pageViews: 9800, uniqueVisitors: 2290 },
    { name: 'Apr', visitors: 2780, pageViews: 8908, uniqueVisitors: 2000 },
    { name: 'May', visitors: 1890, pageViews: 7800, uniqueVisitors: 2181 },
    { name: 'Jun', visitors: 2390, pageViews: 8300, uniqueVisitors: 2500 },
    { name: 'Jul', visitors: 3490, pageViews: 8300, uniqueVisitors: 2100 },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Comprehensive platform analytics and insights
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Analytics</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">{userAnalytics.totalUsers.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Total Users</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">+{userAnalytics.userGrowth}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">{contentAnalytics.totalViews.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Page Views</p>
                    </div>
                    <Eye className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">+15.2%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">${revenueAnalytics.totalRevenue.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">+{revenueAnalytics.revenueGrowth}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">{contentAnalytics.engagementRate}%</p>
                      <p className="text-xs text-muted-foreground">Engagement</p>
                    </div>
                    <MousePointer className="w-8 h-8 text-orange-600" />
                  </div>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">+8.1%</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts and Data */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Traffic Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Traffic Overview</CardTitle>
                  <CardDescription>Website traffic over the selected period</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trafficData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="visitors" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          name="Visitors"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="pageViews" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          name="Page Views"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="uniqueVisitors" 
                          stroke="#8b5cf6" 
                          strokeWidth={2}
                          name="Unique Visitors"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Top Content */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Content</CardTitle>
                  <CardDescription>Most viewed and engaging content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topContent.map((content, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{content.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {content.views.toLocaleString()} views
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">{content.engagement}%</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Traffic Sources and Device Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Traffic Sources</CardTitle>
                  <CardDescription>Where your visitors are coming from</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {trafficSources.map((source, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{source.source}</span>
                          <span>{source.visitors.toLocaleString()} ({source.percentage}%)</span>
                        </div>
                        <Progress value={source.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Device Breakdown</CardTitle>
                  <CardDescription>User device preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {deviceBreakdown.map((device, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {device.device === "Desktop" && <Monitor className="w-4 h-4" />}
                          {device.device === "Mobile" && <Smartphone className="w-4 h-4" />}
                          {device.device === "Tablet" && <Monitor className="w-4 h-4" />}
                          <span>{device.device}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{device.users.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">{device.percentage}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* User Analytics */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">{userAnalytics.newUsers.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">New Users</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">{userAnalytics.averageSessionTime}</p>
                      <p className="text-xs text-muted-foreground">Avg Session Time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingDown className="w-4 h-4 text-orange-600" />
                    <div>
                      <p className="text-2xl font-bold">{userAnalytics.bounceRate}%</p>
                      <p className="text-xs text-muted-foreground">Bounce Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
                <CardDescription>User distribution by country</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {demographics.map((country, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center space-x-2">
                          <Globe className="w-4 h-4" />
                          <span>{country.country}</span>
                        </span>
                        <span>{country.users.toLocaleString()} ({country.percentage}%)</span>
                      </div>
                      <Progress value={country.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Submission Analytics */}
          <TabsContent value="submissions" className="space-y-6">
            {/* Submission Click Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <MousePointer className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">
                        {JSON.parse(localStorage.getItem('submissionClickAnalytics') || '[]').length}
                      </p>
                      <p className="text-xs text-muted-foreground">Total Clicks</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">
                        {Object.keys(JSON.parse(localStorage.getItem('submissionClickAnalytics') || '[]').reduce((acc: any, click: any) => {
                          acc[click.country] = (acc[click.country] || 0) + 1;
                          return acc;
                        }, {})).length}
                      </p>
                      <p className="text-xs text-muted-foreground">Countries</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold">
                        {JSON.parse(localStorage.getItem('submissionClickAnalytics') || '[]').filter((click: any) => {
                          const clickDate = new Date(click.timestamp);
                          const today = new Date();
                          return clickDate.toDateString() === today.toDateString();
                        }).length}
                      </p>
                      <p className="text-xs text-muted-foreground">Today</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                    <div>
                      <p className="text-2xl font-bold">
                        {JSON.parse(localStorage.getItem('submissionClickAnalytics') || '[]').filter((click: any) => {
                          const clickDate = new Date(click.timestamp);
                          const weekAgo = new Date();
                          weekAgo.setDate(weekAgo.getDate() - 7);
                          return clickDate >= weekAgo;
                        }).length}
                      </p>
                      <p className="text-xs text-muted-foreground">This Week</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Submission Click Reports */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Submission Clicks by Country</CardTitle>
                  <CardDescription>Geographic distribution of submission button clicks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(
                      JSON.parse(localStorage.getItem('submissionClickAnalytics') || '[]').reduce((acc: any, click: any) => {
                        acc[click.country] = (acc[click.country] || 0) + 1;
                        return acc;
                      }, {})
                    ).sort(([,a], [,b]) => (b as number) - (a as number)).slice(0, 8).map(([country, count]) => (
                      <div key={country} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center space-x-2">
                            <Globe className="w-4 h-4" />
                            <span>{country}</span>
                          </span>
                          <span>{count as number} clicks</span>
                        </div>
                        <Progress value={Math.min((count as number) / Math.max(...Object.values(JSON.parse(localStorage.getItem('submissionClickAnalytics') || '[]').reduce((acc: any, click: any) => {
                          acc[click.country] = (acc[click.country] || 0) + 1;
                          return acc;
                        }, {})) as number[]) * 100, 100)} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Submission Clicks</CardTitle>
                  <CardDescription>Latest submission button activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {JSON.parse(localStorage.getItem('submissionClickAnalytics') || '[]').slice(-10).reverse().map((click: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center space-x-3">
                          <MousePointer className="w-4 h-4 text-blue-500" />
                          <div>
                            <p className="font-medium text-sm">{click.artistName}</p>
                            <p className="text-xs text-muted-foreground">
                              {click.country} • {click.genre}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            {new Date(click.timestamp).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(click.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {JSON.parse(localStorage.getItem('submissionClickAnalytics') || '[]').length === 0 && (
                      <div className="text-center py-8">
                        <MousePointer className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No submission clicks recorded yet</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Submission Analytics Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Submission Analytics Summary</CardTitle>
                <CardDescription>Comprehensive report on submission button performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {(JSON.parse(localStorage.getItem('submissionClickAnalytics') || '[]').length / 30).toFixed(1)}
                    </p>
                    <p className="text-sm text-muted-foreground">Avg Daily Clicks</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {JSON.parse(localStorage.getItem('submissionClickAnalytics') || '[]').reduce((acc: any, click: any) => {
                        if (!acc[click.genre]) acc[click.genre] = 0;
                        acc[click.genre]++;
                        return acc;
                      }, {})['Electronic'] || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Electronic Genre</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">
                      {Object.keys(JSON.parse(localStorage.getItem('submissionClickAnalytics') || '[]').reduce((acc: any, click: any) => {
                        acc[click.artistName] = true;
                        return acc;
                      }, {})).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Unique Artists</p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">
                      {(JSON.parse(localStorage.getItem('submissionClickAnalytics') || '[]').filter((click: any) => {
                        const clickDate = new Date(click.timestamp);
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return clickDate >= weekAgo;
                      }).length / 7).toFixed(1)}
                    </p>
                    <p className="text-sm text-muted-foreground">Weekly Trend</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;