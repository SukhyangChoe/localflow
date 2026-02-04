import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";

export const getUserById = async (
    client: SupabaseClient<Database>,
    { id }: { id: string }
  ) => {
    const { data, error } = await client
      .from("profiles")
      .select(
        `
          profile_id,
          username,
          avatar 
        `
      )
      .eq("profile_id", id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  };

export const getFullProfile = async (
    client: SupabaseClient<Database>,
    { id }: { id: string }
  ) => {
    const { data, error } = await client
      .from("profiles")
      .select("*")
      .eq("profile_id", id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  };

export const updateProfile = async (
    client: SupabaseClient<Database>,
    { id, updates }: { id: string; updates: Partial<Database["public"]["Tables"]["profiles"]["Row"]> }
  ) => {
    const { data, error } = await client
      .from("profiles")
      .update(updates)
      .eq("profile_id", id)
      .select()
      .single();
    if (error) {
      throw error;
    }
    return data;
  };

export const deleteOldNotifications = async (
    client: SupabaseClient<Database>
  ) => {
    // 현재 시간에서 일주일(7일) 전 날짜 계산
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const oneWeekAgoISO = oneWeekAgo.toISOString();

    const { data, error } = await client
      .from("notifications")
      .delete()
      .lt("created_at", oneWeekAgoISO);

    if (error) {
      throw error;
    }
    return data;
  };
  