
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Users, 
  Clock, 
  CheckCircle,
  TrendingUp,
  AlertCircle
} from "lucide-react";

export function StatsCards() {
  const stats = [
    {
      title: "Total Cases",
      value: "2,350",
      change: "+180",
      icon: FileText,
      trend: "up"
    },
    {
      title: "Active Cases",
      value: "1,234",
      change: "+32",
      icon: Clock,
      trend: "up"
    },
    {
      title: "Completed",
      value: "987",
      change: "+12",
      icon: CheckCircle,
      trend: "up"
    },
    {
      title: "Urgent",
      value: "23",
      change: "-5",
      icon: AlertCircle,
      trend: "down"
    },
    {
      title: "Clients",
      value: "856",
      change: "+24",
      icon: Users,
      trend: "up"
    },
    {
      title: "This Month",
      value: "45",
      change: "+8",
      icon: TrendingUp,
      trend: "up"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
      {stats.map((stat, index) => (
        <Card key={index} className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className={`text-xs ${
              stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
