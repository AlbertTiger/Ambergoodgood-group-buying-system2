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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)

    if (authError || !user) {
      throw new Error('未授权访问')
    }

    // 检查用户是否为管理员
    const { data: userData, error: userError } = await supabaseClient
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError || userData?.role !== 'admin') {
      throw new Error('权限不足')
    }

    // 获取统计数据
    const [
      { count: totalOrders },
      { count: totalProducts },
      { count: totalUsers },
      { data: revenueData }
    ] = await Promise.all([
      supabaseClient.from('orders').select('*', { count: 'exact', head: true }),
      supabaseClient.from('products').select('*', { count: 'exact', head: true }),
      supabaseClient.from('users').select('*', { count: 'exact', head: true }),
      supabaseClient
        .from('orders')
        .select('total_amount')
        .eq('payment_status', 'paid')
    ])

    const totalRevenue = revenueData?.reduce((sum, order) => sum + parseFloat(order.total_amount), 0) || 0

    // 获取最近订单
    const { data: recentOrders } = await supabaseClient
      .from('orders')
      .select(`
        *,
        products (title),
        users (full_name)
      `)
      .order('created_at', { ascending: false })
      .limit(5)

    // 获取热销商品
    const { data: topProducts } = await supabaseClient
      .from('products')
      .select('*')
      .order('current_participants', { ascending: false })
      .limit(5)

    return new Response(
      JSON.stringify({
        stats: {
          totalRevenue: totalRevenue.toFixed(2),
          totalOrders: totalOrders || 0,
          totalProducts: totalProducts || 0,
          totalUsers: totalUsers || 0
        },
        recentOrders: recentOrders || [],
        topProducts: topProducts || []
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