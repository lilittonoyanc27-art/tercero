export interface BilingualSentence {
  id: string;
  es: string;
  hy: string;
}

export interface DetailedSection {
  id: number;
  titleEs: string;
  titleHy: string;
  sentences: { es: string; hy: string }[];
  highlightWords?: { es: string; hy: string; explanationEs: string; explanationHy: string }[];
}

export interface VocabWord {
  id: number;
  es: string;
  hy: string;
  context?: string;
}

export interface ComparisonItem {
  id: number;
  feature: { es: string; hy: string };
  paleolithic: { es: string; hy: string };
  neolithic: { es: string; hy: string };
}

export interface ExamQA {
  id: number;
  questionEs: string;
  questionHy: string;
  answerEs: string;
  answerHy: string;
}

// Texto de la página Principal (Գլխավոր էջի տեքստ)
export const MAIN_PAGE_PARAGRAPHS: BilingualSentence[] = [
  {
    id: "main-1",
    es: "El Neolítico fue una etapa de la Prehistoria posterior al Paleolítico.",
    hy: "Նեոլիթը նախապատմության մի փուլ էր, որը հաջորդեց Պալեոլիթին։",
  },
  {
    id: "main-2",
    es: "Durante este periodo, los seres humanos aprendieron a cultivar plantas y domesticar animales. Por eso, dejaron de ser nómadas y se hicieron sedentarios.",
    hy: "Այս ժամանակաշրջանում մարդիկ սովորեցին բույսեր մշակել և կենդանիներ ընտելացնել։ Այդ պատճառով նրանք դադարեցին քոչվոր լինելուց և դարձան նստակյաց։",
  },
  {
    id: "main-3",
    es: "Comenzaron a vivir en aldeas y construyeron casas más estables. También utilizaban herramientas de piedra pulida.",
    hy: "Նրանք սկսեցին ապրել գյուղերում և կառուցեցին ավելի կայուն տներ։ Օգտագործում էին նաև հղկված քարե գործիքներ։",
  },
  {
    id: "main-4",
    es: "Además, desarrollaron la cerámica, el tejido y el intercambio de productos.",
    hy: "Բացի այդ, զարգացրին խեցեգործությունը, գործվածք պատրաստելը և ապրանքների փոխանակումը։",
  },
];

export const MAIN_PAGE_FULL_ES = `El Neolítico fue una etapa de la Prehistoria posterior al Paleolítico.

Durante este periodo, los seres humanos aprendieron a cultivar plantas y domesticar animales. Por eso, dejaron de ser nómadas y se hicieron sedentarios.

Comenzaron a vivir en aldeas y construyeron casas más estables. También utilizaban herramientas de piedra pulida.

Además, desarrollaron la cerámica, el tejido y el intercambio de productos.`;

export const MAIN_PAGE_FULL_HY = `Նեոլիթը նախապատմության մի փուլ էր, որը հաջորդեց Պալեոլիթին։

Այս ժամանակաշրջանում մարդիկ սովորեցին բույսեր մշակել և կենդանիներ ընտելացնել։ Այդ պատճառով նրանք դադարեցին քոչվոր լինելուց և դարձան նստակյաց։

Նրանք սկսեցին ապրել գյուղերում և կառուցեցին ավելի կայուն տներ։ Օգտագործում էին նաև հղկված քարե գործիքներ։

Բացի այդ, զարգացրին խեցեգործությունը, գործվածք պատրաստելը և ապրանքների փոխանակումը։`;

