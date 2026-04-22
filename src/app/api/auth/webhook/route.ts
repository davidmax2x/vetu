import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Supabase environment variables not configured')
  }
  return createClient(url, key)
}

export async function POST(req: Request) {
  const payload = await req.json()
  const headerPayload = await headers()

  const svixId = headerPayload.get('svix-id')
  const svixTimestamp = headerPayload.get('svix-timestamp')
  const svixSignature = headerPayload.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: 'Missing webhook headers' }, { status: 400 })
  }

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!)
  let evt: any

  try {
    evt = wh.verify(JSON.stringify(payload), {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    })
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabaseAdmin = getSupabaseAdmin()
  const eventType = evt.type

  if (eventType === 'user.created') {
    const { id, email_addresses } = evt.data
    const email = email_addresses?.[0]?.email_address

    const { error } = await supabaseAdmin.from('users').upsert({
      clerk_id: id,
      email,
      created_at: new Date().toISOString(),
    }, { onConflict: 'clerk_id' })

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data
    const { error } = await supabaseAdmin
      .from('users')
      .update({ deleted_at: new Date().toISOString() })
      .eq('clerk_id', id)

    if (error) {
      console.error('Supabase soft-delete error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true })
}
