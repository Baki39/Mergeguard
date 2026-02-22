# MergeGuard - Potential Clients List

## Target Audience
- Indie hackers using AI coding tools
- Small dev teams (2-10 people)
- Agencies building with AI

## Where to Find Them

### 1. Twitter/X - Search for:
- "using copilot" / "using claude code" / "using gemini"
- "AI generated code" + "bug" / "production"
- "code review" + "AI"
- "@githubnext" followers
- "@AnthropicAI" followers
- "@OpenAI" developers

### 2. Reddit - Post in:
- r/programming
- r/ArtificialIntelligence
- r/indiehackers
- r/ChatGPTCoding
- r/devops
- r/learnprogramming

### 3. Hacker News
- Submit to: https://news.ycombinator.com/submit
- Title: "MergeGuard - Verify every AI-generated PR in 30 seconds"

### 4. LinkedIn
- Post in: Developer, CTO, Tech Lead groups
- Connect with people posting about AI coding

### 5. Discord Servers
- Vercel Discord
- Next.js Discord
- LangChain Discord
- OpenAI Community

## Cold Outreach Template

### Twitter DM
```
Hey [Name]! 

Saw your tweet about [their tweet]. Totally agree - AI coding is amazing but the verification part is missing.

I built MergeGuard - automatically verifies every PR in 30 seconds. Scans security, generates tests, scores debt.

Worth a look: https://mergeguard.vercel.app

No pressure! 🙌
```

### Email Template
```
Subject: Quick question about your AI coding setup

Hi [Name],

I noticed you're building [Company] - pretty cool!

Question: How do you verify the code AI tools generate? 

I ask because I just launched MergeGuard - automatically tests, scans security, and scores technical debt on every PR.

Would love your feedback.

Best,
Baki

P.S. Free for indie developers: https://mergeguard.vercel.app
```

## First 10 People to Reach Out To

Based on Twitter activity (search and connect):

1. @swyx - Developer experience leader
2. @leerob - Senior Developer Advocate
3. @jhooks - Indie hacker
4. @ levelsio - Maker
5. @mattn便利店 - Developer
6. @sarah_ockman - Tech writer
7. @tinyprojectsco - Indie hacker
8. @prince_ocean - Developer
9. @AgaPorebska - Developer
10. @thorstenstark - Developer

## Content to Post

### Twitter (Post now!)
```
🛡️ I built MergeGuard after watching AI code crash in production.

Now every PR gets verified in 30 seconds:
- Security scan
- Auto tests
- Debt score
- Merge blocking

Try it free: https://mergeguard.vercel.app

#AIcoding #DevTools
```

### Reddit (Copy/paste from SOCIAL_POSTS.md)
```

```

---

## TODO for Baki:
1. ⬜ Post on Twitter
2. ⬜ Submit to Hacker News
3. ⬜ Post on Reddit (r/programming, r/indiehackers)
4. ⬜ Send 5 DMs to developers
5. ⬜ Add to LinkedIn
```

export default function Pricing() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string | null) => {
    if (!priceId) return;
    
    setLoading(priceId);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <section className="py-24 px-4 bg-black" id="pricing">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">
          Simple, transparent <span className="gradient-text">pricing</span>
        </h2>
        <p className="text-xl text-gray-400 text-center mb-16">
          Start free. Upgrade when you're ready. No hidden fees.
        </p>
        
        <div className="grid md:grid-cols-4 gap-6">
          {PLANS.map((plan) => (
            <div 
              key={plan.name}
              className={`glass rounded-2xl p-6 ${plan.popular ? 'border-blue-500' : ''}`}
              style={plan.popular ? { borderColor: 'rgba(37, 99, 235, 0.5)' } : {}}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-500 rounded-full text-sm font-semibold">
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <div className="text-4xl font-bold mb-4">
                {plan.price}<span className="text-lg font-normal text-gray-400">{plan.period}</span>
              </div>
              <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
              <ul className="space-y-3 text-gray-400 mb-8 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature}>✅ {feature}</li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(plan.priceId)}
                disabled={loading === plan.priceId || !plan.priceId}
                className={`block w-full py-3 text-center rounded-xl font-semibold transition-all ${
                  plan.popular 
                    ? 'bg-blue-600 hover:bg-blue-500' 
                    : 'border border-white/20 hover:bg-white/10'
                } ${!plan.priceId ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading === plan.priceId ? 'Loading...' : plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
