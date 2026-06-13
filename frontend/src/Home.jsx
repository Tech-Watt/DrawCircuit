import React from 'react';

import { Link } from 'react-router-dom';

import { Zap, BookOpen, ArrowRight, Activity, GraduationCap, Calendar, Users, Bot, Images } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { featuredTrainingImages } from './data/trainingImages';



const Home = () => {

  return (

    <div className="page-shell relative">

      <div className="bg-mesh" />

      <Navbar />



      {/* Hero */}

      <section className="relative z-10 page-section pb-16 sm:pb-24">

        <div className="page-container text-center">

          <div className="badge mx-auto mb-6">

            <Zap size={14} /> AI & Robotics Learning Platform

          </div>



          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">

            Learn. Build.<br />

            <span className="gradient-text">Innovate with AI.</span>

          </h1>



          <p className="section-subheading mx-auto mb-10">

            The professional learning hub for young innovators. Explore courses, study guides,

            and register for TechWatt workshops and events.

          </p>



          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md sm:max-w-none mx-auto">

            <Link to="/study" className="btn btn-primary btn-block sm:w-auto text-base px-8 py-4">

              Explore Courses <ArrowRight size={18} />

            </Link>

            <Link to="/events" className="btn btn-secondary btn-block sm:w-auto text-base px-8 py-4">

              Register for Events

            </Link>

          </div>



          <div className="mt-16 sm:mt-20 max-w-4xl mx-auto">

            <div className="card-elevated p-6 sm:p-10">

              <div className="grid sm:grid-cols-3 gap-6 text-left">

                {[

                  { icon: BookOpen, title: 'Study Guides', desc: 'Robotics kit guides & AI curriculum' },

                  { icon: Calendar, title: 'Live Events', desc: 'Workshops, camps & hands-on sessions' },

                  { icon: GraduationCap, title: '5+ Courses', desc: 'AI, Python, Drones & Data Analytics' },

                ].map(({ icon: Icon, title, desc }) => (

                  <div key={title} className="flex gap-4 items-start">

                    <div className="w-11 h-11 rounded-xl bg-tw-primary/10 border border-tw-primary/20 flex items-center justify-center shrink-0">

                      <Icon size={20} className="text-tw-primary" />

                    </div>

                    <div>

                      <p className="font-bold text-tw-text">{title}</p>

                      <p className="text-sm text-tw-muted mt-0.5">{desc}</p>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </div>

      </section>



      {/* Stats strip */}

      <section className="relative z-10 border-y border-tw-border bg-tw-surface/50">

        <div className="page-container py-8">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">

            {[

              { value: '5+', label: 'Course Tracks' },

              { value: 'Live', label: 'Workshops & Events' },

              { value: 'Ages 5–16', label: 'Programs Available' },

              { value: '1:1', label: 'Expert Instruction' },

            ].map((stat) => (

              <div key={stat.label}>

                <p className="text-2xl sm:text-3xl font-extrabold gradient-text">{stat.value}</p>

                <p className="text-sm text-tw-muted mt-1">{stat.label}</p>

              </div>

            ))}

          </div>

        </div>

      </section>



      {/* Features */}

      <section id="features" className="relative z-10 py-20 sm:py-28">

        <div className="page-container">

          <div className="text-center mb-14">

            <h2 className="section-heading mb-4">Everything You Need to Learn</h2>

            <p className="section-subheading mx-auto">

              From robotics kits to advanced AI — TechWatt gives young innovators the skills for tomorrow.

            </p>

          </div>



          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

            <FeatureCard

              icon={<BookOpen size={28} />}

              title="Robotics Kit Guide"

              desc="Detailed pinouts, wiring diagrams, and usage examples for every component in your kit."

              accent="primary"

            />

            <FeatureCard

              icon={<Bot size={28} />}

              title="AI for Kids"

              desc="Fun, safe, and interactive AI learning designed for young innovators ages 10+."

              accent="accent"

            />

            <FeatureCard

              icon={<GraduationCap size={28} />}

              title="Python & AI Master"

              desc="From core Python foundations to advanced Machine Learning and deployment."

              accent="success"

            />

            <FeatureCard

              icon={<Users size={28} />}

              title="Live Events"

              desc="Register for workshops, robotics camps, and hands-on TechWatt learning sessions."

              accent="warning"

            />

          </div>

        </div>

      </section>



      {/* Courses CTA */}

      <section className="relative z-10 py-20 sm:py-28 bg-tw-surface/30 border-y border-tw-border">

        <div className="page-container">

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            <div>

              <div className="badge mb-6">

                <Activity size={14} /> Comprehensive Curriculum

              </div>

              <h2 className="section-heading mb-5">Master the Future with TechWatt</h2>

              <p className="text-tw-muted text-base sm:text-lg leading-relaxed mb-8">

                Empower the next generation with structured learning paths — from AI for Kids to

                Advanced Python, Drone Engineering, and Data Analytics.

              </p>

              <ul className="space-y-4 mb-8">

                {[

                  'Master Prompt Engineering & AI Tools',

                  'Build Real Flying Drones',

                  'Analyze Data with Python & SQL',

                ].map((item) => (

                  <li key={item} className="flex items-start gap-3 text-tw-text text-sm sm:text-base">

                    <span className="w-5 h-5 rounded-full bg-tw-primary/15 text-tw-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">✓</span>

                    {item}

                  </li>

                ))}

              </ul>

              <Link to="/study" className="btn btn-primary btn-block sm:w-auto">

                Explore All Courses <ArrowRight size={18} />

              </Link>

            </div>



            <div className="card-elevated p-6 sm:p-8 space-y-4">

              {[

                { num: '01', title: 'AI for Kids', sub: 'Ages 10+ · 8 Weeks', color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },

                { num: '02', title: 'Drone Building', sub: 'Engineering · Flight', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },

                { num: '03', title: 'Data Analytics', sub: 'Excel & Python · Professional', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },

              ].map((course, i) => (

                <div key={course.num} className={`flex items-center gap-4 ${i < 2 ? 'pb-4 border-b border-tw-border' : ''}`}>

                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg border shrink-0 ${course.color}`}>

                    {course.num}

                  </div>

                  <div>

                    <p className="font-bold text-tw-text">{course.title}</p>

                    <p className="text-sm text-tw-muted">{course.sub}</p>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>



      {/* Training gallery preview */}

      <section className="relative z-10 py-20 sm:py-28 bg-tw-surface/30 border-y border-tw-border">

        <div className="page-container">

          <div className="text-center mb-10 sm:mb-12">

            <div className="badge mx-auto mb-5">

              <Images size={14} /> Hands-On Learning

            </div>

            <h2 className="section-heading mb-4">Training in Action</h2>

            <p className="section-subheading mx-auto">

              Real moments from TechWatt robotics workshops, AI classes, and student projects.

            </p>

          </div>



          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 max-w-5xl mx-auto">

            {featuredTrainingImages.map((img) => (

              <div

                key={img.id}

                className="relative aspect-[4/3] rounded-xl overflow-hidden border border-tw-border group"

              >

                <img

                  src={img.src}

                  alt={img.alt}

                  loading="lazy"

                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"

                />

                <div className="absolute inset-0 bg-gradient-to-t from-tw-text/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              </div>

            ))}

          </div>



          <div className="text-center mt-8 sm:mt-10">

            <Link to="/gallery" className="btn btn-primary btn-block sm:w-auto px-8">

              View Full Gallery <ArrowRight size={18} />

            </Link>

          </div>

        </div>

      </section>



      {/* Events CTA */}

      <section className="relative z-10 py-20 sm:py-24">

        <div className="page-container">

          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">

            <div className="card-elevated p-8 sm:p-10 text-center">

              <Calendar size={36} className="text-tw-primary mx-auto mb-5" />

              <h2 className="text-xl sm:text-2xl font-extrabold mb-3">Upcoming Events</h2>

              <p className="text-tw-muted text-sm sm:text-base mb-6">

                Join our robotics workshops, AI camps, and hands-on learning sessions.

              </p>

              <Link to="/events" className="btn btn-primary btn-block sm:w-auto px-8">Register for Events</Link>

            </div>

            <div className="card-elevated p-8 sm:p-10 text-center">

              <BookOpen size={36} className="text-tw-accent mx-auto mb-5" />

              <h2 className="text-xl sm:text-2xl font-extrabold mb-3">Start Learning Today</h2>

              <p className="text-tw-muted text-sm sm:text-base mb-6">

                Browse our study guides and course curriculum — no account required.

              </p>

              <Link to="/study" className="btn btn-primary btn-block sm:w-auto px-8">Browse Study Guide</Link>

            </div>

          </div>

        </div>

      </section>



      <Footer />

    </div>

  );

};



const accentMap = {

  primary: 'text-tw-primary bg-tw-primary/10 border-tw-primary/20 group-hover:border-tw-primary/40',

  accent: 'text-tw-accent bg-sky-500/10 border-sky-500/20 group-hover:border-sky-500/40',

  success: 'text-tw-success bg-green-500/10 border-green-500/20 group-hover:border-green-500/40',

  warning: 'text-tw-warning bg-amber-500/10 border-amber-500/20 group-hover:border-amber-500/40',

};



const FeatureCard = ({ icon, title, desc, accent = 'primary' }) => (

  <div className="card p-6 sm:p-8 group hover:-translate-y-1">

    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 border transition-colors ${accentMap[accent]}`}>

      {icon}

    </div>

    <h3 className="text-lg font-bold text-tw-text mb-2">{title}</h3>

    <p className="text-tw-muted text-sm leading-relaxed">{desc}</p>

  </div>

);



export default Home;


