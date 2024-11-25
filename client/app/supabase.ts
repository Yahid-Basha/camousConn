import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

let AsyncStorage;
if (Platform.OS !== "web") {
  AsyncStorage = require("@react-native-async-storage/async-storage").default;
}

const supabaseUrl = "https://bxlkazahzyfbwhzpedoz.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4bGthemFoenlmYndoenBlZG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEyMzUyMjksImV4cCI6MjA0NjgxMTIyOX0.QQFP9bf8KAYIGbLCyEq8a9ydmFtCOOgSEfTBUMxBdfQ";

const options =
  Platform.OS !== "web"
    ? {
        auth: {
          storage: AsyncStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      }
    : {};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, options);