// Texto para contar (Տեքստ՝ պատմելու համար)
export const EXAM_STORY_PARAGRAPHS: BilingualSentence[] = [
  {
    id: "story-1",
    es: "El Neolítico fue una etapa de la Prehistoria que comenzó después del Paleolítico.",
    hy: "Նեոլիթը նախապատմության մի փուլ էր, որը սկսվեց Պալեոլիթից հետո։",
  },
  {
    id: "story-2",
    es: "Durante el Neolítico, la vida de los seres humanos cambió mucho. Uno de los cambios más importantes fue el descubrimiento de la agricultura y la ganadería.",
    hy: "Նեոլիթի ժամանակ մարդկանց կյանքը շատ փոխվեց։ Ամենակարևոր փոփոխություններից մեկը գյուղատնտեսության և անասնապահության զարգացումն էր։",
  },
  {
    id: "story-3",
    es: "Las personas empezaron a cultivar plantas y a domesticar animales. Gracias a esto, ya no dependían solamente de la caza, la pesca y la recolección.",
    hy: "Մարդիկ սկսեցին մշակել բույսեր և ընտելացնել կենդանիներին։ Դրա շնորհիվ նրանք այլևս կախված չէին միայն որսից, ձկնորսությունից և հավաքչությունից։",
  },
  {
    id: "story-4",
    es: "Como podían producir sus propios alimentos, dejaron de desplazarse constantemente y se hicieron sedentarios. Esto significa que comenzaron a vivir de forma permanente en un mismo lugar.",
    hy: "Քանի որ մարդիկ կարողանում էին ինքնուրույն սնունդ արտադրել, նրանք այլևս անընդհատ չէին տեղափոխվում և դարձան նստակյաց։ Դա նշանակում է, որ նրանք սկսեցին մշտապես ապրել նույն վայրում։",
  },
  {
    id: "story-5",
    es: "Los seres humanos construyeron aldeas y viviendas más estables. Vivían en comunidad y empezaron a organizar mejor sus actividades.",
    hy: "Մարդիկ կառուցեցին գյուղեր և ավելի կայուն բնակարաններ։ Նրանք ապրում էին համայնքներով և սկսեցին ավելի լավ կազմակերպել իրենց աշխատանքը։",
  },
  {
    id: "story-6",
    es: "También mejoraron sus herramientas. En el Neolítico se utilizaba piedra pulida, que permitía fabricar herramientas más resistentes y eficaces.",
    hy: "Նրանք նաև զարգացրին իրենց գործիքները։ Նեոլիթի ժամանակ օգտագործվում էր հղկված քար, որի միջոցով հնարավոր էր պատրաստել ավելի ամուր և արդյունավետ գործիքներ։",
  },
  {
    id: "story-7",
    es: "Además, aparecieron nuevas actividades, como la cerámica, el tejido y el almacenamiento de alimentos.",
    hy: "Բացի դրանից, զարգացան նոր զբաղմունքներ, օրինակ՝ խեցեգործությունը, գործվածք պատրաստելը և սննդի պահեստավորումը։",
  },
  {
    id: "story-8",
    es: "Gracias a la agricultura y la ganadería, algunas comunidades pudieron producir más alimentos de los que necesitaban. Esto favoreció el intercambio de productos entre diferentes grupos.",
    hy: "Գյուղատնտեսության և անասնապահության շնորհիվ որոշ համայնքներ կարողանում էին ավելի շատ սնունդ արտադրել, քան իրենց անհրաժեշտ էր։ Դա նպաստեց տարբեր խմբերի միջև ապրանքների փոխանակմանը։",
  },
  {
    id: "story-9",
    es: "En resumen, el Neolítico fue una etapa muy importante porque los seres humanos pasaron de ser nómadas a sedentarios, comenzaron a practicar la agricultura y la ganadería, construyeron aldeas y desarrollaron nuevas actividades.",
    hy: "Ամփոփելով՝ Նեոլիթը շատ կարևոր ժամանակաշրջան էր, որովհետև մարդիկ քոչվոր կյանքից անցան նստակյաց կյանքի, սկսեցին զբաղվել գյուղատնտեսությամբ և անասնապահությամբ, կառուցեցին գյուղեր և զարգացրին նոր զբաղմունքներ։",
  },
];

