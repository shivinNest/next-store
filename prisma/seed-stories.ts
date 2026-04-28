import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding stories...");

  // Remove all existing stories
  await prisma.blog.deleteMany();
  console.log("🗑️  Cleared existing stories");

  const stories = [
    {
      title: "The Indian Co-ord Set: Effortless Matching Done Right",
      slug: "indian-coord-set-effortless-matching-done-right",
      excerpt:
        "The co-ord set has taken Indian ethnic fashion by storm — a perfectly matched top and bottom that removes the guesswork from dressing while delivering a look that is polished, intentional, and completely irresistible.",
      content: `<p>There is something deeply satisfying about a perfectly matched set. The top and bottom conceived together, cut from the same fabric, carrying the same print or embroidery in perfect harmony. The co-ord set — short for coordinated set — has become one of the most beloved categories in contemporary Indian ethnic fashion, and it is easy to understand why. It gives every woman the confidence of a curated outfit without the effort of pairing separate pieces.</p>

<h2>What Is an Indian Co-ord Set?</h2>
<p>An Indian ethnic co-ord set is a two-piece or three-piece outfit in which the top and bottom — and sometimes a dupatta or jacket — are designed as a unified whole. Unlike a salwar suit, where the combination of kurta, salwar, and dupatta is often standardised and formal, the co-ord set brings a contemporary looseness to the concept. The top might be a crop top, a short kurti, or even a structured blouse. The bottom might be wide-leg pants, a flared skirt, a dhoti-style trouser, or culottes. What defines it as a co-ord is the deliberate visual unity between the pieces.</p>

<p>The Indian co-ord set occupies a fascinating middle ground — it carries the intentionality of ethnic fashion, often in traditional fabrics like Chanderi, block-printed cotton, or handloom silk, while wearing the silhouette of contemporary casual and semi-formal dressing. It is at home at a brunch, a festive lunch, a workplace with a liberal dress code, or a mehendi ceremony.</p>

<h2>Why the Co-ord Set Has Taken Over Indian Wardrobes</h2>
<p>The answer is convenience — but also something deeper. The co-ord set solves the perennial Indian fashion dilemma of looking dressed-up without looking overdressed. A heavily embroidered lehenga is unambiguously formal. A plain cotton kurta is unambiguously casual. The co-ord set exists in the large, well-populated middle ground — dressy enough for an occasion, relaxed enough for daily life.</p>

<p>There is also a generational shift at work. Younger Indian women, shaped by global fashion sensibilities and the visual grammar of social media, are drawn to the clean, editorial quality of a well-styled co-ord set. It photographs exceptionally well. It reads as fashion-forward rather than conventionally ethnic. And it allows self-expression through fabric, print, and silhouette choices in a way that more formalised ethnic categories sometimes do not.</p>

<h2>The Best Fabrics for Indian Co-ord Sets</h2>
<p>Fabric is where the Indian co-ord set truly distinguishes itself from its Western counterpart. While Western co-ord sets are often made in jersey, linen, or synthetic fabrics, Indian co-ord sets draw on the extraordinary richness of the subcontinent's textile traditions.</p>

<p>Block-printed cotton co-ord sets are among the most popular choices — the bold, hand-stamped patterns of Rajasthani or Gujarati block printing look spectacular when the same print runs across a cropped top and wide-leg pant. The pattern creates visual unity and allows the wearer to carry an entire landscape of Indian craft tradition in a single outfit.</p>

<p>Chanderi co-ord sets — in the semi-transparent silk-cotton fabric from Madhya Pradesh — bring a delicate, luminous quality to the silhouette. The slight sheen of Chanderi reads as quietly luxurious, making it ideal for evening occasions. Ikat co-ord sets, woven in the resist-dyeing tradition of Andhra Pradesh and Odisha, carry a distinctive geometric rhythm that is immediately recognisable as Indian while feeling completely contemporary.</p>

<p>For festive occasions, embroidered co-ord sets in georgette or crepe — with mirror work, thread embroidery, or sequin accents — deliver glamour without the weight and formality of a full lehenga or saree.</p>

<h2>Silhouettes That Define the Category</h2>
<p>The most beloved Indian ethnic co-ord silhouette pairs a cropped or hip-length top with wide-leg or flared pants. The wide-leg pant is a particular favourite — it balances the proportions of a shorter top beautifully, creates an elegant drape, and is supremely comfortable. The dhoti-style trouser paired with a straight-cut top is another iconic co-ord combination — more traditional in its reference but reinterpreted in contemporary fabrics and cuts.</p>

<p>The skirt co-ord — a top paired with a flared or tiered skirt in matching fabric — leans more feminine and festive. An embroidered or printed A-line skirt paired with a matching short kurti or structured blouse makes for a co-ord set that works beautifully for weddings, engagements, and festive celebrations.</p>

<p>Three-piece co-ord sets — top, bottom, and dupatta or jacket in matching fabric — offer the most complete look and the most flexibility. The jacket or dupatta can be worn or removed depending on the occasion, the weather, and the formality required.</p>

<h2>How to Style Your Co-ord Set</h2>
<p>The great advantage of the co-ord set is that the outfit is already complete — the top and bottom are doing the heavy lifting. This means accessories should be chosen with a light hand. Over-accessorising a co-ord set defeats its clean, curated appeal.</p>

<p>For a daytime or casual occasion, minimal jewellery — small earrings, a single bangle or bracelet, a slim ring — allows the fabric and print of the co-ord to breathe. Flat or low-heeled footwear — a pair of kolhapuri sandals, block-print juttis, or clean white sneakers for a truly contemporary interpretation — keeps the look effortless.</p>

<p>For a more formal or evening occasion, the co-ord set can be elevated with statement earrings and a structured clutch. A single bold piece of jewellery — a chandelier earring, a wide cuff, or a layered necklace — is enough. Heeled sandals in metallic or neutral tones complete the look without competing with it.</p>

<h2>The Co-ord Set as a Wardrobe Investment</h2>
<p>One of the less-discussed virtues of the co-ord set is its versatility beyond the matched outfit. The top from a co-ord set can be worn separately — with jeans, with a different trouser, with a skirt of a contrasting colour or texture. The bottom can be paired with a plain kurta, a shirt, or a different top entirely. A single co-ord set effectively gives you three or more distinct outfits, making it one of the most efficient additions to a thoughtful wardrobe.</p>

<p>At Saaviya, our co-ord set collection is built on this philosophy of versatility — pieces that work together and apart, in fabrics that honour India's craft heritage while wearing the silhouette of today. Because the best co-ord set is not just an outfit. It is a foundation for endless possibility.</p>`,
      image: "https://cdn.pixabay.com/photo/2024/06/19/08/18/woman-8839452_1280.jpg",
      author: "Sneha Satheesan",
      tags: ["co-ord set", "ethnic fashion", "styling", "matching set", "indian fashion"],
      publishedAt: new Date("2026-04-01"),
    },
    {
      title: "The Kurta: India's Most Versatile Garment and Why It Never Goes Out of Style",
      slug: "kurta-indias-most-versatile-garment",
      excerpt:
        "From cotton everyday casuals to embroidered festive masterpieces, the kurta has outlasted every fashion cycle. Here is why this ancient silhouette remains the cornerstone of Indian women's wardrobes.",
      content: `<p>There is a reason the kurta has survived centuries of changing fashion, colonial disruptions, Western influence, and the rise of fast fashion. It simply works. For every occasion, every body type, every budget, every season — the kurta delivers. It is perhaps the most democratic garment in the Indian wardrobe, and certainly the most adaptable.</p>

<h2>A Brief, Glorious History</h2>
<p>The kurta traces its origins to Central Asian tunic garments that arrived in the Indian subcontinent with the Mughal dynasty. Over the following centuries it absorbed influences from Rajput court dress, Bengali muslin traditions, Lucknowi chikankari craft, and the practical cotton sensibility of everyday rural India. By the time it reached the 20th century, the kurta had shed its purely aristocratic associations and become the garment of the people — worn by farmers and prime ministers, poets and politicians alike.</p>

<p>For women, the kurta has undergone its own evolution. The long, straight kurta of the 1970s gave way to the heavily embroidered anarkali of the 2000s, and then to the asymmetric, high-low, and side-slit kurtas that now define contemporary Indian fashion. Each iteration retained the essential DNA: a collarless or minimal-collar top, typically knee-length or longer, made from fabric that breathes and moves.</p>

<h2>Why the Kurta Works for Every Body</h2>
<p>The kurta's silhouette is inherently forgiving. A well-cut A-line kurta skims over hips and thighs without clinging. A straight-cut kurta with side slits allows ease of movement while creating vertical lines that elongate the figure. For women who prefer definition, a fitted kurta with a slightly flared hem at the knee creates an elegant hourglass effect. For women who want comfort above all, an oversized kurta worn as a tunic over leggings or churidars offers ease without sacrificing style.</p>

<p>The key to wearing a kurta well is understanding which cut works for your proportions. Petite women generally look best in kurtas that end at the thigh or just below — anything longer can overwhelm a small frame. Taller women can carry floor-length anarkali kurtas with absolute authority. Women with fuller figures often find that kurtas with embroidery or print concentrated at the neckline draw attention upward beautifully.</p>

<h2>The Fabric Matters Enormously</h2>
<p>A cotton cambric kurta is your weekday companion — washable, breathable, and unpretentious. Chanderi or mul cotton kurtas carry a slight transparency and drape that make them feel elevated without requiring occasion-dressing. Georgette kurtas have a fluid fall that photographs beautifully. Silk kurtas, particularly from Banaras or Kanjivaram, are heirloom pieces. And then there is the handloom kurta — the block-printed, hand-woven, or resist-dyed variety that connects the wearer to living craft traditions that are centuries old.</p>

<p>At Saaviya, our kurta collection spans the entire spectrum — from everyday cotton to festive silk, from minimalist solids to hand-embroidered statements. Because we believe every woman deserves a kurta that fits her life as well as it fits her body.</p>

<h2>Styling the Modern Kurta</h2>
<p>The rules of kurta styling have never been more flexible. The traditional pairing of kurta with churidar and dupatta remains perennially elegant and appropriate for formal occasions. But the contemporary woman has added several new combinations to her repertoire.</p>

<p>Kurta with straight-cut trousers or cigarette pants creates an Indo-western look that works effortlessly for office wear. A short kurta worn over wide-leg palazzo pants brings a relaxed, boho-ethnic energy. A long, printed kurta worn as a dress with a leather belt cinched at the waist is perfect for casual weekends. And a heavily embroidered short kurta paired with a sleek skirt — either flared or pencil — is an inspired choice for cocktail evenings.</p>

<p>The dupatta, often an afterthought, can transform a simple kurta into something ceremonial. Worn draped over one shoulder, pinned at the chest, or carried loosely over the arm, a well-chosen dupatta elevates any kurta into outfit-of-the-day territory.</p>

<h2>Caring for Your Kurta Collection</h2>
<p>Natural fabric kurtas deserve gentle care. Cotton kurtas should be washed in cold water and dried in shade to prevent fading. Silk and Chanderi kurtas are best dry-cleaned or hand-washed with extreme care in cold water with a mild silk wash. Embroidered kurtas should always be turned inside out before washing and stored flat or rolled rather than hung to prevent stretching at the shoulders.</p>

<p>With proper care, a well-made kurta lasts years and ages beautifully — the cotton softening with every wash, the embroidery developing a gentle patina. This is part of what makes the kurta not just a garment but an investment.</p>`,
      image: "https://cdn.pixabay.com/photo/2023/09/12/11/02/ai-generated-8248592_1280.jpg",
      author: "Sneha Satheesan",
      tags: ["kurta", "ethnic wear", "styling", "wardrobe essentials", "indian fashion"],
      publishedAt: new Date("2026-04-07"),
    },
    {
      title: "The Living Fabric of Indian Fashion: A Journey Through Craft, Culture, and Colour",
      slug: "living-fabric-indian-fashion-craft-culture-colour",
      excerpt:
        "Indian fashion is not just clothing — it is a repository of history, geography, religion, and human creativity. To wear Indian ethnic wear is to participate in one of the world's oldest living art traditions.",
      content: `<p>Every sari has a story. Every embroidered dupatta carries the memory of the woman who made it — her hours of patient work, the regional tradition she was taught, the symbols she wove into the cloth that have not changed in three hundred years. To understand Indian fashion is to understand that clothing here has never been merely utilitarian. It has always been cultural, spiritual, and deeply personal.</p>

<h2>A Subcontinent of Textiles</h2>
<p>India is perhaps the most textile-rich country on earth. Each state, often each district, has its own weaving tradition — its own looms, its own dye processes, its own motifs. The Kanjivaram silk of Tamil Nadu, woven with gold and silver zari, represents one of the world's great luxury textile traditions. The Banarasi brocade of Uttar Pradesh, with its intricate floral and paisley patterns drawn from Mughal garden imagery, is another. The Patola of Gujarat — a double ikat silk saree so technically demanding that a single piece can take months to complete — is yet another.</p>

<p>Beyond silk, the cotton weaving traditions of India are equally remarkable. Khadi, hand-spun and hand-woven cotton that became the symbol of the Indian independence movement, carries enormous cultural weight alongside its practical virtues of breathability and durability. The block-printed cottons of Rajasthan, with their bold geometric and floral patterns stamped by hand with carved wooden blocks, represent a tradition that dates back over a thousand years. The resist-dyed batik fabrics of Gujarat and the kalamkari hand-painted textiles of Andhra Pradesh are others.</p>

<h2>Embroidery: India's Great Handcraft Heritage</h2>
<p>If weaving is one pillar of Indian textile culture, embroidery is the other. India's embroidery traditions are staggeringly diverse. Zardozi — the metallic thread embroidery that originated in Persian court culture and was perfected under Mughal patronage in Lucknow and Agra — remains one of the most labour-intensive and prestigious forms of needlework in the world. A heavily zardozi-embellished lehenga can take months of skilled hand-work to complete.</p>

<p>Chikankari, also from Lucknow, offers a delicate counterpoint — white-on-white thread embroidery on muslin or georgette that creates ghostly floral and botanical patterns. Originally a Mughal court garment, chikankari has evolved into one of the most beloved forms of everyday Indian fashion, worn by women across all ages and social classes.</p>

<p>In Gujarat, the mirror-work embroidery tradition of the Kutch region — where tiny pieces of reflective glass are stitched into brightly coloured fabric alongside bold silk thread patterns — creates garments that seem to generate their own light. In Punjab, phulkari embroidery — meaning "flower work" — covers fabric with dense, geometric silk thread patterns in extraordinary colours. Each regional embroidery tradition reflects the geography, the available materials, the local aesthetics, and the social rituals of its place of origin.</p>

<h2>The Role of Colour in Indian Dress Culture</h2>
<p>Colour in Indian fashion is never arbitrary. It is deeply coded — by region, by religion, by season, by occasion. Red is the colour of marriage and new beginnings across most of India. White is worn by widows in some Hindu traditions and by brides in certain Christian communities in the South. Saffron carries deep spiritual significance. Yellow marks auspicious occasions like the haldi ceremony before a wedding. Green is associated with fertility and prosperity in many parts of India. Understanding these colour codes is part of understanding Indian fashion at its deepest level.</p>

<p>Beyond ceremony, Indian women have always had a fearless relationship with colour in everyday dress. The ability to combine seemingly unlikely colours — a peacock blue with a mustard yellow, a deep plum with a burnt orange — and make it feel absolutely right is a distinctly Indian sensibility. It comes from centuries of living with colour in architecture, in temple art, in festival celebrations, in the natural dye traditions of the land.</p>

<h2>Contemporary Indian Fashion: Where Heritage Meets the World</h2>
<p>Indian fashion today is in one of its most exciting moments. A generation of designers, stylists, and conscious consumers are looking at India's textile heritage with fresh eyes. The slow fashion movement has found a natural ally in handloom and handcraft traditions. The global fashion conversation about sustainability has helped the world see what India has always known — that a Kanjivaram saree made to last generations is not just beautiful, it is the most sustainable garment imaginable.</p>

<p>Young Indian designers are taking handloom fabrics and giving them entirely new silhouettes — handwoven silk in a sharply cut blazer, ikat fabric in a structured corset blouse, block-printed cotton in a fluid maxi dress. The result is a fashion language that is simultaneously ancient and urgent, local and global.</p>

<p>At Saaviya, we are committed to being part of this living tradition. Every piece in our collection is a conversation between the past and the present — between the hands of the artisan who made the fabric and the woman who will wear it. We believe that when you wear Indian ethnic fashion, you are not just dressing yourself. You are participating in something much larger and much more beautiful.</p>`,
      image: "https://cdn.pixabay.com/photo/2017/10/10/19/33/fabric-2838460_1280.jpg",
      author: "Sneha Satheesan",
      tags: ["indian fashion", "culture", "heritage", "textiles", "handloom", "craft"],
      publishedAt: new Date("2026-04-10"),
    },
    {
      title: "Summer Dressing the Indian Way: Cool, Effortless, and Completely Elegant",
      slug: "summer-dressing-indian-way-cool-effortless-elegant",
      excerpt:
        "Indian summers are intense — but Indian women have been dressing for them with grace and ingenuity for centuries. Here is your complete guide to building a summer ethnic wardrobe that keeps you cool without compromising on style.",
      content: `<p>The Indian summer is not for the faint-hearted. Temperatures that climb well past 40 degrees Celsius in most of the country, humidity that makes every breath feel weighted, and a sun that seems to have a personal vendetta. And yet, Indian women step out into this heat every single day looking impeccably put-together. The secret? Centuries of accumulated textile wisdom that Western fashion has not yet fully caught up with.</p>

<h2>The Fabric Philosophy: Natural Always Wins</h2>
<p>The single most important summer dressing decision is fabric. Synthetic fabrics — polyester, nylon, acrylic — trap heat and moisture against the skin, turning an already warm day unbearable. The Indian textile tradition, developed in one of the world's hottest climates, understood this long before the language of breathability entered fashion vocabulary.</p>

<p>Cotton is the undisputed queen of Indian summer fabrics. Specifically, look for mul mul cotton (also called mulmul) — an extremely lightweight, loosely woven cotton so fine it is almost translucent. Mul mul has been woven in India for over a thousand years and remains one of the most technically sophisticated lightweight fabrics in the world. A mul mul kurta feels like wearing air. Chanderi cotton, with its slight lustre and gossamer weight, is another superb summer choice. Kota Doria from Rajasthan — a distinctive check-woven cotton and silk blend — is another that drapes beautifully and keeps you cool.</p>

<p>Linen, increasingly popular in Indian summer fashion, has a wonderful texture and exceptional breathability. A linen kurta or linen wide-leg trouser combination is perhaps the most effortlessly chic summer ethnic look available to the modern Indian woman.</p>

<h2>Silhouettes That Work in the Heat</h2>
<p>Beyond fabric, silhouette choice makes an enormous difference in how comfortable you feel in summer. Loose, flowing garments that allow air circulation around the body are the traditional Indian answer to heat — and they are also, conveniently, deeply stylish.</p>

<p>The A-line kurta with a slight flare that allows air to circulate is a summer staple. Palazzo pants — wide, flowing trousers that move like skirts — pair beautifully with short kurtis and create a breezy, effortless look. The dhoti salwar, with its gathered front and tapered ankles, is another silhouette that combines airiness with elegance. Straight-cut, wide-leg pants in cotton or linen are endlessly versatile.</p>

<p>Avoid tight churidars and pencil-leg trousers in peak summer — however elegant they are in other seasons, in intense heat they restrict circulation and trap warmth. The Indian fashion wisdom of summer is to let the fabric flow and let the air move.</p>

<h2>Colour and Print for Summer</h2>
<p>Light colours reflect heat. Dark colours absorb it. This basic physics has shaped Indian summer dress culture for generations. White, off-white, and ivory — the classic summer palette — remain perennially elegant and genuinely cooler to wear. Pastels, particularly the muted, dusty versions of blush pink, sage green, sky blue, and soft lavender, are equally practical and equally beautiful.</p>

<p>Indian block prints are at their most joyful in summer. The indigo and white resist-print tradition of Rajasthan, the delicate floral block prints of Jaipur, and the bold geometric dabu prints of Gujarat are all Summer-appropriate classics. They carry visual energy without visual heaviness — the print adds interest and personality, the pale ground fabric keeps the look light.</p>

<p>Embroidery in summer dressing is best kept minimal. Heavy zardozi or dense phulkari embroidery, beautiful as it is, adds warmth both visually and literally. In summer, choose garments where embroidery is used as an accent — a beautifully embroidered neckline on an otherwise simple kurta, or a delicately thread-worked border on a cotton saree — rather than as the dominant surface treatment.</p>

<h2>The Summer Saree</h2>
<p>Summer is no reason to abandon the saree. In fact, some of the most breathtaking sarees in the Indian textile canon are specifically summer garments. The Tant saree of Bengal — a lightweight, crisp cotton with a simple woven border — is the ultimate summer drape. The Gadwal saree of Telangana, with its cotton body and silk border, combines practicality with elegance. And the printed cotton sarees of Rajasthan and Maharashtra offer a casual ease that makes them perfect for summer weekdays and weekend gatherings alike.</p>

<p>Pair summer sarees with lightweight blouses — a sleeveless blouse or a cap-sleeve blouse in the same fabric as the saree keeps the look cohesive and comfortable. Avoid heavy, padded or lined blouses in summer.</p>

<h2>Summer Accessories</h2>
<p>Summer accessories should be light and functional. Jute and rattan bags complement summer ethnic looks beautifully while being far cooler to carry than leather. Kolhapuri sandals — the flat, hand-crafted leather chappals of Maharashtra — are the ideal summer footwear with ethnic wear. Oxidised silver and terracotta jewellery, lighter than heavy gold, suit the casual elegance of summer dressing perfectly. And a well-chosen cotton dupatta or stole serves double duty — covering the shoulders from sun while adding colour and style to a simple kurta-trouser combination.</p>

<p>Summer dressing in India is ultimately about intelligent ease — choosing fabrics, silhouettes, and colours that work with the climate rather than against it, while maintaining the beauty and intentionality that Indian fashion always demands.</p>`,
      image: "https://cdn.pixabay.com/photo/2016/10/16/13/44/young-woman-1745173_1280.jpg",
      author: "Sneha Satheesan",
      tags: ["summer fashion", "cotton kurta", "summer styling", "ethnic wear", "summer saree"],
      publishedAt: new Date("2026-04-14"),
    },
    {
      title: "Monsoon Fashion: Dressing for the Rain Without Sacrificing Style",
      slug: "monsoon-fashion-dressing-rain-without-sacrificing-style",
      excerpt:
        "The monsoon is India's most romantic season — but it is also a genuine challenge for the fashion-conscious woman. Here is how to dress beautifully through the rains, in fabrics that survive the weather and styles that rise above it.",
      content: `<p>The first rains of the Indian monsoon arrive with a drama all their own — the sharp smell of wet earth, the sudden drop in temperature, the relief that sweeps through a heat-exhausted country. For most of India, the monsoon season — from June to September — is also the season of festivals, of Onam and Teej and Ganesh Chaturthi, of college reunions and family gatherings. The challenge for the Indian woman is to dress beautifully for all of this while navigating wet roads, humid air, and fabrics that do not appreciate getting soaked.</p>

<h2>The First Rule of Monsoon Fashion: Know Your Fabrics</h2>
<p>The monsoon is unforgiving to certain fabrics. Heavy silks, particularly raw silk and dupion, lose their lustre and crispness when wet and take an age to dry. Heavy cotton that is not pre-washed may shrink. Velvet and heavy embellished fabrics — studded with mirrors, beads, or stones — become waterlogged and misshapen. These are fabrics to wear on the occasion you are going to, not on the way there.</p>

<p>The fabrics that genuinely work in monsoon conditions are those with a certain lightness and quick-dry quality. Georgette — both pure silk georgette and the more practical polyester georgette — dries quickly, drapes beautifully, and doesn't lose its shape when it gets a little damp. Crepe is another excellent monsoon fabric — it has the same fluid drape as georgette with slightly more structure. Synthetic blends and polyester-cotton mixes that mimic the look of heavier fabrics while retaining monsoon practicality have improved dramatically in recent years.</p>

<p>If you love cotton — and there are many excellent reasons to love it — choose tightly woven cotton in monsoon rather than loose-woven mul mul. Tightly woven cotton dries faster and doesn't go limp in humidity the way a loosely woven fabric does. Linen is another strong monsoon choice — it manages humidity well and, crucially, actually looks better slightly rumpled, which is an invaluable quality during the rainy season.</p>

<h2>Silhouettes for the Monsoon</h2>
<p>The monsoon is a season to raise the hemline. Not because of any fashion rule, but for the very practical reason that long, trailing garments that sweep the floor become waterlogged, dirty, and heavy in the rain. A kurta that ends at the knee, or a salwar that ends at the ankle rather than floor-grazing, is a far more practical and ultimately more elegant choice in monsoon conditions.</p>

<p>This is the season that elevates the straight-cut midi kurta. Falling to mid-calf, clear of puddles and wet streets, it drapes beautifully and moves well. Pair it with straight trousers or tapered pants — not with flared or wide-leg bottoms that trail the ground. The palazzo pant, so perfect for summer, needs to be worn carefully in monsoon — choose a version that falls at ankle length rather than floor-length, and in a quick-dry fabric.</p>

<p>The anarkali silhouette, for all its beauty, is high-maintenance in the monsoon — the long flared skirt accumulates water and mud. Reserve anarkalis for indoor wedding and function venues. For outdoor monsoon events, the fit-and-flare kurta that ends just below the knee is both practical and beautiful.</p>

<h2>The Monsoon Colour Palette</h2>
<p>The monsoon transforms India's landscape into an extraordinary palette of greens — the deep green of rice paddies, the bright green of freshly washed leaves, the grey-green of the sky before a downpour. Indian monsoon fashion has always responded to this palette with its own richness.</p>

<p>The deepest, most saturated jewel tones are at their most powerful in monsoon — deep teal, forest green, plum, burgundy, and cobalt blue all seem to glow against the grey monsoon sky. These are not colours that wash out in flat monsoon light; they hold their own. Peacock blue in georgette is one of the most stunning monsoon fashion choices imaginable.</p>

<p>Dark, saturated colours also have the practical advantage of not showing water marks — an important consideration when navigating monsoon streets. That pale beige chanderi kurta that looks breathtaking on a clear day may show every rain splatter on a monsoon afternoon. Deep colours are pragmatic as well as beautiful.</p>

<h2>Monsoon-Proof Ethnic Footwear</h2>
<p>The monsoon shoe question is one that Indian women approach with varying strategies — some embrace the puddle entirely in flat waterproof chappals, others navigate carefully in semi-formal footwear. The most monsoon-appropriate ethnic footwear choices are those made from water-resistant materials. Rubber-soled juttis in synthetic or patent leather survive the rains well. Flat kolhapuris in a dark colour — navy or brown rather than natural tan — are forgiving of water splashes. Block-heeled sandals in synthetic leather with a broad, stable heel provide some height elevation from wet streets without the precariousness of a stiletto.</p>

<p>Whatever you choose, avoid suede, jute, or unfinished leather in the monsoon. These materials absorb water and are permanently damaged by heavy rain.</p>

<h2>Festival Dressing in Monsoon</h2>
<p>Some of India's most beloved festivals fall in the heart of monsoon season. Teej, celebrated by women in North India with particular fervour, is a monsoon festival — and the traditional Teej outfit is a green or red lehenga or saree, worn with jasmine flowers in the hair. For Onam in Kerala, the traditional dress is the off-white kasavu saree with a golden border — worn regardless of weather, because the occasion demands it.</p>

<p>For these festival occasions, the approach is simply to be smart about transport — wear your beautiful heavy saree or lehenga to the venue, not on foot through the streets. A practical carry bag for your footwear, a small umbrella in a colour that coordinates with your outfit, and a trusted auto-rickshaw or cab are your monsoon festival fashion accessories as much as any jewellery.</p>

<p>The monsoon is not an obstacle to beautiful dressing in India. It is, like everything in Indian culture, an invitation to adapt, to find beauty in constraint, and to discover that some of the most elegant looks are born precisely from the demands of the season.</p>`,
      image: "https://cdn.pixabay.com/photo/2017/08/06/15/13/woman-2593366_1280.jpg",
      author: "Sneha Satheesan",
      tags: ["monsoon fashion", "rainy season", "ethnic wear", "festival dressing", "styling tips"],
      publishedAt: new Date("2026-04-18"),
    },
    {
      title: "Indo-Western Fusion: How to Wear Two Worlds at Once",
      slug: "indo-western-fusion-wear-two-worlds-at-once",
      excerpt:
        "Indo-western fusion fashion is no longer a novelty — it has become the defining aesthetic of the modern Indian woman. Here is how to wear it with intention, coherence, and real style.",
      content: `<p>The phrase "Indo-western" has been part of Indian fashion vocabulary since at least the 1980s, when Hindi film heroines began appearing in combinations that blended ethnic textiles with Western silhouettes. For decades, it existed somewhat awkwardly — neither fully Indian nor fully Western, often producing results that felt more costume than clothing. But something has changed in the past decade, and the change is significant. Indo-western fusion today has found its confidence. It has a genuine aesthetic logic, and in its best expressions, it produces fashion that is more exciting than either of its constituent traditions alone.</p>

<h2>The Logic of Fusion</h2>
<p>Good Indo-western fashion is not about randomly pairing a kurta with jeans — although that combination has its place. At its most sophisticated, it is about understanding what each tradition contributes to the whole and allowing those contributions to complement rather than fight each other.</p>

<p>Indian textile and craft traditions contribute texture, colour, motif, and handmade richness that no industrial production process can replicate. Western fashion contributes silhouette vocabulary — the blazer, the trouser, the shirt dress, the trench coat — that has been refined over decades of global wear and has a universality and practicality that ethnic silhouettes sometimes lack in urban, modern contexts. When you combine Indian fabric with a Western silhouette, you get a garment that is simultaneously globally legible and distinctly Indian.</p>

<h2>The Combinations That Actually Work</h2>
<p>The handloom blazer is perhaps the single most successful piece of Indo-western fusion in recent fashion history. A well-cut blazer in Banarasi brocade, Chanderi silk, or block-printed cotton brings together the authority of a structured Western outerwear piece with the extraordinary richness of Indian textile craft. Worn over a simple kurta or even over a Western shirt and trousers, the handloom blazer instantly elevates any look while carrying a clear point of cultural identity.</p>

<p>The ikat co-ord set — matching trousers and jacket or trousers and top in ikat-woven fabric — has become a staple of the contemporary working Indian woman's wardrobe. It reads as professionally appropriate in most corporate environments while being unmistakably, proudly Indian in its fabric story.</p>

<p>Pairing an embellished Indian kurta with straight-cut Western trousers — not traditional Indian salwar but a proper Western-cut trouser in a solid neutral — is a combination that has moved from fusion experiment to mainstream fashion staple. The trousers ground the look and give it a clean, contemporary bottom half that allows a more elaborate kurta to read as intentional rather than costume-like.</p>

<p>The other combination that has proved its durability is wearing Indian handloom or print fabric in a Western dress silhouette — a shirt dress, a wrap dress, or a simple A-line midi dress cut in Kalamkari fabric, Bagru block print, or Ajrakh resist-dyed cotton. The silhouette is completely legible as contemporary Western fashion. The fabric is completely, unmistakably Indian. The combination achieves exactly the tension of familiar-and-unexpected that all good fashion requires.</p>

<h2>The Accessories That Complete the Fusion Look</h2>
<p>Accessories are where Indo-western fusion is most forgiving and most playful. A classic Western look — a clean linen shirt dress, say, or a blazer and trouser combination — can be transformed by Indian jewellery. Oxidised silver earrings, a hand-hammered copper cuff, a string of chunky turquoise beads — each of these shifts the cultural register of a look without requiring any change of clothing. The reverse works equally well: heavily embellished Indian ethnic wear can be given a contemporary edge by wearing it with minimal, structural Western jewellery — a clean gold collar necklace, a single diamond stud.</p>

<p>Bags are another powerful fusion tool. A structured leather tote or structured wooden-handled bag worn with a kurta-palazzo combination adds a precision and modernity to the look. Conversely, a hand-embroidered potli bag or a hand-woven jute tote carried with a Western outfit adds warmth and textural interest.</p>

<h2>The Pitfalls to Avoid</h2>
<p>Not all fusion combinations are created equal. The most common pitfall is visual noise — the combination of too many competing elements without a clear focal point. If you are wearing a heavily embroidered kurta, it does not need heavy Western outerwear, heavy jewellery, and a patterned trouser at the same time. Let one element be the star and let everything else play a supporting role.</p>

<p>The other pitfall is cultural tokenism — using Indian craft elements as decoration without understanding or respecting their context. A sacred or ceremonially specific motif worn casually purely for its aesthetic effect can read as disrespectful. This is more an issue when non-Indian designers use Indian motifs, but it is worth being mindful of even as an Indian wearer.</p>

<h2>Fusion as Identity, Not Compromise</h2>
<p>The best Indo-western fusion is not about compromise — it is about complexity. It is about being a woman who is simultaneously Indian and global, rooted in a rich textile heritage and fully engaged with the contemporary world. The Indian woman who wears a handloom blazer to an international business meeting is not diluting her Indianness — she is expanding it, making it fluent in the visual language of global fashion while insisting on its own terms.</p>

<p>At Saaviya, we see Indo-western fusion not as a trend but as a permanent evolution of what Indian fashion means — a fashion that carries its past with pride while moving, always, into the future.</p>`,
      image: "https://cdn.pixabay.com/photo/2024/05/28/11/24/fashion-8793661_1280.jpg",
      author: "Sneha Satheesan",
      tags: ["indo western", "fusion fashion", "ethnic wear", "contemporary", "styling"],
      publishedAt: new Date("2026-04-22"),
    },
  ];

  for (const story of stories) {
    await prisma.blog.create({
      data: { ...story, isPublished: true },
    });
    console.log(`✅ Created: "${story.title}"`);
  }

  console.log(`\n🎉 ${stories.length} stories seeded successfully!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
