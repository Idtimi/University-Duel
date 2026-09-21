import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        // Fetch up to 15,000 rows to support your massive question bank
        const { data, error } = await supabase.from('questions').select('*').range(0, 15000);
        if (error) throw error;
        
        const formattedData = data.map(row => ({
            round: row.round || row.Round || "",
            category: row.category || row.Category || "",
            q: row.q || row.question || row.Question || "",
            a: row.a || row.answer || row.Answer || "",
            options: row.options || row.Options ? (row.options || row.Options) : []
        }));
        
        // Force Vercel to bypass cache so updates appear instantly
        res.setHeader('Cache-Control', 'no-store, max-age=0');
        res.status(200).json(formattedData);
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to fetch questions', 
            exact_reason: error.message || error
        });
    }
}
