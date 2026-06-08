export type Locale = "en" | "de" | "es";

export interface Translation {
  nav: { links: string[]; cta: string };
  hero: {
    eyebrow: string; est: string;
    titleLine1: string; titleLine2: string; titleLine3: string;
    tagline: string;
    statsLabels: { projects: string; years: string; mobilization: string };
    scroll: string;
  };
  about: { label: string; body: string };
  services: {
    label: string;
    headingLine1: string; headingLine2: string; headingLine3: string;
    tagline: string;
    items: Array<{ name: string; detail: string }>;
    tags: string[];
  };
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
    metaKeys: { year: string; type: string; budget: string; location: string };
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
    detail: {
      items: Array<{ name: string; shortDesc: string; body: string; tags: string[]; bullets: string[] }>;
    };
    sectors: {
      label: string; heading: string;
      items: Array<{ title: string; desc: string }>;
    };
    process: {
      label: string; heading: string;
      steps: Array<{ num: string; title: string; desc: string }>;
    };
    cta: { label: string; heading: string; btn: string };
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
      items: Array<{ year: string; title: string; desc: string }>;
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
}

export const TRANSLATIONS: Record<Locale, Translation> = {
  en: {
    nav: {
      links: ["Services", "Projects", "Equipment", "About Us", "Contact"],
      cta: "Get a Quote",
    },
    hero: {
      eyebrow: "Concrete Solutions — Costa Blanca",
      est: "EST. 2016",
      titleLine1: "We live",
      titleLine2: "for a",
      titleLine3: "challenge",
      tagline:
        "At Level Pro, we partner with our customers to bring their ambitions to life — delivering concrete projects that make a lasting difference for people and communities.",
      statsLabels: { projects: "Projects", years: "Years", mobilization: "Mobilization" },
      scroll: "Scroll",
    },
    about: {
      label: "Who we are",
      body: "Level Pro provides professional concrete solutions, combining experienced teams and specialized equipment to deliver precise execution and reliable results.",
    },
    services: {
      label: "Our Services",
      headingLine1: "Specialized",
      headingLine2: "concrete",
      headingLine3: "services",
      tagline:
        "From foundations to facades — reliable concrete pumping and precise material placement at any scale.",
      items: [
        { name: "Concrete Pumping", detail: "High-pressure pumping systems for multi-story and large-scale construction sites." },
        { name: "Material Placement", detail: "Precise concrete distribution ensuring consistent quality across every pour." },
        { name: "Shotcrete Works", detail: "Pneumatic application for tunnels, retaining walls and complex geometries." },
        { name: "Foundation Works", detail: "Engineered foundation solutions designed for demanding ground conditions." },
      ],
      tags: ["Residential", "Commercial", "Industrial", "High-rise"],
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
          shortDesc: "Concrete pumping operations and surface finishing works for the renovation of Hotel Rosamar.",
          fullDesc: "Our team supported the development and renovation of Hotel Rosamar in Benidorm through concrete pumping operations and surface finishing works. The project, completed in 2020, required precise coordination and reliable on-site execution.",
          tags: ["Concrete Pumping", "Surface Finishing", "Material Placement"],
        },
        {
          type: "Hotel",
          shortDesc: "Concrete pumping and surface finishing for the Nomad Hotel renovation in Cala Finestrat.",
          fullDesc: "Our team was involved in the project through concrete pumping operations and surface finishing works, contributing to the efficient execution of key construction stages.",
          tags: ["Concrete Pumping", "Surface Finishing"],
        },
        {
          type: "Residential",
          shortDesc: "High-pressure concrete pumping across multiple floors of a coastal residential development.",
          fullDesc: "A multi-story residential complex in Altea requiring high-pressure concrete pumping across multiple floors. Our team delivered precise material placement throughout the 14-month construction period.",
          tags: ["High-pressure Pumping", "Material Placement", "Foundation Works"],
        },
      ],
      metaKeys: { year: "Year", type: "Type", budget: "Budget", location: "Location" },
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
        headingLine1: "Comprehensive",
        headingLine2: "concrete",
        headingLine3: "solutions",
        tagline: "Specialized concrete services for every scale — from residential foundations to large commercial structures across the Costa Blanca.",
        scrollLabel: "Scroll",
      },
      detail: {
        items: [
          {
            name: "Concrete Pumping",
            shortDesc: "High-pressure pumping systems for multi-story and large-scale construction sites.",
            body: "Our concrete pumping service delivers high-pressure solutions for multi-story residential and commercial buildings. Our fleet of boom pumps can reach heights of up to 50 metres, ensuring consistent placement accuracy and significantly reducing manual labour on every pour.",
            bullets: [
              "Boom pump reach of up to 50 metres for multi-storey residential and commercial structures",
              "Full-scale fleet available for simultaneous deployment across multiple active sites",
              "GPS-tracked pour scheduling integrated seamlessly with your construction programme",
              "On-site operator supervision from start to finish on every job",
              "Significantly reduces manual handling, scaffold requirements and site labour costs",
            ],
            tags: ["Residential", "Commercial", "High-rise"],
          },
          {
            name: "Material Placement",
            shortDesc: "Precise concrete distribution ensuring consistent quality across every pour.",
            body: "Precise material placement is critical to the structural integrity of every project. Our experienced operators ensure even distribution and consistent depth across slabs, walls and columns — minimising waste and achieving first-time results across all project scales.",
            bullets: [
              "Consistent slab depth and full coverage maintained across every pour area",
              "Certified operators experienced in structural placement for all concrete mix types",
              "Real-time coordination with site supervisors throughout each operation",
              "Compatible with standard mixes and specialist admixtures including fibre-reinforced concrete",
              "On-site cleanup and equipment removal included as standard on all placements",
            ],
            tags: ["Slabs", "Walls", "Columns"],
          },
          {
            name: "Shotcrete Works",
            shortDesc: "Pneumatic application for tunnels, retaining walls and complex geometries.",
            body: "Shotcrete — sprayed concrete applied pneumatically — is the method of choice for retaining walls, slope stabilisation and complex geometric forms. Our equipment delivers rapid, high-strength coverage with precise control over layer thickness and bond quality.",
            bullets: [
              "Wet-mix and dry-mix processes available to suit project specification and site requirements",
              "High early-strength formulations for structurally critical retaining wall and tunnel applications",
              "Rapid layer build-up for fast turnaround on slope stabilisation and emergency works",
              "Nozzle positioning adapted for confined spaces and complex geometric surface areas",
              "Layer thickness and uniformity verified by site supervisor at every stage of application",
            ],
            tags: ["Retaining Walls", "Tunnels", "Slope Stabilisation"],
          },
          {
            name: "Foundation Works",
            shortDesc: "Engineered foundation solutions for demanding ground conditions.",
            body: "Reliable foundations are the bedrock of every successful structure. We design and execute engineered solutions adapted to the specific geotechnical conditions of each site — from strip footings and pad foundations to complex raft slabs for high-rise structures.",
            bullets: [
              "Geotechnical site assessments informing the design of every foundation solution",
              "Reinforced concrete solutions engineered for challenging ground conditions and load requirements",
              "Coordination with structural engineers throughout design and specification phases",
              "Precise volumetric concrete batching for all critical foundation pours",
              "Post-pour inspection protocols and documentation included on all engineered foundation works",
            ],
            tags: ["Strip Footings", "Raft Slabs", "Pad Foundations"],
          },
        ],
      },
      sectors: {
        label: "Sectors",
        heading: "Built for every sector",
        items: [
          { title: "Residential", desc: "From individual villas to multi-storey apartment complexes along the Costa Blanca coastline." },
          { title: "Commercial", desc: "Hotels, retail developments and office buildings requiring precision and reliable on-site execution." },
          { title: "Industrial", desc: "Factory floors, warehouses and infrastructure with demanding structural and finishing requirements." },
          { title: "High-rise", desc: "Multi-storey structures where pump reach, mix quality and placement precision are all critical." },
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
    },
    aboutPage: {
      hero: {
        label: "Who We Are",
        headingLine1: "Built on",
        headingLine2: "precision",
        headingLine3: "and trust",
        tagline: "A dedicated team of concrete specialists delivering exceptional results across the Costa Blanca — from residential foundations to major commercial structures.",
        scrollLabel: "Scroll",
        factLabels: ["Region", "Founded", "Projects completed"],
      },
      mission: {
        label: "Our Story",
        heading: "Concrete expertise, built since 2016",
        body1: "Level Pro was founded in 2016 with a single ambition: to bring professional-grade concrete solutions to construction projects across the Costa Blanca. What began as a focused pumping operation has grown into a trusted partner for developers, contractors and architects throughout the region.",
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
        heading: "Nine years of concrete excellence",
        items: [
          { year: "2016", title: "Founded", desc: "Level Pro established on the Costa Blanca, focused on concrete pumping for residential and coastal developments." },
          { year: "2018", title: "Fleet expansion", desc: "Added high-capacity boom pumps enabling multi-storey commercial and hotel projects across the region." },
          { year: "2020", title: "Hotel sector", desc: "Completed major pumping and finishing works for Hotel Rosamar in Benidorm — a landmark commercial project." },
          { year: "2024", title: "200+ projects", desc: "Passed 200 completed projects and expanded into shotcrete and engineered foundation works." },
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
        phone: { label: "Phone", val: "+34 XXX XXX XXX" },
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
  },

  de: {
    nav: {
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
      headingLine2: "Beton-",
      headingLine3: "leistungen",
      tagline:
        "Von Fundamenten bis Fassaden — zuverlässiges Betonpumpen und präzise Materialplatzierung in jedem Maßstab.",
      items: [
        { name: "Betonpumpen", detail: "Hochdruckpumpsysteme für mehrgeschossige und großflächige Baustellen." },
        { name: "Materialplatzierung", detail: "Präzise Betonverteilung für gleichbleibende Qualität bei jedem Guss." },
        { name: "Spritzbeton", detail: "Pneumatische Aufbringung für Tunnel, Stützmauern und komplexe Geometrien." },
        { name: "Fundamentarbeiten", detail: "Konstruktive Fundamentlösungen für anspruchsvolle Bodenbedingungen." },
      ],
      tags: ["Wohnbau", "Gewerbe", "Industrie", "Hochbau"],
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
          shortDesc: "Betonpumparbeiten und Oberflächenbehandlung für die Renovierung des Hotel Rosamar.",
          fullDesc: "Unser Team unterstützte die Entwicklung und Renovierung des Hotel Rosamar in Benidorm durch Betonpumparbeiten und Oberflächenbehandlung. Das 2020 abgeschlossene Projekt erforderte präzise Koordination und zuverlässige Ausführung vor Ort.",
          tags: ["Betonpumpen", "Oberflächenfinish", "Materialplatzierung"],
        },
        {
          type: "Hotel",
          shortDesc: "Betonpumpen und Oberflächenfinish für die Renovierung des Nomad Hotel in Cala Finestrat.",
          fullDesc: "Unser Team war durch Betonpumparbeiten und Oberflächenbehandlung am Projekt beteiligt und trug zur effizienten Umsetzung wichtiger Bauphasen bei.",
          tags: ["Betonpumpen", "Oberflächenfinish"],
        },
        {
          type: "Wohnbau",
          shortDesc: "Hochdruckbetonpumpen über mehrere Stockwerke eines Küstenwohnkomplexes.",
          fullDesc: "Ein mehrgeschossiger Wohnkomplex in Altea, für den Hochdruckbetonpumpen über mehrere Etagen erforderlich war. Unser Team lieferte präzise Materialplatzierung während der 14-monatigen Bauzeit.",
          tags: ["Hochdruckpumpen", "Materialplatzierung", "Fundamentarbeiten"],
        },
      ],
      metaKeys: { year: "Jahr", type: "Typ", budget: "Budget", location: "Standort" },
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
        headingLine1: "Umfassende",
        headingLine2: "Beton-",
        headingLine3: "lösungen",
        tagline: "Spezialisierte Betondienstleistungen für jede Größenordnung — von Wohnfundamenten bis zu großen Gewerbeobjekten an der Costa Blanca.",
        scrollLabel: "Scrollen",
      },
      detail: {
        items: [
          {
            name: "Betonpumpen",
            shortDesc: "Hochdruckpumpsysteme für mehrgeschossige und großflächige Baustellen.",
            body: "Unser Betonpumpservice bietet Hochdrucklösungen für mehrgeschossige Wohn- und Gewerbegebäude. Unsere Autobetonpumpen erreichen Höhen von bis zu 50 Metern und gewährleisten präzise Materialplatzierung bei deutlich reduziertem manuellem Aufwand.",
            bullets: [
              "Reichweite der Autobetonpumpen bis zu 50 Meter für mehrgeschossige Wohn- und Gewerbebauten",
              "Vollständige Flotte für gleichzeitigen Einsatz auf mehreren aktiven Baustellen verfügbar",
              "GPS-gestützte Einsatzplanung für reibungslose Integration in Ihren Bauablauf",
              "Bedienerbetreuung vor Ort von Beginn bis Ende jedes Einsatzes",
              "Deutliche Reduzierung von Handarbeit, Gerüstbedarf und Arbeitskosten auf der Baustelle",
            ],
            tags: ["Wohnbau", "Gewerbe", "Hochbau"],
          },
          {
            name: "Materialplatzierung",
            shortDesc: "Präzise Betonverteilung für gleichbleibende Qualität bei jedem Guss.",
            body: "Präzise Materialplatzierung ist entscheidend für die strukturelle Integrität jedes Projekts. Unsere erfahrenen Bediener sorgen für gleichmäßige Verteilung und gleichbleibende Tiefe bei Platten, Wänden und Stützen — bei minimalem Materialverlust.",
            bullets: [
              "Gleichmäßige Plattentiefe und vollständige Abdeckung bei jedem Guss gewährleistet",
              "Zertifizierte Bediener mit Erfahrung in struktureller Platzierung aller Betonmischungstypen",
              "Echtzeit-Koordination mit Baustellenverantwortlichen während des gesamten Einsatzes",
              "Kompatibel mit Standardmischungen und Sonderzusätzen einschließlich faserbewehrtem Beton",
              "Baustellenreinigung und Gerätentfernung standardmäßig bei allen Platzierungen inbegriffen",
            ],
            tags: ["Platten", "Wände", "Stützen"],
          },
          {
            name: "Spritzbeton",
            shortDesc: "Pneumatische Aufbringung für Tunnel, Stützmauern und komplexe Geometrien.",
            body: "Spritzbeton ist die bevorzugte Methode für Stützmauern, Böschungssicherung und komplexe geometrische Formen. Unsere pneumatischen Geräte ermöglichen eine schnelle, hochfeste Beschichtung mit präziser Kontrolle über Schichtdicke und Haftqualität.",
            bullets: [
              "Nass- und Trockenspritzverfahren für unterschiedliche Projektanforderungen und Standortbedingungen",
              "Hochfrühfeste Formulierungen für strukturkritische Stützmauer- und Tunnelanwendungen",
              "Schneller Schichtaufbau für rasche Böschungssicherung und Notarbeiten",
              "Düsenführung für beengte Räume und komplexe geometrische Oberflächen angepasst",
              "Schichtdicke und Gleichmäßigkeit in jeder Ausführungsphase vom Baustellenverantwortlichen geprüft",
            ],
            tags: ["Stützmauern", "Tunnel", "Böschungssicherung"],
          },
          {
            name: "Fundamentarbeiten",
            shortDesc: "Konstruktive Fundamentlösungen für anspruchsvolle Bodenbedingungen.",
            body: "Zuverlässige Fundamente sind das Fundament jedes erfolgreichen Bauwerks. Wir planen und realisieren konstruktive Lösungen, die auf die spezifischen geotechnischen Bedingungen jedes Standorts abgestimmt sind — von Streifenfundamenten bis zu komplexen Bodenplatten.",
            bullets: [
              "Geotechnische Standortbewertungen als Grundlage jedes Fundamententwurfs",
              "Stahlbetonlösungen für schwierige Bodenverhältnisse und hohe Lastenanforderungen",
              "Koordination mit Tragwerksplanern in Entwurfs- und Ausführungsphase",
              "Präzise volumetrische Betonaufbereitung für alle kritischen Fundamentgüsse",
              "Prüfprotokolle und Dokumentation nach dem Guss bei allen konstruktiven Fundamentarbeiten inbegriffen",
            ],
            tags: ["Streifenfundamente", "Bodenplatten", "Einzelfundamente"],
          },
        ],
      },
      sectors: {
        label: "Einsatzbereiche",
        heading: "Für jeden Sektor",
        items: [
          { title: "Wohnbau", desc: "Von Einzelvillen bis zu mehrgeschossigen Wohnanlagen entlang der Costa Blanca." },
          { title: "Gewerbe", desc: "Hotels, Einzelhandelsobjekte und Bürogebäude mit hohen Anforderungen an Präzision und Tempo." },
          { title: "Industrie", desc: "Fabrikböden, Lagerhallen und Infrastruktur mit hohen strukturellen Anforderungen." },
          { title: "Hochbau", desc: "Mehrgeschossige Gebäude, bei denen Pumpenreichweite und Präzision entscheidend sind." },
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
    },
    aboutPage: {
      hero: {
        label: "Wer wir sind",
        headingLine1: "Aufgebaut auf",
        headingLine2: "Präzision",
        headingLine3: "und Vertrauen",
        tagline: "Ein engagiertes Team von Betonspezialisten, das außergewöhnliche Ergebnisse an der Costa Blanca liefert — von Wohnfundamenten bis zu großen Gewerbeobjekten.",
        scrollLabel: "Scrollen",
        factLabels: ["Region", "Gegründet", "Abgeschlossene Projekte"],
      },
      mission: {
        label: "Unsere Geschichte",
        heading: "Betonkompetenz seit 2016",
        body1: "Level Pro wurde 2016 mit einem einzigen Ziel gegründet: professionelle Betonlösungen für Bauprojekte an der Costa Blanca zu realisieren. Was als fokussierter Pumpbetrieb begann, ist heute ein verlässlicher Partner für Bauträger, Auftragnehmer und Architekten in der gesamten Region.",
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
        heading: "Neun Jahre Betonexzellenz",
        items: [
          { year: "2016", title: "Gründung", desc: "Level Pro wird an der Costa Blanca gegründet, mit Fokus auf Betonpumpen für Wohn- und Küstenprojekte." },
          { year: "2018", title: "Flottenausbau", desc: "Anschaffung leistungsstarker Autobetonpumpen für mehrgeschossige Gewerbe- und Hotelprojekte in der Region." },
          { year: "2020", title: "Hotelsektor", desc: "Abschluss wichtiger Pump- und Veredelungsarbeiten für das Hotel Rosamar in Benidorm — ein Meilenstein im Gewerbebereich." },
          { year: "2024", title: "200+ Projekte", desc: "Überschreitung von 200 abgeschlossenen Projekten und Erweiterung in Spritzbeton und Fundamentarbeiten." },
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
        phone: { label: "Telefon", val: "+34 XXX XXX XXX" },
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
  },

  es: {
    nav: {
      links: ["Servicios", "Proyectos", "Equipos", "Nosotros", "Contacto"],
      cta: "Solicitar presupuesto",
    },
    hero: {
      eyebrow: "Soluciones de hormigón — Costa Blanca",
      est: "EST. 2016",
      titleLine1: "Vivimos",
      titleLine2: "para el",
      titleLine3: "reto",
      tagline:
        "En Level Pro, colaboramos con nuestros clientes para hacer realidad sus ambiciones — entregando proyectos de hormigón que marcan una diferencia duradera para las personas y las comunidades.",
      statsLabels: { projects: "Proyectos", years: "Años", mobilization: "Movilización" },
      scroll: "Scroll",
    },
    about: {
      label: "Quiénes somos",
      body: "Level Pro ofrece soluciones profesionales de hormigón, combinando equipos con experiencia y maquinaria especializada para garantizar una ejecución precisa y resultados fiables.",
    },
    services: {
      label: "Nuestros Servicios",
      headingLine1: "Servicios",
      headingLine2: "especializados",
      headingLine3: "de hormigón",
      tagline:
        "De los cimientos a las fachadas — bombeo de hormigón fiable y colocación precisa de material a cualquier escala.",
      items: [
        { name: "Bombeo de Hormigón", detail: "Sistemas de bombeo de alta presión para obras multiplanta y a gran escala." },
        { name: "Colocación de Material", detail: "Distribución precisa del hormigón para garantizar calidad uniforme en cada vertido." },
        { name: "Gunitado", detail: "Aplicación neumática para túneles, muros de contención y geometrías complejas." },
        { name: "Cimentación", detail: "Soluciones de cimentación diseñadas para condiciones de terreno exigentes." },
      ],
      tags: ["Residencial", "Comercial", "Industrial", "Gran altura"],
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
          shortDesc: "Bombeo de hormigón y trabajos de acabado superficial para la renovación del Hotel Rosamar.",
          fullDesc: "Nuestro equipo apoyó el desarrollo y la renovación del Hotel Rosamar en Benidorm mediante bombeo de hormigón y trabajos de acabado superficial. El proyecto, completado en 2020, requirió una coordinación precisa y una ejecución fiable en obra.",
          tags: ["Bombeo de Hormigón", "Acabado Superficial", "Colocación de Material"],
        },
        {
          type: "Hotel",
          shortDesc: "Bombeo de hormigón y acabado superficial para la renovación del Nomad Hotel en Cala Finestrat.",
          fullDesc: "Nuestro equipo participó en el proyecto a través de operaciones de bombeo de hormigón y trabajos de acabado superficial, contribuyendo a la ejecución eficiente de las etapas clave de la construcción.",
          tags: ["Bombeo de Hormigón", "Acabado Superficial"],
        },
        {
          type: "Residencial",
          shortDesc: "Bombeo de hormigón de alta presión en múltiples plantas de un complejo residencial costero.",
          fullDesc: "Un complejo residencial de varios pisos en Altea que requirió bombeo de hormigón de alta presión en múltiples plantas. Nuestro equipo realizó una colocación precisa del material durante los 14 meses de construcción.",
          tags: ["Bombeo de Alta Presión", "Colocación de Material", "Cimentación"],
        },
      ],
      metaKeys: { year: "Año", type: "Tipo", budget: "Presupuesto", location: "Ubicación" },
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
        headingLine1: "Soluciones",
        headingLine2: "de hormigón",
        headingLine3: "integrales",
        tagline: "Servicios especializados de hormigón a cualquier escala — desde cimentaciones residenciales hasta grandes estructuras comerciales en la Costa Blanca.",
        scrollLabel: "Scroll",
      },
      detail: {
        items: [
          {
            name: "Bombeo de Hormigón",
            shortDesc: "Sistemas de bombeo de alta presión para obras multiplanta y a gran escala.",
            body: "Nuestro servicio de bombeo de hormigón ofrece soluciones de alta presión para edificios residenciales y comerciales de varios pisos. Nuestra flota de bombas pluma puede alcanzar alturas de hasta 50 metros, garantizando una colocación precisa y reduciendo el trabajo manual.",
            bullets: [
              "Alcance de la bomba pluma de hasta 50 metros para estructuras residenciales y comerciales de varios pisos",
              "Flota completa disponible para despliegue simultáneo en múltiples obras activas",
              "Programación del vertido con seguimiento GPS integrada en su plan de obra",
              "Supervisión del operador en obra de principio a fin en cada trabajo",
              "Reduce significativamente el manejo manual, los requisitos de andamiaje y los costes de mano de obra",
            ],
            tags: ["Residencial", "Comercial", "Gran altura"],
          },
          {
            name: "Colocación de Material",
            shortDesc: "Distribución precisa del hormigón para garantizar calidad uniforme en cada vertido.",
            body: "La colocación precisa del material es fundamental para la integridad estructural de cada proyecto. Nuestros operadores garantizan una distribución uniforme y una profundidad constante en losas, muros y pilares, minimizando el desperdicio.",
            bullets: [
              "Profundidad uniforme de losa y cobertura completa mantenidas en todas las zonas de vertido",
              "Operadores certificados con experiencia en colocación estructural para todo tipo de mezclas",
              "Coordinación en tiempo real con los responsables de obra durante cada operación",
              "Compatible con mezclas estándar y especialidades, incluido el hormigón reforzado con fibras",
              "Limpieza en obra y retirada de equipos incluidas como estándar en todas las colocaciones",
            ],
            tags: ["Losas", "Muros", "Pilares"],
          },
          {
            name: "Gunitado",
            shortDesc: "Aplicación neumática para túneles, muros de contención y geometrías complejas.",
            body: "El gunite — hormigón proyectado neumáticamente — es el método preferido para muros de contención, estabilización de taludes y formas geométricas complejas. Nuestros equipos ofrecen una cobertura rápida y de alta resistencia con control preciso del espesor de capa.",
            bullets: [
              "Procesos de mezcla húmeda y seca disponibles según la especificación del proyecto y los requisitos del sitio",
              "Formulaciones de alta resistencia temprana para aplicaciones estructuralmente críticas en muros y túneles",
              "Rápida acumulación de capas para estabilización de taludes y trabajos de emergencia",
              "Posicionamiento de la boquilla adaptado para espacios confinados y superficies geométricas complejas",
              "Espesor y uniformidad de capa verificados por el responsable de obra en cada fase de aplicación",
            ],
            tags: ["Muros de Contención", "Túneles", "Estabilización de Taludes"],
          },
          {
            name: "Cimentación",
            shortDesc: "Soluciones de cimentación diseñadas para condiciones de terreno exigentes.",
            body: "Una cimentación fiable es la base de todo proyecto exitoso. Diseñamos y ejecutamos soluciones adaptadas a las condiciones geotécnicas específicas de cada emplazamiento — desde zapatas corridas hasta losas de cimentación complejas para estructuras de gran altura.",
            bullets: [
              "Evaluaciones geotécnicas del terreno que informan el diseño de cada solución de cimentación",
              "Soluciones de hormigón armado diseñadas para condiciones de terreno difíciles y grandes cargas",
              "Coordinación con ingenieros estructurales durante las fases de diseño y especificación",
              "Dosificación volumétrica precisa del hormigón para todos los vertidos críticos de cimentación",
              "Protocolos de inspección post-vertido y documentación incluidos en todas las obras de cimentación",
            ],
            tags: ["Zapatas Corridas", "Losas de Cimentación", "Cimentación por Pilotes"],
          },
        ],
      },
      sectors: {
        label: "Sectores",
        heading: "Para todos los sectores",
        items: [
          { title: "Residencial", desc: "Desde villas individuales hasta complejos de apartamentos de varios pisos en la Costa Blanca." },
          { title: "Comercial", desc: "Hoteles, desarrollos comerciales y edificios de oficinas que requieren precisión y rapidez en obra." },
          { title: "Industrial", desc: "Suelos de fábrica, almacenes e infraestructura con exigentes requisitos estructurales y de acabado." },
          { title: "Gran altura", desc: "Estructuras de varios pisos donde el alcance de la bomba y la colocación precisa son fundamentales." },
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
    },
    aboutPage: {
      hero: {
        label: "Quiénes somos",
        headingLine1: "Construidos sobre",
        headingLine2: "precisión",
        headingLine3: "y confianza",
        tagline: "Un equipo dedicado de especialistas en hormigón comprometido con entregar resultados excepcionales en la Costa Blanca — desde cimentaciones residenciales hasta grandes estructuras comerciales.",
        scrollLabel: "Scroll",
        factLabels: ["Región", "Fundación", "Proyectos completados"],
      },
      mission: {
        label: "Nuestra historia",
        heading: "Experiencia en hormigón desde 2016",
        body1: "Level Pro se fundó en 2016 con una sola ambición: aportar soluciones profesionales de hormigón a los proyectos de construcción de la Costa Blanca. Lo que comenzó como una operación de bombeo especializada ha crecido hasta convertirse en un socio de confianza para promotores, contratistas y arquitectos de toda la región.",
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
        heading: "Nueve años de excelencia en hormigón",
        items: [
          { year: "2016", title: "Fundación", desc: "Level Pro se establece en la Costa Blanca, centrado en el bombeo de hormigón para desarrollos residenciales y costeros." },
          { year: "2018", title: "Expansión de flota", desc: "Incorporación de bombas pluma de alta capacidad para proyectos comerciales y hoteleros de varios pisos en la región." },
          { year: "2020", title: "Sector hotelero", desc: "Finalización de importantes trabajos de bombeo y acabado para el Hotel Rosamar en Benidorm — un hito comercial." },
          { year: "2024", title: "200+ proyectos", desc: "Superamos los 200 proyectos completados y ampliamos en gunitado y trabajos de cimentación." },
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
        phone: { label: "Teléfono", val: "+34 XXX XXX XXX" },
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
  },
};
