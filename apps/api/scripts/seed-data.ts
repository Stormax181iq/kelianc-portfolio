import type { ContentBlock, ProjectDetail, TimelineEvent } from "@kelianc/shared";

/**
 * Initial bilingual content, drafted from Kélian's verified sources.
 * Kélian reviews and corrects everything in the admin interface before it
 * is considered final. No placeholder text anywhere.
 */
export const contentBlocks: ContentBlock[] = [
  {
    key: "meta",
    value: {
      en: {
        title: "Kélian Chalier — Portfolio",
        description:
          "Portfolio of Kélian Chalier, BUT Informatique student at IUT de Montpellier-Sète: projects, parcours, skills and ways to get in touch.",
      },
      fr: {
        title: "Kélian Chalier — Portfolio",
        description:
          "Portfolio de Kélian Chalier, étudiant en BUT Informatique à l'IUT de Montpellier-Sète : projets, parcours, compétences et moyens de me contacter.",
      },
    },
    updatedAt: new Date().toISOString(),
  },
  {
    key: "nav",
    value: {
      en: {
        home: "Home", about: "About", projects: "Projects", beyond: "Beyond code",
        learning: "Learning portfolio", contact: "Contact",
        skipToContent: "Skip to content", openMenu: "Open menu", closeMenu: "Close menu",
        toggleTheme: "Toggle dark mode", switchLanguage: "Voir en français", openTerminal: "Open terminal",
      },
      fr: {
        home: "Accueil", about: "À propos", projects: "Projets", beyond: "Au-delà du code",
        learning: "Portfolio d'apprentissage", contact: "Contact",
        skipToContent: "Aller au contenu", openMenu: "Ouvrir le menu", closeMenu: "Fermer le menu",
        toggleTheme: "Basculer le thème sombre", switchLanguage: "View in English", openTerminal: "Ouvrir le terminal",
      },
    },
    updatedAt: new Date().toISOString(),
  },
  {
    key: "home.hero",
    value: {
      en: {
        greeting: "Hi, I'm",
        name: "Kélian Chalier",
        role: "BUT Informatique student & full-stack developer",
        pitch:
          "I build web applications end to end — from the PostgreSQL schema to the React interface — and I care about clean, readable code and calm user experiences. I study at IUT de Montpellier-Sète; outside of code, I sing opera and play piano at the conservatory.",
        ctaProjects: "See my projects",
        ctaContact: "Get in touch",
      },
      fr: {
        greeting: "Bonjour, je suis",
        name: "Kélian Chalier",
        role: "Étudiant en BUT Informatique & développeur full-stack",
        pitch:
          "Je conçois des applications web de bout en bout — du schéma PostgreSQL à l'interface React — avec le souci d'un code propre et d'expériences utilisateur apaisées. J'étudie à l'IUT de Montpellier-Sète ; en dehors du code, je chante l'opéra et joue du piano au conservatoire.",
        ctaProjects: "Voir mes projets",
        ctaContact: "Me contacter",
      },
    },
    updatedAt: new Date().toISOString(),
  },
  {
    key: "home.sections",
    value: {
      en: {
        featuredTitle: "Featured work",
        featuredSubtitle: "A selection of academic, personal and professional projects.",
        viewAllProjects: "All projects",
        skillsTitle: "Skills",
        skillsSubtitle: "My current level, self-assessed.",
        githubTitle: "On GitHub",
        githubSubtitle: "My public repositories, fetched live from the GitHub API.",
        timelineTitle: "Parcours",
        timelineSubtitle: "Studies, experience and certifications.",
        ribbonTitle: "Places I have been involved with",
        cvDownload: "Download my CV (PDF)",
        cvUnavailable: "CV coming soon",
      },
      fr: {
        featuredTitle: "Réalisations en vedette",
        featuredSubtitle: "Une sélection de projets académiques, personnels et professionnels.",
        viewAllProjects: "Tous les projets",
        skillsTitle: "Compétences",
        skillsSubtitle: "Mon niveau actuel, auto-évalué.",
        githubTitle: "Sur GitHub",
        githubSubtitle: "Mes dépôts publics, récupérés en direct depuis l'API GitHub.",
        timelineTitle: "Parcours",
        timelineSubtitle: "Formation, expériences et certifications.",
        ribbonTitle: "Organismes où je me suis investi",
        cvDownload: "Télécharger mon CV (PDF)",
        cvUnavailable: "CV bientôt disponible",
      },
    },
    updatedAt: new Date().toISOString(),
  },
  {
    key: "skills",
    value: {
      en: [
        { name: "TypeScript / JavaScript", level: "solid", levelLabel: "Solid" },
        { name: "React", level: "solid", levelLabel: "Solid" },
        { name: "Node.js / Express", level: "solid", levelLabel: "Solid" },
        { name: "PostgreSQL", level: "intermediate", levelLabel: "Intermediate" },
        { name: "HTML / CSS", level: "solid", levelLabel: "Solid" },
        { name: "Java / JavaFX", level: "intermediate", levelLabel: "Intermediate" },
        { name: "Kotlin / Jetpack Compose", level: "intermediate", levelLabel: "Intermediate" },
        { name: "Python", level: "intermediate", levelLabel: "Intermediate" },
        { name: "Linux & self-hosting", level: "solid", levelLabel: "Solid" },
        { name: "Git", level: "solid", levelLabel: "Solid" },
        { name: "Agile / Scrum", level: "intermediate", levelLabel: "Intermediate" },
        { name: "Docker", level: "learning", levelLabel: "Learning" },
      ],
      fr: [
        { name: "TypeScript / JavaScript", level: "solid", levelLabel: "Solide" },
        { name: "React", level: "solid", levelLabel: "Solide" },
        { name: "Node.js / Express", level: "solid", levelLabel: "Solide" },
        { name: "PostgreSQL", level: "intermediate", levelLabel: "Intermédiaire" },
        { name: "HTML / CSS", level: "solid", levelLabel: "Solide" },
        { name: "Java / JavaFX", level: "intermediate", levelLabel: "Intermédiaire" },
        { name: "Kotlin / Jetpack Compose", level: "intermediate", levelLabel: "Intermédiaire" },
        { name: "Python", level: "intermediate", levelLabel: "Intermédiaire" },
        { name: "Linux & auto-hébergement", level: "solid", levelLabel: "Solide" },
        { name: "Git", level: "solid", levelLabel: "Solide" },
        { name: "Agile / Scrum", level: "intermediate", levelLabel: "Intermédiaire" },
        { name: "Docker", level: "learning", levelLabel: "En apprentissage" },
      ],
    },
    updatedAt: new Date().toISOString(),
  },
  {
    key: "about.page",
    value: {
      en: {
        title: "About",
        lead:
          "Curious, rigorous and calm under pressure, I like understanding how things work — which is how I ended up in computer science.",
        paragraphs: [
          "I am currently in the BUT Informatique at IUT de Montpellier-Sète (2025–2028), after a scientific baccalauréat at Lycée J.B. Dumas in Alès — mathematics, physics-chemistry and engineering sciences, European section in English — passed with a très bien mention in 2025.",
          "Alongside my studies I have been a volunteer organiser at the PEL (Point Écoute Jeunes) since August 2024, I worked at Decathlon during the summer of 2025, I did a discovery day at Enedis in February 2022, and I will be a tutor at the IUT for the 2026–2027 year.",
          "What defines me is curiosity, rigour and a taste for teamwork: I like taking the time to understand a problem before writing code, and I value clear communication — in code as much as in life.",
        ],
        visionTitle: "After the BUT",
        vision: [
          "My professional project is to become a full-stack developer, ideally through an apprenticeship, and to continue my studies in an engineering cycle (parcours RACDV).",
          "In the longer term, I want to keep growing technically on projects with a real positive impact, while staying close to users' needs.",
        ],
        languagesTitle: "Languages",
        languages: [
          { name: "French", level: "Native" },
          { name: "English", level: "C1" },
          { name: "German", level: "B2" },
        ],
        downloadCv: "Download my CV (PDF)",
      },
      fr: {
        title: "À propos",
        lead:
          "Curieux, rigoureux et calme sous la pression, j'aime comprendre comment les choses fonctionnent — c'est ainsi que j'en suis arrivé à l'informatique.",
        paragraphs: [
          "Je suis actuellement en BUT Informatique à l'IUT de Montpellier-Sète (2025–2028), après un baccalauréat scientifique au lycée J.B. Dumas d'Alès — mathématiques, physique-chimie et sciences de l'ingénieur, section européenne anglais — obtenu avec la mention très bien en 2025.",
          "À côté de mes études, je suis organisateur bénévole au PEL (Point Écoute Jeunes) depuis août 2024, j'ai travaillé chez Decathlon à l'été 2025, j'ai effectué une journée de découverte chez Enedis en février 2022, et je serai tuteur à l'IUT pour l'année 2026–2027.",
          "Ce qui me définit : la curiosité, la rigueur et le goût du travail en équipe. J'aime prendre le temps de comprendre un problème avant d'écrire du code, et j'accorde de l'importance à une communication claire — dans le code comme dans la vie.",
        ],
        visionTitle: "Après le BUT",
        vision: [
          "Mon projet professionnel est de devenir développeur full-stack, idéalement en alternance, et de poursuivre mes études dans un cycle ingénieur (parcours RACDV).",
          "À plus long terme, je veux continuer à progresser techniquement sur des projets à impact positif réel, tout en restant proche des besoins des utilisateurs.",
        ],
        languagesTitle: "Langues",
        languages: [
          { name: "Français", level: "Langue maternelle" },
          { name: "Anglais", level: "C1" },
          { name: "Allemand", level: "B2" },
        ],
        downloadCv: "Télécharger mon CV (PDF)",
      },
    },
    updatedAt: new Date().toISOString(),
  },
  {
    key: "projects.page",
    value: {
      en: {
        title: "Projects",
        subtitle:
          "Academic, personal and professional projects I have worked on since the start of my BUT — each one analysed with the expérience → compétences method.",
        filterAll: "All", filterAcademic: "Academic", filterPersonal: "Personal", filterProfessional: "Professional",
        empty: "No project in this category yet.",
        readMore: "Read more",
        contextTitle: "Context",
        methodsTitle: "Methods and work",
        resultsTitle: "Results and proof",
        skillsTitle: "Skills developed",
        contributionTitle: "My personal contribution",
        traceTitle: "Proof of achievement",
        viewRepo: "Source code",
        viewDemo: "Live demo",
        backToProjects: "Back to projects",
        notFound: "This project does not exist.",
      },
      fr: {
        title: "Projets",
        subtitle:
          "Projets académiques, personnels et professionnels réalisés depuis le début de mon BUT — chacun analysé avec la méthode expérience → compétences.",
        filterAll: "Tous", filterAcademic: "Académiques", filterPersonal: "Personnels", filterProfessional: "Professionnels",
        empty: "Aucun projet dans cette catégorie pour le moment.",
        readMore: "En savoir plus",
        contextTitle: "Contexte",
        methodsTitle: "Méthodes de travail",
        resultsTitle: "Résultats et preuves",
        skillsTitle: "Compétences travaillées",
        contributionTitle: "Ma contribution personnelle",
        traceTitle: "Preuve de réalisation",
        viewRepo: "Code source",
        viewDemo: "Démo en ligne",
        backToProjects: "Retour aux projets",
        notFound: "Ce projet n'existe pas.",
      },
    },
    updatedAt: new Date().toISOString(),
  },
  {
    key: "beyond.page",
    value: {
      en: {
        title: "Beyond code",
        intro:
          "Code is a big part of my life, but not all of it. This section is deliberately visual: media will speak louder than long texts.",
        sections: [
          {
            id: "singing",
            title: "Operatic singing",
            text: "I sing at the conservatoire of Alès, where I obtained my first-cycle certificate in operatic singing (adult section) in April 2026, after a second-cycle solfège certificate in June 2025.",
          },
          {
            id: "piano",
            title: "Piano",
            text: "I have been playing piano at the conservatoire of Alès for several years and obtained my first-cycle certificate in February 2024.",
          },
          {
            id: "tallinn",
            title: "Erasmus BIP week in Tallinn",
            text: "In 2026 I took part in an Erasmus BIP week in Tallinn, Estonia, on generative AI. The week led to bip-ai-study-coach, a small Python study assistant (see my projects).",
          },
          {
            id: "genealogy",
            title: "Genealogy",
            text: "In my free time I build my family tree: a patient, detective-like work that connects generations and places.",
          },
          {
            id: "sport",
            title: "Running & weight training",
            text: "I regularly take part in races (10 km, 8 km, 5 km) and practise weight training.",
          },
        ],
      },
      fr: {
        title: "Au-delà du code",
        intro:
          "Le code occupe une grande place dans ma vie, mais pas toute. Cette section se veut volontairement visuelle : les médias parleront plus que de longs textes.",
        sections: [
          {
            id: "singing",
            title: "Chant lyrique",
            text: "Je chante au conservatoire d'Alès, où j'ai obtenu mon certificat de premier cycle en chant lyrique (section adulte) en avril 2026, après un certificat de deuxième cycle de solfège en juin 2025.",
          },
          {
            id: "piano",
            title: "Piano",
            text: "Je joue du piano au conservatoire d'Alès depuis plusieurs années et j'y ai obtenu mon certificat de premier cycle en février 2024.",
          },
          {
            id: "tallinn",
            title: "Semaine Erasmus BIP à Tallinn",
            text: "En 2026, j'ai participé à une semaine Erasmus BIP à Tallinn (Estonie) sur l'IA générative. Cette semaine a donné naissance à bip-ai-study-coach, un petit assistant d'étude en Python (voir mes projets).",
          },
          {
            id: "genealogy",
            title: "Généalogie",
            text: "Pendant mon temps libre, je construis mon arbre généalogique : un travail patient, façon enquête, qui relie les générations et les lieux.",
          },
          {
            id: "sport",
            title: "Course à pied & musculation",
            text: "Je participe régulièrement à des courses (10 km, 8 km, 5 km) et je pratique la musculation.",
          },
        ],
      },
    },
    updatedAt: new Date().toISOString(),
  },
  {
    key: "contact.page",
    value: {
      en: {
        title: "Contact",
        intro:
          "Want to talk about a project, an internship or just say hi? Send me a message through this form — it lands directly in my inbox. You can also find me on GitHub and LinkedIn (links in the footer).",
        nameLabel: "Your name",
        emailLabel: "Your email",
        messageLabel: "Your message",
        submit: "Send message",
        sending: "Sending…",
        success: "Message sent, thank you! I will get back to you soon.",
        error: "Something went wrong, please try again.",
        note: "This form is protected against spam.",
      },
      fr: {
        title: "Contact",
        intro:
          "Un projet, un stage, ou simplement envie de dire bonjour ? Envoyez-moi un message via ce formulaire — il arrive directement dans ma boîte mail. Vous pouvez aussi me retrouver sur GitHub et LinkedIn (liens dans le pied de page).",
        nameLabel: "Votre nom",
        emailLabel: "Votre e-mail",
        messageLabel: "Votre message",
        submit: "Envoyer le message",
        sending: "Envoi en cours…",
        success: "Message envoyé, merci ! Je vous répondrai rapidement.",
        error: "Une erreur est survenue, veuillez réessayer.",
        note: "Ce formulaire est protégé contre le spam.",
      },
    },
    updatedAt: new Date().toISOString(),
  },
  {
    key: "learning.page",
    value: {
      en: {
        title: "Learning portfolio — Semester 4",
        intro: "This section will host my Semester 4 learning portfolio (portfolio d'apprentissage).",
        s4Note:
          "It is intentionally almost empty for now: the Semester 4 content will be written during Semester 4. The technical foundation — this page, its database storage and its admin editor — is already in place.",
        backHome: "Back to home",
      },
      fr: {
        title: "Portfolio d'apprentissage — Semestre 4",
        intro: "Cette section accueillera mon portfolio d'apprentissage du semestre 4.",
        s4Note:
          "Elle est volontairement presque vide pour l'instant : le contenu du semestre 4 sera rédigé pendant le semestre 4. La fondation technique — cette page, son stockage en base et son éditeur dans l'admin — est déjà en place.",
        backHome: "Retour à l'accueil",
      },
    },
    updatedAt: new Date().toISOString(),
  },
  {
    key: "footer",
    value: {
      en: {
        rights: "© {year} Kélian Chalier. All rights reserved.",
        madeWith: "Built with the PERN stack (PostgreSQL, Express, React, Node.js) and TypeScript.",
        terminalHint: "Psst — there is a small terminal hiding in the corner.",
        backToTop: "Back to top",
      },
      fr: {
        rights: "© {year} Kélian Chalier. Tous droits réservés.",
        madeWith: "Conçu avec la stack PERN (PostgreSQL, Express, React, Node.js) et TypeScript.",
        terminalHint: "Psst — un petit terminal se cache dans le coin.",
        backToTop: "Haut de page",
      },
    },
    updatedAt: new Date().toISOString(),
  },
  {
    key: "terminal",
    value: {
      en: {
        welcome: "Welcome to my terminal. Type `help` to list the available commands.",
        help: "Available commands: help, whoami, projects, contact, clear",
        whoami: "visitor@kelianc.eu — a curious human (or a very polite bot)",
        contact: "Use the contact page, or find me on GitHub and LinkedIn (links in the footer).",
        unknownCommand: "Unknown command: {cmd}. Type `help` to list commands.",
        cleared: "Screen cleared.",
        prompt: "visitor@kelianc:~$",
      },
      fr: {
        welcome: "Bienvenue dans mon terminal. Tapez `help` pour lister les commandes disponibles.",
        help: "Commandes disponibles : help, whoami, projects, contact, clear",
        whoami: "visitor@kelianc.eu — un humain curieux (ou un robot très poli)",
        contact: "Utilisez la page contact, ou retrouvez-moi sur GitHub et LinkedIn (liens dans le pied de page).",
        unknownCommand: "Commande inconnue : {cmd}. Tapez `help` pour lister les commandes.",
        cleared: "Écran effacé.",
        prompt: "visitor@kelianc:~$",
      },
    },
    updatedAt: new Date().toISOString(),
  },
  {
    key: "errors",
    value: {
      en: {
        notFoundTitle: "Page not found",
        notFoundText: "The page you are looking for does not exist (or has moved).",
        backHome: "Back to home",
      },
      fr: {
        notFoundTitle: "Page introuvable",
        notFoundText: "La page que vous cherchez n'existe pas (ou a été déplacée).",
        backHome: "Retour à l'accueil",
      },
    },
    updatedAt: new Date().toISOString(),
  },
  {
    key: "timeline.labels",
    value: {
      en: { education: "Education", experience: "Experience", certification: "Certifications", present: "Present" },
      fr: { education: "Formation", experience: "Expérience", certification: "Certifications", present: "Aujourd'hui" },
    },
    updatedAt: new Date().toISOString(),
  },
];

