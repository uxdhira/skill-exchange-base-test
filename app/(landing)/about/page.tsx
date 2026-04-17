"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Heart, Target, Users } from "lucide-react";
import Link from "next/link";

export default function About() {
  return (
    <>
      {/* Hero */}
      <div className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-extrabold mb-16 text-slate-900">
            About <span className="text-blue-950">SkillSpill</span>
          </h1>
          <p className="text-lg text-muted-foreground text-slate-700 font-semibold">
            Building a community where knowledge is exchanged, not sold
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* Mission */}
          <section>
            <h2 className=" text-2xl font-bold text-left mb-8 text-slate-800">
              Our Mission
            </h2>
            <p className="text-slate-700 font-semibold ">
              SkillSpill is dedicated to creating a world where learning is
              accessible to everyone. We believe that everyone has valuable
              skills to share, and everyone has something new to learn. By
              facilitating skill exchanges instead of monetary transactions, we
              are building a more equitable and collaborative learning
              community.
            </p>
          </section>

          {/* Values */}
          <section>
            <h2 className="text-2xl font-bold text-left mb-8 text-slate-800">
              Our Values
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-blue-50">
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 bg-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="h-6 w-6 text-blue-700" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Community First</h3>
                      <p className="text-sm text-muted-foreground text-slate-700">
                        We prioritize building meaningful connections and
                        fostering a supportive learning environment for all
                        members.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 bg-green-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Heart className="h-6 w-6 text-green-700" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Equal Exchange</h3>
                      <p className="text-sm text-muted-foreground text-slate-700">
                        Every skill has value. We believe in fair exchanges
                        where both parties benefit equally from the experience.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-purple-50">
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 bg-purple-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="h-6 w-6 text-purple-700" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Lifelong Learning</h3>
                      <p className="text-sm text-muted-foreground text-slate-700">
                        We encourage continuous growth and development through
                        diverse skill exchanges and collaborative learning.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-orange-50">
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 bg-orange-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="h-6 w-6 text-orange-700" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Quality & Trust</h3>
                      <p className="text-sm text-muted-foreground text-slate-700">
                        We maintain high standards through our review system and
                        moderation to ensure safe, quality exchanges.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Story */}
          <section>
            <h2 className="text-2xl font-bold text-left mb-8 text-slate-800">
              Our Story
            </h2>
            <div className="space-y-4 text-muted-foreground text-slate-700 font-semibold">
              <p>
                SkillSpill was founded in 2026 with a simple idea: <br />
                <span className="text-slate-900  font-bold">
                  What if we could learn new skills without the barrier of cost?
                </span>
                <br />
                Our founders recognized that traditional education and
                skill-learning platforms often exclude those who can not afford
                expensive courses or tutoring.
              </p>
              <p>
                By creating a platform where people exchange skills directly, we
                are removing financial barriers while building stronger
                communities. Whether you are a professional photographer
                teaching composition in exchange for learning web development,
                or a chef sharing cooking techniques in exchange for language
                lessons, SkillSpill makes it possible.
              </p>
              <p>
                Today, our community includes thousands of learners and teachers
                from diverse backgrounds, all united by a passion for sharing
                knowledge and continuous growth.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-blue-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-center mb-8 text-slate-900">
              Join Our Community
            </h2>
            <p className="text-lg text-muted-foreground mb-6 text-slate-700 font-semibold">
              Start exchanging skills today and become part of our growing
              community
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" variant="default" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/browse">Browse Skills</Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
