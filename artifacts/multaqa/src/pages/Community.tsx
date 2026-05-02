import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { UserLayout } from "@/components/UserLayout";
import { useAppContext } from "@/context/AppContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Users, User, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function Community() {
  const [, setLocation] = useLocation();
  const { currentUser, members, setMembers, currentLocation, setCurrentLocation } = useAppContext();
  
  useEffect(() => {
    if (!currentUser) {
      setLocation("/login");
    }
  }, [currentUser, setLocation]);

  if (!currentUser) return null;

  const currentMember = members.find(m => m.id === currentUser.id);
  // Default to non-anonymous if not currently in member list
  const [isAnonymous, setIsAnonymous] = useState(currentMember ? currentMember.isAnonymous : false);

  const handleToggleAnonymous = (checked: boolean) => {
    setIsAnonymous(checked);
    // In a real app we'd update the backend. Here we update the local state if they are in the list.
    if (currentMember) {
      setMembers(prev => 
        prev.map(m => m.id === currentUser.id ? { ...m, isAnonymous: checked } : m)
      );
    }
  };

  const locationMembers = members.filter(m => m.location === currentLocation);

  return (
    <UserLayout>
      <div className="bg-secondary text-white py-12">
        <div className="container mx-auto px-6 max-w-5xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Who's In The Space</h1>
            <p className="text-white/70">Connect with other professionals currently working at Multaqa.</p>
          </div>
          
          <div className="bg-white/10 p-1 rounded-lg border border-white/20 inline-flex shrink-0">
            <button 
              onClick={() => setCurrentLocation("Nablus")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${currentLocation === "Nablus" ? "bg-white text-secondary shadow-sm" : "text-white/70 hover:text-white"}`}
            >
              Nablus
            </button>
            <button 
              onClick={() => setCurrentLocation("Ramallah")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${currentLocation === "Ramallah" ? "bg-white text-secondary shadow-sm" : "text-white/70 hover:text-white"}`}
            >
              Ramallah
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-5xl flex-1">
        
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-xl border border-border shadow-sm mb-10 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-primary">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-secondary text-xl">{locationMembers.length} members</p>
              <p className="text-sm text-muted-foreground">in {currentLocation} today, {format(new Date(), "MMMM d")}</p>
            </div>
          </div>
          
          <div className="h-px w-full sm:w-px sm:h-12 bg-border"></div>
          
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="flex-1 sm:flex-none">
              <Label htmlFor="anonymous-mode" className="font-medium text-secondary text-base">Privacy Mode</Label>
              <p className="text-xs text-muted-foreground">Show as "Anonymous" to others</p>
            </div>
            <Switch 
              id="anonymous-mode" 
              checked={isAnonymous}
              onCheckedChange={handleToggleAnonymous}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {locationMembers.map((member, idx) => (
            <motion.div 
              key={idx} // Using idx as fallback since we might have multiple anonymous with same id in mock data
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="bg-white rounded-xl border border-border p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow"
            >
              <div className={`w-20 h-20 rounded-full mb-4 flex items-center justify-center text-2xl font-bold ${
                member.isAnonymous 
                  ? "bg-muted text-muted-foreground" 
                  : "bg-[#E8EBFF] text-secondary border border-[#001279]/10"
              }`}>
                {member.isAnonymous ? <Shield className="w-8 h-8 opacity-50" /> : member.name.charAt(0)}
              </div>
              
              <h3 className={`font-bold text-lg mb-1 ${member.isAnonymous ? "text-muted-foreground italic" : "text-secondary"}`}>
                {member.isAnonymous ? "Anonymous Member" : member.name}
                {member.id === currentUser.id && <span className="ml-2 text-xs font-normal bg-accent text-primary px-2 py-0.5 rounded-full not-italic">You</span>}
              </h3>
              
              {!member.isAnonymous && member.role && (
                <p className="text-sm text-muted-foreground">{member.role}</p>
              )}
              
              {!member.isAnonymous && (
                <Button variant="ghost" size="sm" className="mt-4 text-primary hover:text-primary hover:bg-accent">
                  Say Hi
                </Button>
              )}
            </motion.div>
          ))}
        </div>
        
        {locationMembers.length === 0 && (
          <div className="text-center py-20">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-secondary mb-2">It's quiet here today</h3>
            <p className="text-muted-foreground">Be the first to check in to {currentLocation}!</p>
          </div>
        )}

      </div>
    </UserLayout>
  );
}
