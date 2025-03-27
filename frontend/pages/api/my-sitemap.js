import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';

export default async (req, res) => {

    const links = [
        { url: '/', changefreq: 'daily', priority: 0.3 },
        { url: '/aboutUs', changefreq: 'daily', priority: 0.3 },
        { url: '/terms', changefreq: 'daily', priority: 0.3 },
        { url: '/study-destinations', changefreq: 'daily', priority: 0.3 },

        // Countries
        { url: '/study-destinations/study-mbbs-in-russia', changefreq: 'daily', priority: 0.3 },
        { url: '/study-destinations/study-mbbs-in-china', changefreq: 'daily', priority: 0.3 },
        { url: '/study-destinations/study-in-australia', changefreq: 'daily', priority: 0.3 },
        { url: '/study-destinations/study-in-germany', changefreq: 'daily', priority: 0.3 },
        { url: '/study-destinations/study-in-hungary', changefreq: 'daily', priority: 0.3 },
        { url: '/study-destinations/study-in-kyrgyzstan', changefreq: 'daily', priority: 0.3 },
        { url: '/study-destinations/study-in-uk', changefreq: 'daily', priority: 0.3 },
        { url: '/study-destinations/study-mbbs-in-bangladesh', changefreq: 'daily', priority: 0.3 },
        { url: '/study-destinations/study-mbbs-in-georgia', changefreq: 'daily', priority: 0.3 },
        { url: '/study-destinations/study-mbbs-in-kazakhstan', changefreq: 'daily', priority: 0.3 },
        { url: '/study-destinations/study-mbbs-in-nepal', changefreq: 'daily', priority: 0.3 },
        { url: '/study-destinations/study-mbbs-in-tajikistan', changefreq: 'daily', priority: 0.3 },
        { url: '/study-destinations/study-mbbs-in-ukraine', changefreq: 'daily', priority: 0.3 },
        { url: '/study-destinations/study-mbbs-in-uzbekistan', changefreq: 'daily', priority: 0.3 },
        
        //MBBS in russia universities
        { url: '/study-destinations/study-mbbs-in-russia/bashkir-medical-university', changefreq: 'daily', priority: 0.3 },
        { url: '/study-destinations/study-mbbs-in-russia/immanuel-kant-baltic-federal-university', changefreq: 'daily', priority: 0.3 },
        { url: '/study-destinations/study-mbbs-in-russia/kazan-federal-university', changefreq: 'daily', priority: 0.3 },
        { url: '/study-destinations/study-mbbs-in-russia/krasnoyarsk-state-medical-university', changefreq: 'daily', priority: 0.3 },
        { url: '/study-destinations/study-mbbs-in-russia/national-research-nuclear-university', changefreq: 'daily', priority: 0.3 },
        { url: '/study-destinations/study-mbbs-in-russia/north-western-state-medical-university', changefreq: 'daily', priority: 0.3 },
        { url: '/study-destinations/study-mbbs-in-russia/northern-state-medical-university', changefreq: 'daily', priority: 0.3 },
        { url: '/study-destinations/study-mbbs-in-russia/orenburg-state-medical-university', changefreq: 'daily', priority: 0.3 },
        { url: '/study-destinations/study-mbbs-in-russia/petrozavodsk-state-university', changefreq: 'daily', priority: 0.3 },
        { url: '/study-destinations/study-mbbs-in-russia/tambov-state-university', changefreq: 'daily', priority: 0.3 },
        { url: '/study-destinations/study-mbbs-in-russia/ulyanovsk-state-university', changefreq: 'daily', priority: 0.3 },
        { url: '/study-destinations/study-mbbs-in-russia/ural-state-medical-university', changefreq: 'daily', priority: 0.3 },
    ];

    const stream = new SitemapStream({
        hostname: `https://${req.headers.host}`,
    });

    res.writeHead(200, {
        "Content-Type": "application/xml"
    });

    const xmlString = await streamToPromise(Readable.from(links).pipe(stream)).then(data => data.toString());
    res.end(xmlString);
}