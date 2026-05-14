import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { giftCode, customerId } = await req.json();

    const GIFT_CODE = Deno.env.get('GIFT_CODE');
    const RC_SECRET_KEY = Deno.env.get('RC_SECRET_KEY');

    if (!GIFT_CODE || !RC_SECRET_KEY) {
      return new Response(
        JSON.stringify({ error: 'Server misconfigured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!giftCode || !customerId) {
      return new Response(
        JSON.stringify({ error: 'Missing giftCode or customerId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Case-insensitive code check
    if (giftCode.trim().toUpperCase() !== GIFT_CODE.trim().toUpperCase()) {
      return new Response(
        JSON.stringify({ error: 'Invalid code' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Grant lifetime Pro entitlement via RevenueCat REST API
    const rcResponse = await fetch(
      `https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(customerId)}/entitlements/DadLift%20Pro/promotional`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RC_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ duration: 'lifetime' }),
      }
    );

    if (!rcResponse.ok) {
      const body = await rcResponse.text();
      console.error('RevenueCat error:', rcResponse.status, body);
      return new Response(
        JSON.stringify({ error: 'Failed to grant entitlement' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (e) {
    console.error(e);
    return new Response(
      JSON.stringify({ error: 'Unexpected error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
