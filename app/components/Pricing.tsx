'use client';

import { useState } from 'react';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for hobby projects',
    features: [
      '10 PR verifications/month',
      'Basic test generation',
      'Security scanning',
      'Debt score',
      'Community support',
    ],
    cta: 'Get Started',
    priceId: null,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/dev/month',
    description: 'For professional developers',
    features: [
      '300 PR verifications/month',
      '100k AI tokens',
      'Full verification suite',
      'Shareable reports',
      'Priority support',
      'Verified badge',
    ],
    cta: 'Start Pro',
    priceId: 'price_pro_monthly', // Replace with actual Stripe price ID
    popular: true,
  },
  {
    name: 'Team',
    price: '$99',
    period: '/team/month',
    description: 'For small teams',
    features: [
      'Up to 5 devs',
      'Unlimited verifications',
      'Unlimited AI tokens',
      'Team dashboard',
      'API access',
      'SSO coming soon',
    ],
    cta: 'Start Team',
    priceId: 'price_team_monthly', // Replace with actual Stripe price ID
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations',
    features: [
      'Self-hosting',
      'Private AI models',
      'SSO / SAML',
      '99.9% SLA',
      'Custom rules',
      'Dedicated support',
    ],
    cta: 'Contact Sales',
    priceId: null,
  },
];

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
