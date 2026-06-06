export function ChatWidget() {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Try Astra AI Now
        </h2>
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
          {/* Chat simulation */}
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1 bg-gray-100 rounded-lg p-4 text-gray-700">
                <p className="text-sm">Hi! I&apos;m Astra AI. How can I help you today?</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <div className="bg-blue-600 text-white rounded-lg p-4">
                <p className="text-sm">What can you do?</p>
              </div>
            </div>
          </div>

          {/* Input area */}
          <div className="flex gap-2 pt-4 border-t">
            <input
              type="text"
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
              Send
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Sign up to start chatting with unlimited messages per day (within daily limit).
          </p>
        </div>
      </div>
    </section>
  );
}
