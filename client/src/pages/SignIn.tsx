import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';

// Validation schemas
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  terms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function SignIn() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  const { currentUser, signIn, signUp, signInWithGoogle } = useAuth();
  
  // Redireccionar si el usuario ya está autenticado
  useEffect(() => {
    if (currentUser) {
      setLocation('/dashboard');
    }
  }, [currentUser, setLocation]);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      // Usar la función de autenticación de Firebase
      const user = await signIn(data.username, data.password);
      
      if (user) {
        toast({
          title: "Sesión iniciada",
          description: "¡Bienvenido de nuevo a JetAI!",
        });
        setLocation('/dashboard');
      } else {
        throw new Error("Error al iniciar sesión");
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Error de inicio de sesión",
        description: error.message || "Usuario o contraseña inválidos. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      // Usar la función de registro de Firebase
      const user = await signUp(data.email, data.password);
      
      if (user) {
        // También podríamos actualizar el perfil con el nombre de usuario aquí
        // await updateProfile(user, { displayName: data.username });
        
        toast({
          title: "Registro exitoso",
          description: "Tu cuenta ha sido creada. Bienvenido a JetAI.",
        });
        
        // Redirigir al dashboard después de registrarse exitosamente
        setLocation('/dashboard');
      } else {
        throw new Error("Error al crear la cuenta");
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Error de registro",
        description: error.message || "Este correo electrónico ya puede estar en uso.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 text-center font-accent font-medium transition ${
                isLogin ? 'bg-primary text-white' : 'bg-white text-dark/70 hover:bg-gray-50'
              }`}
              onClick={() => setIsLogin(true)}
            >
              Sign In
            </button>
            <button
              className={`flex-1 py-4 text-center font-accent font-medium transition ${
                !isLogin ? 'bg-primary text-white' : 'bg-white text-dark/70 hover:bg-gray-50'
              }`}
              onClick={() => setIsLogin(false)}
            >
              Create Account
            </button>
          </div>

          <div className="p-8">
            {isLogin ? (
              /* Login Form */
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
                <h2 className="font-display text-2xl font-bold text-dark mb-6 text-center">Welcome Back</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="login-username" className="block text-sm font-medium text-dark/70 mb-1">
                      Username
                    </label>
                    <input
                      id="login-username"
                      type="text"
                      {...loginForm.register('username')}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
                      placeholder="Your username"
                    />
                    {loginForm.formState.errors.username && (
                      <p className="mt-1 text-sm text-red-600">{loginForm.formState.errors.username.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="login-password" className="block text-sm font-medium text-dark/70 mb-1">
                      Password
                    </label>
                    <input
                      id="login-password"
                      type="password"
                      {...loginForm.register('password')}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
                      placeholder="Your password"
                    />
                    {loginForm.formState.errors.password && (
                      <p className="mt-1 text-sm text-red-600">{loginForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        type="checkbox"
                        {...loginForm.register('rememberMe')}
                        className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-dark/70">
                        Remember me
                      </label>
                    </div>
                    <div className="text-sm">
                      <a href="#" className="text-primary hover:text-primary/80 font-medium">
                        Forgot password?
                      </a>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full bg-primary hover:bg-primary/90 text-white font-accent font-semibold px-6 py-3 rounded-full transition ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <i className="fas fa-spinner fa-spin mr-2"></i> Signing in...
                      </span>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </div>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-dark/50">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setIsLoading(true);
                        signInWithGoogle()
                          .then(() => {
                            toast({
                              title: "Sesión iniciada con Google",
                              description: "¡Bienvenido a JetAI!",
                            });
                            setLocation('/dashboard');
                          })
                          .catch((error: any) => {
                            toast({
                              title: "Error de inicio de sesión",
                              description: error.message || "No pudimos iniciar sesión con Google",
                              variant: "destructive",
                            });
                          })
                          .finally(() => setIsLoading(false));
                      }}
                      disabled={isLoading}
                      className="py-2.5 px-4 rounded-lg border border-gray-200 flex justify-center items-center text-dark hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="fab fa-google text-red-500 mr-2"></i>
                      Google
                    </button>
                    <button
                      type="button"
                      disabled
                      className="py-2.5 px-4 rounded-lg border border-gray-200 flex justify-center items-center text-dark hover:bg-gray-50 transition opacity-50 cursor-not-allowed"
                    >
                      <i className="fab fa-facebook text-blue-600 mr-2"></i>
                      Facebook
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              /* Register Form */
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
                <h2 className="font-display text-2xl font-bold text-dark mb-6 text-center">Create Your Account</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="register-username" className="block text-sm font-medium text-dark/70 mb-1">
                      Username
                    </label>
                    <input
                      id="register-username"
                      type="text"
                      {...registerForm.register('username')}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
                      placeholder="Choose a username"
                    />
                    {registerForm.formState.errors.username && (
                      <p className="mt-1 text-sm text-red-600">{registerForm.formState.errors.username.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="register-email" className="block text-sm font-medium text-dark/70 mb-1">
                      Email
                    </label>
                    <input
                      id="register-email"
                      type="email"
                      {...registerForm.register('email')}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
                      placeholder="Your email address"
                    />
                    {registerForm.formState.errors.email && (
                      <p className="mt-1 text-sm text-red-600">{registerForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="register-password" className="block text-sm font-medium text-dark/70 mb-1">
                      Password
                    </label>
                    <input
                      id="register-password"
                      type="password"
                      {...registerForm.register('password')}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
                      placeholder="Create a password"
                    />
                    {registerForm.formState.errors.password && (
                      <p className="mt-1 text-sm text-red-600">{registerForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="register-confirm-password" className="block text-sm font-medium text-dark/70 mb-1">
                      Confirm Password
                    </label>
                    <input
                      id="register-confirm-password"
                      type="password"
                      {...registerForm.register('confirmPassword')}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
                      placeholder="Confirm your password"
                    />
                    {registerForm.formState.errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{registerForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <div className="flex items-center">
                    <input
                      id="terms"
                      type="checkbox"
                      {...registerForm.register('terms')}
                      className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-dark/70">
                      I agree to the <a href="#" className="text-primary hover:text-primary/80">Terms of Service</a> and <a href="#" className="text-primary hover:text-primary/80">Privacy Policy</a>
                    </label>
                  </div>
                  {registerForm.formState.errors.terms && (
                    <p className="text-sm text-red-600">{registerForm.formState.errors.terms.message}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full bg-primary hover:bg-primary/90 text-white font-accent font-semibold px-6 py-3 rounded-full transition ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <i className="fas fa-spinner fa-spin mr-2"></i> Creating account...
                      </span>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </div>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-dark/50">Or sign up with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setIsLoading(true);
                        signInWithGoogle()
                          .then(() => {
                            toast({
                              title: "Cuenta creada con Google",
                              description: "¡Bienvenido a JetAI!",
                            });
                            setLocation('/dashboard');
                          })
                          .catch((error: any) => {
                            toast({
                              title: "Error al registrarse con Google",
                              description: error.message || "No pudimos crear tu cuenta con Google",
                              variant: "destructive",
                            });
                          })
                          .finally(() => setIsLoading(false));
                      }}
                      disabled={isLoading}
                      className="py-2.5 px-4 rounded-lg border border-gray-200 flex justify-center items-center text-dark hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="fab fa-google text-red-500 mr-2"></i>
                      Google
                    </button>
                    <button
                      type="button"
                      disabled
                      className="py-2.5 px-4 rounded-lg border border-gray-200 flex justify-center items-center text-dark hover:bg-gray-50 transition opacity-50 cursor-not-allowed"
                    >
                      <i className="fab fa-facebook text-blue-600 mr-2"></i>
                      Facebook
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}