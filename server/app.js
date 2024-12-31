// server/app.js or server/index.js
import express from 'express';
import cors from 'cors';
import { XMLParser } from 'fast-xml-parser';

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET'],
    credentials: true
}));
app.use(express.json());

const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    textNodeName: "#text",
    cdataTagName: "__cdata",
    parseAttributeValue: true,
    parseTagValue: true,
    trimValues: true,
    arrayMode: false
});

// Define the RSS content as proper template literals
const hinduContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/" version="2.0">
    <channel>
        <atom:link href="https://www.thehindu.com/news/cities/chennai/feeder/default.rss" rel="self" type="application/rss+xml"/>
        <title>Chennai Latest News: Today's Edition on Local Politics, Events &amp; Kollywood  Entertainment | The Hindu</title>
        <link>https://www.thehindu.com/news/cities/chennai/</link>
        <description><![CDATA[Chennai News: Stay up-to-date with the latest happenings in the 'Gateway of South'. From politics and business to sports, 'Kollywood' cinema industry, catch all the local news coverage you need about the city formerly known as Madras.]]></description>
        <category><![CDATA[Chennai]]></category>
        <ttl>60</ttl>
        <lastBuildDate>Tue, 31 Dec 2024 16:17:43 +0530</lastBuildDate>
        <copyright>Copyright (C) 2024 THG PUBLISHING PVT LTD.</copyright>
        <language>en-US</language>
        <docs>https://www.thehindu.com/</docs>
        <item>
            <title><![CDATA[Toddler drowns in open drain in Tiruvallur]]></title>
            <description><![CDATA[A tragic incident occurred in Tiruvallur]]></description>
            <link><![CDATA[https://www.thehindu.com/news/cities/chennai/toddler-drowns-in-open-drain-in-tiruvallur/article69045902.ece]]></link>
            <guid isPermaLink="false">article-69045902</guid>
            <category><![CDATA[Chennai]]></category>
            <pubDate><![CDATA[Tue, 31 Dec 2024 16:17:42 +0530]]></pubDate>
        </item>
        <item>
            <title><![CDATA[Local school wins national competition]]></title>
            <description><![CDATA[A Chennai school has won first place in the national science competition]]></description>
            <link><![CDATA[https://www.thehindu.com/news/cities/chennai/local-school-wins/article69045903.ece]]></link>
            <guid isPermaLink="false">article-69045903</guid>
            <category><![CDATA[Education]]></category>
            <pubDate><![CDATA[Tue, 31 Dec 2024 15:30:00 +0530]]></pubDate>
        </item>
    </channel>
</rss>`;

const toiContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
    <channel>
        <title>Pune News, Latest Pune News Headlines &amp; Live Updates - Times of India</title>
        <link>https://timesofindia.indiatimes.com/city/pune</link>
        <description>Pune News. TOI brings the latest Pune news headlines about Pune crime, Pune education news, Pune real estate news, Pune politics and Live Updates on local Pune news from Times of India</description>
        <language>en-gb</language>
        <lastBuildDate>2024-12-31T17:01:18+05:30</lastBuildDate>
        <item>
            <title>PCMC registers FIR against gym owner for unauthorised flex and kiosks</title>
            <description>The Pimpri Chinchwad Municipal Corporation lodged an FIR against a gym owner for installing unauthorised advertisements in Wakad.</description>
            <link>https://timesofindia.indiatimes.com/city/pune/pcmc-registers-fir-against-gym-owner/article123.cms</link>
            <pubDate>2024-12-31T16:03:39+05:30</pubDate>
            <category>Crime</category>
        </item>
        <item>
            <title>New metro line construction begins</title>
            <description>Construction of the new metro line connecting key areas of the city has begun.</description>
            <link>https://timesofindia.indiatimes.com/city/pune/new-metro-line/article124.cms</link>
            <pubDate>2024-12-31T15:30:00+05:30</pubDate>
            <category>Infrastructure</category>
        </item>
    </channel>
</rss>`;

function parseRSSContent(xmlContent) {
    try {
        const result = parser.parse(xmlContent);
        
        // Debug log to see the parsed structure
        console.log('Parsed RSS result:', JSON.stringify(result, null, 2));
        
        if (!result?.rss?.channel?.item) {
            console.error('RSS structure is invalid:', result);
            return [];
        }

        const items = Array.isArray(result.rss.channel.item) 
            ? result.rss.channel.item 
            : [result.rss.channel.item];

        return items.map((item, index) => ({
            id: index + 1,
            title: item.title?.['#text'] || item.title || '',
            link: item.link?.['#text'] || item.link || '',
            description: item.description?.['#text'] || item.description || '',
            published: item.pubDate?.['#text'] || item.pubDate || '',
            category: item.category?.['#text'] || item.category || 'General',
            source: result.rss.channel.title || 'Unknown Source'
        }));
    } catch (error) {
        console.error('Error parsing RSS content:', error);
        return [];
    }
}

// API endpoint with pagination
app.get('/api/news', (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const itemsPerPage = 10;

        // Parse and combine news
        const hinduNews = parseRSSContent(hinduContent);
        const toiNews = parseRSSContent(toiContent);
        
        console.log('Hindu News:', hinduNews);
        console.log('TOI News:', toiNews);
        
        const allNews = [...hinduNews, ...toiNews];
        
        // Sort by publication date
        allNews.sort((a, b) => new Date(b.published) - new Date(a.published));

        // Calculate pagination
        const totalItems = allNews.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        // Get paginated items
        const paginatedNews = allNews.slice(startIndex, endIndex);

        res.json({
            news: paginatedNews,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
                itemsPerPage,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            }
        });
    } catch (error) {
        console.error('Error processing news:', error);
        res.status(500).json({ 
            error: 'Failed to process news', 
            details: error.message 
        });
    }
});

// Test endpoint
app.get('/test', (req, res) => {
    res.json({ message: 'Server is running!' });
});

const PORT = process.env.PORT || 5008;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;