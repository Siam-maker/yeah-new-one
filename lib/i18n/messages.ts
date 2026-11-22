import type { Locale } from "./routing";

const navPaths = ["/","/explore","/learn","/topics","/stories","/lab","/world","/atlas","/demographics","/journeys","/connections","/glossary","/library","/about","/field-notes","/search","/learn/teaching"] as const;
type Nav = { [Key in (typeof navPaths)[number]]: string };
type UI = {
  language: string; index: string; open: string; close: string; skip: string; coverage: string;
  original: string; searchTitle: string; searchPlaceholder: string; all: string; type: string;
  difficulty: string; anyLevel: string; empty: string; more: string; recent: string; results: string; searchPage: string;
  loading: string; searchError: string;
};
type Landing = {headline: string; intro: string; courses: string; orientation: string; method: string; resourceIntro: string};
type MessageSet = { nav: Nav; ui: UI; page: Landing; subjects: [string,string,string,string,string,string,string] };

const labels = ["language","index","open","close","skip","coverage","original","searchTitle","searchPlaceholder","all","type","difficulty","anyLevel","empty","more","recent","results","searchPage","loading","searchError"] as const;
const landingFields = ["headline","intro","courses","orientation","method","resourceIntro"] as const;
function message(nav: string[], ui: string[], page: string[], subjects: MessageSet["subjects"]): MessageSet {
  return {
    nav:Object.fromEntries(navPaths.map((path,i) => [path,nav[i]])) as Nav,
    ui:Object.fromEntries(labels.map((key,i) => [key,ui[i]])) as UI,
    page:Object.fromEntries(landingFields.map((key,i) => [key,page[i]])) as Landing,
    subjects,
  };
}

