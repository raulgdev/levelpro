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
    playVideo: string;
  };
  about: { label: string; body: string };
  services: {
    label: string;
    headingLine1: string; headingLine2: string; headingLine3: string;
    tagline: string;
    learnMore: string;
    items: Array<{ name: string; detail: string; shortDesc: string; bullets: string[] }>;
  };
  servicesCta: { label: string; heading: string; body: string; btn: string };
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
      labels: { performance: string; equipment: string; scope: string; planning: string; quality: string };
      items: Array<{
        name: string;
        body: string;
        funFact: string;
        bullets: string[];
        metrics: Array<{ value: string; label: string }>;
        equipment: string[];
        equipmentNote: string;
        planning: string;
        quality: string;
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
      weekdays?: string;
      hoursLabel: string;
      mapsLink: string;
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
      sending: string;
      success: { heading: string; body: string };
      errors: { required: string; emailInvalid: string; sendFailed: string };
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
    photoPending: string;
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
      titleLine1: "Higher",
      titleLine2: "Better!",
      titleLine3: "",
      tagline:
        "At Level Pro, we partner with our customers to bring their ambitions to life — delivering concrete projects that make a lasting difference for people and communities.",
      ctaPrimary: "Contact Us",
      ctaSecondary: "View Services",
      locations: ["Benidorm", "Palma de Mallorca", "Ibiza"],
      statsLabels: { projects: "Projects", years: "Years", mobilization: "Mobilization" },
      scroll: "Scroll",
      playVideo: "Play video",
    },
    about: {
      label: "Who we are",
      body: "Level Pro provides professional concrete and mortar pumping and application solutions — at a truly PRO level.",
    },
    services: {
      label: "Our Services",
      headingLine1: "Concrete",
      headingLine2: "professionals",
      headingLine3: "",
      tagline:
        "From foundations to facades — reliable concrete pumping and precise material placement at any scale.",
      learnMore: "Learn more",
      items: [
        {
          name: "Concrete Pumping",
          detail: "Stationary pumps with capacities of up to 50 m³/h, coordinated with your construction programme to ensure a continuous supply.",
          shortDesc: "Stationary pumps with capacities of up to 50 m³/h, coordinated with your construction programme to ensure a continuous supply.",
          bullets: [
            "Boom pumps with reach of up to 50 m",
            "Own fleet for projects of any size",
            "Rapid mobilization in under 24 hours",
            "Operator supervision throughout the pour",
          ],
        },
        {
          name: "Self-levelling Mortars",
          detail: "Interior and exterior screeds with smooth, perfectly level surfaces, ideal for underfloor heating, timber flooring, ceramic coverings and screed build-ups.",
          shortDesc: "Interior and exterior screeds with smooth, perfectly level surfaces, ideal for underfloor heating, timber flooring, ceramic coverings and screed build-ups.",
          bullets: [
            "Perfect flatness for interiors and underfloor heating",
            "Fast setting for shorter project times",
            "Mechanical pumping for large surfaces",
            "Ready for any final floor covering",
          ],
        },
        {
          name: "Power-floated Concrete",
          detail: "Continuous concrete flooring with a surface-applied wearing course, mechanically power-floated across the entire area using single- or double-rotor power trowels.",
          shortDesc: "Continuous concrete flooring with a surface-applied wearing course, mechanically power-floated across the entire area using single- or double-rotor power trowels.",
          bullets: [
            "Mechanical finishing with a power trowel",
            "Surface resistant to wear and heavy traffic",
            "Suitable for industrial buildings and garages",
            "Optional quartz hardener treatment",
          ],
        },
        {
          name: "Shotcrete",
          detail: "Wet-mix sprayed concrete for different applications, including swimming pools, retaining walls and slopes, with minimal formwork and high strength.",
          shortDesc: "Wet-mix sprayed concrete for different applications, including swimming pools, retaining walls and slopes, with minimal formwork and high strength.",
          bullets: [
            "Wet- and dry-mix spraying",
            "Ideal for retaining walls and slopes",
            "Minimal formwork and shorter execution times",
            "Layer-by-layer thickness control",
          ],
        },
        {
          name: "Slope Forming",
          detail: "Formation of falls on terraces, pitched roofs, flat roofs and other large elevated surfaces, including areas with difficult access.",
          shortDesc: "Formation of falls on terraces, pitched roofs, flat roofs and other large elevated surfaces, including areas with difficult access.",
          bullets: [
            "Laser-guided screeding for verified gradients",
            "Calculated falls towards drains and outlets",
            "Suitable for roofs, terraces, ramps and yards",
            "Level verification before handover",
          ],
        },
      ],
    },
    servicesCta: {
      label: "Tailored services",
      heading: "No matter how large or complex your project is, we have the right solution for you.",
      body: "No matter how large or complex your project is, we have the right solution for you.",
      btn: "Get in Touch",
    },
    stats: {
      label: "Operations & Resources",
      heading: "Precision and efficiency in every project",
      equipmentBtn: "Our Projects",
      items: [
        { label: "Concrete pumping capacity" },
        { label: "Projects completed" },
        { label: "Rapid site mobilization" },
      ],
    },
    materials: {
      heading: "Quality materials and specialized equipment",
      tagline: "We work with certified concrete and maintain our fleet to the highest standards.",
      cards: [
        {
          title: "Modern concrete pumping equipment",
          desc: "Our fleet includes high-capacity static pumps, line pumping systems, and shotcrete machines maintained to very high quality standards, enabling efficient delivery across all types of projects — from residential work to large commercial developments.",
        },
        {
          title: "High-quality concrete",
          desc: "We work with certified CEMEX concrete mixes, specialized mortars, self-leveling compounds, sprayed mortars, and high-strength finishing mortars, ensuring durability and consistent performance in all conditions.",
        },
      ],
    },
    projects: {
      label: "Selected Projects",
      heading: "Projects on the Costa Blanca",
      items: [
        {
          type: "Residential",
          shortDesc: "Self-levelling mortar works completed at Seaway Tower, creating uniform floor bases ready for the final finishes.",
          fullDesc: "Our team delivered self-levelling mortar works at Seaway Tower, coordinating pumping and levelling to create consistent floor bases throughout the building. The project was completed in 2025.",
          tags: ["Self-levelling Mortars"],
        },
        {
          type: "Hotel",
          shortDesc: "A 22-room boutique hotel between Poniente Beach and Cala de Finestrat, reborn from a 1950s hostel with a retro Spanish-Riviera design.",
          fullDesc: "Our team carried out self-levelling mortar works at Nomad Hotel Cala Finestrat, delivering uniform floor bases for the hotel's interior finishes. The project was completed in 2025.",
          tags: ["Self-levelling Mortars"],
        },
        {
          type: "Residential",
          shortDesc: "Concrete pumping and self-levelling mortar works delivered at the Alibuilding complex in Benidorm.",
          fullDesc: "At the Alibuilding complex in Benidorm, our team carried out concrete pumping and self-levelling mortar works, coordinating each phase with the site team for precise and efficient delivery. The work was completed in 2025.",
          tags: ["Concrete Pumping", "Self-levelling Mortars"],
        },
        {
          type: "Residential",
          shortDesc: "An exclusive residential tower on Avenida del Mediterráneo — 19 homes, one per floor, each facing the sea.",
          fullDesc: "Our team delivered concrete pumping and self-levelling mortar works for Monver Tower Benidorm, coordinating vertical delivery and uniform floor preparation. The project was completed in 2022.",
          tags: ["Concrete Pumping", "Self-levelling Mortars"],
        },
        {
          type: "Hotel",
          shortDesc: "A 300-room hotel on the first line of Playa de Poniente, where every room opens onto its own sea-view terrace.",
          fullDesc: "Our team is supporting Poseidon Playas de Benidorm with concrete pumping, power-floated concrete, self-levelling mortars and slope forming, coordinating the different applications across the project.",
          tags: ["Concrete Pumping", "Power-floated Concrete", "Self-levelling Mortars", "Slope Forming"],
        },
        {
          type: "Hotel",
          shortDesc: "An 18-storey beachfront hotel on Levante Beach, pairing its original Blue Tower with a new Sky Tower and a rooftop terrace on floor 19.",
          fullDesc: "Our team carried out concrete pumping, power-floated concrete, self-levelling mortar and slope-forming works for Port Benidorm Hotel, coordinating each application through completion in 2025.",
          tags: ["Concrete Pumping", "Power-floated Concrete", "Self-levelling Mortars", "Slope Forming"],
        },
        {
          type: "Hotel",
          shortDesc: "A 364-room family hotel by Levante Beach, built around a water park, slides and an all-inclusive pool scene.",
          fullDesc: "Our team carried out self-levelling mortar works at Hotel Rosamar in Benidorm, producing uniform floor bases for subsequent finishes. The project was completed in 2024.",
          tags: ["Self-levelling Mortars"],
        },
        {
          type: "Hotel",
          shortDesc: "A modern urban hotel near Valencia's Turia Gardens, with a rooftop pool and skyline bar just steps from the historic centre.",
          fullDesc: "Our team delivered self-levelling mortar and slope-forming works at Novotel Valencia Lavant, preparing uniform surfaces and correctly graded areas. The project was completed in 2024.",
          tags: ["Self-levelling Mortars", "Slope Forming"],
        },
        {
          type: "Hotel",
          shortDesc: "Concrete pumping and structural levelling concrete works completed at Villa España Hotel in Benidorm.",
          fullDesc: "Our team completed concrete pumping and structural levelling concrete works at Villa España Hotel in Benidorm, coordinating the supply and placement required for the building's structural surfaces. The project was completed in 2023.",
          tags: ["Concrete Pumping", "Structural Levelling Concrete"],
        },
        {
          type: "Residential",
          shortDesc: "Concrete pumping, self-levelling mortar and shotcrete works completed at Edificio La Jirafa in Benidorm.",
          fullDesc: "Our team carried out concrete pumping, self-levelling mortar and shotcrete works at Edificio La Jirafa in Benidorm, combining several specialist applications within one coordinated programme. The project was completed in 2025.",
          tags: ["Concrete Pumping", "Self-levelling Mortars", "Shotcrete"],
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
        headingLine1: "Concrete",
        headingLine2: "professionals",
        headingLine3: "",
        tagline: "Specialized concrete pumping and application services at any scale — for commercial and residential structures, single-family homes, industrial projects and more.",
        scrollLabel: "Scroll",
      },
      tech: {
        label: "Capabilities",
        heading: "Specialized services",
        intro: "We offer specialized services for every type of project.",
      },
      detail: {
        labels: { performance: "Performance", equipment: "Recommended equipment", scope: "Applications & control", planning: "Planning", quality: "Quality control" },
        items: [
          {
            name: "Concrete Pumping",
            body: "Stationary pumps with capacities of up to 50 m³/h, coordinated with your construction programme for a continuous supply.\n\nWe assess access, line routing, working height and pour sequencing to select a safe, consistent pumping configuration.\n\nWe serve residential developments, hotels, commercial structures and industrial sites across the Costa Blanca and Spain. Technical coordination reduces mixer waiting times and maintains uniform placement on restricted sites.",
            funFact: "A carefully planned pipeline keeps the pour moving continuously and reduces interruptions at the placement point.",
            bullets: [
              "Boom pump reach up to 50 m",
              "Stationary pumps for confined spaces",
              "Phased pour scheduling",
              "Mobilization in under 24 hours",
            ],
            metrics: [
              { value: "Up to 200 m³", label: "Volume per day" },
              { value: "1–3 days", label: "Advance planning" },
              { value: "<24 h", label: "Mobilisation" },
            ],
            equipment: ["Putzmeister BSA 1005 D5", "Putzmeister P 720"],
            equipmentNote: "We select the pump according to pour volume, line distance, site access and required pressure.",
            planning: "Pour sequencing is coordinated with concrete supply and the site programme. Actual output depends on mix design, hose length, elevation and site logistics.",
            quality: "Before and during pumping, we verify line routing, priming, connections and continuity of material flow to reduce interruptions and segregation.",
          },
          {
            name: "Self-levelling Mortars",
            body: "Interior and exterior screeds with smooth, level surfaces, ideal for underfloor heating, timber flooring, ceramic coverings and build-ups.\n\nWe coordinate substrate preparation, reference levels, pumping and levelling to deliver large areas continuously with controlled thickness.\n\nSuitable for homes, hotels, offices, retail and refurbishment projects across Spain, pumped self-levelling mortar creates a reliable, uniform base faster than traditional manual application.",
            funFact: "Large, level surfaces can typically be ready for foot traffic within 24–48 hours, depending on the selected mix.",
            bullets: [
              "Millimetre-precision flatness",
              "Fast setting, walkable in 24–48 hours",
              "Mechanical pumping for large surfaces",
              "Compatible with underfloor heating",
            ],
            metrics: [
              { value: "Up to 2,000 m²", label: "Daily application" },
              { value: "5–80 mm", label: "Layer thickness" },
              { value: "24–48 h", label: "Foot traffic" },
            ],
            equipment: ["Putzmeister SP 25 DHF", "Putzmeister P 720"],
            equipmentNote: "Worm-drive and piston pumps provide controlled delivery for self-levelling mortars over large areas and at height.",
            planning: "Application time depends on area, thickness, mix and ambient conditions; typical foot traffic is planned around the specified 24–48 hour curing window.",
            quality: "Substrate condition, reference levels, mix consistency and final flatness are checked throughout application before curing begins.",
          },
          {
            name: "Power-floated Concrete",
            body: "Continuous concrete flooring with a wearing course, mechanically finished using single- or double-rotor power trowels.\n\nSuccessive passes, edge finishing and optional hardeners are timed to the concrete set to create a dense, uniform surface.\n\nIdeal for warehouses, car parks, logistics areas, workshops and commercial floors, this coordinated process delivers durable slabs with controlled flatness and lower maintenance needs.",
            funFact: "The ideal moment for power floating is determined by the concrete set—not simply by the clock.",
            bullets: [
              "Mechanical finishing with a power trowel",
              "Wear-resistant surface",
              "Suitable for forklift and vehicle traffic",
              "Optional quartz hardener",
            ],
            metrics: [
              { value: "Up to 1,300 m²", label: "Daily finishing area" },
              { value: "2–6 passes", label: "Finishing sequence" },
              { value: "4–10 h", label: "Finishing window" },
            ],
            equipment: ["Barikell MK8 Ride-On Power Trowel", "Single-rotor power trowels"],
            equipmentNote: "The ride-on twin-rotor machine covers large slabs efficiently, while smaller machines finish edges and restricted areas.",
            planning: "Floating begins when the slab reaches the correct set. The number of passes and finishing time vary with the mix, temperature, slab size and desired finish.",
            quality: "We monitor concrete set, timing between passes, edge finishing and surface uniformity so the slab reaches the specified finish.",
          },
          {
            name: "Shotcrete",
            body: "Wet-mix sprayed concrete for swimming pools, retaining walls and slopes, providing high strength with minimal formwork.\n\nWe adapt pressure, nozzle distance, layer thickness and application sequence to vertical, curved or hard-to-access structures.\n\nUsed for pools, slope stabilisation, structural reinforcement and concrete repairs across Spain, continuous wet-mix application improves adhesion and forms complex geometries efficiently.",
            funFact: "Wet-mix spraying follows vertical and curved geometries while requiring remarkably little formwork.",
            bullets: [
              "Wet- and dry-mix spraying",
              "Minimal formwork required",
              "High early strength",
              "Layer-by-layer thickness control",
            ],
            metrics: [
              { value: "Up to 200 m²", label: "Daily application" },
              { value: "50–150 mm", label: "Layer thickness" },
              { value: "5–15%", label: "Typical rebound" },
            ],
            equipment: ["Putzmeister P 720", "Putzmeister SP 25 DHF"],
            equipmentNote: "Compact pumping systems support controlled wet-mix application in confined or hard-to-access areas.",
            planning: "Work is organised in controlled layers. Duration depends on surface preparation, layer thickness, reinforcement, geometry and access.",
            quality: "Support preparation, reinforcement cover, layer thickness and rebound are controlled during application to maintain a compact, uniform build-up.",
          },
          {
            name: "Slope Forming",
            body: "Formation of falls on terraces, roofs, ramps and large elevated surfaces, including areas with difficult access.\n\nContinuous pumping, laser references and precise screeding direct water towards drains while creating an even base for waterproofing.\n\nFor balconies, car parks and technical roofs, accurately formed slopes prevent standing water, protect waterproofing systems and prepare the surface for its final finish.",
            funFact: "A difference of only a few millimetres can determine whether a roof drains correctly or retains water.",
            bullets: [
              "Laser-guided screeding",
              "Calculated falls towards drains",
              "Suitable for roofs, terraces and ramps",
              "Level verification before handover",
            ],
            metrics: [
              { value: "1–5%", label: "Designed fall" },
              { value: "20–80 mm", label: "Layer thickness" },
              { value: "±3 mm", label: "Level tolerance" },
            ],
            equipment: ["Putzmeister SP 25 DHF", "Laser levelling equipment"],
            equipmentNote: "The mortar pump keeps delivery consistent while laser measurement and screeding establish the specified falls.",
            planning: "Areas are divided into workable zones and falls are checked before handover. Execution time depends on area, thickness, height and the number of drainage points.",
            quality: "Laser references, falls and drainage points are checked during screeding and again before handover to confirm water flows to the designed outlets.",
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
        heading: "A company you can trust",
        body1: "Level Pro provides professional solutions for concrete projects, combining experienced on-site teams with a modern, well-maintained fleet.",
        body2: "From residential structures to large commercial pours, we bring precision, reliability and clear communication to every stage of the build.",
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
        heading: "Operating nationwide",
        items: [
          { name: "Benidorm", desc: "Our home base on the Costa Blanca — covering Benidorm, Altea and the surrounding coastline." },
          { name: "Ibiza", desc: "Island projects served by the same fleet and crews, from residential builds to hospitality developments." },
          { name: "Palma de Mallorca", desc: "Balearic coverage for commercial and residential concrete works across Mallorca." },
          { name: "Nationwide", desc: "We operate nationwide, mobilising our fleet and crews for concreting projects throughout Spain." },
        ],
      },
    },
    aboutPage: {
      hero: {
        label: "Who We Are",
        headingLine1: "Higher",
        headingLine2: "Better",
        headingLine3: "",
        tagline: "A professional team with high quality standards, continuously striving higher with one very clear goal: Higher — Better quality, service, customer care and tailored solutions for every project, day after day.",
        scrollLabel: "Scroll",
        factLabels: ["Region", "Projects completed"],
      },
      mission: {
        label: "Our Story",
        heading: "Concrete expertise you can rely on",
        body1: "Level Pro was founded with the ambition of bringing professional concrete pumping and application solutions to construction projects across the Costa Blanca. What began as a specialised pumping operation has grown into a trusted partner for developers, contractors and architects throughout the region.",
        body2: "Today, we combine experienced crews with a modern, flexible fleet, delivering precision at every stage of the concreting process. Our commitment to quality and reliability has built a reputation that speaks for itself.",
      },
      values: {
        label: "What Drives Us",
        heading: "Our principles",
        items: [
          { title: "Precision", desc: "Every pour, every placement, every surface finish — executed to the highest quality standards." },
          { title: "Reliability", desc: "When we commit to a schedule, we deliver. Rapid mobilisation and consistent execution keep your project on time and on budget." },
          { title: "Expertise", desc: "Years of hands-on experience across residential, commercial and industrial projects gives our team the knowledge to handle any challenge." },
          { title: "Partnership", desc: "We work alongside architects, contractors and developers as a true partner — communicating clearly and solving problems proactively." },
        ],
      },
      milestones: {
        label: "Our Journey",
        heading: "A track record of concrete excellence",
        items: [
          { title: "Founded on the Costa Blanca", desc: "Level Pro is established on the Costa Blanca, focusing on concrete pumping for residential developments." },
          { title: "Fleet expansion", desc: "High-capacity static pumps are added for multi-storey commercial and hotel projects." },
          { title: "Hotel sector", desc: "Major pumping and finishing works are completed in Benidorm's hotel sector — a commercial milestone." },
          { title: "1500+ projects", desc: "We have completed more than 1,500 projects, large and small." },
        ],
      },
      cta: {
        label: "Work With Us",
        heading: "Shall we talk?",
        btn: "Get in Touch",
      },
    },
    contactPage: {
      hero: {
        label: "Contact",
        headingLine1: "Let's talk",
        headingLine2: "about your",
        headingLine3: "project",
        tagline: "If you are planning a new development or looking for a reliable partner for concrete pumping and applications, we would be delighted to hear from you.",
        factLabels: ["Location", "Response", "8:00 - 18:00"],
        weekdays: "Mon–Fri",
        hoursLabel: "Opening hours",
        mapsLink: "View on Google Maps",
      },
      info: {
        label: "Contact Information",
        heading: "Contact us",
        phone: { label: "Phone", val: "+34 624 86 88 61" },
        email: { label: "Email", val: "info@levelpro.es" },
        note: "We respond as quickly as possible.",
      },
      form: {
        name: { label: "Full Name", placeholder: "Your full name" },
        email: { label: "Email Address", placeholder: "your@email.com" },
        message: { label: "Message", placeholder: "Tell us about your project — scope, location, timeline, and any specific requirements." },
        submit: "Send Message",
        sending: "Sending...",
        success: { heading: "Message received", body: "Thank you for reaching out. We'll be in touch within one business day." },
        errors: { required: "This field is required", emailInvalid: "Please enter a valid email address", sendFailed: "We couldn't send your message. Please try again or contact us by email." },
      },
    },
    projectsPage: {
      hero: {
        label: "Our Work",
        headingLine1: "Projects built",
        headingLine2: "with precision",
        headingLine3: "and dedication",
        tagline: "Explore our completed and ongoing projects, search by name or filter by location, status, type and year.",
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
        headingLine1: "Our machines",
        headingLine2: "for the different stages",
        headingLine3: "of the work",
        tagline: "A closer look at the core equipment behind our pumping and finishing work.",
      },
      intro: {
        label: "Featured Machines",
        heading: "The machines built for every stage of the pour",
        tagline: "A closer look at the core equipment behind our pumping and finishing work.",
      },
      items: [
        {
          category: "Concrete Pumping",
          name: "Putzmeister P 720",
          desc: "A compact, lightweight stationary pump built for shotcrete and self-levelling screed work — engineered to reach tight or restricted sites without giving up delivery distance.",
          specs: [{ label: "Max output" }, { label: "Max pressure" }, { label: "Max aggregate size" }, { label: "Engine power" }],
          bullets: [
            "2-cylinder hydraulic piston pump, built for shotcrete and self-levelling screed",
            "Delivers up to 300 m horizontally or 100 m vertically from one setup",
            "Compact, trailer-mounted chassis for fast mobilization between sites",
          ],
        },
        {
          category: "Concrete Pumping",
          name: "Putzmeister BSA 1005 D5",
          desc: "A high-output stationary pump for large, continuous pours — built to sustain high-cycle operation without losing pressure over long runs.",
          specs: [{ label: "Max output" }, { label: "Max pressure" }, { label: "Engine power" }, { label: "Weight" }],
          bullets: [
            "180 mm delivery cylinder with a 1,000 mm stroke, up to 33 strokes per minute",
            "300 L hopper with agitator for continuous, uninterrupted feeding",
            "Trailer-mounted chassis with 3 mechanical outriggers for stable operation",
          ],
        },
        {
          category: "Self-levelling Mortars",
          name: "Putzmeister SP 25 DHF",
          desc: "A worm-drive screed pump built for high-volume self-levelling floor screed, with enough range and grain tolerance to also handle fine shotcrete work.",
          specs: [{ label: "Max output" }, { label: "Max pressure" }, { label: "Max grain size" }, { label: "Engine power" }],
          bullets: [
            "Delivers up to 200 m horizontally or 60 m vertically — around 20 floors — from one setup",
            "Large filling area with a swinging spray guard and powerful vibrating screen",
            "Compact and lightweight at 1,050 kg for easier on-site handling",
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
        {
          category: "Floor Finishing",
          name: "BARIKELL MK8-90, MOTOR B&S 35CP",
          desc: "A high-performance ride-on power trowel powered by a 35 HP Briggs & Stratton engine, designed for fast and consistent finishing across large concrete slabs.",
          specs: [{ label: "Rotor configuration" }, { label: "Engine power" }, { label: "Blades per rotor" }, { label: "Operating position" }],
          bullets: [
            "Twin-rotor configuration for uniform finishing across large surfaces",
            "35 HP Briggs & Stratton engine for sustained on-site performance",
            "Ride-on operation for efficient finishing with precise operator control",
          ],
        },
      ],
      photoPending: "Photo coming soon",
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
      titleLine1: "Höher",
      titleLine2: "Besser!",
      titleLine3: "",
      tagline:
        "Bei Level Pro arbeiten wir mit unseren Kunden zusammen, um ihre Ambitionen zu verwirklichen — und liefern Betonprojekte, die einen bleibenden Unterschied für Menschen und Gemeinschaften machen.",
      ctaPrimary: "Kontaktieren Sie uns",
      ctaSecondary: "Leistungen ansehen",
      locations: ["Benidorm", "Palma de Mallorca", "Ibiza"],
      statsLabels: { projects: "Projekte", years: "Jahre", mobilization: "Mobilisierung" },
      scroll: "Scrollen",
      playVideo: "Video abspielen",
    },
    about: {
      label: "Wer wir sind",
      body: "Level Pro bietet professionelle Lösungen für das Pumpen und die Verarbeitung von Beton und Mörtel — auf PRO-Niveau.",
    },
    services: {
      label: "Unsere Dienstleistungen",
      headingLine1: "Profis für",
      headingLine2: "Beton",
      headingLine3: "",
      tagline:
        "Von Fundamenten bis Fassaden — zuverlässiges Betonpumpen und präzise Materialplatzierung in jedem Maßstab.",
      learnMore: "Mehr erfahren",
      items: [
        {
          name: "Betonpumpen",
          detail: "Stationäre Pumpen mit einer Förderleistung von bis zu 50 m³/h, abgestimmt auf Ihren Bauablauf für eine kontinuierliche Versorgung.",
          shortDesc: "Stationäre Pumpen mit einer Förderleistung von bis zu 50 m³/h, abgestimmt auf Ihren Bauablauf für eine kontinuierliche Versorgung.",
          bullets: [
            "Autobetonpumpen mit bis zu 50 m Reichweite",
            "Eigene Flotte für Projekte jeder Größe",
            "Schnelle Mobilisierung in weniger als 24 Stunden",
            "Bedienerbetreuung während des gesamten Betoniervorgangs",
          ],
        },
        {
          name: "Nivelliermörtel",
          detail: "Estriche im Innen- und Außenbereich mit glatten, perfekt nivellierten Oberflächen, ideal für Fußbodenheizungen, Holzböden, keramische Beläge und Höhenausgleichsschichten.",
          shortDesc: "Estriche im Innen- und Außenbereich mit glatten, perfekt nivellierten Oberflächen, ideal für Fußbodenheizungen, Holzböden, keramische Beläge und Höhenausgleichsschichten.",
          bullets: [
            "Perfekte Ebenheit in Innenräumen und bei Fußbodenheizung",
            "Schnelle Aushärtung für kürzere Bauzeiten",
            "Maschinelles Pumpen für große Flächen",
            "Verlegefertige Oberfläche für jeden Bodenbelag",
          ],
        },
        {
          name: "Betonglättung",
          detail: "Fugenloser Betonboden mit oberflächlich aufgebrachter Verschleißschicht, der über die gesamte Fläche mit einfachen oder doppelten Flügelglättern mechanisch geglättet wird.",
          shortDesc: "Fugenloser Betonboden mit oberflächlich aufgebrachter Verschleißschicht, der über die gesamte Fläche mit einfachen oder doppelten Flügelglättern mechanisch geglättet wird.",
          bullets: [
            "Mechanische Bearbeitung mit dem Flügelglätter",
            "Verschleißfest und für Schwerlastverkehr geeignet",
            "Für Industriehallen und Garagen geeignet",
            "Optionale Behandlung mit Quarzhärter",
          ],
        },
        {
          name: "Spritzbeton",
          detail: "Im Nassspritzverfahren aufgebrachter Beton für verschiedene Einsatzbereiche wie Schwimmbecken, Stützmauern und Böschungen, mit minimaler Schalung und hoher Festigkeit.",
          shortDesc: "Im Nassspritzverfahren aufgebrachter Beton für verschiedene Einsatzbereiche wie Schwimmbecken, Stützmauern und Böschungen, mit minimaler Schalung und hoher Festigkeit.",
          bullets: [
            "Nass- und Trockenspritzverfahren",
            "Ideal für Stützmauern und Böschungen",
            "Minimale Schalung und kürzere Ausführungszeit",
            "Schichtweise Kontrolle der Auftragsdicke",
          ],
        },
        {
          name: "Gefälle",
          detail: "Ausbildung von Gefällen auf Terrassen, geneigten Dächern, Flachdächern und weiteren großen Flächen in beträchtlicher Höhe, auch in schwer zugänglichen Bereichen.",
          shortDesc: "Ausbildung von Gefällen auf Terrassen, geneigten Dächern, Flachdächern und weiteren großen Flächen in beträchtlicher Höhe, auch in schwer zugänglichen Bereichen.",
          bullets: [
            "Lasergeführter Estricheinbau",
            "Berechnete Gefälle zu Abläufen und Entwässerungen",
            "Für Dächer, Terrassen, Rampen und Höfe geeignet",
            "Nivellierkontrolle vor der Übergabe",
          ],
        },
      ],
    },
    servicesCta: {
      label: "Sonderlösungen",
      heading: "Ganz gleich, wie groß oder komplex Ihr Projekt ist – wir haben die passende Lösung für Sie.",
      body: "Ganz gleich, wie groß oder komplex Ihr Projekt ist – wir haben die passende Lösung für Sie.",
      btn: "Kontakt aufnehmen",
    },
    stats: {
      label: "Betrieb & Ressourcen",
      heading: "Präzision und Effizienz bei jedem Projekt",
      equipmentBtn: "Unsere Projekte",
      items: [
        { label: "Betonpumpkapazität" },
        { label: "Abgeschlossene Projekte" },
        { label: "Schnelle Mobilisierung" },
      ],
    },
    materials: {
      heading: "Hochwertige Materialien und Spezialausrüstung",
      tagline: "Wir arbeiten mit zertifiziertem Beton und warten unsere Flotte nach höchsten Standards.",
      cards: [
        {
          title: "Moderne Betonpumptechnik",
          desc: "Unsere Flotte umfasst leistungsstarke stationäre Betonpumpen, Leitungspumpsysteme und Spritzbetonmaschinen, die nach sehr hohen Qualitätsstandards gewartet werden. So ermöglichen wir eine effiziente Ausführung bei Projekten jeder Größenordnung — vom Wohnungsbau bis hin zu großen Gewerbeprojekten.",
        },
        {
          title: "Hochwertiger Beton",
          desc: "Wir arbeiten mit zertifizierten Betonmischungen von CEMEX, Spezialmörteln, selbstnivellierenden Mörteln, Spritzmörteln und hochfesten Oberflächenmörteln. So gewährleisten wir Langlebigkeit und gleichbleibende Leistung unter allen Bedingungen.",
        },
      ],
    },
    projects: {
      label: "Ausgewählte Projekte",
      heading: "Projekte an der Costa Blanca",
      items: [
        {
          type: "Wohnbau",
          shortDesc: "Nivelliermörtelarbeiten im Seaway Tower für gleichmäßige, für den Endbelag vorbereitete Bodenflächen.",
          fullDesc: "Unser Team führte im Seaway Tower Nivelliermörtelarbeiten aus und koordinierte Pumpen und Nivellieren für gleichmäßige Bodenflächen im gesamten Gebäude. Das Projekt wurde 2025 fertiggestellt.",
          tags: ["Nivelliermörtel"],
        },
        {
          type: "Hotel",
          shortDesc: "Ein Boutique-Hotel mit 22 Zimmern zwischen Playa Poniente und Cala de Finestrat, entstanden aus einem Hostel der 1950er im Retro-Design der spanischen Riviera.",
          fullDesc: "Unser Team führte im Nomad Hotel Cala Finestrat Nivelliermörtelarbeiten aus und schuf gleichmäßige Untergründe für die Innenausstattung des Hotels. Das Projekt wurde 2025 fertiggestellt.",
          tags: ["Nivelliermörtel"],
        },
        {
          type: "Wohnbau",
          shortDesc: "Betonpump- und Nivelliermörtelarbeiten im Alibuilding-Komplex in Benidorm.",
          fullDesc: "Im Alibuilding-Komplex in Benidorm führte unser Team Betonpump- und Nivelliermörtelarbeiten aus und koordinierte jede Phase mit dem Baustellenteam für eine präzise und effiziente Ausführung. Die Arbeiten wurden 2025 abgeschlossen.",
          tags: ["Betonpumpen", "Nivelliermörtel"],
        },
        {
          type: "Wohnbau",
          shortDesc: "Ein exklusiver Wohnturm an der Avenida del Mediterráneo — 19 Wohnungen, eine pro Etage, jede mit Blick aufs Meer.",
          fullDesc: "Unser Team führte am Monver Tower Benidorm Betonpump- und Nivelliermörtelarbeiten aus und koordinierte die vertikale Förderung sowie die gleichmäßige Bodenvorbereitung. Das Projekt wurde 2022 fertiggestellt.",
          tags: ["Betonpumpen", "Nivelliermörtel"],
        },
        {
          type: "Hotel",
          shortDesc: "Ein Hotel mit 300 Zimmern direkt an der Playa de Poniente, wo jedes Zimmer eine eigene Terrasse mit Meerblick hat.",
          fullDesc: "Unser Team unterstützt Poseidon Playas de Benidorm mit Betonpumpen, Betonglättung, Nivelliermörtel und Gefälleausbildung und koordiniert die verschiedenen Anwendungen im gesamten Projekt.",
          tags: ["Betonpumpen", "Betonglättung", "Nivelliermörtel", "Gefälle"],
        },
        {
          type: "Hotel",
          shortDesc: "Ein 18-stöckiges Strandhotel an der Levante-Küste, das den ursprünglichen Blue Tower mit einem neuen Sky Tower verbindet — mit Dachterrasse im 19. Stock.",
          fullDesc: "Unser Team führte im Port Benidorm Hotel Betonpump-, Betonglättungs-, Nivelliermörtel- und Gefällearbeiten aus und koordinierte alle Anwendungen bis zur Fertigstellung im Jahr 2025.",
          tags: ["Betonpumpen", "Betonglättung", "Nivelliermörtel", "Gefälle"],
        },
        {
          type: "Hotel",
          shortDesc: "Ein Familienhotel mit 364 Zimmern nahe der Levante-Küste, aufgebaut rund um einen Wasserpark, Rutschen und ein All-inclusive-Poolareal.",
          fullDesc: "Unser Team führte im Hotel Rosamar in Benidorm Nivelliermörtelarbeiten aus und schuf gleichmäßige Untergründe für die folgenden Bodenbeläge. Das Projekt wurde 2024 fertiggestellt.",
          tags: ["Nivelliermörtel"],
        },
        {
          type: "Hotel",
          shortDesc: "Ein modernes Stadthotel nahe der Turia-Gärten in Valencia, mit Dachpool und Skyline-Bar nur wenige Schritte vom historischen Zentrum entfernt.",
          fullDesc: "Unser Team führte im Novotel Valencia Lavant Nivelliermörtel- und Gefällearbeiten aus und bereitete gleichmäßige Flächen sowie korrekt geneigte Bereiche vor. Das Projekt wurde 2024 fertiggestellt.",
          tags: ["Nivelliermörtel", "Gefälle"],
        },
        {
          type: "Hotel",
          shortDesc: "Betonpump- und strukturelle Nivellierbetonarbeiten im Villa España Hotel in Benidorm.",
          fullDesc: "Unser Team führte im Villa España Hotel in Benidorm Betonpump- und strukturelle Nivellierbetonarbeiten aus und koordinierte Lieferung und Einbau für die tragenden Flächen des Gebäudes. Das Projekt wurde 2023 fertiggestellt.",
          tags: ["Betonpumpen", "Struktureller Nivellierbeton"],
        },
        {
          type: "Wohnbau",
          shortDesc: "Betonpump-, Nivelliermörtel- und Spritzbetonarbeiten am Edificio La Jirafa in Benidorm.",
          fullDesc: "Unser Team führte am Edificio La Jirafa in Benidorm Betonpump-, Nivelliermörtel- und Spritzbetonarbeiten aus und verband mehrere Spezialanwendungen in einem abgestimmten Ablauf. Das Projekt wurde 2025 fertiggestellt.",
          tags: ["Betonpumpen", "Nivelliermörtel", "Spritzbeton"],
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
        headingLine1: "Profis für",
        headingLine2: "Beton",
        headingLine3: "",
        tagline: "Spezialisierte Dienstleistungen für das Pumpen und Verarbeiten von Beton in jeder Größenordnung — für Gewerbe- und Wohnbauten, Einfamilienhäuser, Industrieprojekte und mehr.",
        scrollLabel: "Scrollen",
      },
      tech: {
        label: "Leistungsspektrum",
        heading: "Spezialisierte Dienstleistungen",
        intro: "Wir bieten spezialisierte Dienstleistungen für jede Art von Projekt.",
      },
      detail: {
        labels: { performance: "Leistungsdaten", equipment: "Empfohlene Ausrüstung", scope: "Anwendungen & Kontrolle", planning: "Planung", quality: "Qualitätskontrolle" },
        items: [
          {
            name: "Betonpumpen",
            body: "Stationäre Pumpen mit bis zu 50 m³/h, abgestimmt auf Ihren Bauablauf für eine kontinuierliche Versorgung.\n\nWir prüfen Zufahrt, Leitungsführung, Arbeitshöhe und Betonierfolge, um eine sichere, gleichmäßige Pumpenkonfiguration zu wählen.\n\nUnser Service unterstützt Wohnanlagen, Hotels, Gewerbe- und Industrieprojekte an der Costa Blanca und in ganz Spanien. Technische Koordination verkürzt Wartezeiten und sichert die Betonage auf schwer zugänglichen Baustellen.",
            funFact: "Eine sorgfältig geplante Förderleitung hält den Betonierprozess in Bewegung und reduziert Unterbrechungen an der Einbaustelle.",
            bullets: [
              "Autobetonpumpen mit bis zu 50 m Reichweite",
              "Stationäre Pumpen für beengte Bereiche",
              "Phasenweise Planung der Betoniervorgänge",
              "Mobilisierung in weniger als 24 Stunden",
            ],
            metrics: [
              { value: "Bis zu 200 m³", label: "Tagesvolumen" },
              { value: "1–3 Tage", label: "Vorlaufplanung" },
              { value: "<24 h", label: "Mobilisierung" },
            ],
            equipment: ["Putzmeister BSA 1005 D5", "Putzmeister P 720"],
            equipmentNote: "Wir wählen die Pumpe passend zu Betonmenge, Leitungsdistanz, Baustellenzugang und benötigtem Druck aus.",
            planning: "Die Betonierfolge wird mit der Betonlieferung und dem Bauablauf abgestimmt. Die tatsächliche Leistung hängt von Rezeptur, Schlauchlänge, Förderhöhe und Baustellenlogistik ab.",
            quality: "Vor und während des Pumpens prüfen wir Leitungsführung, Anpumpen, Verbindungen und kontinuierlichen Materialfluss, um Unterbrechungen und Entmischung zu reduzieren.",
          },
          {
            name: "Nivelliermörtel",
            body: "Glatte, nivellierte Estriche für innen und außen, ideal für Fußbodenheizung, Holzböden, keramische Beläge und Ausgleichsschichten.\n\nWir koordinieren Untergrund, Bezugshöhen, Pumpen und Nivellieren für große Flächen mit kontrollierter Dicke.\n\nFür Wohnhäuser, Hotels, Büros, Gewerbe und Sanierungen in ganz Spanien schafft gepumpter Fließmörtel schneller als manueller Einbau einen zuverlässigen, gleichmäßigen Untergrund.",
            funFact: "Große, ebene Flächen können je nach gewählter Mischung häufig nach 24–48 Stunden begehbar sein.",
            bullets: [
              "Millimetergenaue Ebenheit",
              "Schnelle Aushärtung, begehbar nach 24–48 Stunden",
              "Maschinelles Pumpen für große Flächen",
              "Mit Fußbodenheizung kompatibel",
            ],
            metrics: [
              { value: "Bis zu 2.000 m²", label: "Tagesleistung" },
              { value: "5–80 mm", label: "Schichtdicke" },
              { value: "24–48 h", label: "Begehbar nach" },
            ],
            equipment: ["Putzmeister SP 25 DHF", "Putzmeister P 720"],
            equipmentNote: "Schnecken- und Kolbenpumpen ermöglichen eine kontrollierte Förderung selbstnivellierender Mörtel auf großen Flächen und in der Höhe.",
            planning: "Die Ausführungszeit hängt von Fläche, Schichtdicke, Mischung und Umgebungsbedingungen ab; die übliche Begehbarkeit wird innerhalb des vorgegebenen Fensters von 24–48 Stunden geplant.",
            quality: "Untergrundzustand, Bezugshöhen, Mischkonsistenz und abschließende Ebenheit werden während der Verarbeitung vor Beginn der Aushärtung kontrolliert.",
          },
          {
            name: "Betonglättung",
            body: "Fugenloser Betonboden mit Verschleißschicht, mechanisch bearbeitet mit einfachen oder doppelten Flügelglättern.\n\nMehrere Glättdurchgänge, Randbearbeitung und optionale Hartstoffe werden auf den Erstarrungsverlauf abgestimmt und ergeben eine dichte Oberfläche.\n\nFür Lagerhallen, Parkhäuser, Logistikflächen, Werkstätten und Gewerbeböden entstehen langlebige Flächen mit kontrollierter Ebenheit und geringerem Wartungsaufwand.",
            funFact: "Der ideale Zeitpunkt zum Glätten wird vom Erstarrungsgrad des Betons bestimmt – nicht allein von der Uhr.",
            bullets: [
              "Mechanische Bearbeitung mit dem Flügelglätter",
              "Verschleißfeste Oberfläche",
              "Für Stapler- und Fahrzeugverkehr geeignet",
              "Optionaler Quarzhärter",
            ],
            metrics: [
              { value: "Bis zu 1.300 m²", label: "Tägliche Glättfläche" },
              { value: "2–6 Durchgänge", label: "Glättfolge" },
              { value: "4–10 h", label: "Bearbeitungsfenster" },
            ],
            equipment: ["Barikell MK8 Ride-On Power Trowel", "Einfach-Flügelglätter"],
            equipmentNote: "Der Aufsitzglätter mit Doppelrotor bearbeitet große Platten effizient; kleinere Maschinen übernehmen Ränder und beengte Bereiche.",
            planning: "Das Glätten beginnt beim richtigen Erstarrungsgrad der Platte. Anzahl der Durchgänge und Bearbeitungszeit hängen von Mischung, Temperatur, Plattengröße und gewünschtem Finish ab.",
            quality: "Wir kontrollieren Erstarrungsgrad, Zeitabstände zwischen den Durchgängen, Randbearbeitung und Oberflächengleichmäßigkeit bis zum vorgegebenen Finish.",
          },
          {
            name: "Spritzbeton",
            body: "Nassspritzbeton für Schwimmbecken, Stützmauern und Böschungen bietet hohe Festigkeit bei minimaler Schalung.\n\nPumpendruck, Düsenabstand, Schichtdicke und Auftragsfolge werden an vertikale, gekrümmte oder schwer zugängliche Konstruktionen angepasst.\n\nFür Hangsicherungen, Verstärkungen und Betoninstandsetzungen in ganz Spanien verbessert der kontinuierliche Nassauftrag die Haftung und ermöglicht komplexe Geometrien effizient.",
            funFact: "Nassspritzbeton folgt vertikalen und gekrümmten Geometrien und benötigt dabei erstaunlich wenig Schalung.",
            bullets: [
              "Nass- und Trockenspritzverfahren",
              "Minimale Schalung erforderlich",
              "Hohe Frühfestigkeit",
              "Schichtweise Kontrolle der Auftragsdicke",
            ],
            metrics: [
              { value: "Bis zu 200 m²", label: "Tagesleistung" },
              { value: "50–150 mm", label: "Schichtdicke" },
              { value: "5–15 %", label: "Typischer Rückprall" },
            ],
            equipment: ["Putzmeister P 720", "Putzmeister SP 25 DHF"],
            equipmentNote: "Kompakte Pumpsysteme ermöglichen einen kontrollierten Nassauftrag in engen oder schwer zugänglichen Bereichen.",
            planning: "Die Arbeiten erfolgen in kontrollierten Schichten. Die Dauer hängt von Untergrundvorbereitung, Schichtdicke, Bewehrung, Geometrie und Zugang ab.",
            quality: "Untergrundvorbereitung, Bewehrungsüberdeckung, Schichtdicke und Rückprall werden während des Auftrags kontrolliert, um einen kompakten, gleichmäßigen Aufbau zu erzielen.",
          },
          {
            name: "Gefälle",
            body: "Gefälleausbildung auf Terrassen, Dächern, Rampen und großen erhöhten Flächen, auch bei schwierigem Zugang.\n\nKontinuierliches Pumpen, Laserreferenzen und präzises Abziehen leiten Wasser zu Abläufen und schaffen eine gleichmäßige Basis für die Abdichtung.\n\nAuf Balkonen, Parkdecks und technischen Dächern verhindern präzise Gefälle stehendes Wasser, schützen Abdichtungssysteme und bereiten den Untergrund für den Endbelag vor.",
            funFact: "Schon wenige Millimeter Höhenunterschied können entscheiden, ob ein Dach korrekt entwässert oder Wasser zurückhält.",
            bullets: [
              "Lasergeführter Estricheinbau",
              "Berechnete Gefälle zu Abläufen",
              "Für Dächer, Terrassen und Rampen geeignet",
              "Nivellierkontrolle vor der Übergabe",
            ],
            metrics: [
              { value: "1–5 %", label: "Planmäßiges Gefälle" },
              { value: "20–80 mm", label: "Schichtdicke" },
              { value: "±3 mm", label: "Höhentoleranz" },
            ],
            equipment: ["Putzmeister SP 25 DHF", "Laser-Nivelliergeräte"],
            equipmentNote: "Die Mörtelpumpe sorgt für einen gleichmäßigen Materialfluss, während Lasermessung und Abziehen die geplanten Gefälle herstellen.",
            planning: "Die Flächen werden in Arbeitszonen unterteilt und die Gefälle vor der Übergabe geprüft. Die Ausführungszeit hängt von Fläche, Dicke, Höhe und Anzahl der Entwässerungspunkte ab.",
            quality: "Laserreferenzen, Gefälle und Abläufe werden beim Abziehen und erneut vor der Übergabe geprüft, damit Wasser zu den vorgesehenen Entwässerungspunkten fließt.",
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
        heading: "Ein Unternehmen, dem Sie vertrauen können",
        body1: "Level Pro bietet professionelle Lösungen für Betonierprojekte und verbindet erfahrene Teams auf der Baustelle mit einer modernen, gut gewarteten Flotte.",
        body2: "Von Wohnbauten bis zu großen gewerblichen Betoniervorgängen bringen wir Präzision, Zuverlässigkeit und klare Kommunikation in jede Phase der Bauarbeiten.",
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
        heading: "Spanienweit im Einsatz",
        items: [
          { name: "Benidorm", desc: "Unser Stützpunkt an der Costa Blanca — für Benidorm, Altea und die umliegende Küste." },
          { name: "Ibiza", desc: "Inselprojekte mit derselben Flotte und denselben Teams, vom Wohnbau bis zur Hotellerie." },
          { name: "Palma de Mallorca", desc: "Abdeckung der Balearen für gewerbliche und private Betonarbeiten auf ganz Mallorca." },
          { name: "Spanienweit", desc: "Wir sind landesweit im Einsatz und mobilisieren unsere Flotte und Teams für Betonierprojekte in ganz Spanien." },
        ],
      },
    },
    aboutPage: {
      hero: {
        label: "Wer wir sind",
        headingLine1: "Höher",
        headingLine2: "Besser",
        headingLine3: "",
        tagline: "Ein professionelles Team mit hohen Qualitätsstandards, das sich kontinuierlich weiterentwickelt und ein klares Ziel verfolgt: Höher — Bessere Qualität, besserer Service, persönliche Kundenbetreuung und maßgeschneiderte Lösungen für jedes Projekt, Tag für Tag.",
        scrollLabel: "Scrollen",
        factLabels: ["Region", "Abgeschlossene Projekte"],
      },
      mission: {
        label: "Unsere Geschichte",
        heading: "Betonkompetenz, auf die Sie sich verlassen können",
        body1: "Level Pro wurde mit dem Anspruch gegründet, Bauprojekten an der Costa Blanca professionelle Lösungen für das Pumpen und die Verarbeitung von Beton zu bieten. Was als spezialisierter Pumpbetrieb begann, ist zu einem verlässlichen Partner für Bauträger, Auftragnehmer und Architekten in der gesamten Region gewachsen.",
        body2: "Heute verbinden wir erfahrene Teams mit einer modernen, flexiblen Flotte und gewährleisten Präzision in jeder Phase des Betonierprozesses. Unser Engagement für Qualität und Zuverlässigkeit hat einen Ruf geschaffen, der für sich selbst spricht.",
      },
      values: {
        label: "Was uns antreibt",
        heading: "Unsere Prinzipien",
        items: [
          { title: "Präzision", desc: "Jeder Guss, jede Materialplatzierung, jede Oberfläche — nach höchsten Qualitätsstandards ausgeführt." },
          { title: "Zuverlässigkeit", desc: "Wenn wir uns zu einem Zeitplan verpflichten, halten wir ihn. Schnelle Mobilisierung und konsequente Ausführung halten Ihr Projekt im Zeit- und Kostenrahmen." },
          { title: "Fachkompetenz", desc: "Jahre praktischer Erfahrung in Wohn-, Gewerbe- und Industrieprojekten geben unserem Team das Wissen, jede Herausforderung zu meistern." },
          { title: "Partnerschaft", desc: "Wir arbeiten mit Architekten, Auftragnehmern und Bauträgern als echter Partner zusammen — kommunizieren klar und lösen Probleme proaktiv." },
        ],
      },
      milestones: {
        label: "Unser Weg",
        heading: "Eine Erfolgsbilanz in Betonexzellenz",
        items: [
          { title: "Gründung an der Costa Blanca", desc: "Level Pro wird an der Costa Blanca gegründet, mit Fokus auf Betonpumpen für Wohnbauprojekte." },
          { title: "Flottenausbau", desc: "Anschaffung leistungsstarker stationärer Betonpumpen für mehrgeschossige Gewerbe- und Hotelprojekte." },
          { title: "Hotelsektor", desc: "Abschluss bedeutender Pump- und Veredelungsarbeiten im Hotelsektor von Benidorm — ein Meilenstein im Gewerbebereich." },
          { title: "1500+ Projekte", desc: "Wir haben mehr als 1.500 große und kleine Projekte abgeschlossen." },
        ],
      },
      cta: {
        label: "Arbeiten Sie mit uns",
        heading: "Sprechen wir?",
        btn: "Kontakt aufnehmen",
      },
    },
    contactPage: {
      hero: {
        label: "Kontakt",
        headingLine1: "Sprechen wir",
        headingLine2: "über Ihr",
        headingLine3: "Projekt",
        tagline: "Wenn Sie eine neue Entwicklung planen oder einen zuverlässigen Partner für Betonpumpen und Betonanwendungen suchen, würden wir Sie gerne kennenlernen.",
        factLabels: ["Standort", "Antwortzeit", "8:00 - 18:00"],
        weekdays: "Mo–Fr",
        hoursLabel: "Öffnungszeiten",
        mapsLink: "In Google Maps ansehen",
      },
      info: {
        label: "Kontaktinformationen",
        heading: "Kontaktieren Sie uns",
        phone: { label: "Telefon", val: "+34 624 86 88 61" },
        email: { label: "E-Mail", val: "info@levelpro.es" },
        note: "Wir antworten so schnell wie möglich.",
      },
      form: {
        name: { label: "Vollständiger Name", placeholder: "Ihr vollständiger Name" },
        email: { label: "E-Mail-Adresse", placeholder: "ihre@email.de" },
        message: { label: "Nachricht", placeholder: "Beschreiben Sie Ihr Projekt — Umfang, Standort, Zeitplan und besondere Anforderungen." },
        submit: "Nachricht senden",
        sending: "Wird gesendet...",
        success: { heading: "Nachricht erhalten", body: "Vielen Dank für Ihre Anfrage. Wir melden uns innerhalb eines Werktages." },
        errors: { required: "Dieses Feld ist erforderlich", emailInvalid: "Bitte geben Sie eine gültige E-Mail-Adresse ein", sendFailed: "Ihre Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder kontaktieren Sie uns per E-Mail." },
      },
    },
    projectsPage: {
      hero: {
        label: "Unsere Arbeit",
        headingLine1: "Projekte gebaut",
        headingLine2: "mit Präzision",
        headingLine3: "und Engagement",
        tagline: "Entdecken Sie unsere abgeschlossenen und laufenden Projekte, suchen Sie nach Namen oder filtern Sie nach Standort, Status, Bauart und Jahr.",
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
        headingLine1: "Unsere Maschinen",
        headingLine2: "für die verschiedenen",
        headingLine3: "Arbeitsphasen",
        tagline: "Ein genauer Blick auf unsere wichtigsten Maschinen für Pump- und Oberflächenarbeiten.",
      },
      intro: {
        label: "Ausgewählte Maschinen",
        heading: "Die Maschinen für jede Phase des Betoniervorgangs",
        tagline: "Ein genauer Blick auf die zentrale Ausrüstung hinter unseren Pump- und Verarbeitungsarbeiten.",
      },
      items: [
        {
          category: "Betonpumpen",
          name: "Putzmeister P 720",
          desc: "Eine kompakte, leichte Stationärpumpe für Spritzbeton und Fließestrich — konzipiert für den Einsatz auf engen oder schwer zugänglichen Baustellen, ohne Abstriche bei der Förderweite.",
          specs: [{ label: "Max. Förderleistung" }, { label: "Max. Druck" }, { label: "Max. Korngröße" }, { label: "Motorleistung" }],
          bullets: [
            "2-Zylinder-Kolbenpumpe mit Hydraulikantrieb, für Spritzbeton und Fließestrich",
            "Fördert bis zu 300 m horizontal oder 100 m vertikal aus einer Aufstellung",
            "Kompaktes Anhängerfahrgestell für schnelle Mobilisierung zwischen Baustellen",
          ],
        },
        {
          category: "Betonpumpen",
          name: "Putzmeister BSA 1005 D5",
          desc: "Eine leistungsstarke Stationärpumpe für große, durchgehende Betonagen — ausgelegt für Hochzyklusbetrieb ohne Druckverlust auch bei langen Förderstrecken.",
          specs: [{ label: "Max. Förderleistung" }, { label: "Max. Druck" }, { label: "Motorleistung" }, { label: "Gewicht" }],
          bullets: [
            "180 mm Förderzylinder mit 1.000 mm Hub, bis zu 33 Hübe pro Minute",
            "300 l Trichter mit Rührwerk für durchgehende, unterbrechungsfreie Beschickung",
            "Anhängerfahrgestell mit 3 mechanischen Abstützungen für einen stabilen Stand",
          ],
        },
        {
          category: "Selbstnivellierende Mörtel",
          name: "Putzmeister SP 25 DHF",
          desc: "Eine Schneckenpumpe für große Mengen Fließestrich — mit ausreichend Reichweite und Korngrößentoleranz auch für feinen Spritzbeton geeignet.",
          specs: [{ label: "Max. Förderleistung" }, { label: "Max. Druck" }, { label: "Max. Korngröße" }, { label: "Motorleistung" }],
          bullets: [
            "Fördert bis zu 200 m horizontal oder 60 m vertikal — rund 20 Stockwerke — aus einer Aufstellung",
            "Große Aufgabefläche mit schwenkbarem Spritzschutz und leistungsstarkem Rüttelsieb",
            "Kompakt und leicht mit nur 1.050 kg für einfachere Handhabung auf der Baustelle",
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
        {
          category: "Bodenbearbeitung",
          name: "BARIKELL MK8-90, MOTOR B&S 35CP",
          desc: "Ein leistungsstarker Aufsitzglätter mit einem 35-PS-Motor von Briggs & Stratton, entwickelt für die schnelle und gleichmäßige Bearbeitung großer Betonflächen.",
          specs: [{ label: "Rotorkonfiguration" }, { label: "Motorleistung" }, { label: "Flügel je Rotor" }, { label: "Bedienposition" }],
          bullets: [
            "Doppelrotor-Konfiguration für ein gleichmäßiges Finish auf großen Flächen",
            "35-PS-Motor von Briggs & Stratton für anhaltende Leistung auf der Baustelle",
            "Aufsitzbedienung für effizientes Glätten mit präziser Kontrolle",
          ],
        },
      ],
      photoPending: "Foto folgt in Kürze",
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
      ctaSecondary: "Ver servicios",
      locations: ["Benidorm", "Palma de Mallorca", "Ibiza"],
      statsLabels: { projects: "Proyectos", years: "Años", mobilization: "Movilización" },
      scroll: "Scroll",
      playVideo: "Reproducir vídeo",
    },
    about: {
      label: "Quiénes somos",
      body: "Level Pro ofrece soluciones profesionales para el bombeo y la aplicación de hormigón y morteros a nivel PRO.",
    },
    services: {
      label: "Nuestros Servicios",
      headingLine1: "Profesionales",
      headingLine2: "del hormigón",
      headingLine3: "",
      tagline:
        "De los cimientos a las fachadas — bombeo de hormigón fiable y colocación precisa de material a cualquier escala.",
      learnMore: "Ver más",
      items: [
        {
          name: "Bombeos de Hormigón",
          detail: "Bombas estacionarias de hasta 50 m³/h, coordinadas con su programa de obra para un suministro continuo.",
          shortDesc: "Bombas estacionarias de hasta 50 m³/h, coordinadas con su programa de obra para un suministro continuo.",
          bullets: [
            "Bombas pluma de hasta 50 m de alcance",
            "Flota propia para obras de cualquier tamaño",
            "Movilización rápida en menos de 24 horas",
            "Supervisión de operador durante todo el vertido",
          ],
        },
        {
          name: "Morteros autonivelantes",
          detail: "Soleras interiores y exteriores, superficies lisas, perfectamente niveladas, ideales para suelos radiantes, tarima, revestimientos cerámicos, recrecidos.",
          shortDesc: "Soleras interiores y exteriores, superficies lisas, perfectamente niveladas, ideales para suelos radiantes, tarima, revestimientos cerámicos, recrecidos.",
          bullets: [
            "Planimetría perfecta en interiores y suelo radiante",
            "Fraguado rápido, obra lista en menos tiempo",
            "Bombeo mecánico para grandes superficies",
            "Acabado listo para cualquier pavimento final",
          ],
        },
        {
          name: "Fratasado",
          detail: "Pavimento continuo de hormigón tratado superficialmente con capa de rodadura y fratasado mecánico de toda la superficie utilizando máquinas fratasadoras simples o dobles.",
          shortDesc: "Pavimento continuo de hormigón tratado superficialmente con capa de rodadura y fratasado mecánico de toda la superficie utilizando máquinas fratasadoras simples o dobles.",
          bullets: [
            "Fratasado mecánico con helicóptero",
            "Superficie resistente al desgaste y al tránsito pesado",
            "Apto para naves industriales y garajes",
            "Tratamiento con endurecedor de cuarzo opcional",
          ],
        },
        {
          name: "Gunitados",
          detail: "Hormigón proyectado por vía húmeda para diferentes campos de aplicación: piscinas, muros de contención, taludes etc. con mínimo encofrado y alta resistencia.",
          shortDesc: "Hormigón proyectado por vía húmeda para diferentes campos de aplicación: piscinas, muros de contención, taludes etc. con mínimo encofrado y alta resistencia.",
          bullets: [
            "Proyección por vía húmeda y seca",
            "Ideal para muros de contención y taludes",
            "Mínimo encofrado, menor plazo de ejecución",
            "Control de espesor capa a capa",
          ],
        },
        {
          name: "Formación de pendientes",
          detail: "Formación de pendientes en terrazas, cubiertas inclinadas, azoteas etc. a grandes alturas y grandes superficies incluso en las superficies con difícil acceso.",
          shortDesc: "Formación de pendientes en terrazas, cubiertas inclinadas, azoteas etc. a grandes alturas y grandes superficies incluso en las superficies con difícil acceso.",
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
      label: "Servicios a medida",
      heading: "No importa lo grande o complejo sea su proyecto, tenemos la solución adecuada para usted.",
      body: "No importa lo grande o complejo sea su proyecto, tenemos la solución adecuada para usted.",
      btn: "Contáctenos",
    },
    stats: {
      label: "Operaciones y Recursos",
      heading: "Precisión y eficiencia en cada proyecto",
      equipmentBtn: "Nuestros Proyectos",
      items: [
        { label: "Capacidad de bombeo" },
        { label: "Proyectos completados" },
        { label: "Movilización rápida" },
      ],
    },
    materials: {
      heading: "Materiales de calidad y equipos especializados",
      tagline: "Trabajamos con hormigones certificados y mantenemos nuestra flota según los más altos estándares.",
      cards: [
        {
          title: "Equipos modernos de bombeo",
          desc: "Nuestra flota incluye bombas estáticas de alta capacidad, bombeos de línea y máquinas de gunitado manteniendo estándares de calidad muy altos, lo que permite una entrega eficiente en todo tipo de proyectos, desde residenciales hasta grandes desarrollos comerciales.",
        },
        {
          title: "Hormigones de alta calidad",
          desc: "Trabajamos con mezclas de hormigón certificadas - CEMEX, morteros especializados, autonivelantes, morteros proyectados y morteros de acabado de alta resistencia, garantizando durabilidad y rendimiento constante en todas las condiciones.",
        },
      ],
    },
    projects: {
      label: "Proyectos Seleccionados",
      heading: "Proyectos en la Costa Blanca",
      items: [
        {
          type: "Residencial",
          shortDesc: "Trabajos de morteros autonivelantes en Seaway Tower para crear bases uniformes, preparadas para los acabados finales.",
          fullDesc: "Nuestro equipo ejecutó trabajos de morteros autonivelantes en Seaway Tower, coordinando el bombeo y la nivelación para crear bases uniformes en todo el edificio. El proyecto se completó en 2025.",
          tags: ["Morteros autonivelantes"],
        },
        {
          type: "Hotel",
          shortDesc: "Un hotel boutique de 22 habitaciones entre la Playa de Poniente y la Cala de Finestrat, renacido de un hostal de los años 50 con diseño retro de la Riviera española.",
          fullDesc: "Nuestro equipo realizó trabajos de morteros autonivelantes en Nomad Hotel Cala Finestrat, creando bases uniformes para los acabados interiores del hotel. El proyecto se completó en 2025.",
          tags: ["Morteros autonivelantes"],
        },
        {
          type: "Residencial",
          shortDesc: "Trabajos de bombeo de hormigón y morteros autonivelantes realizados en el complejo Alibuilding de Benidorm.",
          fullDesc: "En el complejo Alibuilding de Benidorm realizamos trabajos de bombeo de hormigón y morteros autonivelantes, coordinando cada fase con el equipo de obra para una ejecución precisa y eficiente. Los trabajos finalizaron en 2025.",
          tags: ["Bombeo de Hormigón", "Morteros autonivelantes"],
        },
        {
          type: "Residencial",
          shortDesc: "Una exclusiva torre residencial en la Avenida del Mediterráneo — 19 viviendas, una por planta, cada una orientada al mar.",
          fullDesc: "Nuestro equipo realizó trabajos de bombeo de hormigón y morteros autonivelantes en Monver Tower Benidorm, coordinando la distribución vertical y la preparación uniforme de los suelos. El proyecto finalizó en 2022.",
          tags: ["Bombeo de Hormigón", "Morteros autonivelantes"],
        },
        {
          type: "Hotel",
          shortDesc: "Un hotel de 300 habitaciones en primera línea de la Playa de Poniente, donde cada habitación se abre a su propia terraza con vistas al mar.",
          fullDesc: "Nuestro equipo participa en Poseidon Playas de Benidorm con bombeo de hormigón, hormigón fratasado, morteros autonivelantes y formación de pendientes, coordinando las distintas aplicaciones del proyecto.",
          tags: ["Bombeo de Hormigón", "Hormigón fratasado", "Morteros autonivelantes", "Formación de pendientes"],
        },
        {
          type: "Hotel",
          shortDesc: "Un hotel de 18 plantas frente a la Playa de Levante, que une su Blue Tower original con una nueva Sky Tower — con terraza en la planta 19.",
          fullDesc: "Nuestro equipo realizó bombeo de hormigón, hormigón fratasado, morteros autonivelantes y formación de pendientes en Port Benidorm Hotel, coordinando cada aplicación hasta finalizar el proyecto en 2025.",
          tags: ["Bombeo de Hormigón", "Hormigón fratasado", "Morteros autonivelantes", "Formación de pendientes"],
        },
        {
          type: "Hotel",
          shortDesc: "Un hotel familiar de 364 habitaciones junto a la Playa de Levante, construido en torno a un parque acuático, toboganes y una piscina todo incluido.",
          fullDesc: "Nuestro equipo realizó trabajos de morteros autonivelantes en Hotel Rosamar de Benidorm, creando bases uniformes para los revestimientos posteriores. El proyecto finalizó en 2024.",
          tags: ["Morteros autonivelantes"],
        },
        {
          type: "Hotel",
          shortDesc: "Un hotel urbano moderno junto a los Jardines del Turia en Valencia, con piscina y bar en la azotea a pocos pasos del centro histórico.",
          fullDesc: "Nuestro equipo ejecutó morteros autonivelantes y formación de pendientes en Novotel Valencia Lavant, preparando superficies uniformes y zonas con la inclinación correcta. El proyecto finalizó en 2024.",
          tags: ["Morteros autonivelantes", "Formación de pendientes"],
        },
        {
          type: "Hotel",
          shortDesc: "Bombeo de hormigón y hormigón nivelante estructural en Villa España Hotel de Benidorm.",
          fullDesc: "Nuestro equipo realizó trabajos de bombeo de hormigón y hormigón nivelante estructural en Villa España Hotel de Benidorm, coordinando el suministro y la colocación en las superficies estructurales del edificio. El proyecto finalizó en 2023.",
          tags: ["Bombeo de Hormigón", "Hormigón nivelante estructural"],
        },
        {
          type: "Residencial",
          shortDesc: "Bombeo de hormigón, morteros autonivelantes y gunitados en Edificio La Jirafa de Benidorm.",
          fullDesc: "Nuestro equipo realizó trabajos de bombeo de hormigón, morteros autonivelantes y gunitados en Edificio La Jirafa de Benidorm, integrando varias aplicaciones especializadas en un mismo programa coordinado. El proyecto finalizó en 2025.",
          tags: ["Bombeo de Hormigón", "Morteros autonivelantes", "Gunitados"],
        },
      ],
      metaKeys: { year: "Año", type: "Tipo", budget: "Presupuesto", location: "Ubicación", status: "Estado" },
      learnMore: "Saber más",
      viewOnMaps: "Ver en el mapa",
    },
    footer: {
      ctaLabel: "Iniciar un Proyecto",
      ctaHeading: "¿HABLAMOS?",
      ctaBtn: "Contáctenos",
      links: ["Servicios", "Proyectos", "Equipos", "Nosotros", "Contacto"],
      copyright: "© 2026 Level Pro. Todos los derechos reservados.",
    },
    servicesPage: {
      hero: {
        label: "Nuestros Servicios",
        headingLine1: "Profesionales del",
        headingLine2: "hormigón",
        headingLine3: "",
        tagline: "Servicios especializados de bombeo y aplicación de hormigón a cualquier escala — estructuras comerciales y residenciales, viviendas unifamiliares, industrial etc.",
        scrollLabel: "Scroll",
      },
      tech: {
        label: "Capacidades",
        heading: "Servicios especializados",
        intro: "Ofrecemos servicios especializados para cualquier tipo de proyecto.",
      },
      detail: {
        labels: { performance: "Rendimiento", equipment: "Equipos recomendados", scope: "Aplicaciones y control", planning: "Planificación", quality: "Control de calidad" },
        items: [
          {
            name: "Bombeos de Hormigón",
            body: "Bombas estacionarias de hasta 50 m³/h, coordinadas con su programa de obra para un suministro continuo.\n\nAnalizamos accesos, trazado, altura y secuencia de vertido para seleccionar una configuración de bombeo segura y constante.\n\nTrabajamos en desarrollos residenciales, hoteles, estructuras comerciales e industriales en la Costa Blanca y toda España. La coordinación reduce esperas y mantiene una colocación uniforme incluso en obras con acceso limitado.",
            funFact: "Una línea bien planificada mantiene el vertido en movimiento y reduce las interrupciones en el punto de colocación.",
            bullets: [
              "Alcance de bomba pluma hasta 50 m",
              "Bombas estacionarias para espacios reducidos",
              "Programación de vertidos por fases",
              "Movilización en menos de 24 horas",
            ],
            metrics: [
              { value: "Hasta 200 m³", label: "Volumen diario" },
              { value: "1–3 días", label: "Planificación previa" },
              { value: "<24 h", label: "Movilización" },
            ],
            equipment: ["Putzmeister BSA 1005 D5", "Putzmeister P 720"],
            equipmentNote: "Seleccionamos la bomba según el volumen del vertido, la distancia de línea, el acceso a obra y la presión necesaria.",
            planning: "La secuencia de vertido se coordina con el suministro de hormigón y el programa de obra. El rendimiento real depende de la mezcla, la longitud de manguera, la altura y la logística del proyecto.",
            quality: "Antes y durante el bombeo verificamos el trazado, el cebado, las conexiones y la continuidad del flujo para reducir interrupciones y segregación del material.",
          },
          {
            name: "Morteros autonivelantes",
            body: "Soleras interiores y exteriores, lisas y niveladas, ideales para suelo radiante, tarima, revestimientos cerámicos y recrecidos.\n\nCoordinamos soporte, cotas, bombeo y nivelación para ejecutar grandes superficies con espesor controlado y una base uniforme.\n\nEn viviendas, hoteles, oficinas, comercios y rehabilitaciones en toda España, el mortero bombeado crea un soporte fiable con mayor rapidez y uniformidad que la aplicación manual.",
            funFact: "Las grandes superficies niveladas pueden quedar transitables en 24–48 horas, según la mezcla seleccionada.",
            bullets: [
              "Planimetría con tolerancia milimétrica",
              "Fraguado rápido, tránsito en 24-48h",
              "Bombeo mecánico para grandes superficies",
              "Compatible con suelo radiante",
            ],
            metrics: [
              { value: "Hasta 2.000 m²", label: "Aplicación diaria" },
              { value: "5–80 mm", label: "Espesor de capa" },
              { value: "24–48 h", label: "Tránsito peatonal" },
            ],
            equipment: ["Putzmeister SP 25 DHF", "Putzmeister P 720"],
            equipmentNote: "Las bombas de husillo y pistón permiten una aplicación controlada de morteros autonivelantes en grandes superficies y trabajos en altura.",
            planning: "El tiempo de aplicación depende de la superficie, el espesor, la mezcla y las condiciones ambientales; el tránsito peatonal suele planificarse dentro del intervalo especificado de 24–48 horas.",
            quality: "Controlamos el estado del soporte, las cotas de referencia, la consistencia de la mezcla y la planimetría final durante la aplicación y antes del curado.",
          },
          {
            name: "Hormigón fratasado",
            body: "Pavimento continuo de hormigón con capa de rodadura, acabado mecánicamente mediante fratasadoras simples o dobles.\n\nLas pasadas sucesivas, el remate de bordes y los endurecedores opcionales se coordinan con el fraguado para lograr una superficie densa y uniforme.\n\nIdeal para naves, aparcamientos, áreas logísticas, talleres y suelos comerciales, este proceso produce soleras duraderas, con planimetría controlada y menor mantenimiento.",
            funFact: "El momento ideal para fratasar lo determina el fraguado del hormigón, no solamente el reloj.",
            bullets: [
              "Fratasado mecánico con helicóptero",
              "Superficie resistente al desgaste",
              "Apto para tránsito de carretillas y vehículos",
              "Endurecedor de cuarzo opcional",
            ],
            metrics: [
              { value: "Hasta 1.300 m²", label: "Fratasado diario" },
              { value: "2–6 pasadas", label: "Secuencia de acabado" },
              { value: "4–10 h", label: "Ventana de acabado" },
            ],
            equipment: ["Barikell MK8 Ride-On Power Trowel", "Fratasadoras simples"],
            equipmentNote: "La fratasadora doble con operador cubre grandes soleras de forma eficiente, mientras las máquinas compactas rematan bordes y zonas reducidas.",
            planning: "El fratasado comienza cuando la solera alcanza el punto de fraguado adecuado. El número de pasadas y la duración dependen de la mezcla, la temperatura, la superficie y el acabado deseado.",
            quality: "Supervisamos el punto de fraguado, los tiempos entre pasadas, el acabado de bordes y la uniformidad de la superficie hasta alcanzar el resultado especificado.",
          },
          {
            name: "Gunitados",
            body: "Hormigón proyectado por vía húmeda para piscinas, muros de contención y taludes, con mínimo encofrado y alta resistencia.\n\nAdaptamos presión, distancia, espesor y secuencia de aplicación a estructuras verticales, curvas o de difícil acceso.\n\nUtilizado en estabilización, refuerzo estructural y reparación de hormigón en toda España, el gunitado mejora la adherencia y permite ejecutar geometrías complejas con eficiencia.",
            funFact: "La proyección por vía húmeda se adapta a superficies verticales y curvas utilizando muy poco encofrado.",
            bullets: [
              "Proyección por vía húmeda y seca",
              "Mínimo encofrado necesario",
              "Alta resistencia inicial",
              "Control de espesor capa a capa",
            ],
            metrics: [
              { value: "Hasta 200 m²", label: "Aplicación diaria" },
              { value: "50–150 mm", label: "Espesor de capa" },
              { value: "5–15 %", label: "Rebote habitual" },
            ],
            equipment: ["Putzmeister P 720", "Putzmeister SP 25 DHF"],
            equipmentNote: "Los sistemas compactos permiten controlar la aplicación por vía húmeda en zonas reducidas o de difícil acceso.",
            planning: "El trabajo se organiza por capas controladas. La duración depende de la preparación del soporte, el espesor, el armado, la geometría y el acceso.",
            quality: "Controlamos la preparación del soporte, el recubrimiento de armaduras, el espesor por capa y el rebote para mantener una aplicación compacta y uniforme.",
          },
          {
            name: "Formación de pendientes",
            body: "Formación de pendientes en terrazas, cubiertas, azoteas, rampas y grandes superficies, incluso con accesos complejos.\n\nEl bombeo continuo, las referencias láser y el regleado dirigen el agua hacia los sumideros y crean una base uniforme para impermeabilizar.\n\nEn balcones, aparcamientos y cubiertas técnicas, las pendientes precisas evitan agua estancada, protegen la impermeabilización y preparan la superficie para el acabado final.",
            funFact: "Un desnivel de pocos milímetros puede decidir si una cubierta evacua correctamente el agua o la retiene.",
            bullets: [
              "Regleado guiado por láser",
              "Pendientes calculadas hacia sumideros",
              "Apto para cubiertas, terrazas y rampas",
              "Verificación de nivel antes de la entrega",
            ],
            metrics: [
              { value: "1–5 %", label: "Pendiente de diseño" },
              { value: "20–80 mm", label: "Espesor de capa" },
              { value: "±3 mm", label: "Tolerancia de nivel" },
            ],
            equipment: ["Putzmeister SP 25 DHF", "Equipos de nivelación láser"],
            equipmentNote: "La bomba mantiene un suministro uniforme, mientras la medición láser y el regleado forman las pendientes especificadas.",
            planning: "La superficie se divide en zonas de trabajo y las pendientes se verifican antes de la entrega. El tiempo depende de la superficie, el espesor, la altura y el número de puntos de desagüe.",
            quality: "Las referencias láser, las pendientes y los desagües se comprueban durante el regleado y antes de la entrega para confirmar la evacuación hacia los puntos previstos.",
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
        heading: "¿HABLAMOS?",
        btn: "Contáctenos",
      },
      mission: {
        label: "Misión",
        heading: "Una empresa en la que puedes confiar",
        body1: "Level Pro ofrece soluciones profesionales para los proyectos de hormigonado, combinando equipos experimentados en obra con una flota moderna y bien mantenida.",
        body2: "Desde estructuras residenciales hasta grandes vertidos comerciales, aportamos precisión, fiabilidad y comunicación clara en cada etapa de la obra.",
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
        heading: "Operando a nivel nacional",
        items: [
          { name: "Benidorm", desc: "Nuestra base en la Costa Blanca — cubriendo Benidorm, Altea y todo el litoral cercano." },
          { name: "Ibiza", desc: "Proyectos en la isla atendidos con la misma flota y equipos, de obra residencial a desarrollos hoteleros." },
          { name: "Palma de Mallorca", desc: "Cobertura balear para trabajos de hormigón comerciales y residenciales en toda Mallorca." },
          { name: "Toda España", desc: "Operamos a nivel nacional, movilizando nuestra flota y nuestros equipos para proyectos de hormigonado en toda España." },
        ],
      },
    },
    aboutPage: {
      hero: {
        label: "Quiénes somos",
        headingLine1: "Más Alto",
        headingLine2: "Mejor",
        headingLine3: "",
        tagline: "Un equipo profesional con altos estándares de calidad en continuo ascenso con una meta muy clara: Más Alto — Mejor calidad, servicio, atención al cliente, soluciones específicas para cada proyecto día a día.",
        scrollLabel: "Scroll",
        factLabels: ["Región", "Proyectos completados"],
      },
      mission: {
        label: "Nuestra historia",
        heading: "Experiencia en hormigón en la que puede confiar",
        body1: "Level Pro se fundó con la ambición de aportar soluciones profesionales de bombeos y aplicaciones de hormigón a los proyectos de construcción de la Costa Blanca. Lo que comenzó como una operación de bombeo especializada ha crecido hasta convertirse en un socio de confianza para promotores, contratistas y arquitectos de toda la región.",
        body2: "Hoy combinamos equipos experimentados con una flota moderna y flexible, ofreciendo precisión en cada etapa del proceso de hormigonado. Nuestro compromiso con la calidad y la fiabilidad ha construido una reputación que habla por sí sola.",
      },
      values: {
        label: "Lo que nos mueve",
        heading: "Nuestros principios",
        items: [
          { title: "Precisión", desc: "Cada vertido, cada colocación, cada acabado superficial — ejecutado según los más altos estándares de calidad." },
          { title: "Fiabilidad", desc: "Cuando nos comprometemos con un plazo, lo cumplimos. La movilización rápida y la ejecución constante mantienen su proyecto en tiempo y presupuesto." },
          { title: "Experiencia", desc: "Años de experiencia práctica en proyectos residenciales, comerciales e industriales dan a nuestro equipo el conocimiento para afrontar cualquier reto." },
          { title: "Colaboración", desc: "Trabajamos junto a arquitectos, contratistas y promotores como verdaderos socios — comunicando con claridad y resolviendo problemas de forma proactiva." },
        ],
      },
      milestones: {
        label: "Nuestro camino",
        heading: "Una trayectoria de excelencia en hormigón",
        items: [
          { title: "Fundación en la Costa Blanca", desc: "Level Pro se establece en la Costa Blanca, centrado en el bombeo de hormigón para desarrollos residenciales." },
          { title: "Expansión de flota", desc: "Incorporación de bombas estáticas de alta capacidad para proyectos comerciales y hoteleros de varios pisos en altura." },
          { title: "Sector hotelero", desc: "Finalización de importantes trabajos de bombeo y acabado en el sector hotelero de Benidorm — un hito comercial." },
          { title: "1500+ proyectos", desc: "Superamos los 1500 proyectos grandes y pequeños completados." },
        ],
      },
      cta: {
        label: "Trabaja con nosotros",
        heading: "¿HABLAMOS?",
        btn: "Contáctenos",
      },
    },
    contactPage: {
      hero: {
        label: "Contacto",
        headingLine1: "Hablemos",
        headingLine2: "de su",
        headingLine3: "proyecto",
        tagline: "Si está planificando un nuevo desarrollo o busca un socio fiable para bombeos y aplicaciones de hormigón, nos encantaría conocerle.",
        factLabels: ["Ubicación", "Respuesta", "8:00 - 18:00"],
        hoursLabel: "Horario",
        mapsLink: "Ver en Google Maps",
      },
      info: {
        label: "Información de Contacto",
        heading: "Contáctenos",
        phone: { label: "Teléfono", val: "+34 624 86 88 61" },
        email: { label: "Correo electrónico", val: "info@levelpro.es" },
        note: "Respondemos con la mayor brevedad posible.",
      },
      form: {
        name: { label: "Nombre completo", placeholder: "Su nombre completo" },
        email: { label: "Dirección de correo electrónico", placeholder: "su@email.es" },
        message: { label: "Mensaje", placeholder: "Cuéntenos sobre su proyecto — alcance, ubicación, plazos y requisitos específicos." },
        submit: "Enviar mensaje",
        sending: "Enviando...",
        success: { heading: "Mensaje recibido", body: "Gracias por ponerse en contacto con nosotros. Le responderemos en un día hábil." },
        errors: { required: "Este campo es obligatorio", emailInvalid: "Por favor, introduzca una dirección de correo electrónico válida", sendFailed: "No hemos podido enviar su mensaje. Inténtelo de nuevo o contáctenos por correo electrónico." },
      },
    },
    projectsPage: {
      hero: {
        label: "Nuestro Trabajo",
        headingLine1: "Proyectos construidos",
        headingLine2: "con precisión",
        headingLine3: "y dedicación",
        tagline: "Explore nuestras obras finalizadas y en curso, busque por nombre o filtre por ubicación, estado, tipo y año.",
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
        headingLine1: "Nuestras máquinas",
        headingLine2: "para las distintas fases",
        headingLine3: "del trabajo",
        tagline: "Un vistazo de cerca a nuestros equipos principales detrás de nuestro trabajo de bombeo y acabado.",
      },
      intro: {
        label: "Maquinaria Destacada",
        heading: "La maquinaria para cada fase del vertido",
        tagline: "Un vistazo de cerca al equipo principal detrás de nuestro trabajo de bombeo y acabado.",
      },
      items: [
        {
          category: "Bombeo de Hormigón",
          name: "Putzmeister P 720",
          desc: "Una bomba estacionaria compacta y ligera, diseñada para gunitado y mortero autonivelante — pensada para llegar a obras con acceso reducido sin renunciar a distancia de bombeo.",
          specs: [{ label: "Caudal máximo" }, { label: "Presión máxima" }, { label: "Tamaño máx. de árido" }, { label: "Potencia del motor" }],
          bullets: [
            "Bomba de pistón hidráulica de 2 cilindros, para gunitado y mortero autonivelante",
            "Alcanza hasta 300 m en horizontal o 100 m en vertical desde una sola posición",
            "Chasis remolcable y compacto para una movilización rápida entre obras",
          ],
        },
        {
          category: "Bombeo de Hormigón",
          name: "Putzmeister BSA 1005 D5",
          desc: "Una bomba estacionaria de alto rendimiento para vertidos grandes y continuos — diseñada para un funcionamiento de ciclo alto sostenido sin perder presión en recorridos largos.",
          specs: [{ label: "Caudal máximo" }, { label: "Presión máxima" }, { label: "Potencia del motor" }, { label: "Peso" }],
          bullets: [
            "Cilindro de bombeo de 180 mm con carrera de 1.000 mm, hasta 33 golpes por minuto",
            "Tolva de 300 l con agitador para una alimentación continua y sin interrupciones",
            "Chasis remolcable con 3 estabilizadores mecánicos para un apoyo estable",
          ],
        },
        {
          category: "Morteros autonivelantes",
          name: "Putzmeister SP 25 DHF",
          desc: "Una bomba de husillo para grandes volúmenes de mortero autonivelante — con alcance y tolerancia de árido suficientes para trabajos finos de gunitado.",
          specs: [{ label: "Caudal máximo" }, { label: "Presión máxima" }, { label: "Tamaño máx. de árido" }, { label: "Potencia del motor" }],
          bullets: [
            "Alcanza hasta 200 m en horizontal o 60 m en vertical — unas 20 plantas — desde una sola posición",
            "Amplia zona de carga con protección antisalpicaduras abatible y potente criba vibrante",
            "Compacta y ligera, con solo 1.050 kg, para un manejo más fácil en obra",
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
        {
          category: "Acabado de Suelos",
          name: "BARIKELL MK8-90, MOTOR B&S 35CP",
          desc: "Una fratasadora autopropulsada de alto rendimiento con motor Briggs & Stratton de 35 CV, diseñada para acabar grandes superficies de hormigón con rapidez y uniformidad.",
          specs: [{ label: "Configuración de rotores" }, { label: "Potencia del motor" }, { label: "Palas por rotor" }, { label: "Posición de trabajo" }],
          bullets: [
            "Configuración de doble rotor para un acabado uniforme en grandes superficies",
            "Motor Briggs & Stratton de 35 CV para un rendimiento constante en obra",
            "Manejo autopropulsado para un fratasado eficiente y un control preciso",
          ],
        },
      ],
      photoPending: "Foto próximamente",
    },
  },
};
