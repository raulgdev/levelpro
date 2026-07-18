export type Locale = "en" | "de" | "es";

export interface Translation {
  nav: { home: string; links: string[]; cta: string };
  hero: {
    eyebrow: string; est: string;
    titleLine1: string; titleLine2: string; titleLine3: string;
    tagline: string;
    ctaPrimary: string; ctaSecondary: string;
    locations: string[];
    statsLabels: { projects: string; years: string; mobilization: string };
    scroll: string;
  };
  about: { label: string; body: string };
  services: {
    label: string;
    headingLine1: string; headingLine2: string; headingLine3: string;
    tagline: string;
    items: Array<{ name: string; detail: string; shortDesc: string; bullets: string[] }>;
  };
  servicesCta: { heading: string; body: string; btn: string };
  stats: {
    label: string; heading: string; equipmentBtn: string;
    items: Array<{ label: string }>;
  };
  materials: {
    heading: string; tagline: string;
    cards: Array<{ title: string; desc: string }>;
  };
  projects: {
    label: string;
    heading: string;
    items: Array<{ type: string; shortDesc: string; fullDesc: string; tags: string[] }>;
    metaKeys: { year: string; type: string; budget: string; location: string; status: string };
    learnMore: string;
    viewOnMaps: string;
  };
  footer: {
    ctaLabel: string; ctaHeading: string; ctaBtn: string;
    links: string[]; copyright: string;
  };
  servicesPage: {
    hero: {
      label: string;
      headingLine1: string; headingLine2: string; headingLine3: string;
      tagline: string; scrollLabel: string;
    };
    tech: { label: string; heading: string; intro: string };
    detail: {
      items: Array<{
        name: string;
        body: string;
        bullets: string[];
      }>;
    };
    process: {
      label: string; heading: string;
      steps: Array<{ num: string; title: string; desc: string }>;
    };
    cta: { label: string; heading: string; btn: string };
    mission: { label: string; heading: string; body1: string; body2: string; btn: string };
    stats: { label: string; items: Array<{ label: string }> };
    locations: { label: string; heading: string; items: Array<{ name: string; desc: string }> };
  };
  aboutPage: {
    hero: {
      label: string;
      headingLine1: string; headingLine2: string; headingLine3: string;
      tagline: string; scrollLabel: string;
      factLabels: string[];
    };
    mission: {
      label: string; heading: string; body1: string; body2: string;
    };
    values: {
      label: string; heading: string;
      items: Array<{ title: string; desc: string }>;
    };
    milestones: {
      label: string; heading: string;
      items: Array<{ title: string; desc: string }>;
    };
    cta: { label: string; heading: string; btn: string };
  };
  contactPage: {
    hero: {
      label: string;
      headingLine1: string; headingLine2: string; headingLine3: string;
      tagline: string;
      factLabels: string[];
    };
    info: {
      label: string; heading: string;
      phone: { label: string; val: string };
      email: { label: string; val: string };
      note: string;
    };
    form: {
      name: { label: string; placeholder: string };
      email: { label: string; placeholder: string };
      message: { label: string; placeholder: string };
      submit: string;
      success: { heading: string; body: string };
      errors: { required: string; emailInvalid: string };
    };
  };
  projectsPage: {
    hero: {
      label: string;
      headingLine1: string; headingLine2: string; headingLine3: string;
      tagline: string;
    };
    search: { placeholder: string; clear: string };
    filters: {
      title: string; clearAll: string; mobileOpen: string;
      location: { label: string };
      status: { label: string; all: string };
      type: { label: string };
      year: { label: string };
    };
    statusLabels: { finished: string; inProgress: string };
    types: { hotel: string; residential: string; commercial: string; industrial: string };
    results: {
      template: string;
      empty: { heading: string; body: string };
    };
    card: { seeMore: string };
    modal: { close: string; scope: string };
  };
  equipmentPage: {
    hero: {
      label: string;
      headingLine1: string; headingLine2: string; headingLine3: string;
      tagline: string;
    };
    intro: { label: string; heading: string; tagline: string };
    items: Array<{
      category: string;
      name: string;
      desc: string;
      specs: [{ label: string }, { label: string }, { label: string }, { label: string }];
      bullets: string[];
    }>;
  };
}