export const projects: ProjectDetail[] = [
  {
    slug: "sae-3a-alumni-lapose",
    category: "academic",
    tech: ["TypeScript", "React", "Node.js", "Express", "PostgreSQL"],
    image: null,
    repoUrl: null,
    demoUrl: null,
    featured: true,
    order: 1,
    title: { en: "Alumni platform — SAÉ 3A (LaPosse)", fr: "Plateforme alumni — SAÉ 3A (LaPosse)" },
    summary: {
      en: "Team of six: design and build an alumni platform for the LaPosse association with Scrum and story mapping. I was the Product Owner.",
      fr: "Équipe de six : concevoir et développer une plateforme alumni pour l'association LaPosse, en Scrum et story mapping. J'étais le Product Owner.",
    },
    context: {
      en: "Academic commission (SAÉ 3A) for the LaPosse association: design and develop a web platform connecting alumni with students. Team of six, over about four weeks, with agile methods imposed (Scrum, story mapping, sprints).",
      fr: "Commande académique (SAÉ 3A) pour l'association LaPosse : concevoir et développer une plateforme web mettant en relation alumni et étudiants. Équipe de six, sur environ quatre semaines, avec des méthodes agiles imposées (Scrum, story mapping, sprints).",
    },
    methods: {
      en: "We ran the project as a Scrum team: story mapping to scope the backlog, sprint planning, daily stand-ups and a review at the end of each sprint. As Product Owner I wrote the user stories, prioritised the backlog with the client and validated each increment.",
      fr: "Nous avons mené le projet en équipe Scrum : story mapping pour cadrer le backlog, planification de sprint, points quotidiens et revue à la fin de chaque sprint. En tant que Product Owner, j'ai rédigé les user stories, priorisé le backlog avec le client et validé chaque incrément.",
    },
    results: {
      en: "A working prototype of the alumni platform was delivered and presented to the client at the final review: authentication, alumni profiles and a directory.",
      fr: "Un prototype fonctionnel de la plateforme alumni a été livré et présenté au client lors de la revue finale : authentification, profils alumni et annuaire.",
    },
    skills: [
      { en: "Scrum and agile methods", fr: "Scrum et méthodes agiles" },
      { en: "Product ownership", fr: "Product ownership" },
      { en: "Requirements analysis", fr: "Analyse des besoins" },
      { en: "Teamwork and communication", fr: "Travail en équipe et communication" },
      { en: "Full-stack web development (PERN)", fr: "Développement web full-stack (PERN)" },
    ],
    contribution: {
      en: "As Product Owner I wrote and prioritised the user stories, ran the sprint ceremonies and was the main contact with the client; I also developed part of the React front end and of the Express/PostgreSQL REST API.",
      fr: "En tant que Product Owner, j'ai rédigé et priorisé les user stories, animé les cérémonies de sprint et été le contact principal du client ; j'ai aussi développé une partie du front React et de l'API REST Express/PostgreSQL.",
    },
    trace: {
      mediaPath: null,
      caption: {
        en: "Screenshots and demo recording of the final prototype — media to be uploaded by me in the admin interface.",
        fr: "Captures d'écran et enregistrement de démo du prototype final — médias à téléverser par moi dans l'interface d'admin.",
      },
    },
  },
  {
    slug: "parloir-blog",
    category: "personal",
    tech: ["TypeScript", "React", "Express", "PostgreSQL", "Docker"],
    image: null,
    repoUrl: "https://github.com/Stormax181iq/parloir-blog",
    demoUrl: null,
    featured: true,
    order: 2,
    title: { en: "Parloir blog", fr: "Blog Parloir" },
    summary: {
      en: "A personal blog engine I designed and built with the PERN stack, public on GitHub and self-hosted.",
      fr: "Un moteur de blog personnel que j'ai conçu et développé avec la stack PERN, public sur GitHub et auto-hébergé.",
    },
    context: {
      en: "Personal project started in my free time to practise full-stack development: a blog with articles, tags and an administration area. Solo project.",
      fr: "Projet personnel commencé pendant mon temps libre pour pratiquer le développement full-stack : un blog avec articles, étiquettes et une zone d'administration. Projet solo.",
    },
    methods: {
      en: "I designed the PostgreSQL schema with a migration system, built a REST API in Express layered as routes / controllers / services / repositories, and a React front end. The whole stack is deployed on my own Linux server behind a reverse proxy.",
      fr: "J'ai conçu le schéma PostgreSQL avec un système de migrations, construit une API REST en Express structurée en couches (routes / contrôleurs / services / repositories), et un front React. La stack complète est déployée sur mon propre serveur Linux derrière un reverse proxy.",
    },
    results: {
      en: "A live, self-hosted blog with a public repository, a CI pipeline and unit tests on the back end.",
      fr: "Un blog en ligne et auto-hébergé, avec un dépôt public, un pipeline CI et des tests unitaires côté back.",
    },
    skills: [
      { en: "PERN stack", fr: "Stack PERN" },
      { en: "Database design and migrations", fr: "Conception de base de données et migrations" },
      { en: "REST API design", fr: "Conception d'API REST" },
      { en: "Self-hosting (Linux, reverse proxy)", fr: "Auto-hébergement (Linux, reverse proxy)" },
      { en: "CI/CD", fr: "CI/CD" },
    ],
    contribution: null,
    trace: {
      mediaPath: null,
      caption: {
        en: "Screenshots of the blog and its admin area — media to be uploaded by me in the admin interface.",
        fr: "Captures d'écran du blog et de son administration — médias à téléverser par moi dans l'interface d'admin.",
      },
    },
  },
  {
    slug: "lpe-events",
    category: "professional",
    tech: ["Kotlin", "Jetpack Compose", "Android"],
    image: null,
    repoUrl: null,
    demoUrl: null,
    featured: false,
    order: 3,
    title: { en: "LPE Events — Android app", fr: "LPE Events — application Android" },
    summary: {
      en: "Volunteer Android app for the LPE association to publish and browse events, published on the Play Store.",
      fr: "Application Android bénévole pour l'association LPE, pour publier et consulter des événements, publiée sur le Play Store.",
    },
    context: {
      en: "Volunteer work for the LPE association: an Android application to centralise and broadcast its events. Designed and developed solo, with Kotlin.",
      fr: "Travail bénévole pour l'association LPE : une application Android pour centraliser et diffuser ses événements. Conception et développement en solo, en Kotlin.",
    },
    methods: {
      en: "Jetpack Compose interface, MVVM architecture, local persistence and a small back end; the app was then published on the Google Play Store.",
      fr: "Interface en Jetpack Compose, architecture MVVM, persistance locale et petit back end ; l'application a ensuite été publiée sur le Google Play Store.",
    },
    results: {
      en: "The app is available on the Play Store and used by the association's members to follow its events.",
      fr: "L'application est disponible sur le Play Store et utilisée par les membres de l'association pour suivre ses événements.",
    },
    skills: [
      { en: "Kotlin", fr: "Kotlin" },
      { en: "Jetpack Compose", fr: "Jetpack Compose" },
      { en: "MVVM architecture", fr: "Architecture MVVM" },
      { en: "Android publishing (Play Store)", fr: "Publication Android (Play Store)" },
    ],
    contribution: null,
    trace: {
      mediaPath: null,
      caption: {
        en: "Screenshots of the app and its Play Store page — media to be uploaded by me in the admin interface.",
        fr: "Captures d'écran de l'application et de sa page Play Store — médias à téléverser par moi dans l'interface d'admin.",
      },
    },
  },
  {
    slug: "bip-tallinn-ai-study-coach",
    category: "academic",
    tech: ["Python", "Generative AI", "CLI"],
    image: null,
    repoUrl: "https://github.com/Stormax181iq/bip-ai-study-coach",
    demoUrl: null,
    featured: false,
    order: 4,
    title: { en: "AI study coach — Erasmus BIP Tallinn", fr: "Coach d'étude IA — Erasmus BIP Tallinn" },
    summary: {
      en: "A small Python assistant built during the Erasmus BIP week in Tallinn (2026) to turn course notes into study plans and quizzes with generative AI.",
      fr: "Un petit assistant Python développé pendant la semaine Erasmus BIP à Tallinn (2026) pour transformer des notes de cours en plans de révision et quiz grâce à l'IA générative.",
    },
    context: {
      en: "Erasmus BIP week in Tallinn, Estonia (2026), on generative AI: an international team project over one intensive week.",
      fr: "Semaine Erasmus BIP à Tallinn (Estonie) en 2026, sur l'IA générative : un projet d'équipe international mené en une semaine intensive.",
    },
    methods: {
      en: "Prompt engineering and a Python CLI that turns course notes into a study plan and self-assessment quizzes by calling a generative AI API.",
      fr: "Prompt engineering et un CLI Python qui transforme des notes de cours en plan de révision et quiz d'auto-évaluation en appelant une API d'IA générative.",
    },
    results: {
      en: "A working prototype presented at the end of the week, and a public repository.",
      fr: "Un prototype fonctionnel présenté à la fin de la semaine, et un dépôt public.",
    },
    skills: [
      { en: "Python", fr: "Python" },
      { en: "Prompt engineering", fr: "Prompt engineering" },
      { en: "Generative AI APIs", fr: "API d'IA générative" },
      { en: "International teamwork", fr: "Travail en équipe internationale" },
    ],
    contribution: {
      en: "I designed the prompt chain and developed the Python CLI; the rest of the team handled the evaluation and the final presentation.",
      fr: "J'ai conçu la chaîne de prompts et développé le CLI Python ; le reste de l'équipe s'est chargé de l'évaluation et de la présentation finale.",
    },
    trace: {
      mediaPath: null,
      caption: {
        en: "Screenshots of the CLI and of the final presentation — media to be uploaded by me in the admin interface.",
        fr: "Captures d'écran du CLI et de la présentation finale — médias à téléverser par moi dans l'interface d'admin.",
      },
    },
  },
];

