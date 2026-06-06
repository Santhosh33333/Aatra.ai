import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { Check } from 'lucide-react';
import { PAYMENT_PLANS, OFFERS, ADMIN_EMAIL } from '../lib/paymentPlans';

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const planId = searchParams.get('plan') || 'pro';
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const plan = PAYMENT_PLANS.find(p => p.id === planId);
  if (!plan) return <div className="min-h-screen bg-[#080c18]" />;

  const handleCheckout = async () => {
    if (plan.price === 0) {
      navigate('/sign-up');
      return;
    }

    setLoading(true);
    try {
      // Simulate Stripe integration
      const message = `Checkout for ${plan.name} plan ($${plan.price}/month)${selectedOffer ? ` with ${selectedOffer} offer` : ''}`;
      console.log('[v0] Payment:', message);
      
      // In production, integrate with Stripe:
      // const response = await fetch('/api/create-checkout-session', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ priceId: plan.stripePriceId, planId: plan.id })
      // });
      // const { sessionId } = await response.json();
      // window.location.href = `https://checkout.stripe.com/pay/${sessionId}`;

      // For now, show contact form
      window.location.href = `mailto:${ADMIN_EMAIL}?subject=Astra AI - ${plan.name} Plan Purchase&body=I would like to purchase the ${plan.name} plan for $${plan.price}/month.`;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy to-[#1e2332] text-white pt-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Checkout</h1>
          <p className="text-gray-400">Complete your purchase and start using Astra Pro</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Plan Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-6">
              <h2 className="text-2xl font-bold mb-6">{plan.name} Plan</h2>
              
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check size={20} className="text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400">Monthly price:</span>
                  <span className="text-3xl font-bold">${plan.price}</span>
                </div>
                {plan.originalPrice && (
                  <div className="flex justify-between items-center text-sm text-green-400">
                    <span>You save:</span>
                    <span>${plan.originalPrice - plan.price}/month</span>
                  </div>
                )}
              </div>
            </div>

            {/* Offers Section */}
            {OFFERS.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <h3 className="text-xl font-bold mb-6">Special Offers</h3>
                <div className="space-y-3">
                  {OFFERS.map(offer => (
                    <label key={offer.id} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${
                      selectedOffer === offer.id 
                        ? 'bg-amber-500/20 border-amber-400' 
                        : 'border-white/10 hover:border-white/20'
                    }`}>
                      <input
                        type="radio"
                        name="offer"
                        value={offer.id}
                        checked={selectedOffer === offer.id}
                        onChange={(e) => setSelectedOffer(e.target.value)}
                        className="w-4 h-4"
                      />
                      <div className="ml-3 flex-1">
                        <div className="font-semibold">{offer.name}</div>
                        {offer.discount && <div className="text-sm text-green-400">{offer.discount} discount</div>}
                      </div>
                      {offer.discountedPrice && (
                        <div className="text-right">
                          <div className="font-bold">${offer.discountedPrice}</div>
                          <div className="text-sm text-gray-400">was ${offer.originalPrice}</div>
                        </div>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-b from-white/10 to-white/5 border border-white/10 rounded-2xl p-6 sticky top-20">
              <h3 className="text-lg font-bold mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">{plan.name} Plan</span>
                  <span>${plan.price}/mo</span>
                </div>
                {selectedOffer && (
                  <div className="flex justify-between text-green-400">
                    <span>{selectedOffer}</span>
                    <span>-${OFFERS.find(o => o.id === selectedOffer)?.savings || 0}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 pt-6 mb-6">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>${plan.price}</span>
                </div>
                <div className="text-sm text-gray-400 mt-2">Billed monthly</div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-400 to-cyan-400 text-[#080c18] py-3 rounded-full font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Processing...' : plan.price === 0 ? 'Get Started' : 'Proceed to Payment'}
              </button>

              <button
                onClick={() => navigate('/sign-up')}
                className="w-full mt-3 border border-white/20 text-white py-3 rounded-full font-semibold hover:bg-white/5 transition-colors"
              >
                Back
              </button>

              <div className="mt-6 pt-6 border-t border-white/10 text-sm text-gray-400">
                <p className="mb-2">Questions? Contact support</p>
                <a href={`mailto:${ADMIN_EMAIL}`} className="text-amber-400 hover:text-amber-300">
                  {ADMIN_EMAIL}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
