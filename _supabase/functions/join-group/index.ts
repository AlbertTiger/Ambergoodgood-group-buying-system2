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

    const { productId, quantity = 1, shippingAddress } = await req.json()

    if (!productId) {
      throw new Error('缺少商品ID')
    }

    // 获取商品信息
    const { data: product, error: productError } = await supabaseClient
      .from('products')
      .select('*')
      .eq('id', productId)
      .eq('status', 'active')
      .single()

    if (productError || !product) {
      throw new Error('商品不存在或已下架')
    }

    // 检查是否已经参团
    const { data: existingParticipant } = await supabaseClient
      .from('participants')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .eq('status', 'active')
      .single()

    if (existingParticipant) {
      throw new Error('您已经参加过此团购')
    }

    // 生成订单号
    const orderNumber = 'TG' + Date.now().toString().slice(-8)

    // 创建订单
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: user.id,
        product_id: productId,
        quantity,
        unit_price: product.group_price,
        total_amount: product.group_price * quantity,
        shipping_address: shippingAddress,
        status: 'pending'
      })
      .select()
      .single()

    if (orderError) {
      throw orderError
    }

    // 更新商品参团人数
    const { error: updateError } = await supabaseClient
      .from('products')
      .update({ 
        current_participants: product.current_participants + quantity 
      })
      .eq('id', productId)

    if (updateError) {
      throw updateError
    }

    // 创建参团记录
    const { error: participantError } = await supabaseClient
      .from('participants')
      .insert({
        user_id: user.id,
        product_id: productId,
        order_id: order.id,
        quantity
      })

    if (participantError) {
      throw participantError
    }

    return new Response(
      JSON.stringify({ 
        message: '参团成功',
        order: order,
        orderNumber: orderNumber
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