export const timelineEvents: Array<Omit<TimelineEvent, "id">> = [
  {
    kind: "education",
    startDate: "2025-09",
    endDate: null,
    order: 1,
    title: { en: "BUT Informatique", fr: "BUT Informatique" },
    organization: { en: "IUT de Montpellier-Sète", fr: "IUT de Montpellier-Sète" },
    description: {
      en: "Three-year bachelor's degree in computer science. Currently in semester 3.",
      fr: "BUT Informatique (3 ans). Actuellement en semestre 3.",
    },
  },
  {
    kind: "education",
    startDate: "2023-09",
    endDate: "2025-06",
    order: 2,
    title: { en: "Scientific baccalauréat", fr: "Baccalauréat scientifique" },
    organization: { en: "Lycée J.B. Dumas, Alès", fr: "Lycée J.B. Dumas, Alès" },
    description: {
      en: "Mathematics, physics-chemistry, engineering sciences; European section (DNL) in English. Mention très bien.",
      fr: "Mathématiques, physique-chimie, sciences de l'ingénieur ; section européenne (DNL) anglais. Mention très bien.",
    },
  },
  {
    kind: "education",
    startDate: "2022-09",
    endDate: "2023-06",
    order: 3,
    title: { en: "Euro-Engineer programme", fr: "Dispositif Euro-Engineer" },
    organization: { en: "Lycée J.B. Dumas, Alès", fr: "Lycée J.B. Dumas, Alès" },
    description: {
      en: "European programme with English-taught science courses.",
      fr: "Dispositif européen avec des cours de sciences en anglais.",
    },
  },
  {
    kind: "experience",
    startDate: "2024-08",
    endDate: null,
    order: 1,
    title: { en: "Volunteer organiser", fr: "Organisateur bénévole" },
    organization: { en: "PEL — Point Écoute Jeunes", fr: "PEL — Point Écoute Jeunes" },
    description: {
      en: "Welcoming young people, organising activities and prevention actions.",
      fr: "Accueil des jeunes, organisation d'activités et actions de prévention.",
    },
  },
  {
    kind: "experience",
    startDate: "2025-08",
    endDate: "2025-08",
    order: 2,
    title: { en: "Sales associate (summer job)", fr: "Vendeur (job d'été)" },
    organization: { en: "Decathlon", fr: "Decathlon" },
    description: {
      en: "Summer job in sports retail: customer advice and department organisation.",
      fr: "Job d'été dans la distribution sportive : conseil client et organisation du rayon.",
    },
  },
  {
    kind: "experience",
    startDate: "2026-09",
    endDate: null,
    order: 3,
    title: { en: "Tutor", fr: "Tuteur" },
    organization: { en: "IUT de Montpellier-Sète", fr: "IUT de Montpellier-Sète" },
    description: {
      en: "Academic support for first-year students (2026–2027).",
      fr: "Accompagnement pédagogique des étudiants de première année (2026–2027).",
    },
  },
  {
    kind: "experience",
    startDate: "2022-02",
    endDate: "2022-02",
    order: 4,
    title: { en: "Discovery day", fr: "Journée de découverte" },
    organization: { en: "Enedis", fr: "Enedis" },
    description: {
      en: "One-day immersion in the company and its technical teams.",
      fr: "Une journée d'immersion dans l'entreprise et ses équipes techniques.",
    },
  },
  {
    kind: "certification",
    startDate: "2026-04",
    endDate: null,
    order: 1,
    title: { en: "Operatic singing, 1st cycle (adult)", fr: "Chant lyrique, 1er cycle (adulte)" },
    organization: { en: "Conservatoire d'Alès", fr: "Conservatoire d'Alès" },
    description: { en: "First-cycle certificate.", fr: "Certificat de premier cycle." },
  },
  {
    kind: "certification",
    startDate: "2025-07",
    endDate: null,
    order: 2,
    title: { en: "Driving licence (B)", fr: "Permis de conduire (B)" },
    organization: { en: "France", fr: "France" },
    description: { en: "Category B licence.", fr: "Permis de catégorie B." },
  },
  {
    kind: "certification",
    startDate: "2025-06",
    endDate: null,
    order: 3,
    title: { en: "Solfège, 2nd cycle", fr: "Solfège, 2e cycle" },
    organization: { en: "Conservatoire d'Alès", fr: "Conservatoire d'Alès" },
    description: { en: "Second-cycle music theory certificate.", fr: "Certificat de deuxième cycle de formation musicale." },
  },
  {
    kind: "certification",
    startDate: "2024-02",
    endDate: null,
    order: 4,
    title: { en: "Piano, 1st cycle", fr: "Piano, 1er cycle" },
    organization: { en: "Conservatoire d'Alès", fr: "Conservatoire d'Alès" },
    description: { en: "First-cycle piano certificate.", fr: "Certificat de premier cycle de piano." },
  },
  {
    kind: "certification",
    startDate: "2022-07",
    endDate: null,
    order: 5,
    title: { en: "Brevet des collèges", fr: "Brevet des collèges" },
    organization: { en: "Collège", fr: "Collège" },
    description: { en: "National diploma, mention très bien.", fr: "Diplôme national du brevet, mention très bien." },
  },
  {
    kind: "certification",
    startDate: "2022-06",
    endDate: null,
    order: 6,
    title: { en: "BIA (aviation initiation certificate)", fr: "BIA (brevet d'initiation aéronautique)" },
    organization: { en: "France", fr: "France" },
    description: { en: "Introduction to aviation.", fr: "Initiation à l'aéronautique." },
  },
];

export const settings: Record<string, unknown> = {
  siteTitle: "Kélian Chalier — Portfolio",
  githubUsername: "Stormax181iq",
  githubUrl: "https://github.com/Stormax181iq",
  linkedinUrl: "https://www.linkedin.com/in/kelianc",
  learningPortfolioPublished: false,
  cvEn: null,
  cvFr: null,
};
