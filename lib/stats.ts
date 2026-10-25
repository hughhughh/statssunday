import type { StatCard, StatSet, StatSetMeta } from "./types.ts";

export const ALL_SLUG = "practise";

type Draft = {
  section: string;
  front: string;
  back: string;
};

function slugify(section: string): string {
  return section
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const drafts: Draft[] = [
  // Economic growth
  {
    section: "Economic growth",
    front: "__________ Economic growth _____ (_______________)",
    back: "June 2020 Economic growth -5.9% (Through the year)",
  },
  {
    section: "Economic growth",
    front: "__________ Economic growth _____ (_______________)",
    back: "June 2021 Economic growth 10.2% (Through the year)",
  },
  {
    section: "Economic growth",
    front: "__________ Economic growth _____ (_______________)",
    back: "June 2026 Economic growth 2.1% (Through the year)",
  },
  {
    section: "Economic growth",
    front:
      "__________ Economic growth _____ (_______________) vs OECD avg ____% low in _______, compared to ___% growth in ____",
    back: "Dec 2008 Economic growth 0.6% (Through the year) vs OECD avg -3.6% low in 2009, compared to 2.6% growth in 2007",
  },
  {
    section: "Economic growth",
    front:
      "__ years to ________, ___% average growth rate with only growth, compared to OECD average of ___%",
    back: "28 years to 2019-20, 2.9% average growth rate with only growth, compared to OECD average of 1.6%",
  },
  {
    section: "Economic growth",
    front: "$______ jobseeker jobkeeper in covid",
    back: "$116.3bn jobseeker jobkeeper in covid",
  },

  // Inflation
  {
    section: "Inflation",
    front: "_________ _____ inflation ___%",
    back: "December 2022 inflation 7.8%",
  },
  {
    section: "Inflation",
    front: "ToT _______ to _____ increased over __%",
    back: "ToT 2003-04 to 2011 increased over 80%",
  },
  {
    section: "Inflation",
    front: "In _____, mining investment peaked at _% of GDP",
    back: "In 2012, mining investment peaked at 9% of GDP",
  },
  {
    section: "Inflation",
    front: "Inflation average ___% since inflation targeting introduced in _____",
    back: "Inflation average 2.5% since inflation targeting introduced in 1993",
  },
  {
    section: "Inflation",
    front: "_% inflation in transportation in March, with ___% headline inflation",
    back: "9% inflation in transportation in March, with 4.6% headline inflation",
  },
  {
    section: "Inflation",
    front: "_____ ____ inflation low of _____%",
    back: "June 2020 inflation low of -0.3%",
  },
  {
    section: "Inflation",
    front: "_______ ___ consecutive rate hikes to _____%",
    back: "2022-23 13 consecutive rate hikes to 4.35%",
  },

  // Unemployment
  {
    section: "Unemployment",
    front: "_____ ____ _____%",
    back: "June 2020 7.4%",
  },
  {
    section: "Unemployment",
    front: "Jan 26 ____%",
    back: "Jan 26 4.1%",
  },
  {
    section: "Unemployment",
    front: "_____ _____ _____%",
    back: "April 2026 4.5%",
  },
  {
    section: "Unemployment",
    front: "NAIRU treasury budget 26-27 estimate _____%",
    back: "NAIRU treasury budget 26-27 estimate 4.25%",
  },

  // External stability
  {
    section: "External stability",
    front: "__________ (Date)",
    back: "March 2026 (Date)",
  },
  {
    section: "External stability",
    front: "____% CAD",
    back: "3.7% CAD",
  },
  {
    section: "External stability",
    front: "___% NPY",
    back: "-3.2% NPY",
  },
  {
    section: "External stability",
    front: "NFD ______% of GDP",
    back: "NFD 50.3% of GDP",
  },
  {
    section: "External stability",
    front: "NFL ______%",
    back: "NFL 24.5%",
  },
  {
    section: "External stability",
    front: "NFE ______% (Super)",
    back: "NFE -25.8% (Super)",
  },
  {
    section: "External stability",
    front: "NFD Max ____ at _____%",
    back: "NFD Max 2016 at 65.3%",
  },
  {
    section: "External stability",
    front: "____ _____ NFE goes negative at ____%, NFD ____, NFL ____",
    back: "June 2013 NFE goes negative at -0.3%, NFD 53.4, NFL 53.1",
  },
  {
    section: "External stability",
    front: "____% BOGS March 2026",
    back: "-0.3% BOGS March 2026",
  },
  {
    section: "External stability",
    front: "Debt servicing ratio __% of GDP in ______",
    back: "Debt servicing ratio 7% of GDP in 2024-25",
  },

  // Superannuation
  {
    section: "Superannuation",
    front: "___________ _______ Super $______ dollars",
    back: "September 2025 Super $4.5tn dollars",
  },

  // Environment
  {
    section: "Environment",
    front: "Net zero by _____",
    back: "Net zero by 2025",
  },
  {
    section: "Environment",
    front: "___% reduction in _____ co2 emissions by _____",
    back: "42% reduction in 2005 co2 emissions by 2030",
  },
  {
    section: "Environment",
    front:
      "$______ spending on battery subsidies since introduction in ________, ___% discount on batteries, more than the $_______ projected cost until _____",
    back: "$4.3bn spending on battery subsidies since introduction in July 2025, 30% discount on batteries, more than the $2.3bn projected cost until 2030",
  },
  {
    section: "Environment",
    front:
      "Australia has the highest uptake of rooftop solar, with the ____________________________ subsidy supporting the installation of over ____________ home batteries. Allocation has been changed to $_________, changing the size of the rebate and making it less attractive for larger batteries.",
    back: "Australia has the highest uptake of rooftop solar, with the Cheaper Home Batteries subsidy supporting the installation of over 500,000 home batteries. Allocation has been changed to $7.2bn, changing the size of the rebate and making it less attractive for larger batteries.",
  },
  {
    section: "Environment",
    front: "_____% of energy used in ______ was renewable",
    back: "36% of energy used in 2024 was renewable",
  },
  {
    section: "Environment",
    front: "____ Gillard labour government introduction of a $___ per tonne carbon tax",
    back: "2012 Gillard labour government introduction of a $23 per tonne carbon tax",
  },
  {
    section: "Environment",
    front: "Net zero by ____",
    back: "Net Zero by 2050",
  },
  {
    section: "Environment",
    front: "____ ban on incandescent lightbulbs",
    back: "2007 ban on incandescent lightbulbs",
  },
  {
    section: "Environment",
    front: "Chlorofluorocarbons banned as a result of the _______________________",
    back: "Chlorofluorocarbons banned as a result of the 1987 Montreal Protocol",
  },
  {
    section: "Environment",
    front: "$_bn in subsidies as a part of the 2024 solar sun shot program",
    back: "$1bn in subsidies as a part of the 2024 solar sun shot program",
  },

  // Trade
  {
    section: "Trade",
    front: "_________, ____ and _____ were ___% of exports, now ___%",
    back: "Iron ore, coal and LNG were 19% of exports, now 39%",
  },
  {
    section: "Trade",
    front: "Education was ____%, now _____%",
    back: "Education was 3.9%, now 11.9%",
  },
  {
    section: "Trade",
    front: "In _____, ____% of exports and imports when to China",
    back: "In 1991, 2.4% of exports and imports when to China",
  },
  {
    section: "Trade",
    front: "In ______, ______% of exports went to China",
    back: "In 2024, 37.9% of exports went to China",
  },
  {
    section: "Trade",
    front: "_____% of imports came from China",
    back: "20.6% of imports came from China",
  },
  {
    section: "Trade",
    front: "$_____ total two-way trade ($_____ todays money) in ______, $_______ _______",
    back: "$256bn total two-way trade ($510bn todays money) in 2000, $1.3Tn 2025",
  },
  {
    section: "Trade",
    front:
      "____________ – Australia’s __th largest trading partner, with $_______ in ________",
    back: "ANZCERTA – Australia’s 9th largest trading partner, with $32bn in 2024",
  },
  {
    section: "Trade",
    front:
      "_________ Australia FTA – Australia’s ____________ largest trading partner, $___________ in two way trade and investment flows in ________",
    back: "ASEAN Australia FTA – Australia’s second largest trading partner, $375bn in two way trade and investment flows in 2021",
  },

  // Labour market
  {
    section: "Labour market",
    front: "___% of employees on common law contracts",
    back: "39% of employees on common law contracts",
  },

  // China
  {
    section: "China",
    front: "China ______ ______ _% between ____-____. Peak of ____% in _____",
    back: "China Real AAGR 9% between 1978-2019. Peak of 14.2% in 2007",
  },
  {
    section: "China",
    front: "China made up ____% of _____ in ____",
    back: "China made up 19.5% of GWP in 2024",
  },
  {
    section: "China",
    front: "US$___ billion of FDI to China in _____",
    back: "US$116 billion of FDI to China in 2024",
  },
  {
    section: "China",
    front: "Over prev 25y, pov reduced by ___m people",
    back: "Over prev 25y, pov reduced by 400m people",
  },
  {
    section: "China",
    front: "______, ___% of global greenhouse gas emissions came from China",
    back: "2022, 29% of global greenhouse gas emissions came from China",
  },
  {
    section: "China",
    front: "China’s HDI was .___ in _____, now at ._____",
    back: "China’s HDI was .410 in 1978, now at .797",
  },
  {
    section: "China",
    front: "China’s GINI was .___ in _____, now at ._____",
    back: "China’s GINI was .21 in 1978, now at .465",
  },
  {
    section: "China",
    front: "China Australia 2-way trade $___bn AUD, ____% of Australia’s total trade",
    back: "China Australia 2-way trade $325bn AUD, 25% of Australia’s total trade",
  },

  // Industry
  {
    section: "Industry",
    front: "$____ billion spent on car manufacturing subsidies in the ___ years to _____",
    back: "$30 billion spent on car manufacturing subsidies in the 15 years to 2012",
  },
  {
    section: "Industry",
    front: "Last Holden car manufactured in _____",
    back: "Last Holden car manufactured in 2017",
  },

  // Exchange rates
  {
    section: "Exchange rates",
    front:
      "March 2021 AUD/USD exchange rate _ year high $____ USD matched with the first CAS in ___ years of ____%. As terms of trade fell __% reached a CAD of ____% with $____ USD per AUD",
    back: "March 2021 AUD/USD exchange rate 6 year high $0.77 USD matched with the first CAS in 44 years of 3.5%. As terms of trade fell 23% reached a CAD of 3.7% with $0.65 USD per AUD",
  },
  {
    section: "Exchange rates",
    front:
      "Peak conversion of $____ USD per AUD in ______ ____ after an increase of ____% in terms of trade in the previous decade reaching a __ year high– lead to Dutch Disease",
    back: "Peak conversion of $1.10 USD per AUD in May 2011 after an increase of 100% in terms of trade in the previous decade reaching a 50 year high– lead to Dutch Disease",
  },
  {
    section: "Exchange rates",
    front: "Trade surplus ____ ____ – ____ _____, peak 2022 ___%",
    back: "Trade surplus 2018 Mar – 2025 Dec, peak 2022 6.6%",
  },
  {
    section: "Exchange rates",
    front: "_____-____ BOGS surpluses",
    back: "2008-2011 BOGS surpluses",
  },

  // Global economy
  {
    section: "Global economy",
    front:
      "____ FDI was ___% of GWP, averaging ___% from ____ to ____, peaking at ____% in ____",
    back: "1990 FDI was 1.1% of GWP, averaging 2.3% from 1990 to 2025, peaking at 5.3% in 2007",
  },
  {
    section: "Global economy",
    front: "Developing economies receive __% of the US$___T global FDI",
    back: "Developing economies receive 55% of the US$1.6T global FDI",
  },
  {
    section: "Global economy",
    front: "____% of global employment being for global supply chains",
    back: "20.6% of global employment being for global supply chains",
  },
  {
    section: "Global economy",
    front: "____ Average tariff rate __%, currently _%",
    back: "1990 Average tariff rate 14%, currently 3%",
  },
  {
    section: "Global economy",
    front:
      "____ global exports was US$___T, __% of global output, grown to US$__T, now over __% of global output",
    back: "1990 global exports was US$4.3T, 19% of global output, grown to US$35T, now over 30% of global output",
  },
  {
    section: "Global economy",
    front: "GWP US$__T in ____, now US$____T in _____",
    back: "GWP US$23T in 1990, now US$120T in 2025",
  },
  {
    section: "Global economy",
    front: "Average global economic growth rate _% ____-____",
    back: "Average global economic growth rate 3% 1990-2025",
  },
  {
    section: "Global economy",
    front: "____ HDI .___, ____ .___, a ___% increase",
    back: "1990 HDI .601, 2023 .739, a 23% increase",
  },
  {
    section: "Global economy",
    front: "____ GINI ._, in ____ .__",
    back: "1990 GINI .7, in 2019 .62",
  },
  {
    section: "Global economy",
    front: "Global emissions in ____ were ___x times higher than ____ levels",
    back: "Global emissions in 2024 were 6.7x times higher than 1990 levels",
  },

  // Fiscal policy
  {
    section: "Fiscal policy",
    front:
      "__ out of the past __ years the government has been in deficit, with _ more forecasted",
    back: "16 out of the past 18 years the government has been in deficit, with 4 more forecasted",
  },
  {
    section: "Fiscal policy",
    front: "-___% budget deficit in ____",
    back: "-6.4% budget deficit in 2021",
  },

  // Protection
  {
    section: "Protection",
    front:
      "____ Australia productivity commission reports that a __% increase in global tariffs would lead to a fall of in a global recession with global output falling ___%",
    back: "2017 Australia productivity commission reports that a 15% increase in global tariffs would lead to a fall of in a global recession with global output falling 2.9%",
  },
  {
    section: "Protection",
    front:
      "____ Australia productivity commission reports that every US$_ increase in tariff revenue costs world income US$____",
    back: "2017 Australia productivity commission reports that every US$1 increase in tariff revenue costs world income US$1.18",
  },
  {
    section: "Protection",
    front:
      "In ____ China imposed an ____% tariff on barley resulted in the loss of A$___ m (____% fall) of barley exports",
    back: "In 2020 China imposed an 80.5% tariff on barley resulted in the loss of A$750m (62.5% fall) of barley exports",
  },
  {
    section: "Protection",
    front:
      "In ____ China imposed tariffs of up to ___% on Australian wine, leading to wine export volumes of A$___ bn falling to A$__ m",
    back: "In 2020 China imposed tariffs of up to 212% on Australian wine, leading to wine export volumes of A$1.2bn falling to A$16m",
  },
];

const SECTION_BLURBS: Record<string, string> = {
  "Economic growth": "Through-the-year growth, the long expansion, and COVID support.",
  Inflation: "CPI prints, the cash-rate climb, and the mining boom backdrop.",
  Unemployment: "COVID peak, recent prints, and the Treasury NAIRU.",
  "External stability": "CAD, NPY, NFD/NFL/NFE, BOGS, and debt servicing.",
  Superannuation: "The Super stock figure used across external and environment notes.",
  Environment: "Net zero, batteries, carbon pricing, and energy mix.",
  Trade: "Export mix, China shares, and the main FTA partners.",
  "Labour market": "How people are employed.",
  China: "Growth, GWP, FDI, poverty, emissions, and HDI/GINI.",
  Industry: "Car-manufacturing subsidies and the last Holden.",
  "Exchange rates": "AUD cycles, Dutch Disease, and BOGS surplus windows.",
  "Global economy": "FDI, trade, GWP, development, and emissions.",
  "Fiscal policy": "The run of budget deficits.",
  Protection: "Productivity Commission tariff findings and China trade restrictions.",
};

const counts = new Map<string, number>();

export const cards: StatCard[] = drafts.map((draft) => {
  const next = (counts.get(draft.section) ?? 0) + 1;
  counts.set(draft.section, next);
  return {
    id: `${slugify(draft.section)}-${next}`,
    section: draft.section,
    front: draft.front,
    back: draft.back,
  };
});

export const sectionOrder = [
  "Economic growth",
  "Inflation",
  "Unemployment",
  "External stability",
  "Superannuation",
  "Environment",
  "Trade",
  "Labour market",
  "China",
  "Industry",
  "Exchange rates",
  "Global economy",
  "Fiscal policy",
  "Protection",
];

export const practiseSet: StatSet = {
  slug: ALL_SLUG,
  title: "Practise again",
  description:
    "Every stat in one endless adaptive deck. Low-confidence and unseen cards come up more often.",
  cards,
  cardCount: cards.length,
};

export const sectionSets: StatSet[] = sectionOrder.map((section) => {
  const sectionCards = cards.filter((card) => card.section === section);
  return {
    slug: slugify(section),
    title: section,
    description: SECTION_BLURBS[section] ?? section,
    cards: sectionCards,
    cardCount: sectionCards.length,
  };
});

const sets: StatSet[] = [practiseSet, ...sectionSets];

export function getAllSets(): StatSetMeta[] {
  return sets.map(({ slug, title, description, cardCount }) => ({
    slug,
    title,
    description,
    cardCount,
  }));
}

export function getSetBySlug(slug: string): StatSet | undefined {
  return sets.find((set) => set.slug === slug);
}

export function getCardById(cardId: string): StatCard | undefined {
  return cards.find((card) => card.id === cardId);
}

export function everyFrontHasBack(source: StatCard[] = cards): boolean {
  return source.every(
    (card) =>
      card.front.trim().length > 0 &&
      card.front.includes("_") &&
      card.back.trim().length > 0 &&
      card.back !== card.front,
  );
}
