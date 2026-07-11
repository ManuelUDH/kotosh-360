import React, { createContext, useState, useContext } from 'react';

const translations = {
  es: {
    languageName: 'Español',
    voiceLang: 'es-PE',
    title: 'Kotosh 360',
    subtitle: 'Templo de las Manos Cruzadas',
    tryNow: 'Probar Ahora',
    aboutUsTitle: 'Quiénes Somos',
    aboutUsText: 'Somos un equipo interdisciplinario apasionado por la arqueología y la tecnología. Nuestra misión es digitalizar el patrimonio cultural del Perú para hacerlo accesible al mundo entero, utilizando modelado 3D e interfaces web inmersivas.',
    aboutProjTitle: '¿Qué es esta página?',
    aboutProjText: 'Kotosh 360 es un recorrido virtual interactivo por uno de los centros ceremoniales más antiguos de América (2000 a.C.). Podrás explorar el Templo de las Manos Cruzadas, escuchar a nuestros guías virtuales y aprender sobre nuestra historia pre-incaica.',
    selectLanguage: 'Seleccionar idioma:',
    guideExtTitle: 'Guía Arqueólogo',
    guideExtText: 'Bienvenidos al sitio arqueológico de Kotosh, en Huánuco, Perú. Este templo tiene más de cuatro mil años de antigüedad, siendo uno de los centros ceremoniales más antiguos de América. En esta plaza pública nos preparamos para subir por la escalera principal hacia el recinto sagrado. Los muros que ves a tu alrededor servían como andenes y divisiones de las áreas rituales. Te invito a subir las escaleras y explorar el templo principal.',
    guideIntTitle: 'Guía del Templo',
    guideIntText: 'Te encuentras en el interior del sagrado Templo de las Manos Cruzadas. Observa la pared del fondo. Allí descansan los famosos relieves de barro crudo de las Manos Cruzadas, que representan la dualidad del mundo andino. En el centro del templo hay un fogón hundido alimentado por ductos subterráneos de ventilación. Aquí los antiguos sacerdotes quemaban ofrendas sagradas mientras el humo purificaba el ambiente ceremonial.',
    speakingStatus: '🔊 Hablando… (Click para parar)',
    loginPlaceholder: 'Ingresa tu nombre de explorador...',
    loginBtn: 'Explorar',
    touristLabel: 'Turista:',
    exitBtn: 'Salir',
    backBtn: 'Volver al Inicio'
  },
  en: {
    languageName: 'English',
    voiceLang: 'en-US',
    title: 'Kotosh 360',
    subtitle: 'Temple of the Crossed Hands',
    tryNow: 'Try Now',
    aboutUsTitle: 'About Us',
    aboutUsText: 'We are an interdisciplinary team passionate about archaeology and technology. Our mission is to digitize Peru\'s cultural heritage to make it accessible worldwide, using 3D modeling and immersive web interfaces.',
    aboutProjTitle: 'What is this page?',
    aboutProjText: 'Kotosh 360 is an interactive virtual tour of one of the oldest ceremonial centers in the Americas (2000 BC). You can explore the Temple of the Crossed Hands, listen to our virtual guides, and learn about our pre-Inca history.',
    selectLanguage: 'Select language:',
    guideExtTitle: 'Archaeologist Guide',
    guideExtText: 'Welcome to the archaeological site of Kotosh, in Huánuco, Peru. This temple is more than four thousand years old, making it one of the oldest ceremonial centers in the Americas. In this public plaza, we prepare to ascend the main staircase to the sacred enclosure. The walls around you served as terraces and divisions for ritual areas. I invite you to climb the stairs and explore the main temple.',
    guideIntTitle: 'Temple Guide',
    guideIntText: 'You are inside the sacred Temple of the Crossed Hands. Look at the back wall. There rest the famous raw clay reliefs of the Crossed Hands, representing the duality of the Andean world. In the center of the temple is a sunken hearth fed by underground ventilation ducts. Here, ancient priests burned sacred offerings while the smoke purified the ceremonial environment.',
    speakingStatus: '🔊 Speaking… (Click to stop)',
    listenStatus: '▶ Click to listen',
    loginPlaceholder: 'Enter your explorer name...',
    loginBtn: 'Explore',
    touristLabel: 'Tourist:',
    exitBtn: 'Exit',
    backBtn: 'Back to Home'
  },
  pt: {
    languageName: 'Português',
    voiceLang: 'pt-BR',
    title: 'Kotosh 360',
    subtitle: 'Templo das Mãos Cruzadas',
    tryNow: 'Testar Agora',
    aboutUsTitle: 'Quem Somos',
    aboutUsText: 'Somos uma equipe interdisciplinar apaixonada por arqueologia e tecnologia. Nossa missão é digitalizar o patrimônio cultural do Peru para torná-lo acessível ao mundo inteiro, usando modelagem 3D e interfaces web imersivas.',
    aboutProjTitle: 'O que é esta página?',
    aboutProjText: 'Kotosh 360 é um tour virtual interativo por um dos centros cerimoniais mais antigos das Américas (2000 a.C.). Você poderá explorar o Templo das Mãos Cruzadas, ouvir nossos guias virtuais e aprender sobre nossa história pré-incaica.',
    selectLanguage: 'Selecionar idioma:',
    guideExtTitle: 'Guia Arqueólogo',
    guideExtText: 'Bem-vindos ao sítio arqueológico de Kotosh, em Huánuco, Peru. Este templo tem mais de quatro mil anos, sendo um dos centros cerimoniais mais antigos das Américas. Nesta praça pública, nos preparamos para subir a escadaria principal em direção ao recinto sagrado. Os muros ao seu redor serviam como terraços e divisões das áreas rituais. Convido você a subir as escadas e explorar o templo principal.',
    guideIntTitle: 'Guia do Templo',
    guideIntText: 'Você está no interior do sagrado Templo das Mãos Cruzadas. Observe a parede do fundo. Ali descansam os famosos relevos de barro cru das Mãos Cruzadas, que representam a dualidade do mundo andino. No centro do templo há uma fogueira rebaixada alimentada por dutos subterrâneos de ventilação. Aqui, os antigos sacerdotes queimavam oferendas sagradas enquanto a fumaça purificava o ambiente cerimonial.',
    speakingStatus: '🔊 Falando… (Clique para parar)',
    listenStatus: '▶ Clique para ouvir',
    loginPlaceholder: 'Digite seu nome de explorador...',
    loginBtn: 'Explorar',
    touristLabel: 'Turista:',
    exitBtn: 'Sair',
    backBtn: 'Voltar'
  },
  fr: {
    languageName: 'Français',
    voiceLang: 'fr-FR',
    title: 'Kotosh 360',
    subtitle: 'Temple des Mains Croisées',
    tryNow: 'Essayer Maintenant',
    aboutUsTitle: 'Qui sommes-nous',
    aboutUsText: 'Nous sommes une équipe interdisciplinaire passionnée par l\'archéologie et la technologie. Notre mission est de numériser le patrimoine culturel du Pérou pour le rendre accessible au monde entier, en utilisant la modélisation 3D et des interfaces web immersives.',
    aboutProjTitle: 'Qu\'est-ce que cette page ?',
    aboutProjText: 'Kotosh 360 est une visite virtuelle interactive de l\'un des plus anciens centres cérémoniels des Amériques (2000 av. J.-C.). Vous pourrez explorer le Temple des Mains Croisées, écouter nos guides virtuels et en apprendre davantage sur notre histoire pré-inca.',
    selectLanguage: 'Choisir la langue :',
    guideExtTitle: 'Guide Archéologue',
    guideExtText: 'Bienvenue sur le site archéologique de Kotosh, à Huánuco, au Pérou. Ce temple a plus de quatre mille ans et est l\'un des plus anciens centres cérémoniels des Amériques. Sur cette place publique, nous nous préparons à gravir l\'escalier principal vers l\'enceinte sacrée. Les murs autour de vous servaient de terrasses et de divisions pour les zones rituelles. Je vous invite à monter les escaliers et à explorer le temple principal.',
    guideIntTitle: 'Guide du Temple',
    guideIntText: 'Vous êtes à l\'intérieur du temple sacré des Mains Croisées. Regardez le mur du fond. Là reposent les célèbres reliefs en argile crue des Mains Croisées, qui représentent la dualité du monde andin. Au centre du temple se trouve un foyer en contrebas alimenté par des conduits de ventilation souterrains. Ici, les anciens prêtres brûlaient des offrandes sacrées tandis que la fumée purifiait l\'environnement cérémoniel.',
    speakingStatus: '🔊 Parle… (Cliquez pour arrêter)',
    listenStatus: '▶ Cliquez pour écouter',
    loginPlaceholder: 'Entrez votre nom d\'explorateur...',
    loginBtn: 'Explorer',
    touristLabel: 'Touriste:',
    exitBtn: 'Quitter',
    backBtn: 'Retour'
  },
  qu: {
    languageName: 'Quechua (Huánuco)',
    voiceLang: 'es-PE',
    title: 'Kotosh 360',
    subtitle: 'Chakatashqa Makikuna Templo',
    tryNow: 'Kanan Yaykuy',
    aboutUsTitle: 'Pikunataq Kaykäyä',
    aboutUsText: 'Nuqakunaqa unay yachaykunata maskaqkunam kaykäyä. Munayninäqa Perú markapa unay kawayninta internetchaw churaymi, llapan runa rikayänanpaq, 3D ruraykunawan.',
    aboutProjTitle: '¿Imataq kay raphi?',
    aboutProjText: 'Kotosh 360qa huk purikuymi, alläpa unay waka wasiman (2000 a.C.). Chakatashqa makikuna templuta rikayta puydinki, yachatsikuqkunata wiyaspa unay kawaynintsikta yachanki.',
    selectLanguage: 'Shimi akray:',
    guideExtTitle: 'Yachatsikuq',
    guideExtText: 'Alli chäyamuy Kotosh sumaq wasiman, Huánuco markachaw. Kay wakaqa chusku waranqa watayuqnam, Awya Yalachaw alläpa unay. Kay pampapitaqa ñawpaq patapatata wichaykurmi chäshun. Muyuriq pirqakunaqa andenkunanömi karqan. Shamu, wichay templuta rikanaykipaq.',
    guideIntTitle: 'Templuchaw Yachatsikuq',
    guideIntText: 'Chakatashqa Makikuna ukhunchawmi kaykanki. Qipa pirqata rikay. Tsaychawmi mitupita rurashqa chakatashqa makikuna kashqa. Chawpinpäqa huk uchku q\'uncham kaykan. Tsaychawmi unay yachaqkuna ofrendakunata rurayaq, q\'oshñina wasita pichaq.',
    speakingStatus: '🔊 Parlaykan… (Llapchay sayachinapaq)',
    listenStatus: '▶ Wiyay',
    loginPlaceholder: 'Shutikita qillqay...',
    loginBtn: 'Puriy',
    touristLabel: 'Puriq:',
    exitBtn: 'Yarqquy',
    backBtn: 'Kutiy'
  },
  ay: {
    languageName: 'Aymara',
    voiceLang: 'es-PE',
    title: 'Kotosh 360',
    subtitle: 'Cruzata Amparanakana Uta',
    tryNow: 'Jichha Yant\'aña',
    aboutUsTitle: 'Khitinakatansa',
    aboutUsText: 'Jiwasanakaqa arqueología ukat tecnología tuqit yatxatatanakawa. Amtäwisaqa Perú markan nayra sarnaqäwipa intirnit tuqi uñacht\'ayañawa, 3D ukanakawa.',
    aboutProjTitle: '¿Aka qamawixa kunasa?',
    aboutProjText: 'Kotosh 360 ukaxa mä uñacht\'äwiwa nayra utanakaru (2000 a.C.). Cruzata Amparanakana Utapa uñakipt\'añamawa, yatichirinakaru ist\'añamawa ukat nayra sarnaqäwita yatiqäta.',
    selectLanguage: 'Aru ajlliña:',
    guideExtTitle: 'Yatichiri',
    guideExtText: 'Kotosh markaruxa askikiy mantanim, Huánuco, Perú markana. Aka utaxa pusi waranqa maraniwa, Awya Yala tuqina juk\'amp nayrawa. Aka plaza ukanxa machaq gradasanakaruw mantapxta nayra utar mantsuñataki. Pirkax andenes ukat rituales ukatakiw kankatäna. Mantanim nayra uta uñakipt\'añataki.',
    guideIntTitle: 'Uta Yatichiri',
    guideIntText: 'Cruzat Amparanakana Uta manqhanktawa. Qhipa pirqa uñjam, ukanxa cruzat amparanaka utji, pacha kawsayaru amuyatapxiwa. Uta chawpina mä q\'uncha utji. Akana nayra yatirinakaxa luqtäwinaka nakhayapxäna, jiwakiw nakhaskäna.',
    speakingStatus: '🔊 Parlaskiwa… (Sayt\'ayañataki ch\'iqt\'am)',
    listenStatus: '▶ Ist\'aña',
    loginPlaceholder: 'Sutima qillqam...',
    loginBtn: 'Uñakipt\'aña',
    touristLabel: 'Tumuqi:',
    exitBtn: 'Mistuña',
    backBtn: 'Kutiña'
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('es'); // Default language

  const t = (key) => translations[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
