/**
 * Composable for managing user authentication and session
 */

import { ref, computed, onMounted } from 'vue'
import type { ApiUser } from '../services/api'

const currentUser = ref<ApiUser | null>(null)

export function useAuth() {
  /**
   * Get user data from cookie
   */
  const getUserFromCookie = (): ApiUser | null => {
    try {
      const cookies = document.cookie.split(';')
      const userCookie = cookies.find((cookie) => cookie.trim().startsWith('user='))

      if (userCookie) {
        const userJson = userCookie.split('=')[1]
        return JSON.parse(decodeURIComponent(userJson))
      }
    } catch (error) {
      console.error('Error parsing user cookie:', error)
    }
    return null
  }

  /**
   * Save user data to cookie
   */
  const saveUserToCookie = (user: ApiUser) => {
    try {
      const userJson = JSON.stringify(user)
      document.cookie = `user=${encodeURIComponent(userJson)}; path=/; max-age=${7 * 24 * 60 * 60}` // 7 days
      currentUser.value = user
    } catch (error) {
      console.error('Error saving user cookie:', error)
    }
  }

  /**
   * Clear user session
   */
  const logout = () => {
    document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    currentUser.value = null
  }

  /**
   * Check if user is logged in
   */
  const isLoggedIn = computed(() => currentUser.value !== null)

  /**
   * Get current user's display name
   */
  const userDisplayName = computed(() => currentUser.value?.display_name || 'Гость')

  /**
   * Get current user's ID
   */
  const userId = computed(() => currentUser.value?.id || null)

  /**
   * Initialize user session from cookie on mount
   */
  const initializeAuth = () => {
    const user = getUserFromCookie()
    if (user) {
      currentUser.value = user
    }
  }

  // Auto-initialize on mount
  onMounted(() => {
    initializeAuth()
  })

  return {
    // State
    currentUser,
    isLoggedIn,
    userDisplayName,
    userId,

    // Actions
    saveUserToCookie,
    logout,
    initializeAuth,
    getUserFromCookie,
  }
}
