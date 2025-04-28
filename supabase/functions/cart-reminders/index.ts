
// Follow this setup guide to integrate the Deno runtime with your application:
// https://deno.land/manual/examples/deploy_node_npm
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.25.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "https://izkmemlswyvvvupcnpxs.supabase.co";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get all active reminder configurations
    const { data: reminderConfigs, error: configError } = await supabase
      .from("cart_reminder_configurations")
      .select("*")
      .eq("is_active", true);

    if (configError) {
      throw configError;
    }

    // Get cart abandonment settings
    const { data: settings, error: settingsError } = await supabase
      .from("cart_abandonment_settings")
      .select("*")
      .single();

    if (settingsError) {
      throw settingsError;
    }

    const results = [];

    // Process each reminder configuration
    for (const config of reminderConfigs) {
      const delayHours = config.delay_hours;
      
      // Calculate the time threshold for this reminder
      const now = new Date();
      const threshold = new Date(now.getTime() - (delayHours * 60 * 60 * 1000));
      
      // Get abandoned carts that match the criteria for this reminder
      const { data: carts, error: cartsError } = await supabase
        .from("cart_abandonments")
        .select("*, profiles(email, full_name)")
        .eq("is_recovered", false)
        .lt("created_at", now.toISOString())
        .gt("created_at", threshold.toISOString())
        .is("last_notification_at", null);

      if (cartsError) {
        throw cartsError;
      }

      // Process found carts
      for (const cart of carts) {
        // In a real implementation, this would send an email
        // For now, we just update the last notification time
        const { error: updateError } = await supabase
          .from("cart_abandonments")
          .update({
            last_notification_at: now.toISOString(),
            notification_count: (cart.notification_count || 0) + 1
          })
          .eq("id", cart.id);

        if (updateError) {
          throw updateError;
        }

        results.push({
          cart_id: cart.id,
          email: cart.is_guest ? cart.email : cart.profiles?.email,
          reminder_config: config.name,
          status: "processed"
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: results.length,
        details: results
      }),
      { 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );

  } catch (error) {
    console.error("Error processing cart reminders:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }
});
