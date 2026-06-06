export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Meet <span className="text-blue-600">Astra AI</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your intelligent AI assistant for smarter conversations. Powered by OpenAI's cutting-edge technology.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
            Get Started Free
          </button>
          <button className="px-8 py-3 rounded-lg border-2 border-gray-300 text-gray-900 font-semibold hover:border-gray-400 transition">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
