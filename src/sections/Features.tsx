export function Features() {
  const features = [
    {
      title: 'Smart Conversations',
      description: 'Engage with an AI that understands context and provides thoughtful responses.',
      icon: '💬',
    },
    {
      title: 'Daily Limits',
      description: 'Fair usage limits ensure quality service for all users.',
      icon: '⏱️',
    },
    {
      title: 'Secure & Private',
      description: 'Your conversations are protected with enterprise-grade security.',
      icon: '🔒',
    },
    {
      title: 'Always Available',
      description: '24/7 access to your AI assistant whenever you need it.',
      icon: '⚡',
    },
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Why Choose Astra AI?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="p-6 rounded-lg border border-gray-200 hover:shadow-lg transition">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
