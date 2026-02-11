import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { GoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"employee" | "admin">("employee");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, googleSignIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      setLoading(true);
      const result = await googleSignIn(credentialResponse.credential);
      setLoading(false);
      if (result.success) {
        toast({ title: "Signed in with Google!" });
        setTimeout(() => navigate("/", { replace: true }), 0);
      } else {
        toast({ title: "Error", description: result.error ?? "Google sign in failed", variant: "destructive" });
      }
    }
  };

  const handleGoogleError = () => {
    toast({ title: "Error", description: "Google Sign In Failed", variant: "destructive" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = isLogin
      ? await signIn(email, password)
      : await signUp(fullName.trim(), email, password, role);
    setLoading(false);
    if (result.success) {
      toast({ title: isLogin ? "Signed in!" : "Account created!" });
      // Small delay so auth state is committed before navigation
      setTimeout(() => navigate("/", { replace: true }), 0);
    } else {
      toast({ title: "Error", description: result.error ?? "Something went wrong", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="w-full py-6 px-6 md:px-12 animate-in-fade">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-foreground" />
          <span className="text-lg font-semibold tracking-tight">HR Harmony</span>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-10 animate-in-slide-up">
          <div className="space-y-3 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              {isLogin ? "Sign in to your account" : "Create your account"}
            </h1>
            <p className="text-muted-foreground">
              Leave and attendance management for modern teams.
            </p>
          </div>

          <Card className="border-border/60 shadow-soft rounded-2xl overflow-hidden transition-shadow duration-300 hover:shadow-soft-lg">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl font-semibold">{isLogin ? "Welcome back" : "Sign up"}</CardTitle>
              <CardDescription>
                {isLogin ? "Enter your credentials to continue" : "Fill in your details to create an account"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        required={!isLogin}
                        className="rounded-xl border-border/80 bg-background h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-sm font-medium">Account Type</Label>
                      <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value as "employee" | "admin")}
                        className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      >
                        <option value="employee">Employee</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    className="rounded-xl border-border/80 bg-background h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="rounded-xl border-border/80 bg-background h-11"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-11 rounded-xl font-medium bg-foreground hover:bg-foreground/90 text-background"
                  disabled={loading}
                >
                  {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
                </Button>
              </form>

              <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/50" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
              </div>

              <div className="flex justify-center w-full">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    theme="filled_black"
                    shape="pill"
                    width="300" 
                  />
              </div>

              <div className="pt-3 border-t border-border/50 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                </span>
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-medium text-foreground hover:underline"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </div>
              
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
