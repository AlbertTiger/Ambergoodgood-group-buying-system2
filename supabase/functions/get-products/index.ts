import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const url = new URL(req.url)
    const category = url.searchParams.get('category') || 'all'
    const sortBy = url.searchParams.get('sortBy') || 'popularity'
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const offset = parseInt(url.searchParams.get('offset') || '0')

    let query = supabaseClient
      .from('products')
      .select('*')
      .eq('status', 'active')
      .range(offset, offset + limit - 1)

    if (category !== 'all') {
      query = query.eq('category', category)
    }

    switch (sortBy) {
      case 'price_low':
        query = query.order('group_price', { ascending: true })
        break
      case 'price_high':
        query = query.order('group_price', { ascending: false })
        break
      case 'new':
        query = query.order('created_at', { ascending: false })
        break
      case 'time':
        query = query.order('end_time', { ascending: true })
        break
      default:
        query = query.order('current_participants', { ascending: false })
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    const productsWithProgress = data.map(product => ({
      ...product,
      progress: Math.min(Math.round((product.current_participants / product.min_participants) * 100), 100),
      timeLeft: calculateTimeLeft(product.end_time)
    }))

    return new Response(
      JSON.stringify({ 
        products: productsWithProgress,
        total: data.length 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

function calculateTimeLeft(endTime: string): string {
  const now = new Date()
  const end = new Date(endTime)
  const diff = end.getTime() - now.getTime()
  
  if (diff <= 0) return '已结束'
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (days > 0) return `${days}天${hours}小时`
  if (hours > 0) return `${hours}小时${minutes}分钟`
  return `${minutes}分钟`
}