import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Login dengan Google OAuth menggunakan Supabase
 * @returns {Promise<void>}
 */
export const loginWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`, // Redirect setelah login sukses
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) throw error
    
    // User akan diarahkan ke halaman login Google
    // Setelah sukses, akan redirect ke dashboard
    return data
  } catch (error) {
    console.error('Google login error:', error)
    throw error
  }
}

/**
 * Daftar akun baru dengan Google OAuth
 * Sama seperti login, tapi untuk user baru
 * @returns {Promise<void>}
 */
export const signUpWithGoogle = async () => {
  // Supabase menangani login/signup secara otomatis berdasarkan email
  // Jika email belum ada, akan dibuat akun baru
  return loginWithGoogle()
}

/**
 * Logout user
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    console.error('Logout error:', error)
    throw error
  }
}

/**
 * Dapatkan user yang sedang login
 * @returns {Promise<User|null>}
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

/**
 * Listen untuk perubahan auth state
 * @param {Function} callback - Fungsi yang dipanggil saat auth state berubah
 * @returns {Object} Subscription object
 */
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session)
  })
}