// Texto corto para responder (Կարճ տեքստ՝ պատասխանելու համար)
export const SHORT_EXAM_TEXT_PARAGRAPHS: BilingualSentence[] = [
  {
    id: "short-1",
    es: "El Neolítico fue una etapa de la Prehistoria después del Paleolítico. Durante este periodo, los seres humanos aprendieron a cultivar plantas y domesticar animales. Por eso, dejaron de ser nómadas y se hicieron sedentarios.",
    hy: "Նեոլիթը նախապատմության մի փուլ էր, որը հաջորդեց Պալեոլիթին։ Այս ժամանակաշրջանում մարդիկ սովորեցին բույսեր մշակել և կենդանիներ ընտելացնել։ Այդ պատճառով նրանք դադարեցին քոչվոր լինելուց և դարձան նստակյաց։",
  },
  {
    id: "short-2",
    es: "Empezaron a vivir en aldeas y construyeron casas más estables. También utilizaban herramientas de piedra pulida y desarrollaron la cerámica y el tejido.",
    hy: "Նրանք սկսեցին ապրել գյուղերում և կառուցել ավելի կայուն տներ։ Նաև օգտագործում էին հղկված քարե գործիքներ և զարգացրին խեցեգործությունն ու գործվածք պատրաստելը։",
  },
  {
    id: "short-3",
    es: "En resumen, los cambios más importantes del Neolítico fueron la agricultura, la ganadería, la vida sedentaria y la aparición de las aldeas.",
    hy: "Ամփոփելով՝ Նեոլիթի ամենակարևոր փոփոխություններն էին գյուղատնտեսությունը, անասնապահությունը, նստակյաց կյանքը և գյուղերի առաջացումը։",
  },
];

// Ultra-short summary to memorize (Resumen muy corto para memorizar / Շատ կարճ ամփոփում՝ հիշելու համար)
export const ULTRA_SHORT_SUMMARY: BilingualSentence = {
  id: "ultra-short-1",
  es: "En el Neolítico, los seres humanos aprendieron a cultivar plantas y domesticar animales. Se hicieron sedentarios y construyeron aldeas. Utilizaban herramientas de piedra pulida y desarrollaron la cerámica, el tejido y el intercambio de productos.",
  hy: "Նեոլիթի ժամանակ մարդիկ սովորեցին բույսեր մշակել և կենդանիներ ընտելացնել։ Նրանք դարձան նստակյաց և կառուցեցին գյուղեր։ Օգտագործում էին հղկված քարե գործիքներ և զարգացրին խեցեգործությունը, գործվածք պատրաստելը և ապրանքների փոխանակումը։",
};

