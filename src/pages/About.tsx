import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Target, Eye, Heart, Users, Award, Globe, Linkedin, Twitter } from "lucide-react";
import { teamMembers, stats } from "@/data/team";

const values = [
  { icon: Award, title: "Excellence", description: "We deliver world-class training that meets international standards while addressing African contexts." },
  { icon: Users, title: "Accessibility", description: "Quality cybersecurity education should be available to everyone, regardless of background." },
  { icon: Target, title: "Practical Skills", description: "Theory alone isn't enough. Our hands-on approach prepares you for real-world challenges." },
  { icon: Heart, title: "Community", description: "We're building a network of African cybersecurity professionals who support each other." },
];

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-hero py-16">
        <div className="container-custom">
          <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">About Us</Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Securing Africa's Digital Future
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Cyber Defend Africa Academy was founded with a singular mission: to bridge the cybersecurity skills gap 
            across the African continent and empower the next generation of security professionals.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-card border-border">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">Our Mission</h2>
                <p className="text-muted-foreground">
                  To provide accessible, practical, and industry-relevant cybersecurity training that empowers 
                  individuals and organizations across Africa to protect their digital assets and thrive in the 
                  global digital economy.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-accent" />
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">Our Vision</h2>
                <p className="text-muted-foreground">
                  To be Africa's leading cybersecurity academy, producing world-class security professionals who 
                  protect organizations locally and contribute to global cybersecurity excellence.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-secondary/30">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl font-bold text-foreground mb-6">Our Story</h2>
            <p className="text-muted-foreground mb-4">
              Africa's digital transformation is accelerating at an unprecedented pace. From mobile banking to 
              e-government, millions of Africans are coming online every year. But with this growth comes 
              increased exposure to cyber threats.
            </p>
            <p className="text-muted-foreground mb-4">
              We recognized a critical gap: while the demand for cybersecurity professionals was skyrocketing, 
              quality training programs tailored to African contexts were scarce. Most available certifications 
              were expensive, foreign, and didn't address the unique challenges facing African organizations.
            </p>
            <p className="text-muted-foreground">
              Cyber Defend Africa Academy was born to fill this gap. We combine international best practices 
              with deep understanding of African business environments, creating training that's both world-class 
              and locally relevant.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">Our Core Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do, from course development to student support.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="bg-card border-border text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding bg-primary/5">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-display text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our leadership team brings decades of combined experience in cybersecurity and education.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <Card key={member.id} className="bg-card border-border overflow-hidden">
                <img src={member.avatar} alt={member.name} className="w-full h-64 object-cover" />
                <CardContent className="p-5">
                  <h3 className="font-display font-semibold text-foreground">{member.name}</h3>
                  <p className="text-sm text-primary mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{member.bio}</p>
                  <div className="flex gap-2">
                    {member.linkedin && (
                      <a href={member.linkedin} className="p-2 bg-secondary rounded-lg text-muted-foreground hover:text-primary transition-colors">
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {member.twitter && (
                      <a href={member.twitter} className="p-2 bg-secondary rounded-lg text-muted-foreground hover:text-primary transition-colors">
                        <Twitter className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}