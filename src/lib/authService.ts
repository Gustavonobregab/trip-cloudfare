import { supabase } from './supabaseClient';

export async function sendOtpToEmail(email: string) {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });
  
    return error;
  }


export async function verifyOtpCode(email: string, token: string) {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });
    return error;
  }