import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    pt: {
      translation: {
        dashboard: "Dashboard",
        users: "Utilizadores",
        logout: "Sair",
        login: "Entrar",
        headerTitle: "Mobilidade Académica",
        headerSubtitle: "DASHBOARD PÚBLICO",
        title:"Dashboard de Mobilidade",
        subtitle:"Dados públicos consolidados - Visitante",
        card1:"TOTAL DE MOBILIDADES",
        card2:"ESTUDANTES ENVIADOS",
        card3:"ESTUDANTES RECEBIDOS",
        card4:"ANO COM MAIOR MOBILIDADE",
        graphic:"Tendência de Mobilidade por Ano",
        indicator1:"MÉDIA DE MOBILIDADE/ANO",
        indicator2:"UNIVERSIDADES PARTICIPANTES",
        indicator3:"PAÍSES ENVOLVIDOS"
      },
    },
  
    en: {
      translation: {
        dashboard: "Dashboard",
        users: "Users",
        logout: "Logout",
        login: "Login",
        headerTitle:"Academic Mobility",
        headerSubtitle: "PUBLIC DASHBOARD",
        title:"Mobility Dashboard",
        subtitle:"Consolidated public data - Visitor",
        card1:"TOTAL MOBILITIES",
        card2:"STUDENTS SENT",
        card3:"STUDENTS RECEIVED",
        card4:"YEAR WITH THE MOST MOBILITY",
        graphic:"Mobility Trend by Year",
        indicator1:"AVERAGE MOBILITY/YEAR",
        indicator2:"PARTICIPATING UNIVERSITIES",
        indicator3:"COUNTRIES INVOLVED"
      },
    },
  },

  lng: "pt",
  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;