// 13 Detailed Topics (Tema explicada en detalle / Թեման մանրամասն)
export const DETAILED_SECTIONS: DetailedSection[] = [
  {
    id: 1,
    titleEs: "1. ¿Qué es el Neolítico?",
    titleHy: "1. Ի՞նչ է Նեոլիթը։",
    sentences: [
      {
        es: "El Neolítico fue una etapa de la Prehistoria posterior al Paleolítico.",
        hy: "Նեոլիթը նախապատմության այն փուլն էր, որը հաջորդեց Պալեոլիթին։",
      },
      {
        es: "La palabra Neolítico significa aproximadamente “piedra nueva”.",
        hy: "«Նեոլիթ» բառը մոտավորապես նշանակում է «նոր քար»։",
      },
      {
        es: "Se llama así porque las personas comenzaron a utilizar herramientas de piedra pulida.",
        hy: "Այն այդպես է կոչվում, որովհետև մարդիկ սկսեցին օգտագործել հղկված քարից պատրաստված գործիքներ։",
      },
    ],
  },
  {
    id: 2,
    titleEs: "2. La agricultura",
    titleHy: "2. Գյուղատնտեսությունը",
    sentences: [
      {
        es: "Uno de los cambios más importantes fue el desarrollo de la agricultura.",
        hy: "Ամենակարևոր փոփոխություններից մեկը գյուղատնտեսության զարգացումն էր։",
      },
      {
        es: "Las personas comenzaron a sembrar y cultivar plantas.",
        hy: "Մարդիկ սկսեցին սերմանել և մշակել բույսեր։",
      },
      {
        es: "Cultivaban productos como cereales y otras plantas.",
        hy: "Նրանք մշակում էին հացահատիկ և այլ բույսեր։",
      },
      {
        es: "La agricultura permitió producir alimentos de una manera más regular.",
        hy: "Գյուղատնտեսությունը հնարավորություն տվեց ավելի կանոնավոր կերպով սնունդ արտադրել։",
      },
    ],
  },
  {
    id: 3,
    titleEs: "3. La ganadería",
    titleHy: "3. Անասնապահությունը",
    sentences: [
      {
        es: "Los seres humanos también comenzaron a domesticar animales.",
        hy: "Մարդիկ նաև սկսեցին ընտելացնել կենդանիներին։",
      },
      {
        es: "La domesticación significa criar y controlar animales para utilizarlos.",
        hy: "Ընտելացում նշանակում է կենդանիներ պահել և վերահսկել՝ տարբեր նպատակներով օգտագործելու համար։",
      },
      {
        es: "Los animales podían proporcionar carne, leche, pieles y otros productos.",
        hy: "Կենդանիները կարող էին տալ միս, կաթ, մորթի և այլ նյութեր։",
      },
    ],
    highlightWords: [
      {
        es: "agricultura",
        hy: "գյուղատնտեսություն",
        explanationEs: "cultivar plantas",
        explanationHy: "բույսեր մշակել",
      },
      {
        es: "ganadería",
        hy: "անասնապահություն",
        explanationEs: "criar animales",
        explanationHy: "կենդանիներ պահել և բուծել",
      },
      {
        es: "domesticar",
        hy: "ընտելացնել",
        explanationEs: "acostumbrar animales a vivir con las personas",
        explanationHy: "կենդանուն սովորեցնել ապրել մարդու կողքին",
      },
    ],
  },
  {
    id: 4,
    titleEs: "4. De nómadas a sedentarios",
    titleHy: "4. Քոչվորներից դեպի նստակյաց կյանք",
    sentences: [
      {
        es: "En el Paleolítico, los seres humanos eran principalmente nómadas.",
        hy: "Պալեոլիթի ժամանակ մարդիկ հիմնականում քոչվոր էին։",
      },
      {
        es: "En el Neolítico, se hicieron sedentarios.",
        hy: "Նեոլիթի ժամանակ նրանք դարձան նստակյաց։",
      },
      {
        es: "Ser sedentario significa vivir de manera permanente en un mismo lugar.",
        hy: "Նստակյաց լինել նշանակում է մշտապես ապրել նույն վայրում։",
      },
      {
        es: "Como cultivaban la tierra y cuidaban animales, necesitaban quedarse cerca de sus campos y rebaños.",
        hy: "Քանի որ նրանք մշակում էին հողը և խնամում կենդանիներին, պետք է մնային իրենց դաշտերի և հոտերի մոտ։",
      },
    ],
  },
  {
    id: 5,
    titleEs: "5. Las aldeas",
    titleHy: "5. Գյուղերը",
    sentences: [
      {
        es: "Al hacerse sedentarios, los seres humanos comenzaron a construir aldeas.",
        hy: "Նստակյաց դառնալով՝ մարդիկ սկսեցին գյուղեր կառուցել։",
      },
      {
        es: "Las aldeas estaban formadas por varias viviendas.",
        hy: "Գյուղերը կազմված էին մի քանի բնակարաններից։",
      },
      {
        es: "Las personas vivían juntas y colaboraban.",
        hy: "Մարդիկ ապրում էին միասին և համագործակցում էին։",
      },
      {
        es: "Esto permitió formar comunidades más estables.",
        hy: "Դա հնարավորություն տվեց ստեղծել ավելի կայուն համայնքներ։",
      },
    ],
  },
  {
    id: 6,
    titleEs: "6. Las viviendas",
    titleHy: "6. Բնակարանները",
    sentences: [
      {
        es: "Las viviendas eran más estables que en el Paleolítico.",
        hy: "Բնակարաններն ավելի կայուն էին, քան Պալեոլիթի ժամանակ։",
      },
      {
        es: "Se podían construir con barro, madera, piedra y otros materiales.",
        hy: "Դրանք կարող էին կառուցվել կավից, փայտից, քարից և այլ նյութերից։",
      },
      {
        es: "Como las personas vivían en un mismo lugar durante mucho tiempo, las casas eran más permanentes.",
        hy: "Քանի որ մարդիկ երկար ժամանակ ապրում էին նույն վայրում, տներն ավելի մշտական էին։",
      },
    ],
  },
  {
    id: 7,
    titleEs: "7. Las herramientas de piedra pulida",
    titleHy: "7. Հղկված քարե գործիքները",
    sentences: [
      {
        es: "Durante el Neolítico se desarrollaron herramientas de piedra pulida.",
        hy: "Նեոլիթի ժամանակ զարգացան հղկված քարից գործիքները։",
      },
      {
        es: "Estas herramientas eran más resistentes y eficaces que muchas herramientas anteriores.",
        hy: "Այս գործիքներն ավելի ամուր և արդյունավետ էին, քան նախորդ ժամանակաշրջանի շատ գործիքներ։",
      },
      {
        es: "Se utilizaban para trabajar la tierra, cortar madera y realizar otras actividades.",
        hy: "Դրանք օգտագործվում էին հող մշակելու, փայտ կտրելու և այլ աշխատանքների համար։",
      },
    ],
  },
  {
    id: 8,
    titleEs: "8. La cerámica",
    titleHy: "8. Խեցեգործությունը",
    sentences: [
      {
        es: "En el Neolítico se desarrolló la cerámica.",
        hy: "Նեոլիթի ժամանակ զարգացավ խեցեգործությունը։",
      },
      {
        es: "Las personas fabricaban recipientes de barro.",
        hy: "Մարդիկ կավից պատրաստում էին տարաներ։",
      },
      {
        es: "Estos recipientes servían para guardar agua, alimentos y semillas.",
        hy: "Այդ տարաներն օգտագործվում էին ջուր, սնունդ և սերմեր պահելու համար։",
      },
    ],
  },
  {
    id: 9,
    titleEs: "9. El tejido",
    titleHy: "9. Գործվածք պատրաստելը",
    sentences: [
      {
        es: "También apareció y se desarrolló el tejido.",
        hy: "Զարգացավ նաև գործվածք պատրաստելը։",
      },
      {
        es: "Las personas podían fabricar telas y ropa utilizando fibras vegetales o lana.",
        hy: "Մարդիկ կարող էին պատրաստել կտոր և հագուստ՝ օգտագործելով բուսական մանրաթելեր կամ բուրդ։",
      },
    ],
  },
  {
    id: 10,
    titleEs: "10. El almacenamiento de alimentos",
    titleHy: "10. Սննդի պահեստավորումը",
    sentences: [
      {
        es: "La agricultura permitió producir más alimentos.",
        hy: "Գյուղատնտեսությունը հնարավորություն տվեց ավելի շատ սնունդ արտադրել։",
      },
      {
        es: "Parte de esos alimentos podía guardarse para utilizarlos más tarde.",
        hy: "Այդ սննդի մի մասը կարելի էր պահել և ավելի ուշ օգտագործել։",
      },
      {
        es: "Esto fue importante porque ayudaba a las comunidades a sobrevivir en épocas difíciles.",
        hy: "Դա կարևոր էր, որովհետև օգնում էր համայնքներին գոյատևել դժվար ժամանակներում։",
      },
    ],
  },
  {
    id: 11,
    titleEs: "11. El intercambio",
    titleHy: "11. Փոխանակումը",
    sentences: [
      {
        es: "Cuando una comunidad tenía productos de sobra, podía intercambiarlos con otras comunidades.",
        hy: "Երբ որևէ համայնք ուներ ավելցուկային արտադրանք, այն կարող էր փոխանակել այն ուրիշ համայնքների հետ։",
      },
      {
        es: "Este intercambio fue una forma sencilla de comercio.",
        hy: "Այս փոխանակումը առևտրի պարզ ձև էր։",
      },
      {
        es: "Por ejemplo, podían intercambiar alimentos, herramientas o materiales.",
        hy: "Օրինակ՝ կարող էին փոխանակել սնունդ, գործիքներ կամ նյութեր։",
      },
    ],
  },
  {
    id: 12,
    titleEs: "12. La sociedad neolítica",
    titleHy: "12. Նեոլիթյան հասարակությունը",
    sentences: [
      {
        es: "Las comunidades se hicieron más grandes y organizadas.",
        hy: "Համայնքները դարձան ավելի մեծ և կազմակերպված։",
      },
      {
        es: "Algunas personas cultivaban, otras cuidaban animales y otras fabricaban herramientas o cerámica.",
        hy: "Որոշ մարդիկ զբաղվում էին հողագործությամբ, մյուսները խնամում էին կենդանիներին, իսկ ուրիշները պատրաստում էին գործիքներ կամ խեցեղեն։",
      },
      {
        es: "Poco a poco apareció una mayor división del trabajo.",
        hy: "Աստիճանաբար առաջացավ աշխատանքի ավելի մեծ բաժանում։",
      },
    ],
  },
  {
    id: 13,
    titleEs: "13. Diferencia entre Paleolítico y Neolítico",
    titleHy: "13. Պալեոլիթի և Նեոլիթի տարբերությունը",
    sentences: [
      {
        es: "En el Paleolítico los seres humanos eran nómadas y vivían de la caza, pesca y recolección. En el Neolítico se hicieron sedentarios y desarrollaron la agricultura y la ganadería.",
        hy: "Պալեոլիթում մարդիկ քոչվոր էին և ապրում էին որսորդությամբ, ձկնորսությամբ ու հավաքչությամբ։ Նեոլիթում նրանք դարձան նստակյաց և զարգացրին գյուղատնտեսությունն ու անասնապահությունը։",
      },
    ],
  },
];

