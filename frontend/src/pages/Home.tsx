import { Link } from "react-router-dom";
import { useAuth } from "../auth";

export function Home() {
  const { user } = useAuth();

  return (
    <div className="bg-surface-container-lowest text-on-surface antialiased selection:bg-surface-container-high selection:text-primary">
      {/* Hero Section: Clean Editorial Stance */}
      <section className="border-b border-surface-container-highest bg-surface-container-lowest relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
          <img src="https://lh3.googleusercontent.com/aida/AEtjO1URfuUpRIMPbhnyTZrdF5IBIePxtT3R06vrvbgbCDlbzZCoyWerbveFTpEdmpho_XTJDZy3UhttY-y2CD4Vl1pglJ1nY9YRApodwa8MtNqLbctx60MD0051iGek_7pbg_1RFbUgiwf1lSz7JmofYcatM9SsogzlXW6yoJpOSs1QmHJNI3H0kfeovSMf8dKBLaphZMbmGcY3PoVdDO67VC6TcDvUm-2KVQuhEDF4fpqdsumMWavoj1Dz0T4" alt="Black and white students collaborating in university library" className="w-full h-full object-cover" style={{ opacity: 0.25 }} />
          <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest via-surface-container-lowest/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface-container-lowest/60 to-surface-container-lowest" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-surface-container-low border border-outline-variant rounded font-label-sm text-label-sm text-primary uppercase mb-6 tracking-wide" style={{ color: 'rgb(5, 150, 105)', borderColor: 'rgb(5, 150, 105)' }}>
              <span className="w-1.5 h-1.5 bg-primary-container rounded-full" style={{ backgroundColor: 'rgb(5, 150, 105)' }}></span>
              University Verified Network
            </div>
            <h1 className="font-headline-xl text-headline-xl sm:text-[44px] sm:leading-[52px] text-on-surface font-bold tracking-tight mb-6">
              Where student developers collaborate on real projects
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-2xl leading-relaxed">
              Connect across computer science departments. Build production-grade software, find technical peers with complementary stacks, and replace simulated homework with peer-reviewed open code.
            </p>
            {/* CTA Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-16">
              {user ? (
                <Link to="/projects" className="flex items-center justify-center gap-2 bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded transition-colors duration-150" style={{ backgroundColor: 'rgb(5, 150, 105)', color: 'rgb(255, 255, 255)' }}>
                  Go to Projects
                  <span className="material-symbols-outlined text-[16px]" data-icon="arrow_forward">arrow_forward</span>
                </Link>
              ) : (
                <>
                  <Link to="/login" className="flex items-center justify-center gap-2 bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded transition-colors duration-150" style={{ backgroundColor: 'rgb(5, 150, 105)', color: 'rgb(255, 255, 255)' }}>
                    Log in
                  </Link>
                  <Link to="/register" className="flex items-center justify-center gap-2 bg-surface-container-lowest hover:bg-surface-container-low text-on-surface border border-outline-variant font-label-md text-label-md px-6 py-3 rounded transition-colors duration-150">
                    Join Campus Connect
                  </Link>
                </>
              )}
            </div>
          </div>
          {/* Minimal Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-surface-container-highest border border-surface-container-highest rounded overflow-hidden">
            <div className="bg-surface-container-lowest p-6">
              <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1">Active Developers</p>
              <div className="font-headline-lg text-headline-lg text-on-surface font-bold">12,480+</div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Verified with .edu domain</p>
            </div>
            <div className="bg-surface-container-lowest p-6">
              <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1">Partner Institutions</p>
              <div className="font-headline-lg text-headline-lg text-on-surface font-bold">450+</div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Departments and student labs</p>
            </div>
            <div className="bg-surface-container-lowest p-6">
              <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1">Shipped Repositories</p>
              <div className="font-headline-lg text-headline-lg text-on-surface font-bold">1,820+</div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Live in production this semester</p>
            </div>
          </div>
        </div>
      </section>
      {/* Editorial Section: How It Works */}
      <section className="py-16 sm:py-20 border-b border-surface-container-highest bg-surface-bright" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <h2 className="font-headline-md text-headline-md text-on-surface font-bold mb-2">Architected for production, not resumes</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Three methodical steps to find a team and ship resilient code.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-surface-container-lowest border border-surface-container-highest rounded p-6 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded bg-surface-container-low border border-outline-variant flex items-center justify-center font-label-md text-primary font-bold mb-4" style={{ color: 'rgb(5, 150, 105)' }}>
                  01
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-2">Publish Project Blueprint</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Specify your tech stack, system architecture requirements, and precise engineering roles missing from your squad.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-surface-container-high flex items-center gap-2 text-outline font-label-sm text-label-sm uppercase">
                <span className="material-symbols-outlined text-[16px]" data-icon="terminal">terminal</span>
                Stack declaration
              </div>
            </div>
            {/* Step 2 */}
            <div className="bg-surface-container-lowest border border-surface-container-highest rounded p-6 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded bg-surface-container-low border border-outline-variant flex items-center justify-center font-label-md text-primary font-bold mb-4" style={{ color: 'rgb(5, 150, 105)' }}>
                  02
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-2">Direct Skill Match</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Filter peers by verified campus department, GitHub profile proof, and specific domain proficiencies like distributed systems.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-surface-container-high flex items-center gap-2 text-outline font-label-sm text-label-sm uppercase">
                <span className="material-symbols-outlined text-[16px]" data-icon="verified">verified</span>
                Peer authentication
              </div>
            </div>
            {/* Step 3 */}
            <div className="bg-surface-container-lowest border border-surface-container-highest rounded p-6 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded bg-surface-container-low border border-outline-variant flex items-center justify-center font-label-md text-primary font-bold mb-4" style={{ color: 'rgb(5, 150, 105)' }}>
                  03
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-2">Deploy &amp; Showcase</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Publish commits, integrate CI/CD workflows, and generate department-recognized project transcripts for industry recruiters.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-surface-container-high flex items-center gap-2 text-outline font-label-sm text-label-sm uppercase">
                <span className="material-symbols-outlined text-[16px]" data-icon="deployed_code">deployed_code</span>
                Verified delivery
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Bento Project Showcase */}
      <section className="py-16 sm:py-24 border-b border-surface-container-highest bg-surface-container-lowest" id="projects">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider block mb-1" style={{ color: 'rgb(5, 150, 105)' }}>Live Repositories</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Featured Student Workspaces</h2>
            </div>
            <div className="flex items-center gap-2 border border-outline-variant rounded p-1 bg-surface-container-low self-start">
              <button className="px-3 py-1 text-primary bg-surface-container-lowest rounded font-label-sm text-label-sm font-semibold border border-outline-variant" style={{ color: 'rgb(5, 150, 105)', borderColor: 'rgb(5, 150, 105)' }}>All Systems</button>
              <button className="px-3 py-1 text-on-surface-variant hover:text-on-surface rounded font-label-sm text-label-sm">Machine Learning</button>
              <button className="px-3 py-1 text-on-surface-variant hover:text-on-surface rounded font-label-sm text-label-sm">Cloud Infrastructure</button>
            </div>
          </div>
          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Large Card: Main Project */}
            <div className="md:col-span-2 bg-surface-container-lowest border border-outline-variant rounded p-6 sm:p-8 flex flex-col justify-between hover:border-outline transition-colors">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-secondary-container text-secondary font-label-sm text-label-sm rounded font-medium">
                    <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span>
                    Recruiting 2 Contributors
                  </span>
                  <span className="font-label-sm text-label-sm text-outline">UC Berkeley &times; Stanford</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold mb-3">
                  HyperKernel: Lightweight Microkernel for Edge Sensors
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                  An open-source POSIX-compatible research kernel optimized for RISC-V development boards with under 64KB RAM. Benchmarked against real-time automotive sensors with zero-allocation schedulers.
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  <span className="px-2.5 py-1 bg-surface-container-low text-on-surface border border-outline-variant rounded font-label-sm text-label-sm">Rust</span>
                  <span className="px-2.5 py-1 bg-surface-container-low text-on-surface border border-outline-variant rounded font-label-sm text-label-sm">RISC-V</span>
                  <span className="px-2.5 py-1 bg-surface-container-low text-on-surface border border-outline-variant rounded font-label-sm text-label-sm">C11</span>
                  <span className="px-2.5 py-1 bg-surface-container-low text-on-surface border border-outline-variant rounded font-label-sm text-label-sm">QEMU</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-surface-container-high">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm flex items-center justify-center">J</div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Lead: Julian Cheng (Systems Lab)</span>
                </div>
                <a className="font-label-md text-label-md text-primary-container hover:text-primary flex items-center gap-1 font-semibold" href="#">
                  View Specs
                  <span className="material-symbols-outlined text-[16px]" data-icon="chevron_right">chevron_right</span>
                </a>
              </div>
            </div>
            {/* Project Card 2 */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded p-6 flex flex-col justify-between hover:border-outline transition-colors">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm rounded font-medium border border-outline-variant">
                    Full Team
                  </span>
                  <span className="font-label-sm text-label-sm text-outline">CMU</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-2">
                  SynapseQuery: Distributed Vector Index
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
                  High-recall approximate nearest neighbor search library written in Go with raft-based replication.
                </p>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  <span className="px-2 py-0.5 bg-surface-container-low text-on-surface border border-outline-variant rounded font-label-sm text-label-sm">Go</span>
                  <span className="px-2 py-0.5 bg-surface-container-low text-on-surface border border-outline-variant rounded font-label-sm text-label-sm">gRPC</span>
                  <span className="px-2 py-0.5 bg-surface-container-low text-on-surface border border-outline-variant rounded font-label-sm text-label-sm">Raft</span>
                </div>
              </div>
              <div className="pt-4 border-t border-surface-container-high flex items-center justify-between">
                <span className="font-body-sm text-body-sm text-outline">18 stars</span>
                <a className="font-label-sm text-label-sm text-primary hover:underline" href="#">Repository</a>
              </div>
            </div>
            {/* Project Card 3 */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded p-6 flex flex-col justify-between hover:border-outline transition-colors">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-secondary-container text-secondary font-label-sm text-label-sm rounded font-medium">
                    1 Role Open
                  </span>
                  <span className="font-label-sm text-label-sm text-outline">MIT CSAIL</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-2">
                  MedScan-Vision
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
                  Self-supervised transformer model identifying thoracic anomalies from anonymized hospital DICOM scans.
                </p>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  <span className="px-2 py-0.5 bg-surface-container-low text-on-surface border border-outline-variant rounded font-label-sm text-label-sm">Python</span>
                  <span className="px-2 py-0.5 bg-surface-container-low text-on-surface border border-outline-variant rounded font-label-sm text-label-sm">PyTorch</span>
                  <span className="px-2 py-0.5 bg-surface-container-low text-on-surface border border-outline-variant rounded font-label-sm text-label-sm">CUDA</span>
                </div>
              </div>
              <div className="pt-4 border-t border-surface-container-high flex items-center justify-between">
                <span className="font-body-sm text-body-sm text-outline">Seeking: PyTorch Eng</span>
                <a className="font-label-sm text-label-sm text-primary hover:underline" href="#">Apply</a>
              </div>
            </div>
            {/* Project Card 4 */}
            <div className="md:col-span-2 bg-surface-container-lowest border border-outline-variant rounded p-6 sm:p-8 flex flex-col justify-between hover:border-outline transition-colors">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-secondary-container text-secondary font-label-sm text-label-sm rounded font-medium">
                    3 Open Roles
                  </span>
                  <span className="font-label-sm text-label-sm text-outline">UT Austin</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold mb-3">
                  CampusFlow: Autonomous Shuttle Transit Tracker
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                  Real-time GTFS-RT feed aggregator and React Native client built for 50,000+ daily commuter students. Features offline mesh sync between buses via low-energy Bluetooth relays.
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-2.5 py-1 bg-surface-container-low text-on-surface border border-outline-variant rounded font-label-sm text-label-sm">React Native</span>
                  <span className="px-2.5 py-1 bg-surface-container-low text-on-surface border border-outline-variant rounded font-label-sm text-label-sm">Node.js</span>
                  <span className="px-2.5 py-1 bg-surface-container-low text-on-surface border border-outline-variant rounded font-label-sm text-label-sm">PostgreSQL</span>
                  <span className="px-2.5 py-1 bg-surface-container-low text-on-surface border border-outline-variant rounded font-label-sm text-label-sm">Redis</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-surface-container-high">
                <div className="flex items-center gap-2">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Looking for Frontend &amp; Geodata contributors</span>
                </div>
                <a className="font-label-md text-label-md text-primary-container hover:text-primary flex items-center gap-1 font-semibold" href="#">
                  View Specs
                  <span className="material-symbols-outlined text-[16px]" data-icon="chevron_right">chevron_right</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Community & University Trust Rail */}
      <section className="py-16 border-b border-surface-container-highest bg-surface-bright" id="community">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-1">Adopted Across Premier Engineering Faculties</h2>
            <p className="font-body-sm text-body-sm text-outline">Students from top departments run capstone projects on Campus Connect</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 text-center">
            <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded font-label-md text-label-md text-on-surface-variant font-semibold">
              MIT CSAIL
            </div>
            <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded font-label-md text-label-md text-on-surface-variant font-semibold">
              Stanford CS
            </div>
            <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded font-label-md text-label-md text-on-surface-variant font-semibold">
              UC Berkeley EECS
            </div>
            <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded font-label-md text-label-md text-on-surface-variant font-semibold">
              CMU SCS
            </div>
            <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded font-label-md text-label-md text-on-surface-variant font-semibold">
              UT Austin ECE
            </div>
            <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded font-label-md text-label-md text-on-surface-variant font-semibold">
              Waterloo SE
            </div>
          </div>
        </div>
      </section>
      {/* Minimal Signup Banner */}
      <section className="py-16 sm:py-20 bg-surface-container-lowest border-b border-surface-container-highest" id="auth">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight mb-4">
            Ready to start building?
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mx-auto mb-8">
            Join over 12,000 university students constructing peer-reviewed open source tools. Instant verification via .edu email.
          </p>
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <input className="flex-1 px-4 py-2.5 bg-surface-container-lowest text-on-surface border border-outline-variant rounded font-body-md text-body-md focus:outline-none focus:border-primary-container" placeholder="your.name@university.edu" required type="email" />
            <button className="bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md px-5 py-2.5 rounded transition-colors duration-150 font-medium whitespace-nowrap" type="submit" style={{ backgroundColor: 'rgb(5, 150, 105)', color: 'rgb(255, 255, 255)' }}>
              Get Started
            </button>
          </form>
          <p className="font-body-sm text-body-sm text-outline mt-3">Free and open for all enrolled students &amp; faculty mentors.</p>
        </div>
      </section>
    </div>
  );
}
