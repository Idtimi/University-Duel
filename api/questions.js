import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const { data, error } = await supabase.from('questions').select('*');
        if (error) throw error;

        const formattedData = data.map(q => ({
            ...q,
            options: q.options ? q.options.split('|') : []
        }));
        res.status(200).json(formattedData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch questions' });
    }
}