// Comparison table between Paleolithic and Neolithic
export const COMPARISON_ROWS: ComparisonItem[] = [
  {
    id: 1,
    feature: { es: "Modo de vida", hy: "Կենսակերպ" },
    paleolithic: { es: "Nómadas", hy: "Քոչվոր" },
    neolithic: { es: "Sedentarios", hy: "Նստակյաց" },
  },
  {
    id: 2,
    feature: { es: "Obtención de alimentos", hy: "Սննդի հայթայթում" },
    paleolithic: { es: "Caza, pesca y recolección", hy: "Որս, ձկնորսություն, հավաքչություն" },
    neolithic: { es: "Agricultura y ganadería", hy: "Գյուղատնտեսություն և անասնապահություն" },
  },
  {
    id: 3,
    feature: { es: "Tipo de herramientas", hy: "Գործիքների տեսակ" },
    paleolithic: { es: "Piedra tallada", hy: "Կոպիտ մշակված քար" },
    neolithic: { es: "Piedra pulida", hy: "Հղկված քար" },
  },
  {
    id: 4,
    feature: { es: "Viviendas y refugios", hy: "Բնակարաններ և ապաստարաններ" },
    paleolithic: { es: "Cuevas y refugios", hy: "Քարանձավներ և ապաստարաններ" },
    neolithic: { es: "Aldeas y casas", hy: "Գյուղեր և տներ" },
  },
];

