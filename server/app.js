// server/app.js
import express from 'express';
import cors from 'cors';
import { XMLParser } from 'fast-xml-parser';
import fetch from 'node-fetch';
import NodeCache from 'node-cache';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const cache = new NodeCache({ stdTTL: 300 }); // Cache for 5 minutes

app.use(
    cors({
        origin: 'http://localhost:3000',
        methods: ['GET'],
        credentials: true,
    })
);
app.use(express.json());

// XML Parser configuration
const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    textNodeName: '#text',
    cdataTagName: '__cdata',
    parseAttributeValue: true,
    parseTagValue: true,
    trimValues: true,
    arrayMode: false,
});

// News sources configuration
const NEWS_SOURCES = [
    {
        name: 'Times of India',
        url: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms',
        category: 'General',
    },
    {
        name: 'NDTV News',
        url: 'https://feeds.feedburner.com/ndtvnews-latest',
        category: 'General',
    },
    {
        name: 'The Hindu',
        url: 'https://www.thehindu.com/news/feeder/default.rss',
        category: 'General',
    },
    {
        name: 'Indian Express',
        url: 'https://indianexpress.com/feed/',
        category: 'General',
    },
    {
        name: 'Economic Times',
        url: 'https://economictimes.indiatimes.com/rssfeedstopstories.cms',
        category: 'General',
    },
    {
        name: 'BBC Tamil',
        url: 'https://feeds.bbci.co.uk/tamil/rss.xml',
        category: 'General',
    },
    
];

// Helper function to parse RSS content
function parseRSSContent(xmlContent, sourceName) {
    try {
        const result = parser.parse(xmlContent);

        if (!result?.rss?.channel?.item) {
            console.error(`Invalid RSS structure for source: ${sourceName}`);
            return [];
        }

        const items = Array.isArray(result.rss.channel.item)
            ? result.rss.channel.item
            : [result.rss.channel.item];

        return items.map((item, index) => ({
            id: `${sourceName}-${index}`,
            title: item.title || '',
            link: item.link || '',
            description: item.description || '',
            published: new Date(item.pubDate || '').toISOString(), // Normalize dates
            category: Array.isArray(item.category)
                ? item.category.map((cat) => cat.toLowerCase()).join(', ')
                : (item.category || 'general').toLowerCase(),
            source: sourceName,
        }));
    } catch (error) {
        console.error(`Error parsing RSS content from ${sourceName}:`, error);
        return [];
    }
}

// Fetch news from a single source
async function fetchNewsFromSource(source) {
    try {
        const response = await fetch(source.url, {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'application/xml, text/xml, */*; q=0.01',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': source.url, // Helps prevent 403 errors
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const xmlText = await response.text();
        return parseRSSContent(xmlText, source.name);
    } catch (error) {
        console.error(`Error fetching news from ${source.name}:`, error);
        return [];
    }
}

// Retry mechanism for fetching news
async function fetchNewsFromSourceWithRetry(source, retries = 3) {
    while (retries > 0) {
        try {
            return await fetchNewsFromSource(source);
        } catch (error) {
            console.error(`Error fetching news from ${source.name}, retries left: ${retries - 1}`, error);
            retries--;
            if (retries === 0) {
                console.error(`Failed to fetch news from ${source.name} after multiple attempts.`);
                return [];
            }
        }
    }
}

// Fetch news from all sources with retry mechanism
async function fetchNewsFromAllSources() {
    const cachedNews = cache.get('allNews');
    if (cachedNews) {
        return cachedNews;
    }

    try {
        const newsPromises = NEWS_SOURCES.map((source) =>
            fetchNewsFromSourceWithRetry(source)
        );
        const newsArrays = await Promise.all(newsPromises);
        const allNews = newsArrays.flat();

        // Sort news by publication date
        allNews.sort((a, b) => new Date(b.published) - new Date(a.published));

        // Cache the results
        cache.set('allNews', allNews);

        return allNews;
    } catch (error) {
        console.error('Error fetching news from sources:', error);
        return [];
    }
}

// API endpoint to get news with pagination and filtering
app.get('/api/news', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const category = req.query.category?.toLowerCase() || 'all';

        let allNews = await fetchNewsFromAllSources();

        // Filter news by category if specified
        if (category !== 'all') {
            allNews = allNews.filter((item) => item.category.includes(category));
        }

        // Pagination logic
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedNews = allNews.slice(startIndex, endIndex);

        // Get unique categories
        const categories = ['all', ...new Set(allNews.map((item) => item.category))];

        res.json({
            news: paginatedNews,
            hasMore: endIndex < allNews.length,
            totalItems: allNews.length,
            currentPage: page,
            totalPages: Math.ceil(allNews.length / limit),
            categories,
            status: 'Some sources may have failed to load.', // Add status message
        });
    } catch (error) {
        console.error('Error processing news:', error);
        res.status(500).json({
            error: 'Failed to process news',
            details: error.message,
        });
    }
});

// API endpoint to get unique categories
app.get('/api/categories', async (req, res) => {
    try {
        const allNews = await fetchNewsFromAllSources();
        const categories = ['all', ...new Set(allNews.map((item) => item.category))];
        res.json({ categories });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch categories',
            details: error.message,
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Start the server
const PORT = process.env.PORT || 5009;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;