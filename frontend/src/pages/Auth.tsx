import React from 'react';
import { useForm } from 'react-hook-form';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

const supabase: SupabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

type FormData = {
  email: string;
  password: string;
};

export const Auth: React.FC = () => {
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
  // const onSubmit = async (data: FormData) => {
  //   const { error } = await supabase.auth.signUp({
  //     email: data.email,
  //     password: data.password,
  //   });
  //   if (error) console.error('Error signing up:', error.message);
  //   else {
  //     console.log('Signed Up successfully');
  //     navigate('/home');
  //   }
  // };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error.message);
    else {
      console.log('Signed out successfully');
      navigate('/');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("email", { required: "Email is required" })}
          type="email"
          placeholder="Email"
        />
        {errors.email && <span>{errors.email.message}</span>}
        
        <input
          {...register("password", { required: "Password is required" })}
          type="password"
          placeholder="Password"
        />
        {errors.password && <span>{errors.password.message}</span>}
        
        <button type="submit">Sign in</button>
      </form>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};