// 20 Vocabulary words
export const VOCABULARY_LIST: VocabWord[] = [
  { id: 1, es: "Neolítico", hy: "Նեոլիթ" },
  { id: 2, es: "sedentario", hy: "նստակյաց" },
  { id: 3, es: "agricultura", hy: "գյուղատնտեսություն" },
  { id: 4, es: "ganadería", hy: "անասնապահություն" },
  { id: 5, es: "cultivar", hy: "մշակել" },
  { id: 6, es: "sembrar", hy: "սերմանել" },
  { id: 7, es: "domesticar", hy: "ընտելացնել" },
  { id: 8, es: "aldea", hy: "գյուղ" },
  { id: 9, es: "vivienda", hy: "բնակարան" },
  { id: 10, es: "piedra pulida", hy: "հղկված քար" },
  { id: 11, es: "cerámica", hy: "խեցեգործություն" },
  { id: 12, es: "barro", hy: "կավ" },
  { id: 13, es: "tejido", hy: "գործվածք" },
  { id: 14, es: "lana", hy: "բուրդ" },
  { id: 15, es: "almacenar", hy: "պահեստավորել" },
  { id: 16, es: "intercambio", hy: "փոխանակում" },
  { id: 17, es: "comunidad", hy: "համայնք" },
  { id: 18, es: "alimentos", hy: "սնունդ" },
  { id: 19, es: "herramientas", hy: "գործիքներ" },
  { id: 20, es: "animales domésticos", hy: "ընտանի կենդանիներ" },
];

