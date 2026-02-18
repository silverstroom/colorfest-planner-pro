const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const DICE_GRAPHQL_URL = 'https://partners-endpoint.dice.fm/graphql';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('DICE_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'DICE_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch all events and filter CF14 ones
    const eventsQuery = `{
      viewer {
        events(first: 50) {
          totalCount
          edges {
            node {
              id
              name
              startDatetime
              endDatetime
              description
              totalTicketAllocationQty
              url
              tickets(first: 200) {
                totalCount
                pageInfo {
                  endCursor
                  hasNextPage
                }
                edges {
                  node {
                    id
                    ticketType {
                      id
                      name
                      price
                    }
                    claimedAt
                  }
                }
              }
            }
          }
        }
      }
    }`;

    console.log('Fetching DICE events...');

    const response = await fetch(DICE_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ query: eventsQuery }),
    });

    const data = await response.json();

    if (!response.ok || data.errors) {
      console.error('DICE API error:', JSON.stringify(data.errors || data));
      return new Response(
        JSON.stringify({ success: false, error: 'DICE API error', details: data.errors || data }),
        { status: response.ok ? 400 : response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Filter only Color Fest 14 events
    const allEvents = data.data?.viewer?.events?.edges || [];
    const cf14Events = allEvents
      .map((e: any) => e.node)
      .filter((e: any) => e.name && e.name.toLowerCase().includes('color fest 14'));

    // Build summary for each event
    const summary = cf14Events.map((event: any) => {
      const tickets = event.tickets?.edges?.map((t: any) => t.node) || [];
      const totalTickets = event.tickets?.totalCount || 0;
      const hasMoreTickets = event.tickets?.pageInfo?.hasNextPage || false;

      // Group by ticket type
      const byType: Record<string, { name: string; price: number; count: number; revenue: number }> = {};
      for (const ticket of tickets) {
        const typeName = ticket.ticketType?.name || 'Sconosciuto';
        const price = (ticket.ticketType?.price || 0) / 100; // DICE prices in cents
        if (!byType[typeName]) {
          byType[typeName] = { name: typeName, price, count: 0, revenue: 0 };
        }
        byType[typeName].count++;
        byType[typeName].revenue += price;
      }

      return {
        id: event.id,
        name: event.name,
        startDatetime: event.startDatetime,
        endDatetime: event.endDatetime,
        url: event.url,
        totalAllocation: event.totalTicketAllocationQty,
        totalSold: totalTickets,
        hasMoreTickets,
        totalRevenue: Object.values(byType).reduce((sum: number, t: any) => sum + t.revenue, 0),
        ticketTypes: Object.values(byType),
      };
    });

    const grandTotal = {
      totalSold: summary.reduce((s: number, e: any) => s + e.totalSold, 0),
      totalAllocation: summary.reduce((s: number, e: any) => s + e.totalAllocation, 0),
      totalRevenue: summary.reduce((s: number, e: any) => s + e.totalRevenue, 0),
    };

    console.log(`Found ${cf14Events.length} Color Fest 14 events, ${grandTotal.totalSold} tickets sold`);

    return new Response(
      JSON.stringify({ success: true, events: summary, totals: grandTotal }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching DICE data:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
