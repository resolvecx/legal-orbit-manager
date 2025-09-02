import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Filter, 
  Mail, 
  MessageSquare, 
  MessageCircle,
  Phone, 
  MoreHorizontal,
  Paperclip,
  Send,
  ArrowLeft,
  Check,
  CheckCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Conversation {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  caseNumber: string;
  unread: boolean;
  channel: "Email" | "WhatsApp" | "Live Chat";
  status: "Active" | "Resolved";
}

interface Message {
  id: string;
  sender: "customer" | "agent";
  content: string;
  timestamp: string;
  channel: "Email" | "WhatsApp" | "Live Chat";
  status?: "sent" | "delivered" | "read";
}

interface RecentActivity {
  id: string;
  description: string;
  timestamp: string;
  type: "order" | "support" | "account";
}

interface PreviousCase {
  id: string;
  caseNumber: string;
  description: string;
  status: "Resolved" | "Closed";
  resolvedDate: string;
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    lastMessage: "Hi there! I placed an order yesterday (Order #12345) and I haven't received any tracking information yet. Can you help me check the status?",
    timestamp: "2m",
    priority: "Urgent",
    caseNumber: "#12345",
    unread: true,
    channel: "Email",
    status: "Active"
  },
  {
    id: "2", 
    name: "Michael Chen",
    email: "michael.chen@email.com",
    phone: "+1 (555) 234-5678",
    location: "New York, NY",
    lastMessage: "Thanks for the quick response! The issue is resolved now.",
    timestamp: "15m",
    priority: "Medium",
    caseNumber: "#12344",
    unread: false,
    channel: "WhatsApp",
    status: "Resolved"
  },
  {
    id: "3",
    name: "Emma Wilson",
    email: "emma.wilson@email.com", 
    phone: "+1 (555) 345-6789",
    location: "Los Angeles, CA",
    lastMessage: "Hi, I need help setting up my account preferences.",
    timestamp: "1h",
    priority: "Low",
    caseNumber: "#12343",
    unread: true,
    channel: "Live Chat",
    status: "Active"
  },
  {
    id: "4",
    name: "David Rodriguez",
    email: "david.rodriguez@email.com",
    phone: "+1 (555) 456-7890", 
    location: "Chicago, IL",
    lastMessage: "Billing inquiry - unexpected charge on my account.",
    timestamp: "3h",
    priority: "High",
    caseNumber: "#12342",
    unread: false,
    channel: "Email",
    status: "Active"
  }
];

const mockMessages: Message[] = [
  {
    id: "1",
    sender: "customer",
    content: "Hi there! I placed an order yesterday (Order #12345) and I haven't received any tracking information yet. Can you help me check the status?",
    timestamp: "Today at 2:45 PM",
    channel: "Email"
  },
  {
    id: "2", 
    sender: "agent",
    content: "Hello Sarah! I'd be happy to help you track your order. Let me look up the details for Order #12345.",
    timestamp: "Today at 2:47 PM",
    channel: "Email",
    status: "read"
  },
  {
    id: "3",
    sender: "agent", 
    content: "Good news! Your order has been shipped and is currently in transit. Here's your tracking number: 1Z999AA12345678901. You should receive it by tomorrow afternoon. You can track it directly on our shipping partner's website.",
    timestamp: "Today at 2:48 PM",
    channel: "Email",
    status: "delivered"
  },
  {
    id: "4",
    sender: "customer",
    content: "Perfect! Thank you so much for the quick response. I really appreciate your help!",
    timestamp: "Today at 2:50 PM", 
    channel: "Email"
  }
];

const mockRecentActivity: RecentActivity[] = [
  {
    id: "1",
    description: "Order #12345 placed",
    timestamp: "2 hours ago",
    type: "order"
  },
  {
    id: "2",
    description: "Support ticket resolved", 
    timestamp: "1 day ago",
    type: "support"
  },
  {
    id: "3",
    description: "Account updated",
    timestamp: "3 days ago", 
    type: "account"
  }
];

const mockPreviousCases: PreviousCase[] = [
  {
    id: "1",
    caseNumber: "#12344",
    description: "Payment issue",
    status: "Resolved",
    resolvedDate: "1 week ago"
  },
  {
    id: "2",
    caseNumber: "#12343", 
    description: "Account setup",
    status: "Resolved",
    resolvedDate: "2 weeks ago"
  }
];

