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
  