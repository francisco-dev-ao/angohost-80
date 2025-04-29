
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { smtpSettings } = await req.json();
    
    // Check if we have all required SMTP settings
    if (!smtpSettings?.smtpServer || !smtpSettings?.smtpPort || !smtpSettings?.smtpUser || !smtpSettings?.smtpPassword) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Configurações SMTP incompletas. Preencha todos os campos obrigatórios.",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Try to establish a real SMTP connection
    try {
      const client = new SMTPClient({
        connection: {
          hostname: smtpSettings.smtpServer,
          port: parseInt(smtpSettings.smtpPort),
          tls: smtpSettings.smtpPort === "465", // Use TLS for port 465
          auth: {
            username: smtpSettings.smtpUser,
            password: smtpSettings.smtpPassword,
          },
        },
      });

      // Connect to the server
      await client.connect();
      
      // If connect doesn't throw an error, consider it successful
      await client.close();

      return new Response(
        JSON.stringify({
          success: true,
          message: "Conexão SMTP estabelecida com sucesso!",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } catch (smtpError) {
      console.error("SMTP connection error:", smtpError);
      return new Response(
        JSON.stringify({
          success: false,
          message: `Erro na conexão SMTP: ${smtpError.message || "Verifique os dados e tente novamente"}`,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200, // Still returning 200 but with error details
        }
      );
    }
  } catch (error) {
    console.error("Error testing SMTP:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: `Erro ao testar configurações SMTP: ${error.message}`,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
