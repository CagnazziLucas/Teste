import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ChefHat, Mail, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "Credenciais inválidas",
            description: "Email ou senha incorretos. Se você acabou de se cadastrar, pode ser necessário confirmar seu email.",
            variant: "destructive",
          });
        } else if (error.message.includes("Email not confirmed")) {
          toast({
            title: "Email não confirmado",
            description: "Verifique seu email e clique no link de confirmação.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erro no login",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao seu cardápio digital.",
        });
        navigate("/menu");
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-primary to-accent p-4 rounded-full">
              <ChefHat className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Cardápio Digital</h1>
          <p className="text-muted-foreground">Faça login para acessar o menu</p>
        </div>

        <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Entrar</CardTitle>
            <CardDescription className="text-center">
              Digite suas credenciais para acessar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Não tem uma conta?{" "}
                <Link 
                  to="/register" 
                  className="text-primary hover:underline font-medium"
                >
                  Criar conta
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;