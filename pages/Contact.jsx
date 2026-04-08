import { Link } from "react-router-dom";
import { useState } from "react";
import { api } from "../src/utils/api";

const supportChannels = [
  {
    title: "General Support",
    value: "connectusonfitness2099@gmail.com",
    detail: "Product help, account issues, and onboarding."
  },
  {
    title: "Coaching Team",
    value: "Siddhartha Pant <iamsiddhartha23@gmail.com>",
    detail: "Program guidance, progression plans, and recovery advice."
  },
  {
    title: "Partnerships",
    value: "connectusonfitness2099@gmail.com",
    detail: "Brand collaborations and community initiatives."
  }
];

const faq = [
  {
    q: "How fast does support reply?",
    a: "Most messages are answered within one business day."
  },
  {
    q: "Can I request custom training plans?",
    a: "Yes. Include your goals, experience, and weekly availability in your message."
  },
  {
    q: "Do you support refunds?",
    a: "Yes. Billing concerns are handled by our support team after account verification."
  }
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.name || !form.email || !form.subject || !form.message) {
      setStatus({ type: "error", message: "Please fill in all fields." });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      const data = await api.post("/contact", form);

      setStatus({
        type: "success",
        message:
          data?.message ||
          "Message sent successfully. We will get back to you soon."
      });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Failed to send message."
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-(--bg) px-6 pb-20 pt-10 text-(--text-main) md:px-12">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-20 top-10 h-80 w-80 rounded-full bg-(--primary)/20 blur-[110px]" />
        <div className="absolute -right-16 bottom-0 h-96 w-96 rounded-full bg-(--secondary)/20 blur-[120px]" />
      </div>

      <section className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="rounded-3xl border border-(--text-sub)/20 bg-(--card)/70 p-7 backdrop-blur-xl md:p-9">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-(--primary)">
            Contact
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
            Let us build your next fitness breakthrough.
          </h1>
          <p className="mt-4 max-w-2xl text-(--text-sub)">
            Tell us what you need, and our team will route your request to the
            right expert. Whether it is nutrition, training, or account support,
            we are here to help.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-(--text-sub)/20 bg-(--bg)/70 p-4">
              <p className="text-sm text-(--text-sub)">Office Hours</p>
              <p className="mt-1 text-lg font-semibold">
                Mon - Fri, 8:00 AM to 6:00 PM
              </p>
            </div>
            <div className="rounded-2xl border border-(--text-sub)/20 bg-(--bg)/70 p-4">
              <p className="text-sm text-(--text-sub)">Average Reply Time</p>
              <p className="mt-1 text-lg font-semibold">Under 24 hours</p>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            {supportChannels.map((channel) => (
              <article
                key={channel.title}
                className="rounded-2xl border border-(--text-sub)/20 bg-(--bg)/60 p-4"
              >
                <p className="text-sm text-(--text-sub)">{channel.title}</p>
                <p className="mt-1 text-base font-semibold">{channel.value}</p>
                <p className="mt-1 text-sm text-(--text-sub)">
                  {channel.detail}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-(--text-sub)/20 bg-(--card)/80 p-7 backdrop-blur-xl md:p-9">
          <h2 className="text-2xl font-bold">Send a message</h2>
          <p className="mt-2 text-sm text-(--text-sub)">
            Messages are delivered directly to connectusonfitness2099@gmail.com.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Full name</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full rounded-xl border border-(--text-sub)/30 bg-transparent px-4 py-3 outline-none ring-0 placeholder:text-(--text-sub)/70 focus:border-(--primary)"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-(--text-sub)/30 bg-transparent px-4 py-3 outline-none ring-0 placeholder:text-(--text-sub)/70 focus:border-(--primary)"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">Subject</span>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="How can we help?"
                className="w-full rounded-xl border border-(--text-sub)/30 bg-transparent px-4 py-3 outline-none ring-0 placeholder:text-(--text-sub)/70 focus:border-(--primary)"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">Message</span>
              <textarea
                rows={5}
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Tell us a bit about your goal or issue..."
                className="w-full resize-none rounded-xl border border-(--text-sub)/30 bg-transparent px-4 py-3 outline-none ring-0 placeholder:text-(--text-sub)/70 focus:border-(--primary)"
              />
            </label>

            {status.message && (
              <p
                className={`rounded-lg px-3 py-2 text-sm ${
                  status.type === "success"
                    ? "bg-green-500/15 text-green-400"
                    : "bg-red-500/15 text-red-400"
                }`}
              >
                {status.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-(--primary) px-4 py-3 font-semibold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Sending..." : "Send message"}
            </button>
          </form>

          <div className="mt-8 border-t border-(--text-sub)/20 pt-5">
            <h3 className="text-lg font-semibold">Quick answers</h3>
            <div className="mt-3 space-y-3">
              {faq.map((item) => (
                <article key={item.q} className="rounded-xl bg-(--bg)/65 p-3">
                  <p className="font-medium">{item.q}</p>
                  <p className="mt-1 text-sm text-(--text-sub)">{item.a}</p>
                </article>
              ))}
            </div>
            <Link
              to="/"
              className="mt-5 inline-flex rounded-lg border border-(--text-sub)/25 px-4 py-2 text-sm font-semibold text-(--text-main) transition hover:border-(--primary)/50"
            >
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