export const TRANSLATIONS: Record<Locale, Translation> = {
  en: {
    nav: {
      home: "Home",
      links: ["Services", "Projects", "Equipment", "About Us", "Contact"],
      cta: "Get a Quote",
    },
    hero: {
      eyebrow: "Concrete Solutions — Costa Blanca",
      est: "EST. 2016",
      titleLine1: "Build Higher.",
      titleLine2: "Build Better.",
      titleLine3: "",
      tagline:
        "At Level Pro, we partner with our customers to bring their ambitions to life — delivering concrete projects that make a lasting difference for people and communities.",
      ctaPrimary: "Contact Us",
      ctaSecondary: "View Projects",
      locations: ["Palma de Mallorca", "Ibiza", "Benidorm"],
      statsLabels: { projects: "Projects", years: "Years", mobilization: "Mobilization" },
      scroll: "Scroll",
    },
    about: {
      label: "Who we are",
      body: "Level Pro provides professional concrete solutions, combining experienced teams and specialized equipment to deliver precise execution and reliable results.",
    },
    services: {
      label: "Our Services",
      headingLine1: "Specialized concrete",
      headingLine2: "services",
      headingLine3: "",
      tagline:
        "From foundations to facades — reliable concrete pumping and precise material placement at any scale.",
      items: [
        {
          name: "Concrete Pumping",
          detail: "High-pressure pumping systems delivering consistent material flow for multi-storey residential, hotel and commercial structures. Our boom pumps reach up to 50 metres, integrating seamlessly with your construction programme.",
          shortDesc: "High-reach boom pumps for residential, hotel and commercial pours — up to 50 metres reach.",
          bullets: [
            "Boom pump reach up to 50 m for multi-storey structures",
            "Full fleet for simultaneous multi-site deployment",
            "GPS-coordinated pour scheduling integrated with your programme",
            "On-site operator supervision from start to finish",
          ],
        },
        {
          name: "Material Placement",
          detail: "Precise distribution ensuring even depth and full coverage across slabs, walls and columns — minimising waste and achieving first-time quality results at any project scale.",
          shortDesc: "Precise slab coverage and even depth — first-time quality across every pour area.",
          bullets: [
            "Consistent slab depth and coverage across all pour areas",
            "Certified operators experienced with all structural mix types",
            "Real-time coordination with your site supervisors",
            "On-site cleanup and equipment removal included",
          ],
        },
        {
          name: "Shotcrete Works",
          detail: "Pneumatically applied concrete for retaining walls, slope stabilisation and complex geometric forms — rapid, high-strength coverage with precise control over layer thickness and bond quality.",
          shortDesc: "Pneumatically applied concrete for retaining walls, slopes and complex geometric forms.",
          bullets: [
            "Wet-mix and dry-mix processes to suit site conditions",
            "High early-strength mixes for retaining walls and tunnels",
            "Nozzle positioning adapted for confined or irregular spaces",
            "Layer thickness verified by supervisor at every application stage",
          ],
        },
        {
          name: "Foundation Works",
          detail: "Engineered solutions from strip footings to complex raft slabs — designed to the geotechnical conditions of each site and fully coordinated with your structural engineer throughout.",
          shortDesc: "Engineered footings and raft slabs designed to your site's geotechnical conditions.",
          bullets: [
            "Geotechnical site assessment informing every design",
            "Reinforced concrete solutions for challenging ground conditions",
            "Full coordination with structural engineers in all phases",
            "Post-pour inspection and documentation included",
          ],
        },
        {
          name: "Slope Forming",
          detail: "Precision-graded concrete surfaces engineered to fall accurately toward drains and outlets — critical for roof decks, terraces, ramps and yards where standing water isn't an option. Laser-guided screeding keeps every gradient consistent from high point to low point.",
          shortDesc: "Laser-guided falls for roof decks, terraces and yards — precise gradients, zero standing water.",
          bullets: [
            "Laser-guided screeding for verified gradients",
            "Engineered falls to drains and outlets",
            "Suited to roof decks, terraces, yards and ramps",
            "Level checks at every stage before handover",
          ],
        },
      ],
    },
    servicesCta: {
      heading: "Every project has its own conditions. We adapt to yours.",
      body: "Tight urban sites, unusual access, tough schedules — whatever the constraints, we shape our approach around your project, not the other way round.",
      btn: "Get in Touch",
    },
    stats: {
      label: "Operations & Resources",
      heading: "Precision and efficiency on every concrete project",
      equipmentBtn: "Our Equipment",
      items: [
        { label: "Concrete pumping capacity" },
        { label: "Projects completed" },
        { label: "Rapid site mobilization" },
        { label: "Years of experience" },
      ],
    },
    materials: {
      heading: "Quality materials and specialized equipment",
      tagline: "We work with certified mixes and maintain our fleet to the highest standards.",
      cards: [
        {
          title: "Modern pumping and finishing equipment",
          desc: "Our fleet includes high-capacity boom pumps, line pumps, and shotcrete machines maintained to the highest standards, enabling efficient delivery across all project scales — from residential to major commercial developments.",
        },
        {
          title: "High-quality construction materials",
          desc: "We work with certified concrete mixes and specialized mortars such as self-leveling compounds, shotcrete concrete (G400), and high-strength finishing mortars — ensuring durability and consistent performance across all conditions.",
        },
      ],
    },
    projects: {
      label: "Selected Projects",
      heading: "Projects that define the Costa Blanca",
      items: [
        {
          type: "Hotel",
          shortDesc: "A 22-room boutique hotel between Poniente Beach and Cala de Finestrat, reborn from a 1950s hostel with a retro Spanish-Riviera design.",
          fullDesc: "Our team was involved in the project through concrete pumping operations and surface finishing works, contributing to the efficient execution of key construction stages.",
          tags: ["Concrete Pumping", "Surface Finishing"],
        },
        {
          type: "Residential",
          shortDesc: "A 26-storey glass tower on Playa Poniente — 195 apartments beneath a heated sky pool and gym on the top floor.",
          fullDesc: "We provided concrete pumping and foundation works for the Alibuilding residential development in Benidorm, coordinating closely with the site team to keep the pour schedule on track.",
          tags: ["Concrete Pumping", "Foundation Works"],
        },
        {
          type: "Residential",
          shortDesc: "An exclusive residential tower on Avenida del Mediterráneo — 19 homes, one per floor, each facing the sea.",
          fullDesc: "Our team delivered high-pressure concrete pumping across multiple floors for the Monver Tower in Benidorm, supporting material placement throughout the building's vertical construction.",
          tags: ["High-pressure Pumping", "Material Placement"],
        },
        {
          type: "Hotel",
          shortDesc: "A 300-room hotel on the first line of Playa de Poniente, where every room opens onto its own sea-view terrace.",
          fullDesc: "We supported the Poseidon Playas de Benidorm hotel project through concrete pumping and surface finishing works, contributing to the efficient execution of key construction stages.",
          tags: ["Concrete Pumping", "Surface Finishing"],
        },
        {
          type: "Hotel",
          shortDesc: "An 18-storey beachfront hotel on Levante Beach, pairing its original Blue Tower with a new Sky Tower and a rooftop terrace on floor 19.",
          fullDesc: "Our team carried out concrete pumping and material placement works for the Port Benidorm Hotel & Spa, ensuring precise coordination and reliable on-site execution throughout the build.",
          tags: ["Concrete Pumping", "Material Placement"],
        },
        {
          type: "Hotel",
          shortDesc: "A 364-room family hotel by Levante Beach, built around a water park, slides and an all-inclusive pool scene.",
          fullDesc: "Our team supported the development and renovation of Hotel Rosamar in Benidorm through concrete pumping operations and surface finishing works. The project, completed in 2020, required precise coordination and reliable on-site execution.",
          tags: ["Concrete Pumping", "Surface Finishing", "Material Placement"],
        },
        {
          type: "Hotel",
          shortDesc: "A modern urban hotel near Valencia's Turia Gardens, with a rooftop pool and skyline bar just steps from the historic centre.",
          fullDesc: "Our team carried out concrete pumping and material placement works for the Novotel Valencia Lavant, supporting the hotel's construction with precise, reliable execution on a tight urban site.",
          tags: ["Concrete Pumping", "Material Placement"],
        },
      ],
      metaKeys: { year: "Year", type: "Type", budget: "Budget", location: "Location", status: "Status" },
      learnMore: "Learn more",
      viewOnMaps: "View on Maps",
    },
    footer: {
      ctaLabel: "Start a Project",
      ctaHeading: "Ready to build something exceptional?",
      ctaBtn: "Contact Us",
      links: ["Services", "Projects", "Equipment", "About Us", "Contact"],
      copyright: "© 2026 Level Pro. All rights reserved.",
    },
    servicesPage: {
      hero: {
        label: "Our Services",
        headingLine1: "Professional concrete",
        headingLine2: "across the",
        headingLine3: "Costa Blanca",
        tagline: "Specialized concrete services for every scale — from residential foundations to large commercial structures across the Costa Blanca.",
        scrollLabel: "Scroll",
      },
      tech: {
        label: "Capabilities",
        heading: "Specialized concrete services",
        intro: "Five core disciplines, one accountable crew. Scroll through each service for the full technical detail.",
      },
      detail: {
        items: [
          {
            name: "Concrete Pumping",
            body: "High-pressure, high-volume pumping for sites of any scale. A modern boom and line pump fleet — with full operator supervision — keeps material flowing exactly where your programme needs it.",
            bullets: [
              "50m boom reach",
              "Multi-site fleet deployment",
              "GPS-tracked scheduling",
              "24h rapid mobilisation",
            ],
          },
          {
            name: "Material Placement",
            body: "Precise placement underpins the structural integrity and finish of every pour. Certified operators keep depth and distribution consistent across slabs, walls and columns — first time, minimal waste.",
            bullets: [
              "Consistent depth, every pour",
              "Certified mix specialists",
              "Real-time site coordination",
              "Clean-up included",
            ],
          },
          {
            name: "Shotcrete Works",
            body: "Concrete sprayed pneumatically at high velocity — our method for retaining walls, slope stabilisation and complex forms. Rapid, high-strength coverage with tight control over thickness and bond, even on irregular surfaces.",
            bullets: [
              "Wet-mix & dry-mix options",
              "High early-strength mixes",
              "Confined-space nozzle technique",
              "Layer-by-layer supervisor checks",
            ],
          },
          {
            name: "Foundation Works",
            body: "Reliable foundations are the bedrock of every structure. We design and place engineered solutions matched to each site's geotechnical conditions — from strip footings to complex raft slabs for towers.",
            bullets: [
              "Geotechnical site assessment",
              "Reinforced for tough ground",
              "Engineer-coordinated, every phase",
              "Post-pour inspection included",
            ],
          },
          {
            name: "Slope Forming",
            body: "Precision-graded concrete surfaces engineered to fall accurately toward drains and outlets. Laser-guided screeding keeps every gradient consistent, so roof decks, terraces and yards shed water exactly where it's designed to go.",
            bullets: [
              "Laser-guided screeding",
              "Verified falls to every outlet",
              "Suited to decks, terraces & yards",
              "Gradient checks before handover",
            ],
          },
        ],
      },
      process: {
        label: "Our Approach",
        heading: "Precision at every stage",
        steps: [
          { num: "01", title: "Site Assessment", desc: "We evaluate access routes, structural requirements and logistical constraints before mobilising any equipment." },
          { num: "02", title: "Technical Planning", desc: "Our team calculates mix specifications, pump positioning and pour sequencing for each unique site condition." },
          { num: "03", title: "Rapid Mobilisation", desc: "With a 24-hour mobilisation capacity, we integrate seamlessly into your project schedule without delay." },
          { num: "04", title: "Execution & QC", desc: "Every pour is supervised in real time, with quality checks at each stage to ensure consistent, reliable results." },
        ],
      },
      cta: {
        label: "Start a Project",
        heading: "Ready to discuss your concrete requirements?",
        btn: "Get in Touch",
      },
      mission: {
        label: "Mission",
        heading: "Your concrete partner on the Costa Blanca",
        body1: "Level Pro delivers professional concrete solutions across the Costa Blanca, pairing experienced on-site teams with a modern, well-maintained fleet.",
        body2: "From residential foundations to large commercial pours, we bring precision, reliability and clear communication to every stage of the build.",
        btn: "Learn more",
      },
      stats: {
        label: "By the numbers",
        items: [
          { label: "Projects completed" },
          { label: "Service locations" },
          { label: "Rapid site mobilization" },
        ],
      },
      locations: {
        label: "Locations",
        heading: "Operating across the Costa Blanca",
        items: [
          { name: "Benidorm", desc: "Our home base on the Costa Blanca — covering Benidorm, Altea and the surrounding coastline." },
          { name: "Ibiza", desc: "Island projects served by the same fleet and crews, from residential builds to hospitality developments." },
          { name: "Palma de Mallorca", desc: "Balearic coverage for commercial and residential concrete works across Mallorca." },
        ],
      },
    },
    aboutPage: {
      hero: {
        label: "Who We Are",
        headingLine1: "Built on",
        headingLine2: "precision",
        headingLine3: "and trust",
        tagline: "A dedicated team of concrete specialists delivering exceptional results across the Costa Blanca — from residential foundations to major commercial structures.",
        scrollLabel: "Scroll",
        factLabels: ["Region", "Projects completed"],
      },
      mission: {
        label: "Our Story",
        heading: "Concrete expertise you can rely on",
        body1: "Level Pro was founded with a single ambition: to bring professional-grade concrete solutions to construction projects across the Costa Blanca. What began as a focused pumping operation has grown into a trusted partner for developers, contractors and architects throughout the region.",
        body2: "Today we combine experienced on-site teams with a modern, well-maintained fleet — delivering precision at every stage of the concrete process. Our commitment to quality and reliability has built a reputation that speaks through the work we complete.",
      },
      values: {
        label: "What Drives Us",
        heading: "Our principles",
        items: [
          { title: "Precision", desc: "Every pour, every placement, every surface finish — executed to the highest standards with zero tolerance for imprecision." },
          { title: "Reliability", desc: "When we commit to a schedule, we deliver. Rapid mobilisation and consistent execution keep your project on time and on budget." },
          { title: "Expertise", desc: "Years of hands-on experience across residential, commercial and industrial projects gives our team the knowledge to handle any challenge." },
          { title: "Partnership", desc: "We work alongside architects, contractors and developers as a true partner — communicating clearly and solving problems proactively." },
        ],
      },
      milestones: {
        label: "Our Journey",
        heading: "A track record of concrete excellence",
        items: [
          { title: "Founded on the Costa Blanca", desc: "Level Pro established on the Costa Blanca, focused on concrete pumping for residential and coastal developments." },
          { title: "Fleet expansion", desc: "Added high-capacity boom pumps enabling multi-storey commercial and hotel projects across the region." },
          { title: "Hotel sector", desc: "Completed major pumping and finishing works for Hotel Rosamar in Benidorm — a landmark commercial project." },
          { title: "200+ projects", desc: "Passed 200 completed projects and expanded into shotcrete and engineered foundation works." },
        ],
      },
      cta: {
        label: "Work With Us",
        heading: "Let's build something great together",
        btn: "Get in Touch",
      },
    },
    contactPage: {
      hero: {
        label: "Contact",
        headingLine1: "Get in",
        headingLine2: "touch",
        headingLine3: "with us",
        tagline: "Whether you're planning a new development or looking for a reliable concrete partner, we'd like to hear from you.",
        factLabels: ["Location", "Response", "Available"],
      },
      info: {
        label: "Contact Information",
        heading: "Reach us directly",
        phone: { label: "Phone", val: "+34 624 86 88 61" },
        email: { label: "Email", val: "info@levelpro.es" },
        note: "We typically respond within one business day. For urgent project enquiries, please call us directly.",
      },
      form: {
        name: { label: "Full Name", placeholder: "Your full name" },
        email: { label: "Email Address", placeholder: "your@email.com" },
        message: { label: "Message", placeholder: "Tell us about your project — scope, location, timeline, and any specific requirements." },
        submit: "Send Message",
        success: { heading: "Message received", body: "Thank you for reaching out. We'll be in touch within one business day." },
        errors: { required: "This field is required", emailInvalid: "Please enter a valid email address" },
      },
    },
    projectsPage: {
      hero: {
        label: "Our Work",
        headingLine1: "Projects built",
        headingLine2: "with precision",
        headingLine3: "across the coast",
        tagline: "Browse our completed and ongoing concrete works across the Costa Blanca — search by name or filter by location, status, type and year.",
      },
      search: { placeholder: "Search projects by name, location or keyword…", clear: "Clear search" },
      filters: {
        title: "Filters",
        clearAll: "Clear all",
        mobileOpen: "Filters",
        location: { label: "Location" },
        status: { label: "Status", all: "All" },
        type: { label: "Type of Construction" },
        year: { label: "Year of Construction" },
      },
      statusLabels: { finished: "Finished", inProgress: "In Progress" },
      types: { hotel: "Hotel", residential: "Residential", commercial: "Commercial", industrial: "Industrial" },
      results: {
        template: "Showing {n} of {total} projects",
        empty: { heading: "No projects match your filters", body: "Try adjusting or clearing your filters to see more results." },
      },
      card: { seeMore: "See more" },
      modal: { close: "Close", scope: "Scope of Work" },
    },
    equipmentPage: {
      hero: {
        label: "Equipment",
        headingLine1: "Equipment engineered",
        headingLine2: "for precision",
        headingLine3: "on every site",
        tagline: "From high-pressure pumping to precision floor finishing — a modern, well-maintained fleet ready to mobilize across the Costa Blanca.",
      },
      intro: {
        label: "Featured Machines",
        heading: "Two machines, built for different stages of the pour",
        tagline: "A closer look at the core equipment behind our pumping and finishing work.",
      },
      items: [
        {
          category: "Concrete Pumping",
          name: "Putzmeister P 730",
          desc: "A compact, high-pressure stationary pump built for shotcrete and precision line pumping — reaching areas larger boom pumps can't access, without sacrificing output.",
          specs: [{ label: "Output range" }, { label: "Max pressure" }, { label: "Max aggregate size" }, { label: "Engine power" }],
          bullets: [
            "Piston pump engineered for continuous high-cycle operation",
            "Trailer-mounted chassis for fast mobilization between sites",
            "Diesel-powered with full on-site operator supervision",
          ],
        },
        {
          category: "Floor Finishing",
          name: "Barikell MK8 Ride-On Power Trowel",
          desc: "A twin-rotor ride-on power trowel that floats and finishes medium-to-large concrete slabs fast, with a smooth, consistent surface on every pass.",
          specs: [{ label: "Rotor configuration" }, { label: "Engine power" }, { label: "Blade speed" }, { label: "Floor coverage" }],
          bullets: [
            "Two 750 mm rotors, 8 non-overlapping blades each, for an even finish",
            "Compact enough to pass through a standard site doorway",
            "Petrol engine with electric start for fast startup on site",
          ],
        },
      ],
    },
  },

  de: {
    nav: {
      home: "Startseite",
      links: ["Dienstleistungen", "Projekte", "Ausrüstung", "Über uns", "Kontakt"],
      cta: "Angebot anfragen",
    },
    hero: {
      eyebrow: "Betonlösungen — Costa Blanca",
      est: "GEGR. 2016",
      titleLine1: "Wir leben",
      titleLine2: "für eine",
      titleLine3: "Herausforderung",
      tagline:
        "Bei Level Pro arbeiten wir mit unseren Kunden zusammen, um ihre Ambitionen zu verwirklichen — und liefern Betonprojekte, die einen bleibenden Unterschied für Menschen und Gemeinschaften machen.",
      ctaPrimary: "Kontaktieren Sie uns",
      ctaSecondary: "Projekte ansehen",
      locations: ["Palma de Mallorca", "Ibiza", "Benidorm"],
      statsLabels: { projects: "Projekte", years: "Jahre", mobilization: "Mobilisierung" },
      scroll: "Scrollen",
    },
    about: {
      label: "Wer wir sind",
      body: "Level Pro bietet professionelle Betonlösungen und vereint erfahrene Teams mit Spezialausrüstung, um präzise Ausführung und zuverlässige Ergebnisse zu liefern.",
    },
    services: {
      label: "Unsere Dienstleistungen",
      headingLine1: "Spezialisierte",
      headingLine2: "Betonleistungen",
      headingLine3: "",
      tagline:
        "Von Fundamenten bis Fassaden — zuverlässiges Betonpumpen und präzise Materialplatzierung in jedem Maßstab.",
      items: [
        {
          name: "Betonpumpen",
          detail: "Hochdruckpumpsysteme für gleichmäßigen Materialfluss bei mehrgeschossigen Wohn-, Hotel- und Gewerbeobjekten. Unsere Autobetonpumpen erreichen bis zu 50 Meter und fügen sich nahtlos in Ihren Bauablauf ein.",
          shortDesc: "Hochreichende Autobetonpumpen für Wohn-, Hotel- und Gewerbeobjekte — bis zu 50 Meter Reichweite.",
          bullets: [
            "Reichweite bis zu 50 m für mehrgeschossige Bauten",
            "Vollständige Flotte für gleichzeitigen Einsatz auf mehreren Baustellen",
            "GPS-gestützte Einsatzplanung in Ihren Bauablauf integriert",
            "Bedienerbetreuung vor Ort von Beginn bis Ende",
          ],
        },
        {
          name: "Materialplatzierung",
          detail: "Präzise Verteilung für gleichmäßige Tiefe und vollständige Abdeckung bei Platten, Wänden und Stützen — minimaler Materialverlust und erstklassige Ergebnisse bei jedem Projektmaßstab.",
          shortDesc: "Präzise Plattenabdeckung und gleichmäßige Tiefe — erstklassige Ergebnisse bei jedem Betoniervorgang.",
          bullets: [
            "Gleichmäßige Plattentiefe und Abdeckung bei allen Gussbereichen",
            "Zertifizierte Bediener für alle strukturellen Betonmischungstypen",
            "Echtzeit-Koordination mit Baustellenverantwortlichen",
            "Baustellenreinigung und Gerätentfernung inbegriffen",
          ],
        },
        {
          name: "Spritzbeton",
          detail: "Pneumatisch aufgebrachter Beton für Stützmauern, Böschungssicherung und komplexe Geometrien — schnelle, hochfeste Abdeckung mit präziser Kontrolle über Schichtdicke und Haftqualität.",
          shortDesc: "Pneumatisch aufgebrachter Beton für Stützmauern, Böschungen und komplexe Geometrien.",
          bullets: [
            "Nass- und Trockenspritzverfahren je nach Standortanforderungen",
            "Hochfrühfeste Mischungen für Stützmauern und Tunnel",
            "Düsenführung für beengte und unregelmäßige Räume angepasst",
            "Schichtdicke in jeder Ausführungsphase vom Verantwortlichen geprüft",
          ],
        },
        {
          name: "Fundamentarbeiten",
          detail: "Konstruktive Lösungen von Streifenfundamenten bis zu komplexen Bodenplatten — auf die geotechnischen Bedingungen jedes Standorts abgestimmt und mit Ihrem Tragwerksplaner koordiniert.",
          shortDesc: "Konstruktive Fundamente und Bodenplatten, auf die geotechnischen Bedingungen jedes Standorts abgestimmt.",
          bullets: [
            "Geotechnische Standortbewertung als Grundlage jedes Entwurfs",
            "Stahlbetonlösungen für schwierige Bodenverhältnisse",
            "Vollständige Koordination mit Tragwerksplanern in allen Phasen",
            "Prüfprotokolle und Dokumentation nach dem Guss inbegriffen",
          ],
        },
        {
          name: "Gefälleausbildung",
          detail: "Präzise ausgebildete Betonflächen mit exaktem Gefälle zu Abläufen und Einläufen — entscheidend bei Dachterrassen, Balkonen, Rampen und Höfen, wo stehendes Wasser keine Option ist. Lasergeführter Estricheinbau hält jedes Gefälle vom höchsten bis zum tiefsten Punkt konstant.",
          shortDesc: "Lasergeführtes Gefälle für Dachterrassen, Balkone und Höfe — präzise Neigung, kein stehendes Wasser.",
          bullets: [
            "Lasergeführter Estricheinbau für geprüftes Gefälle",
            "Exaktes Gefälle zu Abläufen und Einläufen",
            "Geeignet für Dachterrassen, Balkone, Höfe und Rampen",
            "Nivellierkontrollen in jeder Phase vor der Abnahme",
          ],
        },
      ],
    },
    servicesCta: {
      heading: "Jedes Projekt hat eigene Bedingungen. Wir passen uns an.",
      body: "Beengte Stadtgrundstücke, ungewöhnlicher Zugang, enge Zeitpläne — welche Einschränkungen auch bestehen, wir richten unseren Ansatz nach Ihrem Projekt aus, nicht umgekehrt.",
      btn: "Kontakt aufnehmen",
    },
    stats: {
      label: "Betrieb & Ressourcen",
      heading: "Präzision und Effizienz bei jedem Betonprojekt",
      equipmentBtn: "Unsere Ausrüstung",
      items: [
        { label: "Betonpumpkapazität" },
        { label: "Abgeschlossene Projekte" },
        { label: "Schnelle Mobilisierung" },
        { label: "Jahre Erfahrung" },
      ],
    },
    materials: {
      heading: "Hochwertige Materialien und Spezialausrüstung",
      tagline: "Wir arbeiten mit zertifizierten Mischungen und pflegen unsere Flotte nach höchsten Standards.",
      cards: [
        {
          title: "Moderne Pump- und Verarbeitungsgeräte",
          desc: "Unsere Flotte umfasst leistungsstarke Autobetonpumpen, Leitungspumpen und Spritzbetonmaschinen, die nach höchsten Standards gewartet werden und eine effiziente Ausführung bei allen Projektgrößen ermöglichen — von Wohngebäuden bis zu großen Gewerbeobjekten.",
        },
        {
          title: "Hochwertige Baumaterialien",
          desc: "Wir verwenden zertifizierte Betonmischungen und Spezialmörtel wie selbstverlaufende Ausgleichsmassen, Spritzbeton (G400) und hochfeste Verarbeitungsmörtel — für Langlebigkeit und gleichbleibende Leistung unter allen Bedingungen.",
        },
      ],
    },
    projects: {
      label: "Ausgewählte Projekte",
      heading: "Projekte an der Costa Blanca",
      items: [
        {
          type: "Hotel",
          shortDesc: "Ein Boutique-Hotel mit 22 Zimmern zwischen Playa Poniente und Cala de Finestrat, entstanden aus einem Hostel der 1950er im Retro-Design der spanischen Riviera.",
          fullDesc: "Unser Team war durch Betonpumparbeiten und Oberflächenbehandlung am Projekt beteiligt und trug zur effizienten Umsetzung wichtiger Bauphasen bei.",
          tags: ["Betonpumpen", "Oberflächenfinish"],
        },
        {
          type: "Wohnbau",
          shortDesc: "Ein 26-stöckiger Glasturm an der Playa Poniente — 195 Apartments unter einem beheizten Sky-Pool und Fitnessbereich im obersten Stockwerk.",
          fullDesc: "Wir führten Betonpumparbeiten und Fundamentarbeiten für die Wohnanlage Alibuilding in Benidorm durch und koordinierten eng mit dem Baustellenteam, um den Betonierplan einzuhalten.",
          tags: ["Betonpumpen", "Fundamentarbeiten"],
        },
        {
          type: "Wohnbau",
          shortDesc: "Ein exklusiver Wohnturm an der Avenida del Mediterráneo — 19 Wohnungen, eine pro Etage, jede mit Blick aufs Meer.",
          fullDesc: "Unser Team lieferte Hochdruckbetonpumpen über mehrere Stockwerke für den Monver Tower in Benidorm und unterstützte die Materialplatzierung während des gesamten vertikalen Baus.",
          tags: ["Hochdruckpumpen", "Materialplatzierung"],
        },
        {
          type: "Hotel",
          shortDesc: "Ein Hotel mit 300 Zimmern direkt an der Playa de Poniente, wo jedes Zimmer eine eigene Terrasse mit Meerblick hat.",
          fullDesc: "Wir unterstützten das Projekt Poseidon Playas de Benidorm durch Betonpumparbeiten und Oberflächenbehandlung und trugen zur effizienten Umsetzung wichtiger Bauphasen bei.",
          tags: ["Betonpumpen", "Oberflächenfinish"],
        },
        {
          type: "Hotel",
          shortDesc: "Ein 18-stöckiges Strandhotel an der Levante-Küste, das den ursprünglichen Blue Tower mit einem neuen Sky Tower verbindet — mit Dachterrasse im 19. Stock.",
          fullDesc: "Unser Team führte Betonpumparbeiten und Materialplatzierung für das Port Benidorm Hotel & Spa durch und sorgte während des gesamten Baus für präzise Koordination und zuverlässige Ausführung vor Ort.",
          tags: ["Betonpumpen", "Materialplatzierung"],
        },
        {
          type: "Hotel",
          shortDesc: "Ein Familienhotel mit 364 Zimmern nahe der Levante-Küste, aufgebaut rund um einen Wasserpark, Rutschen und ein All-inclusive-Poolareal.",
          fullDesc: "Unser Team unterstützte die Entwicklung und Renovierung des Hotel Rosamar in Benidorm durch Betonpumparbeiten und Oberflächenbehandlung. Das 2020 abgeschlossene Projekt erforderte präzise Koordination und zuverlässige Ausführung vor Ort.",
          tags: ["Betonpumpen", "Oberflächenfinish", "Materialplatzierung"],
        },
        {
          type: "Hotel",
          shortDesc: "Ein modernes Stadthotel nahe der Turia-Gärten in Valencia, mit Dachpool und Skyline-Bar nur wenige Schritte vom historischen Zentrum entfernt.",
          fullDesc: "Unser Team führte Betonpumparbeiten und Materialplatzierung für das Novotel Valencia Lavant durch und unterstützte den Hotelbau mit präziser, zuverlässiger Ausführung auf einem beengten Stadtgrundstück.",
          tags: ["Betonpumpen", "Materialplatzierung"],
        },
      ],
      metaKeys: { year: "Jahr", type: "Typ", budget: "Budget", location: "Standort", status: "Status" },
      learnMore: "Mehr erfahren",
      viewOnMaps: "Auf der Karte anzeigen",
    },
    footer: {
      ctaLabel: "Projekt starten",
      ctaHeading: "Bereit, etwas Außergewöhnliches zu bauen?",
      ctaBtn: "Kontakt aufnehmen",
      links: ["Dienstleistungen", "Projekte", "Ausrüstung", "Über uns", "Kontakt"],
      copyright: "© 2026 Level Pro. Alle Rechte vorbehalten.",
    },
    servicesPage: {
      hero: {
        label: "Unsere Leistungen",
        headingLine1: "Professioneller Beton",
        headingLine2: "an der",
        headingLine3: "Costa Blanca",
        tagline: "Spezialisierte Betondienstleistungen für jede Größenordnung — von Wohnfundamenten bis zu großen Gewerbeobjekten an der Costa Blanca.",
        scrollLabel: "Scrollen",
      },
      tech: {
        label: "Leistungsspektrum",
        heading: "Spezialisierte Betondienstleistungen",
        intro: "Fünf zentrale Disziplinen, ein verantwortliches Team. Scrollen Sie durch jede Leistung für alle technischen Details.",
      },
      detail: {
        items: [
          {
            name: "Betonpumpen",
            body: "Unser Betonpumpservice bietet Hochdruck- und Hochvolumenlösungen für Baustellen jeder Größenordnung. Eine moderne Flotte aus Autobeton- und Anhängerpumpen — mit durchgehender Bedienerbetreuung — hält den Materialfluss exakt dort, wo Ihr Bauablauf es braucht.",
            bullets: [
              "50 m Pumpreichweite",
              "Flotte für Mehrfacheinsatz",
              "GPS-gestützte Planung",
              "24-Std-Schnellmobilisierung",
            ],
          },
          {
            name: "Materialplatzierung",
            body: "Präzise Materialplatzierung ist die Grundlage für Statik und Oberflächenqualität jedes Gusses. Zertifizierte Bediener halten Tiefe und Verteilung bei Platten, Wänden und Stützen konstant — erstklassig beim ersten Mal, minimaler Verlust.",
            bullets: [
              "Konstante Tiefe, jeder Guss",
              "Zertifizierte Mischspezialisten",
              "Echtzeit-Baustellenkoordination",
              "Reinigung inbegriffen",
            ],
          },
          {
            name: "Spritzbeton",
            body: "Spritzbeton — pneumatisch mit hoher Geschwindigkeit aufgebracht — ist unsere Methode für Stützmauern, Böschungssicherung und komplexe Formen: schnelle, hochfeste Abdeckung mit präziser Kontrolle über Schichtdicke und Haftung, auch auf unregelmäßigen Flächen.",
            bullets: [
              "Nass- & Trockenspritzverfahren",
              "Hochfrühfeste Mischungen",
              "Angepasste Düsentechnik",
              "Prüfung pro Schicht",
            ],
          },
          {
            name: "Fundamentarbeiten",
            body: "Zuverlässige Fundamente sind die Grundlage jedes Bauwerks. Wir planen und realisieren Lösungen nach den geotechnischen Bedingungen jedes Standorts — von Streifenfundamenten bis zu komplexen Bodenplatten für Hochhäuser.",
            bullets: [
              "Geotechnische Standortbewertung",
              "Armiert für schwierigen Baugrund",
              "Abgestimmt mit Tragwerksplanern",
              "Prüfung nach Guss inbegriffen",
            ],
          },
          {
            name: "Gefälleausbildung",
            body: "Präzise ausgebildete Betonflächen mit exaktem Gefälle zu Abläufen und Einläufen. Lasergeführter Estricheinbau hält jedes Gefälle konstant, damit Dachterrassen, Balkone und Höfe das Wasser genau dorthin leiten, wo es hin soll.",
            bullets: [
              "Lasergeführter Estricheinbau",
              "Geprüftes Gefälle zu jedem Ablauf",
              "Für Terrassen, Balkone & Höfe",
              "Gefälleprüfung vor Abnahme",
            ],
          },
        ],
      },
      process: {
        label: "Unser Ansatz",
        heading: "Präzision in jeder Phase",
        steps: [
          { num: "01", title: "Standortanalyse", desc: "Wir bewerten Zufahrtswege, strukturelle Anforderungen und logistische Einschränkungen vor jeder Mobilisierung." },
          { num: "02", title: "Technische Planung", desc: "Unser Team berechnet Mischspezifikationen, Pumpenaufstellung und Gussreihenfolge für jeden Standort." },
          { num: "03", title: "Schnelle Mobilisierung", desc: "Mit einer 24-Stunden-Mobilisierungskapazität integrieren wir uns nahtlos in Ihren Projektzeitplan." },
          { num: "04", title: "Ausführung & Qualitätssicherung", desc: "Jeder Guss wird in Echtzeit überwacht, mit Qualitätsprüfungen in jeder Phase für gleichbleibende Ergebnisse." },
        ],
      },
      cta: {
        label: "Projekt starten",
        heading: "Bereit, Ihren Betonbedarf zu besprechen?",
        btn: "Kontakt aufnehmen",
      },
      mission: {
        label: "Auftrag",
        heading: "Ihr Betonpartner an der Costa Blanca",
        body1: "Level Pro liefert professionelle Betonlösungen an der Costa Blanca und verbindet erfahrene Vor-Ort-Teams mit einer modernen, gepflegten Flotte.",
        body2: "Von Wohnfundamenten bis zu großen Gewerbegüssen bringen wir Präzision, Zuverlässigkeit und klare Kommunikation in jede Bauphase.",
        btn: "Mehr erfahren",
      },
      stats: {
        label: "In Zahlen",
        items: [
          { label: "Abgeschlossene Projekte" },
          { label: "Standorte" },
          { label: "Schnelle Mobilisierung" },
        ],
      },
      locations: {
        label: "Standorte",
        heading: "Im Einsatz an der Costa Blanca",
        items: [
          { name: "Benidorm", desc: "Unser Stützpunkt an der Costa Blanca — für Benidorm, Altea und die umliegende Küste." },
          { name: "Ibiza", desc: "Inselprojekte mit derselben Flotte und denselben Teams, vom Wohnbau bis zur Hotellerie." },
          { name: "Palma de Mallorca", desc: "Abdeckung der Balearen für gewerbliche und private Betonarbeiten auf ganz Mallorca." },
        ],
      },
    },
    aboutPage: {
      hero: {
        label: "Wer wir sind",
        headingLine1: "Aufgebaut auf",
        headingLine2: "Präzision",
        headingLine3: "und Vertrauen",
        tagline: "Ein engagiertes Team von Betonspezialisten, das außergewöhnliche Ergebnisse an der Costa Blanca liefert — von Wohnfundamenten bis zu großen Gewerbeobjekten.",
        scrollLabel: "Scrollen",
        factLabels: ["Region", "Abgeschlossene Projekte"],
      },
      mission: {
        label: "Unsere Geschichte",
        heading: "Betonkompetenz, auf die Sie sich verlassen können",
        body1: "Level Pro wurde mit einem einzigen Ziel gegründet: professionelle Betonlösungen für Bauprojekte an der Costa Blanca zu realisieren. Was als fokussierter Pumpbetrieb begann, ist heute ein verlässlicher Partner für Bauträger, Auftragnehmer und Architekten in der gesamten Region.",
        body2: "Heute vereinen wir erfahrene Vor-Ort-Teams mit einer modernen, gepflegten Flotte — und liefern Präzision in jeder Phase des Betonprozesses. Unser Engagement für Qualität und Zuverlässigkeit hat einen Ruf aufgebaut, der durch unsere abgeschlossenen Projekte spricht.",
      },
      values: {
        label: "Was uns antreibt",
        heading: "Unsere Prinzipien",
        items: [
          { title: "Präzision", desc: "Jeder Guss, jede Materialplatzierung, jede Oberfläche — ausgeführt nach höchsten Standards ohne Toleranz für Ungenauigkeit." },
          { title: "Zuverlässigkeit", desc: "Wenn wir uns zu einem Zeitplan verpflichten, halten wir ihn. Schnelle Mobilisierung und konsequente Ausführung halten Ihr Projekt im Zeit- und Kostenrahmen." },
          { title: "Fachkompetenz", desc: "Jahre praktischer Erfahrung in Wohn-, Gewerbe- und Industrieprojekten geben unserem Team das Wissen, jede Herausforderung zu meistern." },
          { title: "Partnerschaft", desc: "Wir arbeiten mit Architekten, Auftragnehmern und Bauträgern als echter Partner zusammen — kommunizieren klar und lösen Probleme proaktiv." },
        ],
      },
      milestones: {
        label: "Unser Weg",
        heading: "Eine Erfolgsbilanz in Betonexzellenz",
        items: [
          { title: "Gründung an der Costa Blanca", desc: "Level Pro wird an der Costa Blanca gegründet, mit Fokus auf Betonpumpen für Wohn- und Küstenprojekte." },
          { title: "Flottenausbau", desc: "Anschaffung leistungsstarker Autobetonpumpen für mehrgeschossige Gewerbe- und Hotelprojekte in der Region." },
          { title: "Hotelsektor", desc: "Abschluss wichtiger Pump- und Veredelungsarbeiten für das Hotel Rosamar in Benidorm — ein Meilenstein im Gewerbebereich." },
          { title: "200+ Projekte", desc: "Überschreitung von 200 abgeschlossenen Projekten und Erweiterung in Spritzbeton und Fundamentarbeiten." },
        ],
      },
      cta: {
        label: "Arbeiten Sie mit uns",
        heading: "Lassen Sie uns gemeinsam etwas Großartiges bauen",
        btn: "Kontakt aufnehmen",
      },
    },
    contactPage: {
      hero: {
        label: "Kontakt",
        headingLine1: "Sprechen",
        headingLine2: "Sie",
        headingLine3: "mit uns",
        tagline: "Ob Sie ein neues Bauprojekt planen oder einen zuverlässigen Betonpartner suchen — wir freuen uns von Ihnen zu hören.",
        factLabels: ["Standort", "Antwortzeit", "Verfügbar"],
      },
      info: {
        label: "Kontaktinformationen",
        heading: "Direkt erreichen",
        phone: { label: "Telefon", val: "+34 624 86 88 61" },
        email: { label: "E-Mail", val: "info@levelpro.es" },
        note: "Wir antworten in der Regel innerhalb eines Werktages. Bei dringenden Projektanfragen rufen Sie uns bitte direkt an.",
      },
      form: {
        name: { label: "Vollständiger Name", placeholder: "Ihr vollständiger Name" },
        email: { label: "E-Mail-Adresse", placeholder: "ihre@email.de" },
        message: { label: "Nachricht", placeholder: "Beschreiben Sie Ihr Projekt — Umfang, Standort, Zeitplan und besondere Anforderungen." },
        submit: "Nachricht senden",
        success: { heading: "Nachricht erhalten", body: "Vielen Dank für Ihre Anfrage. Wir melden uns innerhalb eines Werktages." },
        errors: { required: "Dieses Feld ist erforderlich", emailInvalid: "Bitte geben Sie eine gültige E-Mail-Adresse ein" },
      },
    },
    projectsPage: {
      hero: {
        label: "Unsere Arbeit",
        headingLine1: "Projekte gebaut",
        headingLine2: "mit Präzision",
        headingLine3: "entlang der Küste",
        tagline: "Entdecken Sie unsere abgeschlossenen und laufenden Betonarbeiten an der Costa Blanca — suchen Sie nach Namen oder filtern Sie nach Standort, Status, Bauart und Jahr.",
      },
      search: { placeholder: "Projekte nach Name, Standort oder Stichwort suchen…", clear: "Suche löschen" },
      filters: {
        title: "Filter",
        clearAll: "Alle zurücksetzen",
        mobileOpen: "Filter",
        location: { label: "Standort" },
        status: { label: "Status", all: "Alle" },
        type: { label: "Bauart" },
        year: { label: "Baujahr" },
      },
      statusLabels: { finished: "Fertiggestellt", inProgress: "In Arbeit" },
      types: { hotel: "Hotel", residential: "Wohnbau", commercial: "Gewerbe", industrial: "Industrie" },
      results: {
        template: "{n} von {total} Projekten werden angezeigt",
        empty: { heading: "Keine Projekte entsprechen Ihren Filtern", body: "Passen Sie Ihre Filter an oder setzen Sie sie zurück, um mehr Ergebnisse zu sehen." },
      },
      card: { seeMore: "Mehr erfahren" },
      modal: { close: "Schließen", scope: "Leistungsumfang" },
    },
    equipmentPage: {
      hero: {
        label: "Ausrüstung",
        headingLine1: "Maschinen, gebaut",
        headingLine2: "für höchste",
        headingLine3: "Präzision",
        tagline: "Von Hochdruckpumpen bis zur präzisen Bodenbearbeitung — eine moderne, gut gewartete Flotte, einsatzbereit an der gesamten Costa Blanca.",
      },
      intro: {
        label: "Ausgewählte Maschinen",
        heading: "Zwei Maschinen für unterschiedliche Phasen des Betoniervorgangs",
        tagline: "Ein genauer Blick auf die zentrale Ausrüstung hinter unseren Pump- und Verarbeitungsarbeiten.",
      },
      items: [
        {
          category: "Betonpumpen",
          name: "Putzmeister P 730",
          desc: "Eine kompakte Hochdruck-Stationärpumpe für Spritzbeton und präzises Leitungspumpen — sie erreicht Bereiche, die größere Autobetonpumpen nicht bedienen können, ohne Leistungseinbußen.",
          specs: [{ label: "Förderbereich" }, { label: "Max. Druck" }, { label: "Max. Korngröße" }, { label: "Motorleistung" }],
          bullets: [
            "Kolbenpumpe für durchgehenden Hochzyklusbetrieb ausgelegt",
            "Anhängerfahrgestell für schnelle Mobilisierung zwischen Baustellen",
            "Dieselbetrieben mit durchgehender Bedienerbetreuung vor Ort",
          ],
        },
        {
          category: "Bodenbearbeitung",
          name: "Barikell MK8 Ride-On Power Trowel",
          desc: "Ein Doppelrotor-Aufsitzglätter, der mittelgroße bis große Betonplatten schnell glättet und verdichtet — mit einer gleichmäßigen, konsistenten Oberfläche bei jedem Durchgang.",
          specs: [{ label: "Rotorkonfiguration" }, { label: "Motorleistung" }, { label: "Flügeldrehzahl" }, { label: "Bodenabdeckung" }],
          bullets: [
            "Zwei Rotoren mit 750 mm Durchmesser, je 8 nicht überlappende Flügel, für ein gleichmäßiges Finish",
            "Kompakt genug, um durch eine normale Baustellentür zu passen",
            "Benzinmotor mit Elektrostart für einen schnellen Start vor Ort",
          ],
        },
      ],
    },
  },

  es: {
    nav: {
      home: "Inicio",
      links: ["Servicios", "Proyectos", "Equipos", "Nosotros", "Contacto"],
      cta: "Solicitar presupuesto",
    },
    hero: {
      eyebrow: "Soluciones de hormigón — Costa Blanca",
      est: "EST. 2016",
      titleLine1: "Más Alto",
      titleLine2: "Mejor!",
      titleLine3: "",
      tagline:
        "En Level Pro, colaboramos con nuestros clientes para hacer realidad sus ambiciones — entregando proyectos de hormigón que marcan una diferencia duradera para las personas y las comunidades.",
      ctaPrimary: "Contáctanos",
      ctaSecondary: "Ver proyectos",
      locations: ["Palma de Mallorca", "Ibiza", "Benidorm"],
      statsLabels: { projects: "Proyectos", years: "Años", mobilization: "Movilización" },
      scroll: "Scroll",
    },
    about: {
      label: "Quiénes somos",
      body: "Level Pro ofrece soluciones profesionales para el bombeo y la aplicación de hormigón y morteros a nivel PRO.",
    },
    services: {
      label: "Nuestros Servicios",
      headingLine1: "Profesionales",
      headingLine2: "de hormigón",
      headingLine3: "",
      tagline:
        "De los cimientos a las fachadas — bombeo de hormigón fiable y colocación precisa de material a cualquier escala.",
      items: [
        {
          name: "Bombeos de Hormigón",
          detail: "Bombas pluma de hasta 50 metros y bombas estacionarias, coordinadas con su programa de obra para un suministro continuo.",
          shortDesc: "Bombas pluma de largo alcance para obras residenciales, hoteleras y comerciales — hasta 50 metros.",
          bullets: [
            "Bombas pluma de hasta 50 m de alcance",
            "Flota propia para obras de cualquier tamaño",
            "Movilización rápida en menos de 24 horas",
            "Supervisión de operador durante todo el vertido",
          ],
        },
        {
          name: "Morteros autonivelantes",
          detail: "Soleras interiores perfectamente planas y niveladas, de fraguado rápido, ideales para suelo radiante, parqué o tarima.",
          shortDesc: "Pavimentos interiores perfectamente planos mediante morteros autonivelantes de fraguado rápido.",
          bullets: [
            "Planimetría perfecta en interiores y suelo radiante",
            "Fraguado rápido, obra lista en menos tiempo",
            "Bombeo mecánico para grandes superficies",
            "Acabado listo para cualquier pavimento final",
          ],
        },
        {
          name: "Hormigón fratasado",
          detail: "Soleras fratasadas mecánicamente con helicóptero, con una superficie densa y resistente al desgaste para naves y garajes.",
          shortDesc: "Soleras de hormigón fratasado mecánicamente para naves, garajes e industria con acabado resistente.",
          bullets: [
            "Fratasado mecánico con helicóptero",
            "Superficie resistente al desgaste y al tránsito pesado",
            "Apto para naves industriales y garajes",
            "Tratamiento con endurecedor de cuarzo opcional",
          ],
        },
        {
          name: "Gunitados",
          detail: "Hormigón proyectado por vía húmeda o seca sobre muros de contención y taludes, con mínimo encofrado y alta resistencia inicial.",
          shortDesc: "Hormigón proyectado a alta presión para muros de contención, taludes y piscinas.",
          bullets: [
            "Proyección por vía húmeda y seca",
            "Ideal para muros de contención y taludes",
            "Mínimo encofrado, menor plazo de ejecución",
            "Control de espesor capa a capa",
          ],
        },
        {
          name: "Formación de pendientes",
          detail: "Pendientes de hormigón guiadas por láser hacia sumideros y desagües, sin agua estancada en cubiertas, terrazas ni patios.",
          shortDesc: "Pendientes precisas guiadas por láser para cubiertas, terrazas y patios sin agua estancada.",
          bullets: [
            "Regleado guiado por láser",
            "Pendientes calculadas hacia sumideros y desagües",
            "Apto para cubiertas, terrazas, rampas y patios",
            "Verificación de nivel antes de la entrega",
          ],
        },
      ],
    },
    servicesCta: {
      heading: "Cada proyecto tiene sus propias condiciones. Nos adaptamos a las tuyas.",
      body: "Solares urbanos reducidos, accesos poco habituales, plazos ajustados — sean cuales sean las limitaciones, adaptamos nuestro enfoque a tu proyecto, no al revés.",
      btn: "Contáctenos",
    },
    stats: {
      label: "Operaciones y Recursos",
      heading: "Precisión y eficiencia en cada proyecto de hormigón",
      equipmentBtn: "Nuestros Equipos",
      items: [
        { label: "Capacidad de bombeo" },
        { label: "Proyectos completados" },
        { label: "Movilización rápida" },
        { label: "Años de experiencia" },
      ],
    },
    materials: {
      heading: "Materiales de calidad y equipos especializados",
      tagline: "Trabajamos con mezclas certificadas y mantenemos nuestra flota según los más altos estándares.",
      cards: [
        {
          title: "Equipos modernos de bombeo y acabado",
          desc: "Nuestra flota incluye bombas pluma de alta capacidad, bombas de línea y máquinas de gunitado mantenidas según los más altos estándares, lo que permite una entrega eficiente en todo tipo de proyectos, desde residenciales hasta grandes desarrollos comerciales.",
        },
        {
          title: "Materiales de construcción de alta calidad",
          desc: "Trabajamos con mezclas de hormigón certificadas y morteros especializados como autonivelantes, hormigón proyectado (G400) y morteros de acabado de alta resistencia, garantizando durabilidad y rendimiento constante en todas las condiciones.",
        },
      ],
    },
    projects: {
      label: "Proyectos Seleccionados",
      heading: "Proyectos en la Costa Blanca",
      items: [
        {
          type: "Hotel",
          shortDesc: "Un hotel boutique de 22 habitaciones entre la Playa de Poniente y la Cala de Finestrat, renacido de un hostal de los años 50 con diseño retro de la Riviera española.",
          fullDesc: "Nuestro equipo participó en el proyecto a través de operaciones de bombeo de hormigón y trabajos de acabado superficial, contribuyendo a la ejecución eficiente de las etapas clave de la construcción.",
          tags: ["Bombeo de Hormigón", "Acabado Superficial"],
        },
        {
          type: "Residencial",
          shortDesc: "Una torre acristalada de 26 plantas en la Playa de Poniente — 195 apartamentos bajo una piscina climatizada y gimnasio en la última planta.",
          fullDesc: "Realizamos bombeo de hormigón y trabajos de cimentación para el desarrollo residencial Alibuilding en Benidorm, coordinando estrechamente con el equipo de obra para mantener el calendario de hormigonado.",
          tags: ["Bombeo de Hormigón", "Cimentación"],
        },
        {
          type: "Residencial",
          shortDesc: "Una exclusiva torre residencial en la Avenida del Mediterráneo — 19 viviendas, una por planta, cada una orientada al mar.",
          fullDesc: "Nuestro equipo realizó bombeo de hormigón de alta presión en múltiples plantas para el Monver Tower en Benidorm, apoyando la colocación de material durante toda la construcción vertical del edificio.",
          tags: ["Bombeo de Alta Presión", "Colocación de Material"],
        },
        {
          type: "Hotel",
          shortDesc: "Un hotel de 300 habitaciones en primera línea de la Playa de Poniente, donde cada habitación se abre a su propia terraza con vistas al mar.",
          fullDesc: "Apoyamos el proyecto del hotel Poseidon Playas de Benidorm mediante bombeo de hormigón y trabajos de acabado superficial, contribuyendo a la ejecución eficiente de las etapas clave de la construcción.",
          tags: ["Bombeo de Hormigón", "Acabado Superficial"],
        },
        {
          type: "Hotel",
          shortDesc: "Un hotel de 18 plantas frente a la Playa de Levante, que une su Blue Tower original con una nueva Sky Tower — con terraza en la planta 19.",
          fullDesc: "Nuestro equipo realizó bombeo de hormigón y colocación de material para el Port Benidorm Hotel & Spa, garantizando una coordinación precisa y una ejecución fiable en obra durante toda la construcción.",
          tags: ["Bombeo de Hormigón", "Colocación de Material"],
        },
        {
          type: "Hotel",
          shortDesc: "Un hotel familiar de 364 habitaciones junto a la Playa de Levante, construido en torno a un parque acuático, toboganes y una piscina todo incluido.",
          fullDesc: "Nuestro equipo apoyó el desarrollo y la renovación del Hotel Rosamar en Benidorm mediante bombeo de hormigón y trabajos de acabado superficial. El proyecto, completado en 2020, requirió una coordinación precisa y una ejecución fiable en obra.",
          tags: ["Bombeo de Hormigón", "Acabado Superficial", "Colocación de Material"],
        },
        {
          type: "Hotel",
          shortDesc: "Un hotel urbano moderno junto a los Jardines del Turia en Valencia, con piscina y bar en la azotea a pocos pasos del centro histórico.",
          fullDesc: "Nuestro equipo realizó bombeo de hormigón y colocación de material para el Novotel Valencia Lavant, apoyando la construcción del hotel con una ejecución precisa y fiable en un solar urbano de espacio reducido.",
          tags: ["Bombeo de Hormigón", "Colocación de Material"],
        },
      ],
      metaKeys: { year: "Año", type: "Tipo", budget: "Presupuesto", location: "Ubicación", status: "Estado" },
      learnMore: "Saber más",
      viewOnMaps: "Ver en el mapa",
    },
    footer: {
      ctaLabel: "Iniciar un Proyecto",
      ctaHeading: "¿Listo para construir algo excepcional?",
      ctaBtn: "Contáctenos",
      links: ["Servicios", "Proyectos", "Equipos", "Nosotros", "Contacto"],
      copyright: "© 2026 Level Pro. Todos los derechos reservados.",
    },
    servicesPage: {
      hero: {
        label: "Nuestros Servicios",
        headingLine1: "Hormigón profesional",
        headingLine2: "en la",
        headingLine3: "Costa Blanca",
        tagline: "Servicios especializados de hormigón a cualquier escala — desde cimentaciones residenciales hasta grandes estructuras comerciales en la Costa Blanca.",
        scrollLabel: "Scroll",
      },
      tech: {
        label: "Capacidades",
        heading: "Servicios especializados de hormigón",
        intro: "Cinco disciplinas principales, un mismo equipo responsable. Recorra cada servicio para ver el detalle técnico completo.",
      },
      detail: {
        items: [
          {
            name: "Bombeos de Hormigón",
            body: "Nuestro servicio de bombeo cubre desde bombas pluma de largo alcance hasta bombas estacionarias para trabajos de precisión, adaptándose a obra residencial, hotelera, comercial e industrial. Coordinamos cada vertido con su programa de obra para mantener un suministro continuo, sin cortes ni tiempos muertos.",
            bullets: [
              "Alcance de bomba pluma hasta 50 m",
              "Bombas estacionarias para espacios reducidos",
              "Programación de vertidos por fases",
              "Movilización en menos de 24 horas",
            ],
          },
          {
            name: "Morteros autonivelantes",
            body: "Aplicamos morteros autonivelantes de base cemento para conseguir soleras perfectamente planas, lisas y niveladas, la base ideal para suelo radiante, tarima, parqué o pavimento cerámico. Su fraguado rápido acorta los plazos de obra sin renunciar a la resistencia ni a la planimetría exigida.",
            bullets: [
              "Planimetría con tolerancia milimétrica",
              "Fraguado rápido, tránsito en 24-48h",
              "Bombeo mecánico para grandes superficies",
              "Compatible con suelo radiante",
            ],
          },
          {
            name: "Hormigón fratasado",
            body: "Ejecutamos soleras de hormigón fratasadas mecánicamente con helicóptero, logrando una superficie densa, cerrada y resistente al desgaste. Es la solución adecuada para naves industriales, garajes y zonas sometidas a tránsito pesado o rodado constante.",
            bullets: [
              "Fratasado mecánico con helicóptero",
              "Superficie resistente al desgaste",
              "Apto para tránsito de carretillas y vehículos",
              "Endurecedor de cuarzo opcional",
            ],
          },
          {
            name: "Gunitados",
            body: "Proyectamos hormigón por vía húmeda o seca sobre muros de contención, taludes y elementos de geometría compleja, logrando alta resistencia inicial con un mínimo de encofrado. Trabajamos en espacios de difícil acceso manteniendo el control del espesor y la adherencia en cada capa aplicada.",
            bullets: [
              "Proyección por vía húmeda y seca",
              "Mínimo encofrado necesario",
              "Alta resistencia inicial",
              "Control de espesor capa a capa",
            ],
          },
          {
            name: "Formación de pendientes",
            body: "Formamos pendientes de hormigón guiadas por láser para dirigir el agua hacia sumideros y canalones, evitando encharcamientos en cubiertas, terrazas, rampas y patios. Cada pendiente se verifica con equipos de nivelación antes de la entrega, asegurando una evacuación de agua eficaz y duradera.",
            bullets: [
              "Regleado guiado por láser",
              "Pendientes calculadas hacia sumideros",
              "Apto para cubiertas, terrazas y rampas",
              "Verificación de nivel antes de la entrega",
            ],
          },
        ],
      },
      process: {
        label: "Nuestro Enfoque",
        heading: "Precisión en cada etapa",
        steps: [
          { num: "01", title: "Evaluación del sitio", desc: "Evaluamos las rutas de acceso, los requisitos estructurales y las limitaciones logísticas antes de movilizarnos." },
          { num: "02", title: "Planificación técnica", desc: "Nuestro equipo calcula las especificaciones de mezcla, la ubicación de la bomba y la secuencia de vertido para cada obra." },
          { num: "03", title: "Movilización rápida", desc: "Con una capacidad de movilización de 24 horas, nos integramos sin interrupciones en el calendario de su proyecto." },
          { num: "04", title: "Ejecución y control de calidad", desc: "Cada vertido se supervisa en tiempo real, con controles de calidad en cada etapa para garantizar resultados consistentes." },
        ],
      },
      cta: {
        label: "Iniciar un Proyecto",
        heading: "¿Listo para hablar sobre sus necesidades de hormigón?",
        btn: "Contáctenos",
      },
      mission: {
        label: "Misión",
        heading: "Su socio del hormigón en la Costa Blanca",
        body1: "Level Pro ofrece soluciones profesionales de hormigón en la Costa Blanca, combinando equipos experimentados en obra con una flota moderna y bien mantenida.",
        body2: "Desde cimentaciones residenciales hasta grandes vertidos comerciales, aportamos precisión, fiabilidad y comunicación clara en cada etapa de la obra.",
        btn: "Saber más",
      },
      stats: {
        label: "En cifras",
        items: [
          { label: "Proyectos completados" },
          { label: "Ubicaciones de servicio" },
          { label: "Movilización rápida" },
        ],
      },
      locations: {
        label: "Ubicaciones",
        heading: "Operando en toda la Costa Blanca",
        items: [
          { name: "Benidorm", desc: "Nuestra base en la Costa Blanca — cubriendo Benidorm, Altea y todo el litoral cercano." },
          { name: "Ibiza", desc: "Proyectos en la isla atendidos con la misma flota y equipos, de obra residencial a desarrollos hoteleros." },
          { name: "Palma de Mallorca", desc: "Cobertura balear para trabajos de hormigón comerciales y residenciales en toda Mallorca." },
        ],
      },
    },
    aboutPage: {
      hero: {
        label: "Quiénes somos",
        headingLine1: "Construidos sobre",
        headingLine2: "precisión",
        headingLine3: "y confianza",
        tagline: "Un equipo dedicado de especialistas en hormigón comprometido con entregar resultados excepcionales en la Costa Blanca — desde cimentaciones residenciales hasta grandes estructuras comerciales.",
        scrollLabel: "Scroll",
        factLabels: ["Región", "Proyectos completados"],
      },
      mission: {
        label: "Nuestra historia",
        heading: "Experiencia en hormigón en la que puede confiar",
        body1: "Level Pro se fundó con una sola ambición: aportar soluciones profesionales de hormigón a los proyectos de construcción de la Costa Blanca. Lo que comenzó como una operación de bombeo especializada ha crecido hasta convertirse en un socio de confianza para promotores, contratistas y arquitectos de toda la región.",
        body2: "Hoy combinamos equipos experimentados en obra con una flota moderna y bien mantenida, ofreciendo precisión en cada etapa del proceso de hormigonado. Nuestro compromiso con la calidad y la fiabilidad ha construido una reputación que habla por sí sola.",
      },
      values: {
        label: "Lo que nos mueve",
        heading: "Nuestros principios",
        items: [
          { title: "Precisión", desc: "Cada vertido, cada colocación, cada acabado superficial — ejecutado según los más altos estándares sin tolerancia para la imprecisión." },
          { title: "Fiabilidad", desc: "Cuando nos comprometemos con un plazo, lo cumplimos. La movilización rápida y la ejecución constante mantienen su proyecto en tiempo y presupuesto." },
          { title: "Experiencia", desc: "Años de experiencia práctica en proyectos residenciales, comerciales e industriales dan a nuestro equipo el conocimiento para afrontar cualquier reto." },
          { title: "Colaboración", desc: "Trabajamos junto a arquitectos, contratistas y promotores como verdaderos socios — comunicando con claridad y resolviendo problemas de forma proactiva." },
        ],
      },
      milestones: {
        label: "Nuestro camino",
        heading: "Una trayectoria de excelencia en hormigón",
        items: [
          { title: "Fundación en la Costa Blanca", desc: "Level Pro se establece en la Costa Blanca, centrado en el bombeo de hormigón para desarrollos residenciales y costeros." },
          { title: "Expansión de flota", desc: "Incorporación de bombas pluma de alta capacidad para proyectos comerciales y hoteleros de varios pisos en la región." },
          { title: "Sector hotelero", desc: "Finalización de importantes trabajos de bombeo y acabado para el Hotel Rosamar en Benidorm — un hito comercial." },
          { title: "200+ proyectos", desc: "Superamos los 200 proyectos completados y ampliamos en gunitado y trabajos de cimentación." },
        ],
      },
      cta: {
        label: "Trabaja con nosotros",
        heading: "Construyamos algo grande juntos",
        btn: "Contáctenos",
      },
    },
    contactPage: {
      hero: {
        label: "Contacto",
        headingLine1: "Hablemos",
        headingLine2: "de su",
        headingLine3: "proyecto",
        tagline: "Si está planificando un nuevo desarrollo o busca un socio fiable de hormigón, nos encantaría saber de usted.",
        factLabels: ["Ubicación", "Respuesta", "Disponible"],
      },
      info: {
        label: "Información de Contacto",
        heading: "Contáctenos directamente",
        phone: { label: "Teléfono", val: "+34 624 86 88 61" },
        email: { label: "Correo electrónico", val: "info@levelpro.es" },
        note: "Respondemos normalmente en un día hábil. Para consultas urgentes, llámenos directamente.",
      },
      form: {
        name: { label: "Nombre completo", placeholder: "Su nombre completo" },
        email: { label: "Dirección de correo electrónico", placeholder: "su@email.es" },
        message: { label: "Mensaje", placeholder: "Cuéntenos sobre su proyecto — alcance, ubicación, plazos y requisitos específicos." },
        submit: "Enviar mensaje",
        success: { heading: "Mensaje recibido", body: "Gracias por ponerse en contacto con nosotros. Le responderemos en un día hábil." },
        errors: { required: "Este campo es obligatorio", emailInvalid: "Por favor, introduzca una dirección de correo electrónico válida" },
      },
    },
    projectsPage: {
      hero: {
        label: "Nuestro Trabajo",
        headingLine1: "Proyectos construidos",
        headingLine2: "con precisión",
        headingLine3: "en toda la costa",
        tagline: "Explore nuestras obras de hormigón finalizadas y en curso en la Costa Blanca — busque por nombre o filtre por ubicación, estado, tipo y año.",
      },
      search: { placeholder: "Buscar proyectos por nombre, ubicación o palabra clave…", clear: "Borrar búsqueda" },
      filters: {
        title: "Filtros",
        clearAll: "Borrar todo",
        mobileOpen: "Filtros",
        location: { label: "Ubicación" },
        status: { label: "Estado", all: "Todos" },
        type: { label: "Tipo de Construcción" },
        year: { label: "Año de Construcción" },
      },
      statusLabels: { finished: "Finalizado", inProgress: "En Curso" },
      types: { hotel: "Hotel", residential: "Residencial", commercial: "Comercial", industrial: "Industrial" },
      results: {
        template: "Mostrando {n} de {total} proyectos",
        empty: { heading: "Ningún proyecto coincide con sus filtros", body: "Ajuste o borre sus filtros para ver más resultados." },
      },
      card: { seeMore: "Ver más" },
      modal: { close: "Cerrar", scope: "Alcance del Trabajo" },
    },
    equipmentPage: {
      hero: {
        label: "Equipos",
        headingLine1: "Maquinaria pensada",
        headingLine2: "para la",
        headingLine3: "precisión",
        tagline: "Del bombeo de alta presión al acabado preciso de superficies — una flota moderna y bien mantenida, lista para movilizarse por toda la Costa Blanca.",
      },
      intro: {
        label: "Maquinaria Destacada",
        heading: "Dos máquinas para las distintas fases del vertido",
        tagline: "Un vistazo de cerca al equipo principal detrás de nuestro trabajo de bombeo y acabado.",
      },
      items: [
        {
          category: "Bombeo de Hormigón",
          name: "Putzmeister P 730",
          desc: "Una bomba estacionaria compacta de alta presión, diseñada para gunitado y bombeo de línea de precisión — alcanza zonas a las que las bombas pluma no llegan, sin perder rendimiento.",
          specs: [{ label: "Rango de caudal" }, { label: "Presión máxima" }, { label: "Tamaño máx. de árido" }, { label: "Potencia del motor" }],
          bullets: [
            "Bomba de pistón diseñada para funcionamiento continuo de alto ciclo",
            "Chasis remolcable para una movilización rápida entre obras",
            "Alimentación diésel con supervisión completa del operador en obra",
          ],
        },
        {
          category: "Acabado de Suelos",
          name: "Barikell MK8 Ride-On Power Trowel",
          desc: "Una allanadora autopropulsada de doble rotor que talocha y acaba losas de hormigón medianas y grandes con rapidez, dejando una superficie uniforme en cada pasada.",
          specs: [{ label: "Configuración de rotores" }, { label: "Potencia del motor" }, { label: "Velocidad de las palas" }, { label: "Superficie de trabajo" }],
          bullets: [
            "Dos rotores de 750 mm con 8 palas no solapadas cada uno, para un acabado uniforme",
            "Suficientemente compacta para pasar por una puerta estándar de obra",
            "Motor de gasolina con arranque eléctrico para una puesta en marcha rápida",
          ],
        },
      ],
    },
  },
};