export const messages: Record<Locale,MessageSet> = {
  en:message(
    ["Home","Explore","Learn","Topics","Journal","Lab","3D World","Atlas","Demographics","Journeys","Connections","Glossary","Reading desk","About","Field notes","Search","Teaching resources"],
    ["Language","Index","Open navigation","Close navigation","Skip to content","Navigation and entry guides are available in this language. Full articles, courses and tools are available in their original English.","Open the English original","Search Under the Surface","Try oceans, ice, or a country","All content","Content type","Difficulty","All levels","No matching results. Try a broader term or change your filters.","Load more results","Recent searches","Results","Open the search page","Loading the publication index…","The index could not load. Try the search page."],
    ["Discover the world beneath.","Explore the hidden systems shaping our planet and universe through science, interactive 3D experiences, real-world data, visual stories and experiments.","Guided science courses","Start with a question","What did you measure directly? What did you infer? A scientific explanation becomes easier to test when you separate the observation from the conclusion.","Pick a subject to read its introduction, then follow the original course to the experiments, evidence, and source links."],
    ["Ocean & marine science","Earth science & geology","Climate & atmosphere","Biodiversity & evolution","Space & astronomy","Population & demographics","Interdisciplinary science"]),
  bn:message(
    ["প্রচ্ছদ","অন্বেষণ","শিখুন","বিষয়সমূহ","জার্নাল","পরীক্ষাগার","ত্রিমাত্রিক জগৎ","অ্যাটলাস","জনমিতি","নির্দেশিত অভিযান","জ্ঞানের সংযোগ","পরিভাষা","পাঠের তালিকা","পরিচিতি","মাঠের নোট","খুঁজুন","শিক্ষকদের উপকরণ"],
    ["ভাষা","সূচি","সূচি খুলুন","সূচি বন্ধ করুন","মূল বিষয়বস্তুতে যান","এই ভাষায় সূচি ও প্রাথমিক নির্দেশিকা আছে। পূর্ণাঙ্গ নিবন্ধ, পাঠক্রম ও পরীক্ষাগুলো মূল ইংরেজিতে পাওয়া যায়।","মূল ইংরেজি সংস্করণ খুলুন","Under the Surface-এ খুঁজুন","সমুদ্র, বরফ বা কোনো দেশ লিখুন","সব বিষয়বস্তু","বিষয়বস্তুর ধরন","কঠিনতার স্তর","সব স্তর","কিছু পাওয়া যায়নি। অন্য শব্দ ব্যবহার করুন বা বাছাই বদলান।","আরও ফলাফল দেখুন","আগের অনুসন্ধান","ফলাফল","অনুসন্ধান পাতা খুলুন","অনুসন্ধানের সূচি লোড হচ্ছে…","সূচি লোড হয়নি। অনুসন্ধান পাতা ব্যবহার করুন।"],
    ["পৃথিবী ও মহাবিশ্বকে জানুন","বিজ্ঞানের গল্প পড়ুন, বাস্তব তথ্যের মানচিত্র দেখুন এবং ত্রিমাত্রিক মডেলে পরীক্ষা করে পৃথিবী ও মহাবিশ্বের আড়ালে কাজ করা প্রক্রিয়াগুলো বুঝুন।","নির্দেশিত বিজ্ঞান পাঠ","একটি প্রশ্ন দিয়ে শুরু করুন","কোনটি সরাসরি মাপলেন আর কোনটি সেই মাপ থেকে অনুমান করলেন? পর্যবেক্ষণ ও সিদ্ধান্ত আলাদা করে লিখলে অন্যরা ব্যাখ্যাটিকে যাচাই করতে পারে।","একটি বিষয় বেছে নিন। পরিচিতি পড়ে মূল ইংরেজি পাঠে পরীক্ষা, তথ্য ও সূত্র দেখুন।"],
    ["সমুদ্র ও সামুদ্রিক বিজ্ঞান","পৃথিবীবিজ্ঞান ও ভূতত্ত্ব","জলবায়ু ও বায়ুমণ্ডল","জীববৈচিত্র্য ও বিবর্তন","মহাকাশ ও জ্যোতির্বিজ্ঞান","জনসংখ্যা ও জনমিতি","আন্তঃবিষয়ক বিজ্ঞান"]),
  es:message(
    ["Inicio","Explorar","Aprender","Disciplinas","Revista","Laboratorio","Mundo 3D","Atlas","Demografía","Expediciones","Conexiones","Glosario","Mesa de lectura","Acerca de","Notas de campo","Buscar","Recursos docentes"],
    ["Idioma","Índice","Abrir la navegación","Cerrar la navegación","Ir al contenido","La navegación y las guías iniciales están disponibles en español. Los artículos, cursos y herramientas completos se ofrecen en inglés.","Abrir el original en inglés","Buscar en Under the Surface","Prueba océano, hielo o un país","Todo el contenido","Tipo de contenido","Dificultad","Todos los niveles","Sin resultados. Prueba otro término o cambia los filtros.","Ver más resultados","Búsquedas recientes","Resultados","Abrir la página de búsqueda","Cargando el índice…","No se pudo cargar el índice. Prueba la página de búsqueda."],
    ["Descubre lo que hay debajo","Explora los sistemas que dan forma a la Tierra y al universo con historias científicas, datos reales, experimentos y modelos interactivos en 3D.","Cursos guiados de ciencia","Empieza con una pregunta","¿Qué mediste directamente? ¿Qué dedujiste? Separar la observación de la conclusión permite que otras personas pongan a prueba tu explicación.","Elige una disciplina. Lee la introducción y abre el curso original para consultar los experimentos y las fuentes."],
    ["Océano y ciencias marinas","Ciencias de la Tierra y geología","Clima y atmósfera","Biodiversidad y evolución","Espacio y astronomía","Población y demografía","Ciencia interdisciplinaria"]),
  fr:message(
    ["Accueil","Explorer","Apprendre","Disciplines","Revue","Laboratoire","Monde 3D","Atlas","Démographie","Expéditions","Connexions","Glossaire","Espace de lecture","À propos","Notes de terrain","Rechercher","Ressources pédagogiques"],
    ["Langue","Sommaire","Ouvrir la navigation","Fermer la navigation","Aller au contenu","La navigation et les guides d’introduction sont disponibles en français. Les articles, cours et outils complets restent accessibles en anglais.","Ouvrir la version originale en anglais","Rechercher dans Under the Surface","Essayez océan, glace ou un pays","Tous les contenus","Type de contenu","Difficulté","Tous les niveaux","Aucun résultat. Essayez un autre terme ou modifiez les filtres.","Voir plus de résultats","Recherches récentes","Résultats","Ouvrir la page de recherche","Chargement de l’index…","L’index est indisponible. Essayez la page de recherche."],
    ["Découvrez ce qui se cache sous la surface","Explorez les systèmes qui façonnent la Terre et l’univers grâce à des récits scientifiques, des données réelles, des expériences et des modèles interactifs en 3D.","Parcours scientifiques guidés","Commencez par une question","Qu’avez-vous mesuré directement ? Qu’en avez-vous déduit ? Distinguer l’observation de la conclusion permet à d’autres personnes de vérifier votre explication.","Choisissez une discipline. Lisez l’introduction, puis consultez les expériences et les sources dans le cours original."],
    ["Océan et sciences marines","Sciences de la Terre et géologie","Climat et atmosphère","Biodiversité et évolution","Espace et astronomie","Population et démographie","Sciences interdisciplinaires"]),
  de:message(
    ["Startseite","Entdecken","Lernen","Fachgebiete","Magazin","Labor","3D-Welt","Atlas","Demografie","Expeditionen","Zusammenhänge","Glossar","Leseliste","Über uns","Feldnotizen","Suchen","Unterrichtsmaterial"],
    ["Sprache","Inhalt","Navigation öffnen","Navigation schließen","Zum Inhalt","Navigation und Einstiegsseiten sind auf Deutsch verfügbar. Vollständige Artikel, Kurse und Werkzeuge gibt es im englischen Original.","Englisches Original öffnen","In Under the Surface suchen","Versuchen Sie Ozean, Eis oder ein Land","Alle Inhalte","Inhaltstyp","Schwierigkeit","Alle Stufen","Keine Treffer. Ändern Sie den Suchbegriff oder die Filter.","Weitere Ergebnisse","Letzte Suchanfragen","Ergebnisse","Suchseite öffnen","Suchindex wird geladen…","Der Index ist nicht verfügbar. Öffnen Sie die Suchseite."],
    ["Entdecken Sie die Welt unter der Oberfläche","Erkunden Sie die Systeme, die Erde und Universum formen, mit Wissenschaftsgeschichten, realen Daten, Experimenten und interaktiven 3D-Modellen.","Wissenschaftliche Lernpfade","Beginnen Sie mit einer Frage","Was wurde direkt gemessen? Was wurde daraus abgeleitet? Wenn Sie Beobachtung und Schlussfolgerung trennen, können andere Menschen Ihre Erklärung überprüfen.","Wählen Sie ein Fachgebiet. In der Einführung finden Sie den Weg zu Experimenten und Quellen im englischen Original."],
    ["Ozean- und Meereswissenschaften","Geowissenschaften und Geologie","Klima und Atmosphäre","Biodiversität und Evolution","Weltraum und Astronomie","Bevölkerung und Demografie","Fachübergreifende Wissenschaft"]),
  ar:message(
    ["الرئيسية","استكشف","تعلّم","التخصصات","المجلة","المختبر","عالم ثلاثي الأبعاد","الأطلس","علم السكان","رحلات موجهة","شبكة المعرفة","المصطلحات","قائمة القراءة","نبذة","ملاحظات ميدانية","ابحث","موارد للمعلمين"],
    ["اللغة","الفهرس","افتح قائمة التنقل","أغلق قائمة التنقل","انتقل إلى المحتوى","تتوفر واجهة التنقل والأدلة التمهيدية باللغة العربية. المقالات والدروس الكاملة والأدوات متاحة باللغة الإنجليزية الأصلية.","افتح النسخة الإنجليزية الأصلية","ابحث في Under the Surface","جرّب المحيط أو الجليد أو اسم بلد","كل المحتوى","نوع المحتوى","الصعوبة","جميع المستويات","لا توجد نتائج. جرّب عبارة أخرى أو غيّر عوامل التصفية.","عرض المزيد من النتائج","عمليات البحث الأخيرة","النتائج","افتح صفحة البحث","جارٍ تحميل فهرس البحث…","تعذّر تحميل الفهرس. جرّب صفحة البحث."],
    ["اكتشف ما تحت السطح","استكشف الأنظمة التي تشكّل كوكبنا والكون من خلال قصص علمية وبيانات حقيقية وتجارب ونماذج تفاعلية ثلاثية الأبعاد.","مسارات علمية موجهة","ابدأ بسؤال","ما الذي قسته مباشرةً؟ وما الذي استنتجته؟ يساعد الفصل بين الملاحظة والاستنتاج الآخرين على اختبار تفسيرك.","اختر تخصصًا واقرأ مقدمته، ثم افتح الدرس الأصلي للاطلاع على التجارب والأدلة والمصادر."],
    ["المحيطات وعلوم البحار","علوم الأرض والجيولوجيا","المناخ والغلاف الجوي","التنوع الحيوي والتطور","الفضاء وعلم الفلك","السكان والديموغرافيا","علوم متعددة التخصصات"]),
  hi:message(
    ["मुखपृष्ठ","खोजें","सीखें","विषय","पत्रिका","प्रयोगशाला","3D दुनिया","एटलस","जनसांख्यिकी","निर्देशित यात्राएँ","ज्ञान के संबंध","शब्दावली","पठन सूची","परिचय","क्षेत्रीय टिप्पणियाँ","खोज","शिक्षण संसाधन"],
    ["भाषा","सूची","नेविगेशन खोलें","नेविगेशन बंद करें","मुख्य सामग्री पर जाएँ","नेविगेशन और प्रारंभिक मार्गदर्शन हिन्दी में उपलब्ध हैं। पूरे लेख, पाठ्यक्रम और उपकरण मूल अंग्रेज़ी में उपलब्ध हैं।","मूल अंग्रेज़ी संस्करण खोलें","Under the Surface में खोजें","समुद्र, बर्फ़ या किसी देश को खोजें","सभी सामग्री","सामग्री का प्रकार","कठिनाई","सभी स्तर","कोई परिणाम नहीं मिला। दूसरा शब्द आज़माएँ या फ़िल्टर बदलें।","और परिणाम देखें","हाल की खोजें","परिणाम","खोज पृष्ठ खोलें","खोज सूची लोड हो रही है…","सूची लोड नहीं हुई। खोज पृष्ठ आज़माएँ।"],
    ["सतह के नीचे की दुनिया जानें","वैज्ञानिक कहानियों, वास्तविक आँकड़ों, प्रयोगों और इंटरैक्टिव 3D मॉडलों की मदद से पृथ्वी और ब्रह्मांड को आकार देने वाली प्रक्रियाओं को जानें।","निर्देशित विज्ञान पाठ्यक्रम","एक सवाल से शुरुआत करें","आपने सीधे क्या मापा? उससे क्या निष्कर्ष निकाला? अवलोकन और निष्कर्ष को अलग रखने से दूसरे लोग आपकी व्याख्या की जाँच कर सकते हैं।","एक विषय चुनें। परिचय पढ़कर प्रयोग, प्रमाण और स्रोत देखने के लिए मूल पाठ्यक्रम खोलें।"],
    ["समुद्र और समुद्री विज्ञान","पृथ्वी विज्ञान और भूविज्ञान","जलवायु और वायुमंडल","जैव विविधता और विकास","अंतरिक्ष और खगोल विज्ञान","जनसंख्या और जनसांख्यिकी","अंतर्विषयी विज्ञान"]),
  "zh-hans":message(
    ["首页","探索","学习","学科","杂志","实验室","三维世界","地图集","人口学","导览","知识关联","术语表","阅读清单","关于","实地笔记","搜索","教学资源"],
    ["语言","目录","打开导航","关闭导航","跳至正文","简体中文提供导航与入门指南。完整文章、课程和工具可通过英文原版查阅。","打开英文原版","搜索 Under the Surface","试试海洋、冰川或国家名称","全部内容","内容类型","难度","所有难度","未找到结果。请更换关键词或筛选条件。","加载更多结果","最近搜索","个结果","打开搜索页面","正在加载搜索索引…","索引加载失败，请打开搜索页面。"],
    ["探索表象之下的世界","通过科学故事、真实数据、实验与交互式三维模型，探索塑造地球和宇宙的系统。","科学导学课程","从一个问题开始","哪些信息是直接测量得到的？哪些是根据测量推断的？把观察和结论分开，别人就能更容易检验你的解释。","选择学科并阅读简介，再到原版课程中查看实验、证据和参考资料。"],
    ["海洋与海洋科学","地球科学与地质学","气候与大气","生物多样性与演化","太空与天文学","人口与人口学","跨学科科学"]),
  ja:message(
    ["ホーム","探検する","学ぶ","分野","科学誌","実験室","3Dの世界","地図帳","人口統計","ガイド付き探検","知識のつながり","用語集","読書リスト","このサイトについて","観察ノート","検索","教材"],
    ["言語","目次","ナビゲーションを開く","ナビゲーションを閉じる","本文へ移動","日本語で利用できるのはナビゲーションと入門ガイドです。記事、コース、ツールの全内容は英語の原版でご覧ください。","英語の原版を開く","Under the Surface を検索","海洋、氷、または国名を入力","すべてのコンテンツ","コンテンツの種類","難易度","すべてのレベル","該当する結果がありません。検索語や条件を変えてください。","さらに表示","最近の検索","件の結果","検索ページを開く","検索インデックスを読み込み中…","検索インデックスを読み込めません。検索ページをご利用ください。"],
    ["見えない世界を探る","科学の記事、実際のデータ、実験、操作できる3Dモデルを通して、地球と宇宙を形づくる仕組みを探りましょう。","ガイド付き科学コース","問いから始めよう","何を直接測り、何を推論しましたか。観測と結論を分けて書くと、ほかの人が説明を検証しやすくなります。","分野を選んで導入を読み、英語の原版コースで実験、証拠、出典を確認しましょう。"],
    ["海洋と海洋科学","地球科学と地質学","気候と大気","生物多様性と進化","宇宙と天文学","人口と人口統計","分野横断的な科学"]),
  pt:message(
    ["Início","Explorar","Aprender","Disciplinas","Revista","Laboratório","Mundo 3D","Atlas","Demografia","Expedições","Conexões","Glossário","Mesa de leitura","Sobre","Notas de campo","Buscar","Recursos didáticos"],
    ["Idioma","Índice","Abrir navegação","Fechar navegação","Ir para o conteúdo","A navegação e os guias introdutórios estão em português. Os artigos, cursos e ferramentas completos estão disponíveis no original em inglês.","Abrir o original em inglês","Buscar no Under the Surface","Experimente oceano, gelo ou um país","Todo o conteúdo","Tipo de conteúdo","Dificuldade","Todos os níveis","Nenhum resultado. Tente outro termo ou altere os filtros.","Mostrar mais resultados","Buscas recentes","Resultados","Abrir a página de busca","Carregando o índice…","Não foi possível carregar o índice. Tente a página de busca."],
    ["Descubra o que existe sob a superfície","Explore os sistemas que moldam a Terra e o universo por meio de histórias científicas, dados reais, experimentos e modelos interativos em 3D.","Cursos guiados de ciência","Comece com uma pergunta","O que você mediu diretamente? O que você inferiu? Separar a observação da conclusão ajuda outras pessoas a testar sua explicação.","Escolha uma disciplina. Leia a introdução e abra o curso original para consultar experimentos, evidências e fontes."],
    ["Oceano e ciências marinhas","Ciências da Terra e geologia","Clima e atmosfera","Biodiversidade e evolução","Espaço e astronomia","População e demografia","Ciência interdisciplinar"]),
};
