
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { userId } = await req.json()
    
    const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN')
    if (!accessToken) {
      throw new Error('Mercado Pago access token not configured')
    }

    // Criar preferência de pagamento
    const preference = {
      items: [{
        title: "Participação na Votação",
        description: "Pagamento para participar das votações",
        quantity: 1,
        currency_id: "BRL",
        unit_price: 2.50
      }],
      back_urls: {
        success: `${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'lovableproject.com')}/dashboard?payment=success`,
        failure: `${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'lovableproject.com')}/dashboard?payment=failure`,
        pending: `${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'lovableproject.com')}/dashboard?payment=pending`
      },
      auto_return: "approved",
      external_reference: userId,
      payment_methods: {
        excluded_payment_types: [],
        installments: 12
      }
    }

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preference)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Mercado Pago API error:', errorText)
      throw new Error(`Mercado Pago API error: ${response.status}`)
    }

    const data = await response.json()
    
    return new Response(
      JSON.stringify({ 
        preferenceId: data.id,
        initPoint: data.init_point,
        sandboxInitPoint: data.sandbox_init_point
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error creating payment:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
