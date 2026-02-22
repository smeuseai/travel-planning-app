import { supabase } from '../lib/supabase';
import { LikedPlace } from '../types';

/**
 * Add a place to user's liked places
 */
export async function addLike(placeId: string, city: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('likes')
    .insert({
      place_id: placeId,
      user_id: userId,
      city,
    });

  if (error) {
    console.error('Error adding like:', error);
    throw error;
  }
}

/**
 * Remove a place from user's liked places
 */
export async function removeLike(likeId: string): Promise<void> {
  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('id', likeId);

  if (error) {
    console.error('Error removing like:', error);
    throw error;
  }
}

/**
 * Get all liked places for a user in a specific city
 */
export async function getLikesByCity(userId: string, city: string): Promise<LikedPlace[]> {
  const { data, error } = await supabase
    .from('likes')
    .select('*')
    .eq('user_id', userId)
    .eq('city', city)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching likes:', error);
    throw error;
  }

  return data || [];
}

/**
 * Check if a place is already liked by the user
 */
export async function isPlaceLiked(placeId: string, userId: string, city: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('likes')
    .select('id')
    .eq('place_id', placeId)
    .eq('user_id', userId)
    .eq('city', city)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error checking like status:', error);
    return false;
  }

  return !!data;
}
