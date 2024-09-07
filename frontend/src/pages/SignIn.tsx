import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Card, CardContent } from "@/components/ui/card"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useNavigate } from 'react-router-dom';


type FormData = {
  email: string
  password: string
}


const supabase: SupabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);


export default function Signin() {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const navigate = useNavigate();


 
  const onSubmit = async (data: FormData) => {
    const { error } = await supabase.auth.signInWithPassword(data);
    if (error) console.error('Error signing in:', error.message);
    else {
      console.log('Sign in successfully');
      navigate('/home');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <Card className="w-full max-w-md bg-white shadow-lg">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-green-600">Repro</h1>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input 
                type="email" 
                placeholder="Email Address" 
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Invalid email address"
                  }
                })}
                className={`w-full border-gray-300 ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <div className="relative">
              <Input 
                type={showPassword ? "text" : "password"}
                placeholder="Password" 
                {...register("password", { 
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters"
                  }
                })}
                className={`w-full border-gray-300 ${errors.password ? 'border-red-500' : ''}`}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-4 w-4 text-gray-500" />
                ) : (
                  <EyeIcon className="h-4 w-4 text-gray-500" />
                )}
              </button>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>
            <div className="text-right">
              <a 
                href="#" 
                className="text-sm text-green-600 hover:text-green-700"
              >
                Forgot password?
              </a>
            </div>
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
              LOG IN
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-500">
            <span className="px-2 bg-white relative z-10">or</span>
            <hr className="border-gray-300 mt-[-0.7em]" />
          </div>
          <Button 
            variant="outline" 
            className="w-full mt-4 border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </Button>
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Don't have an account yet? </span>
            <a href="#" className="text-green-600 hover:text-green-700 font-semibold">
              CREATE ONE NOW
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}