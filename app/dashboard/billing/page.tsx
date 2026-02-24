// app/dashboard/billing/page.tsx
import { getCurrentOrganization, getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { 
  CreditCard, 
  Check, 
  Zap,
  Users,
  Shield,
  ArrowRight,
  Crown,
  Building
} from "lucide-react";

export default async function BillingPage() {
  const organization = await getCurrentOrganization();
  const user = await getCurrentUser();

  if (!organization) {
    return <div>Organization not found</div>;
  }

  const plans = [
    {
      name: "Free",
      price: 0,
      id: "FREE",
      features: [
        "10 verifications/month",
        "Basic security scanning",
        "1 team member",
        "Community support",
        "GitHub integration",
      ],
      limits: {
        verifications: 10,
        team: 1,
      },
    },
    {
      name: "Pro",
      price: 19,
      id: "PRO",
      popular: true,
      features: [
        "300 verifications/month",
        "Advanced security scanning (100+ rules)",
        "5 team members",
        "Priority support",
        "All integrations",
        "Custom thresholds",
        "Detailed reports",
      ],
      limits: {
        verifications: 300,
        team: 5,
      },
    },
    {
      name: "Team",
      price: 99,
      id: "TEAM",
      features: [
        "1,000 verifications/month",
        "Enterprise security scanning",
        "25 team members",
        "Dedicated support",
        "SSO/SAML",
        "API access",
        "Custom integrations",
        "SLA guarantee",
      ],
      limits: {
        verifications: 1000,
        team: 25,
      },
    },
    {
      name: "Enterprise",
      price: "Custom",
      id: "ENTERPRISE",
      features: [
        "Unlimited verifications",
        "Custom security rules",
        "Unlimited team members",
        "24/7 dedicated support",
        "On-premise deployment",
        "Custom SLA",
        "Training sessions",
        "Security audit",
      ],
      limits: {
        verifications: 999999,
        team: 999,
      },
    },
  ];

  const currentPlan = plans.find(p => p.id === organization.plan) || plans[0];
  const usagePercent = Math.round((organization.monthlyVerifications / currentPlan.limits.verifications) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <p className="text-gray-500">Manage your subscription and usage</p>
      </div>

      {/* Current Plan */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Current Plan</p>
            <div className="flex items-center gap-2 mt-1">
              <h2 className="text-2xl font-bold text-gray-900">{currentPlan.name}</h2>
              {organization.plan !== "FREE" && (
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                  Active
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900">
              {currentPlan.price === "Custom" ? "Custom" : `$${currentPlan.price}`}
              {currentPlan.price !== "Custom" && <span className="text-lg text-gray-500 font-normal">/mo</span>}
            </p>
          </div>
        </div>

        {/* Usage Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Monthly Usage</span>
            <span className="font-medium">
              {organization.monthlyVerifications} / {currentPlan.limits.verifications} verifications
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all ${
                usagePercent > 90 ? "bg-red-500" : usagePercent > 70 ? "bg-yellow-500" : "bg-emerald-500"
              }`}
              style={{ width: `${Math.min(usagePercent, 100)}%` }}
            />
          </div>
          {usagePercent > 80 && (
            <p className="text-sm text-yellow-600 mt-2">
              ⚠️ You've used {usagePercent}% of your monthly verifications. Consider upgrading.
            </p>
          )}
        </div>

        {organization.plan !== "FREE" && organization.plan !== "ENTERPRISE" && (
          <div className="mt-6 flex gap-3">
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              Change Plan
            </button>
            <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
              Cancel Subscription
            </button>
          </div>
        )}
      </div>

      {/* Plan Cards */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => {
            const isCurrent = plan.id === organization.plan;
            
            return (
              <div
                key={plan.id}
                className={`bg-white rounded-xl border-2 p-6 ${
                  plan.popular 
                    ? "border-emerald-500 relative" 
                    : isCurrent 
                      ? "border-emerald-300 bg-emerald-50" 
                      : "border-gray-200"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full">
                    Most Popular
                  </div>
                )}
                
                <div className="flex items-center gap-2 mb-4">
                  {plan.id === "ENTERPRISE" ? (
                    <Building className="w-5 h-5 text-gray-600" />
                  ) : (
                    <Crown className={`w-5 h-5 ${plan.popular ? "text-emerald-600" : "text-gray-600"}`} />
                  )}
                  <h4 className="font-semibold text-gray-900">{plan.name}</h4>
                </div>

                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    {plan.price === "Custom" ? "Custom" : `$${plan.price}`}
                  </span>
                  {plan.price !== "Custom" && (
                    <span className="text-gray-500">/month</span>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <button
                    disabled
                    className="w-full py-2 bg-emerald-100 text-emerald-700 font-medium rounded-lg cursor-not-allowed"
                  >
                    Current Plan
                  </button>
                ) : plan.price === "Custom" ? (
                  <button className="w-full py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50">
                    Contact Sales
                  </button>
                ) : (
                  <form action="/api/stripe/checkout" method="POST">
                    <input type="hidden" name="plan" value={plan.id} />
                    <button
                      type="submit"
                      className="w-full py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 flex items-center justify-center gap-2"
                    >
                      {plan.price < currentPlan.price ? "Downgrade" : "Upgrade"}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Method */}
      {organization.plan !== "FREE" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                <p className="text-sm text-gray-500">Expires 12/2026</p>
              </div>
            </div>
            <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
              Update
            </button>
          </div>
        </div>
      )}

      {/* Billing History */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing History</h3>
        <p className="text-gray-500 text-sm">No billing history yet.</p>
      </div>
    </div>
  );
}