// All 20 Questions & Answers for exam practice
export const EXAM_QA_LIST: ExamQA[] = [
  {
    id: 1,
    questionEs: "¿Qué fue el Neolítico?",
    questionHy: "Ի՞նչ էր Նեոլիթը։",
    answerEs: "Fue una etapa de la Prehistoria posterior al Paleolítico.",
    answerHy: "Դա նախապատմության մի փուլ էր, որը հաջորդեց Պալեոլիթին։",
  },
  {
    id: 2,
    questionEs: "¿Qué significa Neolítico?",
    questionHy: "Ի՞նչ է նշանակում Նեոլիթ։",
    answerEs: "Significa aproximadamente “piedra nueva”.",
    answerHy: "Այն մոտավորապես նշանակում է «նոր քար»։",
  },
  {
    id: 3,
    questionEs: "¿Cuál fue uno de los cambios más importantes del Neolítico?",
    questionHy: "Ո՞րն էր Նեոլիթի ամենակարևոր փոփոխություններից մեկը։",
    answerEs: "El desarrollo de la agricultura y la ganadería.",
    answerHy: "Գյուղատնտեսության և անասնապահության զարգացումը։",
  },
  {
    id: 4,
    questionEs: "¿Qué es la agricultura?",
    questionHy: "Ի՞նչ է գյուղատնտեսությունը։",
    answerEs: "Es el cultivo de plantas para producir alimentos.",
    answerHy: "Դա բույսերի մշակումն է՝ սնունդ արտադրելու համար։",
  },
  {
    id: 5,
    questionEs: "¿Qué es la ganadería?",
    questionHy: "Ի՞նչ է անասնապահությունը։",
    answerEs: "Es la cría de animales.",
    answerHy: "Դա կենդանիների պահումն ու բուծումն է։",
  },
  {
    id: 6,
    questionEs: "¿Qué significa domesticar animales?",
    questionHy: "Ի՞նչ է նշանակում կենդանիներին ընտելացնել։",
    answerEs: "Significa criar y controlar animales para utilizarlos.",
    answerHy: "Դա նշանակում է կենդանիներ պահել և վերահսկել՝ տարբեր նպատակներով օգտագործելու համար։",
  },
  {
    id: 7,
    questionEs: "¿Los seres humanos del Neolítico eran nómadas o sedentarios?",
    questionHy: "Նեոլիթի մարդիկ քոչվո՞ր էին, թե՞ նստակյաց։",
    answerEs: "Eran sedentarios.",
    answerHy: "Նրանք նստակյաց էին։",
  },
  {
    id: 8,
    questionEs: "¿Qué significa ser sedentario?",
    questionHy: "Ի՞նչ է նշանակում նստակյաց լինել։",
    answerEs: "Significa vivir permanentemente en un mismo lugar.",
    answerHy: "Դա նշանակում է մշտապես ապրել նույն վայրում։",
  },
  {
    id: 9,
    questionEs: "¿Por qué se hicieron sedentarios?",
    questionHy: "Ինչո՞ւ նրանք դարձան նստակյաց։",
    answerEs: "Porque cultivaban la tierra y cuidaban animales.",
    answerHy: "Որովհետև նրանք մշակում էին հողը և խնամում կենդանիներին։",
  },
  {
    id: 10,
    questionEs: "¿Dónde vivían?",
    questionHy: "Որտե՞ղ էին ապրում։",
    answerEs: "Vivían en aldeas.",
    answerHy: "Նրանք ապրում էին գյուղերում։",
  },
  {
    id: 11,
    questionEs: "¿Cómo eran las herramientas del Neolítico?",
    questionHy: "Ինչպիսի՞ն էին Նեոլիթի գործիքները։",
    answerEs: "Muchas eran de piedra pulida.",
    answerHy: "Դրանցից շատերը պատրաստված էին հղկված քարից։",
  },
  {
    id: 12,
    questionEs: "¿Qué nuevas actividades aparecieron?",
    questionHy: "Ի՞նչ նոր զբաղմունքներ առաջացան։",
    answerEs: "La cerámica, el tejido y el almacenamiento de alimentos.",
    answerHy: "Խեցեգործությունը, գործվածք պատրաստելը և սննդի պահեստավորումը։",
  },
  {
    id: 13,
    questionEs: "¿Para qué servía la cerámica?",
    questionHy: "Ինչի՞ համար էր օգտագործվում խեցեղենը։",
    answerEs: "Para guardar agua, alimentos y semillas.",
    answerHy: "Ջուր, սնունդ և սերմեր պահելու համար։",
  },
  {
    id: 14,
    questionEs: "¿Qué materiales utilizaban para construir viviendas?",
    questionHy: "Ի՞նչ նյութեր էին օգտագործում բնակարաններ կառուցելու համար։",
    answerEs: "Barro, madera, piedra y otros materiales naturales.",
    answerHy: "Կավ, փայտ, քար և այլ բնական նյութեր։",
  },
  {
    id: 15,
    questionEs: "¿Por qué fue importante almacenar alimentos?",
    questionHy: "Ինչո՞ւ էր կարևոր սնունդ պահեստավորելը։",
    answerEs: "Porque permitía guardar comida para utilizarla más tarde.",
    answerHy: "Որովհետև դա հնարավորություն էր տալիս սնունդ պահել և օգտագործել ավելի ուշ։",
  },
  {
    id: 16,
    questionEs: "¿Qué es el intercambio?",
    questionHy: "Ի՞նչ է փոխանակումը։",
    answerEs: "Es cambiar unos productos por otros.",
    answerHy: "Դա մի ապրանքը մյուսով փոխելն է։",
  },
  {
    id: 17,
    questionEs: "¿Cuál es la principal diferencia entre el Paleolítico y el Neolítico?",
    questionHy: "Ո՞րն է Պալեոլիթի և Նեոլիթի հիմնական տարբերությունը։",
    answerEs: "En el Paleolítico eran nómadas y en el Neolítico se hicieron sedentarios y productores de alimentos.",
    answerHy: "Պալեոլիթում մարդիկ քոչվոր էին, իսկ Նեոլիթում դարձան նստակյաց և սկսեցին սնունդ արտադրել։",
  },
  {
    id: 18,
    questionEs: "¿De qué vivían principalmente en el Neolítico?",
    questionHy: "Ինչո՞վ էին հիմնականում ապրում Նեոլիթի ժամանակ։",
    answerEs: "De la agricultura y la ganadería.",
    answerHy: "Գյուղատնտեսությամբ և անասնապահությամբ։",
  },
  {
    id: 19,
    questionEs: "¿Por qué aparecieron las aldeas?",
    questionHy: "Ինչո՞ւ առաջացան գյուղերը։",
    answerEs: "Porque las personas empezaron a vivir permanentemente en un mismo lugar.",
    answerHy: "Որովհետև մարդիկ սկսեցին մշտապես ապրել նույն վայրում։",
  },
  {
    id: 20,
    questionEs: "Nombra cuatro características del Neolítico.",
    questionHy: "Նշի՛ր Նեոլիթի չորս հատկանիշ։",
    answerEs: "Agricultura, ganadería, vida sedentaria y aldeas.",
    answerHy: "Գյուղատնտեսություն, անասնապահություն, նստակյաց կյանք և գյուղեր։",
  },
];