const Inbox = () => {
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] = useState<Conversation>(mockConversations[0]);
  const [messageInput, setMessageInput] = useState("");
  const [activeChannel, setActiveChannel] = useState<"Email" | "WhatsApp" | "Live Chat">("Email");

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent": return "bg-red-100 text-red-800 border-red-200";
      case "High": return "bg-orange-100 text-orange-800 border-orange-200"; 
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "Email": return (
        <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
          <span>📧</span>
          <span>Email</span>
        </div>
      );
      case "WhatsApp": return (
        <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
          <span>💬</span>
          <span>WhatsApp</span>
        </div>
      );
      case "Live Chat": return (
        <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
          <span>🔵</span>
          <span>Live Chat</span>
        </div>
      );
      case "Facebook Messenger": return (
        <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
          <span>💬</span>
          <span>Messenger</span>
        </div>
      );
      default: return (
        <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
          <span>📧</span>
          <span>Email</span>
        </div>
      );
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "order": return "🛍️";
      case "support": return "✅"; 
      case "account": return "⚙️";
      default: return "📝";
    }
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Left Sidebar - Conversations */}
      <div className="w-80 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <ArrowLeft 
              className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-foreground" 
              onClick={() => navigate('/')}
            />
            <h2 className="text-lg font-semibold">Inbox</h2>  
            <Filter className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search conversations..." 
              className="pl-10 bg-background"
            />
          </div>
          <div className="flex gap-2 mt-3">
            <Button variant="default" size="sm" className="text-xs">All</Button>
            <Button variant="outline" size="sm" className="text-xs">Unread</Button>
            <Button variant="outline" size="sm" className="text-xs">Urgent</Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {mockConversations.map((conversation) => (
            <div 
              key={conversation.id}
              className={`p-4 border-b border-border cursor-pointer hover:bg-accent/50 ${
                selectedConversation.id === conversation.id ? 'bg-accent' : ''
              }`}
              onClick={() => setSelectedConversation(conversation)}
            >
              <div className="flex items-start gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={conversation.avatar} />
                  <AvatarFallback>{conversation.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>  
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-sm truncate">{conversation.name}</h3>
                    <div className="flex items-center gap-1">
                      {conversation.unread && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                      <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {conversation.lastMessage}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`text-xs px-2 py-0 ${getPriorityColor(conversation.priority)}`}>
                        {conversation.priority}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{conversation.caseNumber}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {getChannelIcon(conversation.channel)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-border bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={selectedConversation.avatar} />
                <AvatarFallback>{selectedConversation.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{selectedConversation.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{selectedConversation.email}</span>
                  <Badge variant="outline" className="text-xs px-2">
                    {getChannelIcon(selectedConversation.channel)}
                    <span className="ml-1">{selectedConversation.channel}</span>
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">Assign</Button>
              <Button variant="default" size="sm">Close</Button>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {mockMessages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] ${
                message.sender === 'agent' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              } rounded-lg p-3`}>
                <p className="text-sm">{message.content}</p>
                <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                  <span>{message.timestamp}</span>
                  {message.sender === 'agent' && message.status && (
                    <div className="flex items-center gap-1">
                      <span>via {message.channel}</span>
                      {message.status === 'read' && <CheckCheck className="w-3 h-3" />}
                      {message.status === 'delivered' && <Check className="w-3 h-3" />}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex items-center gap-2 mb-3">
            <Button 
              variant={activeChannel === "Email" ? "default" : "outline"} 
              size="sm"
              onClick={() => setActiveChannel("Email")}
            >
              <Mail className="w-3 h-3 mr-1" />
              Email
            </Button>
            <Button 
              variant={activeChannel === "WhatsApp" ? "default" : "outline"} 
              size="sm"
              onClick={() => setActiveChannel("WhatsApp")}
            >
              <MessageSquare className="w-3 h-3 mr-1" />
              WhatsApp
            </Button>
            <Button 
              variant={activeChannel === "Live Chat" ? "default" : "outline"} 
              size="sm"
              onClick={() => setActiveChannel("Live Chat")}
            >
              <MessageSquare className="w-3 h-3 mr-1" />
              Live Chat
            </Button>
          </div>
          <div className="flex items-end gap-2">
            <div className="flex-1 border border-border rounded-lg p-3">
              <Input
                placeholder="Type your message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="border-0 p-0 focus-visible:ring-0"
              />
            </div>
            <Button variant="ghost" size="sm">
              <Paperclip className="w-4 h-4" />
            </Button>
            <div className="flex gap-1">
              <Button size="sm" className="px-3">Save Draft</Button>
              <Button size="sm" className="px-3">
                <Send className="w-4 h-4 mr-1" />
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Customer Info */}
      <div className="w-80 border-l border-border bg-card overflow-y-auto">
        <div className="p-4">
          <h3 className="font-semibold mb-4">Customer Information</h3>
          
          {/* Contact Info */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <h4 className="font-medium mb-3">Contact</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedConversation.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedConversation.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 text-center">📍</span>
                  <span>{selectedConversation.location}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <h4 className="font-medium mb-3">Recent Activity</h4>
              <div className="space-y-3">
                {mockRecentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <span className="text-sm">{getActivityIcon(activity.type)}</span>
                    <div className="flex-1">
                      <p className="text-sm">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Previous Cases */}
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-3">Previous Cases</h4>
              <div className="space-y-3">
                {mockPreviousCases.map((case_item) => (
                  <div key={case_item.id} className="border border-border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{case_item.caseNumber}</span>
                      <Badge variant="outline" className="text-xs">
                        {case_item.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{case_item.description}</p>
                    <p className="text-xs text-muted-foreground">{case_item.status} • {case_item.resolvedDate}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Inbox;