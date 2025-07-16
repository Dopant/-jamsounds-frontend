import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  FileText, 
  DollarSign, 
  Music,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Eye,
  Settings,
  RefreshCw,
  BarChart3,
  Calendar,
  Star
} from "lucide-react";

const AdminDashboard = () => {
  const [realTimeData, setRealTimeData] = useState({
    onlineUsers: 247,
    newSubmissions: 12,
    pendingReviews: 8,
    activeStreams: 89
  });

  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        onlineUsers: prev.onlineUsers + Math.floor(Math.random() * 10) - 5,
        newSubmissions: prev.newSubmissions + Math.floor(Math.random() * 3),
        pendingReviews: Math.max(0, prev.pendingReviews + Math.floor(Math.random() * 3) - 1),
        activeStreams: prev.activeStreams + Math.floor(Math.random() * 20) - 10
      }));
      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const kpiCards = [
    {
      title: "User Growth",
      value: "3,421",
      change: "+23%",
      trend: "up",
      period: "new users",
      icon: Users,
      color: "text-pink-600"
    },
    {
      title: "Online Users",
      value: realTimeData.onlineUsers.toString(),
      change: "Live",
      trend: "neutral",
      period: "right now",
      icon: Eye,
      color: "text-indigo-600"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: "submission",
      message: "New track submitted by Arctic Waves",
      time: "2 minutes ago",
      status: "new",
      icon: Music
    },
    {
      id: 2,
      type: "review",
      message: "Review completed for 'Digital Dreams'",
      time: "5 minutes ago",
      status: "completed",
      icon: CheckCircle
    },
    {
      id: 3,
      type: "user",
      message: "New curator Sarah Johnson registered",
      time: "12 minutes ago",
      status: "new",
      icon: Users
    },
    {
      id: 4,
      type: "payment",
      message: "Payment of $199 received from indie artist",
      time: "18 minutes ago",
      status: "completed",
      icon: DollarSign
    },
    {
      id: 5,
      type: "alert",
      message: "High traffic detected - auto-scaling active",
      time: "25 minutes ago",
      status: "warning",
      icon: AlertCircle
    }
  ];

  const quickActions = [
    { label: "Review Pending Submissions", href: "/admin/submissions", count: 8, color: "bg-orange-100 text-orange-800" },
    { label: "Approve New Curators", href: "/admin/curators", count: 3, color: "bg-blue-100 text-blue-800" },
    { label: "Manage Featured Content", href: "/admin/content", count: 5, color: "bg-green-100 text-green-800" },
    { label: "System Settings", href: "/admin/settings", count: 2, color: "bg-purple-100 text-purple-800" }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with JAM JOURNAL SOUND today.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              System Healthy
            </Badge>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Real-time Stats Bar */}
        <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{realTimeData.onlineUsers}</p>
                <p className="text-xs text-muted-foreground">Online Users</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{realTimeData.newSubmissions}</p>
                <p className="text-xs text-muted-foreground">New Today</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{realTimeData.pendingReviews}</p>
                <p className="text-xs text-muted-foreground">Pending Reviews</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{realTimeData.activeStreams}</p>
                <p className="text-xs text-muted-foreground">Active Streams</p>
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kpiCards.map((kpi, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {kpi.trend === "up" && <TrendingUp className="w-3 h-3 mr-1 text-green-500" />}
                  {kpi.trend === "down" && <TrendingDown className="w-3 h-3 mr-1 text-red-500" />}
                  <span className={kpi.trend === "up" ? "text-green-600" : kpi.trend === "down" ? "text-red-600" : ""}>
                    {kpi.change}
                  </span>
                  <span className="ml-1">{kpi.period}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Recent Activity
              </CardTitle>
              <CardDescription>Real-time platform updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className={`p-2 rounded-full ${
                      activity.status === 'new' ? 'bg-blue-100 text-blue-600' :
                      activity.status === 'completed' ? 'bg-green-100 text-green-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      <activity.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    <Badge variant={
                      activity.status === 'new' ? 'default' :
                      activity.status === 'completed' ? 'secondary' :
                      'destructive'
                    } className="text-xs">
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;