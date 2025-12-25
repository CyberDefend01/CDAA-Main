import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Search, Users, Shield, User, Crown, UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Database } from "@/integrations/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type UserRole = Database["public"]["Tables"]["user_roles"]["Row"];
type AppRole = Database["public"]["Enums"]["app_role"];

interface UserWithRole extends Profile {
  role: AppRole;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [addingUser, setAddingUser] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "student" as AppRole,
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch roles
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");

      if (rolesError) throw rolesError;

      // Combine profiles with roles
      const usersWithRoles: UserWithRole[] = (profiles || []).map(profile => {
        const userRole = roles?.find(r => r.user_id === profile.user_id);
        return {
          ...profile,
          role: userRole?.role || "user",
        };
      });

      setUsers(usersWithRoles);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateUserRole = async (userId: string, newRole: AppRole) => {
    const { error } = await supabase
      .from("user_roles")
      .update({ role: newRole })
      .eq("user_id", userId);

    if (error) {
      toast.error("Failed to update user role");
      console.error(error);
    } else {
      toast.success("User role updated successfully");
      fetchUsers();
    }
  };

  const handleAddUser = async () => {
    if (!newUser.email || !newUser.password || !newUser.fullName) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (newUser.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setAddingUser(true);
    try {
      // Create user via Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: newUser.fullName,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // Update the role if different from default (student)
        if (newUser.role !== "student") {
          const { error: roleError } = await supabase
            .from("user_roles")
            .update({ role: newUser.role })
            .eq("user_id", authData.user.id);

          if (roleError) {
            console.error("Error updating role:", roleError);
          }
        }

        toast.success(`User ${newUser.fullName} created successfully`);
        setIsAddUserOpen(false);
        setNewUser({ email: "", password: "", fullName: "", role: "student" });
        
        // Wait a moment for the trigger to create the profile, then refresh
        setTimeout(() => fetchUsers(), 1000);
      }
    } catch (error: any) {
      const msg = error.message?.toLowerCase().includes("already")
        ? "This email is already registered"
        : error.message || "Failed to create user";
      toast.error(msg);
    } finally {
      setAddingUser(false);
    }
  };

  const filteredUsers = users.filter(user =>
    (user.full_name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (user.country?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  const roleIcons: Record<AppRole, React.ElementType> = {
    admin: Crown,
    moderator: Shield,
    instructor: User,
    student: User,
    user: User,
  };

  const roleColors: Record<AppRole, string> = {
    admin: "bg-primary/10 text-primary border-primary/20",
    moderator: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    instructor: "bg-violet-500/10 text-violet-500 border-violet-500/20",
    student: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    user: "bg-muted text-muted-foreground border-border",
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Users</h1>
            <p className="text-muted-foreground mt-1">Manage user accounts and roles</p>
          </div>
          
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-cyan hover:from-primary/90 hover:to-cyan/90">
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account with a specific role.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="new-user-name">Full Name *</Label>
                  <Input
                    id="new-user-name"
                    placeholder="John Doe"
                    value={newUser.fullName}
                    onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-user-email">Email *</Label>
                  <Input
                    id="new-user-email"
                    type="email"
                    placeholder="john@example.com"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-user-password">Password *</Label>
                  <Input
                    id="new-user-password"
                    type="password"
                    placeholder="Min. 6 characters"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-user-role">Role</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value: AppRole) => setNewUser({ ...newUser, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="instructor">Instructor</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddUser} 
                  disabled={addingUser}
                  className="bg-gradient-to-r from-primary to-cyan"
                >
                  {addingUser && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Create User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{users.length}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Crown className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {users.filter(u => u.role === "admin").length}
                </p>
                <p className="text-sm text-muted-foreground">Admins</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {users.filter(u => u.role === "moderator").length}
                </p>
                <p className="text-sm text-muted-foreground">Moderators</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="border-border/50">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name or country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                All Users ({filteredUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">Loading users...</div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">No users found</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border/50">
                        <TableHead>User</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Change Role</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => {
                        const RoleIcon = roleIcons[user.role];
                        return (
                          <TableRow key={user.id} className="border-border/50">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10">
                                  <AvatarImage src={user.avatar_url || undefined} />
                                  <AvatarFallback className="bg-primary/10 text-primary">
                                    {getInitials(user.full_name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-foreground">
                                    {user.full_name || "Unnamed User"}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    ID: {user.user_id.slice(0, 8)}...
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-foreground">{user.country || "—"}</span>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={roleColors[user.role]}>
                                <RoleIcon className="w-3 h-3 mr-1" />
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className="text-muted-foreground">
                                {new Date(user.created_at).toLocaleDateString()}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Select
                                value={user.role}
                                onValueChange={(value: AppRole) => updateUserRole(user.user_id, value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="user">User</SelectItem>
                                  <SelectItem value="student">Student</SelectItem>
                                  <SelectItem value="instructor">Instructor</SelectItem>
                                  <SelectItem value="moderator">Moderator</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
