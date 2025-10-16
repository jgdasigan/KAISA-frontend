"use client";

import { useState } from "react";
import Image from "next/image";

type AboutModalProps = {
  onClose: () => void;
};

const teamMembers = [
  {
    name: "AJ Ganzon",
    role: "Lead Developer",
    agent: "Kuya Revi",
    image: "/images/revi.png",
  },
  {
    name: "Nathaniel Dimaunahan",
    role: "Backend & AI Engineer",
    agent: "Tallya",
    image: "/images/tallya.png",
  },
  {
    name: "James Ejercito",
    role: "Backend & AI Engineer",
    agent: "Principal Aralyn",
    image: "/images/aralyn.png",
  },
  {
    name: "Joyce Dasigan",
    role: "Fullstack Engineer & UI/UX Designer",
    agent: "Teacher KAI",
    image: "/images/kai.png",
  },


];

export const AboutModal = ({ onClose }: AboutModalProps) => {
  const [page, setPage] = useState<"about" | "team">("about");

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-kaisa-midnight/40 p-4 backdrop-blur">
      <div className="relative flex max-h-[85vh] w-full max-w-4xl flex-col gap-6 overflow-hidden rounded-3xl border border-white/20 bg-white/90 p-8 shadow-[0_40px_120px_-40px_rgba(12,76,179,0.6)]">
        <header className="relative flex flex-col items-center justify-center text-center">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white text-kaisa-midnight transition hover:border-kaisa-blue/40 hover:text-kaisa-blue"
            aria-label="Close about modal"
          >
            ×
          </button>

          {page === "about" && (
            <div className="max-w-2xl">
              <h3 className="mt-1 text-lg font-semibold text-kaisa-blue">
                Welcome to KAISA, your K–12 Artificial Intelligence Smart Agent
              </h3>
              <p className="mt-2 text-sm italic text-kaisa-midnight/80">
                “Kaisang matuto, Kaisang umunlad.”
              </p>
            </div>
          )}
        </header>

        {page === "about" ? (
          <>
            <section className="mx-auto space-y-4 text-sm text-kaisa-midnight/85">
              <p>
                Derived from the Tagalog word <span className="italic">“Kaisa”</span>, meaning
                <span className="italic"> “to unite”</span>, <span className="font-semibold">KAISA</span> is an AI-powered
                education companion developed by <span className="font-semibold">eCloudvalley Digital Technology</span>.
                It brings together intelligent agents to create a collaborative, engaging, and culturally rooted
                learning experience for K–12 students and educators. At <span className="font-semibold">KAISA</span>, we believe
                learning thrives when it’s guided and interactive.
              </p>
            </section>

            <section className="space-y-4 rounded-2xl bg-white/80 p-6 shadow-[0_28px_72px_-48px_rgba(12,76,179,0.45)]">
              <h4 className="text-lg font-semibold text-kaisa-midnight">Meet the KAISA Team of Smart Agents</h4>
              <ul className="space-y-4 text-sm text-kaisa-midnight/90">
                <li>
                  <span className="font-semibold text-kaisa-blue">👨‍🏫 Teacher KAI — The Supervisor Agent</span>
                  <br />
                  Your lively, friendly mentor who makes every lesson exciting and easy to understand. Teacher KAI inspires you to learn with confidence and curiosity.
                </li>
                <li>
                  <span className="font-semibold text-kaisa-blue">👩‍💼 Principal Aralyn — The Curriculum Agent</span>
                  <br />
                  Accommodating yet strict, Principal Aralyn is the organized perfectionist who ensures every lesson follows the K–12 curriculum — your ever-reliable Tita in learning.
                </li>
                <li>
                  <span className="font-semibold text-kaisa-blue">👩‍🎓 Tallya — The Quizzer Agent</span>
                  <br />
                  Your confident, competitive bestie who turns studying into a fun challenge. Tallya helps you review and test your knowledge like a true honor student.
                </li>
                <li>
                  <span className="font-semibold text-kaisa-blue">🧑‍💻 Kuya Revi — The Review Agent</span>
                  <br />
                  A patient, playful working student who’s your tutor and study buddy in one. Kuya Revi walks you through lessons step-by-step — with humor and heart to keep you motivated.
                </li>
              </ul>
            </section>

            <section className="rounded-2xl bg-kaisa-blue/10 p-6 text-sm text-kaisa-midnight">
              <h4 className="text-lg font-semibold text-kaisa-blue">Our Vision</h4>
              <p className="mt-2">
                To make learning more engaging, accessible, and personalized through AI — empowering every Filipino
                learner to grow, explore, and succeed at their own pace.
              </p>
            </section>
          </>
        ) : (
          <section className="mx-auto flex h-full max-w-2xl flex-col justify-center gap-6 rounded-2xl bg-kaisa-blue/8 p-10 text-sm text-kaisa-midnight shadow-[0_28px_72px_-48px_rgba(12,76,179,0.45)]">
            <div className="space-y-3 text-center">
              <Image
                src="/kaisa-logo-1.png"
                alt="KAISA Team"
                width={80}
                height={80}
                className="mx-auto -mt-8"
                priority
              />
              <h4 className="text-lg font-semibold text-kaisa-blue">KAISA Development Team</h4>
              <div className="grid gap-4 md:grid-cols-2">
                {teamMembers.map((member) => (
                  <div
                    key={member.name}
                    className="flex flex-col items-center gap-3 rounded-xl bg-kaisa-blue/10 px-6 py-6 text-center shadow-[0_18px_48px_-36px_rgba(12,76,179,0.35)]"
                  >
                    <Image
                      src={member.image}
                      alt={member.agent}
                      width={100}
                      height={100}
                      className="h-16 w-16"
                    />
                    <div className="space-y-1">
                      <p className="text-base font-semibold text-kaisa-midnight">
                        {member.name}
                      </p>
                      <p className="text-xs font-medium uppercase tracking-wide text-kaisa-blue/90">
                        Developer of {member.agent}
                      </p>
                      <p className="text-[0.63rem] text-kaisa-midnight/75">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-8 rounded-full transition ${page === "about" ? "bg-kaisa-blue" : "bg-kaisa-blue/30"}`}
            />
            <span
              className={`h-2 w-8 rounded-full transition ${page === "team" ? "bg-kaisa-blue" : "bg-kaisa-blue/30"}`}
            />
          </div>
          <div className="flex items-center gap-3">
            {page === "team" && (
              <button
                type="button"
                onClick={() => setPage("about")}
                className="rounded-full border border-kaisa-blue/40 px-4 py-2 text-sm font-medium text-kaisa-blue transition hover:border-kaisa-blue hover:bg-kaisa-blue/10"
              >
                Back
              </button>
            )}
            {page === "about" ? (
              <button
                type="button"
                onClick={() => setPage("team")}
                className="rounded-full bg-kaisa-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-kaisa-blue/90"
              >
                Meet the Builders
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-kaisa-blue px-4 py-2 text-sm font-semibold text-white transition hover:bg-kaisa-blue/90"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


