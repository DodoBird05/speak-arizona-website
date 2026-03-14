"use client";

import { useState } from "react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      {/* Hero */}
      <section className="bg-blue py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 text-center text-white">
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl mb-6">
            Get in Touch
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto">
            Have a question, want to be a guest, or just want to say hello?
            We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-2xl mx-auto px-6">
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-yellow rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="font-heading font-bold text-2xl text-black mb-4">
                Message Sent!
              </h2>
              <p className="text-text-light text-lg">
                Thanks for reaching out. We&apos;ll get back to you soon.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="space-y-6"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block font-heading font-medium text-text mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent transition"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block font-heading font-medium text-text mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent transition"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block font-heading font-medium text-text mb-2"
                >
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent transition"
                >
                  <option value="general">General Inquiry</option>
                  <option value="guest">I&apos;d Like to Be a Guest</option>
                  <option value="sponsorship">Sponsorship</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block font-heading font-medium text-text mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent transition resize-none"
                  placeholder="What's on your mind?"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue text-white font-heading font-bold py-3 rounded-full hover:bg-blue-light transition-colors"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
